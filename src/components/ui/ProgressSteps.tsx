import { cn } from "../../lib/cn";
import "./Navigation.css";

export type ProgressStepState = "completed" | "current" | "upcoming" | "error";

export interface ProgressStep {
  description?: string;
  label: string;
  optional?: boolean;
  state: ProgressStepState;
}

export interface ProgressStepsProps {
  className?: string;
  orientation?: "horizontal" | "vertical";
  steps: ProgressStep[];
}

export function ProgressSteps({
  className,
  orientation = "horizontal",
  steps,
}: ProgressStepsProps) {
  return (
    <ol className={cn("progress-steps", `progress-steps--${orientation}`, className)}>
      {steps.map((step, index) => (
        <li className={`progress-steps__item progress-steps__item--${step.state}`} key={step.label}>
          <span className="progress-steps__marker" aria-hidden="true">
            {step.state === "completed" ? "✓" : index + 1}
          </span>
          <span>
            <span className="progress-steps__label">
              {step.label}
              {step.optional ? <span> Optional</span> : null}
            </span>
            {step.description ? <span className="progress-steps__description">{step.description}</span> : null}
          </span>
          <span className="sr-only">{step.state}</span>
        </li>
      ))}
    </ol>
  );
}
