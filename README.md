# SkinWise

> Skincare ingredients, finally made simple.

SkinWise checks whether two skincare products can be used together. Paste (or pick) two ingredient lists, and it detects the active ingredients, looks up known interactions in a rule matrix, and returns a verdict with plain-English reasoning and AM/PM timing advice.

> **Not medical advice.** SkinWise gives general ingredient guidance. If you have sensitive skin or a skin condition, check with a dermatologist before changing your routine.

---

## MVP scope (this phase)

| Feature | Status | What it does |
|---|---|---|
| Product Compatibility Checker | Core | Pick or paste two products, click **Check Compatibility**. |
| Ingredient Conflict Analysis | Core | Colour-coded verdict (Red = conflict, Yellow = caution, Green = safe) with the interacting actives and the mechanism. |
| AM/PM Timing Advice | Core | A practical protocol, e.g. "Use Vitamin C in the morning, retinol at night". |

Everything else in the prototype (ingredient library, product library, routine builder, AI chat) is out of scope for this phase. The landing page is kept at `/welcome`.

## How it works

```
User picks / pastes 2 products
        ↓  click "Check Compatibility"
POST /api/analyze
        ↓
extractActives()      regex match → active categories per product      (lib/actives.ts)
findRuleMatch()       category × category lookup in the rule matrix    (lib/matrix.ts)
generateBiochemical…  optional 2-sentence Gemini summary, with a       (lib/gemini.ts)
                      deterministic fallback
        ↓
AnalysisResult  →  ResultPanel (verdict, actives, interactions, timing)
```

The verdict is **deterministic**: it comes from the rule matrix, never from the LLM. Gemini only rewrites the explanation text, and the API falls back to the template text if no key is set or the call fails.

### Verdict logic (`lib/engine.ts`)

