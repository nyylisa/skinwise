import { Tag, X } from "lucide-react";
import type { Severity } from "../../../types/compatibility";
import { SEVERITY } from "./severity";

export type IngredientTagTone = "neutral" | "active" | Severity;

interface IngredientTagProps {
  label: string;
  tone?: IngredientTagTone;
  /** Show the small tag glyph (used for product chips). */
  withIcon?: boolean;
  /** Makes the tag a button (e.g. quick-search suggestions). */
  onClick?: () => void;
  /** Adds a remove button (e.g. selected products). */
  onRemove?: () => void;
  className?: string;
}

const TONES: Record<"neutral" | "active", string> = {
  neutral: "bg-[var(--sw-white)] border-[var(--sw-line)] text-[var(--sw-charcoal)]",
  active: "bg-[var(--sw-soft)] border-[var(--sw-soft)] text-[var(--sw-forest)]",
};

export default function IngredientTag({
  label,
  tone = "neutral",
  withIcon = false,
  onClick,
  onRemove,
  className = "",
}: IngredientTagProps) {
  const toneClass =
    tone === "neutral" || tone === "active"
      ? TONES[tone]
      : `${SEVERITY[tone].bg} ${SEVERITY[tone].border} ${SEVERITY[tone].text}`;

  const base = `inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-[family-name:var(--font-display)] text-[0.8125rem] font-medium leading-tight transition-colors ${toneClass} ${className}`;

  const content = (
    <>
      {withIcon && <Tag size={13} strokeWidth={1.75} aria-hidden className="shrink-0 opacity-70" />}
      <span>{label}</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} cursor-pointer hover:border-[var(--sw-green)]`}>
        {content}
      </button>
    );
  }

  return (
    <span className={base}>
      {content}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="-mr-1 grid size-4 place-items-center rounded-full hover:bg-black/10"
        >
          <X size={12} strokeWidth={2} aria-hidden />
        </button>
      )}
    </span>
  );
}