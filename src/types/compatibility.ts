/** Frontend-only types. Backend contract lives in types/analysis.ts (AnalysisResult, AnalyzeRequestBody). */

/** UI severity scale. Mapped from the backend CompatibilityStatus via toSeverity() in atoms/severity.ts. */
export type Severity = "compatible" | "caution" | "not_recommended" | "unknown";

/** A library product (frontend catalog in lib/preset.ts). */
export interface ProductOption {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  /** Raw INCI list, sent as-is to /api/analyze. */
  ingredients: string;
}

/** What a product slot currently holds: a chosen library product and/or user-edited text. */
export interface ProductDraft {
  /** Catalog id, or "" when the user is pasting their own list. */
  presetId: string;
  name: string;
  ingredients: string;
}

export type ProductSlot = 1 | 2;

export type RequestStatus = "idle" | "loading" | "success" | "error";

/** One-click demo that fills both slots from the catalog. */
export interface CompatibilityPreset {
  id: string;
  /** Button text, e.g. "Load Conflict Demo". */
  label: string;
  severity: Severity;
  /** Short hint shown under the label, e.g. "Retinol + Benzoyl Peroxide". */
  description: string;
  product1Id: string;
  product2Id: string;
}