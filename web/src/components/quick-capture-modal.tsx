"use client";

import { useEffect, useRef } from "react";
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg animate-pop-in">
        <form ref={formRef} action={captureToInbox}>
          <textarea
            ref={textareaRef}
            name="raw_text"
            placeholder="Registre uma ideia, decisão ou lembrança..."
            className="h-28 w-full resize-none bg-transparent text-lg leading-relaxed text-text-primary outline-none placeholder:text-text-tertiary/60"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submitAndClose();
              }
              if (e.key === "Escape") onClose();
            }}
          />
        </form>
      </div>
    </div>
  );
}
