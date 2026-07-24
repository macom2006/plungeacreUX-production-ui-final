import { CareRequestCard, CareTimeline } from "../../components/healthcare";
import { Alert, Card, EmptyState, LinkButton, Skeleton, StatusBadge } from "../../components/ui";
import {
  patientActionRequired,
  patientCareRequests,
  patientConversations,
  patientSessionFixture,
  type PatientCareRequestFixture,
  type PatientPageState,
} from "../../lib/patientFixtures";
import { patientRoutes } from "../../lib/routes";

interface PatientDashboardPageProps {
  startCareHref: string;
  state?: PatientPageState;
}

function renderCareRequestCard(request: PatientCareRequestFixture) {
  if (request.status === "payment-failed") return null;

  const sharedProps = {
    primaryAction: (
      <LinkButton href={`${patientRoutes.careRequests}/${request.id}`} variant="secondary">
        View Request
      </LinkButton>
    ),
    provider: request.provider,
    requestId: request.id,
    status: request.status,
    submittedDate: request.submittedDate,
    summary: request.summary,
    title: request.title,
  };

  if (request.service === "laboratory") {
    return (
      <CareRequestCard
        {...sharedProps}
        providerReviewState={request.providerReviewState ?? "not-reviewed"}
        service="laboratory"
      />
    );
  }

  return <CareRequestCard {...sharedProps} service={request.service} />;
}

export function PatientDashboardPage({
  startCareHref,
  state = "ready",
}: PatientDashboardPageProps) {
  const activeRequest = patientCareRequests[0];
  const latestConversation = patientConversations[0];
  const dashboardRequests = state === "empty" ? [] : patientCareRequests;

  if (state === "loading") {
    return (
      <section className="patient-page patient-page--dashboard" aria-label="Patient dashboard loading">
        <Skeleton type="card" />
        <Skeleton type="card" />
        <Skeleton type="table-row" />
      </section>
    );
  }

  if (state === "error") {
    return (
      <Alert
        description="The patient portal overview could not be loaded from the fixture source."
        role="alert"
        title="Dashboard Could Not Load"
        tone="danger"
      />
    );
  }

  if (state === "permission") {
    return (
      <Alert
        description="This fictional patient account does not have access to the requested dashboard."
        role="alert"
        title="Permission Needed"
        tone="danger"
      />
    );
  }

  if (dashboardRequests.length === 0) {
    return (
      <section className="patient-page patient-page--dashboard" aria-labelledby="patient-empty-dashboard-title">
        <EmptyState
          actions={
            <LinkButton href={startCareHref}>
              Start Care
            </LinkButton>
          }
          description="Start a care request when you are ready. The start-care experience opens from the approved access page."
          title="No Care Requests Yet"
        />
        <h2 className="sr-only" id="patient-empty-dashboard-title">Empty Dashboard</h2>
      </section>
    );
  }

  return (
    <section className="patient-page patient-page--dashboard" aria-labelledby="patient-dashboard-title">
      <div className="patient-page__hero">
        <div>
          <p className="patient-page__kicker">Overview</p>
          <h2 id="patient-dashboard-title">Hello, {patientSessionFixture.firstName}</h2>
          <p>
            Review active requests, messages, and recent updates from one place.
          </p>
        </div>
        <div className="patient-page__hero-actions">
          <LinkButton href={startCareHref}>
            Start Care
          </LinkButton>
          <LinkButton href={patientRoutes.careRequests} variant="secondary">
            View Care Requests
          </LinkButton>
        </div>
      </div>

      {state === "partial" ? (
        <Alert
          description="Some message metadata is stale, but current care request status is available."
          role="status"
          title="Partial Data Loaded"
          tone="warning"
        />
      ) : null}

      {patientActionRequired.length > 0 ? (
        <section className="patient-page__section" aria-labelledby="patient-actions-title">
          <h2 id="patient-actions-title">Action Required</h2>
          <div className="patient-page__card-grid patient-page__card-grid--two">
            {patientActionRequired.map((action) => (
              <Card className="patient-action-card" key={action.id}>
                <div className="patient-action-card__header">
                  <h3>{action.title}</h3>
                  <StatusBadge tone={action.tone}>{action.label}</StatusBadge>
                </div>
                <p>{action.description}</p>
                {action.careRequestId ? (
                  <LinkButton
                    href={`${patientRoutes.careRequests}/${action.careRequestId}`}
                    variant="secondary"
                  >
                    View Request
                  </LinkButton>
                ) : null}
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <div className="patient-page__dashboard-grid">
        <section className="patient-page__section" aria-labelledby="patient-active-request-title">
          <h2 id="patient-active-request-title">Active Care Request</h2>
          {renderCareRequestCard(activeRequest)}
        </section>

        <section className="patient-page__section" aria-labelledby="patient-messages-preview-title">
          <Card className="patient-message-preview">
            <div className="patient-message-preview__header">
              <div>
                <p className="patient-page__kicker">Messages</p>
                <h2 id="patient-messages-preview-title">Messages Preview</h2>
              </div>
              <StatusBadge tone={latestConversation.unread ? "information" : "neutral"}>
                {latestConversation.unread ? "Unread" : "Read"}
              </StatusBadge>
            </div>
            <p>{latestConversation.latestPreview}</p>
            <p className="patient-page__meta">
              Last Updated:{" "}
              <time dateTime={latestConversation.updatedAtDateTime}>{latestConversation.updatedAt}</time>
            </p>
            <LinkButton href={patientRoutes.messages} variant="secondary">
              View Messages
            </LinkButton>
          </Card>
        </section>
      </div>

      <section className="patient-page__section" aria-labelledby="patient-updates-title">
        <Card>
          <h2 id="patient-updates-title">Recent Updates</h2>
          <CareTimeline events={activeRequest.timeline} />
        </Card>
      </section>
    </section>
  );
}
