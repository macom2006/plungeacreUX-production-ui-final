import type { ReactNode } from "react";
import { Card, StatusBadge, type CareStatus } from "../ui";
import "./Healthcare.css";

export type CareService = "prescription" | "laboratory" | "consultation";
export type ProviderReviewState = "not-reviewed" | "reviewed";

interface BaseCareRequestCardProps {
  primaryAction?: ReactNode;
  provider?: string;
  requestId: string;
  secondaryAction?: ReactNode;
  service: CareService;
  status: Exclude<CareStatus, "payment-failed">;
  submittedDate: string;
  summary: ReactNode;
  title: string;
}

interface LaboratoryCareRequestCardProps extends BaseCareRequestCardProps {
  estimatedPrice?: never;
  providerReviewState: ProviderReviewState;
  provisionalTotal?: never;
  service: "laboratory";
}

interface NonLaboratoryCareRequestCardProps extends BaseCareRequestCardProps {
  providerReviewState?: never;
  service: Exclude<CareService, "laboratory">;
}

export type CareRequestCardProps =
  | LaboratoryCareRequestCardProps
  | NonLaboratoryCareRequestCardProps;

export function CareRequestCard({
  primaryAction,
  provider,
  providerReviewState,
  requestId,
  secondaryAction,
  service,
  status,
  submittedDate,
  summary,
  title,
}: CareRequestCardProps) {
  const showLabNoChargeCopy = service === "laboratory" && providerReviewState === "not-reviewed";

  return (
    <Card className="care-request-card">
      <div className="care-request-card__header">
        <div>
          <p className="care-request-card__service">{service}</p>
          <h3>{title}</h3>
        </div>
        <StatusBadge status={status} />
      </div>
      <dl className="care-request-card__meta">
        <div>
          <dt>Request ID</dt>
          <dd>{requestId}</dd>
        </div>
        <div>
          <dt>Submitted</dt>
          <dd>{submittedDate}</dd>
        </div>
        <div>
          <dt>Provider</dt>
          <dd>{provider ?? "Not assigned"}</dd>
        </div>
      </dl>
      <p>{summary}</p>
      {showLabNoChargeCopy ? (
        <p className="care-request-card__note">No charge until provider review.</p>
      ) : null}
      {(primaryAction || secondaryAction) ? (
        <div className="care-request-card__actions">
          {primaryAction}
          {secondaryAction}
        </div>
      ) : null}
    </Card>
  );
}
