import { detectActives, DetectedActive } from './detect';
import { detectActivesWithML } from './detect-ml';

/**
 * Try ML first; fall back to regex if the service is unavailable.
 * This keeps the app working even if the Python service is down.
 */
export async function detectActivesSafe(
  rawIngredients: string
): Promise<DetectedActive[]> {
  try {
    return await detectActivesWithML(rawIngredients);
  } catch (err) {
    console.warn('ML service unavailable, using regex fallback:', err);
    return detectActives(rawIngredients);
  }
}
