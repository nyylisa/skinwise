import type { ConflictPair } from "../../../types/analysis";
import type { Severity } from "../../../types/compatibility";
import SeverityBadge from "../atoms/SeverityBadge";
import StatusIcon from "../atoms/StatusIcon";
import { SEVERITY } from "../atoms/severity";

interface InteractionCardProps {
  pair: ConflictPair;
  /** Derived from the overall AnalysisResult.status. */
  severity: Severity;
}

export default function InteractionCard({ pair, severity }: InteractionCardProps) {
  const s = SEVERITY[severity];

  return (
    <article className="sw-card p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h3>
          {pair.compound1} <span className="text-[var(--sw-muted)]">+</span> {pair.compound2}
        </h3>
        <SeverityBadge severity={severity} />
      </header>

      <div className={`mt-4 flex items-start gap-2.5 rounded-[var(--radius-control)] px-4 py-3 ${s.bg}`}>
        <StatusIcon status={severity} size={16} className="mt-1" />
        <p className="text-[1rem] leading-snug">
          <strong className="font-[family-name:var(--font-display)] font-semibold">Why: </strong>
          {pair.mechanism}
        </p>
      </div>
    </article>
  );
}