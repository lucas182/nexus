"use client";

import { useEffect, useRef } from "react";
import { Link2 } from "lucide-react";
import { captureToInbox } from "@/lib/actions/inbox";

export function QuickCaptureModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => textareaRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  if (!open) return null;

  function submitAndClose() {
    formRef.current?.requestSubmit();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-lg border border-border-light bg-surface p-5 shadow-xl">
        <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">
          Capturar para o Inbox
        </h3>
        <form ref={formRef} action={captureToInbox}>
          <textarea
            ref={textareaRef}
            name="raw_text"
            placeholder="Digite uma ideia, decisão ou anotação rápida..."
            className="h-20 w-full resize-none bg-transparent text-sm text-text-primary outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitAndClose();
              }
              if (e.key === "Escape") onClose();
            }}
          />
          <div className="flex items-center gap-1.5 border-t border-border-light pt-2">
            <Link2 size={13} className="flex-shrink-0 text-text-tertiary" />
            <input
              name="attachment_url"
              placeholder="Colar um link (opcional)"
              className="w-full bg-transparent text-xs text-text-secondary outline-none placeholder:text-text-tertiary"
            />
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-border-light pt-3">
            <span className="text-xs text-text-tertiary">
              Pressione{" "}
              <kbd className="rounded border border-border bg-hover px-1.5 py-0.5">
                Enter
              </kbd>{" "}
              para registrar
            </span>
            <button
              type="button"
              onClick={submitAndClose}
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
