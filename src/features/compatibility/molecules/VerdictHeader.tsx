import type { CompatibilityStatus } from "../../../types/analysis";
import IngredientTag from "../atoms/IngredientTag";
import SeverityBadge from "../atoms/SeverityBadge";
import StatusIcon from "../atoms/StatusIcon";
import { SEVERITY, toSeverity } from "../atoms/severity";

interface VerdictHeaderProps {
  status: CompatibilityStatus;
  /** AnalysisResult.summaryTitle */
  title: string;
  /** AnalysisResult.biochemicalExplanation */
  explanation: string;
  /** Products checked, with the actives detected in each. */
  products: { name: string; actives: string[] }[];
}

export default function VerdictHeader({ status, title, explanation, products }: VerdictHeaderProps) {
  const severity = toSeverity(status);
  const s = SEVERITY[severity];

  return (
    <section aria-labelledby="verdict-title" className="sw-card p-6 md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className={`grid size-20 shrink-0 place-items-center rounded-full border-2 ${s.bg} ${s.border}`}>
          <StatusIcon status={severity} size={34} />
        </div>

        <div>
          <SeverityBadge severity={severity} size="md" />
          <h2 id="verdict-title" className="mt-3">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-[1.0625rem] leading-relaxed">{explanation}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 border-t border-[var(--sw-line)] pt-5 sm:grid-cols-2">
        {products.map((p) => (
          <div key={p.name}>
            <p className="sw-small text-[var(--sw-muted)]">Actives in {p.name}</p>
            {p.actives.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {p.actives.map((a, idx) => (
                  <li key={`${a}-${idx}`}>
                    <IngredientTag label={a} tone="active" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[0.9375rem] text-[var(--sw-muted)]">No known actives detected.</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}