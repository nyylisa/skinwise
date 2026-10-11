---
doc: prd
status: approved
---

# SkinWise — Product Requirements Document

An instant pairwise skincare compatibility engine that detects conflicting active ingredients and generates actionable timing protocols for consumers introducing new active products.
Source: `scope.md > Who It's For`, `scope.md > The Core Loop`.

## The Core Journey
1. **Arrival & Initial Load:** The user lands on the single-page web app. The interface displays the top "Demo Quick-Load" toolbar (`PresetToolbar.tsx`), and the two product cards (`ProductInputCard.tsx`) are ready for input or preset loading.
2. **Preset Selection or Custom INCI Input:** The user can pick one-click demo presets from the toolbar, select known products from each card's curated catalog dropdown (`src/lib/preset.ts`), or paste custom INCI ingredients into either card's editable textarea. The card provides instant count feedback on parsed ingredients.
3. **Execution:** The user clicks the primary "Check Compatibility" button. The client sends `{ product1Name, product1Ingredients, product2Name, product2Ingredients }` to `src/app/api/analyze/route.ts`. The server executes the Hybrid ML & Rule Engine:
   - `src/lib/detect-safe.ts` sends ingredients to the SetFit ML microservice (`POST /classify`), with semantic predictions protected by a curated override map in `src/lib/detect-ml.ts` (guarding against false positives on pH adjusters like Citric Acid and chelators like Disodium EDTA). If the ML microservice is unreachable, it seamlessly falls back to a longest-alias regex index (`src/lib/detect.ts`).
   - `src/lib/matrix.ts` cross-references detected active categories against scientific interaction rules.
   - `src/lib/engine.ts` deterministically computes the compatibility verdict, conflict pairs with mechanisms, and timing protocol schedule.
