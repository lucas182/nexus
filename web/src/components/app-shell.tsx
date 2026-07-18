"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import type { Workspace } from "@/types/domain";
import { Sidebar } from "@/components/sidebar";
import { QuickCaptureModal } from "@/components/quick-capture-modal";
import { GlobalSearchModal } from "@/components/global-search-modal";

export function AppShell({
  workspaces,
  inboxCount,
  mostActiveWorkspaceId = null,
  userEmail = null,
  children,
}: {
  workspaces: Workspace[];
  inboxCount: number;
  mostActiveWorkspaceId?: string | null;
  userEmail?: string | null;
  children: React.ReactNode;
}) {
  const [captureOpen, setCaptureOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (e.key === "+" && !isTyping) {
        e.preventDefault();
        setCaptureOpen(true);
      }
      if (e.key === "Escape") {
        setCaptureOpen(false);
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar
        workspaces={workspaces}
        inboxCount={inboxCount}
        mostActiveWorkspaceId={mostActiveWorkspaceId}
        userEmail={userEmail}
        onCaptureClick={() => setCaptureOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border-light bg-surface px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-hover"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm font-semibold text-text-primary">Nexus</span>
        </div>
        <main className="flex-1 overflow-y-auto bg-bg px-4 py-6 md:px-10 md:py-8">
          {children}
        </main>
      </div>
      <QuickCaptureModal open={captureOpen} onClose={() => setCaptureOpen(false)} />
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
