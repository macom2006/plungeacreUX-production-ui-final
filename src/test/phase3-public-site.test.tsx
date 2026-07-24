import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
import { faqItems, pricingItems } from "../lib/publicContent";
import { developmentRoutes, publicRoutes } from "../lib/routes";

type InertCapableElement = HTMLElement & { inert: boolean };

function renderRoute(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

afterEach(() => {
  document.body.style.overflow = "";
});

describe("Phase 3 public routing and layout separation", () => {
  it.each([
    [publicRoutes.home, "Modern care, made simple."],
    [publicRoutes.services, "Care request support without unsupported guarantees"],
    [publicRoutes.forProviders, "Provider participation, presented clearly"],
    [publicRoutes.pricing, "Clear pricing timing, no browser-side calculations"],
    [publicRoutes.faq, "Questions about Plunge Care"],
  ])("renders the public route %s with PublicNav and without PortalShell", (route, heading) => {
    renderRoute(route);

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Portal navigation" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Signed in account")).not.toBeInTheDocument();
  });

  it("renders the production homepage at root instead of the foundation preview", () => {
    const { container } = renderRoute(publicRoutes.home);

    expect(screen.getByRole("heading", { level: 1, name: "Modern care, made simple." })).toBeVisible();
    expect(screen.queryByText("Shared shell, tokens, and primitives")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/\$\d/);
  });

  it("keeps development preview routes accessible but out of public navigation", () => {
    renderRoute(developmentRoutes.foundation);
    expect(screen.getByRole("heading", { name: "Shared shell, tokens, and primitives" })).toBeVisible();
    expect(screen.queryByRole("link", { name: /foundation/i })).not.toBeInTheDocument();
  });

  it("keeps PublicNav out of portal preview routes", () => {
    renderRoute(developmentRoutes.foundationPortal);

    expect(screen.getByRole("heading", { level: 1, name: "Portal shell preview" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Portal navigation" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Primary navigation" })).not.toBeInTheDocument();
  });

  it("renders unknown routes as a public not-found page", () => {
    renderRoute("/missing-public-page");

    expect(screen.getByRole("heading", { level: 1, name: "We could not find that page." })).toBeVisible();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", publicRoutes.home);
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
  });

  it("updates document title, description, and canonical metadata for route changes", () => {
    renderRoute(publicRoutes.pricing);

    expect(document.title).toBe("Pricing | Plunge Care");
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      expect.stringContaining("pricing principles"),
    );
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${window.location.origin}${publicRoutes.pricing}`,
    );
  });
});

describe("Phase 3 public navigation", () => {
  it("marks the active desktop navigation link with aria-current", () => {
    renderRoute(publicRoutes.pricing);

    const primaryNav = screen.getByRole("navigation", { name: "Primary navigation" });
    expect(within(primaryNav).getByRole("link", { name: "Pricing" })).toHaveAttribute("aria-current", "page");
    expect(within(primaryNav).getByRole("link", { name: "Services" })).not.toHaveAttribute("aria-current");
  });

  it("opens an accessible mobile drawer, traps focus, restores focus, and isolates background content", async () => {
    const user = userEvent.setup();
    const { container } = renderRoute(publicRoutes.home);
    const appRoot = container as InertCapableElement;

    const trigger = screen.getByRole("button", { name: "Menu" });
    await user.click(trigger);

    const drawer = screen.getByRole("dialog", { name: "Menu" });
    expect(drawer).toHaveAccessibleDescription(/Clinical and payment workflows are not available/);
    expect(screen.getByRole("button", { name: "Close drawer" })).toHaveFocus();
    await waitFor(() => expect(appRoot).toHaveAttribute("aria-hidden", "true"));
    expect(appRoot.inert).toBe(true);

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
    expect(appRoot).not.toHaveAttribute("aria-hidden");
    expect(appRoot.inert).toBe(false);
  });

  it("closes the mobile drawer after selecting a route", async () => {
    const user = userEvent.setup();
    renderRoute(publicRoutes.home);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const drawer = screen.getByRole("dialog", { name: "Menu" });
    const servicesLink = within(drawer).getByRole("link", { name: "Services" });
    servicesLink.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(servicesLink);

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Menu" })).not.toBeInTheDocument());
  });

  it("has no obvious axe violations while mobile navigation is open", async () => {
    const user = userEvent.setup();
    renderRoute(publicRoutes.home);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const results = await axe(document.body);

    expect(results.violations).toHaveLength(0);
  });
});

describe("Phase 3 public page safeguards", () => {
  it("renders approved service sections with clinical-appropriateness language and no guarantees", () => {
    const { container } = renderRoute(publicRoutes.services);

    expect(screen.getByRole("heading", { name: "What Plunge Care can organize" })).toBeVisible();
    expect(screen.getByText(/Provider review determines clinical appropriateness/)).toBeVisible();
    expect(container.textContent).not.toMatch(/guaranteed prescription/i);
    expect(container.textContent).not.toMatch(/guaranteed treatment/i);
    expect(container.querySelector("form")).not.toBeInTheDocument();
  });

  it("keeps the provider page public and free of provider workflow controls", () => {
    const { container } = renderRoute(publicRoutes.forProviders);

    expect(screen.getByRole("heading", { name: "A marketplace model with restrained expectations" })).toBeVisible();
    expect(screen.queryByRole("navigation", { name: "Portal navigation" })).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/guaranteed income/i);
    expect(container.textContent).not.toMatch(/submit credentials/i);
    expect(container.querySelector("form")).not.toBeInTheDocument();
  });

  it("displays approved pricing values without inputs, calculators, or estimated laboratory pricing", () => {
    const { container } = renderRoute(publicRoutes.pricing);

    pricingItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeVisible();
      expect(screen.getAllByText(item.value).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText("No charge until provider review.").length).toBeGreaterThan(0);
    const paymentRequiredBadges = screen.getAllByText("Payment required");
    expect(paymentRequiredBadges.some((badge) => badge.getAttribute("data-tone") === "warning")).toBe(true);
    expect(paymentRequiredBadges.every((badge) => badge.getAttribute("data-tone") !== "danger")).toBe(true);
    expect(container.querySelector("input")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/quantity/i);
    expect(container.textContent).not.toMatch(/unit price/i);
    expect(container.textContent).not.toMatch(/From \$45/i);
  });
});

describe("Phase 3 FAQ and footer semantics", () => {
  it("renders FAQ triggers as buttons with unique panel relationships and keyboard activation", async () => {
    const user = userEvent.setup();
    renderRoute(publicRoutes.faq);

    const firstQuestion = faqItems[0];
    const trigger = screen.getByRole("button", { name: firstQuestion.question });
    const controls = trigger.getAttribute("aria-controls");
    const panel = controls ? document.getElementById(controls) : null;
    const allControls = screen
      .getAllByRole("button")
      .map((button) => button.getAttribute("aria-controls"))
      .filter((value): value is string => Boolean(value));

    expect(new Set(allControls).size).toBe(allControls.length);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(panel).toHaveAttribute("hidden");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(panel).not.toHaveAttribute("hidden");
    expect(panel).toHaveTextContent(firstQuestion.answer);
  });

  it("renders a semantic footer with distinctly labelled navigation groups", () => {
    renderRoute(publicRoutes.home);

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("navigation", { name: "Public pages" })).toBeInTheDocument();
    expect(within(footer).getByRole("navigation", { name: "Patient links" })).toBeInTheDocument();
    expect(within(footer).getByRole("navigation", { name: "Provider links" })).toBeInTheDocument();
    expect(within(footer).getByRole("navigation", { name: "Support links" })).toBeInTheDocument();
    expect(within(footer).getByRole("link", { name: "Start care" })).toHaveAttribute("href", "/start-care");
  });

  it.each([publicRoutes.home, publicRoutes.services, publicRoutes.pricing, publicRoutes.faq])(
    "has no obvious axe violations for %s",
    async (route) => {
      const { container } = renderRoute(route);
      const results = await axe(container);

      expect(results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.html),
      }))).toEqual([]);
    },
  );
});
