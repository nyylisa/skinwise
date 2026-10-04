---
doc: scope
status: approved
---

# SkinWise

An instant pairwise skincare compatibility engine that detects conflicting active ingredients and generates actionable timing protocols.

## The Unique Kernel
Rather than issuing generic binary warnings ("do not combine") or overwhelming users with chemical jargon, SkinWise pairs deterministic compatibility guardrails with actionable resolution protocols. It tells users exactly *how* to safely incorporate both products (e.g., AM vs. PM separation or alternating evenings) so they never compromise their skin barrier or waste expensive skincare purchases.

## Who It's For
A daily skincare consumer introducing a new active product (e.g., Retinol, AHA/BHA exfoliants, or L-Ascorbic Acid) into their existing routine. Today, they spend hours sifting through contradictory forum posts, deciphering 30-item INCI chemical labels, and guessing whether their products will cause chemical burns.

## The Core Loop
The user selects two products from preloaded presets or pastes raw ingredient lists into side-by-side cards, then clicks "Check Compatibility". Within seconds, they receive:
1. High-contrast verdict badge: **Conflict** (Red), **Caution** (Yellow), or **Safe / Compatible** (Green).
2. Detected active compound tags (e.g., Salicylic Acid vs. Retinol).
3. Plain-English biochemical risk explanation (2 sentences).
4. Actionable timing protocol (e.g., "Use Product 1 in AM under SPF; reserve Product 2 for alternate PM routines").

They repeat this loop whenever purchasing or layering a new active bottle.

## Inspiration & Identity
- **Tone:** Clean, scientific, high-contrast, reassuring, and immediate.
- **Feel:** Modern clinical utility and precision tool—not a wellness blog, sponsored influencer guide, or sluggish conversational assistant.

## Why This Matters to the Learner
To master spec-driven agent discipline and controlled AI architecture: enforcing strict scope boundaries and embedding deterministic domain guardrails into structured LLM pipelines before writing code, while solving a frustrating everyday problem that causes real skin irritation.

## What "Working" Looks Like
A crisp 1-minute video demo proving the end-to-end evaluation flow across three concrete cases:
1. **Red (Conflict):** Paula's Choice 2% BHA (Salicylic Acid) + The Ordinary 0.5% Retinol &rarr; Flags skin barrier damage & peeling risk; prescribes alternating evenings.
2. **Yellow (Caution):** SkinCeuticals C E Ferulic (15% L-Ascorbic Acid) + Paula's Choice 2% BHA &rarr; Flags low-pH acid stacking; prescribes AM (Vitamin C) vs. PM (BHA).
3. **Green (Safe & Synergistic):** The Ordinary 0.5% Retinol + CeraVe PM Moisturizing Lotion (Niacinamide, Ceramides, Hyaluronic Acid) &rarr; Highlights barrier buffering; prescribes layering together in the PM.

## The POC Boundary
**In Scope:**
- Single-page responsive interface with side-by-side product input cards.
- Curated presets for popular active skincare products + expandable manual INCI ingredient textboxes.
- Hybrid architecture: LLM API call with structured JSON schema output, constrained by an in-prompt active ingredient compatibility matrix (Retinoids, Direct Acids AHA/BHA, L-Ascorbic Acid, Niacinamide, Copper Peptides, Barrier Lipids).
- Clear result card with status badge, active pills, biochemical rationale, and scheduling protocol.

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
