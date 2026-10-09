"use client";

import { useId } from "react";
import { ChevronDown } from "lucide-react";
import type { ProductDraft, ProductOption } from "../../../types/compatibility";
import { parseIngredientList } from "../utils/parseIngredients";

interface ProductInputCardProps {
  /** e.g. "Product A" */
  label: string;
  draft: ProductDraft;
  catalog: ProductOption[];
  /** Hide the product already chosen in the other card. */
  excludeId?: string;
  onSelect: (id: string) => void;
  onIngredientsChange: (text: string) => void;
  onClear: () => void;
  disabled?: boolean;
}

const fieldClass =
  "w-full rounded-[var(--radius-control)] border border-[var(--sw-line)] bg-[var(--sw-white)] font-[family-name:var(--font-display)] text-[0.9375rem] text-[var(--sw-charcoal)] outline-none focus:border-[var(--sw-green)] disabled:opacity-60";

/** One product slot: library dropdown + editable ingredient textarea. */
export default function ProductInputCard({
  label,
  draft,
  catalog,
  excludeId,
  onSelect,
  onIngredientsChange,
  onClear,
  disabled = false,
}: ProductInputCardProps) {
  const id = useId();
  const count = parseIngredientList(draft.ingredients).length;
  const hasContent = Boolean(draft.presetId || draft.ingredients);

  return (
    <section aria-labelledby={`${id}-title`} className="sw-card flex flex-col p-6">
      <header className="flex items-center justify-between">
        <h2 id={`${id}-title`} className="!text-xl">
          {label}
        </h2>
        {hasContent && (
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            className="sw-small text-[var(--sw-muted)] underline-offset-2 hover:text-[var(--sw-forest)] hover:underline disabled:opacity-60"
          >
            Clear
          </button>
        )}
      </header>

      <label htmlFor={`${id}-select`} className="sw-small mt-5 text-[var(--sw-forest)]">
        Choose a product
      </label>
      <div className="relative mt-1.5">
        <select
          id={`${id}-select`}
          value={draft.presetId}
          disabled={disabled}
          onChange={(e) => onSelect(e.target.value)}
          className={`${fieldClass} cursor-pointer appearance-none py-3 pl-4 pr-10`}
        >
          <option value="">Pick from the library, or paste your own below</option>
          {catalog
            .filter((p) => p.id !== excludeId)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.brand ? `${p.brand} — ${p.name}` : p.name}
              </option>
            ))}
        </select>
        <ChevronDown
          size={18}
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--sw-muted)]"
        />
      </div>

      <label htmlFor={`${id}-text`} className="sw-small mt-5 text-[var(--sw-forest)]">
        Ingredients
      </label>
      <textarea
        id={`${id}-text`}
        value={draft.ingredients}
        disabled={disabled}
        onChange={(e) => onIngredientsChange(e.target.value)}
        rows={8}
        placeholder="Paste the ingredient list from the label, e.g. Aqua, Glycerin, Retinol…"
        aria-describedby={`${id}-count`}
        className={`${fieldClass} mt-1.5 resize-y px-4 py-3 leading-relaxed placeholder:text-[var(--sw-muted)]/70`}
      />
      <p id={`${id}-count`} className="sw-small mt-2 text-[var(--sw-muted)]" aria-live="polite">
        {count > 0 ? `${count} ingredient${count === 1 ? "" : "s"} detected` : "Separate ingredients with commas or new lines."}
      </p>
    </section>
  );
}