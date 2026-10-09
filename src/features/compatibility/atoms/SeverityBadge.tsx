import type { Severity } from "../../../types/compatibility";
import { SEVERITY } from "./severity";
import StatusIcon from "./StatusIcon";

interface SeverityBadgeProps {
  severity: Severity;
  size?: "sm" | "md";
  showIcon?: boolean;
  /** Override the default label (e.g. "Safe to layer"). */
  label?: string;
  className?: string;
}

export default function SeverityBadge({
  severity,
  size = "sm",
  showIcon = false,
  label,
  className = "",
}: SeverityBadgeProps) {
  const s = SEVERITY[severity];
  const sizing = size === "sm" ? "px-3 py-0.5 text-[0.75rem]" : "px-4 py-1 text-[0.8125rem]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-[family-name:var(--font-display)] font-medium ${sizing} ${s.text} ${s.bg} ${s.border} ${className}`}
    >
      {showIcon && <StatusIcon status={severity} size={size === "sm" ? 12 : 14} />}
      {label ?? s.label}
    </span>
  );
}