import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Healthcare.css";

export type CareTimelineVariant = "standard" | "laboratory";
export type CareTimelineStepState = "complete" | "current" | "upcoming" | "failed";

export interface CareTimelineEvent {
  category?: string;
  dateTime?: string;
  description?: ReactNode;
  id: string;
  state: CareTimelineStepState;
  timestamp?: ReactNode;
  title: ReactNode;
}

const timelineStateLabels: Record<CareTimelineStepState, string> = {
  complete: "Complete",
  current: "Current",
  failed: "Failed",
  upcoming: "Upcoming",
};

const previewTimelineTitles: Record<CareTimelineVariant, string[]> = {
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
  events?: CareTimelineEvent[];
  states?: CareTimelineStepState[];
  variant?: CareTimelineVariant;
}

export function createCareTimelineEvents(
  variant: CareTimelineVariant,
  states: CareTimelineStepState[],
): CareTimelineEvent[] {
  return previewTimelineTitles[variant].map((title, index) => ({
    id: `${variant}-${index}`,
    state: states[index] ?? "upcoming",
    title,
  }));
}

export function CareTimeline({
  className,
  events,
  states = [],
  variant = "standard",
}: CareTimelineProps) {
  const timelineEvents = events ?? createCareTimelineEvents(variant, states);

  return (
    <ol className={cn("care-timeline", className)}>
      {timelineEvents.map((event) => (
        <li
          aria-current={event.state === "current" ? "step" : undefined}
          className={`care-timeline__step care-timeline__step--${event.state}`}
          key={event.id}
        >
          <span aria-hidden="true" className="care-timeline__marker" />
          <div className="care-timeline__content">
            <div className="care-timeline__heading">
              <span className="care-timeline__label">{event.title}</span>
              <span className="care-timeline__state">
                State: {timelineStateLabels[event.state]}
              </span>
            </div>
            {event.category || event.timestamp ? (
              <div className="care-timeline__meta">
                {event.category ? <span>{event.category}</span> : null}
                {event.timestamp ? (
                  event.dateTime ? (
                    <time dateTime={event.dateTime}>{event.timestamp}</time>
                  ) : (
                    <span>{event.timestamp}</span>
                  )
                ) : null}
              </div>
            ) : null}
            {event.description ? (
              <div className="care-timeline__description">{event.description}</div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
