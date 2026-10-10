"use client";

import { useEffect, useRef } from "react";
import { LoaderCircle, RotateCcw } from "lucide-react";
import { CATALOG, PRESETS } from "../lib/preset";
import { useCompatibility } from "../features/compatibility/hooks/useCompatibility";
import StatusIcon from "../features/compatibility/atoms/StatusIcon";
import { SEVERITY } from "../features/compatibility/atoms/severity";
import PresetToolbar from "../features/compatibility/organisms/PresetToolbar";
import ProductInputCard from "../features/compatibility/organisms/ProductInputCard";
import ResultPanel from "../features/compatibility/organisms/ResultPanel";

/**
 * Compatibility checker screen: wires useCompatibility() to the organisms.
 *
 *   PresetToolbar ─┐
 *   ProductInputCard ×2 ─┤→ [Check Compatibility] → POST /api/analyze → ResultPanel
 *   (state, loading, error, result live in useCompatibility)
 */
export default function CompatibilityPage() {
  const c = useCompatibility();
  const topRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Bring the result into view and move focus there for keyboard / screen-reader users.
  useEffect(() => {
    if (!c.result) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    resultRef.current?.focus({ preventScroll: true });
  }, [c.result]);

  function checkAnother() {
    c.reset();
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const announcement = c.isLoading
    ? "Analysing your products…"
    : c.result && c.severity
      ? `Result ready: ${SEVERITY[c.severity].label}.`
      : c.error ?? "";

  return (
    <div className="bg-[var(--sw-mint)] py-14 md:py-20">
      <div ref={topRef} className="sw-container scroll-mt-24">
        {/* Intro */}
        <p className="sw-eyebrow">Compatibility checker</p>
        <h1 className="mt-2 !text-[2rem] md:!text-[2.5rem]">Check if your products work well together</h1>
        <p className="mt-3 max-w-2xl text-[var(--sw-forest)]/85">
          Pick two products or paste their ingredient lists. SkinWise flags conflicting actives and tells you when to
          use each one.
        </p>

        {/* Presets */}
        <div className="mt-8">
          <PresetToolbar presets={PRESETS} onLoad={c.loadPreset} disabled={c.isLoading} />
        </div>

        {/* Inputs */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <ProductInputCard
            label="Product A"
            draft={c.product1}
            catalog={CATALOG}
            excludeId={c.product2.presetId}
            onSelect={(id) => c.selectPreset(1, id)}
            onIngredientsChange={(t) => c.setIngredients(1, t)}
            onClear={() => c.clearProduct(1)}
            disabled={c.isLoading}
          />
          <ProductInputCard
            label="Product B"
            draft={c.product2}
            catalog={CATALOG}
            excludeId={c.product1.presetId}
            onSelect={(id) => c.selectPreset(2, id)}
            onIngredientsChange={(t) => c.setIngredients(2, t)}
            onClear={() => c.clearProduct(2)}
            disabled={c.isLoading}
          />
        </div>

        {/* Action */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={c.analyze}
            disabled={!c.canAnalyze}
            className="sw-btn sw-btn-primary min-w-56 !py-3 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {c.isLoading ? (
              <>
                <LoaderCircle size={18} className="animate-spin" aria-hidden /> Analysing…
              </>
            ) : (
              "Check Compatibility"
            )}
          </button>
          {c.missing > 0 && !c.isLoading && (
            <p className="sw-small text-[var(--sw-muted)]">
              Add ingredients for {c.missing === 2 ? "both products" : "the other product"} to run a check.
            </p>
          )}
        </div>

        {/* Screen-reader announcements for loading / result / error */}
        <p className="sr-only" role="status" aria-live="polite">
          {announcement}
        </p>

        {/* Error */}
        {c.error && (
          <div
            role="alert"
            className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-[var(--radius-control)] border border-[var(--sw-danger)] bg-[var(--sw-danger-bg)] px-4 py-3"
          >
            <StatusIcon status="not_recommended" size={18} className="mt-1" />
            <p className="text-[var(--sw-danger-text)]">{c.error}</p>
          </div>
        )}

        {/* Result */}
        {c.result && (
          <div ref={resultRef} tabIndex={-1} className="mt-12 scroll-mt-24 outline-none">
            <ResultPanel result={c.result} productNames={c.names} />

            <div className="mt-10 flex flex-col items-center gap-4">
              <button type="button" onClick={checkAnother} className="sw-btn sw-btn-secondary">
                <RotateCcw size={16} aria-hidden /> Check another combination
              </button>
              <p className="sw-small max-w-xl text-center text-[var(--sw-muted)]">
                SkinWise offers general ingredient guidance, not medical advice. If you have sensitive skin or a skin
                condition, check with a dermatologist before changing your routine.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}