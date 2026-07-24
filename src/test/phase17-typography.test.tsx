import { cleanup, render, screen } from "@testing-library/react";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { cwd } from "node:process";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";
import { developmentRoutes, publicRoutes, temporaryRoutes } from "../lib/routes";

const workspaceRoot = cwd();
const sourceRoot = join(workspaceRoot, "src");

const routePaths = [
  publicRoutes.home,
  publicRoutes.services,
  publicRoutes.forProviders,
  publicRoutes.pricing,
  publicRoutes.faq,
  temporaryRoutes.startCare,
  temporaryRoutes.signIn,
  developmentRoutes.foundation,
  developmentRoutes.foundationComponents,
  developmentRoutes.foundationPortal,
] as const;

const productionRoutePaths = [
  publicRoutes.home,
  publicRoutes.services,
  publicRoutes.forProviders,
  publicRoutes.pricing,
  publicRoutes.faq,
  temporaryRoutes.startCare,
  temporaryRoutes.signIn,
] as const;

const minorWords = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "before",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "nor",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

function readProjectFile(pathname: string) {
  return readFileSync(join(workspaceRoot, pathname), "utf8");
}

function collectCssFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const pathname = join(directory, entry);
    const stats = statSync(pathname);

    if (stats.isDirectory()) return collectCssFiles(pathname);
    return pathname.endsWith(".css") ? [pathname] : [];
  });
}

function collectAppStyleSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry) => {
    const pathname = join(directory, entry);
    const stats = statSync(pathname);

    if (stats.isDirectory()) {
      if (entry === "test") return [];
      return collectAppStyleSourceFiles(pathname);
    }

    return /\.(css|tsx)$/.test(pathname) ? [pathname] : [];
  });
}

function extractCssRule(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);

  expect(start, `Missing CSS selector ${selector}`).toBeGreaterThanOrEqual(0);

  const ruleStart = css.indexOf("{", start);
  const ruleEnd = css.indexOf("}", ruleStart);

  return css.slice(ruleStart + 1, ruleEnd);
}

function renderRoute(pathname: string) {
  window.history.pushState({}, "", pathname);
  return render(<App />);
}

