/** Splits a pasted INCI list ("Aqua, Glycerin; Retinol\nNiacinamide") into clean, de-duplicated names. */
export function parseIngredientList(text: string): string[] {
  const seen = new Set<string>();
  return text
    .split(/[,;\n]+/)
    .map((s) => s.replace(/^\s*ingredients?\s*:/i, "").trim())
    .filter((s) => {
      const key = s.toLowerCase();
      if (!s || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}