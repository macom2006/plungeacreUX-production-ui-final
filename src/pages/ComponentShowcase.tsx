import { useState } from "react";
import {
  BillingSummary,
  CareRequestCard,
  CareTimeline,
  PatientContextCard,
} from "../components/healthcare";
import { PublicLayout } from "../components/layout";
import {
  Alert,
  Avatar,
  Breadcrumbs,
  Button,
  Checkbox,
  ConfirmationDialog,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableCaption,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
  DescriptionList,
  Dialog,
  Drawer,
  EmptyState,
  FilterBar,
  FormField,
  Input,
  MobileRecordCard,
  Pagination,
  RadioGroup,
  Select,
  Skeleton,
  SortableHeader,
  Spinner,
  StatusBadge,
  Stepper,
  Switch,
  Tabs,
  Textarea,
  ToastProvider,
  Tooltip,
  useToast,
} from "../components/ui";
import "./ComponentShowcase.css";

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Pending review", value: "pending-review" },
  { label: "Payment required", value: "payment-required" },
  { label: "Approved", value: "approved" },
];

function ToastDemo() {
  const { showToast } = useToast();
  return (
    <div className="showcase-row">
      <Button
        onClick={() => showToast({ title: "Saved", description: "The preview state was saved.", tone: "success" })}
      >
        Show success toast
      </Button>
      <Button
        onClick={() => showToast({ title: "Needs review", description: "This warning remains readable.", tone: "warning" })}
        variant="outline"
      >
        Show warning toast
      </Button>
    </div>
  );
}

