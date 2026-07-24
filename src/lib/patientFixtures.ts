import type { CareService, ProviderReviewState, CareTimelineEvent } from "../components/healthcare";
import type { CareStatus, StatusBadgeTone } from "../components/ui";

export type PatientPageState =
  | "empty"
  | "error"
  | "loading"
  | "partial"
  | "permission"
  | "ready"
  | "saved";

export type BillingState =
  | "not-issued"
  | "paid"
  | "payment-failed"
  | "payment-required"
  | "resolved";

export interface PatientSessionFixture {
  accountDescription: string;
  displayName: string;
  firstName: string;
  initials: string;
}

export interface PatientCareRequestFixture {
  billing?: {
    amountLabel?: string;
    amountValue?: string;
    lineItems?: Array<{ amount: string; label: string }>;
    status: BillingState;
    summary: string;
    total?: string;
  };
  id: string;
  lastUpdated: string;
  lastUpdatedDateTime: string;
  nextAction: string;
  patientSummary: string;
  provider?: string;
  providerReviewState?: ProviderReviewState;
  service: CareService;
  status: CareStatus;
  submittedDate: string;
  submittedDateTime: string;
  summary: string;
  timeline: CareTimelineEvent[];
  title: string;
}

export interface PatientActionRequiredFixture {
  careRequestId?: string;
  description: string;
  id: string;
  label: string;
  tone: StatusBadgeTone;
  title: string;
}

export interface PatientConversationFixture {
  id: string;
  latestPreview: string;
  messages: Array<{
    body: string;
    dateTime: string;
    id: string;
    sender: string;
    timestamp: string;
  }>;
  participant: string;
  subject: string;
  unread: boolean;
  updatedAt: string;
  updatedAtDateTime: string;
}

export interface PatientChartFixture {
  allergies: string[];
  careHistory: Array<{
    date: string;
    dateTime: string;
    requestId: string;
    status: CareStatus;
    title: string;
  }>;
  conditions: string[];
  labResults: Array<{
    date: string;
    dateTime: string;
    id: string;
    releaseState: "released" | "unreleased";
    summary: string;
    title: string;
  }>;
  medications: string[];
  profile: Array<{ label: string; value: string }>;
}

export interface PatientInvoiceFixture {
  amount: string;
  date: string;
  dateTime: string;
  description: string;
  id: string;
  status: BillingState;
}

export interface PatientBillingFixture {
  history: PatientInvoiceFixture[];
  overview: Array<{ label: string; tone: StatusBadgeTone; value: string }>;
  paidItems: PatientInvoiceFixture[];
  paymentRequiredItems: PatientInvoiceFixture[];
  resolvedInvoices: PatientInvoiceFixture[];
}

export const patientSessionFixture: PatientSessionFixture = {
  accountDescription: "Patient Account",
  displayName: "Parker Morgan",
  firstName: "Parker",
  initials: "PM",
};

export const canonicalCareStatuses: CareStatus[] = [
  "submitted",
  "pending-review",
  "payment-required",
  "approved",
  "declined",
  "payment-failed",
];

export const careStatusLabels: Record<CareStatus, string> = {
  approved: "Approved",
  declined: "Declined",
  "payment-failed": "Payment Failed",
  "payment-required": "Payment Required",
  "pending-review": "Pending Review",
  submitted: "Submitted",
};

export const billingStateLabels: Record<BillingState, string> = {
  "not-issued": "Not Issued",
  paid: "Paid",
  "payment-failed": "Payment Failed",
  "payment-required": "Payment Required",
  resolved: "Resolved",
};

export const billingStateTone: Record<BillingState, StatusBadgeTone> = {
  "not-issued": "neutral",
  paid: "success",
  "payment-failed": "danger",
  "payment-required": "warning",
  resolved: "success",
};

