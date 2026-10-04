---
doc: prd
status: approved
---

# SkinWise — Product Requirements Document

An instant pairwise skincare compatibility engine that detects conflicting active ingredients and generates actionable timing protocols for consumers introducing new active products.
Source: `scope.md > Who It's For`, `scope.md > The Core Loop`.

## The Core Journey
1. **Arrival & Initial Load:** The user lands on the single-page web app. The interface displays the top "Demo Quick-Load" toolbar, and the two product cards are pre-populated with Case 1 (Paula's Choice 2% BHA and The Ordinary 0.5% Retinol) so the app is immediately demonstrative.
2. **Preset Selection or Custom Input:** The user can either keep the pre-filled products, click a quick-load demo button, select a product from each card's preset dropdown (which auto-populates its INCI list in the editable textarea), or paste their own custom ingredients into either card.
3. **Execution:** The user clicks the primary "Check Compatibility" button. The button switches to a loading state while the pairwise analysis runs.
4. **Result Delivery:** The results panel renders directly beneath the input cards, featuring:
   - High-contrast verdict badge (Conflict, Caution, or Safe).
   - Side-by-side detected active compound pill tags.
   - Plain-English biochemical risk explanation (2 sentences).
   - Actionable timing protocol with concrete scheduling guidance (AM vs. PM or alternating evenings).
5. **Iteration / Retest:** The user can switch inputs, adjust text, or click another demo preset to immediately test a new combination.

## Screens and Layout
A single responsive web surface with a focused, top-to-bottom layout:
- **Header & Demo Toolbar:** App title with a concise subtitle, followed by three 1-click preset pill buttons: "Load Conflict Demo" (Case 1), "Load Caution Demo" (Case 2), and "Load Safe Demo" (Case 3).
- **Dual Product Input Cards:** Side-by-side grid (stacks vertically on mobile screens):
  - **Card 1 (Product 1):** Header, preset select dropdown, and expandable/editable textarea pre-filled with the INCI ingredient list.
  - **Card 2 (Product 2):** Header, preset select dropdown, and expandable/editable textarea pre-filled with the INCI ingredient list.
- **Action Bar:** Centered, prominent "Check Compatibility" button with disabled and loading states.
- **Result Panel:** Card container revealing the status badge, active pills, biochemical explanation, and timing schedule upon successful evaluation.

## Look and Feel
- **Theme & Aesthetic:** Modern clinical laboratory aesthetic in crisp light mode. Clean, scientific, high-contrast, and reassuring.
- **Color Palette:**
  - Background: Crisp off-white (`slate-50`).
  - Card Surfaces: Pure white (`white`) with subtle borders (`slate-200`) and soft elevation.
  - Text & Accents: Dark slate (`slate-900`) for headers, muted slate (`slate-600`) for labels and notes.
- **Status Badges:**
  - **Conflict:** Rose/Ruby badge (`rose-600` text/border on `rose-50` background).
  - **Caution:** Amber badge (`amber-600` text/border on `amber-50` background).
  - **Safe / Compatible:** Emerald badge (`emerald-600` text/border on `emerald-50` background).
- **Typography:** Clean technical sans-serif (`Inter` or `Geist`) for UI headers and body instructions; subtle monospace (`font-mono`) for chemical compounds, percentages, and INCI ingredient tags. No cartoon emojis or distracting gradients.

## Features and Behavior

### Quick-Load Demo Presets
Source: `scope.md > What "Working" Looks Like`
- As a judge or user, I want 1-click access to benchmark test cases so that I can see the app's full capabilities in under 30 seconds.
  - [ ] Clicking "Load Conflict Demo" loads Paula's Choice 2% BHA in Card 1 and The Ordinary 0.5% Retinol in Card 2.
  - [ ] Clicking "Load Caution Demo" loads SkinCeuticals C E Ferulic in Card 1 and Paula's Choice 2% BHA in Card 2.
  - [ ] Clicking "Load Safe Demo" loads The Ordinary 0.5% Retinol in Card 1 and CeraVe PM Moisturizing Lotion in Card 2.
  - [ ] Loading a demo preset resets the result panel and enables the "Check Compatibility" button.

### Product Input & Ingredient Handling
Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`
- As a user, I want to pick known products or paste raw ingredient lists so that I can check both popular and custom skincare items.
  - [ ] Selecting a preset from the dropdown populates the product name and fills the textarea with its complete INCI formula.
  - [ ] The ingredient textarea remains freely editable so users can add, remove, or modify ingredients.
  - [ ] If either Product 1 or Product 2 card has an empty textarea, the "Check Compatibility" button is disabled and displays an inline guidance note: "Select or input two products to evaluate compatibility."

### Compatibility Analysis & Protocol Engine
Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`
- As a user, I want clear conflict detection and actionable scheduling advice so that I can safely use active products without damaging my skin barrier.
  - [ ] Clicking "Check Compatibility" sends both product inputs to the analysis endpoint.
  - [ ] Displays a visual loading spinner and disables the button during processing.
  - [ ] For conflicting actives (e.g., BHA + Retinol), outputs a Red **Conflict** badge, identifies the offending actives, explains the barrier peeling risk in 2 plain-English sentences, and provides an alternating evening schedule.
  - [ ] For caution pairs (e.g., L-Ascorbic Acid + BHA), outputs a Yellow **Caution** badge, identifies low-pH stacking risk, and provides an AM/PM routine split.
  - [ ] For compatible or buffering pairs (e.g., Retinol + CeraVe PM), outputs a Green **Safe / Compatible** badge, highlights barrier buffering benefits, and provides a PM layering sequence.
  - [ ] For inert/hydrating formulas with zero active acids or retinoids (e.g., Water, Glycerin, Petrolatum), outputs a Green **Safe / Neutral** badge with explicit confirmation that no conflicting actives were detected and the formulas are safe to layer.

## States and Boundaries
- **Initial Load State:** Pre-populated with Case 1 (Paula's Choice BHA + The Ordinary Retinol); "Check Compatibility" button is enabled; result panel is empty/hidden.
- **Incomplete / Missing Input State:** If either card's textarea is empty, "Check Compatibility" is disabled with an inline helper note.
- **Loading State:** "Check Compatibility" button shows a spinner and disabled state; inputs are locked during analysis.
- **Success State:** Result panel displays verdict badge, detected active pills, risk rationale, and actionable scheduling protocol.
- **Inert Actives State:** Returns Green Safe/Neutral badge with explanatory copy stating formulas contain only hydrating/barrier agents.
- **API Error / Timeout State:** Displays a dismissible warning toast with an inline "Retry Analysis" button without wiping the user's entered text.
- **Persistence Boundary:** Session-only in-memory state; no database or local storage persistence required for this PoC.

## Product Decisions
- **Pre-populated First Load:** Pre-filling Case 1 immediately on launch prevents an empty void and allows one-click demo verification in under one second.
- **Top Quick-Load Toolbar:** Dedicated buttons for all three demo cases ensure deterministic, rapid testing during hackathon reviews and video recording.
- **Editable INCI Textarea:** Pairing preset dropdowns with editable textareas gives users the convenience of presets with the flexibility of custom inputs.
- **Inert Hydrators Fallback:** Explicitly handling zero-active inputs with a Green Safe/Neutral badge avoids confusing users when testing basic moisturizers.

## What We're Building
- Single-page responsive interface with quick-load demo toolbar, dual product input cards (dropdowns + editable textareas), action button, and structured result panel.
- Hybrid analysis engine: Structured JSON schema output constrained by an in-prompt active ingredient compatibility matrix.
- High-contrast clinical laboratory styling with Rose/Amber/Emerald status badges and monospace chemical tags.
- Full error, empty, and inert ingredient handling.

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
- None blocking spec approval. All interactions, states, acceptance criteria, and styling parameters are defined.