export function ComponentShowcase() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [radioValue, setRadioValue] = useState("patient");

  return (
    <ToastProvider>
      <PublicLayout>
        <div className="component-showcase">
          <header className="component-showcase__header">
            <Breadcrumbs
              items={[
                { href: "/", label: "Foundation" },
                { label: "Components" },
              ]}
            />
            <h1>Shared production UI components</h1>
            <p>
              Development-only preview for Phase 2 primitives, layouts, states,
              and healthcare foundations.
            </p>
          </header>

          <ShowcaseSection title="Buttons">
            <div className="showcase-row">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="link">Link</Button>
              <Button loading loadingLabel="Saving request">
                Stable loading
              </Button>
              <Button aria-label="Icon action" size="icon" variant="secondary">
                +
              </Button>
            </div>
          </ShowcaseSection>

          <ShowcaseSection title="Forms">
            <div className="showcase-grid showcase-grid--two">
              <FormField description="Use a real label, not placeholder text." label="Email" required>
                <Input autoComplete="email" placeholder="patient@example.com" type="email" />
              </FormField>
              <FormField error="Password is required." label="Password">
                <Input autoComplete="current-password" type="password" />
              </FormField>
              <FormField label="State">
                <Select options={[{ label: "Florida", value: "FL" }, { label: "Texas", value: "TX" }]} />
              </FormField>
              <FormField characterCount="42 / 160" label="Clinical note preview" success="Looks complete.">
                <Textarea maxLength={160} />
              </FormField>
              <Checkbox
                description="Indeterminate state is available for grouped selections."
                indeterminate
                label="Select visible rows"
              />
              <Switch
                checked={switchChecked}
                description="Keyboard-operable switch with role semantics."
                label="Preview notifications"
                onChange={setSwitchChecked}
              />
            </div>
            <RadioGroup
              description="Arrow keys move between options."
              legend="Portal role preview"
              name="portal-role"
              onChange={setRadioValue}
              options={[
                { label: "Patient", value: "patient" },
                { label: "Provider", value: "provider" },
                { label: "Admin", value: "admin" },
              ]}
              value={radioValue}
            />
          </ShowcaseSection>

          <ShowcaseSection title="Feedback and status">
            <div className="showcase-grid showcase-grid--two">
              <Alert
                description="Non-urgent notices use polite semantics."
                title="Information notice"
                tone="info"
              />
              <Alert
                description="Urgent dynamic errors may opt into role alert."
                role="alert"
                title="Action failed"
                tone="danger"
              />
            </div>
            <div className="showcase-row">
              <StatusBadge status="submitted" />
              <StatusBadge status="pending-review" />
              <StatusBadge status="payment-required" />
              <StatusBadge status="approved" />
              <StatusBadge status="declined" />
              <StatusBadge status="payment-failed" />
            </div>
            <ToastDemo />
            <div className="showcase-row">
              <Spinner label="Loading preview" />
              <Skeleton lines={3} />
            </div>
            <EmptyState
              actions={<Button variant="secondary">Secondary action</Button>}
              description="This demonstrates compact and full-page empty state structure."
              icon="i"
              title="No preview records"
            />
          </ShowcaseSection>

          <ShowcaseSection title="Filters">
            <FilterBar
              activeFilterCount={search || status !== "all" ? 1 : 0}
              additionalFilters={
                <Select
                  aria-label="Filter by owner"
                  options={[
                    { label: "All owners", value: "all" },
                    { label: "Care team", value: "team" },
                    { label: "Provider", value: "provider" },
                  ]}
                  defaultValue="all"
                />
              }
              dateFilter={<Input aria-label="Submitted after" type="date" />}
              onClearAll={() => {
                setSearch("");
                setStatus("all");
              }}
              onOpenFilters={() => setDrawerOpen(true)}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              searchValue={search}
              statusOptions={statusOptions}
              statusValue={status}
            />
            <div className="showcase-filter-preview showcase-filter-preview--drawer" aria-label="Drawer filter preview">
              <FilterBar
                activeFilterCount={search || status !== "all" ? 1 : 0}
                layout="drawer"
                onClearAll={() => {
                  setSearch("");
                  setStatus("all");
                }}
                onOpenFilters={() => setDrawerOpen(true)}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                searchValue={search}
                statusOptions={statusOptions}
                statusValue={status}
              />
            </div>
            <div className="showcase-filter-preview showcase-filter-preview--narrow" aria-label="Narrow mobile filter preview">
              <FilterBar
                activeFilterCount={0}
                layout="compact"
                onClearAll={() => undefined}
                onOpenFilters={() => setDrawerOpen(true)}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                searchValue=""
                statusOptions={statusOptions}
                statusValue="all"
              />
            </div>
          </ShowcaseSection>

          <ShowcaseSection title="Overlays">
            <div className="showcase-row">
              <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
              <Button onClick={() => setConfirmOpen(true)} variant="outline">
                Open confirmation
              </Button>
              <Button onClick={() => setDrawerOpen(true)} variant="secondary">
                Open drawer
              </Button>
            </div>
            <Dialog
              description="Focus is trapped while this dialog is open."
              isOpen={dialogOpen}
              onClose={() => setDialogOpen(false)}
              title="Accessible dialog"
            >
              <p>Escape closes the dialog and focus returns to the trigger.</p>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </Dialog>
            <ConfirmationDialog
              actionName="archive preview record"
              confirmLabel="Archive record"
              consequence="This is suitable for future destructive or approval flows because the action and consequence are explicit."
              isOpen={confirmOpen}
              onCancel={() => setConfirmOpen(false)}
              onConfirm={() => setConfirmOpen(false)}
              title="Confirm archive"
              tone="danger"
            />
            <Drawer
              description="Drawers are reserved for context and filters, not clinical or financial actions."
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="Filter drawer"
            >
              <FilterBar
                activeFilterCount={search || status !== "all" ? 1 : 0}
                layout="drawer"
                onClearAll={() => {
                  setSearch("");
                  setStatus("all");
                }}
                onSearchChange={setSearch}
                onStatusChange={setStatus}
                searchValue={search}
                statusOptions={statusOptions}
                statusValue={status}
              />
            </Drawer>
          </ShowcaseSection>

          <ShowcaseSection title="Navigation">
            <Tabs
              tabs={[
                { content: <p>Overview content with long text that wraps safely.</p>, id: "overview", label: "Overview" },
                { content: <p>Details content.</p>, id: "details", label: "Details" },
                { content: <p>History content.</p>, disabled: true, id: "history", label: "History" },
              ]}
            />
            <Stepper
              steps={[
                { label: "Profile", state: "completed" },
                { label: "License", state: "current" },
                { label: "Review", optional: true, state: "upcoming" },
                { label: "Complete", state: "upcoming" },
              ]}
            />
            <Pagination
              currentPage={page}
              onPageChange={setPage}
              resultsSummary="Showing preview records 1-3"
              totalPages={4}
            />
          </ShowcaseSection>

          <ShowcaseSection title="Data display">
            <DataTable>
              <DataTableCaption>Preview request records with native table semantics.</DataTableCaption>
              <DataTableHeader>
                <DataTableRow>
                  <SortableHeader direction="ascending">Request</SortableHeader>
                  <SortableHeader>Status</SortableHeader>
                  <DataTableHeaderCell>Owner</DataTableHeaderCell>
                </DataTableRow>
              </DataTableHeader>
              <DataTableBody>
                <DataTableRow>
                  <DataTableCell>Request A</DataTableCell>
                  <DataTableCell><StatusBadge status="payment-required" /></DataTableCell>
                  <DataTableCell>Care team</DataTableCell>
                </DataTableRow>
              </DataTableBody>
            </DataTable>
            <MobileRecordCard
              fields={[
                { label: "Request", value: "Request A" },
                { label: "Owner", value: "Care team" },
              ]}
              primaryAction={<Button variant="secondary">Open</Button>}
              status={<StatusBadge status="pending-review" />}
              title="Mobile record card"
            />
            <div className="showcase-row">
              <Avatar alt="Practice user" initials="PU" status="online" />
              <Tooltip content="Tooltips supplement visible labels and never carry required information.">
                Tooltip trigger
              </Tooltip>
            </div>
            <DescriptionList
              columns="multi"
              density="compact"
              items={[
                { label: "Patient", value: "Example Person" },
                { label: "State", value: "FL" },
                { label: "Preference", value: "Not provided" },
              ]}
            />
          </ShowcaseSection>

          <ShowcaseSection title="Healthcare foundations">
            <div className="showcase-grid showcase-grid--two">
              <CareRequestCard
                providerReviewState="not-reviewed"
                requestId="REQ-LAB-SUBMITTED"
                service="laboratory"
                status="submitted"
                submittedDate="Today"
                summary="Illustrative lab request copy with no estimated laboratory amount."
                title="Submitted lab request"
              />
              <CareRequestCard
                providerReviewState="not-reviewed"
                requestId="REQ-LAB-REVIEW"
                service="laboratory"
                status="pending-review"
                submittedDate="Today"
                summary="Illustrative lab request copy awaiting provider review."
                title="Lab review request"
              />
              <PatientContextCard
                patient={{
                  age: "Server supplied",
                  allergies: "No allergies supplied",
                  conditions: "No conditions supplied",
                  contactDetails: "Secure message available",
                  dateOfBirth: "Server supplied",
                  initials: "EP",
                  name: "Example Person",
                  pharmacy: "Not provided",
                  state: "FL",
                }}
              />
            </div>
            <CareTimeline
              events={[
                {
                  category: "Request",
                  dateTime: "2026-07-01T09:00:00-05:00",
                  description: "The request was submitted with the required intake information supplied by the patient.",
                  id: "submitted",
                  state: "complete",
                  timestamp: "Jul 1, 2026 at 9:00 AM",
                  title: "Submitted",
                },
                {
                  category: "Clinical review",
                  dateTime: "2026-07-01T13:30:00-05:00",
                  description: "A provider is reviewing eligibility and next steps before any follow-up action is shown.",
                  id: "pending-review",
                  state: "current",
                  timestamp: "Jul 1, 2026 at 1:30 PM",
                  title: "Pending review",
                },
                {
                  category: "Billing",
                  description: "Server-supplied payment status would appear here when available.",
                  id: "payment-required",
                  state: "upcoming",
                  title: "Payment required",
                },
                {
                  category: "Decision",
                  description: "This illustrates a failed terminal status without relying on red alone.",
                  id: "payment-failed",
                  state: "failed",
                  title: "Payment failed",
                },
              ]}
            />
            <BillingSummary
              lineItems={[
                { amount: "Server supplied value", label: "Resolved line item" },
                { amount: "Server supplied value", label: "Resolved adjustment" },
              ]}
              total="Server supplied total"
            />
          </ShowcaseSection>
        </div>
      </PublicLayout>
    </ToastProvider>
  );
}

function ShowcaseSection({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section aria-labelledby={`${title.toLowerCase().replace(/\s+/g, "-")}-title`} className="showcase-section">
      <h2 id={`${title.toLowerCase().replace(/\s+/g, "-")}-title`}>{title}</h2>
      <div className="showcase-section__content">{children}</div>
    </section>
  );
}
