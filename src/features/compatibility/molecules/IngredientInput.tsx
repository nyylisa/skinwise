"use client";

import { useId, useState } from "react";
import IngredientTag from "../atoms/IngredientTag";
import { parseIngredientList } from "../utils/parseIngredients";

interface IngredientInputProps {
  /** Called with the product name and the raw ingredient string (sent as-is to the API). */
  onSubmit: (name: string, ingredients: string) => void;
  submitLabel?: string;
  disabled?: boolean;
}

const PREVIEW_LIMIT = 8;

const fieldClass =
  "w-full rounded-[var(--radius-control)] border border-[var(--sw-line)] bg-[var(--sw-white)] px-4 py-2.5 font-[family-name:var(--font-display)] text-[0.9375rem] text-[var(--sw-charcoal)] outline-none placeholder:text-[var(--sw-muted)]/70 focus:border-[var(--sw-green)] disabled:opacity-60";

/** Paste a product's ingredient list (INCI) to add a product that isn't in the catalog. */
export default function IngredientInput({ onSubmit, submitLabel = "Use this product", disabled = false }: IngredientInputProps) {
  const id = useId();
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const parsed = parseIngredientList(text);
  const canSubmit = parsed.length > 0 && !disabled;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(name, text.trim());
    setName("");
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor={`${id}-name`} className="sw-small text-[var(--sw-forest)]">
          Product name
        </label>
        <input
          id={`${id}-name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. My night serum"
          disabled={disabled}
          className={`${fieldClass} mt-1.5`}
        />
      </div>

      <div>
        <label htmlFor={`${id}-list`} className="sw-small text-[var(--sw-forest)]">
          Ingredient list
        </label>
        <textarea
          id={`${id}-list`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Paste from the label: Aqua, Glycerin, Retinol, Niacinamide…"
          disabled={disabled}
          aria-describedby={`${id}-hint`}
          className={`${fieldClass} mt-1.5 resize-y`}
        />
        <p id={`${id}-hint`} className="sw-small mt-1.5 text-[var(--sw-muted)]">
          Separate ingredients with commas or new lines.
        </p>
      </div>

      {parsed.length > 0 && (
        <div aria-live="polite">
          <p className="sw-small text-[var(--sw-muted)]">
            {parsed.length} ingredient{parsed.length === 1 ? "" : "s"} found
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {parsed.slice(0, PREVIEW_LIMIT).map((ing, idx) => (
              <li key={`${ing}-${idx}`}>
                <IngredientTag label={ing} />
              </li>
            ))}
            {parsed.length > PREVIEW_LIMIT && (
              <li>
                <IngredientTag label={`+${parsed.length - PREVIEW_LIMIT} more`} tone="active" />
              </li>
            )}
          </ul>
        </div>
      )}

      <button type="submit" disabled={!canSubmit} className="sw-btn sw-btn-secondary disabled:cursor-not-allowed disabled:opacity-50">
        {submitLabel}
      </button>
    </form>
  );
}