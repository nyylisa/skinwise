import type { CompatibilityPreset, ProductOption } from "../types/compatibility";

/**
 * Static product library for the dropdowns.
 * NOTE: INCI lists are abridged from public labels and formulas change over time —
 * verify against current packaging before treating them as authoritative.
 */
export const CATALOG: ProductOption[] = [
  {
    id: "paulas-choice-2-bha",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "Toner",
    ingredients:
      "Water, Methylpropanediol, Butylene Glycol, Salicylic Acid, Polysorbate 20, Camellia Oleifera Leaf Extract, Sodium Hydroxide, Tetrasodium EDTA",
  },
  {
    id: "ordinary-retinol-05",
    name: "Retinol 0.5% in Squalane",
    brand: "The Ordinary",
    category: "Serum",
    ingredients:
      "Squalane, Caprylic/Capric Triglyceride, Simmondsia Chinensis (Jojoba) Seed Oil, Solanum Lycopersicum (Tomato) Fruit Extract, Rosmarinus Officinalis (Rosemary) Leaf Extract, Retinol, Tocopherol, BHT",
  },
  {
    id: "cerave-pm",
    name: "PM Facial Moisturizing Lotion",
    brand: "CeraVe",
    category: "Moisturizer",
    ingredients:
      "Aqua/Water, Glycerin, Niacinamide, Caprylic/Capric Triglyceride, Cetearyl Alcohol, Cetyl Alcohol, Dimethicone, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Carbomer, Behentrimonium Methosulfate, Phenoxyethanol, Ethylhexylglycerin, Xanthan Gum",
  },
  {
    id: "ordinary-ha-b5",
    name: "Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "Serum",
    ingredients:
      "Aqua (Water), Sodium Hyaluronate, Pentylene Glycol, Propanediol, Panthenol, Ahnfeltia Concinna Extract, Glycerin, Trisodium Ethylenediamine Disuccinate, Citric Acid, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin",
  },
  {
    id: "ordinary-niacinamide-zinc",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "Serum",
    ingredients:
      "Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin",
  },
  {
    id: "skinceuticals-ce-ferulic",
    name: "C E Ferulic",
    brand: "SkinCeuticals",
    category: "Serum",
    ingredients:
      "Water, Ethoxydiglycol, L-Ascorbic Acid, Glycerin, Laureth-23, Phenoxyethanol, Tocopherol, Triethanolamine, Ferulic Acid",
  },
  {
    id: "pixi-glow-tonic",
    name: "Glow Tonic (5% Glycolic Acid)",
    brand: "Pixi",
    category: "Toner",
    ingredients:
      "Aqua (Water), Glycolic Acid, Aloe Barbadensis Leaf Juice, Panax Ginseng Root Extract, Glycerin, Sodium Hydroxide, Sodium Benzoate, Potassium Sorbate, Parfum",
  },
  {
    id: "cerave-moisturising-cream",
    name: "Moisturising Cream",
    brand: "CeraVe",
    category: "Moisturizer",
    ingredients:
      "Aqua/Water, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Petrolatum, Potassium Phosphate, Ceramide NP, Ceramide AP, Ceramide EOP, Carbomer, Dimethicone, Behentrimonium Methosulfate, Sodium Lauroyl Lactylate, Sodium Hyaluronate, Cholesterol, Phenoxyethanol, Disodium EDTA, Tocopherol, Phytosphingosine, Xanthan Gum, Ethylhexylglycerin",
  },
  {
    id: "lrp-effaclar-duo",
    name: "Effaclar Duo (Benzoyl Peroxide 5.5%)",
    brand: "La Roche-Posay",
    category: "Treatment",
    ingredients:
      "Benzoyl Peroxide, Water, Glycerin, Dimethicone, Isononyl Isononanoate, Hydroxyethyl Acrylate/Sodium Acryloyldimethyl Taurate Copolymer, Capryloyl Salicylic Acid, Zinc PCA, Caprylyl Glycol, Disodium EDTA",
  },
  {
    id: "cosrx-snail-96",
    name: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    category: "Serum",
    ingredients:
      "Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Hyaluronate, Panthenol, Arginine, Allantoin, Ethyl Hexanediol, Sodium Polyacrylate, Carbomer, Phenoxyethanol",
  },
];

export function getProduct(id: string): ProductOption | undefined {
  return CATALOG.find((p) => p.id === id);
}

/**
 * One-click demos. Each pair is chosen to hit a specific rule in lib/matrix.ts:
 *   Conflict: RETINOID + DIRECT_ACID      → CONFLICT (ALTERNATE_DAYS)
 *   Caution:  RETINOID + VITAMIN_C        → CAUTION  (AM_PM_SPLIT)
 *   Safe:     RETINOID + BARRIER_SUPPORT  → SAFE     (LAYER_TOGETHER)
 * (SAFE is only reachable through an explicit rule, so keep one retinoid in the safe demo.)
 */
export const PRESETS: CompatibilityPreset[] = [
  {
    id: "conflict-demo",
    label: "Load Conflict Demo",
    severity: "not_recommended",
    description: "Retinol + 2% BHA exfoliant",
    product1Id: "ordinary-retinol-05",
    product2Id: "paulas-choice-2-bha",
  },
  {
    id: "caution-demo",
    label: "Load Caution Demo",
    severity: "caution",
    description: "Retinol + Vitamin C serum",
    product1Id: "ordinary-retinol-05",
    product2Id: "skinceuticals-ce-ferulic",
  },
  {
    id: "safe-demo",
    label: "Load Safe Demo",
    severity: "compatible",
    description: "Retinol + CeraVe Moisturising Cream",
    product1Id: "ordinary-retinol-05",
    product2Id: "cerave-moisturising-cream",
  },
];