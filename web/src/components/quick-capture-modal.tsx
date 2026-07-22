"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { captureToInbox } from "@/lib/actions/inbox";
import { showToast } from "@/lib/toast";
import { AnimatePresence, motion } from "framer-motion";

export function QuickCaptureModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");

  useEffect(() => {
    if (open) {
      setText("");
      // Need a small timeout so the bottom sheet has time to animate in before focusing
      const id = setTimeout(() => textareaRef.current?.focus(), 150);
      return () => clearTimeout(id);
    }
  }, [open]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Only submit on Enter if it's desktop (avoid mobile keyboard issues)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitAndClose();
    }
    if (e.key === "Escape") onClose();
  }

  function submitAndClose() {
    if (!text.trim() || isPending) return;
    
    const formData = new FormData();
    formData.append("raw_text", text);
    
    startTransition(async () => {
      try {
        await captureToInbox(formData);
        showToast("Capturado");
        onClose();
      } catch (err) {
        showToast("Erro ao capturar");
      }
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Content Wrapper */}
          <div className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end md:items-center md:justify-start md:pt-[20vh]">
            
            {/* Modal / Bottom Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="pointer-events-auto relative w-full max-w-lg bg-surface md:rounded-xl rounded-t-2xl shadow-xl border border-border-light overflow-hidden flex flex-col"
            >
              {/* Mobile Handle */}
              <div className="w-full flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-12 h-1.5 rounded-full bg-border-light" />
              </div>

              <div className="flex items-center justify-between px-5 pt-2 pb-3 md:hidden">
                <span className="text-base font-semibold text-text-primary">Nova Captura</span>
                <button onClick={onClose} className="text-sm font-medium text-text-tertiary p-2 -mr-2 press">Cancelar</button>
              </div>

              <form
                action={submitAndClose}
                className="flex flex-col flex-1"
              >
                <div className="p-5">
                  <textarea
                    ref={textareaRef}
                    name="raw_text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Registre uma ideia, decisão ou lembrança..."
                    className="h-32 md:h-28 w-full resize-none bg-transparent text-lg md:text-xl leading-relaxed text-text-primary outline-none placeholder:text-text-tertiary/60"
                    onKeyDown={handleKeyDown}
                    disabled={isPending}
                  />
                </div>
                
                <div className="flex items-center justify-between bg-hover/40 px-5 py-4 md:py-3 border-t border-border-light/50">
                  <div className="text-xs text-text-tertiary hidden md:block">
                    Pressione <kbd className="font-sans font-medium px-1.5 py-0.5 rounded bg-border-light text-text-secondary">Enter</kbd> para salvar
                  </div>
                  <div className="flex-1 md:hidden" />
                  <button
                    type="submit"
                    disabled={!text.trim() || isPending}
                    className="flex h-11 md:h-8 w-full md:w-auto items-center justify-center rounded-lg md:rounded-md bg-text-primary px-6 md:px-4 text-base md:text-sm font-medium text-surface transition-colors disabled:opacity-50 press"
                  >
                    {isPending ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
