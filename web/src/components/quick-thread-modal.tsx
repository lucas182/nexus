"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { createThread } from "@/lib/actions/threads";
import type { Workspace } from "@/types/domain";

/**
 * One-step Thread creation: title + Enter, nothing else required. Pre-selects
 * the Workspace the user is currently looking at (from the URL) so opening
 * this from inside a Workspace never asks a question with an obvious answer.
 */
export function QuickThreadModal({
  open,
  onClose,
  workspaces,
}: {
  open: boolean;
  onClose: () => void;
  workspaces: Workspace[];
}) {
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const currentWorkspaceId = pathname?.match(/^\/workspace\/([^/]+)/)?.[1];
  const defaultWorkspaceId =
    (currentWorkspaceId && workspaces.some((w) => w.id === currentWorkspaceId)
      ? currentWorkspaceId
      : workspaces[workspaces.length - 1]?.id) ?? "";

  // null = "follow the computed default"; set once the user explicitly picks one.
  const [workspaceOverride, setWorkspaceOverride] = useState<string | null>(null);
  const workspaceId = workspaceOverride ?? defaultWorkspaceId;

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  function handleClose() {
    setWorkspaceOverride(null);
    onClose();
  }

  if (!open) return null;
  if (workspaces.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="animate-scale-in relative w-full max-w-sm rounded-lg border border-border-light bg-surface p-4 text-sm text-text-secondary shadow-xl">
          Crie um Workspace antes de registrar um assunto.
        </div>
      </div>
    );
  }

  function submit() {
    formRef.current?.requestSubmit();
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="animate-scale-in relative w-full max-w-md rounded-lg border border-border-light bg-surface p-4 shadow-xl">
        <h3 className="mb-3 text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
          Novo assunto
        </h3>
        <form ref={formRef} action={createThread}>
          <input type="hidden" name="workspace_id" value={workspaceId} />
          <input
            ref={inputRef}
            name="title"
            placeholder="Nome do assunto…"
            autoComplete="off"
            required
            className="w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-tertiary"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
              if (e.key === "Escape") handleClose();
            }}
          />
          <div className="mt-3 flex items-center justify-between border-t border-border-light pt-2.5">
            {workspaces.length > 1 ? (
              <select
                value={workspaceId}
                onChange={(e) => setWorkspaceOverride(e.target.value)}
                className="rounded-md border border-border bg-surface px-2 py-1 text-xs text-text-secondary outline-none"
              >
                {workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            ) : (
              <span className="text-[10px] text-text-tertiary">
                <kbd className="rounded border border-border bg-hover px-1 py-[1px] text-[9px]">
                  Enter
                </kbd>{" "}
                para criar
              </span>
            )}
            <button
              type="button"
              onClick={submit}
              className="h-7 rounded-md bg-accent px-2.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover active:scale-[0.98]"
            >
              Criar assunto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
