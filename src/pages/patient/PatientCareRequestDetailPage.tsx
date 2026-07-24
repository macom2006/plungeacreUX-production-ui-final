import { BillingSummary, CareTimeline } from "../../components/healthcare";
import { Alert, Card, DescriptionList, EmptyState, LinkButton, Skeleton, StatusBadge } from "../../components/ui";
import {
  billingStateLabels,
  billingStateTone,
  careStatusLabels,
  getCareRequestById,
  type PatientPageState,
} from "../../lib/patientFixtures";
import { patientRoutes } from "../../lib/routes";

interface PatientCareRequestDetailPageProps {
  requestId: string;
  state?: PatientPageState;
}

const serviceLabels = {
  consultation: "Consultation",
  laboratory: "Laboratory",
  prescription: "Prescription",
};

function getNextActionTone(status: string) {
  if (status === "payment-required") return "warning";
  if (status === "payment-failed" || status === "declined") return "danger";
  if (status === "approved") return "success";
  return "info";
}

export function PatientCareRequestDetailPage({
  requestId,
  state = "ready",
}: PatientCareRequestDetailPageProps) {
  const request = getCareRequestById(requestId);

  if (state === "loading") {
    return (
      <section className="patient-page" aria-label="Care request detail loading">
        <Skeleton type="card" />
        <Skeleton type="card" />
        <Skeleton type="table-row" />
      </section>
    );
  }

  if (state === "error") {
    return (
      <Alert
        description="The care request detail could not be loaded from the fixture source."
        role="alert"
        title="Care Request Could Not Load"
        tone="danger"
      />
    );
  }

  if (state === "permission") {
    return (
      <Alert
        description="This fictional patient account does not have access to the requested care request."
        role="alert"
        title="Permission Needed"
        tone="danger"
      />
    );
  }

  if (!request || state === "empty") {
    return (
      <EmptyState
        actions={<LinkButton href={patientRoutes.careRequests}>Back to Care Requests</LinkButton>}
        description="The requested care request is not available in the fictional patient fixture set."
        title="Care Request Not Found"
      />
    );
  }

  return (
    <article className="patient-page patient-page--detail" aria-labelledby="patient-care-request-detail-title">
      <div className="patient-page__heading patient-page__heading--split">
        <div>
          <p className="patient-page__kicker">Care Request</p>
          <h2 id="patient-care-request-detail-title">{request.title}</h2>
          <p>{request.summary}</p>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {state === "partial" ? (
        <Alert
          description="Some provider metadata is missing, but request status and timeline are available."
          role="status"
          title="Partial Data Loaded"
          tone="warning"
        />
      ) : null}

      <div className="patient-page__detail-grid">
        <Card title="Request Summary">
          <DescriptionList
            columns="multi"
            items={[
              { label: "Request ID", value: request.id },
              {
                label: "Submitted",
                value: <time dateTime={request.submittedDateTime}>{request.submittedDate}</time>,
              },
              { label: "Provider", value: request.provider ?? "Not Assigned" },
              { label: "Status", value: careStatusLabels[request.status] },
              {
                label: "Last Updated",
                value: <time dateTime={request.lastUpdatedDateTime}>{request.lastUpdated}</time>,
              },
              { label: "Service", value: serviceLabels[request.service] },
            ]}
          />
        </Card>

        <Card title="Next Action">
          <Alert
            description={request.nextAction}
            role="status"
            title={request.status === "payment-required" ? "Payment Required" : "Current Next Step"}
            tone={getNextActionTone(request.status)}
          />
        </Card>
      </div>

      {request.service === "laboratory" && request.providerReviewState === "not-reviewed" ? (
        <Alert
          description="No charge until provider review."
          role="status"
          title="Laboratory Safeguard"
          tone="warning"
        />
      ) : null}

      <div className="patient-page__detail-grid">
        <Card title="Patient-Submitted Summary">
          <p>{request.patientSummary}</p>
        </Card>

        <Card title="Billing Status">
          {request.billing ? (
            <DescriptionList
              items={[
                {
                  label: "Billing State",
                  value: (
                    <StatusBadge tone={billingStateTone[request.billing.status]}>
                      {billingStateLabels[request.billing.status]}
                    </StatusBadge>
                  ),
                },
                { label: "Summary", value: request.billing.summary },
                ...(request.billing.amountLabel && request.billing.amountValue
                  ? [{ label: request.billing.amountLabel, value: request.billing.amountValue }]
                  : []),
              ]}
            />
          ) : (
            <EmptyState
              compact
              description="No billing status has been supplied for this request."
              title="No Billing Status"
            />
          )}
        </Card>
      </div>

      <Card title="Timeline">
        <CareTimeline
          events={request.timeline}
          variant={request.service === "laboratory" ? "laboratory" : "standard"}
        />
      </Card>

      {request.billing?.lineItems && request.billing.total ? (
        <BillingSummary
          lineItems={request.billing.lineItems}
          title="Resolved Billing Summary"
          total={request.billing.total}
        />
      ) : null}

      <Card title="Messages Preview">
        <p>
          The related conversation is available in the read-only message center.
        </p>
        <LinkButton href={patientRoutes.messages} variant="secondary">
          Open Messages
        </LinkButton>
      </Card>
    </article>
  );
}
