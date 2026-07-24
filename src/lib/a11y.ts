import {
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
  type RefObject,
} from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getFocusableElements(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    .filter((element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"));
}

let scrollLockCount = 0;
let originalBodyOverflow = "";

type InertElement = HTMLElement & { inert: boolean };

const inertState = new Map<HTMLElement, { ariaHidden: string | null; inert: boolean }>();
let modalIsolationCount = 0;

export function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") {
    ref(value);
  } else {
    ref.current = value;
  }
}

export function useComposedRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => setRef(ref, node));
  };
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return undefined;
    if (scrollLockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    scrollLockCount += 1;
    return () => {
      scrollLockCount = Math.max(0, scrollLockCount - 1);
      if (scrollLockCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
      }
    };
  }, [locked]);
}

export function useModalIsolation(active: boolean) {
  useEffect(() => {
    if (!active) return undefined;
    if (modalIsolationCount === 0) {
      Array.from(document.body.children).forEach((element) => {
        if (!(element instanceof HTMLElement)) return;
        if (element.dataset.modalRoot === "true") return;
        inertState.set(element, {
          ariaHidden: element.getAttribute("aria-hidden"),
          inert: Boolean((element as InertElement).inert),
        });
        element.setAttribute("aria-hidden", "true");
        (element as InertElement).inert = true;
      });
    }
    modalIsolationCount += 1;

    return () => {
      modalIsolationCount = Math.max(0, modalIsolationCount - 1);
      if (modalIsolationCount === 0) {
        inertState.forEach((state, element) => {
          if (state.ariaHidden === null) {
            element.removeAttribute("aria-hidden");
          } else {
            element.setAttribute("aria-hidden", state.ariaHidden);
          }
          (element as InertElement).inert = state.inert;
        });
        inertState.clear();
      }
    };
  }, [active]);
}

export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  const containerRef = useRef<T | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return undefined;
    triggerRef.current = document.activeElement as HTMLElement | null;
    const focusable = getFocusableElements(containerRef.current);
    const firstFocusable = initialFocusRef?.current ?? focusable[0] ?? containerRef.current;
    firstFocusable?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = getFocusableElements(containerRef.current);
      if (elements.length === 0) {
        event.preventDefault();
        containerRef.current?.focus();
        return;
      }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [active, initialFocusRef]);

  return containerRef;
}

export function onKeyboardActivate(
  event: ReactKeyboardEvent,
  action: () => void,
) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    action();
  }
}
