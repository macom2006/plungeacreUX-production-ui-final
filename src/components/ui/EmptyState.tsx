import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import "./Feedback.css";

export interface EmptyStateProps {
  actions?: ReactNode;
  className?: string;
  compact?: boolean;
  description: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}

export function EmptyState({
  actions,
  className,
  compact = false,
  description,
  icon,
  title,
}: EmptyStateProps) {
  return (
    <section className={cn("empty-state", compact && "empty-state--compact", className)}>
      {icon ? <div className="empty-state__icon" aria-hidden="true">{icon}</div> : null}
      <h3>{title}</h3>
      <p>{description}</p>
      {actions ? <div className="empty-state__actions">{actions}</div> : null}
    </section>
  );
}
