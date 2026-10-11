---
doc: scope
status: approved
---

# SkinWise

An instant pairwise skincare compatibility engine that detects conflicting active ingredients and generates actionable timing protocols.

## The Unique Kernel
Rather than relying on unconstrained LLM calls that risk chemical hallucination or issuing generic binary warnings ("do not combine"), SkinWise pairs a deterministic skincare compatibility rule engine with actionable resolution protocols. Active ingredient parsing and interaction evaluations are calculated via strict scientific conflict tables, with Gemini used optionally for natural language explanations. It tells users exactly *how* to safely incorporate both products (e.g., AM vs. PM separation or alternating evenings) so they never compromise their skin barrier or waste expensive skincare purchases.

## Who It's For
A daily skincare consumer introducing a new active product (e.g., Retinol, AHA/BHA exfoliants, or L-Ascorbic Acid) into their existing routine. Today, they spend hours sifting through contradictory forum posts, deciphering 30-item INCI chemical labels, and guessing whether their products will cause chemical burns.

## The Core Loop
The user selects two products from the curated catalog dropdown or pastes raw INCI ingredient lists into side-by-side cards. An instant ingredient counter provides feedback on detected items. Within seconds of clicking "Check Compatibility", they receive:
1. High-contrast 4-state verdict badge: **CONFLICT / Not Recommended** (Red), **CAUTION / Use with Care** (Amber), **SAFE / Compatible** (Green), or **INSUFFICIENT_DATA / UNKNOWN** (Muted Slate).
2. Detected active ingredient tags grouped by product (e.g., Retinol, Salicylic Acid).
3. Plain-English biochemical interaction explanations and mechanism details.
4. Actionable timing protocol with routine instructions (e.g., alternate days, AM/PM separation, or layering guidance).

They repeat this loop whenever purchasing or layering a new active bottle.

## Inspiration & Identity
- **Tone:** Clean, scientific, high-contrast, reassuring, and immediate.
- **Feel:** Modern clinical laboratory utility and editorial clarity—not a wellness blog, sponsored influencer guide, or sluggish conversational assistant.

## Why This Matters to the Learner
To master spec-driven agent discipline and controlled AI architecture: decoupling deterministic safety rules (matrix evaluation and formulation guardrails) from AI capabilities (few-shot semantic ingredient classification), enforcing strict scope boundaries, and solving a frustrating everyday problem that causes real skin irritation.

## What "Working" Looks Like
A crisp 1-minute video demo proving the end-to-end evaluation flow across three concrete benchmark cases:
1. **Red (CONFLICT):** The Ordinary 0.5% Retinol + Paula's Choice 2% BHA (Salicylic Acid) &rarr; Flags increased irritation and barrier peeling risk; prescribes alternating evenings (`ALTERNATE_DAYS`).
2. **Amber (CAUTION):** The Ordinary 0.5% Retinol + SkinCeuticals C E Ferulic (15% L-Ascorbic Acid) &rarr; Flags layering high-potency actives together; prescribes AM (Vitamin C) vs. PM (Retinol) split (`AM_PM_SPLIT`).
3. **Green (SAFE):** The Ordinary 0.5% Retinol + CeraVe Moisturising Cream (Ceramides / Barrier Lipids) &rarr; Highlights barrier buffering synergy; prescribes layering together in the evening (`LAYER_TOGETHER`).

## The POC Boundary
**In Scope:**
- Single-page responsive interface with side-by-side product input cards and quick-load demo toolbar (`src/app/page.tsx`, `src/pages/CompatibilityPage.tsx`, `src/features/compatibility/`).
- Curated catalog presets for popular active skincare products (`src/lib/preset.ts`) + expandable manual INCI ingredient textboxes with real-time parsed ingredient counter.
- **Hybrid ML & Rule Engine Architecture:**
  - **Few-Shot ML Ingredient Classifier (SetFit):** Microservice in `skinwise-ml` fine-tuned on `BAAI/bge-small-en-v1.5` embeddings, accurately categorizing active compounds even with spelling variations or synonyms.
  - **Curated Override & Regex Fallback:** `src/lib/detect-ml.ts` applies a curated override map (preventing false positives on common formulation pH adjusters like Citric Acid and chelators like Disodium EDTA) and `src/lib/detect-safe.ts` provides instant fallback to a longest-alias-first regex index (`src/lib/detect.ts`) if the ML service is offline.
  - **Scientific Conflict Tables (`src/lib/matrix.ts`):** Mapping pairwise interactions across Retinoids, Direct Acids (AHA/BHA), Vitamin C, Niacinamide, Peptides, Barrier Support, Humectants, and Soothing actives.
  - **Deterministic Evaluation Engine (`src/lib/engine.ts`):** Computes 4-state verdict badges (**CONFLICT**, **CAUTION**, **SAFE**, **INSUFFICIENT_DATA** / **UNKNOWN**), conflict pairs, and routine timing protocols (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`, `UNKNOWN`) without risk of hallucination.
  - **Server Route Handler (`src/app/api/analyze/route.ts`):** Next.js API orchestrating detection, matrix lookup, and structured response delivery.
  - **Structured Data Contract (`src/types/analysis.ts`, `src/types/compatibility.ts`):** Type-safe interfaces for request inputs and response payloads.
- Clear result card with 4-state status banner, active pills per product, biochemical mechanism breakdown, and timing protocol.

**File Structure Reference:**
- **Shared Schemas & Types:** `src/types/analysis.ts`, `src/types/compatibility.ts`
- **Frontend (Atomic Design):** `src/features/compatibility/` (`organisms/`, `molecules/`, `atoms/`, `hooks/useCompatibility.ts`), `src/pages/CompatibilityPage.tsx`, `src/app/page.tsx`
- **Backend & Rule Engine:** `src/app/api/analyze/route.ts`, `src/lib/preset.ts`, `src/lib/actives.ts`, `src/lib/detect.ts`, `src/lib/detect-ml.ts`, `src/lib/detect-safe.ts`, `src/lib/matrix.ts`, `src/lib/engine.ts`
- **ML Microservice:** `skinwise-ml/` (`main.py`, `train_model.py`, `render.yaml`, `Dockerfile`)

## Later
- Multi-product routine analyzer (evaluating 3+ products simultaneously).
- Local routine saving / bookmarking combinations.
- Camera / OCR label scanning for bottle packaging.

## Explicitly Cut
- **User accounts & authentication:** Adds setup friction and auth overhead unnecessary for an instant calculator.
- **Web scraping pipelines & external product databases:** Introduces fragile runtime dependencies and database maintenance unsuitable for a 2–4 hour PoC.
- **E-commerce / affiliate links:** Distracts from pure scientific utility.
- **Full routine calendars & habit trackers:** Pushes scope into complex state management beyond pairwise verification.
- **Medical diagnosis & dermatology triage:** High liability risk and outside the boundary of an ingredient compatibility checker.
- **Free-form conversational chat:** Prevents prompt drift and guarantees deterministic, structured outputs.
