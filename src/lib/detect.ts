// lib/detect.ts
//
// Ingredient detection with longest-alias-wins matching.
//
// Why longest first:
//   "sodium hyaluronate" must beat "hyaluronan"
//   "alpha arbutin" must beat "arbutin"
//   "tocopheryl acetate" must beat "tocopherol"
// Processing aliases in descending length order guarantees the
// most specific match wins before a generic one can fire.

import { ACTIVES, ActiveCategory } from './actives';

export interface DetectedActive {
  canonicalName: string;
  category: ActiveCategory;
  matchedAlias: string;
}

/**
 * Normalize raw INCI text: lowercase, strip parentheses, collapse
 * whitespace, remove punctuation that would break word boundaries.
 */
export function normalizeIngredients(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')      // drop parentheticals
    .replace(/[^a-z0-9\s,;/-]/g, ' ') // drop stray punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Pre-compute a flat list of { alias, active } sorted longest-first.
// Doing this once at module load is faster than sorting per request.
const ALIAS_INDEX: Array<{ alias: string; active: (typeof ACTIVES)[number] }> =
  ACTIVES.flatMap(active =>
    active.aliases.map(alias => ({ alias, active }))
  ).sort((a, b) => b.alias.length - a.alias.length);

export function detectActives(rawIngredients: string): DetectedActive[] {
  const normalized = normalizeIngredients(rawIngredients);
  const found = new Map<string, DetectedActive>();

  for (const { alias, active } of ALIAS_INDEX) {
    // Skip if we already matched this canonical ingredient
    if (found.has(active.canonicalName)) continue;

    const pattern = new RegExp(`\\b${escapeRegex(alias)}\\b`, 'i');
    if (pattern.test(normalized)) {
      found.set(active.canonicalName, {
        canonicalName: active.canonicalName,
        category: active.category,
        matchedAlias: alias,
      });
    }
  }

  return Array.from(found.values());
}

/**
 * Filter detected actives down to categories that participate in
 * interaction rules. NON_TARGET is excluded so it never contributes
 * a verdict.
 */
export function detectedForAnalysis(
  detected: DetectedActive[]
): DetectedActive[] {
  return detected.filter(a => a.category !== 'NON_TARGET');
}
