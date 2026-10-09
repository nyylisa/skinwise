import { CircleCheck, CircleHelp, CircleX, Info, TriangleAlert, type LucideProps } from "lucide-react";
import type { Severity } from "../../../types/compatibility";
import { SEVERITY } from "./severity";

const ICONS = {
  compatible: CircleCheck,
  caution: TriangleAlert,
  not_recommended: CircleX,
  unknown: CircleHelp,
  tip: Info,
} as const;

export type StatusIconKind = Severity | "tip";

interface StatusIconProps extends Omit<LucideProps, "ref"> {
  status: StatusIconKind;
  /** Provide when the icon is the only thing conveying meaning; otherwise it is hidden from screen readers. */
  label?: string;
}

export default function StatusIcon({ status, label, size = 16, className = "", ...rest }: StatusIconProps) {
  const Icon = ICONS[status];
  const color = status === "tip" ? "text-[var(--sw-green)]" : SEVERITY[status].icon;

  return (
    <Icon
      size={size}
      strokeWidth={1.75}
      className={`shrink-0 ${color} ${className}`}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      {...rest}
    />
  );
}