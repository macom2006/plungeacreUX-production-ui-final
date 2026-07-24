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
  DescriptionList,
  EmptyState,
  MobileRecordCard,
  Skeleton,
  StatusBadge,
} from "../../components/ui";
import {
  careStatusLabels,
  getReleasedLabResults,
  patientChartFixture,
  type PatientPageState,
} from "../../lib/patientFixtures";

function EmptyChartSection({ title }: { title: string }) {
  return (
    <EmptyState
      compact
      description="This fictional preview does not include supplied patient information for this section."
      title={title}
    />
  );
}

export function PatientMyChartPage({ state = "ready" }: { state?: PatientPageState }) {
  const releasedLabResults = state === "empty" ? [] : getReleasedLabResults();

  if (state === "loading") {
    return (
      <section className="patient-page" aria-label="My Chart loading">
        <Skeleton type="card" />
        <Skeleton type="table-row" />
      </section>
    );
  }

  if (state === "error") {
    return (
      <Alert
        description="My Chart information could not be loaded from the fixture source."
        role="alert"
        title="My Chart Could Not Load"
        tone="danger"
      />
    );
  }

  if (state === "permission") {
    return (
      <Alert
        description="This fictional patient account does not have access to the requested chart information."
        role="alert"
        title="Permission Needed"
        tone="danger"
      />
    );
  }

  return (
    <section className="patient-page" aria-labelledby="patient-my-chart-title">
      <div className="patient-page__heading">
        <div>
          <p className="patient-page__kicker">My Chart</p>
          <h2 id="patient-my-chart-title">Health Information</h2>
          <p>
            Review profile details, supplied history sections, released laboratory results, and care history.
          </p>
        </div>
      </div>

      {state === "partial" ? (
        <Alert
          description="Some profile details are intentionally missing, and unreleased laboratory results remain hidden."
          role="status"
          title="Partial Data Loaded"
          tone="warning"
        />
      ) : null}

      <div className="patient-page__detail-grid">
        <Card title="Profile Information">
          <DescriptionList columns="multi" items={patientChartFixture.profile} />
        </Card>

        <Card title="Conditions">
          {patientChartFixture.conditions.length > 0 ? (
            <ul className="patient-page__plain-list">
              {patientChartFixture.conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
          ) : (
            <EmptyChartSection title="No Conditions Supplied" />
          )}
        </Card>

        <Card title="Allergies">
          {patientChartFixture.allergies.length > 0 ? (
            <ul className="patient-page__plain-list">
              {patientChartFixture.allergies.map((allergy) => (
                <li key={allergy}>{allergy}</li>
              ))}
            </ul>
          ) : (
            <EmptyChartSection title="No Allergies Supplied" />
          )}
        </Card>

        <Card title="Medications">
          {patientChartFixture.medications.length > 0 ? (
            <ul className="patient-page__plain-list">
              {patientChartFixture.medications.map((medication) => (
                <li key={medication}>{medication}</li>
              ))}
            </ul>
          ) : (
            <EmptyChartSection title="No Medications Supplied" />
          )}
        </Card>
      </div>

      <Card title="Laboratory Results">
        <p className="patient-page__section-copy">
          Recent Results displays released laboratory results only.
        </p>
        {releasedLabResults.length === 0 ? (
          <EmptyState
            compact
            description="No released laboratory results are available for this patient fixture."
            title="No Released Results"
          />
        ) : (
          <>
            <div className="patient-page__desktop-table">
              <DataTable responsiveLabel="Released laboratory results table">
                <DataTableCaption>Released Laboratory Results</DataTableCaption>
                <DataTableHeader>
                  <DataTableRow>
                    <DataTableHeaderCell>Result</DataTableHeaderCell>
                    <DataTableHeaderCell>Released</DataTableHeaderCell>
                    <DataTableHeaderCell>Status</DataTableHeaderCell>
                    <DataTableHeaderCell>Summary</DataTableHeaderCell>
                  </DataTableRow>
                </DataTableHeader>
                <DataTableBody>
                  {releasedLabResults.map((result) => (
                    <DataTableRow key={result.id}>
                      <DataTableCell>{result.title}</DataTableCell>
                      <DataTableCell>
                        <time dateTime={result.dateTime}>{result.date}</time>
                      </DataTableCell>
                      <DataTableCell>
                        <StatusBadge tone="success">Released</StatusBadge>
                      </DataTableCell>
                      <DataTableCell>{result.summary}</DataTableCell>
                    </DataTableRow>
                  ))}
                </DataTableBody>
              </DataTable>
            </div>
            <div className="patient-page__mobile-records" aria-label="Mobile released laboratory results">
              {releasedLabResults.map((result) => (
                <MobileRecordCard
                  fields={[
                    { label: "Result ID", value: result.id },
                    { label: "Released", value: <time dateTime={result.dateTime}>{result.date}</time> },
                    { label: "Summary", value: result.summary },
                  ]}
                  key={result.id}
                  status={<StatusBadge tone="success">Released</StatusBadge>}
                  title={result.title}
                />
              ))}
            </div>
          </>
        )}
      </Card>

      <Card title="Care History">
        <div className="patient-page__desktop-table">
          <DataTable responsiveLabel="Care history table">
            <DataTableCaption>Care History</DataTableCaption>
            <DataTableHeader>
              <DataTableRow>
                <DataTableHeaderCell>Request</DataTableHeaderCell>
                <DataTableHeaderCell>Date</DataTableHeaderCell>
                <DataTableHeaderCell>Status</DataTableHeaderCell>
              </DataTableRow>
            </DataTableHeader>
            <DataTableBody>
              {patientChartFixture.careHistory.map((historyItem) => (
                <DataTableRow key={historyItem.requestId}>
                  <DataTableCell>{historyItem.title}</DataTableCell>
                  <DataTableCell>
                    <time dateTime={historyItem.dateTime}>{historyItem.date}</time>
                  </DataTableCell>
                  <DataTableCell>
                    <StatusBadge status={historyItem.status}>{careStatusLabels[historyItem.status]}</StatusBadge>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </div>
        <div className="patient-page__mobile-records" aria-label="Mobile care history records">
          {patientChartFixture.careHistory.map((historyItem) => (
            <MobileRecordCard
              fields={[
                { label: "Request ID", value: historyItem.requestId },
                { label: "Date", value: <time dateTime={historyItem.dateTime}>{historyItem.date}</time> },
              ]}
              key={historyItem.requestId}
              status={<StatusBadge status={historyItem.status}>{careStatusLabels[historyItem.status]}</StatusBadge>}
              title={historyItem.title}
            />
          ))}
        </div>
      </Card>
    </section>
  );
}