export const patientCareRequests: PatientCareRequestFixture[] = [
  {
    billing: {
      amountLabel: "Amount Due",
      amountValue: "$65.00",
      lineItems: [
        { amount: "$65.00", label: "Resolved Visit Fee" },
      ],
      status: "payment-required",
      summary: "Invoice issued after review. Payment is required before the next step.",
      total: "$65.00",
    },
    id: "REQ-2026-1048",
    lastUpdated: "Jul 21, 2026",
    lastUpdatedDateTime: "2026-07-21",
    nextAction: "Review the payment notice.",
    patientSummary: "The patient-submitted note asks for provider guidance about a general wellness concern.",
    provider: "Dr. Rowan Vale",
    service: "consultation",
    status: "payment-required",
    submittedDate: "Jul 19, 2026",
    submittedDateTime: "2026-07-19",
    summary: "A provider reviewed the request and issued the next payment step.",
    timeline: [
      {
        category: "Request",
        dateTime: "2026-07-19",
        id: "req-1048-submitted",
        state: "complete",
        timestamp: "Jul 19",
        title: "Request Submitted",
      },
      {
        category: "Review",
        dateTime: "2026-07-20",
        id: "req-1048-review",
        state: "complete",
        timestamp: "Jul 20",
        title: "Provider Review",
      },
      {
        category: "Billing",
        dateTime: "2026-07-21",
        description: "Payment Required is shown in amber because action is needed.",
        id: "req-1048-payment",
        state: "current",
        timestamp: "Jul 21",
        title: "Payment Required",
      },
    ],
    title: "General Wellness Request",
  },
  {
    billing: {
      status: "not-issued",
      summary: "No charge until provider review.",
    },
    id: "REQ-2026-1041",
    lastUpdated: "Jul 18, 2026",
    lastUpdatedDateTime: "2026-07-18",
    nextAction: "Wait for provider review.",
    patientSummary: "The request asks whether a routine laboratory review is appropriate.",
    providerReviewState: "not-reviewed",
    service: "laboratory",
    status: "pending-review",
    submittedDate: "Jul 18, 2026",
    submittedDateTime: "2026-07-18",
    summary: "The laboratory request is awaiting provider review before any invoice is issued.",
    timeline: [
      {
        category: "Request",
        dateTime: "2026-07-18",
        id: "req-1041-submitted",
        state: "complete",
        timestamp: "Jul 18",
        title: "Request Submitted",
      },
      {
        category: "Review",
        id: "req-1041-review",
        state: "current",
        title: "Provider Review",
      },
      {
        category: "Billing",
        id: "req-1041-invoice",
        state: "upcoming",
        title: "Invoice Issued",
      },
      {
        category: "Billing",
        id: "req-1041-paid",
        state: "upcoming",
        title: "Accepted and Paid",
      },
      {
        category: "Results",
        id: "req-1041-results",
        state: "upcoming",
        title: "Results Released",
      },
    ],
    title: "Routine Lab Review Request",
  },
  {
    billing: {
      amountLabel: "Resolved Amount",
      amountValue: "$80.00",
      status: "paid",
      summary: "The invoice was paid using a server-supplied resolved value.",
    },
    id: "REQ-2026-1037",
    lastUpdated: "Jul 12, 2026",
    lastUpdatedDateTime: "2026-07-12",
    nextAction: "Review the latest message when ready.",
    patientSummary: "The request included a non-urgent care question and follow-up context.",
    provider: "Dr. Avery Stone",
    service: "consultation",
    status: "approved",
    submittedDate: "Jul 9, 2026",
    submittedDateTime: "2026-07-09",
    summary: "Provider review is complete and the care request is approved.",
    timeline: [
      {
        category: "Request",
        dateTime: "2026-07-09",
        id: "req-1037-submitted",
        state: "complete",
        timestamp: "Jul 9",
        title: "Request Submitted",
      },
      {
        category: "Review",
        dateTime: "2026-07-10",
        id: "req-1037-review",
        state: "complete",
        timestamp: "Jul 10",
        title: "Provider Review",
      },
      {
        category: "Status",
        dateTime: "2026-07-12",
        id: "req-1037-approved",
        state: "complete",
        timestamp: "Jul 12",
        title: "Approved",
      },
    ],
    title: "Follow-Up Care Question",
  },
  {
    billing: {
      status: "resolved",
      summary: "No payment is due for this closed request.",
    },
    id: "REQ-2026-1029",
    lastUpdated: "Jul 6, 2026",
    lastUpdatedDateTime: "2026-07-06",
    nextAction: "No patient action is needed.",
    patientSummary: "The submitted request did not contain enough non-sensitive context for this preview.",
    provider: "Dr. Marin Brooks",
    service: "prescription",
    status: "declined",
    submittedDate: "Jul 4, 2026",
    submittedDateTime: "2026-07-04",
    summary: "The request is closed after provider review.",
    timeline: [
      {
        category: "Request",
        dateTime: "2026-07-04",
        id: "req-1029-submitted",
        state: "complete",
        timestamp: "Jul 4",
        title: "Request Submitted",
      },
      {
        category: "Review",
        dateTime: "2026-07-06",
        id: "req-1029-review",
        state: "complete",
        timestamp: "Jul 6",
        title: "Provider Review",
      },
      {
        category: "Status",
        dateTime: "2026-07-06",
        id: "req-1029-declined",
        state: "failed",
        timestamp: "Jul 6",
        title: "Declined",
      },
    ],
    title: "Medication Review Question",
  },
  {
    billing: {
      amountLabel: "Amount Due",
      amountValue: "$65.00",
      status: "payment-failed",
      summary: "Payment Failed is shown in red because the payment attempt did not complete.",
    },
    id: "REQ-2026-1022",
    lastUpdated: "Jun 30, 2026",
    lastUpdatedDateTime: "2026-06-30",
    nextAction: "Review the payment failure notice.",
    patientSummary: "The request contains a general consultation question and a resolved billing status.",
    provider: "Dr. Sage Palmer",
    service: "consultation",
    status: "payment-failed",
    submittedDate: "Jun 27, 2026",
    submittedDateTime: "2026-06-27",
    summary: "A payment attempt did not complete after provider review.",
    timeline: [
      {
        category: "Request",
        dateTime: "2026-06-27",
        id: "req-1022-submitted",
        state: "complete",
        timestamp: "Jun 27",
        title: "Request Submitted",
      },
      {
        category: "Billing",
        dateTime: "2026-06-30",
        id: "req-1022-payment-failed",
        state: "failed",
        timestamp: "Jun 30",
        title: "Payment Failed",
      },
    ],
    title: "Care Follow-Up Request",
  },
  {
    billing: {
      status: "not-issued",
      summary: "Billing has not started for this submitted request.",
    },
    id: "REQ-2026-1018",
    lastUpdated: "Jun 22, 2026",
    lastUpdatedDateTime: "2026-06-22",
    nextAction: "Wait for the care team to review the request.",
    patientSummary: "The submitted request contains a short non-urgent care question for provider review.",
    service: "consultation",
    status: "submitted",
    submittedDate: "Jun 22, 2026",
    submittedDateTime: "2026-06-22",
    summary: "The request has been submitted and is waiting for initial review.",
    timeline: [
      {
        category: "Request",
        dateTime: "2026-06-22",
        id: "req-1018-submitted",
        state: "current",
        timestamp: "Jun 22",
        title: "Request Submitted",
      },
    ],
    title: "New Care Question",
  },
];

