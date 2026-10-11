---
doc: spec
status: approved
---

# SkinWise — Technical Specification

## How This Works, In Plain Language
SkinWise is a full-stack, single-page web utility built with Next.js and Tailwind CSS. When a user selects two products or pastes ingredient formulas, the browser sends both ingredient strings to a server-side API route (`app/api/analyze/route.ts`).

Inside that API route, the server executes a **Hybrid ML & Rule Engine**:
1. A **SetFit Few-Shot Classifier microservice** parses the raw INCI ingredient strings by semantic meaning, predicting active compound categories even with typos or synonyms (e.g., Salicylic Acid, Glycolic Acid, Retinol, L-Ascorbic Acid, Niacinamide, Peptides, Ceramides).
2. `lib/matrix.ts` provides scientific conflict tables defining interaction rules across active classes (e.g., BHA + Retinoid &rarr; `CONFLICT`, Vitamin C + BHA &rarr; `CAUTION`, Retinol + Barrier Lipids &rarr; `SAFE`).
3. `lib/engine.ts` evaluates the parsed actives against the conflict tables, deterministically determining the 4-state verdict badge (`CONFLICT`, `CAUTION`, `SAFE`, or `INSUFFICIENT_DATA`), identified conflict pairs, and the timing protocol schedule (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`, or `UNKNOWN`).
4. `lib/gemini.ts` is invoked optionally to synthesize a natural language summary and biochemical explanation. If the Gemini API key is missing or the call fails, the deterministic engine supplies default rule-based scientific explanations and protocols instantly without downtime.

The API response is strictly validated against a shared Zod schema (`types/analysis.ts`) and returned to the frontend. The client renders high-contrast status badges and scheduling guidance in seconds.

## The Core Journey Through the System
1. **Initial Load:** The client loads `app/page.tsx` on `http://localhost:3000`. In-memory state defaults to Case 1 presets: Card 1 has Paula's Choice 2% BHA and Card 2 has The Ordinary 0.5% Retinol (`prd.md > The Core Journey`, `prd.md > Screens and Layout`).
2. **Preset, Ingredient Autocomplete, or Custom Input:** Clicking a top demo button (`components/PresetToolbar.tsx`) or picking a preset dropdown (`components/ProductInputCard.tsx`) updates local React state (`product1`, `product2`), populating product names and full INCI textareas from `lib/presets.ts`. Alternatively, users can search recognized active ingredients from `lib/actives.ts` with instant autocomplete or paste raw text. The card immediately displays recognized active chips or triggers an unrecognized ingredient warning notice (`prd.md > Quick-Load Demo Presets`, `prd.md > Product Input & Ingredient Handling`).
3. **Trigger Analysis:** The user clicks "Check Compatibility". The client sets `isLoading = true`, locks inputs, and executes a `POST` request to `/api/analyze` passing `{ product1Name, product1Ingredients, product2Name, product2Ingredients }`.
4. **Server Processing & Hybrid Evaluation:** `app/api/analyze/route.ts` receives the payload, validates request inputs via `AnalyzeRequestBody` schema, invokes the SetFit classifier microservice to parse compounds, queries `lib/matrix.ts` rules, and runs `lib/engine.ts` to compute the verdict, conflict pairs, and timing protocol.
5. **Optional LLM Summary:** The route handler optionally calls `lib/gemini.ts` to generate an enriched biochemical rationale. If Gemini is unreachable or disabled, built-in rule rationales are used.
6. **Render Verdict:** The API responds with the validated `AnalysisResult` JSON matching `AnalysisResultSchema`. The client sets `isLoading = false` and mounts `components/ResultPanel.tsx` displaying the high-contrast 4-state verdict badge (**CONFLICT**, **CAUTION**, **SAFE**, or **INSUFFICIENT_DATA**), active pill tags, biochemical risk rationale, and timing schedule (`prd.md > Compatibility Analysis & Deterministic Rule Engine`).
7. **Error Handling:** If the network fails or request payload is invalid, the client catches the exception and renders an inline warning banner with a "Retry Analysis" button while keeping user text intact (`prd.md > States and Boundaries`).

## Stack
- **Framework:** Next.js 15 (App Router) with React 19 & TypeScript — Co-locates single-page UI and serverless API route in a unified repository with zero CORS overhead and fast refresh. [Next.js Docs](https://nextjs.org/docs)
- **Styling:** Tailwind CSS — Provides utility-first styling for the clinical laboratory aesthetic (`slate-50`, `rose-600`, `amber-600`, `emerald-600`) and responsive side-by-side grid layout. [Tailwind CSS Docs](https://tailwindcss.com/docs)
- **Icons:** `lucide-react` — Lightweight clinical iconography (ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, Clock, Sparkles). [Lucide Docs](https://lucide.dev)
- **Schema Validation:** Zod — Validates runtime API request payloads and deterministic response structures via `types/analysis.ts`. [Zod Docs](https://zod.dev)
- **Hybrid Engine:** SetFit Python microservice for robust semantic ingredient classification + Pure TypeScript modules (`lib/matrix.ts`, `lib/engine.ts`) for deterministic evaluation.
- **Optional AI Summarizer:** Google Gemini (`gemini-2.5-flash` or `gemini-1.5-flash`) via `@google/genai` (or `@google/generative-ai`) in `lib/gemini.ts` — Provides optional natural language polish constrained strictly by the deterministic verdict. [Google Gen AI Docs](https://ai.google.dev/docs)

## Where It Runs and How Someone Tries It
- **Local Runtime:** Node.js 18+ on Windows/macOS/Linux.
- **Environment Configuration:** `.env.local` containing `GEMINI_API_KEY=your_gemini_api_key` (optional; engine functions completely in offline fallback mode if omitted).
- **Start Command:**
  ```bash
  npm install
  npm run dev
  ```
- **Demo Verification URL:** Open `http://localhost:3000` in any modern web browser.
- **Optional Deployment:** Deployed to Vercel connected to the public GitHub repository for instant live reviewer access.

## Look and Feel
Implements `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.
- **Theme:** Modern clinical laboratory aesthetic in crisp light mode.
- **Colors:**
  - Background: `bg-slate-50`
  - Cards: `bg-white` with `border border-slate-200 shadow-sm rounded-xl`
  - Text: Headers `text-slate-900`, body instructions `text-slate-600`, labels `text-slate-500`
  - 4-State Status Badges:
    - Verdict CONFLICT: `bg-rose-50 text-rose-700 border-rose-200`
    - Verdict CAUTION: `bg-amber-50 text-amber-700 border-amber-200`
    - Verdict SAFE: `bg-emerald-50 text-emerald-700 border-emerald-200`
    - Verdict INSUFFICIENT_DATA: `bg-slate-100 text-slate-700 border-slate-300`
- **Typography:** Sans-serif (`Inter` or `Geist`) for titles, body, and action buttons; monospace (`font-mono`) for active compound pills, percentages, and chemical INCI names.

## Modules and Components

### Frontend Components (`components/`, `app/page.tsx`, `lib/presets.ts`)

#### PresetToolbar (`components/PresetToolbar.tsx`)
Implements `prd.md > Quick-Load Demo Presets`.
- Top-mounted horizontal pill bar displaying three 1-click demo buttons:
  - "Load Conflict Demo (Case 1)" &rarr; Loads Paula's Choice BHA + The Ordinary Retinol.
  - "Load Caution Demo (Case 2)" &rarr; Loads SkinCeuticals Vitamin C + Paula's Choice BHA.
  - "Load Safe Demo (Case 3)" &rarr; Loads The Ordinary Retinol + CeraVe PM Moisturizer.
- Clears previous results and sets the inputs immediately into active readiness.

#### ProductInputCard (`components/ProductInputCard.tsx`)
Implements `prd.md > Product Input & Ingredient Handling`.
- Two side-by-side instances: Card 1 ("Product 1") and Card 2 ("Product 2").
- Contains:
  - Preset select dropdown populated from `lib/presets.ts`.
  - Product name input field (editable).
  - Searchable active ingredient autocomplete input matching against `KNOWN_ACTIVES` (`lib/actives.ts`).
  - Expandable INCI ingredient textarea with `font-mono text-xs`, auto-populated on preset selection and freely editable.
  - Real-time active preview tags: renders detected active pill tags (`Retinoid`, `Direct Acid`, `Vitamin C`, `Niacinamide`, `Barrier Support`).
  - Upfront unrecognized ingredient indicator: displays an inline notice (`⚠️ Contains ingredients not found in SkinWise active catalog`) if formulas contain uncataloged compounds, preventing mistaken assumptions of safety.
  - Clear / reset button.

#### ResultPanel (`components/ResultPanel.tsx`)
Implements `prd.md > Compatibility Analysis & Deterministic Rule Engine`.
- Conditionally mounted upon successful API response.
- Renders:
  - Verdict Status Banner: Large badge with high-contrast icon (ShieldAlert for CONFLICT, AlertTriangle for CAUTION, CheckCircle2 for SAFE, HelpCircle for INSUFFICIENT_DATA).
  - Active Compounds Tags: Detected active pills grouped by Product 1 and Product 2 in `font-mono`.
  - Biochemical Risk Explanation: Clear 2-sentence rationale formatted in crisp typography.
  - Actionable Timing Protocol Card: Highlighted schedule box indicating concrete routine timing (AM/PM separation, alternating days, or cautious guidance).

### Backend & Rule Engine (`lib/`, `app/api/analyze/route.ts`)

#### Active Ingredient Classifier (SetFit Microservice)
- Replaces the legacy `lib/actives.ts` regex approach.
- A lightweight Python microservice hosting a SetFit few-shot text classification model.
- Takes raw ingredient strings and classifies them into `KNOWN_ACTIVES` canonical taxonomy based on semantic meaning.
- Returns structured array of detected active categories and matched names for each product.

#### Active Conflict Matrix (`lib/matrix.ts`)
- Contains static scientific conflict tables and interaction severity rules.
- Maps combinations of active classes to conflict level (`CONFLICT`, `CAUTION`, `SAFE`), scientific mechanism, and recommended scheduling pattern (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`).

#### Deterministic Rule Engine (`lib/engine.ts`)
- Pure evaluation function taking parsed actives from both products and matching them against `lib/matrix.ts`.
- Computes 4-state verdict (`CONFLICT`, `CAUTION`, `SAFE`, `INSUFFICIENT_DATA`):
  - Returns `INSUFFICIENT_DATA` (with `UNKNOWN` schedule) if either or both products lack recognized actives.
  - Returns `CONFLICT` or `CAUTION` when active pairs match respective matrix rules.
  - Returns `SAFE` strictly when an explicit positive compatibility rule is matched.
  - Defaults unverified combinations of recognized actives to `CAUTION` (never defaults to `SAFE`).
- Guarantees 100% deterministic, instant results with zero hallucination.

#### Gemini Summarizer (`lib/gemini.ts`)
- Optional Google Gemini client using `@google/genai` (or `@google/generative-ai`).
- Generates natural language biochemical explanations constrained strictly by the deterministic evaluation result.
- Provides seamless fallback to built-in rule explanations if API is unreachable or omitted.

#### Route Handler (`app/api/analyze/route.ts`)
- Next.js serverless route handler for `POST /api/analyze`.
- Validates request body using `AnalyzeRequestSchema` from `types/analysis.ts`.
- Coordinates parsing (`lib/actives.ts`), evaluation (`lib/engine.ts`), and optional summary generation (`lib/gemini.ts`).
- Validates and returns `AnalysisResultSchema` JSON payload.

## Data Model (`types/analysis.ts`)

```typescript
import { z } from "zod";

export const CompatibilityStatusEnum = z.enum([
  "CONFLICT",
  "CAUTION",
  "SAFE",
  "INSUFFICIENT_DATA",
]);
export type CompatibilityStatus = z.infer<typeof CompatibilityStatusEnum>;

export const ScheduleTypeEnum = z.enum([
  "ALTERNATE_DAYS",
  "AM_PM_SPLIT",
  "LAYER_TOGETHER",
  "INERT",
  "UNKNOWN",
]);
export type ScheduleType = z.infer<typeof ScheduleTypeEnum>;

export const ConflictPairSchema = z.object({
  compound1: z.string(),
  compound2: z.string(),
  mechanism: z.string(),
});
export type ConflictPair = z.infer<typeof ConflictPairSchema>;

export const AnalysisResultSchema = z.object({
  status: CompatibilityStatusEnum,
  summaryTitle: z.string(),
  activesProduct1: z.array(z.string()),
  activesProduct2: z.array(z.string()),
  conflictPairs: z.array(ConflictPairSchema),
  biochemicalExplanation: z.string(),
  timingProtocol: z.object({
    scheduleType: ScheduleTypeEnum,
    guidanceText: z.string(),
  }),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;

export interface AnalyzeRequestBody {
  product1Name?: string;
  product1Ingredients: string;
  product2Name?: string;
  product2Ingredients: string;
}
```

## File Structure
```
skinwise/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Server-side route handler orchestrating analysis
│   ├── globals.css               # Tailwind CSS imports & clinical base styling
│   ├── layout.tsx                # Root layout with Inter/Geist fonts & metadata
│   └── page.tsx                  # Main client-side single-page UI orchestrator
├── components/
│   ├── PresetToolbar.tsx         # 1-click test case buttons (Conflict, Caution, Safe)
│   ├── ProductInputCard.tsx      # Dual card with preset dropdown & editable textarea
│   └── ResultPanel.tsx           # 3-tier verdict badge, active pills, explanation, timing protocol
├── lib/
│   ├── actives.ts                # Client to interface with SetFit ML microservice
│   ├── matrix.ts                 # Active conflict tables and scientific interaction rules
│   ├── engine.ts                 # Pure deterministic compatibility evaluation engine
│   ├── gemini.ts                 # Optional Google Gemini client for natural language summaries
│   └── presets.ts                # Curated static active products with complete INCI formulas
├── types/
│   └── analysis.ts               # Shared Zod schemas and TypeScript interfaces
├── devpost/                      # Hackathon planning workspace
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── .env.example                  # Template for GEMINI_API_KEY
├── .env.local                    # Local secret configuration (git-ignored)
├── package.json                  # Next.js, React, Tailwind, Lucide, Zod, @google/genai
├── tsconfig.json                 # Strict TypeScript configuration
└── README.md                     # Project documentation & demo run instructions
```

## External Services and Dependencies
- **Hybrid Rule Engine (Core):** Local TypeScript modules (`lib/matrix.ts`, `lib/engine.ts`) paired with a Python SetFit classifier microservice.
- **Optional Google Gemini API (`@google/genai` or `@google/generative-ai` in `lib/gemini.ts`):**
  - Model: `gemini-2.5-flash` (or `gemini-1.5-flash`)
  - Auth: `GEMINI_API_KEY` environment variable (optional; system falls back to rule rationales if omitted)
  - Endpoint / Method: `generateContent` for natural language summary polish.
  - Documentation: [https://ai.google.dev/docs](https://ai.google.dev/docs)

## Important Failure Modes
- **Gemini API Error or Quota Exhaustion:** If the external Gemini call fails or times out, `app/api/analyze/route.ts` seamlessly uses the deterministic rule engine's built-in biochemical explanation and protocol, returning HTTP 200 with full analysis rather than failing.
- **Missing or Incomplete Input:** If either product textarea is blank, the "Check Compatibility" button remains disabled with helper guidance, preventing invalid server requests.
- **Missing Actives or Unrecognized Formulas:** If either or both formulas contain no recognized actives, `lib/engine.ts` evaluates them conservatively as `INSUFFICIENT_DATA` with `UNKNOWN` schedule. Furthermore, the client UI flags uncataloged ingredients with an upfront warning banner, ensuring users understand before testing that compatibility cannot be verified.
- **Unverified Dual-Active Pairs:** If both products have recognized actives but no verified rule exists in the scientific matrix, the engine defaults to `CAUTION` with `UNKNOWN` schedule (never defaults to `SAFE`).

## What Was Simplified and Why
- **Hybrid ML & Rule Engine** instead of pure LLM evaluation: Few-shot ML provides robust ingredient identification, while deterministic rules guarantee chemical accuracy and reproducible verdicts without hallucination.
- **Static In-Memory Presets** instead of dynamic cosmetic database web scrapers: Preloading verified popular formulas in `lib/presets.ts` guarantees instant, reliable demo data without fragile external web scraping dependencies.
- **Session-Only Client State** instead of user authentication & accounts: Zero setup friction allows anyone (or hackathon judges) to evaluate compatibility instantly.

## Decisions and Open Issues
- **Framework Choice:** Next.js 15 (App Router) + Tailwind CSS selected for rapid single-repo deployment and zero CORS friction.
- **AI Architecture:** Deterministic Rule Engine for parsing, conflict table matching, and evaluation; Google Gemini reserved strictly as an optional natural language summarizer.
- **Open Questions:** None blocking build execution. All components, schemas, endpoints, and fallbacks are fully specified.
