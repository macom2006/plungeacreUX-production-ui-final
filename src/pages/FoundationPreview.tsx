import { CareStatusCard } from "../components/healthcare";
import { PortalShell, PublicNav } from "../components/layout";
import { Button, Card, StatusBadge } from "../components/ui";
import "./FoundationPreview.css";

const statuses = [
  {
    description: "The request has been received and is ready for review.",
    status: "Submitted",
    title: "Request intake",
    tone: "information",
  },
  {
    description: "A care team member is reviewing details before the next step.",
    status: "Pending review",
    title: "Review queue",
    tone: "warning",
  },
  {
    description: "Action is needed before the request can continue.",
    status: "Payment required",
    title: "Account step",
    tone: "warning",
  },
  {
    description: "The request is approved and ready for the next care milestone.",
    status: "Approved",
    title: "Care decision",
    tone: "success",
  },
  {
    description: "The request cannot proceed in its current state.",
    status: "Declined",
    title: "Care decision",
    tone: "danger",
  },
  {
    description: "The payment authorization failed and needs attention.",
    status: "Payment failed",
    title: "Account step",
    tone: "danger",
  },
] as const;

export function FoundationPreview() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <PublicNav />
      <PortalShell pageTitle="Production UI foundation">
        <div className="foundation-preview">
          <section className="foundation-preview__intro" aria-labelledby="foundation-title">
            <div>
              <p className="foundation-preview__kicker">Phase 1</p>
              <h2 id="foundation-title">Shared shell, tokens, and primitives</h2>
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
            </div>
          </section>

          <section aria-labelledby="status-title">
            <h2 id="status-title">Status vocabulary</h2>
            <div className="foundation-preview__badge-row">
              <StatusBadge tone="information">Submitted</StatusBadge>
              <StatusBadge tone="warning">Pending review</StatusBadge>
              <StatusBadge tone="warning">Payment required</StatusBadge>
              <StatusBadge tone="success">Approved</StatusBadge>
              <StatusBadge tone="danger">Declined</StatusBadge>
              <StatusBadge tone="danger">Payment failed</StatusBadge>
            </div>
          </section>

          <section aria-labelledby="cards-title">
            <h2 id="cards-title">Illustrative care cards</h2>
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
            <h2 id="surface-title">Surface treatments</h2>
            <div className="foundation-preview__grid foundation-preview__grid--two">
              <Card title="Soft neutral surface">
                <p>
                  Neutral surfaces support dense portal views without competing
                  with clinical status indicators.
                </p>
              </Card>
              <Card className="foundation-preview__mint-card" title="Pale mint surface">
                <p>
                  Mint surfaces are reserved for calm confirmation and clinically
                  safe moments.
                </p>
              </Card>
            </div>
          </section>
        </div>
      </PortalShell>
    </>
  );
}
