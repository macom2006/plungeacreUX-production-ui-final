import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import {
  BillingSummary,
  CareRequestCard,
} from "../components/healthcare";
import {
  Button,
  ConfirmationDialog,
  Dialog,
  Drawer,
  FormField,
  Input,
  StatusBadge,
  Switch,
  Tabs,
} from "../components/ui";

describe("Phase 2 shared UI behavior", () => {
  it("keeps Button loading disabled while preserving its accessible label", () => {
    render(
      <Button loading loadingLabel="Saving request">
        Submit request
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Submit request" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAccessibleDescription("Saving request");
  });

  it("associates FormField labels, descriptions, and errors with the input", () => {
    render(
      <FormField description="Use the account email." error="Email is required." label="Email" required>
        <Input type="email" />
      </FormField>,
    );

    const label = screen.getByText("Email").closest("label");
    const input = document.getElementById(label?.getAttribute("for") ?? "");
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(/Use the account email\..*Email is required\./);
  });

  it("maps approved status vocabulary to the required tones", () => {
    render(
      <>
        <StatusBadge status="payment-required" />
        <StatusBadge status="payment-failed" />
      </>,
    );

    expect(screen.getByText("Payment required")).toHaveAttribute("data-tone", "warning");
    expect(screen.getByText("Payment failed")).toHaveAttribute("data-tone", "danger");
  });

  it("traps dialog focus and restores focus to the trigger", async () => {
    const user = userEvent.setup();

    function DialogHarness() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Open dialog</Button>
          <Dialog isOpen={open} onClose={() => setOpen(false)} title="Dialog title">
            <Button onClick={() => setOpen(false)}>Done</Button>
          </Dialog>
        </>
      );
    }

    render(<DialogHarness />);
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Dialog title" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("dismisses Drawer with Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Drawer isOpen onClose={onClose} title="Filters">
        <Button>Focusable filter</Button>
      </Drawer>,
    );

    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("moves Tabs selection with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        tabs={[
          { content: "One panel", id: "one", label: "One" },
          { content: "Two panel", id: "two", label: "Two" },
        ]}
      />,
    );

    const firstTab = screen.getByRole("tab", { name: "One" });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Two panel")).toBeInTheDocument();
  });

  it("toggles Switch from the keyboard", () => {
    const onChange = vi.fn();

    render(<Switch checked={false} label="Notifications" onChange={onChange} />);
    const toggle = screen.getByRole("switch", { name: "Notifications" });
    toggle.focus();
    fireEvent.keyDown(toggle, { key: " " });

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("renders ConfirmationDialog consequence copy and explicit destructive action", () => {
    render(
      <ConfirmationDialog
        actionName="delete account"
        confirmLabel="Delete account"
        consequence="This action removes access and cannot be undone."
        isOpen
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        title="Delete account?"
        tone="danger"
      />,
    );

    expect(screen.getByText("This action removes access and cannot be undone.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Delete account" })).toBeVisible();
  });

  it("displays BillingSummary values supplied by the caller without calculating totals", () => {
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
  });

  it("shows laboratory no-charge copy before provider review", () => {
    render(
      <CareRequestCard
        requestId="REQ-1"
        service="laboratory"
        status="pending-review"
        submittedDate="Today"
        summary="Illustrative request."
        title="Lab request"
      />,
    );

    expect(screen.getByText("No charge until provider review.")).toBeVisible();
  });

  it("keeps payment-required warning, not danger", () => {
    render(
      <CareRequestCard
        requestId="REQ-2"
        service="consultation"
        status="payment-required"
        submittedDate="Today"
        summary="Illustrative request."
        title="Consultation request"
      />,
    );

    expect(screen.getByText("Payment required")).toHaveAttribute("data-tone", "warning");
  });
});
