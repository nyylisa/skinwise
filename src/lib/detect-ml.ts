import { ACTIVES, ActiveCategory } from './actives';
import { DetectedActive } from './detect';

const ML_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * Lookup map: lowercase ingredient name → curated ActiveCategory from actives.ts.
 * When the ML model disagrees with our curated list, the curated list wins.
 * This prevents model drift from producing false positives on well-known
 * pH adjusters, chelators, and mild surfactants (e.g. Citric Acid → DIRECT_ACID).
 */
const CURATED_OVERRIDE = new Map<string, ActiveCategory>(
  ACTIVES.flatMap(a => a.aliases.map(alias => [alias.toLowerCase(), a.category]))
);

export async function detectActivesWithML(
  rawIngredients: string
): Promise<DetectedActive[]> {
  const list = rawIngredients
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (list.length === 0) return [];

  const res = await fetch(`${ML_URL}/classify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    },
    body: JSON.stringify({ ingredients: list }),
  });

  if (!res.ok) throw new Error(`ML service returned ${res.status}`);

  const data: { results: Array<{ ingredient: string; category: string }> } =
    await res.json();

  return data.results.map(r => {
    // Prefer the curated category when we have a known definition.
    const curated = CURATED_OVERRIDE.get(r.ingredient.toLowerCase());
    const category = (curated ?? r.category) as ActiveCategory;
    return {
      canonicalName: r.ingredient,
      category,
      matchedAlias: r.ingredient,
    };
  });
}