4. **Result Delivery:** The results panel (`ResultPanel.tsx`) mounts beneath the input cards, featuring:
   - High-contrast 4-state verdict header badge (**CONFLICT / Not Recommended**, **CAUTION / Use with Care**, **SAFE / Compatible**, or **INSUFFICIENT_DATA / UNKNOWN**).
   - Side-by-side detected active ingredient tags for Product A and Product B.
   - Plain-English biochemical interaction mechanisms and risk explanation.
   - Actionable timing advice with concrete routine scheduling guidance (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`, or `UNKNOWN`).
5. **Iteration / Retest:** The user can clear inputs, modify ingredients, or click "Check another combination" / another demo preset to immediately test a new pair.

## Screens and Layout
A single responsive web surface (`src/app/page.tsx` hosting `src/pages/CompatibilityPage.tsx`) structured via Atomic Design:
- **Header & Demo Toolbar (`src/features/compatibility/organisms/PresetToolbar.tsx`):** Clinical title and descriptive subtitle, followed by three 1-click preset buttons:
  - "Load Conflict Demo" (Retinol + 2% BHA)
  - "Load Caution Demo" (Retinol + Vitamin C)
  - "Load Safe Demo" (Retinol + CeraVe Moisturising Cream)
- **Dual Product Input Cards (`src/features/compatibility/organisms/ProductInputCard.tsx`):** Responsive grid (Product A and Product B, side-by-side on desktop, stacked on mobile):
  - Catalog product selector dropdown from `CATALOG` (`src/lib/preset.ts`), dynamically excluding the other card's selection.
  - Clear button to quickly reset a slot.
  - Expandable/editable INCI textarea with placeholder examples.
  - Live ingredient counter displaying parsed ingredients.
- **Action Bar:** Centered, prominent "Check Compatibility" button with disabled, missing input hint, and spinner loading states.
- **Result Panel (`src/features/compatibility/organisms/ResultPanel.tsx`):**
  - **VerdictHeader (`molecules/VerdictHeader.tsx`):** Large circular status icon, severity badge (`atoms/SeverityBadge.tsx`), summary title, plain-English biochemical rationale, and detected active pill tags (`atoms/IngredientTag.tsx`) for each product.
  - **Ingredient Interactions (`molecules/InteractionCard.tsx`):** Cards breaking down each interacting compound pair with specific mechanisms.
  - **Timing Advice (`molecules/TimingAdvice.tsx`):** Highlighted routine timing protocol card.
  - Reset action ("Check another combination") and clear cosmetic disclaimer.

## Look and Feel
- **Theme & Aesthetic:** Modern clinical laboratory aesthetic paired with warm botanical editorial tones. Clean, scientific, high-contrast, and reassuring.
- **Color System (Design Tokens):**
  - Background: Mint surface (`var(--sw-mint)` / `var(--sw-cream)`).
  - Card Surfaces: Clean white (`var(--sw-white)`) with refined borders (`var(--sw-line)`).
  - Text & Accents: Deep forest green (`var(--sw-forest)`) for headings, charcoal (`var(--sw-charcoal)`) for body copy, muted slate (`var(--sw-muted)`) for metadata.
- **4-State Status Badges:**
  - **CONFLICT / Not Recommended:** Red clinical badge (`var(--sw-danger-text)` on `var(--sw-danger-bg)`, border `var(--sw-danger)`).
  - **CAUTION / Use with Care:** Amber clinical badge (`var(--sw-amber-text)` on `var(--sw-amber-bg)`, border `var(--sw-amber)`).
  - **SAFE / Compatible:** Emerald clinical badge (`var(--sw-forest)` on `var(--sw-mint-tint)`, border `var(--sw-green)`).
  - **INSUFFICIENT_DATA / UNKNOWN:** Muted neutral badge (`var(--sw-muted)` on `var(--sw-cream)`, border `var(--sw-muted)`).
- **Typography:** Modern clean sans-serif for UI headers and body copy, with crisp pill tags for active ingredients and chemical categories.

## Features and Behavior

### Quick-Load Demo Presets
Source: `scope.md > What "Working" Looks Like`
- As a judge or user, I want 1-click access to benchmark test cases so that I can see the app's full capabilities in under 30 seconds.
  - [x] Clicking "Load Conflict Demo" loads The Ordinary Retinol 0.5% in Card A and Paula's Choice 2% BHA in Card B &rarr; Evaluates to **CONFLICT / Not Recommended** (`ALTERNATE_DAYS`).
  - [x] Clicking "Load Caution Demo" loads The Ordinary Retinol 0.5% in Card A and SkinCeuticals C E Ferulic in Card B &rarr; Evaluates to **CAUTION / Use with Care** (`AM_PM_SPLIT`).
  - [x] Clicking "Load Safe Demo" loads The Ordinary Retinol 0.5% in Card A and CeraVe Moisturising Cream in Card B &rarr; Evaluates to **SAFE / Compatible** (`LAYER_TOGETHER`).
  - [x] Loading a demo preset resets the result panel and enables the "Check Compatibility" button.

### Product Input & Ingredient Handling
Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`
- As a user, I want to pick known products from a library or paste raw ingredient lists so that I can evaluate both benchmark products and custom formulations.
  - [x] Selecting a preset from the dropdown populates the product name and fills the textarea with its complete INCI formula from `src/lib/preset.ts`.
  - [x] Dropdown options in Card A exclude the product selected in Card B, and vice-versa.
  - [x] The ingredient textarea remains freely editable so users can add, remove, or modify ingredients.
  - [x] Live ingredient count indicator updates dynamically as users paste or edit formulas.
  - [x] If either Card A or Card B has an empty textarea, the "Check Compatibility" button is disabled and displays an inline guidance note: "Add ingredients for both products to run a check."

### Compatibility Analysis & Deterministic Rule Engine
Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`
- As a user, I want reliable, scientifically grounded conflict detection and actionable scheduling advice without AI hallucinations.
  - [x] Clicking "Check Compatibility" sends both product inputs to `src/app/api/analyze/route.ts`.
  - [x] Displays a visual loading spinner and disables the button during processing.
  - [x] **Ingredient Classification (SetFit Microservice):** Python FastAPI microservice hosting a SetFit few-shot model (`skinwise-ml`) fine-tuned on BGE embeddings to classify ingredients into canonical active categories.
  - [x] **Curated Override Guardrail:** A lookup override map in `src/lib/detect-ml.ts` prevents model drift on known pH adjusters, chelators, and formulation inactives (e.g., Citric Acid, Disodium EDTA, Sodium Cocoyl Glycinate).
  - [x] **Offline Regex Fallback:** `src/lib/detect-safe.ts` automatically falls back to the longest-alias regex index (`src/lib/detect.ts`) if the ML service is offline.
  - [x] **Conflict Matrix Lookup (`src/lib/matrix.ts`):** Cross-references recognized actives against verified interaction rules across Retinoids, Direct Acids, Vitamin C, Peptides, Niacinamide, Barrier Support, Humectants, and Soothing ingredients.
  - [x] **Deterministic Evaluation (`src/lib/engine.ts`):** Evaluates interaction status into a strict 4-state verdict (**CONFLICT**, **CAUTION**, **SAFE**, or **INSUFFICIENT_DATA** / **UNKNOWN**), extracts conflict pairs, and assigns the appropriate timing protocol (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`, `UNKNOWN`).
  - [x] **Conflict Case:** Outputs Red **CONFLICT** badge, identifies offending actives, explains barrier peeling/irritation risk, and prescribes alternating evenings (`ALTERNATE_DAYS`).
  - [x] **Caution Case:** Outputs Amber **CAUTION** badge, identifies high-potency stacking or stability concerns, and prescribes AM/PM routine split (`AM_PM_SPLIT`).
  - [x] **Safe Case (Explicit Rule Match Only):** Only reachable when an explicit verified compatibility rule is matched in the matrix (e.g., Retinol + Barrier Support). Outputs Green **SAFE** badge, highlights barrier buffering synergy, and prescribes PM layering (`LAYER_TOGETHER`).
  - [x] **Unverified Combinations:** For combinations where both products have recognized actives but no rule exists in the matrix, defaults conservatively to an Amber **CAUTION** badge with `UNKNOWN` schedule (never defaults to `SAFE`).
  - [x] **Insufficient Data Case:** When neither product or only one product contains recognized active ingredients, outputs a Slate **INSUFFICIENT_DATA** / **UNKNOWN** badge with `UNKNOWN` schedule, advising patch-testing.

