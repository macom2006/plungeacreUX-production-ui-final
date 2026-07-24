import { BillingSummary } from "../../components/healthcare";
import {
  Alert,
  Card,
  DataTable,
  DataTableBody,
  DataTableCaption,
  DataTableCell,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
  EmptyState,
  LinkButton,
  MobileRecordCard,
  Skeleton,
  StatusBadge,
} from "../../components/ui";
import {
  billingStateLabels,
  billingStateTone,
  patientBillingFixture,
  patientCareRequests,
  type PatientInvoiceFixture,
  type PatientPageState,
} from "../../lib/patientFixtures";
import { patientRoutes } from "../../lib/routes";

function InvoiceTable({
  caption,
  emptyTitle,
  invoices,
}: {
  caption: string;
  emptyTitle: string;
  invoices: PatientInvoiceFixture[];
}) {
  if (invoices.length === 0) {
    return (
      <EmptyState
        compact
        description="No invoice records have been supplied for this section."
        title={emptyTitle}
      />
    );
  }

  return (
    <>
      <div className="patient-page__desktop-table">
        <DataTable responsiveLabel={`${caption} table`}>
          <DataTableCaption>{caption}</DataTableCaption>
          <DataTableHeader>
            <DataTableRow>
              <DataTableHeaderCell>Invoice</DataTableHeaderCell>
              <DataTableHeaderCell>Date</DataTableHeaderCell>
              <DataTableHeaderCell>Status</DataTableHeaderCell>
              <DataTableHeaderCell>Amount</DataTableHeaderCell>
              <DataTableHeaderCell>Action</DataTableHeaderCell>
            </DataTableRow>
          </DataTableHeader>
          <DataTableBody>
            {invoices.map((invoice) => (
              <DataTableRow key={invoice.id}>
                <DataTableCell>
                  {invoice.description}
                  <span className="patient-page__table-note">{invoice.id}</span>
                </DataTableCell>
                <DataTableCell>
                  <time dateTime={invoice.dateTime}>{invoice.date}</time>
                </DataTableCell>
                <DataTableCell>
                  <StatusBadge tone={billingStateTone[invoice.status]}>
                    {billingStateLabels[invoice.status]}
                  </StatusBadge>
                </DataTableCell>
                <DataTableCell>{invoice.amount}</DataTableCell>
                <DataTableCell>
                  <LinkButton href={patientRoutes.careRequests} size="sm" variant="secondary">
                    View Request
                  </LinkButton>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </div>
      <div className="patient-page__mobile-records" aria-label={`${caption} mobile records`}>
        {invoices.map((invoice) => (
          <MobileRecordCard
            fields={[
              { label: "Invoice ID", value: invoice.id },
              { label: "Date", value: <time dateTime={invoice.dateTime}>{invoice.date}</time> },
              { label: "Amount", value: invoice.amount },
            ]}
            key={invoice.id}
            primaryAction={(
              <LinkButton fullWidth href={patientRoutes.careRequests} variant="secondary">
                View Request
              </LinkButton>
            )}
            status={<StatusBadge tone={billingStateTone[invoice.status]}>{billingStateLabels[invoice.status]}</StatusBadge>}
            title={invoice.description}
          />
        ))}
      </div>
    </>
  );
}

export function PatientBillingPage({ state = "ready" }: { state?: PatientPageState }) {
  const billingSummarySource = patientCareRequests.find((request) => request.billing?.lineItems && request.billing.total);

  if (state === "loading") {
    return (
      <section className="patient-page" aria-label="Billing loading">
        <Skeleton type="card" />
        <Skeleton type="table-row" />
      </section>
    );
  }

  if (state === "error") {
    return (
      <Alert
        description="Billing records could not be loaded from the fixture source."
        role="alert"
        title="Billing Could Not Load"
        tone="danger"
      />
    );
  }

  if (state === "permission") {
    return (
      <Alert
        description="This fictional patient account does not have access to the requested billing records."
        role="alert"
        title="Permission Needed"
        tone="danger"
      />
    );
  }

  if (state === "empty") {
    return (
      <EmptyState
        description="No billing records have been supplied for this patient fixture."
        title="No Billing Records"
      />
    );
  }

  return (
    <section className="patient-page" aria-labelledby="patient-billing-title">
      <div className="patient-page__heading">
        <div>
          <p className="patient-page__kicker">Billing & Payments</p>
          <h2 id="patient-billing-title">Payment Status Overview</h2>
          <p>
            Review supplied invoice states. This page does not collect payment details or process payments.
          </p>
        </div>
      </div>

      {state === "partial" ? (
        <Alert
          description="Invoice history is available, but some request links use the general care request list."
          role="status"
          title="Partial Data Loaded"
          tone="warning"
        />
      ) : null}

      <div className="patient-page__metric-grid">
        {patientBillingFixture.overview.map((item) => (
          <Card className="patient-metric-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <StatusBadge tone={item.tone}>{item.value}</StatusBadge>
          </Card>
        ))}
      </div>

      {billingSummarySource?.billing?.lineItems && billingSummarySource.billing.total ? (
        <BillingSummary
          lineItems={billingSummarySource.billing.lineItems}
          title="Payment Required Summary"
          total={billingSummarySource.billing.total}
        />
      ) : null}

      <Card title="Payment Required Items">
        <InvoiceTable
          caption="Payment Required Items"
          emptyTitle="No Payment Required Items"
          invoices={patientBillingFixture.paymentRequiredItems}
        />
      </Card>

      <Card title="Paid Items">
        <InvoiceTable
          caption="Paid Items"
          emptyTitle="No Paid Items"
          invoices={patientBillingFixture.paidItems}
        />
      </Card>

      <Card title="Resolved Invoices">
        <InvoiceTable
          caption="Resolved Invoices"
          emptyTitle="No Resolved Invoices"
          invoices={patientBillingFixture.resolvedInvoices}
        />
      </Card>

      <Card title="Billing History">
        <InvoiceTable
          caption="Billing History"
          emptyTitle="No Billing History"
          invoices={patientBillingFixture.history}
        />
      </Card>
    </section>
  );
}
