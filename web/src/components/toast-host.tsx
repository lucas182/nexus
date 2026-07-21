"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { subscribeToasts, type ToastDetail } from "@/lib/toast";

const DISMISS_AFTER_MS = 2400;

/** Mounted once in AppShell. Renders any showToast() call from anywhere in the client tree. */
export function ToastHost() {
  const [toasts, setToasts] = useState<ToastDetail[]>([]);

  useEffect(() => {
    return subscribeToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, DISMISS_AFTER_MS);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-5 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="animate-toast-in flex items-center gap-2 rounded-full border border-border-light bg-surface py-1.5 pl-2 pr-3.5 text-sm text-text-primary shadow-sm"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Check size={9} strokeWidth={2.5} />
          </span>
          <span className="text-xs">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
