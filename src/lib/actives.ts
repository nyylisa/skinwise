export type ActiveCategory =
  | "RETINOID"
  | "DIRECT_ACID"
  | "VITAMIN_C"
  | "NIACINAMIDE"
  | "BARRIER_SUPPORT";

export interface ActiveDefinition {
  canonicalName: string;
  category: ActiveCategory;
  patterns: RegExp[];
}

export const KNOWN_ACTIVES: ActiveDefinition[] = [
  {
    canonicalName: "Retinoid (Retinol / Derivatives)",
    category: "RETINOID",
    patterns: [
      /\bretinol\b/i,
      /\bretinal\b/i,
      /\bretinaldehyde\b/i,
      /\btretinoin\b/i,
      /\badapalene\b/i,
      /\bhydroxypinacolone retinoate\b/i,
      /\bretinyl palmitate\b/i,
    ],
  },
  {
    canonicalName: "Direct Acid (AHA / BHA / PHA)",
    category: "DIRECT_ACID",
    patterns: [
      /\bsalicylic acid\b/i,
      /\bglycolic acid\b/i,
      /\blactic acid\b/i,
      /\bmandelic acid\b/i,
      /\bgluconolactone\b/i,
      /\blactobionic acid\b/i,
      /\bbetaine salicylate\b/i,
    ],
  },
  {
    canonicalName: "Vitamin C (L-Ascorbic Acid / Esters)",
    category: "VITAMIN_C",
    patterns: [
      /\bl-ascorbic acid\b/i,
      /\bascorbic acid\b/i,
      /\b3-o-ethyl ascorbic acid\b/i,
      /\btetrahexyldecyl ascorbate\b/i,
      /\bsodium ascorbyl phosphate\b/i,
      /\bmagnesium ascorbyl phosphate\b/i,
    ],
  },
  {
    canonicalName: "Niacinamide (Vitamin B3)",
    category: "NIACINAMIDE",
    patterns: [/\bniacinamide\b/i, /\bnicotinamide\b/i],
  },
  {
    canonicalName: "Barrier Support (Ceramides / Peptides / Hyaluronic)",
    category: "BARRIER_SUPPORT",
    patterns: [
      /\bceramide\b/i,
      /\bhyaluronic acid\b/i,
      /\bsodium hyaluronate\b/i,
      /\bcentella asiatica\b/i,
      /\bmadecassoside\b/i,
      /\bpanthenol\b/i,
      /\bpeptide\b/i,
      /\bcopper tripeptide\b/i,
    ],
  },
];

export interface DetectedActive {
  canonicalName: string;
  category: ActiveCategory;
  matchedText: string;
}

export function extractActives(ingredientsText: string): DetectedActive[] {
  if (!ingredientsText) return [];
  const found: DetectedActive[] = [];
  const seenCategories = new Set<string>();

  for (const def of KNOWN_ACTIVES) {
    for (const pattern of def.patterns) {
      const match = ingredientsText.match(pattern);
      if (match && !seenCategories.has(def.canonicalName)) {
        found.push({
          canonicalName: def.canonicalName,
          category: def.category,
          matchedText: match[0],
        });
        seenCategories.add(def.canonicalName);
        break;
      }
    }
  }

  return found;
}
