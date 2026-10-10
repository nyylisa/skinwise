import { CalendarDays, CircleHelp, Layers, ShieldCheck, SunMoon, type LucideIcon } from "lucide-react";
import type { AnalysisResult, ScheduleType } from "../../../types/analysis";

const SCHEDULES: Record<ScheduleType, { label: string; icon: LucideIcon }> = {
  ALTERNATE_DAYS: { label: "Use on alternate days", icon: CalendarDays },
  AM_PM_SPLIT: { label: "Split between morning and evening", icon: SunMoon },
  LAYER_TOGETHER: { label: "Safe to layer together", icon: Layers },
  INERT: { label: "No timing restrictions", icon: ShieldCheck },
  UNKNOWN: { label: "Timing unclear", icon: CircleHelp },
};

interface TimingAdviceProps {
  protocol: AnalysisResult["timingProtocol"];
}

export default function TimingAdvice({ protocol }: TimingAdviceProps) {
  const { label, icon: Icon } = SCHEDULES[protocol.scheduleType];

  return (
    <section aria-labelledby="timing-title" className="sw-card p-6">
      <h2 id="timing-title" className="!text-xl">
        Timing advice
      </h2>

      <div className="mt-4 flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-[var(--radius-control)] border border-[var(--sw-line)] bg-[var(--sw-mint)] text-[var(--sw-green)]">
          <Icon size={20} strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <h3>{label}</h3>
          <p className="mt-1 text-[1.0625rem] leading-relaxed">{protocol.guidanceText}</p>
        </div>
      </div>
    </section>
  );
}