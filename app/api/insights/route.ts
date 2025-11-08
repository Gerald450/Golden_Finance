// app/api/insights/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin"; // Admin SDK

/* ---------------- Types ---------------- */
type SeriesRow = {
  date: string;        // "YYYY-MM-DD"
  sales?: number;      // dollars
  marginPct?: number;  // could be 0.43 or 43
  invTurn?: number;    // e.g., 2.1
  refundPct?: number;  // could be 0.02 or 2
};

type InsightRequest = {
  collection: "stores";
  storeId: string;
  dateFrom?: string;
  dateTo?: string;
  goal?: string; // optional
};

/* ---------------- Helpers ---------------- */
const TZ = "America/New_York";

function fmtYMD(d: Date, tz = TZ) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function toNum(v: any): number {
  if (v == null) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[,\s$]/g, ""));
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

// Normalize % fields that might be stored as fraction (0.43) or percent (43)
function normalizePercent(x: number): number {
  if (!Number.isFinite(x)) return 0;
  if (x <= 1 && x >= 0) return x * 100;  // treat as fraction → %
  return x;                               // already in %
}

function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}

function computeHealthScore(marginPct: number, refundPct: number, invTurn: number): number {
  const marginScore = clamp(marginPct);               // 0..100
  const refundScore = clamp(100 - refundPct);         // lower refunds better
  const turnoverScore = clamp((invTurn / 4) * 100);   // ~4x → 100
  return clamp(0.5 * marginScore + 0.3 * refundScore + 0.2 * turnoverScore);
}

async function fetchSeries(storeId: string): Promise<SeriesRow[]> {
  const ref = db.collection("stores").doc(storeId).collection("series");
  const snap = await ref.get();
  const rows: SeriesRow[] = [];
  snap.forEach((doc) => {
    const d = doc.data() as any;
    rows.push({
      date: String(d.date ?? ""),
      sales: toNum(d.sales),
      marginPct: toNum(d.marginPct),
      invTurn: toNum(d.invTurn),
      refundPct: toNum(d.refundPct),
    });
  });
  // sort by date ascending (YYYY-MM-DD lexicographic works)
  rows.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return rows;
}

function lastDefined<T>(arr: T[], pick: (x: T) => number | undefined): T | null {
  for (let i = arr.length - 1; i >= 0; i--) {
    const v = pick(arr[i]);
    if (v != null && Number.isFinite(Number(v))) return arr[i];
  }
  return null;
}

function buildSummary({
  periodLabel,
  sales,
  marginPct,
  refundPct,
  invTurn,
}: {
  periodLabel: string;
  sales: number;
  marginPct: number;
  refundPct: number;
  invTurn: number;
}) {
  const profit = sales * (marginPct / 100);
  // short, data-first, decision-oriented explanation
  return `In ${periodLabel}, sales were $${sales.toFixed(2)} with an estimated profit of $${profit.toFixed(
    2
  )} (margin ${marginPct.toFixed(2)}%). Refunds were ${refundPct.toFixed(
    2
  )}% and inventory turnover was ${invTurn.toFixed(
    2
  )}×. Sales indicate current demand, margin shows pricing/cost control, refunds reflect customer satisfaction, and turnover shows how quickly stock sells—together these guide whether to invest, maintain, or pause.`;
}

/* ---------------- Route ---------------- */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as InsightRequest;
    if (body.collection !== "stores") {
      return NextResponse.json({ error: "Use collection: 'stores'." }, { status: 400 });
    }
    if (!body.storeId) {
      return NextResponse.json({ error: "Missing 'storeId'." }, { status: 400 });
    }

    // 1) Load series and pick the latest usable row
    const series = await fetchSeries(body.storeId);
    if (!series.length) {
      return NextResponse.json({
        ok: true,
        metrics: null,
        healthScore: null,
        recommendation: "No data available. Add at least one day's metrics.",
        summary: "No metrics found for this store.",
      });
    }

    const latest = lastDefined(series, (r) => r.sales ?? r.marginPct ?? r.invTurn ?? r.refundPct) ?? series[series.length - 1];

    // 2) Normalize and build metrics
    const rawSales = toNum(latest.sales);
    const pctMargin = normalizePercent(toNum(latest.marginPct));
    const pctRefund = normalizePercent(toNum(latest.refundPct));
    const invTurn = toNum(latest.invTurn);

    const periodLabel = latest.date || fmtYMD(new Date(), TZ);

    const metrics = {
      periodLabel,
      sales: rawSales,
      marginPct: pctMargin,
      refundPct: pctRefund,
      invTurn,
      investedCum: 0, // optional; fill if you track it
    };

    // 3) Health score
    const healthScore = computeHealthScore(pctMargin, pctRefund, invTurn);

    // 4) Build human summary (data + what it means)
    const summary = buildSummary(metrics);

    // 5) AI recommendation (OpenRouter if available; rule-based fallback)
    let recommendation = "";
    const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;

    if (hasOpenRouter) {
      const user = {
        task:
          body.goal ??
          "Write ONE short, decisive recommendation (2 sentences max) using the metrics provided. Conclude with 'Invest', 'Maintain', or 'Pause'.",
        storeId: body.storeId,
        metrics,
        healthScore,
        rules: [
          "If Health >= 75 → bias toward Invest (expand inventory/marketing modestly).",
          "If 50–74 → Maintain with one low-risk experiment (price, promo, or SKU focus).",
          "If < 50 → Pause new investment and fix the largest issue (costs, returns, or slow stock).",
          "Be concrete and reference at least one metric (e.g., margin, refunds, or turnover).",
        ],
      };

      const payload = {
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: "Respond with a single plain-text recommendation. No JSON." },
          { role: "user", content: JSON.stringify(user) },
        ],
        temperature: 0.25,
        max_tokens: 120,
      };

      const headers: Record<string, string> = {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
        "Content-Type": "application/json",
      };
      if (process.env.OPENROUTER_SITE_URL) headers["HTTP-Referer"] = process.env.OPENROUTER_SITE_URL;
      if (process.env.OPENROUTER_APP_TITLE) headers["X-Title"] = process.env.OPENROUTER_APP_TITLE;

      try {
        const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
        if (r.ok) {
          const data = await r.json();
          recommendation = (data?.choices?.[0]?.message?.content ?? "").trim();
        }
      } catch {
        // fall through to rule-based
      }
    }

    // Rule-based fallback if AI missing or failed
    if (!recommendation) {
      if (healthScore >= 75) {
        recommendation =
          "Strong performance (high margin/low refunds). Invest modestly in inventory or marketing and track weekend results. Decision: Invest.";
      } else if (healthScore >= 50) {
        recommendation =
          "Stable but mixed signals. Maintain inventory and run one small experiment (price or promo) to probe demand. Decision: Maintain.";
      } else {
        recommendation =
          "Risk is elevated (thin margins, slow turnover or high refunds). Pause new investment and fix the biggest driver first. Decision: Pause.";
      }
    }

    // 6) Return the new contract (no SVI)
    return NextResponse.json({
      ok: true,
      metrics,
      healthScore,
      summary,
      recommendation,
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
