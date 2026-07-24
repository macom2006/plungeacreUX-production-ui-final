import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
import { faqCategories, faqItems, pricingItems } from "../lib/publicContent";
import { developmentRoutes, publicRoutes, temporaryRoutes } from "../lib/routes";

type InertCapableElement = HTMLElement & { inert: boolean };

const marketingRoutes = [
  publicRoutes.home,
  publicRoutes.services,
  publicRoutes.forProviders,
  publicRoutes.pricing,
  publicRoutes.faq,
] as const;

const temporaryPublicRoutes = [
  temporaryRoutes.startCare,
  temporaryRoutes.signIn,
] as const;

const prohibitedProductionTerms = [
  /Phase\s*3/i,
  /AGENTS\.md/i,
  /browser-side/i,
  /pricing resolver/i,
  /out of scope/i,
  /shared UI/i,
  /portal shell/i,
  /later phase/i,
  /future workflow/i,
  /public site does not implement/i,
];

function renderRoute(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

function expectRobots(content: "index, follow" | "noindex, nofollow") {
  expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", content);
}

afterEach(() => {
  document.body.style.overflow = "";
});

describe("public routing and layout separation", () => {
  it.each([
    [publicRoutes.home, "Modern Telehealth Care, Made Simple."],
    [publicRoutes.services, "Online care that starts with provider review"],
    [publicRoutes.forProviders, "Provider participation, presented clearly"],
    [publicRoutes.pricing, "Clear pricing timing before payment"],
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

    expect(screen.getByRole("heading", { level: 1, name: "Modern Telehealth Care, Made Simple." })).toBeVisible();
    expect(screen.queryByText("Shared shell, tokens, and primitives")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/\$\d/);
  });

  it("keeps development preview routes accessible but out of public navigation", () => {
    renderRoute(developmentRoutes.foundation);

    expect(screen.getByRole("heading", { name: "Shared shell, tokens, and primitives" })).toBeVisible();
    expect(screen.queryByRole("link", { name: /foundation/i })).not.toBeInTheDocument();
    expectRobots("noindex, nofollow");
  });

  it("keeps PublicNav out of portal preview routes", () => {
    renderRoute(developmentRoutes.foundationPortal);

    expect(screen.getByRole("heading", { level: 1, name: "Portal shell preview" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Portal navigation" })).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Primary navigation" })).not.toBeInTheDocument();
    expectRobots("noindex, nofollow");
  });

  it("renders unknown routes as a public not-found page with noindex metadata", () => {
    renderRoute("/missing-public-page");

    expect(screen.getByRole("heading", { level: 1, name: "We could not find that page." })).toBeVisible();
    expect(screen.getByRole("link", { name: "Go home" })).toHaveAttribute("href", publicRoutes.home);
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeInTheDocument();
    expectRobots("noindex, nofollow");
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
  });

  it("updates document title, description, robots, and canonical metadata for indexable routes", () => {
    renderRoute(publicRoutes.pricing);

    expect(document.title).toBe("Pricing | Plunge Care");
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      "content",
      expect.stringContaining("pricing timing"),
    );
    expectRobots("index, follow");
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${window.location.origin}${publicRoutes.pricing}`,
    );
  });
});

describe("public navigation", () => {
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
    expect(drawer).toHaveAccessibleDescription(/Navigation links for Plunge Care/);
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

  it("uses the approved logo asset in the public nav and footer", () => {
    renderRoute(publicRoutes.home);

    const logos = document.querySelectorAll<HTMLImageElement>(
      "img.public-nav__mark, img.public-footer__mark",
    );

    expect(logos).toHaveLength(2);
    logos.forEach((logo) => {
      expect(logo.getAttribute("src")).toMatch(/plunge-care-logo\.png/);
      expect(logo).toHaveAttribute("alt", "");
      expect(logo).toHaveAttribute("aria-hidden", "true");
    });
    expect(screen.getAllByRole("link", { name: "Plunge Care home" }).length).toBeGreaterThan(0);
  });

  it("has no obvious axe violations while mobile navigation is open", async () => {
    const user = userEvent.setup();
    renderRoute(publicRoutes.home);

    await user.click(screen.getByRole("button", { name: "Menu" }));
    const results = await axe(document.body);

    expect(results.violations).toHaveLength(0);
  });
});

describe("public content safeguards", () => {
  it.each([...marketingRoutes, ...temporaryPublicRoutes])(
    "contains no prohibited internal terminology on %s",
    (route) => {
      const { container } = renderRoute(route);
      const content = container.textContent ?? "";

      prohibitedProductionTerms.forEach((term) => {
        expect(content).not.toMatch(term);
      });
    },
  );

  it("renders approved service sections with clinical-appropriateness language and no guarantees", () => {
    const { container } = renderRoute(publicRoutes.services);

    expect(screen.getByRole("heading", { name: "Care paths designed for clear next steps" })).toBeVisible();
    expect(screen.getByText(/A provider determines what care, if any, is appropriate/)).toBeVisible();
    expect(container.textContent).not.toMatch(/guaranteed prescription/i);
    expect(container.textContent).not.toMatch(/guaranteed treatment/i);
    expect(container.querySelector("form")).not.toBeInTheDocument();
  });

  it("keeps the provider page public and free of provider workflow controls", () => {
    const { container } = renderRoute(publicRoutes.forProviders);

    expect(screen.getByRole("heading", { name: "A care marketplace for licensed providers" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Access provider area" })).toHaveAttribute("href", "/sign-in");
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
    expect(container.querySelector("input")).not.toBeInTheDocument();
    expect(container.textContent).not.toMatch(/quantity/i);
    expect(container.textContent).not.toMatch(/unit price/i);
    expect(container.textContent).not.toMatch(/From \$45/i);
  });

  it.each([
    [temporaryRoutes.startCare, "Start care access is being prepared."],
    [temporaryRoutes.signIn, "Secure sign-in is being prepared."],
  ])("renders %s as an intentional temporary page", (route, heading) => {
    const { container } = renderRoute(route);

    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    expect(screen.queryByRole("heading", { name: "We could not find that page." })).not.toBeInTheDocument();
    expect(container.querySelector("form")).not.toBeInTheDocument();
    expectRobots("noindex, nofollow");
    expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
  });
});

describe("FAQ and footer semantics", () => {
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

  it("uses lowercase hyphenated FAQ category IDs", () => {
    renderRoute(publicRoutes.faq);

    faqCategories.forEach((category) => {
      expect(category.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(document.getElementById(`faq-category-${category.id}`)).toBeInTheDocument();
      expect(document.getElementById(`faq-category-${category.id}`)?.id).not.toMatch(/\s/);
    });
  });

  it("renders a production footer with distinctly labelled navigation groups", () => {
    const { container } = renderRoute(publicRoutes.home);

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByRole("navigation", { name: "Site pages" })).toBeInTheDocument();
    expect(within(footer).getByRole("navigation", { name: "Patient links" })).toBeInTheDocument();
    expect(within(footer).getByRole("navigation", { name: "Provider links" })).toBeInTheDocument();
    expect(within(footer).getByRole("navigation", { name: "Support links" })).toBeInTheDocument();
    expect(within(footer).getByRole("link", { name: "Start care" })).toHaveAttribute("href", "/start-care");
    expect(container.textContent).not.toMatch(/Future destination/i);
    expect(container.textContent).not.toMatch(/Public website foundation/i);
  });

  it.each([...marketingRoutes, ...temporaryPublicRoutes, "/missing-public-page"])(
    "has exactly one h1 on %s",
    (route) => {
      renderRoute(route);

      expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    },
  );

  it.each([...marketingRoutes, ...temporaryPublicRoutes])(
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

describe("robots metadata safeguards", () => {
  it.each(marketingRoutes)("allows indexing for completed marketing route %s", (route) => {
    renderRoute(route);

    expectRobots("index, follow");
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${window.location.origin}${route}`,
    );
  });

  it.each([...temporaryPublicRoutes, ...Object.values(developmentRoutes)])(
    "marks temporary and development route %s as noindex",
    (route) => {
      renderRoute(route);

      expectRobots("noindex, nofollow");
      expect(document.head.querySelector('link[rel="canonical"]')).not.toBeInTheDocument();
    },
  );
});
