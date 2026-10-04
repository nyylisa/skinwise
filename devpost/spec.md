---
doc: spec
status: draft
---

# SkinWise — Technical Specification

## How This Works, In Plain Language
SkinWise is a full-stack, single-page web utility built with Next.js and Tailwind CSS. When a user selects two products or pastes ingredient formulas, the browser sends both ingredient strings to a server-side API route (`/api/analyze`). 

Inside that API route, the server constructs a structured prompt embedding a curated active ingredient compatibility matrix (covering Retinoids, Direct Acids AHA/BHA, L-Ascorbic Acid, Niacinamide, Peptides, and Inert Hydrators) and submits it to the Google Gemini API with native Structured Outputs (JSON Schema). The LLM extracts the specific active compounds from the formulas, compares them against the scientific rules, and returns a strictly typed JSON payload containing a status verdict (`CONFLICT`, `CAUTION`, or `SAFE`), active compound pill tags, a two-sentence biochemical risk explanation, and an actionable timing protocol. 

The frontend receives this payload and immediately renders high-contrast status badges and scheduling guidance, giving the user a definitive, scientific verdict in seconds without storing anything in a database.

## The Core Journey Through the System
1. **Initial Load:** The client loads `app/page.tsx` on `http://localhost:3000`. In-memory state defaults to Case 1 presets: Card 1 has Paula's Choice 2% BHA and Card 2 has The Ordinary 0.5% Retinol (`prd.md > The Core Journey`, `prd.md > Screens and Layout`).
2. **Preset or Custom Input:** Clicking a top demo button (`components/PresetToolbar.tsx`) or picking a preset dropdown (`components/ProductInputCard.tsx`) updates local React state (`product1`, `product2`), populating product names and full INCI textareas (`prd.md > Quick-Load Demo Presets`, `prd.md > Product Input & Ingredient Handling`).
3. **Trigger Analysis:** The user clicks "Check Compatibility". The client sets `isLoading = true`, locks inputs, and executes a `POST` request to `/api/analyze` passing `{ product1Name, product1Ingredients, product2Name, product2Ingredients }`.
4. **Server Processing & Gemini Call:** `app/api/analyze/route.ts` receives the payload, validates strings with Zod, and queries Google Gemini using the `@google/genai` SDK with strict JSON schema enforcement and system matrix rules (`prd.md > Compatibility Analysis & Protocol Engine`).
5. **Render Verdict:** The API responds with the validated `AnalysisResult` JSON. The client sets `isLoading = false` and mounts `components/ResultPanel.tsx` displaying the high-contrast verdict badge, active pill tags, biochemical risk rationale, and timing schedule (`prd.md > Compatibility Analysis & Protocol Engine`).
6. **Error Handling:** If the network fails or Gemini returns an error, the client catches the exception and renders an inline warning banner with a "Retry Analysis" button while keeping user text intact (`prd.md > States and Boundaries`).

