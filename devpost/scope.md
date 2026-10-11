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
The user selects two products from presets, searches/selects verified active ingredients, or pastes raw ingredient lists into side-by-side cards. The interface provides upfront recognition feedback—displaying recognized active chips or flagging unrecognized ingredients so users know what the system supports before evaluating. Within seconds of clicking "Check Compatibility", they receive:
1. High-contrast 4-state verdict badge: **CONFLICT** (Red), **CAUTION** (Yellow), **SAFE** (Green), or **INSUFFICIENT_DATA** (Slate).
2. Detected active compound tags (e.g., Salicylic Acid vs. Retinol).
3. Plain-English biochemical risk explanation (2 sentences).
4. Actionable timing protocol (e.g., "Use Product 1 in AM under SPF; reserve Product 2 for alternate PM routines", or cautious guidance when unknown).

They repeat this loop whenever purchasing or layering a new active bottle.

## Inspiration & Identity
- **Tone:** Clean, scientific, high-contrast, reassuring, and immediate.
- **Feel:** Modern clinical utility and precision tool—not a wellness blog, sponsored influencer guide, or sluggish conversational assistant.

## Why This Matters to the Learner
To master spec-driven agent discipline and controlled AI architecture: decoupling deterministic safety rules (parsing and matrix evaluation) from generative AI capabilities (natural language summarization), enforcing strict scope boundaries before writing code, while solving a frustrating everyday problem that causes real skin irritation.

## What "Working" Looks Like
A crisp 1-minute video demo proving the end-to-end evaluation flow across three concrete cases:
1. **Red (CONFLICT):** Paula's Choice 2% BHA (Salicylic Acid) + The Ordinary 0.5% Retinol &rarr; Flags skin barrier damage & peeling risk; prescribes alternating evenings.
2. **Yellow (CAUTION):** SkinCeuticals C E Ferulic (15% L-Ascorbic Acid) + Paula's Choice 2% BHA &rarr; Flags low-pH acid stacking; prescribes AM (Vitamin C) vs. PM (BHA).
3. **Green (SAFE):** The Ordinary 0.5% Retinol + CeraVe PM Moisturizing Lotion (Niacinamide, Ceramides, Hyaluronic Acid) &rarr; Highlights barrier buffering; prescribes layering together in the PM.

## The POC Boundary
**In Scope:**
- Single-page responsive interface with side-by-side product input cards and quick-load demo toolbar (`components/`, `app/page.tsx`, `lib/presets.ts`).
- Curated presets for popular active skincare products + searchable recognized active ingredient selector + expandable manual INCI ingredient textboxes with live active chip preview.
- Upfront active transparency: immediate visual chips for recognized actives and clear "unrecognized / not in system" indicators to prevent false assumptions of safety for uncataloged chemicals.
- **Hybrid ML & Rule Engine Architecture:**
  - **Few-Shot ML Ingredient Classifier (SetFit):** Replaces fragile regex with a lightweight, robust semantic text classifier trained on just 15-20 examples per category to accurately identify active compounds from raw INCI text, even with typos or synonyms.
  - Scientific active conflict tables (`lib/matrix.ts`) mapping pairwise interactions (Retinoids, Direct Acids AHA/BHA, L-Ascorbic Acid, Niacinamide, Copper Peptides, Barrier Lipids, and Inert Hydrators).
  - Deterministic evaluation engine (`lib/engine.ts`) computing 4-state verdict badges (**CONFLICT**, **CAUTION**, **SAFE**, **INSUFFICIENT_DATA**), conflict mechanism tags, and scheduling protocols (`ALTERNATE_DAYS`, `AM_PM_SPLIT`, `LAYER_TOGETHER`, `UNKNOWN`) without hallucination risk.
  - Optional Gemini summarizer (`lib/gemini.ts`) for natural language biochemical explanations.
  - Serverless route handler (`app/api/analyze/route.ts`) orchestrating deterministic evaluation and optional Gemini summaries.
  - Shared validation schema (`types/analysis.ts`) enforcing runtime types via Zod.
- Clear result card with 4-state status badge, active pills, biochemical rationale, and scheduling protocol.

**File Structure Reference:**
- **Shared Schema:** `types/analysis.ts` (shared Zod schema)
- **Backend:** `lib/actives.ts`, `lib/matrix.ts`, `lib/engine.ts`, `lib/gemini.ts`, `app/api/analyze/route.ts`
- **Frontend:** `components/`, `app/page.tsx`, `lib/presets.ts`

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
