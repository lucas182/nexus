"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { createWorkspace } from "@/lib/actions/workspaces";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-accent text-sm font-medium text-white transition-all hover:bg-accent-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      {pending ? "Criando…" : "Criar"}
    </button>
  );
}

export function NewWorkspaceForm() {
  const [name, setName] = useState("");

  return (
    <form action={createWorkspace} className="flex flex-col gap-2">
      <label className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary">Nome</label>
      <input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex: Casa, Escola, Tríade.fit"
        required
        autoFocus
        className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent-muted/50"
      />
      <input type="hidden" name="icon" value="home" />
      <SubmitButton />
      <p className="text-[10px] text-text-tertiary">
        Depois você pode adicionar mais detalhes.
      </p>
    </form>
  );
}
