import { ActiveCategory } from './actives';

export type Status = 'CONFLICT' | 'CAUTION' | 'SAFE' | 'UNKNOWN';
export type Schedule =
  | 'LAYER_TOGETHER'
  | 'AM_PM_SPLIT'
  | 'ALTERNATE_DAYS'
  | 'UNKNOWN';

export interface Rule {
  a: ActiveCategory;
  b: ActiveCategory;
  status: Status;
  schedule: Schedule;
  mechanism: string;
  instructions: string;
}

export const RULES: Rule[] = [
  // ── CONFLICTS ──────────────────────────────────────────────
  {
    a: 'RETINOID', b: 'DIRECT_ACID',
    status: 'CONFLICT', schedule: 'ALTERNATE_DAYS',
    mechanism: 'Retinoids and exfoliating acids both increase cell turnover and may raise irritation risk.',
    instructions: 'Use on alternate evenings. Start slowly and reduce frequency if irritation occurs.',
  },
  {
    a: 'DIRECT_ACID', b: 'PEPTIDE',
    status: 'CONFLICT', schedule: 'AM_PM_SPLIT',
    mechanism: 'Low-pH acids can break down peptide structures, reducing their effectiveness.',
    instructions: 'Use the acid at night and peptides in the morning, or on separate days.',
  },
  {
    a: 'VITAMIN_C', b: 'PEPTIDE',
    status: 'CONFLICT', schedule: 'AM_PM_SPLIT',
    mechanism: 'Ascorbic acid can destabilize copper peptides and reduce their activity.',
    instructions: 'Use Vitamin C in the AM and peptides in the PM.',
  },

  // ── CAUTIONS ───────────────────────────────────────────────
  {
    a: 'RETINOID', b: 'VITAMIN_C',
    status: 'CAUTION', schedule: 'AM_PM_SPLIT',
    mechanism: 'Both are potent actives; layering them in the same step can increase irritation.',
    instructions: 'Use Vitamin C in the morning and the retinoid at night.',
  },
  {
    a: 'DIRECT_ACID', b: 'VITAMIN_C',
    status: 'CAUTION', schedule: 'AM_PM_SPLIT',
    mechanism: 'Vitamin C works best at low pH and can be destabilized by acidic exfoliants used at the same time.',
    instructions: 'Use Vitamin C in the morning and the acid at night.',
  },
  {
    a: 'DIRECT_ACID', b: 'ANTIOXIDANT',
    status: 'CAUTION', schedule: 'AM_PM_SPLIT',
    mechanism: 'Some antioxidants are less stable at low pH or may increase sensitivity when combined with acids.',
    instructions: 'Space them apart: acid at night, antioxidant in the morning.',
  },
  {
    a: 'RETINOID', b: 'PIGMENT_REGULATOR',
    status: 'CAUTION', schedule: 'AM_PM_SPLIT',
    mechanism: 'Both can increase skin sensitivity during adjustment periods.',
    instructions: 'Use the pigment regulator in the AM and retinoid in the PM.',
  },

  // ── SAFE WITH SYNERGY ──────────────────────────────────────
  {
    a: 'RETINOID', b: 'BARRIER_SUPPORT',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Barrier ingredients can reduce retinoid dryness and support tolerance.',
    instructions: 'Apply the retinoid first, then seal with the barrier cream.',
  },
  {
    a: 'RETINOID', b: 'HUMECTANT',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Humectants help offset the dryness often associated with retinoid use.',
    instructions: 'Layer retinoid first, then hydrating product.',
  },
  {
    a: 'RETINOID', b: 'SOOTHING',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Soothing ingredients help calm the skin during retinoid adjustment.',
    instructions: 'Can be layered together in the evening.',
  },
  {
    a: 'DIRECT_ACID', b: 'BARRIER_SUPPORT',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Barrier support helps buffer potential irritation from exfoliating acids.',
    instructions: 'Apply acid first, then barrier cream.',
  },
  {
    a: 'DIRECT_ACID', b: 'SOOTHING',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Soothing ingredients can calm the skin after acid exfoliation.',
    instructions: 'Layer together in the same routine.',
  },
  {
    a: 'VITAMIN_C', b: 'ANTIOXIDANT',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Ferulic acid and Vitamin E stabilize Vitamin C and boost its effectiveness.',
    instructions: 'Layer together in your morning routine for maximum antioxidant protection.',
  },
  {
    a: 'VITAMIN_C', b: 'BARRIER_SUPPORT',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Barrier support helps reduce potential irritation from high-concentration Vitamin C.',
    instructions: 'Apply Vitamin C first, then the barrier-supporting product.',
  },
  {
    a: 'VITAMIN_C', b: 'PIGMENT_REGULATOR',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Both ingredients target pigmentation through complementary mechanisms.',
    instructions: 'Layer together in the AM for a brightening routine.',
  },
  {
    a: 'NIACINAMIDE', b: 'DIRECT_ACID',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Modern research shows niacinamide is stable with acids.',
    instructions: 'Can be layered together.',
  },
  {
    a: 'NIACINAMIDE', b: 'VITAMIN_C',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Despite older concerns, modern formulations are compatible.',
    instructions: 'Can be layered together.',
  },
  {
    a: 'NIACINAMIDE', b: 'RETINOID',
    status: 'SAFE', schedule: 'LAYER_TOGETHER',
    mechanism: 'Niacinamide can help reduce retinoid irritation.',
    instructions: 'Layer together in the evening.',
  },
];

export function findRule(
  a: ActiveCategory,
  b: ActiveCategory
): Rule | undefined {
  return RULES.find(
    r => (r.a === a && r.b === b) || (r.a === b && r.b === a)
  );
}
