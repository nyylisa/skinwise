import { detectActives, detectedForAnalysis } from '../src/lib/detect';
import { analyzeCompatibility } from '../src/lib/engine';

function show(label: string, value: unknown) {
  console.log(`\n── ${label} ──`);
  console.log(JSON.stringify(value, null, 2));
}

async function main() {
  // ── Test 1: Basic detection
  show('Test 1: Detect Hyaluronic Acid + Glycerin', detectActives(
    'Aqua, Sodium Hyaluronate, Glycerin'
  ));
  // Expect: two entries — Hyaluronic Acid (HUMECTANT) + Glycerin (HUMECTANT)

  // ── Test 2: Longest-alias-wins
  show('Test 2: Longest alias wins', detectActives(
    'Alpha Arbutin, Tocopheryl Acetate'
  ));
  // Expect: Arbutin (PIGMENT_REGULATOR) + Tocopheryl Acetate (NON_TARGET)

  // ── Test 3: NON_TARGET filtered out
  show('Test 3: NON_TARGET filtered', detectedForAnalysis(detectActives(
    'Water, Tocopheryl Acetate, Cucumber Extract'
  )));
  // Expect: []

  // ── Test 4: Real conflict (Retinol + Glycolic)
  show('Test 4: Retinol + Glycolic → CONFLICT', await analyzeCompatibility({
    product1Ingredients: 'Aqua, Glycolic Acid',
    product2Ingredients: 'Squalane, Retinol',
  }));
  // Expect: status = CONFLICT, schedule = ALTERNATE_DAYS

  // ── Test 5: Known SAFE (Retinol + Ceramide)
  show('Test 5: Retinol + Ceramide → SAFE', await analyzeCompatibility({
    product1Ingredients: 'Squalane, Retinol',
    product2Ingredients: 'Aqua, Glycerin, Ceramide NP',
  }));
  // Expect: status = SAFE, schedule = LAYER_TOGETHER

  // ── Test 6: UNKNOWN (no recognized actives)
  show('Test 6: No actives → UNKNOWN', await analyzeCompatibility({
    product1Ingredients: 'Aqua, Cucumber Extract',
    product2Ingredients: 'Water, Tocopheryl Acetate',
  }));
  // Expect: status = UNKNOWN

  // ── Test 7: Actives found but no rule → CAUTION (not SAFE!)
  show('Test 7: Unmatched actives → CAUTION', await analyzeCompatibility({
    product1Ingredients: 'Aqua, Niacinamide',
    product2Ingredients: 'Aqua, Madecassoside',
  }));
  // Expect: status = CAUTION (this is the safety behavior)

  // ── Test 8: Vitamin C + Copper Peptide → CONFLICT
  show('Test 8: Vit C + Copper Peptide → CONFLICT', await analyzeCompatibility({
    product1Ingredients: 'Aqua, Ascorbic Acid',
    product2Ingredients: 'Aqua, Copper Tripeptide',
  }));
  // Expect: status = CONFLICT, schedule = AM_PM_SPLIT

  // ── Test 9: One side empty of actives
  show('Test 9: One side no actives → UNKNOWN', await analyzeCompatibility({
    product1Ingredients: 'Squalane, Retinol',
    product2Ingredients: 'Aqua, Cucumber Extract',
  }));
  // Expect: status = UNKNOWN

  // ── Test 10: Paula's Choice BHA + The Ordinary Retinol
  show("Test 10: BHA + Retinol → CONFLICT", await analyzeCompatibility({
    product1Name: "Paula's Choice 2% BHA",
    product1Ingredients: 'Water, Methylpropanediol, Salicylic Acid, Camellia Leaf Extract',
    product2Name: 'The Ordinary Retinol 0.5%',
    product2Ingredients: 'Squalane, Retinol, Jojoba Oil',
  }));
  // Expect: status = CONFLICT
}

main();