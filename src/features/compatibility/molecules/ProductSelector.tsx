"use client";

import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ProductOption } from "../../../types/compatibility";
import IngredientTag from "../atoms/IngredientTag";

interface ProductSelectorProps {
  /** Visible to screen readers + used in the placeholder, e.g. "Product A". */
  label: string;
  catalog: ProductOption[];
  value: ProductOption | null;
  onSelect: (product: ProductOption) => void;
  onClear: () => void;
  /** Hide the product already chosen in the other slot. */
  excludeId?: string;
  disabled?: boolean;
}

const MAX_SUGGESTIONS = 6;

/** Searchable combobox for ONE product slot. Once chosen, shows a removable tag instead. */
export default function ProductSelector({ label, catalog, value, onSelect, onClear, excludeId, disabled = false }: ProductSelectorProps) {
  const uid = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog
      .filter((p) => p.id !== excludeId)
      .filter((p) => !q || `${p.brand ?? ""} ${p.name}`.toLowerCase().includes(q))
      .slice(0, MAX_SUGGESTIONS);
  }, [catalog, excludeId, query]);

  if (value) {
    return (
      <div className="flex min-h-[3rem] items-center">
        <IngredientTag label={value.brand ? `${value.name} · ${value.brand}` : value.name} tone="active" withIcon onRemove={onClear} />
      </div>
    );
  }

  const showList = open && !disabled && options.length > 0;
  const optionId = (i: number) => `${uid}-opt-${i}`;

  function choose(option: ProductOption) {
    onSelect(option);
    setQuery("");
    setActive(0);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && showList && options[active]) {
      e.preventDefault();
      choose(options[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <label htmlFor={`${uid}-input`} className="sr-only">
        Search for {label}
      </label>
      <Search size={18} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--sw-muted)]" />
      <input
        id={`${uid}-input`}
        role="combobox"
        aria-expanded={showList}
        aria-controls={`${uid}-list`}
        aria-activedescendant={showList ? optionId(active) : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        value={query}
        disabled={disabled}
        placeholder={`Search for ${label}…`}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        className="w-full rounded-[var(--radius-control)] border border-[var(--sw-line)] bg-[var(--sw-white)] py-3 pl-11 pr-4 font-[family-name:var(--font-display)] text-[0.9375rem] outline-none placeholder:text-[var(--sw-muted)]/70 focus:border-[var(--sw-green)] disabled:opacity-60"
      />

      {showList && (
        <ul
          id={`${uid}-list`}
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-[var(--radius-control)] border border-[var(--sw-line)] bg-[var(--sw-cream)]"
        >
          {options.map((o, i) => (
            <li
              key={o.id}
              id={optionId(i)}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault() /* keep input focus */}
              onClick={() => choose(o)}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-baseline justify-between gap-3 px-4 py-2.5 ${i === active ? "bg-[var(--sw-mint)]" : ""}`}
            >
              <span className="font-[family-name:var(--font-display)] text-[0.9375rem] font-medium text-[var(--sw-forest)]">{o.name}</span>
              <span className="sw-small shrink-0 text-[var(--sw-muted)]">{o.brand}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}