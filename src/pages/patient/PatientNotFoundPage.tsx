import { EmptyState, LinkButton } from "../../components/ui";
import { patientRoutes } from "../../lib/routes";

export function PatientNotFoundPage() {
  return (
    <section className="patient-page" aria-labelledby="patient-not-found-title">
      <EmptyState
        actions={
          <LinkButton href={patientRoutes.overview}>
            Back to Overview
          </LinkButton>
        }
        description="The requested patient portal page is not available."
        title="Patient Page Not Found"
      />
      <h2 className="sr-only" id="patient-not-found-title">Patient Page Not Found</h2>
    </section>
  );
}
