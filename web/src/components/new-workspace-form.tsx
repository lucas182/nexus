"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { createWorkspace } from "@/lib/actions/workspaces";
import { WORKSPACE_ICONS, WorkspaceIcon } from "@/lib/icon-map";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      {pending ? "Criando…" : "Criar Workspace"}
    </button>
  );
}

export function NewWorkspaceForm() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(WORKSPACE_ICONS[0].slug);

  return (
    <form action={createWorkspace} className="flex flex-col gap-6">
      {/* Name + Icon preview */}
      <div className="animate-field-in flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <WorkspaceIcon slug={icon} size={18} strokeWidth={1.5} />
        </div>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do Workspace"
          required
          autoFocus
          className="h-10 flex-1 border-0 border-b border-transparent bg-transparent text-base font-medium text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent"
        />
      </div>

      {/* Icon picker + Description */}
      <div
        className="animate-field-in flex flex-col gap-4 rounded-lg bg-hover/60 p-4"
        style={{ animationDelay: "50ms" }}
      >
        <div>
          <span className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Ícone
          </span>
          <input type="hidden" name="icon" value={icon} />
          <div className="grid grid-cols-6 gap-1.5">
            {WORKSPACE_ICONS.map(({ slug, label, Icon }) => {
              const selected = slug === icon;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setIcon(slug)}
                  title={label}
                  aria-pressed={selected}
                  className={`flex h-8 w-8 items-center justify-center rounded-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-muted ${
                    selected
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border bg-surface text-text-tertiary hover:text-text-secondary hover:bg-hover"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.5} />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-text-tertiary">
            Descrição (opcional)
          </span>
          <textarea
            name="description"
            placeholder="Ex: reformas, contas e manutenção da casa"
            className="h-14 w-full resize-none rounded-md border border-border bg-surface px-2.5 py-2 text-sm text-text-primary outline-none transition-all placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
          />
        </div>
      </div>

      <div className="animate-field-in" style={{ animationDelay: "100ms" }}>
        <SubmitButton />
        <p className="mt-2 text-center text-[10px] text-text-tertiary">
          Você poderá editar tudo isso depois.
        </p>
      </div>
    </form>
  );
}
