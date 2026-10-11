// lib/actives.ts
//
// Ingredient knowledge base for Skinwise.
//
// MATCHING RULE: Aliases are matched longest-first, so more specific
// aliases win over shorter ones. Example:
//   "sodium hyaluronate" beats "hyaluronate"
//   "alpha arbutin" beats "arbutin"
//   "tocopheryl acetate" beats "tocopherol"
// This is enforced in lib/detect.ts.
//
// CATEGORY SEMANTICS:
//   NON_TARGET = recognized ingredient, but not evaluated for interactions.
//                Covers water, preservatives, pH adjusters, and botanicals
//                we do not analyze. "Inert" was avoided because some of
//                these (e.g. Aloe) do have skin activity.

export type ActiveCategory =
  | 'RETINOID'
  | 'DIRECT_ACID'
  | 'VITAMIN_C'
  | 'NIACINAMIDE'
  | 'PIGMENT_REGULATOR'
  | 'PEPTIDE'
  | 'ANTIOXIDANT'
  | 'BARRIER_SUPPORT'
  | 'HUMECTANT'
  | 'SOOTHING'
  | 'EMOLLIENT'
  | 'UV_FILTER'
  | 'NON_TARGET';

export interface ActiveDefinition {
  canonicalName: string;
  category: ActiveCategory;
  aliases: string[];
}

