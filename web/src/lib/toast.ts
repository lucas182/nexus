const TOAST_EVENT = "nexus:toast";

export interface ToastDetail {
  id: number;
  message: string;
}

let counter = 0;

/** Fire a transient toast from any client component — no provider/context wiring needed. */
export function showToast(message: string) {
  if (typeof window === "undefined") return;
  counter += 1;
  window.dispatchEvent(
    new CustomEvent<ToastDetail>(TOAST_EVENT, { detail: { id: counter, message } }),
  );
}

export function subscribeToasts(listener: (detail: ToastDetail) => void) {
  function handler(e: Event) {
    listener((e as CustomEvent<ToastDetail>).detail);
  }
  window.addEventListener(TOAST_EVENT, handler);
  return () => window.removeEventListener(TOAST_EVENT, handler);
}
