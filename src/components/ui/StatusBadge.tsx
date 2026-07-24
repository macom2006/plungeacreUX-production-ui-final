import { cn } from "../../lib/cn";
import "./StatusBadge.css";

export type StatusBadgeTone =
  | "neutral"
  | "information"
  | "success"
  | "warning"
  | "danger";

export interface StatusBadgeProps {
  children: string;
  tone?: StatusBadgeTone;
}

const statusIcon: Record<StatusBadgeTone, string> = {
  neutral: "Status",
  information: "Info",
  success: "Success",
  warning: "Attention",
  danger: "Critical",
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={cn("status-badge", `status-badge--${tone}`)}>
      <span aria-hidden="true" className="status-badge__dot" />
      <span className="sr-only">{statusIcon[tone]}: </span>
      {children}
    </span>
  );
}
