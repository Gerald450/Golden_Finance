"use client";
import { useEffect, useMemo, useRef, useState } from "react";

/* ---------- Types ---------- */
type Metrics = {
  periodLabel?: string;
  sales: number;
  marginPct: number;
  refundPct: number;
  invTurn: number;
  investedCum?: number;
};

type FetchProps = {
  storeId: string;
  dateFrom?: string;
  dateTo?: string;
};

type ManualProps = {
  metrics: Metrics;
  healthScore?: number;
  recommendation?: string;
};

type Props = FetchProps | ManualProps;

/* ---------- Helpers ---------- */
function clamp(n: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, n));
}
function to2(n: number) {
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}
function computeHealth(m: Metrics) {
  const marginScore = clamp(m.marginPct);
  const refundScore = clamp(100 - m.refundPct);
  const turnoverScore = clamp((m.invTurn / 4) * 100);
  return clamp(0.5 * marginScore + 0.3 * refundScore + 0.2 * turnoverScore);
}

/* ---------- InsightBubble ---------- */
export function InsightBubble(props: Props) {
  const isFetchMode = "storeId" in props;

  const [metrics, setMetrics] = useState<Metrics | null>(
    isFetchMode ? null : (props as ManualProps).metrics
  );
  const [health, setHealth] = useState<number | null>(
    isFetchMode ? null : (props as ManualProps).healthScore ?? null
  );
  const [recommendation, setRecommendation] = useState<string>(
    isFetchMode ? "" : (props as ManualProps).recommendation ?? ""
  );
  const [loading, setLoading] = useState<boolean>(isFetchMode);
  const [err, setErr] = useState<string | null>(null);
  const mounted = useRef(true);

  // FETCH MODE → Ask /api/insight for metrics + AI recommendation
  useEffect(() => {
    if (!isFetchMode) return;
    mounted.current = true;
    const ctrl = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            collection: "stores", 
            storeId: (props as FetchProps).storeId,
            dateFrom: (props as FetchProps).dateFrom,
            dateTo: (props as FetchProps).dateTo,
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!mounted.current) return;

        setMetrics(data.metrics);
        setHealth(
          typeof data.healthScore === "number"
            ? data.healthScore
            : computeHealth(data.metrics)
        );
        setRecommendation(data.recommendation ?? "");
      } catch (e: any) {
        if (e.name !== "AbortError") {
          console.error(e);
          if (mounted.current) {
            setErr("Failed to fetch insights.");
            setRecommendation("Maintain current plan and recheck next week.");
          }
        }
      } finally {
        if (mounted.current) setLoading(false);
      }
    })();

    return () => {
      mounted.current = false;
      ctrl.abort();
    };
  }, [isFetchMode, props]);

  // MANUAL MODE → Direct update
  useEffect(() => {
    if (isFetchMode) return;
    const { metrics, healthScore, recommendation } = props as ManualProps;
    if (metrics) setMetrics(metrics);
    if (typeof healthScore === "number") setHealth(healthScore);
    if (typeof recommendation === "string") setRecommendation(recommendation);
  }, [isFetchMode, props]);

  const tone = useMemo(() => {
    const h = health ?? 50;
    if (h >= 75)
      return { box: "bg-green-50 text-green-900", badge: "bg-green-600 text-white" };
    if (h >= 50)
      return { box: "bg-amber-50 text-amber-900", badge: "bg-amber-600 text-white" };
    return { box: "bg-red-50 text-red-900", badge: "bg-red-600 text-white" };
  }, [health]);

  /* ---------- Summary + Explanation ---------- */
  const summary = useMemo(() => {
    if (!metrics) return "Analyzing...";
    const profit = metrics.sales * (metrics.marginPct / 100);
    return `During ${metrics.periodLabel ?? "this period"}, sales reached $${to2(
      metrics.sales
    )} with an estimated profit of $${to2(profit)} (margin ${to2(
      metrics.marginPct
    )}%). Refunds stood at ${to2(
      metrics.refundPct
    )}%, and inventory turned over ${to2(
      metrics.invTurn
    )} times. These results reflect how efficiently products are selling, how well costs are managed, and how satisfied customers are.`;
  }, [metrics]);

  const metricExplanation = `Each metric represents a key business signal:
- Sales: show revenue flow and market demand.
- Profit Margin: reflects cost control and pricing efficiency.
- Refund Rate: measures customer satisfaction and product quality.
- Inventory Turnover: reveals how quickly stock is selling.
Together, they help identify whether it’s the right time to invest, maintain, or hold resources.`;

  return (
    <div className={`rounded-xl p-4 text-sm space-y-3 transition-colors ${tone.box}`}>
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${tone.badge}`}>
          {err ? "Issue" : loading ? "Analyzing…" : "Health"}
        </span>
        <span className="text-xs">
          Business Health Score:{" "}
          <b>{health != null ? health.toFixed(1) : "—"}/100</b>
        </span>
      </div>

      {/* Metrics Table */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mt-1">
          <div className="p-2 bg-white/60 rounded-lg shadow-sm">
            <p className="font-semibold">Sales</p>
            <p>${to2(metrics.sales)}</p>
          </div>
          <div className="p-2 bg-white/60 rounded-lg shadow-sm">
            <p className="font-semibold">Profit Margin</p>
            <p>{to2(metrics.marginPct)}%</p>
          </div>
          <div className="p-2 bg-white/60 rounded-lg shadow-sm">
            <p className="font-semibold">Refund Rate</p>
            <p>{to2(metrics.refundPct)}%</p>
          </div>
          <div className="p-2 bg-white/60 rounded-lg shadow-sm">
            <p className="font-semibold">Inventory Turnover</p>
            <p>{to2(metrics.invTurn)}x</p>
          </div>
        </div>
      )}

      {/* Explanation Paragraph */}
      <p className="text-gray-800 text-xs leading-relaxed whitespace-pre-line">
        {metricExplanation}
      </p>

      {/* Summary */}
      <p className={`${loading ? "opacity-70 animate-pulse" : ""}`}>
        <span className="font-semibold">Summary:</span> {summary}
      </p>

      {/* Recommendation */}
      {recommendation && (
        <p className={`${loading ? "opacity-70 animate-pulse" : ""}`}>
          <span className="font-semibold">Recommendation:</span>{" "}
          {err ? "⚠️ " : "💡 "}
          {recommendation}
        </p>
      )}
    </div>
  );
}