export const patientActionRequired: PatientActionRequiredFixture[] = [
  {
    careRequestId: "REQ-2026-1048",
    description: "A reviewed request has an issued payment notice.",
    id: "action-payment-required",
    label: "Payment Required",
    title: "Payment Required",
    tone: "warning",
  },
  {
    careRequestId: "REQ-2026-1037",
    description: "A care team message is waiting for a patient response.",
    id: "action-message-response",
    label: "Response Needed",
    title: "Provider Message Awaiting Response",
    tone: "warning",
  },
];

export const patientConversations: PatientConversationFixture[] = [
  {
    id: "CONV-2026-4401",
    latestPreview: "Thanks for the update. Please review the care request detail page for the next step.",
    messages: [
      {
        body: "Thanks for the update. Please review the care request detail page for the next step.",
        dateTime: "2026-07-21T16:30:00-05:00",
        id: "MSG-4401-2",
        sender: "Care Team",
        timestamp: "Jul 21, 4:30 PM",
      },
      {
        body: "I added the requested context to the care request summary.",
        dateTime: "2026-07-21T15:42:00-05:00",
        id: "MSG-4401-1",
        sender: "Patient",
        timestamp: "Jul 21, 3:42 PM",
      },
    ],
    participant: "Care Team",
    subject: "General Wellness Request",
    unread: true,
    updatedAt: "Jul 21",
    updatedAtDateTime: "2026-07-21",
  },
  {
    id: "CONV-2026-4388",
    latestPreview:
      "Your laboratory request is still waiting for provider review. No charge until provider review.",
    messages: [
      {
        body:
          "Your laboratory request is still waiting for provider review. No charge until provider review. This preview intentionally keeps the message center read-only and does not send messages.",
        dateTime: "2026-07-18T10:12:00-05:00",
        id: "MSG-4388-1",
        sender: "Care Coordinator",
        timestamp: "Jul 18, 10:12 AM",
      },
    ],
    participant: "Care Coordinator",
    subject: "Routine Lab Review Request",
    unread: false,
    updatedAt: "Jul 18",
    updatedAtDateTime: "2026-07-18",
  },
];

