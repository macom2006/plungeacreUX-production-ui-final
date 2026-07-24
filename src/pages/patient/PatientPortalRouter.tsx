import { PortalShell } from "../../components/layout";
import {
  getPatientRequestId,
  patientNavigation,
  patientRoutes,
  temporaryRoutes,
} from "../../lib/routes";
import { patientSessionFixture } from "../../lib/patientFixtures";
import { PatientBillingPage } from "./PatientBillingPage";
import { PatientCareRequestDetailPage } from "./PatientCareRequestDetailPage";
import { PatientCareRequestsPage } from "./PatientCareRequestsPage";
import { PatientDashboardPage } from "./PatientDashboardPage";
import { PatientMessagesPage } from "./PatientMessagesPage";
import { PatientMyChartPage } from "./PatientMyChartPage";
import { PatientNotFoundPage } from "./PatientNotFoundPage";
import { PatientSettingsPage } from "./PatientSettingsPage";
import "./PatientPortal.css";

const pageTitles: Record<string, string> = {
  [patientRoutes.billing]: "Billing & Payments",
  [patientRoutes.careRequests]: "Care Requests",
  [patientRoutes.messages]: "Messages",
  [patientRoutes.myChart]: "My Chart",
  [patientRoutes.overview]: "Your Care, Clearly Organized",
  [patientRoutes.settings]: "Settings",
};

interface PatientPortalRouterProps {
  pathname: string;
}

function getPageTitle(pathname: string) {
  if (getPatientRequestId(pathname)) return "Care Request Detail";
  return pageTitles[pathname] ?? "Patient Page Not Found";
}

function renderPatientRoute(pathname: string) {
  const requestId = getPatientRequestId(pathname);

  if (requestId) return <PatientCareRequestDetailPage requestId={requestId} />;

  switch (pathname) {
    case patientRoutes.overview:
      return <PatientDashboardPage startCareHref={temporaryRoutes.startCare} />;
    case patientRoutes.careRequests:
      return <PatientCareRequestsPage />;
    case patientRoutes.messages:
      return <PatientMessagesPage />;
    case patientRoutes.myChart:
      return <PatientMyChartPage />;
    case patientRoutes.billing:
      return <PatientBillingPage />;
    case patientRoutes.settings:
      return <PatientSettingsPage />;
    default:
      return <PatientNotFoundPage />;
  }
}

export function PatientPortalRouter({ pathname }: PatientPortalRouterProps) {
  return (
    <PortalShell
      accountDescription={patientSessionFixture.accountDescription}
      accountInitials={patientSessionFixture.initials}
      accountName={patientSessionFixture.displayName}
      brandHref={patientRoutes.overview}
      currentPathname={pathname}
      eyebrow="Patient Portal"
      navItems={patientNavigation}
      pageTitle={getPageTitle(pathname)}
      role="patient"
    >
      {renderPatientRoute(pathname)}
    </PortalShell>
  );
}
