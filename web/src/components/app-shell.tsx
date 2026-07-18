"use client";

import { useEffect, useState } from "react";
import { Menu, Plus } from "lucide-react";
import type { Workspace } from "@/types/domain";
import { Sidebar } from "@/components/sidebar";
import { QuickCaptureModal } from "@/components/quick-capture-modal";

export function AppShell({
  workspaces,
  inboxCount,
  children,
}: {
  workspaces: Workspace[];
  inboxCount: number;
  children: React.ReactNode;
}) {
  const [captureOpen, setCaptureOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.key === "+" && !isTyping) {
        e.preventDefault();
        setCaptureOpen(true);
      }
      if (e.key === "Escape") {
        setCaptureOpen(false);
        setSidebarOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <header className="flex flex-shrink-0 items-center justify-between border-b border-border-light bg-surface px-4 py-3 md:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          title="Abrir menu"
          className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-hover"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold tracking-tight text-text-primary">
            Nexus
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
        <button
          onClick={() => setCaptureOpen(true)}
          title="Captura Rápida (+)"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border-light bg-surface text-text-secondary shadow-xs hover:bg-hover"
        >
          <Plus size={16} />
        </button>
      </header>

      <Sidebar
        workspaces={workspaces}
        inboxCount={inboxCount}
        onCaptureClick={() => setCaptureOpen(true)}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 overflow-y-auto bg-bg px-4 py-6 sm:px-6 md:px-10 md:py-8">
        {children}
      </main>
      <QuickCaptureModal open={captureOpen} onClose={() => setCaptureOpen(false)} />
    </div>
  );
}