export const patientChartFixture: PatientChartFixture = {
  allergies: [],
  careHistory: [
    {
      date: "Jul 12, 2026",
      dateTime: "2026-07-12",
      requestId: "REQ-2026-1037",
      status: "approved",
      title: "Follow-Up Care Question",
    },
    {
      date: "Jul 6, 2026",
      dateTime: "2026-07-06",
      requestId: "REQ-2026-1029",
      status: "declined",
      title: "Medication Review Question",
    },
  ],
  conditions: [],
  labResults: [
    {
      date: "Jul 8, 2026",
      dateTime: "2026-07-08",
      id: "LAB-2026-3107",
      releaseState: "released",
      summary: "Released to patient by the care team.",
      title: "Released Laboratory Result",
    },
    {
      date: "Jul 20, 2026",
      dateTime: "2026-07-20",
      id: "LAB-2026-3114",
      releaseState: "unreleased",
      summary: "Not available in the patient portal until release.",
      title: "Unreleased Laboratory Result",
    },
  ],
  medications: [],
  profile: [
    { label: "Patient", value: "Parker Morgan" },
    { label: "Preferred Contact", value: "Secure Message" },
    { label: "State", value: "IL" },
    { label: "Date of Birth", value: "Not Supplied in Preview" },
  ],
};

export const patientBillingFixture: PatientBillingFixture = {
  history: [
    {
      amount: "$65.00",
      date: "Jul 21, 2026",
      dateTime: "2026-07-21",
      description: "General Wellness Request",
      id: "INV-2026-8801",
      status: "payment-required",
    },
    {
      amount: "$80.00",
      date: "Jul 12, 2026",
      dateTime: "2026-07-12",
      description: "Follow-Up Care Question",
      id: "INV-2026-8760",
      status: "paid",
    },
    {
      amount: "$65.00",
      date: "Jun 30, 2026",
      dateTime: "2026-06-30",
      description: "Care Follow-Up Request",
      id: "INV-2026-8702",
      status: "payment-failed",
    },
  ],
  overview: [
    { label: "Needs Attention", tone: "warning", value: "1 Payment Required" },
    { label: "Paid Items", tone: "success", value: "1 Paid" },
    { label: "Failed Items", tone: "danger", value: "1 Payment Failed" },
  ],
  paidItems: [
    {
      amount: "$80.00",
      date: "Jul 12, 2026",
      dateTime: "2026-07-12",
      description: "Follow-Up Care Question",
      id: "INV-2026-8760",
      status: "paid",
    },
  ],
  paymentRequiredItems: [
    {
      amount: "$65.00",
      date: "Jul 21, 2026",
      dateTime: "2026-07-21",
      description: "General Wellness Request",
      id: "INV-2026-8801",
      status: "payment-required",
    },
  ],
  resolvedInvoices: [
    {
      amount: "$80.00",
      date: "Jul 12, 2026",
      dateTime: "2026-07-12",
      description: "Follow-Up Care Question",
      id: "INV-2026-8760",
      status: "paid",
    },
  ],
};

export const patientSettingsFixture = {
  accessibility: {
    comfortableSpacing: true,
    reduceMotionPreference: false,
  },
  contact: {
    email: "parker.patient@example.invalid",
    phone: "555-0108",
  },
  profile: {
    displayName: "Parker Morgan",
    preferredName: "Parker",
  },
};

export function getCareRequestById(requestId: string) {
  return patientCareRequests.find((request) => request.id === requestId) ?? null;
}

export function getReleasedLabResults() {
  return patientChartFixture.labResults.filter((result) => result.releaseState === "released");
}
