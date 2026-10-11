---
doc: spec
status: approved
---

# SkinWise — Technical Specification

## How This Works, In Plain Language
SkinWise is a full-stack, single-page web utility built with Next.js 15, React 19, TypeScript, and a dedicated Python SetFit ML microservice. When a user selects two products from the curated catalog or pastes raw ingredient formulas, the browser sends both ingredient strings to the server-side route handler (`src/app/api/analyze/route.ts`).

Inside that API route, the server executes a resilient **Hybrid ML & Rule Engine**:
1. **Semantic Active Detection (`src/lib/detect-safe.ts` & `src/lib/detect-ml.ts`):** Raw INCI ingredient strings are sent to the **SetFit Few-Shot Classifier microservice** (`skinwise-ml`), which uses semantic sentence embeddings (`BAAI/bge-small-en-v1.5`) to classify ingredients into canonical active categories even across spelling differences, synonyms, or trade names.
2. **Curated Formulation Guardrail:** A lookup override map in `src/lib/detect-ml.ts` ensures known pH adjusters (e.g., Citric Acid at trailing percentages), chelating agents (e.g., Disodium EDTA), and mild surfactants are not falsely classified as aggressive exfoliating acids. If the Python ML microservice is unreachable, `src/lib/detect-safe.ts` automatically falls back to an in-memory longest-alias-first regex index (`src/lib/detect.ts`).
3. **Scientific Conflict Matrix (`src/lib/matrix.ts`):** Cross-references recognized active categories against validated pairwise interaction rules (e.g., Retinoid + Direct Acid &rarr; `CONFLICT`, Retinoid + Vitamin C &rarr; `CAUTION`, Retinoid + Barrier Support &rarr; `SAFE`).
4. **Deterministic Evaluation (`src/lib/engine.ts`):** Evaluates interaction status into a strict 4-state verdict (`CONFLICT`, `CAUTION`, `SAFE`, or `INSUFFICIENT_DATA` / `UNKNOWN`), aggregates conflict pairs with scientific mechanisms, and assigns the routine timing protocol (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`, or `UNKNOWN`).

The API response is strictly typed via `src/types/analysis.ts` and returned to the client, where the Atomic Design UI components instantly render high-contrast verdict banners, detected active pills, interaction cards, and scheduling protocols.

## The Core Journey Through the System
1. **Initial Load:** The client loads `src/app/page.tsx` on `http://localhost:3000`, rendering `src/pages/CompatibilityPage.tsx`. The top PresetToolbar (`src/features/compatibility/organisms/PresetToolbar.tsx`) displays 1-click test cases, and dual product input cards (`ProductInputCard.tsx`) are initialized ready for selection or manual pasting.
2. **Preset Selection or Custom INCI Input:** Clicking a top preset button loads benchmark pairs into React state managed by `useCompatibility.ts`. Alternatively, users pick items from each card's curated catalog dropdown (`src/lib/preset.ts`) or paste raw ingredient text. The card immediately parses and updates a live ingredient counter.
3. **Trigger Analysis:** The user clicks "Check Compatibility". The client sets `status = "loading"`, locks inputs, and executes a `POST` request to `/api/analyze` passing `{ product1Name, product1Ingredients, product2Name, product2Ingredients }`.
4. **Server Processing & Hybrid Evaluation:** `src/app/api/analyze/route.ts` validates request inputs, calls `detectActivesSafe` to extract active categories via the SetFit microservice with curated override protection and regex fallback, queries `src/lib/matrix.ts` rules, and runs `src/lib/engine.ts` to compute the verdict, conflict pairs, and timing protocol.
5. **Render Verdict:** The API responds with `AnalyzeResponse` JSON. The client sets `status = "success"` and mounts `src/features/compatibility/organisms/ResultPanel.tsx` displaying the high-contrast 4-state verdict banner, detected active tags per product, interaction cards with biochemical mechanisms, and actionable timing advice.
6. **Error Handling & Reset:** If network issues occur, the client renders an inline alert banner while preserving user input text. Clicking "Check another combination" cleanly resets input state.

## Stack
- **Frontend & App Server:**
  - Next.js 15 (App Router) with React 19 & TypeScript — Single-page UI with serverless API route handlers. [Next.js Docs](https://nextjs.org/docs)
  - Styling: Vanilla CSS custom design tokens + Tailwind CSS — Clinical laboratory aesthetic (`--sw-mint`, `--sw-forest`, `--sw-green`, `--sw-cream`, `--sw-line`, `--sw-amber`, `--sw-danger`).
  - Icons: `lucide-react` — Clinical iconography (RotateCcw, LoaderCircle, ShieldAlert, AlertTriangle, CheckCircle2, ChevronDown). [Lucide Docs](https://lucide.dev)
  - Architecture: Atomic Design pattern (`atoms`, `molecules`, `organisms`, `hooks`, `pages`).
- **ML Microservice (`skinwise-ml`):**
  - Python 3.10+ & FastAPI — High-performance REST microservice exposing `POST /classify` and `GET /health`.
  - SetFit & Sentence Transformers — Few-shot text classification fine-tuned on `BAAI/bge-small-en-v1.5` embeddings. [SetFit Docs](https://github.com/huggingface/setfit)
  - Hugging Face Hub — Model weights published and cached at `nyylisaa/skinwise-setfit-model`.
  - Deployment: Containerized with Docker and configured for Render (`render.yaml`).
- **Rule Engine & Detection:**
  - Pure TypeScript modules (`src/lib/engine.ts`, `src/lib/matrix.ts`, `src/lib/actives.ts`, `src/lib/detect.ts`, `src/lib/detect-ml.ts`, `src/lib/detect-safe.ts`).

## Where It Runs and How Someone Tries It
- **Prerequisites:** Node.js 18.18+ (20+ recommended) and Python 3.10+ with virtual environment.
- **Environment Configuration:**
  - `skinwise/.env.local`:
    ```bash
    ML_SERVICE_URL=http://localhost:8000
    ```
- **Start Commands:**
  - **Terminal 1 — Python ML Microservice:**
    ```powershell
    cd skinwise-ml
    .\venv\Scripts\Activate.ps1
    python main.py
    ```
  - **Terminal 2 — Next.js Application:**
    ```powershell
    cd skinwise
    npm run dev
    ```
- **Demo Verification URL:** Open `http://localhost:3000` in any web browser.

## Look and Feel
- **Theme:** Clinical laboratory utility paired with warm botanical editorial clarity.
- **Design Tokens:**
  - Background: Mint surface (`var(--sw-mint)`, `var(--sw-cream)`)
  - Cards: Pure white surface (`var(--sw-white)`) with subtle borders (`var(--sw-line)`) and soft shadow
  - Typography: Deep forest green (`var(--sw-forest)`) for headers, charcoal (`var(--sw-charcoal)`) for body copy, muted slate (`var(--sw-muted)`) for helpers
- **4-State Status Visuals:**
  - **CONFLICT / Not Recommended:** Red clinical badge (`var(--sw-danger-text)` on `var(--sw-danger-bg)`, border `var(--sw-danger)`)
  - **CAUTION / Use with Care:** Amber clinical badge (`var(--sw-amber-text)` on `var(--sw-amber-bg)`, border `var(--sw-amber)`)
  - **SAFE / Compatible:** Emerald clinical badge (`var(--sw-forest)` on `var(--sw-mint-tint)`, border `var(--sw-green)`)
  - **INSUFFICIENT_DATA / UNKNOWN:** Muted neutral badge (`var(--sw-muted)` on `var(--sw-cream)`, border `var(--sw-muted)`)

## Modules and Components

### Frontend Components (`src/features/compatibility/`, `src/pages/CompatibilityPage.tsx`)

#### PresetToolbar (`src/features/compatibility/organisms/PresetToolbar.tsx`)
- Top-mounted horizontal pill bar displaying three 1-click demo buttons:
  - "Load Conflict Demo" &rarr; The Ordinary Retinol 0.5% + Paula's Choice 2% BHA (evaluates to CONFLICT).
  - "Load Caution Demo" &rarr; The Ordinary Retinol 0.5% + SkinCeuticals C E Ferulic (evaluates to CAUTION).
  - "Load Safe Demo" &rarr; The Ordinary Retinol 0.5% + CeraVe Moisturising Cream (evaluates to SAFE).
- Resets current results and populates product slots immediately.

#### ProductInputCard (`src/features/compatibility/organisms/ProductInputCard.tsx`)
- Two responsive instances: Product A and Product B.
- Contains:
  - Preset select dropdown populated from `CATALOG` (`src/lib/preset.ts`), automatically excluding the product selected in the other slot.
  - Clear button to quickly wipe a slot.
  - Expandable INCI ingredient textarea with placeholder examples.
  - Real-time ingredient counter badge displaying parsed items (`parseIngredientList`).

#### ResultPanel (`src/features/compatibility/organisms/ResultPanel.tsx`)
- Mounted upon successful analysis response.
- Renders:
  - **VerdictHeader (`molecules/VerdictHeader.tsx`):** Large circular status icon (`StatusIcon`), severity badge (`SeverityBadge`), verdict title, biochemical explanation, and detected active pill tags (`IngredientTag`) grouped by product.
  - **Ingredient Interactions (`molecules/InteractionCard.tsx`):** Detailed breakdown cards for each conflicting compound pair with mechanism explanations.
  - **Timing Advice (`molecules/TimingAdvice.tsx`):** Routine scheduling guidance box with concrete instructions.
  - Reset action ("Check another combination") and cosmetic educational disclaimer.

### Backend & Rule Engine (`src/lib/`, `src/app/api/analyze/route.ts`)

#### SetFit ML Microservice (`skinwise-ml/main.py`)
- FastAPI service hosting fine-tuned SetFit model (`skinwise-setfit-model` or `nyylisaa/skinwise-setfit-model`).
- Endpoint: `POST /classify` taking `{ "ingredients": ["..."] }` and returning predicted canonical active categories.
- Lazy-loaded model initialization for rapid container boot.

#### Curated Override & Fallback Pipeline (`src/lib/detect-ml.ts`, `src/lib/detect-safe.ts`, `src/lib/detect.ts`)
- `src/lib/detect-ml.ts`: Calls `POST /classify` on the ML microservice and applies `CURATED_OVERRIDE` to safeguard against model drift on known pH adjusters (Citric Acid), chelators (Disodium EDTA), and surfactants.
- `src/lib/detect-safe.ts`: Wraps ML call with automatic error handling, falling back to `src/lib/detect.ts` regex engine when the ML service is unreachable.
- `src/lib/detect.ts`: Longest-alias-first regex index matching normalized INCI text against alias dictionaries.

#### Scientific Conflict Matrix (`src/lib/matrix.ts`)
- Maps pairwise active category interactions across `RETINOID`, `DIRECT_ACID`, `VITAMIN_C`, `NIACINAMIDE`, `PEPTIDE`, `ANTIOXIDANT`, `BARRIER_SUPPORT`, `HUMECTANT`, `SOOTHING`, `PIGMENT_REGULATOR`.
- Defines severity status (`CONFLICT`, `CAUTION`, `SAFE`), routine schedule (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`), biochemical mechanism, and user instructions.

#### Deterministic Rule Engine (`src/lib/engine.ts`)
- Pure evaluation function taking detected actives from both products and matching them against `src/lib/matrix.ts`.
- Gating rules:
  - If neither or only one product contains recognized actives &rarr; returns `INSUFFICIENT_DATA` / `UNKNOWN`.
  - If both have actives and match matrix rules &rarr; returns worst severity (`CONFLICT` > `CAUTION` > `SAFE`).
  - If both have actives but no verified rule exists &rarr; defaults safely to `CAUTION` with `UNKNOWN` schedule (never defaults to `SAFE`).
  - `SAFE` is strictly reachable only via an explicit verified compatibility rule.

#### Route Handler (`src/app/api/analyze/route.ts`)
- Next.js route handler for `POST /api/analyze`.
- Validates input presence, executes `analyzeCompatibility`, and returns structured `AnalyzeResponse`.

## Data Model (`src/types/analysis.ts` & `src/types/compatibility.ts`)

```typescript
// src/types/analysis.ts - Backend API Contract
export type Status = 'CONFLICT' | 'CAUTION' | 'SAFE' | 'UNKNOWN' | 'INSUFFICIENT_DATA';

export type Schedule =
  | 'LAYER_TOGETHER'
  | 'AM_PM_SPLIT'
  | 'ALTERNATE_DAYS'
  | 'UNKNOWN';

export interface AnalyzeRequest {
  product1Name?: string;
  product1Ingredients: string;
  product2Name?: string;
  product2Ingredients: string;
}

export interface ConflictPair {
  compound1: string;
  compound2: string;
  mechanism: string;
}

export interface AnalyzeResponse {
  status: Status;
  summaryTitle: string;
  activesProduct1: string[];
  activesProduct2: string[];
  conflictPairs: ConflictPair[];
  biochemicalExplanation: string;
  timingProtocol: {
    scheduleType: Schedule;
    guidanceText: string;
  };
  disclaimer: string;
}

// Aliases for legacy & UI compatibility
export type CompatibilityStatus = Status | 'INSUFFICIENT_DATA';
export type ScheduleType = Schedule | 'INERT';
export type AnalysisResult = AnalyzeResponse;
export type AnalyzeRequestBody = AnalyzeRequest;
```

```typescript
// src/types/compatibility.ts - Frontend UI State
export type Severity = "compatible" | "caution" | "not_recommended" | "unknown";

export interface ProductOption {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  ingredients: string;
}

export interface ProductDraft {
  presetId: string;
  name: string;
  ingredients: string;
}

export type ProductSlot = 1 | 2;
export type RequestStatus = "idle" | "loading" | "success" | "error";

export interface CompatibilityPreset {
  id: string;
  label: string;
  severity: Severity;
  description: string;
  product1Id: string;
  product2Id: string;
}
```

## File Structure
```
Skinwise-system/
├── skinwise/                             # Next.js 15 Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/analyze/route.ts      # Serverless route handler
│   │   │   ├── globals.css               # Clinical theme design tokens
│   │   │   ├── layout.tsx                # Root layout & font definition
│   │   │   └── page.tsx                  # App Router entry point
│   │   ├── features/compatibility/       # Atomic Design Architecture
│   │   │   ├── organisms/
│   │   │   │   ├── PresetToolbar.tsx     # 1-click benchmark demo presets
│   │   │   │   ├── ProductInputCard.tsx  # Product dropdown & INCI textarea
│   │   │   │   └── ResultPanel.tsx       # Verdict dashboard & interaction cards
│   │   │   ├── molecules/
│   │   │   │   ├── VerdictHeader.tsx     # Status badge, title, & active pills
│   │   │   │   ├── InteractionCard.tsx   # Pairwise mechanism details
│   │   │   │   ├── TimingAdvice.tsx      # Routine timing protocol card
│   │   │   │   ├── ProductSelector.tsx   # Catalog search & selection
│   │   │   │   └── IngredientInput.tsx   # Ingredient field formatting
│   │   │   ├── atoms/
│   │   │   │   ├── SeverityBadge.tsx     # Colored clinical severity badge
│   │   │   │   ├── StatusIcon.tsx        # High-contrast clinical status icon
│   │   │   │   ├── IngredientTag.tsx     # Active ingredient pill tag
│   │   │   │   └── severity.ts           # Severity mappings & theme tokens
│   │   │   ├── hooks/
│   │   │   │   └── useCompatibility.ts   # State management & analysis fetch
│   │   │   └── utils/
│   │   │       └── parseIngredients.ts   # INCI string parsing & counter
│   │   ├── pages/
│   │   │   └── CompatibilityPage.tsx     # Main compatibility checker view
│   │   ├── lib/
│   │   │   ├── preset.ts                 # Catalog products & demo presets
│   │   │   ├── actives.ts                # Canonical actives & alias catalog
│   │   │   ├── detect.ts                 # Longest-alias regex matching
│   │   │   ├── detect-ml.ts              # SetFit ML client & curated overrides
│   │   │   ├── detect-safe.ts            # Resilient ML-first with regex fallback
│   │   │   ├── matrix.ts                 # Scientific interaction conflict tables
│   │   │   └── engine.ts                 # Deterministic evaluation engine
│   │   └── types/
│   │       ├── analysis.ts               # Backend request/response types
│   │       └── compatibility.ts          # Frontend UI drafts & preset types
│   ├── devpost/                          # Hackathon planning & documentation
│   │   ├── learner-profile.md
│   │   ├── scope.md
│   │   ├── prd.md
│   │   └── spec.md
│   ├── .env.local                        # ML_SERVICE_URL configuration
│   └── package.json
└── skinwise-ml/                          # Python SetFit Machine Learning Service
    ├── main.py                           # FastAPI application (POST /classify)
    ├── train_model.py                    # SetFit few-shot training pipeline
    ├── training_data.csv                 # Core ingredient training dataset
    ├── extra_training.csv                # Non-target & formulation inactives
    ├── skinwise-setfit-model/            # Local exported model artifacts
    ├── Dockerfile                        # Container specification
    ├── render.yaml                       # Render cloud deployment config
    └── requirements.txt                  # Python dependencies
```

## External Services and Dependencies
- **SetFit ML Microservice (`skinwise-ml`):**
  - Hosted locally on port 8000 or deployed via Render web service.
  - Endpoints: `POST /classify` for ingredient classification; `GET /health` for readiness checks.
  - Base Model: `BAAI/bge-small-en-v1.5` embeddings via Sentence Transformers.
- **Offline Resilience:**
  - If the Python microservice is offline or delayed, `detect-safe.ts` automatically switches to the local TypeScript regex engine with zero interruption.

## Important Failure Modes
- **ML Microservice Unreachable or Latency:** Automatically caught by `detect-safe.ts` and redirected to `detectActives` (longest-alias regex index), logging a warning while completing the user analysis seamlessly.
- **Formulation pH Adjusters (False Positive Prevention):** Common inactive ingredients (e.g. Citric Acid at trailing percentages in cleansers) are protected by `CURATED_OVERRIDE` in `src/lib/detect-ml.ts` so they do not trigger erroneous AHA conflict warnings.
- **Missing or Incomplete Input:** "Check Compatibility" button remains disabled until both product cards contain ingredients, displaying clear helper text.
- **Missing Actives or Unrecognized Formulas:** Returns `INSUFFICIENT_DATA` / `UNKNOWN` advising users to patch test.
- **Unverified Dual-Active Pairs:** Defaults conservatively to `CAUTION` with `UNKNOWN` schedule (never defaults to `SAFE`).

## What Was Simplified and Why
- **Hybrid ML & Rule Engine:** Few-shot ML provides semantic ingredient understanding across spelling variations, while deterministic matrix rules prevent hallucination and guarantee 100% reproducible chemical safety verdicts.
- **Static In-Memory Presets & Catalog:** Curated catalog in `src/lib/preset.ts` guarantees instant, reliable demo data without fragile external web scraping dependencies.
- **Session-Only Client State:** Eliminates unnecessary authentication overhead for an instant pairwise verification tool.

## Decisions and Open Issues
- **Framework Choice:** Next.js 15 (App Router) + Atomic Design structure for clean separation of concerns and rapid rendering.
- **AI Architecture:** SetFit few-shot classification for ingredient detection + Deterministic Matrix for safety evaluation + Curated override guardrail to prevent false positives.
- **Open Questions:** None blocking implementation. All endpoints, components, models, and test cases are verified and passing.
