import type { AnalysisResult, CompatibilityStatus, ConflictPair } from "@/src/types/analysis";
import { toSeverity } from "../atoms/severity";
import StatusIcon from "../atoms/StatusIcon";
import InteractionCard from "../molecules/InteractionCard";
import TimingAdvice from "../molecules/TimingAdvice";
import VerdictHeader from "../molecules/VerdictHeader";

/** Backend pairs may carry their own rule status (optional field); otherwise fall back to the overall status. */
type Pair = ConflictPair & { status?: CompatibilityStatus };

interface ResultPanelProps {
  result: AnalysisResult;
  /** Display names for product 1 and product 2. */
  productNames: [string, string];
}

/** Result dashboard: verdict + actives, conflict breakdown, timing advice. */
export default function ResultPanel({ result, productNames }: ResultPanelProps) {
  const severity = toSeverity(result.status);
  const hasPairs = result.conflictPairs.length > 0;

  return (
    <div role="region" aria-label="Compatibility results" className="space-y-6">
      <VerdictHeader
        status={result.status}
        title={result.summaryTitle}
        explanation={result.biochemicalExplanation}
        products={[
          { name: productNames[0], actives: result.activesProduct1 },
          { name: productNames[1], actives: result.activesProduct2 },
        ]}
      />

      <section aria-labelledby="conflicts-title">
        <h2 id="conflicts-title">Ingredient interactions</h2>
        {hasPairs ? (
          <div className="mt-4 space-y-4">
            {(result.conflictPairs as Pair[]).map((pair) => (
              <InteractionCard
                key={`${pair.compound1}+${pair.compound2}`}
                pair={pair}
                severity={pair.status ? toSeverity(pair.status) : severity}
              />
            ))}
          </div>
        ) : (
          <div className="sw-card mt-4 flex items-start gap-3 p-5">
            <StatusIcon status={severity} size={20} className="mt-0.5" />
            <p>
              {result.status === "INSUFFICIENT_DATA"
                ? "We couldn't identify enough known actives to check for conflicts. Double-check the ingredient lists."
                : "No conflicting pairs were found between these two products."}
            </p>
          </div>
        )}
      </section>

      <TimingAdvice protocol={result.timingProtocol} />
    </div>
  );
}