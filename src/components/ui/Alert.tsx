import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";
import "./Feedback.css";

export type AlertTone = "info" | "success" | "warning" | "danger";

export interface AlertProps {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  dismissLabel?: string;
  icon?: ReactNode;
  onDismiss?: () => void;
  role?: "status" | "alert" | "note";
  title: ReactNode;
  tone?: AlertTone;
}

const defaultIcon: Record<AlertTone, string> = {
  danger: "!",
  info: "i",
  success: "✓",
  warning: "!",
};

export function Alert({
  action,
  className,
  description,
  dismissLabel = "Dismiss notice",
  icon,
  onDismiss,
  role = "note",
  title,
  tone = "info",
}: AlertProps) {
  return (
    <div className={cn("alert", `alert--${tone}`, className)} role={role}>
      <span className="alert__icon" aria-hidden="true">
        {icon ?? defaultIcon[tone]}
      </span>
      <div className="alert__content">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
        {action ? <div className="alert__action">{action}</div> : null}
      </div>
      {onDismiss ? (
        <Button aria-label={dismissLabel} onClick={onDismiss} size="icon" variant="ghost">
          x
        </Button>
      ) : null}
    </div>
  );
}
