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
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-accent py-3 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && <Loader2 size={15} className="animate-spin" />}
      {pending ? "Criando…" : "Criar Workspace"}
    </button>
  );
}

export function NewWorkspaceForm() {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState(WORKSPACE_ICONS[0].slug);

  return (
    <form action={createWorkspace} className="flex flex-col gap-6">
      <div className="animate-field-in flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <WorkspaceIcon slug={icon} size={20} strokeWidth={1.5} />
        </div>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do Workspace"
          required
          autoFocus
          className="w-full border-0 border-b border-transparent bg-transparent pb-1 text-lg font-medium text-text-primary outline-none transition-colors duration-150 placeholder:text-text-tertiary placeholder:font-normal focus:border-accent"
        />
      </div>

      <div
        className="animate-field-in flex flex-col gap-4 rounded-md bg-hover/60 p-4"
        style={{ animationDelay: "60ms" }}
      >
        <div>
          <span className="mb-2 block text-xs text-text-tertiary">Ícone</span>
          <input type="hidden" name="icon" value={icon} />
          <div className="grid grid-cols-6 gap-2">
            {WORKSPACE_ICONS.map(({ slug, label, Icon }) => {
              const selected = slug === icon;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => setIcon(slug)}
                  title={label}
                  aria-pressed={selected}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-muted ${
                    selected
                      ? "border-accent bg-accent-soft text-accent"
                      : "border-border bg-surface text-text-secondary hover:bg-hover"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs text-text-tertiary">Descrição (opcional)</span>
          <textarea
            name="description"
            placeholder="Ex: reformas, contas e manutenção da casa"
            className="h-16 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none transition-shadow focus:border-accent focus:ring-2 focus:ring-accent-muted"
          />
        </div>
      </div>

      <div className="animate-field-in" style={{ animationDelay: "120ms" }}>
        <SubmitButton />
        <p className="mt-2 text-center text-xs text-text-tertiary">
          Você poderá editar tudo isso depois.
        </p>
      </div>
    </form>
  );
}
