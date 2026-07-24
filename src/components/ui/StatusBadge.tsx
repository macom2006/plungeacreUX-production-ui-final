import { cn } from "../../lib/cn";
import "./StatusBadge.css";

export type StatusBadgeTone =
  | "neutral"
  | "information"
  | "success"
  | "warning"
  | "danger";

export type CareStatus =
  | "submitted"
  | "pending-review"
  | "payment-required"
  | "approved"
  | "declined"
  | "payment-failed";

export interface StatusBadgeProps {
  children?: string;
  status?: CareStatus;
  tone?: StatusBadgeTone;
}

export const careStatusTone: Record<CareStatus, StatusBadgeTone> = {
  "approved": "success",
  "declined": "danger",
  "payment-failed": "danger",
  "payment-required": "warning",
  "pending-review": "warning",
  "submitted": "information",
};

const careStatusLabel: Record<CareStatus, string> = {
  "approved": "Approved",
  "declined": "Declined",
  "payment-failed": "Payment Failed",
  "payment-required": "Payment Required",
  "pending-review": "Pending Review",
  "submitted": "Submitted",
};

const statusIcon: Record<StatusBadgeTone, string> = {
  neutral: "Status",
  information: "Info",
  success: "Success",
  warning: "Attention",
  danger: "Critical",
};

export function StatusBadge({ children, status, tone }: StatusBadgeProps) {
  const resolvedTone = status ? careStatusTone[status] : tone ?? "neutral";
  const label = children ?? (status ? careStatusLabel[status] : "");

  return (
    <span className={cn("status-badge", `status-badge--${resolvedTone}`)} data-tone={resolvedTone}>
      <span aria-hidden="true" className="status-badge__dot" />
      <span className="sr-only">{statusIcon[resolvedTone]}: </span>
      {label}
    </span>
  );
}
