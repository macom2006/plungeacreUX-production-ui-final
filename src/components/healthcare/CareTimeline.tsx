import { cn } from "../../lib/cn";
import "./Healthcare.css";

export type CareTimelineVariant = "standard" | "laboratory";
export type CareTimelineStepState = "complete" | "current" | "upcoming" | "failed";

const timelineLabels: Record<CareTimelineVariant, string[]> = {
  laboratory: [
    "Request submitted",
    "Provider review",
    "Invoice issued",
    "Accepted and paid",
    "Results released",
  ],
  standard: [
    "Request submitted",
    "Provider review",
    "Payment",
    "Approved",
    "Completed",
  ],
};

export interface CareTimelineProps {
  className?: string;
  states: CareTimelineStepState[];
  variant?: CareTimelineVariant;
}

export function CareTimeline({
  className,
  states,
  variant = "standard",
}: CareTimelineProps) {
  return (
    <ol className={cn("care-timeline", className)}>
      {timelineLabels[variant].map((label, index) => {
        const state = states[index] ?? "upcoming";
        return (
          <li className={`care-timeline__step care-timeline__step--${state}`} key={label}>
            <span aria-hidden="true" className="care-timeline__marker" />
            <span>
              <span className="care-timeline__label">{label}</span>
              <span className="sr-only">{state}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
