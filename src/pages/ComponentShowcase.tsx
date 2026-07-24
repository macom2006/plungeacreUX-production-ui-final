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
  DataTableHeader,
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
  ProgressSteps,
  RadioGroup,
  Select,
  Skeleton,
  SortableHeader,
  Spinner,
  StatusBadge,
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
                { content: <p>History content.</p>, id: "history", label: "History" },
              ]}
            />
            <ProgressSteps
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
              <DataTableHeader>
                <DataTableRow>
                  <SortableHeader direction="ascending">Request</SortableHeader>
                  <SortableHeader>Status</SortableHeader>
                  <SortableHeader>Owner</SortableHeader>
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
              items={[
                { label: "Patient", value: "Example Person" },
                { label: "State", value: "FL" },
                { label: "Missing data", value: "Not provided" },
              ]}
            />
          </ShowcaseSection>

          <ShowcaseSection title="Healthcare foundations">
            <div className="showcase-grid showcase-grid--two">
              <CareRequestCard
                requestId="REQ-FOUNDATION"
                service="laboratory"
                status="pending-review"
                submittedDate="Today"
                summary="Illustrative lab request copy with no estimated laboratory amount."
                title="Lab review request"
              />
              <PatientContextCard
                patient={{
                  allergies: "Sensitive data label",
                  conditions: "Missing data",
                  contactDetails: "Sensitive data",
                  dateOfBirth: "Sensitive data",
                  name: "Example Person",
                  pharmacy: "Missing data",
                  state: "FL",
                }}
              />
            </div>
            <CareTimeline
              states={["complete", "current", "upcoming", "upcoming", "upcoming"]}
              variant="laboratory"
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
