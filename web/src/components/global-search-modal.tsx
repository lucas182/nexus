"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { SearchResult } from "@/app/api/search/route";

const KIND_LABEL: Record<SearchResult["kind"], string> = {
  workspace: "Workspace",
  thread: "Thread",
  event: "Evento",
  knowledge: "Knowledge",
};

export function GlobalSearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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

  const displayedResults = query.trim() ? results : [];

  function handleClose() {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    onClose();
  }

  function navigateTo(path: string) {
    handleClose();
    router.push(path);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32">
      <div className="absolute inset-0 bg-black/20" onClick={handleClose} />
      <div className="relative flex max-h-[60vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border-light bg-surface shadow-xl">
        <div className="flex items-center gap-2 border-b border-border-light px-4 py-3">
          <Search size={16} className="flex-shrink-0 text-text-tertiary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar em acontecimentos, knowledges, threads, workspaces..."
            className="flex-1 bg-transparent text-sm text-text-primary outline-none"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((i) => Math.min(i + 1, displayedResults.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((i) => Math.max(i - 1, 0));
              } else if (e.key === "Enter" && displayedResults[selectedIndex]) {
                navigateTo(displayedResults[selectedIndex].path);
              } else if (e.key === "Escape") {
                handleClose();
              }
            }}
          />
          <kbd className="rounded border border-border bg-hover px-1.5 py-0.5 text-xs text-text-tertiary">
            Esc
          </kbd>
        </div>

        <div className="overflow-y-auto">
          {query.trim() && displayedResults.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-text-tertiary">
              Sem resultados para &quot;{query}&quot;
            </p>
          )}
          {displayedResults.map((r, i) => (
            <button
              key={`${r.kind}-${r.id}`}
              onClick={() => navigateTo(r.path)}
              onMouseEnter={() => setSelectedIndex(i)}
              className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm ${
                i === selectedIndex ? "bg-hover" : ""
              }`}
            >
              <span className="flex-1 truncate text-text-primary">{r.title}</span>
              <span className="flex-shrink-0 text-xs text-text-tertiary">
                {r.subtitle || KIND_LABEL[r.kind]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
