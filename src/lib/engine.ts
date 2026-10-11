import {
  AnalyzeRequest,
  AnalyzeResponse,
  Status,
  Schedule,
  ConflictPair,
} from '../types/analysis';
import { detectedForAnalysis } from './detect';
import { detectActivesSafe } from './detect-safe';
import { findRule } from './matrix';

const SEVERITY: Record<Status, number> = {
  SAFE: 0,
  UNKNOWN: 1,
  INSUFFICIENT_DATA: 1,
  CAUTION: 2,
  CONFLICT: 3,
};

const DISCLAIMER =
  'This is an educational cosmetic ingredient tool, not medical advice. Patch test new products and consult a dermatologist for skin conditions.';

function insufficientData(
  reason: string,
  product1Actives: string[],
  product2Actives: string[]
): AnalyzeResponse {
  return {
    status: 'UNKNOWN',
    summaryTitle: 'Insufficient Data',
    activesProduct1: product1Actives,
    activesProduct2: product2Actives,
    conflictPairs: [],
    biochemicalExplanation: reason,
    timingProtocol: {
      scheduleType: 'UNKNOWN',
      guidanceText:
        'We could not evaluate this combination. Introduce one product at a time and patch test.',
    },
    disclaimer: DISCLAIMER,
  };
}

export async function analyzeCompatibility(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  const raw1 = await detectActivesSafe(req.product1Ingredients);
  const raw2 = await detectActivesSafe(req.product2Ingredients);

  const a1 = detectedForAnalysis(raw1);
  const a2 = detectedForAnalysis(raw2);

  const names1 = a1.map(a => a.canonicalName);
  const names2 = a2.map(a => a.canonicalName);

  // No recognized actives on either side
  if (a1.length === 0 && a2.length === 0) {
    return insufficientData(
      'We could not recognize any known active ingredients in either product.',
      names1,
      names2
    );
  }

  // Only one side has recognized actives
  if (a1.length === 0 || a2.length === 0) {
    const which = a1.length === 0 ? 'Product 1' : 'Product 2';
    return insufficientData(
      `${which} contains no recognized active ingredients. We cannot fully evaluate compatibility.`,
      names1,
      names2
    );
  }

  // Both sides have actives — run the matrix
  const pairs: ConflictPair[] = [];
  let worst: Status = 'SAFE';
  let schedule: Schedule = 'LAYER_TOGETHER';
  let instructions = '';
  const conflictMechanisms: string[] = [];
  const safeMechanisms: string[] = [];
  let matchedCount = 0;

  for (const a of a1) {
    for (const b of a2) {
      const rule = findRule(a.category, b.category);
      if (!rule) continue;

      matchedCount++;

      if (SEVERITY[rule.status] > SEVERITY[worst]) {
        worst = rule.status;
      }

      if (
        rule.schedule === 'ALTERNATE_DAYS' ||
        (rule.schedule === 'AM_PM_SPLIT' && schedule === 'LAYER_TOGETHER')
      ) {
        schedule = rule.schedule;
      }

      instructions = rule.instructions;

      if (rule.status === 'CONFLICT' || rule.status === 'CAUTION') {
        pairs.push({
          compound1: a.canonicalName,
          compound2: b.canonicalName,
          mechanism: rule.mechanism,
        });
        conflictMechanisms.push(rule.mechanism);
      } else {
        safeMechanisms.push(rule.mechanism);
      }
    }
  }

  // Actives found, but no rule matched → CAUTION, never default SAFE
  if (matchedCount === 0) {
    return {
      status: 'CAUTION',
      summaryTitle: 'No Verified Rule for This Combination',
      activesProduct1: names1,
      activesProduct2: names2,
      conflictPairs: [],
      biochemicalExplanation:
        'We recognized active ingredients in both products but do not have a verified interaction rule for this specific pair. Introduce them one at a time and patch test.',
      timingProtocol: {
        scheduleType: 'UNKNOWN',
        guidanceText:
          'Start with one product for a week before introducing the second.',
      },
      disclaimer: DISCLAIMER,
    };
  }

  const summaryTitle =
    worst === 'CONFLICT'
      ? 'Direct Conflict'
      : worst === 'CAUTION'
      ? 'Use With Care'
      : 'Safe To Layer';

  // Show warning mechanisms when the verdict is a warning;
  // show synergy mechanisms when the verdict is safe.
  const finalMechanisms =
    worst === 'SAFE' ? safeMechanisms : conflictMechanisms;

  const biochemicalExplanation =
    Array.from(new Set(finalMechanisms)).join(' ');

  return {
    status: worst,
    summaryTitle,
    activesProduct1: names1,
    activesProduct2: names2,
    conflictPairs: pairs,
    biochemicalExplanation,
    timingProtocol: {
      scheduleType: schedule,
      guidanceText: instructions || 'Apply as you normally would.',
    },
    disclaimer: DISCLAIMER,
  };
}
