---
doc: prd
status: approved
---

# SkinWise — Product Requirements Document

An instant pairwise skincare compatibility engine that detects conflicting active ingredients and generates actionable timing protocols for consumers introducing new active products.
Source: `scope.md > Who It's For`, `scope.md > The Core Loop`.

## The Core Journey
1. **Arrival & Initial Load:** The user lands on the single-page web app. The interface displays the top "Demo Quick-Load" toolbar (`components/PresetToolbar.tsx`), and the two product cards (`components/ProductInputCard.tsx`) are pre-populated with Case 1 (Paula's Choice 2% BHA and The Ordinary 0.5% Retinol) so the app is immediately demonstrative.
2. **Preset Selection, Ingredient Autocomplete, or Custom Input:** The user can either keep the pre-filled products, click a quick-load demo button, select a product from each card's preset dropdown (populated from `lib/presets.ts`), search and select recognized active ingredients from `lib/actives.ts`, or paste custom INCI ingredients into either card's editable textarea. The card provides upfront recognition feedback—displaying recognized active chips or alerting the user if an entered ingredient is unrecognized by the system before evaluating.
3. **Execution:** The user clicks the primary "Check Compatibility" button. The client sends the payload to `app/api/analyze/route.ts`. The server executes the Hybrid ML & Rule Engine:
   - A SetFit Few-Shot Classifier replaces basic regex to parse and extract recognized active compounds by semantic meaning.
   - `lib/matrix.ts` cross-references the compounds against scientific active conflict tables.
   - `lib/engine.ts` deterministically evaluates the compatibility verdict, conflict pairs, and schedule type.
   - `lib/gemini.ts` is invoked optionally to synthesize a crisp natural language summary and biochemical explanation.
4. **Result Delivery:** The results panel (`components/ResultPanel.tsx`) renders directly beneath the input cards, featuring:
   - High-contrast 4-state verdict badge (**CONFLICT**, **CAUTION**, **SAFE**, or **INSUFFICIENT_DATA**).
   - Side-by-side detected active compound pill tags.
   - Plain-English biochemical risk explanation (2 sentences).
   - Actionable timing protocol with concrete scheduling guidance (AM vs. PM, alternating evenings, or cautious patch-test advice).
5. **Iteration / Retest:** The user can switch inputs, adjust text, or click another demo preset to immediately test a new combination.

## Screens and Layout
A single responsive web surface (`app/page.tsx`) with a focused, top-to-bottom layout:
- **Header & Demo Toolbar (`components/PresetToolbar.tsx`):** App title with a concise subtitle, followed by three 1-click preset pill buttons: "Load Conflict Demo" (Case 1), "Load Caution Demo" (Case 2), and "Load Safe Demo" (Case 3).
- **Dual Product Input Cards (`components/ProductInputCard.tsx`):** Side-by-side grid (stacks vertically on mobile screens):
  - **Card 1 (Product 1):** Header, preset select dropdown, searchable recognized active ingredient selector/autocomplete, expandable/editable INCI textarea, and live active preview tags (recognized active pills and upfront unrecognized ingredient indicator).
  - **Card 2 (Product 2):** Header, preset select dropdown, searchable recognized active ingredient selector/autocomplete, expandable/editable INCI textarea, and live active preview tags (recognized active pills and upfront unrecognized ingredient indicator).
- **Action Bar:** Centered, prominent "Check Compatibility" button with disabled and loading states.
- **Result Panel (`components/ResultPanel.tsx`):** Card container revealing the 4-state status badge, active pills, biochemical explanation, and timing schedule upon successful evaluation.

## Look and Feel
- **Theme & Aesthetic:** Modern clinical laboratory aesthetic in crisp light mode. Clean, scientific, high-contrast, and reassuring.
- **Color Palette:**
  - Background: Crisp off-white (`slate-50`).
  - Card Surfaces: Pure white (`white`) with subtle borders (`slate-200`) and soft elevation.
  - Text & Accents: Dark slate (`slate-900`) for headers, muted slate (`slate-600`) for labels and notes.
- **4-State Status Badges:**
  - **CONFLICT:** Rose/Ruby badge (`rose-600` text/border on `rose-50` background).
  - **CAUTION:** Amber badge (`amber-600` text/border on `amber-50` background).
  - **SAFE:** Emerald badge (`emerald-600` text/border on `emerald-50` background).
  - **INSUFFICIENT_DATA:** Slate badge (`slate-700` text/border on `slate-100` background).
- **Typography:** Clean technical sans-serif (`Inter` or `Geist`) for UI headers and body instructions; subtle monospace (`font-mono`) for chemical compounds, percentages, and INCI ingredient tags. No cartoon emojis or distracting gradients.

## Features and Behavior

### Quick-Load Demo Presets
Source: `scope.md > What "Working" Looks Like`
- As a judge or user, I want 1-click access to benchmark test cases so that I can see the app's full capabilities in under 30 seconds.
  - [ ] Clicking "Load Conflict Demo" loads Paula's Choice 2% BHA in Card 1 and The Ordinary 0.5% Retinol in Card 2 &rarr; Evaluates to **CONFLICT**.
  - [ ] Clicking "Load Caution Demo" loads SkinCeuticals C E Ferulic in Card 1 and Paula's Choice 2% BHA in Card 2 &rarr; Evaluates to **CAUTION**.
  - [ ] Clicking "Load Safe Demo" loads The Ordinary 0.5% Retinol in Card 1 and CeraVe PM Moisturizing Lotion in Card 2 &rarr; Evaluates to **SAFE**.
  - [ ] Loading a demo preset resets the result panel and enables the "Check Compatibility" button.

### Product Input & Ingredient Handling
Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`
- As a user, I want to pick known products, search recognized ingredients, or paste raw ingredient lists so that I can check both popular and custom skincare items with total transparency about what the system can evaluate.
  - [ ] Selecting a preset from the dropdown populates the product name and fills the textarea with its complete INCI formula from `lib/presets.ts`.
  - [ ] **Recognized Ingredient Search & Autocomplete:** Typing in the ingredient selector triggers autocomplete suggestions from `KNOWN_ACTIVES` (`lib/actives.ts`). Selecting an ingredient appends it to the product's formula and displays a verified active pill tag.
  - [ ] **Upfront Active Recognition Chips:** As formulas are chosen or typed, the card displays real-time badges of detected active classes (e.g. `Retinoid`, `Direct Acid`, `Vitamin C`, `Niacinamide`, `Barrier Support`).
  - [ ] **Explicit Unrecognized Ingredient Warning:** If an ingredient or formula does not match any compound in the system's verified active database, the card displays an inline notice: *"⚠️ One or more ingredients are not in the SkinWise database. The system cannot evaluate compatibility for uncataloged ingredients — do not assume they are safe to combine."* This prevents users from assuming unlisted dangerous ingredients are safe.
  - [ ] The ingredient textarea remains freely editable so users can add, remove, or modify ingredients.
  - [ ] If either Product 1 or Product 2 card has an empty textarea, the "Check Compatibility" button is disabled and displays an inline guidance note: "Select or input two products to evaluate compatibility."

### Compatibility Analysis & Deterministic Rule Engine
Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`
- As a user, I want reliable, scientifically grounded conflict detection and actionable scheduling advice without AI hallucinations.
  - [ ] Clicking "Check Compatibility" sends both product inputs to `app/api/analyze/route.ts`.
  - [ ] Displays a visual loading spinner and disables the button during processing.
  - [ ] **Ingredient Classification (SetFit):** Replaces legacy regex parsing. A small SetFit model takes ingredients and predicts their active compound signatures (Retinoids, AHAs, BHAs, L-Ascorbic Acid, Niacinamide, Peptides, Ceramides) based on semantic meaning.
  - [ ] **Conflict Matrix Lookup (`lib/matrix.ts`):** Checks recognized actives against pre-verified scientific conflict tables.
  - [ ] **Deterministic Evaluation (`lib/engine.ts`):** Evaluates interaction status into a strict 4-state verdict (**CONFLICT**, **CAUTION**, **SAFE**, or **INSUFFICIENT_DATA**), extracts conflict pairs, and assigns the appropriate timing protocol (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`, `UNKNOWN`).
  - [ ] **Optional Gemini Summaries (`lib/gemini.ts`):** When enabled, generates a natural language summary and biochemical rationale constrained strictly by the deterministic verdict; if disabled or offline, built-in rule rationales are returned seamlessly.
  - [ ] **Conflict Case:** For conflicting actives (e.g., BHA + Retinol), outputs a Red **CONFLICT** badge, identifies the offending actives, explains the barrier peeling risk in 2 plain-English sentences, and provides an alternating evening schedule (`ALTERNATE_DAYS`).
  - [ ] **Caution Case:** For caution pairs (e.g., L-Ascorbic Acid + BHA), outputs a Yellow **CAUTION** badge, identifies low-pH stacking risk, and provides an AM/PM routine split (`AM_PM_SPLIT`).
  - [ ] **Safe Case (Explicit Rule Match Only):** Only reachable when an explicit verified compatibility rule is matched in the matrix (e.g., Retinol + Ceramides/Barrier Lipids). Outputs a Green **SAFE** badge, highlights barrier buffering benefits, and provides a PM layering sequence (`LAYER_TOGETHER`).
  - [ ] **Unverified Combinations:** For combinations where both products have recognized actives but no rule exists in the matrix, defaults conservatively to a Yellow **CAUTION** badge with `UNKNOWN` schedule (never defaults to `SAFE`).
  - [ ] **Insufficient Data Case:** When neither product or only one product contains recognized active ingredients, outputs a Slate **INSUFFICIENT_DATA** badge with `UNKNOWN` schedule, warning users that safety cannot be confirmed from unrecognized formulas.

## Architecture and File Structure Reference
To ensure clean modularity and separation of concerns:
- **Shared Schema:**
  - `types/analysis.ts`: Shared Zod schema and TypeScript interfaces for request inputs (`AnalyzeRequestSchema`) and response outputs (`AnalysisResponseSchema`).
- **Backend & Rule Engine:**
  - SetFit Classifier microservice / Python script: Few-shot ML model for robust semantic ingredient categorization, replacing fragile regex (`lib/actives.ts`).
  - `lib/matrix.ts`: Active conflict tables and scientific interaction rules.
  - `lib/engine.ts`: Core deterministic evaluation logic computing status, conflict pairs, and timing protocols.
  - `lib/gemini.ts`: Optional Google Gemini client for generating natural language summaries and biochemical rationales.
  - `app/api/analyze/route.ts`: Serverless API route orchestrating parsing, evaluation, optional LLM summaries, and Zod response validation.
- **Frontend:**
  - `components/`: Modular UI presentation components (`PresetToolbar.tsx`, `ProductInputCard.tsx`, `ResultPanel.tsx`).
  - `app/page.tsx`: Single-page client orchestrator managing inputs, loading state, and results.
  - `lib/presets.ts`: Static benchmark skincare products and INCI formulas.

## States and Boundaries
- **Initial Load State:** Pre-populated with Case 1 (Paula's Choice BHA + The Ordinary Retinol); "Check Compatibility" button is enabled; result panel is empty/hidden.
- **Incomplete / Missing Input State:** If either card's textarea is empty, "Check Compatibility" is disabled with an inline helper note.
- **Loading State:** "Check Compatibility" button shows a spinner and disabled state; inputs are locked during analysis.
- **Success State:** Result panel displays 4-state verdict badge (**CONFLICT**, **CAUTION**, **SAFE**, or **INSUFFICIENT_DATA**), detected active pills, risk rationale, and actionable scheduling protocol.
- **Insufficient Data State:** When neither product or only one product has recognized actives, returns a Slate **INSUFFICIENT_DATA** badge with `UNKNOWN` schedule, advising users to patch test and verify ingredients rather than assuming unverified safety.
- **LLM Fallback & Offline State:** If Gemini is unavailable, rate-limited, or disabled, the deterministic engine supplies default scientific rationales and protocols directly without failing or stalling.
- **API Error / Malformed Input State:** Displays a dismissible warning toast with an inline "Retry Analysis" button without wiping user text.
- **Persistence Boundary:** Session-only in-memory state; no database or local storage persistence required for this PoC.

## Product Decisions
- **Deterministic Rule Engine over Pure LLM Calls:** Skincare interactions involve physical skin barrier health and chemical safety. Relying exclusively on LLM prompts introduces hallucination risks, latency, and unpredictable responses. Moving parsing, conflict lookup, and evaluation into a deterministic engine (`lib/actives.ts`, `lib/matrix.ts`, `lib/engine.ts`) guarantees 100% reproducible, scientifically sound verdicts, using Gemini (`lib/gemini.ts`) strictly for optional natural language summarization.
- **Pre-populated First Load:** Pre-filling Case 1 immediately on launch prevents an empty void and allows one-click demo verification in under one second.
- **Top Quick-Load Toolbar:** Dedicated buttons for all three demo cases ensure deterministic, rapid testing during hackathon reviews and video recording.
- **Editable INCI Textarea:** Pairing preset dropdowns with editable textareas gives users the convenience of presets with the flexibility of custom inputs.
- **Conservative Scientific Gating over Permissive Fallbacks:** Changed from 3-state to 4-state logic. Assuming unlisted, unrecognized, or inert formulas are 'SAFE' creates false confidence. Missing or single-sided actives return **`INSUFFICIENT_DATA`**, unverified multi-active combinations default to **`CAUTION`**, and **`SAFE`** is strictly reserved for combinations backed by an explicit positive compatibility rule in the scientific matrix.
- **Upfront Ingredient Recognition & Unrecognized Warning vs. Silent Free-Text Pasting:** Free-form text fields without upfront feedback create a critical hazard: if a user enters a potent or dangerous chemical that the system does not recognize (e.g., Benzoyl Peroxide, Hydroquinone), a lack of explicit feedback could mislead them into assuming the product has no risks. Adding searchable recognized active selection alongside immediate unrecognized ingredient warnings ensures users understand the exact boundaries of the system's scientific knowledge before running an analysis.

## What We're Building
- Single-page responsive interface with quick-load demo toolbar (`components/PresetToolbar.tsx`), dual product input cards featuring searchable recognized active selectors and live recognition chips (`components/ProductInputCard.tsx`), action button, and structured result panel (`components/ResultPanel.tsx`).
- Deterministic Rule Engine (`lib/actives.ts`, `lib/matrix.ts`, `lib/engine.ts`) with shared Zod validation schemas (`types/analysis.ts`).
- Serverless API route (`app/api/analyze/route.ts`) supporting optional Gemini natural language summaries (`lib/gemini.ts`).
- High-contrast clinical laboratory styling with 4-state status badges (**CONFLICT**, **CAUTION**, **SAFE**, **INSUFFICIENT_DATA**) and monospace chemical tags.
- Full error, empty, insufficient data, unverified combination, and LLM fallback handling.

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
- None blocking implementation. All interactions, engine rules, file boundaries, schemas, and styling parameters are finalized.
