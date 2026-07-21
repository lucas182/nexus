"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { MoreHorizontal, Trash2, Loader2 } from "lucide-react";

function ConfirmButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-1.5 rounded-md bg-red px-2 py-1.5 text-[11px] font-medium text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Loader2 size={10} className="animate-spin" />}
      {pending ? "Excluindo…" : label}
    </button>
  );
}

export function ConfirmDeleteMenu({
  action,
  hiddenFields,
  menuItemLabel,
  confirmMessage,
  confirmButtonLabel = "Confirmar exclusão",
  align = "right",
}: {
  action: (formData: FormData) => void | Promise<void>;
  hiddenFields: Record<string, string>;
  menuItemLabel: string;
  confirmMessage: React.ReactNode;
  confirmButtonLabel?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirming(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex-shrink-0">
      <button
        type="button"
        aria-label="Mais ações"
        title="Mais ações"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-5 w-5 items-center justify-center rounded text-text-tertiary transition-all hover:bg-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-muted ${
          open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <MoreHorizontal size={13} strokeWidth={1.5} />
      </button>

      {open && (
        <div
          className={`animate-pop-in absolute top-6 z-50 w-52 rounded-lg border border-border-light bg-surface p-1 shadow-md ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {confirming ? (
            <div className="flex flex-col gap-2 p-1.5">
              <p className="text-xs leading-relaxed text-text-secondary">{confirmMessage}</p>
              <form action={action}>
                {Object.entries(hiddenFields).map(([name, value]) => (
                  <input key={name} type="hidden" name={name} value={value} />
                ))}
                <ConfirmButton label={confirmButtonLabel} />
              </form>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-[11px] text-text-tertiary transition-colors hover:text-text-primary"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] text-text-secondary transition-colors hover:bg-red-soft hover:text-red"
            >
              <Trash2 size={12} strokeWidth={1.5} />
              {menuItemLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