## Stack
- **Framework:** Next.js 15 (App Router) with React 19 & TypeScript — Co-locates single-page UI and serverless API route in a unified repository with zero CORS overhead and fast refresh. [Next.js Docs](https://nextjs.org/docs)
- **Styling:** Tailwind CSS — Provides utility-first styling for the clinical laboratory aesthetic (`slate-50`, `rose-600`, `amber-600`, `emerald-600`) and responsive side-by-side grid layout. [Tailwind CSS Docs](https://tailwindcss.com/docs)
- **Icons:** `lucide-react` — Lightweight clinical iconography (ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, Clock, Sparkles). [Lucide Docs](https://lucide.dev)
- **Schema Validation:** Zod — Validates runtime API request payloads and Gemini structured output responses. [Zod Docs](https://zod.dev)
- **AI Engine:** Google Gemini (`gemini-2.5-flash` or `gemini-1.5-flash`) via `@google/genai` (or `@google/generative-ai`) — Provides sub-second entity extraction and synthesis constrained by native JSON schema output. [Google Gen AI Docs](https://ai.google.dev/docs)

## Where It Runs and How Someone Tries It
- **Local Runtime:** Node.js 18+ on Windows/macOS/Linux.
- **Environment Configuration:** `.env.local` containing `GEMINI_API_KEY=your_gemini_api_key`.
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
  - Verdict Conflict: `bg-rose-50 text-rose-700 border-rose-200`
  - Verdict Caution: `bg-amber-50 text-amber-700 border-amber-200`
  - Verdict Safe: `bg-emerald-50 text-emerald-700 border-emerald-200`
- **Typography:** Sans-serif (`Inter` or `Geist`) for titles, body, and action buttons; monospace (`font-mono`) for active compound pills, percentages, and chemical INCI names.

## Components

### PresetToolbar
Implements `prd.md > Quick-Load Demo Presets`.
- Top-mounted horizontal pill bar displaying three 1-click demo buttons:
  - "Load Conflict Demo (Case 1)" &rarr; Loads Paula's Choice BHA + The Ordinary Retinol.
  - "Load Caution Demo (Case 2)" &rarr; Loads SkinCeuticals Vitamin C + Paula's Choice BHA.
  - "Load Safe Demo (Case 3)" &rarr; Loads The Ordinary Retinol + CeraVe PM Moisturizer.
- Clears previous results and sets the inputs immediately into active readiness.

### ProductInputCard
Implements `prd.md > Product Input & Ingredient Handling`.
- Two side-by-side instances: Card 1 ("Product 1") and Card 2 ("Product 2").
- Contains:
  - Preset select dropdown populated from `lib/presets.ts`.
  - Product name input field (editable).
  - Expandable INCI ingredient textarea with `font-mono text-xs`, auto-populated on preset selection and freely editable.
  - Clear / reset button.

### ResultPanel
Implements `prd.md > Compatibility Analysis & Protocol Engine`.
- Conditionally mounted upon successful API response.
- Renders:
  - Verdict Status Banner: Large badge with high-contrast icon (ShieldAlert for Conflict, AlertTriangle for Caution, CheckCircle2 for Safe).
  - Active Compounds Tags: Detected active pills grouped by Product 1 and Product 2 in `font-mono`.
  - Biochemical Risk Explanation: Clear 2-sentence rationale formatted in crisp typography.
  - Actionable Timing Protocol Card: Highlighted schedule box indicating concrete routine timing (AM/PM separation or alternating days).

### AnalyzeRoute (`app/api/analyze/route.ts`)
Implements `prd.md > Compatibility Analysis & Protocol Engine`, `prd.md > States and Boundaries`.
- Handles `POST` requests.
- Validates request body using `AnalyzeRequestSchema`.
- Calls Gemini API with `responseMimeType: "application/json"`, enforcing `AnalysisResponseSchema` and injecting the scientific rule matrix from `lib/matrix.ts`.
- Handles edge cases:
  - If both formulas lack recognized active acids/retinoids/actives, forces a `SAFE` verdict with inert hydrators copy.
  - If Gemini API fails or rate limits, returns structured HTTP 500/429 JSON so the UI renders a retry toast.

## Data Model

### Client State
```typescript
interface ProductInput {
  name: string;
  ingredients: string;
}

interface AnalysisResult {
  status: "CONFLICT" | "CAUTION" | "SAFE";
  summaryTitle: string;
  activesProduct1: string[];
  activesProduct2: string[];
  conflictPairs: Array<{
    compound1: string;
    compound2: string;
    mechanism: string;
  }>;
  biochemicalExplanation: string;
  timingProtocol: {
    scheduleType: "ALTERNATE_DAYS" | "AM_PM_SPLIT" | "LAYER_TOGETHER" | "INERT";
    guidanceText: string;
  };
}
```

### Request & Response Schemas (Zod)
```typescript
import { z } from "zod";

export const AnalyzeRequestSchema = z.object({
  product1Name: z.string().min(1),
  product1Ingredients: z.string().min(1),
  product2Name: z.string().min(1),
  product2Ingredients: z.string().min(1),
});

export const AnalysisResponseSchema = z.object({
  status: z.enum(["CONFLICT", "CAUTION", "SAFE"]),
  summaryTitle: z.string(),
  activesProduct1: z.array(z.string()),
  activesProduct2: z.array(z.string()),
  conflictPairs: z.array(
    z.object({
      compound1: z.string(),
      compound2: z.string(),
      mechanism: z.string(),
    })
  ),
  biochemicalExplanation: z.string(),
  timingProtocol: z.object({
    scheduleType: z.enum(["ALTERNATE_DAYS", "AM_PM_SPLIT", "LAYER_TOGETHER", "INERT"]),
    guidanceText: z.string(),
  }),
});
```

## File Structure
```
skinwise/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Server-side Gemini analysis endpoint
│   ├── globals.css               # Tailwind CSS imports & clinical base styling
│   ├── layout.tsx                # Root layout with Inter/Geist fonts & metadata
│   └── page.tsx                  # Main client-side single-page UI orchestrator
├── components/
│   ├── PresetToolbar.tsx         # 1-click test case buttons (Conflict, Caution, Safe)
│   ├── ProductInputCard.tsx      # Dual card with preset dropdown & editable textarea
│   └── ResultPanel.tsx           # Verdict badge, active pills, explanation, timing protocol
├── lib/
│   ├── presets.ts                # Curated static active products with complete INCI formulas
│   ├── matrix.ts                 # In-prompt scientific compatibility matrix rules & prompt builder
│   └── types.ts                  # Shared TypeScript interfaces & Zod schemas
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
- **Google Gemini API (`@google/genai` or `@google/generative-ai`):**
  - Model: `gemini-2.5-flash` (or `gemini-1.5-flash`)
  - Auth: `GEMINI_API_KEY` header/environment variable
  - Endpoint / Method: SDK client method `ai.models.generateContent({ model, contents, config: { responseMimeType: "application/json", responseSchema } })`
  - Cost: Free tier / Pay-as-you-go within hackathon budget limits.
  - Documentation: [https://ai.google.dev/docs](https://ai.google.dev/docs)

## Important Failure Modes
- **Gemini API Error or Quota Exhaustion:** If the external API call fails, times out, or quota is reached, `app/api/analyze/route.ts` returns an HTTP 500 error with `{ error: "Analysis service temporarily unavailable" }`. The frontend renders a dismissible warning toast with an inline "Retry Analysis" button while keeping user text intact.
- **Missing or Incomplete Input:** If either product textarea is blank, the "Check Compatibility" button remains disabled with helper guidance, preventing invalid server requests.
- **Inert Hydrating Ingredients (Zero Actives):** If formulas contain only gentle moisturizers (e.g. Water, Glycerin, Petrolatum), the system evaluates them as `SAFE` with explicit copy clarifying that no conflicting direct acids or retinoids were detected and formulas are safe to layer.

## What Was Simplified and Why
- **Prompt-Injected Compatibility Matrix** instead of a dedicated PostgreSQL database: Embedding the scientific rules directly into the Gemini prompt enforces deterministic guardrails without hosting database infrastructure, fitting neatly into the 2–4 hour PoC.
- **Static In-Memory Presets** instead of dynamic cosmetic database web scrapers: Preloading verified popular formulas in `lib/presets.ts` guarantees instant, reliable demo data without fragile external web scraping dependencies.
- **Session-Only Client State** instead of user authentication & accounts: Zero setup friction allows anyone (or hackathon judges) to evaluate compatibility instantly.

## Decisions and Open Issues
- **Framework Choice:** Next.js 15 (App Router) + Tailwind CSS selected for rapid single-repo deployment and zero CORS friction.
- **AI Architecture:** Hybrid approach pairing an LLM entity extraction and synthesis engine with an in-prompt scientific matrix guardrail and strict Zod structured outputs.
- **One Useful Unknown & Resolution:**
  - *Learner uncertainty:* Ensuring deterministic classification and preventing LLM hallucination on known active pairings.
  - *Resolution:* Enforced through native JSON schema validation paired with explicit conflict rules injected into system instructions (e.g. "Direct Acid AHA/BHA + Retinoid MUST return CONFLICT; L-Ascorbic Acid + AHA/BHA MUST return CAUTION; Retinoid + Ceramide/Niacinamide MUST return SAFE").
- **Open Questions:** None blocking build execution. All components, schemas, endpoints, and fallbacks are fully specified.