## Architecture and File Structure Reference
To ensure clean modularity and separation of concerns:
- **Shared Schemas & Types:**
  - `src/types/analysis.ts`: Core API contracts for `AnalyzeRequest`, `AnalyzeResponse`, `Status`, `Schedule`, and `ConflictPair`.
  - `src/types/compatibility.ts`: Frontend UI types for `ProductDraft`, `ProductOption`, `CompatibilityPreset`, and `Severity`.
- **Frontend (Atomic Design):**
  - `src/features/compatibility/organisms/`: `PresetToolbar.tsx`, `ProductInputCard.tsx`, `ResultPanel.tsx`
  - `src/features/compatibility/molecules/`: `VerdictHeader.tsx`, `InteractionCard.tsx`, `TimingAdvice.tsx`, `ProductSelector.tsx`
  - `src/features/compatibility/atoms/`: `SeverityBadge.tsx`, `StatusIcon.tsx`, `IngredientTag.tsx`, `severity.ts`
  - `src/features/compatibility/hooks/`: `useCompatibility.ts` (client state, data-fetching, abort controller)
  - `src/pages/CompatibilityPage.tsx`: Single-page compatibility checker coordinator.
  - `src/app/page.tsx`: Next.js App Router entry point.
- **Backend & Rule Engine:**
  - `src/app/api/analyze/route.ts`: API route handler orchestrating parsing, evaluation, and response delivery.
  - `src/lib/preset.ts`: Curated skincare catalog and demo benchmark presets.
  - `src/lib/actives.ts`: Canonical active categories, ingredient definitions, and alias mappings.
  - `src/lib/detect.ts`: Longest-alias regex matching engine with INCI normalization.
  - `src/lib/detect-ml.ts`: HTTP client for SetFit ML microservice with curated override guardrail.
  - `src/lib/detect-safe.ts`: Resilient wrapper providing automatic fallback from ML to regex.
  - `src/lib/matrix.ts`: Scientific pairwise interaction rules and timing protocols.
  - `src/lib/engine.ts`: Core deterministic evaluation logic.
