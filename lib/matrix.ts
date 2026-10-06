import { ActiveCategory } from "./actives";
import { CompatibilityStatus, ScheduleType } from "@/types/analysis";

export interface MatrixRule {
  cat1: ActiveCategory;
  cat2: ActiveCategory;
  status: CompatibilityStatus;
  scheduleType: ScheduleType;
  title: string;
  mechanism: string;
  defaultExplanation: string;
  defaultGuidance: string;
}

export const COMPATIBILITY_RULES: MatrixRule[] = [
  {
    cat1: "RETINOID",
    cat2: "DIRECT_ACID",
    status: "CONFLICT",
    scheduleType: "ALTERNATE_DAYS",
    title: "High Irritation & Barrier Compromise Risk",
    mechanism:
      "Keratolytic chemical exfoliants degrade lipid barrier cohesion prior to retinoid cellular turnover, severely increasing transepidermal water loss and causing chemical dermatitis.",
    defaultExplanation:
      "Combining direct exfoliating acids with retinoids strips your protective skin barrier and over-accelerates cell turnover. Layering them together causes excessive peeling, redness, and micro-tears.",
    defaultGuidance:
      "Do not use these products in the same routine. Apply Product 1 on Monday/Wednesday evenings and Product 2 on Tuesday/Friday evenings. Always wear SPF 30+ every morning.",
  },
  {
    cat1: "DIRECT_ACID",
    cat2: "VITAMIN_C",
    status: "CAUTION",
    scheduleType: "AM_PM_SPLIT",
    title: "Low-pH Acid Stacking & Flushing Risk",
    mechanism:
      "Concurrent application of high-potency L-Ascorbic Acid (pH < 3.5) and direct AHAs/BHAs compounds acidic stress on the stratum corneum, triggering erythema and burning.",
    defaultExplanation:
      "Stacking low-pH direct acids on top of pure Vitamin C overwhelms the skin's natural acid mantle. This combination frequently causes acute stinging and persistent flushing.",
    defaultGuidance:
      "Split application across your day: apply Product 1 (Vitamin C) during your morning routine under sunscreen, and apply Product 2 (Direct Acid) during your evening routine.",
  },
  {
    cat1: "RETINOID",
    cat2: "VITAMIN_C",
    status: "CAUTION",
    scheduleType: "AM_PM_SPLIT",
    title: "Absorption Interference & Staggered pH Needs",
    mechanism:
      "L-Ascorbic acid requires an acidic pH environment (<3.5) for optimal stability, whereas retinoid conversion pathways function near neutral pH (5.5–6.0).",
    defaultExplanation:
      "Pure Vitamin C and retinoids perform best in completely different pH environments. Applying them together destabilizes their efficacy and increases irritation.",
    defaultGuidance:
      "Separate them into AM and PM sessions: apply Vitamin C in the morning to protect against free radicals, and reserve your Retinoid for nighttime cellular repair.",
  },
  {
    cat1: "RETINOID",
    cat2: "BARRIER_SUPPORT",
    status: "SAFE",
    scheduleType: "LAYER_TOGETHER",
    title: "Synergistic Barrier Support & Buffering",
    mechanism:
      "Ceramides, hyaluronic acid, and barrier lipids replenish extracellular matrix bilayers, mitigating typical retinization dryness and peeling.",
    defaultExplanation:
      "Ceramides and hydrating lipids cushion your skin against irritation without lowering retinoid performance. This pairing keeps the moisture barrier healthy and hydrated.",
    defaultGuidance:
      "Layer together during your evening routine: apply your active treatment first, allow it to absorb for 60 seconds, then seal with the barrier-replenishing formula.",
  },
];

export function findRuleMatch(
  cat1: ActiveCategory,
  cat2: ActiveCategory
): MatrixRule | null {
  return (
    COMPATIBILITY_RULES.find(
      (r) =>
        (r.cat1 === cat1 && r.cat2 === cat2) ||
        (r.cat1 === cat2 && r.cat2 === cat1)
    ) || null
  );
}
