"use client";

import { useEffect, useRef } from "react";
import { Link2 } from "lucide-react";
import { captureToInbox } from "@/lib/actions/inbox";
import { showToast } from "@/lib/toast";

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
    if (!textareaRef.current?.value.trim()) return;
    formRef.current?.requestSubmit();
    showToast("Capturado");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/10 animate-overlay-in" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-pop-in rounded-lg border border-border-light bg-surface p-4 shadow-xl">
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
          Capturar para o Inbox
        </h3>
        <form ref={formRef} action={captureToInbox}>
          <textarea
            ref={textareaRef}
            name="raw_text"
            placeholder="Digite uma ideia, decisão ou anotação rápida..."
            className="h-20 w-full resize-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitAndClose();
              }
              if (e.key === "Escape") onClose();
            }}
          />
          <div className="flex items-center gap-1.5 border-t border-border-light pt-2.5">
            <Link2 size={12} className="flex-shrink-0 text-text-tertiary" strokeWidth={1.5} />
            <input
              name="attachment_url"
              placeholder="Colar um link (opcional)"
              className="w-full bg-transparent text-xs text-text-secondary outline-none placeholder:text-text-tertiary"
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between border-t border-border-light pt-2.5">
            <span className="text-[10px] text-text-tertiary">
              <kbd className="rounded border border-border bg-hover px-1 py-[1px] text-[9px]">Enter</kbd> para registrar
            </span>
            <button
              type="button"
              onClick={submitAndClose}
              className="h-7 rounded-md bg-accent px-2.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
