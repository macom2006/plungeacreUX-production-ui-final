import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
import { PatientBillingPage } from "../pages/patient/PatientBillingPage";
import { PatientDashboardPage } from "../pages/patient/PatientDashboardPage";
import { PatientSettingsPage } from "../pages/patient/PatientSettingsPage";
import { patientRoutes } from "../lib/routes";

function renderRoute(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

function expectRobots(content: "index, follow" | "noindex, nofollow") {
  expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", content);
}

function normalizeVisibleText(element: Element) {
  return element.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function isTitleCase(text: string) {
  return text.split(/\s+/).filter(Boolean).every((word) => {
    const cleaned = word.replace(/^[([{"']+|[)\].,;:!?"']+$/g, "");
    if (!/[A-Za-z]/.test(cleaned)) return true;
    if (/^[A-Z0-9]+$/.test(cleaned)) return true;
    if (/[a-z][A-Z]/.test(cleaned)) return false;

    return /^[A-Z]/.test(cleaned) || ["and", "for", "of", "to", "with"].includes(cleaned);
  });
}

function expectBadgeTone(label: string, tone: string) {
  const badge = screen.getAllByText(label)
    .map((element) => element.closest(".status-badge"))
    .find(Boolean);

  expect(badge).toHaveAttribute("data-tone", tone);
}

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("patient portal routing", () => {
  it.each([
    [patientRoutes.overview, "Your Care, Clearly Organized"],
    [patientRoutes.careRequests, "Care Requests"],
    [`${patientRoutes.careRequests}/REQ-2026-1041`, "Care Request Detail"],
    [patientRoutes.messages, "Messages"],
    [patientRoutes.myChart, "My Chart"],
    [patientRoutes.billing, "Billing & Payments"],
    [patientRoutes.settings, "Settings"],
  ])("renders %s inside PortalShell without PublicNav", (route, heading) => {
    renderRoute(route);

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: "Portal navigation" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Primary navigation" })).not.toBeInTheDocument();
    expectRobots("noindex, nofollow");
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
  });

  it("marks active patient navigation and handles detail route matching", () => {
    renderRoute(`${patientRoutes.careRequests}/REQ-2026-1041`);

    const portalNav = screen.getByRole("navigation", { name: "Portal navigation" });

    expect(within(portalNav).getByRole("link", { name: "Care Requests" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(portalNav).queryByRole("link", { name: "Video Visits" })).not.toBeInTheDocument();
    expect(within(portalNav).queryByRole("link", { name: "Documents" })).not.toBeInTheDocument();
  });

  it("renders unknown patient paths as a patient not-found state", () => {
    renderRoute("/patient/unknown-area");

    expect(screen.getByRole("heading", { level: 1, name: "Patient Page Not Found" })).toBeVisible();
    expect(screen.getByText("The requested patient portal page is not available.")).toBeVisible();
    expect(screen.queryByRole("navigation", { name: "Primary navigation" })).not.toBeInTheDocument();
    expectRobots("noindex, nofollow");
  });
});

describe("patient dashboard", () => {
  it("renders an action-oriented dashboard without removed standalone sections", () => {
    const { container } = renderRoute(patientRoutes.overview);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Start Care" })).toHaveAttribute("href", "/start-care");
    expect(screen.getByRole("link", { name: "View Care Requests" })).toHaveAttribute(
      "href",
      patientRoutes.careRequests,
    );
    expect(screen.getByRole("heading", { name: "Action Required" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Active Care Request" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Recent Updates" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Messages Preview" })).toBeVisible();

    ["Upcoming", "Current Medications", "Medical History", "Documents", "Health Snapshot", "Billing Summary"]
      .forEach((removedHeading) => {
        expect(container.textContent).not.toContain(removedHeading);
      });
  });

  it("uses warning tone for Payment Required and supports an empty dashboard state", () => {
    renderRoute(patientRoutes.overview);

    expectBadgeTone("Payment Required", "warning");

    cleanup();
    render(<PatientDashboardPage startCareHref="/start-care" state="empty" />);

    expect(screen.getByRole("heading", { name: "No Care Requests Yet" })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "Action Required" })).not.toBeInTheDocument();
  });
});

describe("care requests", () => {
  it("renders canonical statuses, table semantics, mobile records, and pagination controls", async () => {
    const user = userEvent.setup();
    renderRoute(patientRoutes.careRequests);

    ["Submitted", "Pending Review", "Payment Required", "Approved", "Declined"].forEach((status) => {
      expect(screen.getAllByText(status).length).toBeGreaterThan(0);
    });

    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getAllByText("Payment Failed").length).toBeGreaterThan(0);

    expect(screen.getByRole("table", { name: "Care Request Records" })).toBeInTheDocument();
    expect(screen.getAllByRole("columnheader").map(normalizeVisibleText)).toEqual([
      "Request",
      "Submitted",
      "Provider",
      "Status",
      "Last Updated",
      "Action",
    ]);
    expect(screen.getByLabelText("Mobile care request records")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("searches by title or identifier and filters by status", async () => {
    const user = userEvent.setup();
    renderRoute(patientRoutes.careRequests);

    await user.type(screen.getByLabelText("Search by request title or identifier"), "REQ-2026-1041");

    expect(screen.getAllByText("Routine Lab Review Request").length).toBeGreaterThan(0);
    expect(screen.queryByText("General Wellness Request")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Filter by status"), {
      target: { value: "payment-failed" },
    });

    expect(screen.getAllByRole("heading", { name: "No Care Requests Found" }).length).toBeGreaterThan(0);
  });
});

describe("care request detail safeguards", () => {
  it("renders a full record page with timeline and exact laboratory safeguard copy", () => {
    const { container } = renderRoute(`${patientRoutes.careRequests}/REQ-2026-1041`);

    expect(screen.getByRole("heading", { level: 2, name: "Routine Lab Review Request" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Timeline" })).toBeVisible();
    expect(screen.getByText("Request Submitted")).toBeVisible();
    expect(screen.getAllByText("No charge until provider review.").length).toBeGreaterThan(0);
    expect(container.textContent).not.toMatch(/estimated laboratory pricing/i);
    expect(container.textContent).not.toMatch(/provisional total/i);
  });
});

describe("messages and My Chart", () => {
  it("renders a read-only message center with semantic timestamps and unread state", () => {
    renderRoute(patientRoutes.messages);

    expect(screen.getByRole("heading", { name: "Read-Only Message Center" })).toBeVisible();
    expect(screen.getByText("Message Sending Not Available")).toBeVisible();
    expectBadgeTone("Unread", "information");
    expect(document.querySelectorAll("time").length).toBeGreaterThan(0);
    expect(document.querySelector("textarea")).not.toBeInTheDocument();
  });

  it("shows released laboratory results and excludes unreleased results from My Chart", () => {
    renderRoute(patientRoutes.myChart);

    expect(screen.getAllByText("Released Laboratory Result").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Released to patient by the care team.").length).toBeGreaterThan(0);
    expect(screen.queryByText("Unreleased Laboratory Result")).not.toBeInTheDocument();
    expect(screen.queryByText("Not available in the patient portal until release.")).not.toBeInTheDocument();
  });
});

describe("billing and settings safeguards", () => {
  it("renders supplied billing values without payment processing controls", () => {
    const { container } = renderRoute(patientRoutes.billing);

    expect(screen.getAllByText("$65.00").length).toBeGreaterThan(0);
    expectBadgeTone("Payment Required", "warning");
    expectBadgeTone("Payment Failed", "danger");
    expect(container.querySelector("input")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/Stripe|checkout|card entry|discount|coupon|tax|refund/i);
  });

  it("uses associated settings labels and announces save confirmation", async () => {
    const user = userEvent.setup();
    render(<PatientSettingsPage />);

    expect(screen.getByLabelText("Display name")).toHaveValue("Parker Morgan");
    expect(screen.getByLabelText("Email address")).toHaveValue("parker.patient@example.invalid");

    await user.click(screen.getByRole("button", { name: "Save Preferences" }));

    expect(screen.getByRole("status")).toHaveTextContent("Preferences Saved");
  });

  it("supports billing and settings empty and saved states", () => {
    render(<PatientBillingPage state="empty" />);
    expect(screen.getByRole("heading", { name: "No Billing Records" })).toBeVisible();

    cleanup();
    render(<PatientSettingsPage state="saved" />);
    expect(screen.getByRole("status")).toHaveTextContent("Preferences Saved");
  });
});

describe("patient typography and accessibility", () => {
  it.each([
    patientRoutes.overview,
    patientRoutes.careRequests,
    `${patientRoutes.careRequests}/REQ-2026-1041`,
    patientRoutes.messages,
    patientRoutes.myChart,
    patientRoutes.billing,
    patientRoutes.settings,
  ])("keeps visible patient headings and table headers in Title Case on %s", (route) => {
    renderRoute(route);

    const titleElements = [
      ...screen.getAllByRole("heading"),
      ...document.querySelectorAll(".data-table__caption, .data-table th"),
    ];

    titleElements
      .map(normalizeVisibleText)
      .filter(Boolean)
      .forEach((text) => expect(isTitleCase(text), `"${text}" should use Title Case`).toBe(true));
  });

  it("keeps patient CSS on typography tokens", () => {
    const css = readFileSync(join(cwd(), "src/pages/patient/PatientPortal.css"), "utf8");

    expect(css).toContain("font-family: var(--font-heading)");
    expect(css).toContain("font-family: var(--font-body)");
    expect(css).toContain("font-weight: var(--font-weight-semibold)");
    expect(css).toContain("font-weight: var(--font-weight-regular)");
    for (const declaration of css.matchAll(/font-family:\s*([^;]+);/g)) {
      expect(declaration[1]).toMatch(/^var\(--font-(?:body|heading)\)$/);
    }
    for (const declaration of css.matchAll(/font-weight:\s*([^;]+);/g)) {
      expect(declaration[1]).toMatch(/^var\(--font-weight-(?:regular|medium|semibold|bold|extrabold)\)$/);
    }
    expect(css).not.toMatch(/text-transform\s*:/);
  });

  it.each([
    patientRoutes.overview,
    patientRoutes.careRequests,
    `${patientRoutes.careRequests}/REQ-2026-1041`,
    patientRoutes.messages,
    patientRoutes.myChart,
    patientRoutes.billing,
    patientRoutes.settings,
  ])("has no obvious axe violations on %s", async (route) => {
    renderRoute(route);

    const results = await axe(document.body);

    expect(results.violations).toHaveLength(0);
  });
});
