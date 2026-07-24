import { useMemo, useState } from "react";
import {
  Alert,
  DataTable,
  DataTableBody,
  DataTableCaption,
  DataTableCell,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
  EmptyState,
  FilterBar,
  LinkButton,
  MobileRecordCard,
  Pagination,
  Skeleton,
  StatusBadge,
  type CareStatus,
} from "../../components/ui";
import {
  canonicalCareStatuses,
  careStatusLabels,
  patientCareRequests,
  type PatientCareRequestFixture,
  type PatientPageState,
} from "../../lib/patientFixtures";
import { patientRoutes } from "../../lib/routes";

const requestPageSize = 4;
const emptyCareRequests: PatientCareRequestFixture[] = [];
const statusOptions = [
  { label: "All Statuses", value: "all" },
  ...canonicalCareStatuses.map((status) => ({
    label: careStatusLabels[status],
    value: status,
  })),
];

function matchesSearch(request: PatientCareRequestFixture, searchTerm: string) {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  if (!normalizedTerm) return true;

  return [request.id, request.title]
    .some((value) => value.toLowerCase().includes(normalizedTerm));
}

export function PatientCareRequestsPage({ state = "ready" }: { state?: PatientPageState }) {
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState<CareStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const sourceRequests = state === "empty" ? emptyCareRequests : patientCareRequests;
  const filteredRequests = useMemo(() => (
    sourceRequests.filter((request) => (
      (statusValue === "all" || request.status === statusValue)
      && matchesSearch(request, searchValue)
    ))
  ), [searchValue, sourceRequests, statusValue]);
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / requestPageSize));
  const visibleRequests = filteredRequests.slice(
    (Math.min(currentPage, totalPages) - 1) * requestPageSize,
    Math.min(currentPage, totalPages) * requestPageSize,
  );
  const activeFilterCount = Number(searchValue.trim() !== "") + Number(statusValue !== "all");

  if (state === "loading") {
    return (
      <section className="patient-page" aria-label="Care requests loading">
        <Skeleton type="card" />
        <Skeleton type="table-row" />
        <Skeleton type="table-row" />
      </section>
    );
  }

  if (state === "error") {
    return (
      <Alert
        description="Care request records could not be loaded from the fixture source."
        role="alert"
        title="Care Requests Could Not Load"
        tone="danger"
      />
    );
  }

  if (state === "permission") {
    return (
      <Alert
        description="This fictional patient account does not have access to the requested care requests."
        role="alert"
        title="Permission Needed"
        tone="danger"
      />
    );
  }

  const emptyState = (
    <EmptyState
      compact
      description="No care requests match the current search or filter."
      title="No Care Requests Found"
    />
  );

  return (
    <section className="patient-page" aria-labelledby="patient-care-requests-title">
      <div className="patient-page__heading">
        <div>
          <p className="patient-page__kicker">Care Requests</p>
          <h2 id="patient-care-requests-title">Review Care Requests</h2>
          <p>
            Search and review fictional request records with canonical care statuses.
          </p>
        </div>
      </div>

      {state === "partial" ? (
        <Alert
          description="Provider assignment is missing on some records, but request status is still available."
          role="status"
          title="Partial Data Loaded"
          tone="warning"
        />
      ) : null}

      <FilterBar
        activeFilterCount={activeFilterCount}
        onClearAll={() => {
          setSearchValue("");
          setStatusValue("all");
          setCurrentPage(1);
        }}
        onSearchChange={(value) => {
          setSearchValue(value);
          setCurrentPage(1);
        }}
        onStatusChange={(value) => {
          setStatusValue(value as CareStatus | "all");
          setCurrentPage(1);
        }}
        searchLabel="Search by request title or identifier"
        searchValue={searchValue}
        statusOptions={statusOptions}
        statusValue={statusValue}
      />

      {sourceRequests.length === 0 ? (
        <EmptyState
          actions={<LinkButton href="/start-care">Start Care</LinkButton>}
          description="Start a care request when you are ready. No blank cards are shown for missing data."
          title="No Care Requests Yet"
        />
      ) : (
        <>
          <div className="patient-page__desktop-table">
            <DataTable
              emptyState={filteredRequests.length === 0 ? emptyState : undefined}
              responsiveLabel="Care request table"
            >
              <DataTableCaption>Care Request Records</DataTableCaption>
              <DataTableHeader>
                <DataTableRow>
                  <DataTableHeaderCell>Request</DataTableHeaderCell>
                  <DataTableHeaderCell>Submitted</DataTableHeaderCell>
                  <DataTableHeaderCell>Provider</DataTableHeaderCell>
                  <DataTableHeaderCell>Status</DataTableHeaderCell>
                  <DataTableHeaderCell>Last Updated</DataTableHeaderCell>
                  <DataTableHeaderCell>Action</DataTableHeaderCell>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                {visibleRequests.map((request) => (
                  <DataTableRow key={request.id}>
                    <DataTableCell>
                      <a href={`${patientRoutes.careRequests}/${request.id}`}>{request.title}</a>
                      <span className="patient-page__table-note">{request.id}</span>
                    </DataTableCell>
                    <DataTableCell>
                      <time dateTime={request.submittedDateTime}>{request.submittedDate}</time>
                    </DataTableCell>
                    <DataTableCell>{request.provider ?? "Not Assigned"}</DataTableCell>
                    <DataTableCell>
                      <StatusBadge status={request.status} />
                    </DataTableCell>
                    <DataTableCell>
                      <time dateTime={request.lastUpdatedDateTime}>{request.lastUpdated}</time>
                    </DataTableCell>
                    <DataTableCell>
                      <LinkButton
                        href={`${patientRoutes.careRequests}/${request.id}`}
                        size="sm"
                        variant="secondary"
                      >
                        View
                      </LinkButton>
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </div>

          <div className="patient-page__mobile-records" aria-label="Mobile care request records">
            {filteredRequests.length === 0 ? emptyState : visibleRequests.map((request) => (
              <MobileRecordCard
                fields={[
                  { label: "Request ID", value: request.id },
                  {
                    label: "Submitted",
                    value: <time dateTime={request.submittedDateTime}>{request.submittedDate}</time>,
                  },
                  { label: "Provider", value: request.provider ?? "Not Assigned" },
                  {
                    label: "Last Updated",
                    value: <time dateTime={request.lastUpdatedDateTime}>{request.lastUpdated}</time>,
                  },
                ]}
                key={request.id}
                primaryAction={(
                  <LinkButton
                    fullWidth
                    href={`${patientRoutes.careRequests}/${request.id}`}
                    variant="secondary"
                  >
                    View Request
                  </LinkButton>
                )}
                status={<StatusBadge status={request.status} />}
                title={request.title}
              />
            ))}
          </div>

          {filteredRequests.length > 0 ? (
            <Pagination
              currentPage={Math.min(currentPage, totalPages)}
              onPageChange={setCurrentPage}
              resultsSummary={`${filteredRequests.length} care request records`}
              totalPages={totalPages}
            />
          ) : null}
        </>
      )}
    </section>
  );
}
