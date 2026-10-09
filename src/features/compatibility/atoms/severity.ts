import type { CompatibilityStatus } from "../../../types/analysis";
import type { Severity } from "../../../types/compatibility";

/** Backend status → UI severity. */
export function toSeverity(status: CompatibilityStatus): Severity {
  switch (status) {
    case "SAFE":
      return "compatible";
    case "CAUTION":
      return "caution";
    case "CONFLICT":
      return "not_recommended";
    default:
      return "unknown";
  }
}

/** Single source of truth for severity visuals + copy (used by all atoms/molecules). */
export const SEVERITY: Record<
  Severity,
  { label: string; text: string; icon: string; bg: string; border: string }
> = {
  compatible: {
    label: "Compatible",
    text: "text-[var(--sw-forest)]",
    icon: "text-[var(--sw-green)]",
    bg: "bg-[var(--sw-mint-tint)]",
    border: "border-[var(--sw-green)]",
  },
  caution: {
    label: "Use with Caution",
    text: "text-[var(--sw-amber-text)]",
    icon: "text-[var(--sw-amber)]",
    bg: "bg-[var(--sw-amber-bg)]",
    border: "border-[var(--sw-amber)]",
  },
  not_recommended: {
    label: "Not Recommended",
    text: "text-[var(--sw-danger-text)]",
    icon: "text-[var(--sw-danger)]",
    bg: "bg-[var(--sw-danger-bg)]",
    border: "border-[var(--sw-danger)]",
  },
  unknown: {
    label: "Not Enough Data",
    text: "text-[var(--sw-muted)]",
    icon: "text-[var(--sw-muted)]",
    bg: "bg-[var(--sw-cream)]",
    border: "border-[var(--sw-muted)]",
  },
};