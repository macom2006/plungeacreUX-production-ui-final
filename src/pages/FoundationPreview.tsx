import { CareStatusCard } from "../components/healthcare";
import { PublicLayout } from "../components/layout";
import { Button, Card, LinkButton, StatusBadge } from "../components/ui";
import "./FoundationPreview.css";

const statuses = [
  {
    description: "The request has been received and is ready for review.",
    status: "Submitted",
    title: "Request Intake",
    tone: "information",
  },
  {
    description: "A care team member is reviewing details before the next step.",
    status: "Pending Review",
    title: "Review Queue",
    tone: "warning",
  },
  {
    description: "Action is needed before the request can continue.",
    status: "Payment Required",
    title: "Account Step",
    tone: "warning",
  },
  {
    description: "The request is approved and ready for the next care milestone.",
    status: "Approved",
    title: "Care Decision",
    tone: "success",
  },
  {
    description: "The request cannot proceed in its current state.",
    status: "Declined",
    title: "Care Decision",
    tone: "danger",
  },
  {
    description: "The payment authorization failed and needs attention.",
    status: "Payment Failed",
    title: "Account Step",
    tone: "danger",
  },
] as const;

export function FoundationPreview() {
  return (
    <PublicLayout>
        <div className="foundation-preview">
          <section className="foundation-preview__intro" aria-labelledby="foundation-title">
            <div>
              <p className="foundation-preview__kicker">Phase 1</p>
              <h1 id="foundation-title">Shared Shell, Tokens, and Primitives</h1>
              <p>
                This preview route demonstrates the reusable visual foundation
                for future Plunge Care patient, provider, and admin work.
              </p>
            </div>
            <div className="foundation-preview__actions" aria-label="Button variants">
              <Button size="lg">Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
              <Button variant="ghost">Ghost action</Button>
              <Button variant="danger">Danger action</Button>
              <Button disabled>Disabled action</Button>
              <LinkButton href="/foundation/components" variant="outline">
                Component showcase
              </LinkButton>
              <LinkButton href="/foundation/portal" variant="link">
                Portal Shell Preview
              </LinkButton>
            </div>
          </section>

          <section aria-labelledby="status-title">
            <h2 id="status-title">Status Vocabulary</h2>
            <div className="foundation-preview__badge-row">
              <StatusBadge tone="information">Submitted</StatusBadge>
              <StatusBadge tone="warning">Pending Review</StatusBadge>
              <StatusBadge tone="warning">Payment Required</StatusBadge>
              <StatusBadge tone="success">Approved</StatusBadge>
              <StatusBadge tone="danger">Declined</StatusBadge>
              <StatusBadge tone="danger">Payment Failed</StatusBadge>
            </div>
          </section>

          <section aria-labelledby="cards-title">
              <h2 id="cards-title">Illustrative Care Cards</h2>
            <div className="foundation-preview__grid">
              {statuses.map((item) => (
                <CareStatusCard
                  description={item.description}
                  key={item.status}
                  status={item.status}
                  title={item.title}
                  tone={item.tone}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="surface-title" className="foundation-preview__surfaces">
            <h2 id="surface-title">Surface Treatments</h2>
            <div className="foundation-preview__grid foundation-preview__grid--two">
              <Card title="Soft Neutral Surface">
                <p>
                  Neutral surfaces support dense portal views without competing
                  with clinical status indicators.
                </p>
              </Card>
              <Card className="foundation-preview__mint-card" title="Pale Mint Surface">
                <p>
                  Mint surfaces are reserved for calm confirmation and clinically
                  safe moments.
                </p>
              </Card>
            </div>
          </section>
        </div>
    </PublicLayout>
  );
}
