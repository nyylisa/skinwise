// verify.mjs — hits the live Next.js API at localhost:3000/api/analyze
// Run with: node scripts/verify.mjs

const BASE = 'http://localhost:3000/api/analyze';

async function analyze(p1, p2) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product1Ingredients: p1, product2Ingredients: p2 }),
  });
  return res.json();
}

const TESTS = [
  {
    label: 'Retinol + Cleanser (citric acid/EDTA) -> SAFE',
    p1: 'Squalane, Retinol, Jojoba Oil',
    p2: 'Purified Water, Glycerin, Coco-Glucoside, Sodium Cocoyl Glycinate, Disodium EDTA, Citric Acid',
    expect: 'SAFE',
  },
  {
    label: 'Retinol + Glycolic Acid -> CONFLICT',
    p1: 'Squalane, Retinol',
    p2: 'Aqua, Glycolic Acid',
    expect: 'CONFLICT',
  },
  {
    label: 'Retinol + Ceramide -> SAFE',
    p1: 'Squalane, Retinol',
    p2: 'Aqua, Glycerin, Ceramide NP',
    expect: 'SAFE',
  },
  {
    label: 'Vitamin C + Copper Peptide -> CONFLICT',
    p1: 'Aqua, Ascorbic Acid',
    p2: 'Aqua, Copper Tripeptide',
    expect: 'CONFLICT',
  },
  {
    label: 'No actives -> UNKNOWN',
    p1: 'Aqua, Cucumber Extract',
    p2: 'Water, Tocopheryl Acetate',
    expect: 'UNKNOWN',
  },
  {
    label: 'BHA Salicylic Acid + Retinol -> CONFLICT',
    p1: 'Water, Methylpropanediol, Salicylic Acid',
    p2: 'Squalane, Retinol, Jojoba Oil',
    expect: 'CONFLICT',
  },
  {
    label: 'Niacinamide + random soothing -> CAUTION or SAFE',
    p1: 'Aqua, Niacinamide',
    p2: 'Aqua, Madecassoside',
    expect: null, // just report, don't assert
  },
];

let pass = 0, fail = 0;

for (const t of TESTS) {
  try {
    const r = await analyze(t.p1, t.p2);
    const ok = t.expect === null || r.status === t.expect;
    if (ok) pass++; else fail++;
    const tag = t.expect === null ? '[INFO]' : (ok ? '[PASS]' : '[FAIL]');
    console.log(`${tag} ${t.label}`);
    console.log(`       status: ${r.status}${t.expect ? ' (expected: ' + t.expect + ')' : ''}`);
    if (r.conflictPairs?.length) {
      console.log(`       pairs:  ${r.conflictPairs.map(p => p.compound1 + ' + ' + p.compound2).join(', ')}`);
    }
    console.log();
  } catch (e) {
    fail++;
    console.log(`[ERROR] ${t.label}: ${e.message}`);
  }
}

console.log(`Result: ${pass}/${pass + fail} passed`);
