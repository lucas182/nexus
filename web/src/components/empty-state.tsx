"use client";

import { Inbox, Folder, MessageSquare } from "lucide-react";

export function EmptyState({
  type,
}: {
  type: "inbox" | "workspace" | "thread";
}) {
  if (type === "inbox") {
    return (
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-border-light py-20 px-4 animate-fade-in mt-4 bg-surface/50">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-hover text-text-tertiary mb-4">
          <Inbox size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-base font-semibold text-text-primary mb-1.5">Inbox Vazio</h3>
        <p className="text-sm text-text-secondary text-center mb-6 max-w-[260px] leading-relaxed">
          Capture sua primeira ideia. A mente serve para ter ideias, não para guardá-las.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-capture"))}
          className="h-9 rounded-[8px] bg-text-primary px-5 text-sm font-medium text-surface press transition-transform"
        >
          Capturar algo agora
        </button>
      </div>
    );
  }

  if (type === "workspace") {
    return (
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-border-light py-16 px-4 animate-fade-in mt-4 bg-surface/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hover text-text-tertiary mb-4">
          <Folder size={20} strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-1.5">Nenhum Assunto</h3>
        <p className="text-xs text-text-secondary text-center mb-5 max-w-[240px] leading-relaxed">
          Comece criando um assunto para organizar os acontecimentos deste contexto.
        </p>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("open-thread"))}
          className="h-8 rounded-[6px] bg-text-primary px-4 text-xs font-medium text-surface press transition-transform"
        >
          Criar primeiro assunto
        </button>
      </div>
    );
  }

  if (type === "thread") {
    return (
      <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-border-light py-16 px-4 animate-fade-in mt-4 bg-surface/50">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-hover text-text-tertiary mb-4">
          <MessageSquare size={20} strokeWidth={1.5} />
        </div>
        <h3 className="text-sm font-semibold text-text-primary mb-1.5">Thread Vazia</h3>
        <p className="text-xs text-text-secondary text-center mb-5 max-w-[240px] leading-relaxed">
          Registre o primeiro acontecimento, decisão ou nota para iniciar o histórico.
        </p>
        {/* For thread, the action usually is focusing the new event form. We can just focus it programmatically or rely on the user to click the form right below. */}
        <button
          onClick={() => {
            const form = document.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
            if (form) form.focus();
          }}
          className="h-8 rounded-[6px] bg-text-primary px-4 text-xs font-medium text-surface press transition-transform"
        >
          Registrar acontecimento
        </button>
      </div>
    );
  }

  return null;
}
