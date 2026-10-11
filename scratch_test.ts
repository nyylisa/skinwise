import { detectActives, detectedForAnalysis } from './src/lib/detect';
import { analyzeCompatibility } from './src/lib/engine';

// 1. Alias matching: longest wins
console.log("TEST 1");
console.log(detectActives('Aqua, Sodium Hyaluronate, Glycerin'));
// Expect: Hyaluronic Acid (HUMECTANT), Glycerin (HUMECTANT)

console.log("TEST 2");
console.log(detectActives('Alpha Arbutin, Arbutin'));
// Expect: only Arbutin (PIGMENT_REGULATOR) — the "alpha arbutin"
// alias is longer, but canonicalName dedupes to one entry

// 2. Non-target is filtered out
console.log("TEST 3");
console.log(detectedForAnalysis(detectActives('Water, Tocopheryl Acetate')));
// Expect: []

async function main() {
  // 3. Real conflict
  console.log("TEST 4");
  const res1 = await analyzeCompatibility({
    product1Ingredients: 'Aqua, Glycolic Acid',
    product2Ingredients: 'Squalane, Retinol',
  });
  console.log(res1.status);
  // Expect: "CONFLICT"

  // 4. Unknown pair — should be CAUTION, not SAFE
  console.log("TEST 5");
  const res2 = await analyzeCompatibility({
    product1Ingredients: 'Aqua, Niacinamide',
    product2Ingredients: 'Aqua, Madecassoside',
  });
  console.log(res2.status);
}

main();
