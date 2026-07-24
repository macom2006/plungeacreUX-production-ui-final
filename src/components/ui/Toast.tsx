import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Button } from "./Button";
import type { AlertTone } from "./Alert";
import "./Feedback.css";

export interface ToastMessage {
  description?: ReactNode;
  durationMs?: number;
  id: string;
  title: ReactNode;
  tone?: AlertTone;
}

interface ToastContextValue {
  dismissToast: (id: string) => void;
  showToast: (toast: Omit<ToastMessage, "id"> & { id?: string }) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error("useToast must be used within ToastProvider.");
  }
  return value;
}

export interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number;
}

export function ToastProvider({ children, maxToasts = 3 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastMessage, "id"> & { id?: string }) => {
      const id = toast.id ?? crypto.randomUUID();
      setToasts((current) => [{ ...toast, id }, ...current].slice(0, maxToasts));
      return id;
    },
    [maxToasts],
  );

  const value = useMemo(() => ({ dismissToast, showToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport dismissToast={dismissToast} toasts={toasts} />
    </ToastContext.Provider>
  );
}

interface ToastViewportProps {
  dismissToast: (id: string) => void;
  toasts: ToastMessage[];
}

function ToastViewport({ dismissToast, toasts }: ToastViewportProps) {
  return (
    <div aria-live="polite" aria-relevant="additions removals" className="toast-viewport">
      {toasts.map((toast) => (
        <ToastItem dismissToast={dismissToast} key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  dismissToast: (id: string) => void;
  toast: ToastMessage;
}

function ToastItem({ dismissToast, toast }: ToastItemProps) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    const duration = toast.durationMs ?? (toast.tone === "danger" ? 9000 : 5000);
    const timeoutId = window.setTimeout(() => dismissToast(toast.id), duration);
    return () => window.clearTimeout(timeoutId);
  }, [dismissToast, paused, toast.durationMs, toast.id, toast.tone]);

  return (
    <div
      className={`toast toast--${toast.tone ?? "info"}`}
      onBlur={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onKeyDown={(event) => {
        if (event.key === "Escape") dismissToast(toast.id);
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="status"
      tabIndex={0}
    >
      <div>
        <h3>{toast.title}</h3>
        {toast.description ? <p>{toast.description}</p> : null}
      </div>
      <Button aria-label="Dismiss notification" onClick={() => dismissToast(toast.id)} size="icon" variant="ghost">
        x
      </Button>
    </div>
  );
}