1. No recognised actives in either product → `INSUFFICIENT_DATA`.
2. Recognised actives in only one product → `INSUFFICIENT_DATA` (a partial analysis can't confirm safety).
3. Otherwise every active pair is looked up in the matrix. Priority: `CONFLICT` > `CAUTION` > `SAFE`.
4. Actives recognised but no rule for the pair → `CAUTION` ("Unverified Combination"). **`SAFE` is only reachable through an explicit rule.**

### Rule matrix (`lib/matrix.ts`)

| Pair | Status | Schedule |
|---|---|---|
| Retinoid + Direct Acid (AHA/BHA/PHA) | `CONFLICT` | Alternate days |
| Direct Acid + Vitamin C | `CAUTION` | AM / PM split |
| Retinoid + Vitamin C | `CAUTION` | AM / PM split |
| Retinoid + Barrier Support (ceramides, hyaluronic acid, panthenol, peptides…) | `SAFE` | Layer together |

Recognised active categories: `RETINOID`, `DIRECT_ACID`, `VITAMIN_C`, `NIACINAMIDE`, `BARRIER_SUPPORT` (`lib/actives.ts`). To support a new ingredient, add its patterns there; to support a new pairing, add a rule to the matrix.

## API

### `POST /api/analyze`

Request (`AnalyzeRequestBody`):

```json
{
  "product1Name": "Retinol 0.5% in Squalane",
  "product1Ingredients": "Squalane, Caprylic/Capric Triglyceride, …, Retinol, Tocopherol, BHT",
  "product2Name": "Skin Perfecting 2% BHA Liquid Exfoliant",
  "product2Ingredients": "Water, Methylpropanediol, Butylene Glycol, Salicylic Acid, …"
}
```

`product1Ingredients` and `product2Ingredients` are required; the names are optional.

Response `200` (`AnalysisResult`, validated with Zod in `types/analysis.ts`):

```json
{
  "status": "CONFLICT",
  "summaryTitle": "High Irritation & Barrier Compromise Risk",
  "activesProduct1": ["Retinoid (Retinol / Derivatives)"],
  "activesProduct2": ["Direct Acid (AHA / BHA / PHA)"],
  "conflictPairs": [{ "compound1": "…", "compound2": "…", "mechanism": "…" }],
  "biochemicalExplanation": "Two plain-English sentences…",
  "timingProtocol": { "scheduleType": "ALTERNATE_DAYS", "guidanceText": "…" }
}
```

Errors return `{ "error": "message" }` with status `400` (missing ingredient list) or `500`.

Enums: `status` is `CONFLICT | CAUTION | SAFE | INSUFFICIENT_DATA`; `scheduleType` is `ALTERNATE_DAYS | AM_PM_SPLIT | LAYER_TOGETHER | INERT | UNKNOWN`.

## Getting started

Requires Node.js 18.18+ (20+ recommended).

```bash
npm install
npm install lucide-react zod @google/genai   # if not already in package.json
cp .env.local.example .env.local              # then add your key (optional)
npm run dev
```

Open http://localhost:3000.

| Variable | Required | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | No | Enables the Gemini-written explanation. Without it the API returns the template text from `lib/matrix.ts`. |

**Import alias:** the project imports from `@/src/...` (for example `@/src/types/analysis`), so `tsconfig.json` should map `"@/*"` to `"./*"`.

**Styling:** Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css`). For v3, swap that line for the three `@tailwind` directives.

## Try the demos

The three buttons above the inputs load pairs that hit specific rules:

| Button | Pair | Expected verdict |
|---|---|---|
| Load Conflict Demo | Retinol + 2% BHA exfoliant | `CONFLICT`, alternate days |
| Load Caution Demo | Retinol + Vitamin C serum | `CAUTION`, AM/PM split |
| Load Safe Demo | Retinol + CeraVe Moisturising Cream | `SAFE`, layer together |

If you change the rule matrix or the product lists, re-check these three.

## Project structure

```
skinwise/
├── agent/                         # agent / automation assets
├── devpost/                       # hackathon submission materials
├── public/
└── src/
    ├── app/
    │   ├── api/analyze/route.ts   # POST /api/analyze
    │   ├── compatibility/page.tsx # same screen as "/" (header link)
    │   ├── welcome/page.tsx       # marketing landing page
    │   ├── swagger/page.tsx       # API docs page
    │   ├── layout.tsx             # fonts, header, footer
    │   ├── page.tsx               # renders <CompatibilityPage />
    │   └── globals.css            # design tokens + base styles
    ├── features/compatibility/    # Atomic design
    │   ├── atoms/                 # IngredientTag, SeverityBadge, StatusIcon, severity.ts
    │   ├── molecules/             # VerdictHeader, InteractionCard, TimingAdvice,
    │   │                          # ProductSelector*, IngredientInput*
    │   ├── organisms/             # PresetToolbar, ProductInputCard, ResultPanel
    │   ├── hooks/useCompatibility.ts   # state + fetch to /api/analyze
    │   └── utils/parseIngredients.ts
    ├── pages/CompatibilityPage.tsx     # assembles the feature
    ├── lib/
    │   ├── actives.ts             # (backend) active detection
    │   ├── matrix.ts              # (backend) rule matrix
    │   ├── engine.ts              # (backend) verdict logic
    │   ├── gemini.ts              # (backend) optional LLM summary
    │   └── preset.ts              # (frontend) product library + demo presets
    ├── shared/layout/             # SiteHeader, SiteFooter
    └── types/
        ├── analysis.ts            # (backend) Zod schemas + request/response types
        └── compatibility.ts       # (frontend) UI types
```

\* `ProductSelector` and `IngredientInput` are not used by the current flow (the dropdown + textarea in `ProductInputCard` covers it) and can be removed or reused later.

> **Note:** `src/pages/` is the Next.js *Pages Router* folder, so `CompatibilityPage.tsx` is also reachable as a stray route at `/CompatibilityPage` (without the app layout). It's harmless; renaming the folder (for example to `views/`) removes it.

### Frontend data flow

`useCompatibility()` owns the two product drafts, request status, error and result. `CompatibilityPage` passes them to `PresetToolbar`, two `ProductInputCard`s and `ResultPanel`. Any edit to an input clears the previous result so a stale verdict never sits next to new inputs. Responses are validated with `AnalysisResultSchema` before they reach the UI.

## Design system

Matte, flat, calm: "Headspace meets a skincare label". No gradients or glassmorphism; 1px borders instead of heavy shadows; 12–16px radii; single-colour line icons ([lucide](https://lucide.dev)).

**Type:** Quicksand (headings, labels, buttons) and Crimson Text (body), loaded with `next/font`.

| Element | Font | Size | Weight |
|---|---|---|---|
| H1 / hero | Quicksand | 40–48px | 700 |
| H2 / section | Quicksand | 28–32px | 600 |
| H3 / card title | Quicksand | 18–20px | 600 |
| Body | Crimson Text | 16–17px | 400 |
| Small / labels | Quicksand | 13–14px | 500 |
| Buttons | Quicksand | 15–16px | 600, +0.2px tracking |

**Colour tokens** (CSS variables in `globals.css`):

| Token | Hex | Role |
|---|---|---|
| `--sw-forest` | `#2F4C3A` | Text, headers, nav, footer |
| `--sw-green` | `#4CAF50` | Primary buttons, links, key icons |
| `--sw-soft` | `#81C784` | Secondary buttons, chips, hover |
| `--sw-mint` / `--sw-mint-alt` | `#E9FCE5` / `#E8F5E9` | Page and alternate section backgrounds |
| `--sw-cream` | `#FDFBF7` | Cards |
| `--sw-charcoal` | `#3A3A38` | Body text |
| `--sw-amber` / `--sw-amber-text` | `#D97706` / `#A06830` | Caution |
| `--sw-danger` / `--sw-danger-text` | `#EF4444` / `#9E5248` | Conflict |

Severity visuals (label, icon, colours) live in one place, `atoms/severity.ts`. Status is never conveyed by colour alone: every badge has a text label and an icon.

## Known limitations

- The product library in `lib/preset.ts` holds abridged ingredient lists from public labels. Formulas change, so verify against current packaging.
- Only five active categories and four rules exist. Anything else returns `INSUFFICIENT_DATA` or an "Unverified Combination" caution rather than a guess.
- Active detection is regex-based: it matches ingredient names, not concentrations, and can match derivatives (for example "Capryloyl Salicylic Acid" counts as a direct acid). Benzoyl peroxide is not yet recognised.
- MVP checks exactly two products at a time.
- No accounts, saved routines or persistence yet.

## Roadmap

- More actives (benzoyl peroxide, azelaic acid, copper peptides…) and rules.
- Per-pair status in `conflictPairs` (a small, backward-compatible change; see `BACKEND_PATCH.md`).
- Multi-product routine check and a full AM/PM routine builder.
- Ingredient and product libraries from the prototype.

## License

_TBD_