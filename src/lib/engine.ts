import { extractActives } from "./actives";
import { findRuleMatch, MatrixRule } from "./matrix";
import { generateBiochemicalSummary } from "./gemini";
import {
  AnalysisResult,
  CompatibilityStatus,
  ConflictPair,
  ScheduleType,
} from "@/src/types/analysis";

export async function analyzePairwiseCompatibility(
  p1Ingredients: string,
  p2Ingredients: string,
  p1Name: string = "Product 1",
  p2Name: string = "Product 2"
): Promise<AnalysisResult> {
  const actives1 = extractActives(p1Ingredients);
  const actives2 = extractActives(p2Ingredients);

  const p1Names = actives1.map((a) => a.canonicalName);
  const p2Names = actives2.map((a) => a.canonicalName);

  // ── Case 1: Neither product has any recognized actives ──────────────────────
  if (actives1.length === 0 && actives2.length === 0) {
    const explanation =
      "We could not recognize any known active ingredients in either product. " +
      "Our system cannot evaluate compatibility for unrecognized ingredients — " +
      "do not assume these are safe to combine.";
    return {
      status: "INSUFFICIENT_DATA",
      summaryTitle: "Cannot Evaluate: No Recognized Actives Found",
      activesProduct1: [],
      activesProduct2: [],
      conflictPairs: [],
      biochemicalExplanation: explanation,
      timingProtocol: {
        scheduleType: "UNKNOWN",
        guidanceText:
          "Neither product contains actives we recognize. Please consult a " +
          "dermatologist or check with the brand before combining these products.",
      },
    };
  }

  // ── Case 2: Only one product has recognized actives ──────────────────────────
  if (actives1.length === 0 || actives2.length === 0) {
    const missingSide = actives1.length === 0 ? p1Name : p2Name;
    const explanation =
      `"${missingSide}" contains no active ingredients our system recognizes. ` +
      "A partial analysis is not enough to confirm safety — we cannot rule out a conflict.";
    return {
      status: "INSUFFICIENT_DATA",
      summaryTitle: `Cannot Evaluate: "${missingSide}" Has No Recognized Actives`,
      activesProduct1: p1Names,
      activesProduct2: p2Names,
      conflictPairs: [],
      biochemicalExplanation: explanation,
      timingProtocol: {
        scheduleType: "UNKNOWN",
        guidanceText:
          "Only one product could be analyzed. Do not assume the combination is safe. " +
          "Introduce products one at a time and patch test before combining.",
      },
    };
  }

  // ── Case 3: Both products have recognized actives — run the rule engine ──────
  const matchedRules: MatrixRule[] = [];
  const conflictPairs: ConflictPair[] = [];

  for (const a1 of actives1) {
    for (const a2 of actives2) {
      const rule = findRuleMatch(a1.category, a2.category);
      if (rule) {
        matchedRules.push(rule);
        conflictPairs.push({
          compound1: a1.canonicalName,
          compound2: a2.canonicalName,
          mechanism: rule.mechanism,
        });
      }
    }
  }

  let finalStatus: CompatibilityStatus;
  let summaryTitle: string;
  let scheduleType: ScheduleType;
  let defaultExplanation: string;
  let guidanceText: string;

  if (matchedRules.some((r) => r.status === "CONFLICT")) {
    // Explicit conflict rule matched
    finalStatus = "CONFLICT";
    const rule = matchedRules.find((r) => r.status === "CONFLICT")!;
    summaryTitle = rule.title;
    scheduleType = rule.scheduleType;
    defaultExplanation = rule.defaultExplanation;
    guidanceText = rule.defaultGuidance;
  } else if (matchedRules.some((r) => r.status === "CAUTION")) {
    // Explicit caution rule matched
    finalStatus = "CAUTION";
    const rule = matchedRules.find((r) => r.status === "CAUTION")!;
    summaryTitle = rule.title;
    scheduleType = rule.scheduleType;
    defaultExplanation = rule.defaultExplanation;
    guidanceText = rule.defaultGuidance;
  } else if (matchedRules.some((r) => r.status === "SAFE")) {
    // An explicit SAFE rule was matched — the only path to SAFE
    finalStatus = "SAFE";
    const rule = matchedRules.find((r) => r.status === "SAFE")!;
    summaryTitle = rule.title;
    scheduleType = rule.scheduleType;
    defaultExplanation = rule.defaultExplanation;
    guidanceText = rule.defaultGuidance;
  } else {
    // ── Case 4: Actives recognized but no rule exists for this pair ────────────
    // Default to CAUTION — never assume safe for an untested combination.
    finalStatus = "CAUTION";
    summaryTitle = "Unverified Combination: Use With Caution";
    scheduleType = "UNKNOWN";
    defaultExplanation =
      "Both products contain recognized active ingredients, but we don't have a " +
      "verified compatibility rule for this specific combination. We cannot confirm " +
      "it is safe — introduce one product at a time and monitor your skin's response.";
    guidanceText =
      "Patch test each product separately for 7 days before combining. " +
      "If you experience redness, stinging, or peeling, discontinue and consult a dermatologist.";
  }

  const finalExplanation = await generateBiochemicalSummary(
    p1Name,
    p1Names,
    p2Name,
    p2Names,
    finalStatus,
    defaultExplanation
  );

  return {
    status: finalStatus,
    summaryTitle,
    activesProduct1: p1Names,
    activesProduct2: p2Names,
    conflictPairs,
    biochemicalExplanation: finalExplanation,
    timingProtocol: {
      scheduleType,
      guidanceText,
    },
  };
}
