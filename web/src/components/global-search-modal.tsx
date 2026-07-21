"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, PenLine, Radar, Inbox } from "lucide-react";
import type { SearchResult } from "@/app/api/search/route";

const KIND_LABEL: Record<SearchResult["kind"], string> = {
  workspace: "Workspace",
  thread: "Thread",
  event: "Evento",
  knowledge: "Knowledge",
};

interface PaletteAction {
  id: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
}

export function GlobalSearchModal({
  open,
  onClose,
  onCaptureAction,
  onNewThreadAction,
}: {
  open: boolean;
  onClose: () => void;
  onCaptureAction?: () => void;
  onNewThreadAction?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) return;
    const id = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setSelectedIndex(data.results?.length ? 0 : -1);
    }, 200);
    return () => clearTimeout(id);
  }, [query]);

  function handleClose() {
    setQuery("");
    setResults([]);
    setSelectedIndex(0);
    onClose();
  }

  function navigateTo(path: string) {
    handleClose();
    router.push(path);
  }

  const actions: PaletteAction[] = [
    onCaptureAction && {
      id: "capture",
      label: "Nova captura",
      hint: "N",
      icon: <Zap size={14} strokeWidth={1.5} />,
      run: () => {
        handleClose();
        onCaptureAction();
      },
    },
    onNewThreadAction && {
      id: "new-thread",
      label: "Novo assunto",
      hint: "Shift N",
      icon: <PenLine size={14} strokeWidth={1.5} />,
      run: () => {
        handleClose();
        onNewThreadAction();
      },
    },
    { id: "go-radar", label: "Ir para Radar", icon: <Radar size={14} strokeWidth={1.5} />, run: () => navigateTo("/") },
    { id: "go-inbox", label: "Ir para Inbox", icon: <Inbox size={14} strokeWidth={1.5} />, run: () => navigateTo("/inbox") },
  ].filter(Boolean) as PaletteAction[];

  const showingActions = !query.trim();
  const itemCount = showingActions ? actions.length : results.length;
  const activeIndex = Math.max(0, Math.min(selectedIndex, itemCount - 1));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0" onClick={handleClose} />
      <div className="relative flex max-h-[65vh] w-full max-w-lg flex-col overflow-hidden rounded-[10px] border border-border-light bg-surface shadow-search">
        {/* Input row */}
        <div className="flex items-center gap-2.5 border-b border-border-light px-4 py-3">
          <Search size={15} className="flex-shrink-0 text-text-tertiary" strokeWidth={1.5} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar ou executar uma ação..."
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, itemCount - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter") {
                if (showingActions) {
                  actions[activeIndex]?.run();
                } else if (results[activeIndex]) {
                  navigateTo(results[activeIndex].path);
                }
              } else if (e.key === "Escape") {
                handleClose();
              }
            }}
          />
          <kbd className="rounded border border-border bg-hover px-1.5 py-[1px] text-[9px] font-medium text-text-tertiary">
            Esc
          </kbd>
        </div>

        {/* Results / actions */}
        <div className="overflow-y-auto py-1">
          {showingActions ? (
            actions.map((action, i) => (
              <button
                key={action.id}
                onClick={action.run}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors ${
                  i === activeIndex ? "bg-hover" : ""
                }`}
              >
                <span className="text-text-tertiary">{action.icon}</span>
                <span className="flex-1 text-text-primary">{action.label}</span>
                {action.hint && (
                  <kbd className="rounded border border-border bg-hover px-1.5 py-[1px] text-[9px] font-medium text-text-tertiary">
                    {action.hint}
                  </kbd>
                )}
              </button>
            ))
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-text-tertiary">
              Nada encontrado para &quot;{query}&quot;
            </p>
          ) : (
            results.map((r, i) => (
              <button
                key={`${r.kind}-${r.id}`}
                onClick={() => navigateTo(r.path)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  i === activeIndex ? "bg-hover" : ""
                }`}
              >
                <span className="flex-1 truncate text-text-primary">{r.title}</span>
                <span className="flex-shrink-0 text-[11px] text-text-tertiary">
                  {r.subtitle || KIND_LABEL[r.kind]}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