function normalizeVisibleText(element: Element) {
  return element.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function collectTextNodes(element: HTMLElement) {
  const texts: string[] = [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const text = node.textContent?.replace(/\s+/g, " ").trim();

    if (text) texts.push(text);
    node = walker.nextNode();
  }

  return texts;
}

function isTitleCase(text: string) {
  const words = text.split(/\s+/).filter(Boolean);

  return words.every((word, wordIndex) => {
    const strippedWord = word.replace(/^[([{"']+|[)\].,;:!?"']+$/g, "");
    const parts = strippedWord.split(/[-/]/).filter(Boolean);

    return parts.every((part) => {
      if (!/[A-Za-z]/.test(part)) return true;
      if (/^[A-Z0-9]+$/.test(part)) return true;
      if (/[a-z][A-Z]/.test(part)) return false;

      const lower = part.toLowerCase();
      const isMinorWord = minorWords.has(lower);
      const isFirstOrLastWord = wordIndex === 0 || wordIndex === words.length - 1;

      if (isMinorWord && !isFirstOrLastWord) return part === lower || /^[A-Z]/.test(part);

      return /^[A-Z]/.test(part);
    });
  });
}

function expectTitleCase(text: string) {
  expect(isTitleCase(text), `"${text}" should use Title Case`).toBe(true);
}

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("locked typography contract", () => {
  it("loads only the approved Sora and Inter font weights", () => {
    const packageJson = JSON.parse(readProjectFile("package.json")) as {
      dependencies?: Record<string, string>;
    };
    const main = readProjectFile("src/main.tsx");

    expect(packageJson.dependencies?.["@fontsource/inter"]).toBeDefined();
    expect(packageJson.dependencies?.["@fontsource/sora"]).toBeDefined();
    expect(main).toContain('@fontsource/inter/400.css');
    expect(main).toContain('@fontsource/inter/500.css');
    expect(main).toContain('@fontsource/inter/600.css');
    expect(main).toContain('@fontsource/sora/600.css');
    expect(main).toContain('@fontsource/sora/700.css');
    expect(main).toContain('@fontsource/sora/800.css');
    expect(main).not.toMatch(/@fontsource\/inter\/(?:100|200|300|700|800|900)\.css/);
    expect(main).not.toMatch(/@fontsource\/sora\/(?:100|200|300|400|500|900)\.css/);
  });

  it("defines the shared typography tokens", () => {
    const tokens = readProjectFile("src/styles/tokens.css");

    expect(tokens).toContain("--font-heading: Sora, Inter, system-ui, sans-serif;");
    expect(tokens).toContain('--font-body: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;');
    expect(tokens).toContain("--font-weight-regular: 400;");
    expect(tokens).toContain("--font-weight-medium: 500;");
    expect(tokens).toContain("--font-weight-semibold: 600;");
    expect(tokens).toContain("--font-weight-bold: 700;");
    expect(tokens).toContain("--font-weight-extrabold: 800;");
  });

  it("keeps source styles on typography tokens with no forced uppercase or letter spacing", () => {
    const cssFiles = collectCssFiles(sourceRoot);

    cssFiles.forEach((file) => {
      const css = readFileSync(file, "utf8");
      const displayPath = relative(workspaceRoot, file);

      expect(css, `${displayPath} should not force text transforms`).not.toMatch(/text-transform\s*:/);
      expect(css, `${displayPath} should not use tracking overrides`).not.toMatch(/letter-spacing\s*:/);

      for (const declaration of css.matchAll(/^\s*font-family:\s*([^;]+);/gm)) {
        expect(declaration[1], `${displayPath} should use font family tokens`).toMatch(
          /^var\(--font-(?:body|heading|family-base)\)$/,
        );
      }

      for (const declaration of css.matchAll(/^\s*font-weight:\s*([^;]+);/gm)) {
        expect(declaration[1], `${displayPath} should use font weight tokens`).toMatch(
          /^var\(--font-weight-(?:regular|medium|semibold|bold|extrabold)\)$/,
        );
      }
    });
  });

  it("assigns Sora to table/card titles and Inter to table headers", () => {
    const dataDisplay = readProjectFile("src/components/ui/DataDisplay.css");
    const card = readProjectFile("src/components/ui/Card.css");

    expect(extractCssRule(dataDisplay, ".data-table__caption")).toContain("font-family: var(--font-heading)");
    expect(extractCssRule(dataDisplay, ".data-table th")).toContain("font-family: var(--font-body)");
    expect(extractCssRule(dataDisplay, ".data-table th")).toContain("font-weight: var(--font-weight-semibold)");
    expect(extractCssRule(card, ".card__title")).toContain("font-family: var(--font-heading)");
    expect(extractCssRule(card, ".card__title")).toContain("font-weight: var(--font-weight-semibold)");
  });

  it("routes public titles and shared title primitives to the deep navy token", () => {
    const globals = readProjectFile("src/styles/globals.css");
    const publicPages = readProjectFile("src/pages/public/PublicPages.css");
    const publicNav = readProjectFile("src/components/layout/PublicNav.css");
    const publicFooter = readProjectFile("src/components/layout/PublicFooter.css");
    const accordion = readProjectFile("src/components/ui/Accordion.css");
    const card = readProjectFile("src/components/ui/Card.css");
    const foundationPreview = readProjectFile("src/pages/FoundationPreview.css");
    const portalShell = readProjectFile("src/components/layout/PortalShell.css");

    expect(globals).toMatch(/h1,\s*h2,\s*h3,\s*h4,\s*h5,\s*h6\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(publicPages).toMatch(/\.public-hero h1\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(publicPages).toMatch(/\.public-section__header h2\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(publicPages).toMatch(/\.public-card h2,\s*\.public-card h3\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(publicPages).toMatch(/\.public-process h3\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(publicPages).toMatch(
      /\.public-pricing-item h2,\s*\.public-pricing-item h3\s*\{[^}]*color: var\(--color-brand-navy\);/s,
    );
    expect(publicPages).toMatch(/\.public-note h2,\s*\.public-note h3\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(publicPages).toMatch(/\.public-faq-group h2\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(publicPages).toMatch(/\.public-card--navy h2,\s*\.public-card--navy h3\s*\{[^}]*color: var\(--color-text-inverse\);/s);
    expect(publicNav).toMatch(/\.public-nav__links a,\s*\.public-nav__links a:visited\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(publicNav).toMatch(
      /\.public-nav__drawer-links a,\s*\.public-nav__drawer-links a:visited\s*\{[^}]*color: var\(--color-brand-navy\);/s,
    );
    expect(publicFooter).toMatch(/\.public-footer__group h2\s*\{[^}]*color: var\(--color-text-inverse\);/s);
    expect(accordion).toMatch(/\.accordion__trigger\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(accordion).toMatch(
      /\.accordion__trigger:hover,\s*\.accordion__trigger:active,\s*\.accordion__trigger:focus-visible,\s*\.accordion__trigger\[aria-expanded="true"\]\s*\{[^}]*color: var\(--color-brand-navy\);/s,
    );
    expect(card).toMatch(/\.card__title\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(foundationPreview).toMatch(/\.foundation-preview h1\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(foundationPreview).toMatch(/\.foundation-preview h2\s*\{[^}]*color: var\(--color-brand-navy\);/s);
    expect(portalShell).toMatch(/\.portal-shell__topbar h1\s*\{[^}]*color: var\(--color-brand-navy\);/s);
  });

  it("does not hardcode black title colors in application styles or markup", () => {
    const sourceFiles = collectAppStyleSourceFiles(sourceRoot);
    const prohibitedBlackColor = /#(?:000|000000)\b|text-black|(?:^|[\s:"'])black(?:[\s;"')}]|$)/i;

    sourceFiles.forEach((file) => {
      const source = readFileSync(file, "utf8");
      const displayPath = relative(workspaceRoot, file);

      expect(source, `${displayPath} should use semantic color tokens instead of hardcoded black`).not.toMatch(
        prohibitedBlackColor,
      );
    });
  });

  it.each(routePaths)("uses Title Case for visible headings and titles on %s", (route) => {
    renderRoute(route);

    const titleElements = [
      ...screen.getAllByRole("heading"),
      ...document.querySelectorAll(".public-visual__panel > strong, .public-visual__card > strong"),
      ...document.querySelectorAll(".data-table__caption, .data-table th"),
    ];

    titleElements
      .map(normalizeVisibleText)
      .filter(Boolean)
      .forEach(expectTitleCase);
  });

  it.each(productionRoutePaths)("has no visible camelCase titles or copy on %s", (route) => {
    const { container } = renderRoute(route);

    collectTextNodes(container).forEach((text) => {
      expect(text).not.toMatch(/\b[a-z]+[A-Z][A-Za-z]*\b/);
    });
  });

  it("keeps table column headers Title Case and out of all caps", () => {
    renderRoute(developmentRoutes.foundationComponents);

    screen.getAllByRole("columnheader").forEach((header) => {
      const text = normalizeVisibleText(header);

      expectTitleCase(text);
      expect(text).not.toBe(text.toUpperCase());
    });
  });
});
