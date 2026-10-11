"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type AnalyzeResponse, type AnalyzeRequest } from "../../../types/analysis";
import type { CompatibilityPreset, ProductDraft, ProductSlot, RequestStatus } from "../../../types/compatibility";
import { getProduct } from "../../../lib/preset";
import { toSeverity } from "../atoms/severity";

type Drafts = Record<ProductSlot, ProductDraft>;

const EMPTY_DRAFT: ProductDraft = { presetId: "", name: "", ingredients: "" };
const EMPTY: Drafts = { 1: EMPTY_DRAFT, 2: EMPTY_DRAFT };
const FALLBACK_NAME: Record<ProductSlot, string> = { 1: "Product A", 2: "Product B" };

/**
 * Client state + data layer for the compatibility checker (MVP: exactly two products).
 * Holds the two product drafts, the request status, the error and the result.
 *
 * Flow: fill both slots (library pick, preset or typed/pasted list) → analyze() → POST /api/analyze → AnalysisResult.
 */
export function useCompatibility() {
  const [drafts, setDrafts] = useState<Drafts>(EMPTY);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  /** Any input change makes the current result stale, so clear it. */
  const invalidate = useCallback(() => {
    abortRef.current?.abort();
    setResult(null);
    setError(null);
    setStatus("idle");
  }, []);

  /** Pick a library product → fills name + ingredient text (still editable). "" clears the slot. */
  const selectPreset = useCallback(
    (slot: ProductSlot, id: string) => {
      const p = id ? getProduct(id) : undefined;
      setDrafts((prev) => ({
        ...prev,
        [slot]: p ? { presetId: p.id, name: p.name, ingredients: p.ingredients } : EMPTY_DRAFT,
      }));
      invalidate();
    },
    [invalidate],
  );

  /** User typed/pasted/edited the ingredient text. */
  const setIngredients = useCallback(
    (slot: ProductSlot, ingredients: string) => {
      setDrafts((prev) => ({ ...prev, [slot]: { ...prev[slot], ingredients } }));
      invalidate();
    },
    [invalidate],
  );

  const clearProduct = useCallback(
    (slot: ProductSlot) => {
      setDrafts((prev) => ({ ...prev, [slot]: EMPTY_DRAFT }));
      invalidate();
    },
    [invalidate],
  );

  /** One-click demo: fills both slots from the catalog. */
  const loadPreset = useCallback(
    (preset: CompatibilityPreset) => {
      const p1 = getProduct(preset.product1Id);
      const p2 = getProduct(preset.product2Id);
      if (!p1 || !p2) return;
      setDrafts({
        1: { presetId: p1.id, name: p1.name, ingredients: p1.ingredients },
        2: { presetId: p2.id, name: p2.name, ingredients: p2.ingredients },
      });
      invalidate();
    },
    [invalidate],
  );

  const analyze = useCallback(async () => {
    const d1 = drafts[1];
    const d2 = drafts[2];
    if (!d1.ingredients.trim() || !d2.ingredients.trim()) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);
    setResult(null);

    const body: AnalyzeRequest = {
      product1Name: d1.name.trim() || FALLBACK_NAME[1],
      product1Ingredients: d1.ingredients.trim(),
      product2Name: d2.name.trim() || FALLBACK_NAME[2],
      product2Ingredients: d2.ingredients.trim(),
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(body),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.error ?? "We couldn't analyse these products. Please try again.");
      }

      // Accept either a bare AnalyzeResponse or { result: AnalyzeResponse }.
      const data = json?.result ?? json;
      if (!data || !data.status) {
        throw new Error("The analysis came back in an unexpected format. Please try again.");
      }

      setResult(data as AnalyzeResponse);
      setStatus("success");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }, [drafts]);

  const reset = useCallback(() => {
    setDrafts(EMPTY);
    invalidate();
  }, [invalidate]);

  const filled = (drafts[1].ingredients.trim() ? 1 : 0) + (drafts[2].ingredients.trim() ? 1 : 0);

  return {
    product1: drafts[1],
    product2: drafts[2],
    names: [drafts[1].name.trim() || FALLBACK_NAME[1], drafts[2].name.trim() || FALLBACK_NAME[2]] as [string, string],
    status,
    result,
    error,
    severity: result ? toSeverity(result.status) : null,
    isLoading: status === "loading",
    canAnalyze: filled === 2 && status !== "loading",
    missing: 2 - filled,
    selectPreset,
    setIngredients,
    clearProduct,
    loadPreset,
    analyze,
    reset,
  };
}