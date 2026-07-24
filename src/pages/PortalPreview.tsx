import { CareStatusCard } from "../components/healthcare";
import { PortalShell } from "../components/layout";
import { Button } from "../components/ui";
import "./FoundationPreview.css";

export function PortalPreview() {
  return (
    <PortalShell pageTitle="Portal shell preview" role="patient">
      <div className="foundation-preview">
        <section className="foundation-preview__intro" aria-labelledby="portal-preview-title">
          <div>
            <p className="foundation-preview__kicker">Phase 2 layout separation</p>
            <h2 id="portal-preview-title">Portal shell only</h2>
            <p>
              This route demonstrates portal navigation without the public
              navbar. Tablet and mobile widths use the accessible drawer.
            </p>
          </div>
          <div className="foundation-preview__actions">
            <Button onClick={() => window.history.back()} variant="secondary">
              Back
            </Button>
          </div>
        </section>
        <div className="foundation-preview__grid">
          <CareStatusCard
            description="A request is ready for review by an eligible care team member."
            status="Pending review"
            title="Portal card example"
            tone="warning"
          />
          <CareStatusCard
            description="The request has cleared the current milestone."
            status="Approved"
            title="Status example"
            tone="success"
          />
        </div>
      </div>
    </PortalShell>
  );
}
