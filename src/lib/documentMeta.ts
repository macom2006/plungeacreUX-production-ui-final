import type { RouteMetadata } from "./routes";

function upsertMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonical(pathname: string) {
  const href = `${window.location.origin}${pathname}`;
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

export function applyRouteMetadata(metadata: RouteMetadata, pathname: string) {
  document.title = metadata.title;
  upsertMeta("description", metadata.description);
  upsertCanonical(pathname);
}