export const ACTIVES: ActiveDefinition[] = [
  // ─────────────────────────────────────────────────────────────
  // RETINOID
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Retinol',
    category: 'RETINOID',
    aliases: ['retinol'],
  },
  {
    canonicalName: 'Retinaldehyde',
    category: 'RETINOID',
    aliases: ['retinaldehyde', 'retinal'],
  },
  {
    canonicalName: 'Tretinoin',
    category: 'RETINOID',
    aliases: ['tretinoin', 'retinoic acid'],
  },
  {
    canonicalName: 'Adapalene',
    category: 'RETINOID',
    aliases: ['adapalene'],
  },
  {
    canonicalName: 'Hydroxypinacolone Retinoate',
    category: 'RETINOID',
    aliases: ['hydroxypinacolone retinoate', 'hpr'],
  },
  {
    canonicalName: 'Retinyl Palmitate',
    category: 'RETINOID',
    aliases: ['retinyl palmitate'],
  },
  {
    canonicalName: 'Retinyl Retinoate',
    category: 'RETINOID',
    aliases: ['retinyl retinoate'],
  },
  {
    canonicalName: 'Retinyl Propionate',
    category: 'RETINOID',
    aliases: ['retinyl propionate'],
  },

  // ─────────────────────────────────────────────────────────────
  // DIRECT_ACID (AHA / BHA / PHA and exfoliating acids)
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Glycolic Acid',
    category: 'DIRECT_ACID',
    aliases: ['glycolic acid'],
  },
  {
    canonicalName: 'Salicylic Acid',
    category: 'DIRECT_ACID',
    aliases: [
      'salicylic acid',
      'beta hydroxy acid',
      'betaine salicylate',
      'bha',
    ],
  },
  {
    canonicalName: 'Lactic Acid',
    category: 'DIRECT_ACID',
    aliases: ['lactic acid'],
  },
  {
    canonicalName: 'Mandelic Acid',
    category: 'DIRECT_ACID',
    aliases: ['mandelic acid'],
  },
  {
    canonicalName: 'Gluconolactone',
    category: 'DIRECT_ACID',
    aliases: ['gluconolactone'],
  },
  {
    canonicalName: 'Lactobionic Acid',
    category: 'DIRECT_ACID',
    aliases: ['lactobionic acid'],
  },
  {
    canonicalName: 'Tartaric Acid',
    category: 'DIRECT_ACID',
    aliases: ['tartaric acid'],
  },

  {
    canonicalName: 'Phytic Acid',
    category: 'DIRECT_ACID',
    aliases: ['phytic acid'],
  },
  {
    canonicalName: 'Dioic Acid',
    category: 'DIRECT_ACID',
    aliases: ['dioic acid', 'sebacic acid'],
  },

  // ─────────────────────────────────────────────────────────────
  // VITAMIN_C (ascorbic acid and derivatives)
  // NOTE: 'vitamin c' alone is intentionally NOT an alias — it is
  // ambiguous across derivatives, so we do not guess.
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'L-Ascorbic Acid',
    category: 'VITAMIN_C',
    aliases: ['l-ascorbic acid', 'ascorbic acid'],
  },
  {
    canonicalName: 'Ascorbyl Glucoside',
    category: 'VITAMIN_C',
    aliases: ['ascorbyl glucoside'],
  },
  {
    canonicalName: 'Ascorbyl Palmitate',
    category: 'VITAMIN_C',
    aliases: ['ascorbyl palmitate'],
  },
  {
    canonicalName: 'Magnesium Ascorbyl Phosphate',
    category: 'VITAMIN_C',
    aliases: ['magnesium ascorbyl phosphate'],
  },
  {
    canonicalName: 'Sodium Ascorbyl Phosphate',
    category: 'VITAMIN_C',
    aliases: ['sodium ascorbyl phosphate'],
  },
  {
    canonicalName: 'Ethyl Ascorbic Acid',
    category: 'VITAMIN_C',
    aliases: ['ethyl ascorbic acid', '3-o-ethyl ascorbic acid'],
  },
  {
    canonicalName: 'Tetrahexyldecyl Ascorbate',
    category: 'VITAMIN_C',
    aliases: ['tetrahexyldecyl ascorbate'],
  },

  // ─────────────────────────────────────────────────────────────
  // NIACINAMIDE
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Niacinamide',
    category: 'NIACINAMIDE',
    aliases: ['niacinamide', 'nicotinamide', 'vitamin b3'],
  },

  // ─────────────────────────────────────────────────────────────
  // PIGMENT_REGULATOR (brightening actives; not exfoliating)
  // Azelaic Acid moved here from DIRECT_ACID because its primary
  // role is anti-inflammatory / pigment regulation.
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Azelaic Acid',
    category: 'PIGMENT_REGULATOR',
    aliases: ['azelaic acid'],
  },
  {
    canonicalName: 'Potassium Azeloyl Diglycinate',
    category: 'PIGMENT_REGULATOR',
    aliases: ['potassium azeloyl diglycinate'],
  },
  {
    canonicalName: 'Arbutin',
    category: 'PIGMENT_REGULATOR',
    aliases: ['alpha arbutin', 'arbutin'],
  },
  {
    canonicalName: 'Kojic Acid',
    category: 'PIGMENT_REGULATOR',
    aliases: ['kojic acid'],
  },
  {
    canonicalName: 'Tranexamic Acid',
    category: 'PIGMENT_REGULATOR',
    aliases: ['tranexamic acid'],
  },
  {
    canonicalName: 'Thiamidol',
    category: 'PIGMENT_REGULATOR',
    aliases: ['thiamidol'],
  },
  {
    canonicalName: 'Licorice Extract',
    category: 'PIGMENT_REGULATOR',
    aliases: ['licorice', 'glycyrrhiza'],
  },
  {
    canonicalName: 'Neoglucosamine',
    category: 'PIGMENT_REGULATOR',
    aliases: ['neoglucosamine'],
  },

  // ─────────────────────────────────────────────────────────────
  // PEPTIDE (signal peptides, carrier peptides, copper peptides)
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Copper Tripeptide',
    category: 'PEPTIDE',
    aliases: ['copper tripeptide', 'copper peptide', 'ghk-cu'],
  },
  {
    canonicalName: 'Palmitoyl Tripeptide',
    category: 'PEPTIDE',
    aliases: ['palmitoyl tripeptide'],
  },
  {
    canonicalName: 'Palmitoyl Pentapeptide',
    category: 'PEPTIDE',
    aliases: ['palmitoyl pentapeptide', 'matrixyl'],
  },
  {
    canonicalName: 'Acetyl Tetrapeptide',
    category: 'PEPTIDE',
    aliases: ['acetyl tetrapeptide'],
  },
  {
    canonicalName: 'Acetyl Hexapeptide',
    category: 'PEPTIDE',
    aliases: ['acetyl hexapeptide', 'argireline'],
  },
  {
    canonicalName: 'Dipeptide',
    category: 'PEPTIDE',
    aliases: ['dipeptide'],
  },
  {
    canonicalName: 'Oligopeptide',
    category: 'PEPTIDE',
    aliases: ['oligopeptide'],
  },

  // ─────────────────────────────────────────────────────────────
  // ANTIOXIDANT
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Ferulic Acid',
    category: 'ANTIOXIDANT',
    aliases: ['ferulic acid'],
  },
  {
    canonicalName: 'Resveratrol',
    category: 'ANTIOXIDANT',
    aliases: ['resveratrol'],
  },
  {
    canonicalName: 'Tocopherol',
    category: 'ANTIOXIDANT',
    aliases: ['tocopherol'],
  },
  {
    canonicalName: 'Green Tea',
    category: 'ANTIOXIDANT',
    aliases: ['green tea', 'camellia sinensis'],
  },
  {
    canonicalName: 'EGCG',
    category: 'ANTIOXIDANT',
    aliases: ['egcg', 'epigallocatechin gallate'],
  },
  {
    canonicalName: 'Quercetin',
    category: 'ANTIOXIDANT',
    aliases: ['quercetin'],
  },
  {
    canonicalName: 'Superoxide Dismutase',
    category: 'ANTIOXIDANT',
    aliases: ['superoxide dismutase'],
  },
  {
    canonicalName: 'Caffeic Acid',
    category: 'ANTIOXIDANT',
    aliases: ['caffeic acid'],
  },

  // ─────────────────────────────────────────────────────────────
  // BARRIER_SUPPORT (skin-identical lipids, ceramide precursors)
  // Squalane lives here (not EMOLLIENT) because its role in our
  // app is barrier support alongside retinoids.
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Ceramide',
    category: 'BARRIER_SUPPORT',
    aliases: [
      'ceramide np',
      'ceramide ap',
      'ceramide eop',
      'ceramide',
    ],
  },
  {
    canonicalName: 'Cholesterol',
    category: 'BARRIER_SUPPORT',
    aliases: ['cholesterol'],
  },
  {
    canonicalName: 'Phytosphingosine',
    category: 'BARRIER_SUPPORT',
    aliases: ['phytosphingosine'],
  },
  {
    canonicalName: 'Squalane',
    category: 'BARRIER_SUPPORT',
    aliases: ['squalane', 'olive squalane'],
  },
  {
    canonicalName: 'Linoleic Acid',
    category: 'BARRIER_SUPPORT',
    aliases: ['linoleic acid'],
  },

  // ─────────────────────────────────────────────────────────────
  // HUMECTANT
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Hyaluronic Acid',
    category: 'HUMECTANT',
    aliases: ['hyaluronic acid', 'sodium hyaluronate', 'hyaluronan'],
  },
  {
    canonicalName: 'Panthenol',
    category: 'HUMECTANT',
    aliases: ['panthenol', 'd-panthenol', 'vitamin b5'],
  },
  {
    canonicalName: 'Sodium PCA',
    category: 'HUMECTANT',
    aliases: ['sodium pca'],
  },
  {
    canonicalName: 'Urea',
    category: 'HUMECTANT',
    aliases: ['urea'],
  },
  {
    canonicalName: 'Trehalose',
    category: 'HUMECTANT',
    aliases: ['trehalose'],
  },
  {
    canonicalName: 'Glycerin',
    category: 'HUMECTANT',
    aliases: ['glycerin', 'glycerol'],
  },
  {
    canonicalName: 'Amino Acids',
    category: 'HUMECTANT',
    aliases: ['amino acids'],
  },

  // ─────────────────────────────────────────────────────────────
  // SOOTHING
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Bisabolol',
    category: 'SOOTHING',
    aliases: ['bisabolol'],
  },
  {
    canonicalName: 'Allantoin',
    category: 'SOOTHING',
    aliases: ['allantoin'],
  },
  {
    canonicalName: 'Madecassoside',
    category: 'SOOTHING',
    aliases: ['madecassoside'],
  },
  {
    canonicalName: 'Centella Asiatica',
    category: 'SOOTHING',
    aliases: ['centella asiatica', 'gotu kola'],
  },
  {
    canonicalName: 'Chamomile',
    category: 'SOOTHING',
    aliases: ['chamomile', 'chamomilla recutita'],
  },
  {
    canonicalName: 'Symsitive',
    category: 'SOOTHING',
    aliases: ['symsitive'],
  },
  {
    canonicalName: 'Aloe Vera',
    category: 'SOOTHING',
    aliases: ['aloe vera', 'aloe barbadensis'],
  },

  // ─────────────────────────────────────────────────────────────
  // EMOLLIENT (oils and butters)
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Argan Oil',
    category: 'EMOLLIENT',
    aliases: ['argan oil'],
  },
  {
    canonicalName: 'Jojoba Oil',
    category: 'EMOLLIENT',
    aliases: ['jojoba oil', 'simmondsia chinensis'],
  },
  {
    canonicalName: 'Shea Butter',
    category: 'EMOLLIENT',
    aliases: ['shea butter', 'butyrospermum parkii'],
  },
  {
    canonicalName: 'Sweet Almond Oil',
    category: 'EMOLLIENT',
    aliases: ['sweet almond oil', 'prunus dulcis'],
  },
  {
    canonicalName: 'Sunflower Oil',
    category: 'EMOLLIENT',
    aliases: ['sunflower oil'],
  },

  // ─────────────────────────────────────────────────────────────
  // UV_FILTER
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Avobenzone',
    category: 'UV_FILTER',
    aliases: ['avobenzone', 'butyl methoxydibenzoylmethane'],
  },
  {
    canonicalName: 'Octinoxate',
    category: 'UV_FILTER',
    aliases: ['octinoxate', 'ethylhexyl methoxycinnamate'],
  },
  {
    canonicalName: 'Octocrylene',
    category: 'UV_FILTER',
    aliases: ['octocrylene'],
  },
  {
    canonicalName: 'Zinc Oxide',
    category: 'UV_FILTER',
    aliases: ['zinc oxide'],
  },
  {
    canonicalName: 'Titanium Dioxide',
    category: 'UV_FILTER',
    aliases: ['titanium dioxide'],
  },
  {
    canonicalName: 'Homosalate',
    category: 'UV_FILTER',
    aliases: ['homosalate'],
  },
  {
    canonicalName: 'Octisalate',
    category: 'UV_FILTER',
    aliases: ['octisalate'],
  },

  // ─────────────────────────────────────────────────────────────
  // NON_TARGET
  // Recognized ingredient, but not evaluated for interactions.
  // Covers tocopheryl esters, water, and a small set of common
  // filler ingredients. Most fillers stay unmatched entirely and
  // are filtered out before analysis.
  // ─────────────────────────────────────────────────────────────
  {
    canonicalName: 'Tocopheryl Acetate',
    category: 'NON_TARGET',
    aliases: ['tocopheryl acetate', 'vitamin e acetate'],
  },
  {
    canonicalName: 'Water',
    category: 'NON_TARGET',
    aliases: ['water', 'aqua'],
  },
  {
    canonicalName: 'Cucumber Extract',
    category: 'NON_TARGET',
    aliases: ['cucumber extract'],
  },
  // pH adjusters / chelators / mild surfactants — never exfoliants at label concentrations
  {
    canonicalName: 'Citric Acid',
    category: 'NON_TARGET',
    aliases: ['citric acid'],
  },
  {
    canonicalName: 'Disodium EDTA',
    category: 'NON_TARGET',
    aliases: ['disodium edta', 'edta'],
  },
  {
    canonicalName: 'Sodium Cocoyl Glycinate',
    category: 'NON_TARGET',
    aliases: ['sodium cocoyl glycinate'],
  },
  {
    canonicalName: 'Coco-Glucoside',
    category: 'NON_TARGET',
    aliases: ['coco-glucoside', 'coco glucoside'],
  },
];
