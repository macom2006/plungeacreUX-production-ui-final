import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  BillingSummary,
  CareRequestCard,
  CareTimeline,
  PatientContextCard,
} from "../components/healthcare";
import {
  Avatar,
  Button,
  Checkbox,
  ConfirmationDialog,
  DataTable,
  DataTableBody,
  DataTableCaption,
  DataTableCell,
  DataTableHeader,
  DataTableHeaderCell,
  DataTableRow,
  Dialog,
  Drawer,
  FilterBar,
  FormField,
  Input,
  RadioGroup,
  Select,
  SortableHeader,
  StatusBadge,
  Switch,
  Tabs,
  Textarea,
} from "../components/ui";

type InertCapableElement = HTMLElement & { inert: boolean };

function describedByIds(element: HTMLElement) {
  return element.getAttribute("aria-describedby")?.split(/\s+/).filter(Boolean) ?? [];
}

function expectUniqueIds(ids: string[]) {
  expect(new Set(ids).size).toBe(ids.length);
}

describe("Phase 2 shared UI behavior", () => {
  it("keeps Button loading disabled, busy, described, and non-activating", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button loading loadingLabel="Saving request" onClick={onClick}>
        Submit request
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Submit request" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAccessibleDescription("Saving request");
    expect(button).toHaveClass("button--loading");
    expect(within(button).getByText("Submit request")).toBeInTheDocument();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("prevents disabled Button activation independently from loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Disabled action
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Disabled action" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports icon-only Button usage with an accessible name", () => {
    render(
      <Button aria-label="Add request" size="icon" variant="secondary">
        +
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Add request" })).toBeVisible();
  });

  it("associates FormField labels, descriptions, errors, required state, and unique IDs", () => {
    render(
      <>
        <FormField description="Use the account email." error="Email is required." label="Email" required>
          <Input type="email" />
        </FormField>
        <FormField label="Recovery email" required>
          <Input type="email" />
        </FormField>
        <FormField description="Select the active license state." label="State" required>
          <Select options={[{ label: "Florida", value: "FL" }]} />
        </FormField>
        <FormField characterCount="0 / 160" label="Notes" required>
          <Textarea />
        </FormField>
      </>,
    );

    const email = screen.getByLabelText(/^Email/);
    const recoveryEmail = screen.getByLabelText(/^Recovery email/);
    const state = screen.getByLabelText(/^State/);
    const notes = screen.getByLabelText(/^Notes/);

    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription(/Use the account email\..*Email is required\./);
    expect(email).toBeRequired();
    expect(recoveryEmail).toBeRequired();
    expect(state).toBeRequired();
    expect(notes).toBeRequired();
    expect(email.id).not.toBe(recoveryEmail.id);
  });

  it("merges Input caller, FormField, error, and loading descriptions without duplicates", () => {
    render(
      <>
        <p id="custom-input-description">Custom lookup context.</p>
        <FormField
          description="Use the server supplied patient identifier."
          error="Patient identifier is required."
          id="patient-lookup"
          label="Patient lookup"
        >
          <Input
            aria-describedby="custom-input-description patient-lookup-description"
            loading
            loadingLabel="Checking patient lookup"
            type="text"
          />
        </FormField>
      </>,
    );

    const input = screen.getByLabelText("Patient lookup");
    const loadingId = screen.getByText("Checking patient lookup").id;
    const ids = describedByIds(input);

    expect(ids).toEqual(expect.arrayContaining([
      "patient-lookup-description",
      "patient-lookup-error",
      "custom-input-description",
      loadingId,
    ]));
    expectUniqueIds(ids);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/server supplied patient identifier.*required.*Custom lookup.*Checking patient lookup/);
  });

  it("merges Select caller and FormField descriptions", () => {
    render(
      <>
        <p id="custom-select-description">Custom select context.</p>
        <FormField
          description="Choose the server supplied state."
          id="state-field"
          label="State"
        >
          <Select
            aria-describedby="custom-select-description"
            options={[{ label: "Florida", value: "FL" }]}
          />
        </FormField>
      </>,
    );

    const select = screen.getByLabelText("State");
    const ids = describedByIds(select);

    expect(ids).toEqual(expect.arrayContaining([
      "state-field-description",
      "custom-select-description",
    ]));
    expectUniqueIds(ids);
  });

  it("keeps Textarea error and character-count descriptions together", () => {
    render(
      <FormField
        characterCount="0 / 160"
        error="Note is required."
        id="care-note"
        label="Care note"
      >
        <Textarea />
      </FormField>,
    );

    const textarea = screen.getByLabelText("Care note");
    const ids = describedByIds(textarea);

    expect(ids).toEqual(expect.arrayContaining(["care-note-error", "care-note-count"]));
    expectUniqueIds(ids);
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("merges Checkbox built-in and caller descriptions", () => {
    render(
      <>
        <p id="custom-checkbox-description">Custom checkbox context.</p>
        <Checkbox
          aria-describedby="custom-checkbox-description"
          description="Built-in checkbox description."
          id="consent-checkbox"
          label="Confirm review"
        />
      </>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Confirm review" });
    const ids = describedByIds(checkbox);

    expect(ids).toEqual(expect.arrayContaining([
      "consent-checkbox-description",
      "custom-checkbox-description",
    ]));
    expectUniqueIds(ids);
    expect(checkbox).toHaveAccessibleDescription(/Built-in checkbox description.*Custom checkbox context/);
  });

  it("preserves caller aria-invalid values when FormField has no error", () => {
    render(
      <FormField id="spelling-field" label="Spelling-sensitive field">
        <Input aria-invalid="spelling" />
      </FormField>,
    );

    expect(screen.getByLabelText("Spelling-sensitive field")).toHaveAttribute("aria-invalid", "spelling");
  });

  it("keeps Checkbox and Radio controls label-activating with compact native inputs", async () => {
    const user = userEvent.setup();
    const onRadioChange = vi.fn();

    render(
      <>
        <Checkbox description="Applies to all visible records." label="Select visible rows" />
        <RadioGroup
          description="Choose the preview role."
          legend="Portal role"
          name="portal-role"
          onChange={onRadioChange}
          options={[
            { description: "Patient preview.", label: "Patient", value: "patient" },
            { disabled: true, label: "Provider", value: "provider" },
          ]}
        />
      </>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Select visible rows" });
    expect(checkbox).toHaveClass("choice__input");
    expect(checkbox.closest("label")).toHaveClass("choice");
    expect(checkbox).toHaveAccessibleDescription("Applies to all visible records.");

    await user.click(screen.getByText("Select visible rows"));
    expect(checkbox).toBeChecked();

    const patient = screen.getByRole("radio", { name: "Patient" });
    const provider = screen.getByRole("radio", { name: "Provider" });
    expect(patient).toHaveClass("choice__input");
    expect(patient.closest("label")).toHaveClass("choice");
    expect(patient).toHaveAccessibleDescription("Patient preview.");
    expect(provider).toBeDisabled();

    await user.click(screen.getByText("Patient"));
    expect(onRadioChange).toHaveBeenCalledWith("patient");
  });

  it("keeps password and search end controls compact, labelled, and non-overlapping by contract", async () => {
    const user = userEvent.setup();

    function SearchHarness() {
      const [value, setValue] = useState("lab");
      return (
        <FormField label="Search">
          <Input
            clearLabel="Clear records"
            onChange={(event) => setValue(event.currentTarget.value)}
            onClear={() => setValue("")}
            type="search"
            value={value}
          />
        </FormField>
      );
    }

    render(
      <>
        <FormField label="Password">
          <Input loading loadingLabel="Checking password rules" rightIcon="i" type="password" />
        </FormField>
        <SearchHarness />
      </>,
    );

    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");
    expect(password).toHaveAccessibleDescription("Checking password rules");
    expect(password.closest(".form-control")).toHaveClass("form-control--actions-3");

    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toBeVisible();

    const search = screen.getByRole("searchbox", { name: "Search" });
    expect(search).toHaveValue("lab");
    await user.click(screen.getByRole("button", { name: "Clear records" }));
    expect(search).toHaveValue("");
  });

  it("maps every canonical care status to the required tone", () => {
    render(
      <>
        <StatusBadge status="submitted" />
        <StatusBadge status="pending-review" />
        <StatusBadge status="payment-required" />
        <StatusBadge status="approved" />
        <StatusBadge status="declined" />
        <StatusBadge status="payment-failed" />
      </>,
    );

    expect(screen.getByText("Submitted")).toHaveAttribute("data-tone", "information");
    expect(screen.getByText("Pending Review")).toHaveAttribute("data-tone", "warning");
    expect(screen.getByText("Payment Required")).toHaveAttribute("data-tone", "warning");
    expect(screen.getByText("Payment Required")).not.toHaveAttribute("data-tone", "danger");
    expect(screen.getByText("Approved")).toHaveAttribute("data-tone", "success");
    expect(screen.getByText("Declined")).toHaveAttribute("data-tone", "danger");
    expect(screen.getByText("Payment Failed")).toHaveAttribute("data-tone", "danger");
  });

  it("supports DataTable caption, scoped header cells, sortable headers, and body semantics", async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();

    render(
      <DataTable>
        <DataTableCaption>Care Queue Records</DataTableCaption>
        <DataTableHeader>
          <DataTableRow>
            <SortableHeader direction="ascending" onSort={onSort}>
              Request
            </SortableHeader>
            <DataTableHeaderCell>Owner</DataTableHeaderCell>
          </DataTableRow>
        </DataTableHeader>
        <DataTableBody>
          <DataTableRow>
            <DataTableCell>REQ-1</DataTableCell>
            <DataTableCell>Care team</DataTableCell>
          </DataTableRow>
        </DataTableBody>
      </DataTable>,
    );

    expect(screen.getByText("Care Queue Records").tagName).toBe("CAPTION");
    expect(screen.getByRole("columnheader", { name: /Request/ })).toHaveAttribute("aria-sort", "ascending");
    expect(screen.getByRole("columnheader", { name: "Owner" })).toHaveAttribute("scope", "col");

    await user.click(screen.getByRole("button", { name: /Request/ }));
    expect(onSort).toHaveBeenCalledTimes(1);
  });

  it("traps Dialog focus, wraps Tab/Shift+Tab, closes with Escape, and restores trigger focus", async () => {
    const user = userEvent.setup();

    function DialogHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          <Dialog
            description="Dialog description"
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Dialog Title"
          >
            <Button>First dialog action</Button>
            <Button>Last dialog action</Button>
          </Dialog>
        </>
      );
    }

    render(<DialogHarness />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Dialog Title" });
    expect(dialog).toHaveAccessibleDescription("Dialog description");
    const close = screen.getByRole("button", { name: "Close dialog" });
    const first = screen.getByRole("button", { name: "First dialog action" });
    const last = screen.getByRole("button", { name: "Last dialog action" });
    expect(close).toHaveFocus();

    last.focus();
    await user.keyboard("{Tab}");
    expect(close).toHaveFocus();

    close.focus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(last).toHaveFocus();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("dialog", { name: "Dialog Title" })).not.toBeInTheDocument();
    expect(first).not.toBeInTheDocument();
  });

  it("prevents Dialog Escape dismissal when configured", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Dialog isOpen onClose={onClose} preventEscapeClose title="Protected Dialog">
        <Button>Only action</Button>
      </Dialog>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog", { name: "Protected Dialog" })).toBeInTheDocument();
  });

  it("applies and restores Dialog background isolation", async () => {
    const user = userEvent.setup();

    function DialogIsolationHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <main>Background page content</main>
          <Button onClick={() => setOpen(true)}>Open isolated dialog</Button>
          <Dialog isOpen={open} onClose={() => setOpen(false)} title="Isolated Dialog">
            <Button onClick={() => setOpen(false)}>Finish</Button>
          </Dialog>
        </>
      );
    }

    const { container } = render(<DialogIsolationHarness />);
    const appRoot = container as InertCapableElement;
    await user.click(screen.getByRole("button", { name: "Open isolated dialog" }));

    await waitFor(() => expect(appRoot).toHaveAttribute("aria-hidden", "true"));
    expect(appRoot.inert).toBe(true);

    await user.click(screen.getByRole("button", { name: "Finish" }));
    await waitFor(() => expect(appRoot).not.toHaveAttribute("aria-hidden"));
    expect(appRoot.inert).toBe(false);
  });

  it("traps Drawer focus, names the drawer, closes with Escape, and restores trigger focus", async () => {
    const user = userEvent.setup();

    function DrawerHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open drawer</Button>
          <Drawer
            description="Drawer description"
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Filters"
          >
            <Button>Focusable filter</Button>
          </Drawer>
        </>
      );
    }

    render(<DrawerHarness />);
    const trigger = screen.getByRole("button", { name: "Open drawer" });
    await user.click(trigger);

    const drawer = screen.getByRole("dialog", { name: "Filters" });
    expect(drawer).toHaveAccessibleDescription("Drawer description");
    const close = screen.getByRole("button", { name: "Close drawer" });
    const filter = screen.getByRole("button", { name: "Focusable filter" });
    expect(close).toHaveFocus();

    filter.focus();
    await user.keyboard("{Tab}");
    expect(close).toHaveFocus();

    close.focus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(filter).toHaveFocus();

    await user.keyboard("{Escape}");
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(screen.queryByRole("dialog", { name: "Filters" })).not.toBeInTheDocument();
  });

  it("applies and restores Drawer background isolation", async () => {
    const user = userEvent.setup();

    function DrawerIsolationHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <main>Background drawer content</main>
          <Button onClick={() => setOpen(true)}>Open isolated drawer</Button>
          <Drawer isOpen={open} onClose={() => setOpen(false)} title="Isolated Drawer">
            <Button onClick={() => setOpen(false)}>Apply filters</Button>
          </Drawer>
        </>
      );
    }

    const { container } = render(<DrawerIsolationHarness />);
    const appRoot = container as InertCapableElement;
    await user.click(screen.getByRole("button", { name: "Open isolated drawer" }));

    await waitFor(() => expect(appRoot).toHaveAttribute("aria-hidden", "true"));
    expect(appRoot.inert).toBe(true);

    await user.click(screen.getByRole("button", { name: "Apply filters" }));
    await waitFor(() => expect(appRoot).not.toHaveAttribute("aria-hidden"));
    expect(appRoot.inert).toBe(false);
  });

  it("supports Tabs arrow, Home, End, disabled-tab skipping, relationships, and panels", async () => {
    const user = userEvent.setup();

    render(
      <Tabs
        tabs={[
          { content: "One panel", id: "one", label: "One" },
          { content: "Two panel", disabled: true, id: "two", label: "Two" },
          { content: "Three panel", id: "three", label: "Three" },
        ]}
      />,
    );

    const firstTab = screen.getByRole("tab", { name: "One" });
    const disabledTab = screen.getByRole("tab", { name: "Two" });
    const lastTab = screen.getByRole("tab", { name: "Three" });
    const firstPanelId = firstTab.getAttribute("aria-controls");

    expect(firstTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveAttribute("id", firstPanelId);
    expect(disabledTab).toBeDisabled();

    firstTab.focus();
    await user.keyboard("{ArrowRight}");
    expect(lastTab).toHaveFocus();
    expect(lastTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Three panel")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(firstTab).toHaveFocus();
    expect(firstTab).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{End}");
    expect(lastTab).toHaveFocus();

    await user.keyboard("{Home}");
    expect(firstTab).toHaveFocus();
  });

  it("supports controlled Tabs updates", async () => {
    const user = userEvent.setup();

    function ControlledTabsHarness() {
      const [value, setValue] = useState("one");
      return (
        <>
          <Tabs
            onValueChange={setValue}
            tabs={[
              { content: "One panel", id: "one", label: "One" },
              { content: "Two panel", id: "two", label: "Two" },
            ]}
            value={value}
          />
          <output aria-label="Selected tab">{value}</output>
        </>
      );
    }

    render(<ControlledTabsHarness />);
    await user.click(screen.getByRole("tab", { name: "Two" }));

    expect(screen.getByLabelText("Selected tab")).toHaveTextContent("two");
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Two panel")).toBeInTheDocument();
  });

  it("toggles Switch from the keyboard and associates its label and description", async () => {
    const user = userEvent.setup();

    function SwitchHarness() {
      const [checked, setChecked] = useState(false);
      return (
        <Switch
          checked={checked}
          description="Delivery updates"
          label="Notifications"
          onChange={setChecked}
        />
      );
    }

    render(<SwitchHarness />);
    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveAccessibleDescription("Delivery updates");

    toggle.focus();
    await user.keyboard("{Space}");
    await waitFor(() => expect(toggle).toHaveAttribute("aria-checked", "true"));
  });

  it("prevents disabled Switch activation", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Switch checked={false} disabled label="Notifications" onChange={onChange} />);
    const toggle = screen.getByRole("switch", { name: "Notifications" });

    await user.click(toggle);
    toggle.focus();
    await user.keyboard("{Space}");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders ConfirmationDialog consequence, cancel, safe initial focus, and danger styling", async () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmationDialog
        actionName="delete account"
        confirmLabel="Delete account"
        consequence="This action removes access and cannot be undone."
        isOpen
        onCancel={onCancel}
        onConfirm={onConfirm}
        title="Delete Account?"
        tone="danger"
      />,
    );

    const cancel = screen.getByRole("button", { name: "Cancel" });
    const confirm = screen.getByRole("button", { name: "Delete account" });
    await waitFor(() => expect(cancel).toHaveFocus());

    expect(screen.getByText("This action removes access and cannot be undone.")).toBeVisible();
    expect(confirm).toHaveClass("button--danger");
    await userEvent.click(cancel);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("prevents repeat confirmation and dismissal while ConfirmationDialog is loading", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();

    render(
      <ConfirmationDialog
        actionName="delete account"
        confirmLabel="Delete account"
        consequence="This action removes access and cannot be undone."
        isOpen
        loading
        onCancel={onCancel}
        onConfirm={onConfirm}
        title="Delete Account?"
        tone="danger"
      />,
    );

    const confirm = screen.getByRole("button", { name: "Delete account" });
    expect(confirm).toBeDisabled();
    expect(confirm).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("button", { name: "Close dialog" })).not.toBeInTheDocument();

    await user.click(confirm);
    await user.keyboard("{Escape}");
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("renders Avatar images with accessible names when the image is meaningful", () => {
    render(<Avatar alt="Provider portrait" initials="PP" src="/provider.png" />);

    const image = screen.getByRole("img", { name: "Provider portrait" });
    expect(image).toHaveAttribute("src", "/provider.png");
  });

  it("falls Avatar images back to initials after image load failure", () => {
    const { container } = render(<Avatar alt="Provider portrait" initials="PP" src="/missing-provider.png" />);

    fireEvent.error(screen.getByRole("img", { name: "Provider portrait" }));

    expect(container.querySelectorAll("img")).toHaveLength(0);
    expect(screen.getByText("PP")).toBeVisible();
    expect(screen.getByText("Provider portrait")).toHaveClass("sr-only");
  });

  it("supports decorative Avatar images when an adjacent name labels the identity", () => {
    const { container } = render(
      <div>
        <Avatar decorative initials="EP" src="/example-person.png" />
        <span>Example Person</span>
      </div>,
    );

    expect(container.querySelector("img")).toHaveAttribute("alt", "");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("Example Person")).toBeVisible();
  });

  it("renders CareTimeline caller events with ordered-list, time, description, state text, and aria-current semantics", () => {
    render(
      <CareTimeline
        events={[
          {
            category: "Request",
            dateTime: "2026-07-01T09:00:00-05:00",
            description: (
              <p>
                Caller supplied description with enough length to verify wrapping and semantic rendering.
              </p>
            ),
            id: "submitted",
            state: "complete",
            timestamp: "Jul 1, 2026 at 9:00 AM",
            title: <span>Caller Submitted Request</span>,
          },
          {
            description: "Provider review is underway.",
            id: "review",
            state: "current",
            timestamp: "Today",
            title: "Pending Review",
          },
          {
            id: "upcoming",
            state: "upcoming",
            title: "Payment Required",
          },
          {
            description: "Failed states include visible text and do not rely on red alone.",
            id: "failed",
            state: "failed",
            title: "Payment Failed",
          },
        ]}
      />,
    );

    const list = screen.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    const submittedTime = within(items[0]).getByText("Jul 1, 2026 at 9:00 AM");

    expect(list.tagName).toBe("OL");
    expect(items).toHaveLength(4);
    expect(within(items[0]).getByText("Caller Submitted Request")).toBeVisible();
    expect(submittedTime.tagName).toBe("TIME");
    expect(submittedTime).toHaveAttribute("dateTime", "2026-07-01T09:00:00-05:00");
    expect(within(items[0]).getByText(/enough length to verify wrapping/)).toBeVisible();
    expect(within(items[0]).getByText("State: Complete")).toBeVisible();
    expect(items[1]).toHaveAttribute("aria-current", "step");
    expect(within(items[1]).getByText("State: Current")).toBeVisible();
    expect(within(items[2]).getByText("State: Upcoming")).toBeVisible();
    expect(within(items[3]).getByText("State: Failed")).toBeVisible();
  });

  it("renders PatientContextCard identity with Avatar and supplied server context", () => {
    const { container } = render(
      <PatientContextCard
        patient={{
          age: "Server supplied",
          allergies: "Allergy information supplied by server",
          avatarSrc: "/patient.png",
          conditions: "Condition information supplied by server",
          contactDetails: "Secure message available",
          dateOfBirth: "Server supplied",
          initials: "EP",
          name: "Example Person",
          pharmacy: "Preferred pharmacy supplied by server",
          state: "FL",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Patient Context" })).toBeVisible();
    expect(screen.getByText("Example Person")).toBeVisible();
    expect(container.querySelector(".patient-context img")).toHaveAttribute("alt", "");
    expect(screen.getByText("Secure message available")).toBeVisible();
    expect(screen.getByText("Allergy information supplied by server")).toBeVisible();
    expect(screen.queryByText(/Sensitive data|Missing data/)).not.toBeInTheDocument();
  });

  it("uses a safe PatientContextCard empty state without repetitive missing rows", () => {
    render(<PatientContextCard patient={{}} />);

    expect(screen.getByText("Patient context not provided.")).toBeVisible();
    expect(screen.queryByText(/Sensitive data|Missing data/)).not.toBeInTheDocument();
    expect(screen.queryAllByRole("term")).toHaveLength(0);
  });

  it("does not infer optional PatientContextCard demographic or clinical rows", () => {
    render(<PatientContextCard patient={{ name: "Example Person" }} />);

    expect(screen.getByText("Example Person")).toBeVisible();
    expect(screen.getByText("Additional patient context not provided.")).toBeVisible();
    expect(screen.queryByText(/Pronouns|Demographic context|Allergies|Conditions|Pharmacy|Contact details/)).not.toBeInTheDocument();
  });

  it("displays BillingSummary caller-supplied values without pricing calculations", () => {
    render(
      <BillingSummary
        lineItems={[
          { amount: "Server item A", label: "Resolved service" },
          { amount: "Server item B", label: "Resolved adjustment" },
        ]}
        total="Server total"
      />,
    );

    expect(screen.getByText("Server item A")).toBeVisible();
    expect(screen.getByText("Server item B")).toBeVisible();
    expect(screen.getByText("Server total")).toBeVisible();
    expect(screen.queryByText(/quantity|unit price|platform fee|tax|discount/i)).not.toBeInTheDocument();
  });

  it("models laboratory pre-review copy explicitly for submitted, pending, and reviewed requests", () => {
    render(
      <>
        <CareRequestCard
          providerReviewState="not-reviewed"
          requestId="REQ-1"
          service="laboratory"
          status="submitted"
          submittedDate="Today"
          summary="Lab collection request."
          title="Submitted Lab"
        />
        <CareRequestCard
          providerReviewState="not-reviewed"
          requestId="REQ-2"
          service="laboratory"
          status="pending-review"
          submittedDate="Today"
          summary="Lab collection request."
          title="Pending Lab"
        />
        <CareRequestCard
          providerReviewState="reviewed"
          requestId="REQ-3"
          service="laboratory"
          status="approved"
          submittedDate="Today"
          summary="Provider reviewed lab request."
          title="Reviewed Lab"
        />
      </>,
    );

    expect(screen.getAllByText("No charge until provider review.")).toHaveLength(2);
    expect(within(screen.getByText("Submitted Lab").closest(".care-request-card") as HTMLElement).getByText("No charge until provider review.")).toBeVisible();
    expect(within(screen.getByText("Pending Lab").closest(".care-request-card") as HTMLElement).getByText("No charge until provider review.")).toBeVisible();
    expect(within(screen.getByText("Reviewed Lab").closest(".care-request-card") as HTMLElement).queryByText("No charge until provider review.")).not.toBeInTheDocument();
    expect(screen.queryByText(/estimated|provisional|price range|\$/i)).not.toBeInTheDocument();
  });

  it("keeps payment-required warning, not danger, inside care request cards", () => {
    render(
      <CareRequestCard
        requestId="REQ-4"
        service="consultation"
        status="payment-required"
        submittedDate="Today"
        summary="Illustrative request."
        title="Consultation Request"
      />,
    );

    expect(screen.getByText("Payment Required")).toHaveAttribute("data-tone", "warning");
  });

  it("renders FilterBar in drawer layout with usable labels and disabled Clear all behavior", async () => {
    const user = userEvent.setup();

    function FilterHarness() {
      const [search, setSearch] = useState("");
      const [status, setStatus] = useState("all");
      const activeFilterCount = search || status !== "all" ? 1 : 0;
      return (
        <FilterBar
          activeFilterCount={activeFilterCount}
          layout="drawer"
          onClearAll={() => {
            setSearch("");
            setStatus("all");
          }}
          onOpenFilters={vi.fn()}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          searchValue={search}
          statusOptions={[
            { label: "All statuses", value: "all" },
            { label: "Pending Review", value: "pending-review" },
          ]}
          statusValue={status}
        />
      );
    }

    render(<FilterHarness />);
    const filterBar = screen.getByRole("search");
    expect(filterBar).toHaveClass("filter-bar--drawer");
    expect(screen.getByRole("searchbox", { name: "Search records" })).toBeVisible();
    expect(screen.getByLabelText("Filter by status")).toBeVisible();

    const clearAll = screen.getByRole("button", { name: "Clear all" });
    expect(clearAll).toBeDisabled();

    await user.selectOptions(screen.getByLabelText("Filter by status"), "pending-review");
    expect(clearAll).not.toBeDisabled();

    await user.click(clearAll);
    expect(screen.getByLabelText("Filter by status")).toHaveValue("all");
  });

  it("has no obvious axe violations for representative shared controls", async () => {
    const { container } = render(
      <section aria-labelledby="axe-title">
        <h2 id="axe-title">Axe smoke</h2>
        <FormField description="Use a labelled field." label="Email" required>
          <Input type="email" />
        </FormField>
        <Button>Continue</Button>
        <StatusBadge status="payment-required" />
        <Switch checked={false} description="Delivery updates" label="Notifications" onChange={vi.fn()} />
      </section>,
    );

    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });
});
