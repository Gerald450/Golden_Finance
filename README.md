<<<<<<< HEAD
# Golden Finance

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase)](https://firebase.google.com/)

**Short technical overview:** Golden Finance is a full-stack web application for community-oriented investing and financial literacy. The system combines a **Next.js App Router** frontend, **Firestore** as the operational data store for store profiles and time-series metrics, and a **server-side insights API** that fuses deterministic scoring with **optional LLM inference** (OpenRouter) for concise, action-biased recommendations. Real-time UI updates use Firestore listeners; the assistant layer integrates **Botpress** for conversational support.

---

## Key features

- **Store intelligence dashboard:** Time-ordered performance series (sales, margin, inventory turnover, refunds) with interactive charts (Recharts).
- **Composite health & vitality signals:** Weighted, normalized scoring (including EMA-smoothed and range-stable variants) to summarize multi-metric store health in a single interpretable trajectory.
- **Insights API:** `POST /api/insights` loads the latest series from Firestore (Admin SDK), normalizes heterogeneous numeric encodings, computes a **business health score**, generates a structured narrative summary, and returns an **Invest / Maintain / Pause**-style recommendation.
- **LLM augmentation with graceful degradation:** When `OPENROUTER_API_KEY` is configured, recommendations are produced via a low-temperature chat completion; on failure or absence of keys, a **rule-based policy** aligned to the same score thresholds guarantees deterministic output.
- **Real-time data path:** Client pages subscribe to Firestore subcollections with `onSnapshot` for live metric refresh without polling.
- **Embedded conversational UX:** Botpress webchat loaded on the client for FAQ-style and guided flows alongside the product surface.
- **Financial literacy module:** Curated lesson flows for onboarding and education (in-app content).

---

## System architecture

```mermaid
flowchart TB
  subgraph client [Browser / Next.js Client]
    UI[App Router pages + components]
    FSClient[Firebase Client SDK]
    BP[Botpress Webchat]
  end

  subgraph edge [Next.js Server]
    API["/api/insights Route Handler"]
    Admin[Firebase Admin SDK]
    LLM[OpenRouter Chat Completions]
  end

  subgraph data [Google Cloud]
    Firestore[(Firestore: stores / series)]
  end

  UI --> FSClient
  FSClient <-->|reads + realtime subs| Firestore
  UI -->|POST JSON| API
  API --> Admin
  Admin -->|read series| Firestore
  API -->|optional| LLM
  UI --> BP
```

**Design intent:** Keep **writes and sensitive operations** on paths that can be locked down with service accounts and server-only secrets; expose **read-optimized, typed contracts** to the client. The insights route runs on the **Node.js runtime** to use the Admin SDK and long-lived HTTP calls to the inference provider.

---

## AI / ML components

| Layer | Role |
|--------|------|
| **Structured feature pipeline** | Server normalizes metrics (e.g., percent-as-fraction vs. percent-as-whole), selects the latest complete row, and derives a scalar **health score** from margin, refunds, and turnover. |
| **LLM inference (optional)** | OpenRouter `chat/completions` with a fixed system prompt, JSON-serialized context (metrics, score, rubric), capped `max_tokens`, and low `temperature` for stable, short recommendations. |
| **Policy fallback** | Threshold-based rules mirror the LLM rubric so the API remains **available and auditable** without external dependencies. |
| **Client-side scoring** | Additional **SVI-style** composites (weighted normalization, EMA smoothing) support visualization and explainability on the store detail view. |

This is **not** a RAG or vector-search system; the model conditions on **structured tabular context** rather than retrieved documents. A natural extension (see Future improvements) would be retrieval over store notes, filings, or support tickets.

---

## Tech stack

| Area | Choices |
|------|---------|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript 5 |
| Styling / motion | Tailwind CSS 4, Framer Motion |
| Charts | Recharts |
| Database | Cloud Firestore (document + subcollection model) |
| Server SDK | `firebase-admin` (credential-based) |
| Client SDK | `firebase` (Firestore reads / subscriptions) |
| Inference gateway | OpenRouter (OpenAI-compatible HTTP API) |
| Assistant embed | Botpress Cloud (injected scripts) |

---

## Backend infrastructure

- **Route Handlers:** `app/api/insights/route.ts` — validates request shape (`collection`, `storeId`), queries `stores/{id}/series`, sorts by date, and returns a JSON contract: `metrics`, `healthScore`, `summary`, `recommendation`.
- **Service account isolation:** Firebase Admin initializes from `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` (with newline unescaping for single-line env formats).
- **Async I/O:** Series fetch and optional `fetch()` to OpenRouter are **async**; failures in the LLM path are contained so the handler still returns 200 with fallback text where appropriate.
- **Environment surface:** Public Firebase web config via `NEXT_PUBLIC_*`; secrets (`OPENROUTER_*`, private key) remain server-only.

**Production hardening (recommended next steps):** Firebase Auth or custom tokens for user-scoped reads, Firestore security rules tuned to least privilege, rate limiting on `/api/insights`, and structured logging with request correlation IDs.

---

## Deployment details

- **Target platform:** Compatible with **Vercel** (Next.js native) or any Node-capable host that supports environment variables and outbound HTTPS to OpenRouter.
- **Build:** `npm run build` → `next build`; serve with `next start` or platform defaults.
- **Configuration:** All credentials and model routing are **environment-driven** — no secrets in source.

---

## Challenges and engineering decisions

1. **Heterogeneous metric encoding:** Real-world inputs may store margins as `0.43` or `43`. The API **normalizes** before scoring to avoid systematic bias in the health model.
2. **LLM reliability vs. product guarantees:** External inference can time out or rate-limit. The **dual-path design** (model + rules) preserves UX and makes behavior **testable without the network**.
3. **Real-time vs. server authority:** The UI listens to Firestore for charts; **authoritative scoring for recommendations** is computed server-side so clients cannot spoof health scores sent to investors.
4. **Scoring stability for visualization:** The store detail page uses a **min–max normalized, monotonic-friendly** SVI variant so small series don’t explode visually when raw scales differ by store.
5. **Timezone-aware labeling:** Summary periods use an explicit IANA zone (`America/New_York`) for consistent date strings across environments.

---

## Performance and scalability

- **Firestore access pattern:** Reads are keyed by `storeId`; series are stored in a **subcollection**, which scales with document count and supports indexed `orderBy("date")` for chronological pulls.
- **API cost control:** LLM calls use **short outputs** (`max_tokens` bounded) and run only on insight requests, not on every chart render.
- **Client efficiency:** `AbortController` on insight fetches avoids state updates after navigation; realtime listeners unsubscribe on unmount.
- **Horizontal scale:** Stateless Next.js instances behind a load balancer; Firestore and OpenRouter become the primary shared bottlenecks — address with **per-IP or per-user quotas**, **caching** of last computed insight per store with TTL, and **background jobs** if batch analytics are added.

---

## Future improvements

- **Retrieval-augmented recommendations:** Ingest unstructured sources (owner Q&A, reviews, SKU notes) → **embeddings** → **vector store** → grounded LLM prompts with citations.
- **Evaluation harness:** Golden-set of stores with expected decisions; regression tests for scoring functions and prompt variants.
- **AuthN / AuthZ:** Firebase Auth + custom claims; row-level access to `stores` and `series`.
- **Observability:** OpenTelemetry traces from API → Firestore → OpenRouter; latency and error budgets per dependency.
- **Caching:** Edge or Redis cache for idempotent insight responses keyed by `(storeId, latestSeriesTimestamp)`.
- **Batch pipelines:** Scheduled Cloud Functions / Cloud Run jobs for aggregate community metrics and anomaly detection.

---

## Screenshots / demo

_Add 2–4 screenshots or a short Loom/GIF here: landing, store detail with charts, insight bubble with recommendation, learn module._

**Suggested assets:** `docs/screenshots/dashboard.png`, `docs/screenshots/store-insights.png`

---

## Installation instructions

**Prerequisites:** Node.js 20+ (recommended), npm, a Firebase project with Firestore enabled, and optionally an OpenRouter API key.

```bash
git clone <your-repo-url>
cd GoldenFinance/my-app
npm install
```

Create **`.env.local`** in `my-app/` (never commit secrets):

```env
# Firebase — client (public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase — server (Admin SDK)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional — LLM augmentation via OpenRouter
OPENROUTER_API_KEY=
OPENROUTER_SITE_URL=
OPENROUTER_APP_TITLE=
```

**Firestore shape (illustrative):**

- Document: `stores/{storeId}` — fields such as `name`, `sector`, `goal`, `fundedPct`
- Subcollection: `stores/{storeId}/series/{docId}` — fields: `date`, `sales`, `marginPct`, `invTurn`, `refundPct`

```bash
npm run dev
# http://localhost:3000
```

---

## API / system flow overview

**`POST /api/insights`**

| Step | Action |
|------|--------|
| 1 | Validate body: `collection: "stores"`, `storeId` present |
| 2 | Load all `series` docs; sort ascending by `date` |
| 3 | Pick latest row with usable metrics |
| 4 | Normalize percentages; compute `healthScore` |
| 5 | Build deterministic `summary` string |
| 6 | If configured, call OpenRouter; else use rule-based `recommendation` |
| 7 | Return `{ ok, metrics, healthScore, summary, recommendation }` |

**Client flow (store detail):** Mount → `getDoc` for store metadata → `onSnapshot` on `series` → derive chart series + SVI → `InsightBubble` triggers `fetch("/api/insights")` with abort-safe lifecycle.

---

## Resume-style impact summary

- Architected a **Next.js + Firestore** full-stack product with **real-time metrics** and a **typed HTTP insights API** separating client visualization from server-side analytics.
- Implemented a **hybrid decision system**: deterministic **multi-signal health scoring** plus **optional LLM inference** with **automatic fallback** for reliability and testability.
- Owned **data normalization and API contracts** for messy real-world numeric encodings, reducing bad recommendations from inconsistent inputs.
- Integrated **third-party inference (OpenRouter)** and **conversational UI (Botpress)** behind clear environment boundaries and low-token, low-temperature prompting for **cost-aware** operation.
- Applied **scalability-oriented patterns**: subcollection data model, async dependency calls, client subscription cleanup, and documented paths toward **caching, auth, and RAG**.

---

## Suggested repository organization

| Suggestion | Why |
|------------|-----|
| Move app to repo root or rename `my-app` → `web` | Clearer entry point for recruiters cloning once. |
| Add `docs/architecture.md` with sequence diagrams | Shows systems thinking beyond README. |
| Add `.env.example` (no secrets) | Faster onboarding; matches fields in this README. |
| Add `CONTRIBUTING.md` + issue templates | Signals mature OSS / team habits. |
| CI: `npm run lint && npm run build` on PRs | Proves build health. |
| Optional: `infra/` with Terraform or Firebase rules export | Demonstrates **AI infra** and security posture. |

---

## Stronger signals for AI / new-grad recruiting

1. **Mini eval notebook or `eval/` folder:** Compare rule-only vs. LLM recommendations on synthetic stores; report agreement rate and failure cases.
2. **Prompt + schema versioning:** Check in `prompts/v1.md` and validate LLM output shape (even if plain text, add regex checks for **Invest|Maintain|Pause**).
3. **Observability:** One dashboard (e.g., Vercel Analytics + simple structured logs) showing p95 for `/api/insights`.
4. **RAG spike:** Chunk public 10-K excerpts or your lesson content → embeddings API → vector DB → show retrieved context in the insight panel.
5. **Auth story:** Even a minimal Firebase Auth flow proves end-to-end **secure data access**.

---

_License: specify your license here (e.g., MIT) if you open-source the repo._
=======
# GoldenFinance

## Challenge Statement(s) Addressed 🎯
**How might we revitalize Pine Bluff's (and other similar communities) economy by creating sustainable local investment opportunities and financial literacy programs?**

Pine Bluff is facing an economic decline marked by a 30% population decrease over the last 4 years, high business closure rates, and limited access to investment opportunities. Fewer than 15% of small businesses have access to investors or traditional loans, while over 40% of households lack basic financial literacy. This lack of financial inclusion and community reinvestment prevents local entrepreneurs from growing and discourages residents from supporting neighborhood businesses. Without a sustainable system to circulate money locally, Pine Bluff's economy continues to weaken.

## Project Description 🤯
**GoldenFinance is a community-focused fintech platform that empowers Pine Bluff residents through financial education and local investment opportunities.** The platform combines an interactive Financial Training program that teaches saving, budgeting, and investing basics with a community investment marketplace where residents can directly invest in local Pine Bluff businesses. Users can browse businesses by sector, view real-time performance analytics using our proprietary Store Vitality Index (SVI) algorithm, and make investments with customizable amounts starting as low as $10. The platform features AI-powered insights, interactive charts showing business performance trends, and a comprehensive dashboard to track both learning progress and investment portfolios, creating a sustainable ecosystem where educated residents invest locally and businesses have access to community capital.

## Project Value 💰
**Our primary target customers are Pine Bluff residents seeking financial education and investment opportunities, along with local small business owners needing access to capital.** For residents, GoldenFinance provides tangible benefits including comprehensive financial literacy education, direct access to profitable local investment opportunities with potential returns as businesses grow, and the ability to support their community while building personal wealth. For local businesses, the platform offers an alternative funding source beyond traditional loans, access to engaged community investors who are personally invested in local success, and performance analytics tools to track and improve their business metrics. The platform creates a multiplier effect where money circulates locally, supporting job creation, increasing property values, and strengthening the overall economic foundation of Pine Bluff.

## Tech Overview 💻
**The following technologies were used to bring GoldenFinance to life:**

* Next.js 16 (React framework)
* TypeScript (Type safety)
* Tailwind CSS (Styling)
* Framer Motion (Animations)
* Firebase Firestore (Real-time database)
* Firebase Admin SDK (Backend operations)
* Recharts (Data visualization)
* Botpress (AI chatbot integration)
* OpenRouter API (AI insights)
* Vercel (Deployment platform)

### Link to Demo Presentation 📽
**https://www.canva.com/design/DAG4DbxV_G4/KcNRuavF9L64q2VSZnwZOw/edit?utm_content=DAG4DbxV_G4&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton**

### Team Checklist ✅
- [✅] Team photo
- [✅] Team Slack channel
- [✅] Communication established with mentor
- [✅] Repo creation from this template
- [✅] Flight Deck registration

### Project Checklist 🏁
- [✅] Presentation complete and linked
- [✅] Code merged to main branch

### School Name 🏫
University of Arkansas at Pine Bluff

### Team Name 🏷
The Lion's Den  55

### ✨ Contributors ✨
**...tell the world who you and your team are 🙂**
* Oluwademilade Ogunbade
* Gerald Shimo
* Simon Chambo
* Jude Kearney
* Ty'Azia Daniels
>>>>>>> f78f76ce6054992e0ca6a808af1d747ace21446f