- **ML Microservice (`skinwise-ml/`):**
  - `main.py`: FastAPI server exposing `POST /classify` and `GET /health` with lazy model loading.
  - `train_model.py`: SetFit few-shot training pipeline using `BAAI/bge-small-en-v1.5` embeddings.
  - `skinwise-setfit-model/`: Local exported SetFit model artifacts.
  - `render.yaml` & `Dockerfile`: Production deployment configuration for Render / cloud containers.

## States and Boundaries
- **Initial Load State:** Clean inputs ready for selection; "Check Compatibility" disabled until both cards have ingredients; result panel hidden.
- **Incomplete / Missing Input State:** If either card lacks ingredients, button is disabled with inline helper notice.
- **Loading State:** "Check Compatibility" displays spinner and disabled state; inputs locked during evaluation.
- **Success State:** Result panel displays 4-state verdict badge, detected active tags per product, biochemical mechanism breakdown, and timing protocol.
- **Insufficient Data State:** Returns `INSUFFICIENT_DATA` / `UNKNOWN` with advice to patch test when actives are absent.
- **ML Fallback & Offline Resilience:** If the ML microservice is unreachable, `detect-safe.ts` falls back to the deterministic regex engine with zero user disruption.
- **API Error State:** Renders inline alert banner with descriptive error message without clearing user text.
- **Persistence Boundary:** Session-only in-memory state; no database or login required.

## Product Decisions
- **Deterministic Rule Engine over Pure LLM Calls:** Skincare interactions involve physical skin barrier health and chemical safety. Relying exclusively on LLM prompts introduces hallucination risks and unpredictable outputs. Moving evaluation into a deterministic matrix (`src/lib/matrix.ts`, `src/lib/engine.ts`) guarantees 100% reproducible, scientifically sound verdicts.
- **Few-Shot SetFit ML for Parsing with Curated Overrides:** Raw cosmetic INCI lists contain diverse chemical synonyms and formatting variations. Few-shot SetFit embeddings provide semantic recognition, while a curated override guardrail (`src/lib/detect-ml.ts`) guarantees that known pH adjusters (like Citric Acid) never trigger false positive acid conflicts.
- **Top Quick-Load Toolbar:** Dedicated 1-click buttons for all three benchmark test cases ensure immediate, reproducible demonstration during hackathon judging and reviews.
- **Conservative Scientific Gating:** Combinations with recognized actives but no verified matrix rule default to **`CAUTION`** rather than assuming safety, and missing actives yield **`INSUFFICIENT_DATA`**. **`SAFE`** is strictly reserved for combinations backed by an explicit compatibility rule.

## What We're Building
- Single-page responsive interface with quick-load demo toolbar, dual product input cards with catalog selection and live counters, and structured result panel with interaction cards and timing advice.
- Hybrid ML & Deterministic Rule Engine with FastAPI SetFit microservice, curated override guardrail, regex fallback, and pairwise scientific matrix.
- Clean Atomic Design component hierarchy (`atoms`, `molecules`, `organisms`) and type-safe data contracts.
- High-contrast clinical laboratory styling with 4-state status indicators.

## Deferred From the POC
- Multi-product routine analysis (evaluating 3+ products simultaneously).
- Saving routines locally or bookmarking favorite pairs.
- Camera / OCR label scanning for bottle packaging.

## Non-Goals
- User authentication and accounts (zero friction for immediate usage).
- Web scraping pipelines or dynamic external cosmetic databases (eliminates fragile dependencies).
- E-commerce or affiliate shopping links (preserves pure clinical utility).
- Routine calendars or habit tracking (avoids unnecessary state complexity).
- Medical diagnosis or dermatology triage (liability risk outside ingredient compatibility).
- Free-form conversational assistant (enforces structured, deterministic results).

## Open Questions
- None blocking implementation. All components, schemas, endpoints, and fallbacks are fully implemented and verified.
