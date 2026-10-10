import type { CompatibilityPreset } from "../../../types/compatibility";
import StatusIcon from "../atoms/StatusIcon";
import { SEVERITY } from "../atoms/severity";

interface PresetToolbarProps {
  presets: CompatibilityPreset[];
  onLoad: (preset: CompatibilityPreset) => void;
  disabled?: boolean;
}

/** One-click demo buttons (Conflict / Caution / Safe) that fill both product slots. */
export default function PresetToolbar({ presets, onLoad, disabled = false }: PresetToolbarProps) {
  return (
    <div role="group" aria-labelledby="preset-label">
      <p id="preset-label" className="sw-small text-[var(--sw-muted)]">
        Try a preset combination
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {presets.map((p) => {
          const s = SEVERITY[p.severity];
          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onLoad(p)}
              className={`flex items-start gap-3 rounded-[var(--radius-control)] border bg-[var(--sw-cream)] px-4 py-3 text-left transition-colors hover:bg-[var(--sw-white)] disabled:cursor-not-allowed disabled:opacity-60 ${s.border}`}
            >
              <StatusIcon status={p.severity} size={18} className="mt-0.5" />
              <span>
                <span className={`block font-[family-name:var(--font-display)] text-[0.9375rem] font-semibold ${s.text}`}>
                  {p.label}
                </span>
                <span className="sw-small mt-0.5 block text-[var(--sw-muted)]">{p.description}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}