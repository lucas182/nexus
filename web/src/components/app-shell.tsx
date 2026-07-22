"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";
import type { Workspace } from "@/types/domain";
import { Sidebar } from "@/components/sidebar";
import { QuickCaptureModal } from "@/components/quick-capture-modal";
import { GlobalSearchModal } from "@/components/global-search-modal";
import { QuickThreadModal } from "@/components/quick-thread-modal";
import { ToastHost } from "@/components/toast-host";

export function AppShell({
  workspaces,
  inboxCount,
  userEmail = null,
  children,
}: {
  workspaces: Workspace[];
  inboxCount: number;
  userEmail?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [captureOpen, setCaptureOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [threadOpen, setThreadOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    function handleOpenCapture() { setCaptureOpen(true); }
    function handleOpenThread() { setThreadOpen(true); }
    
    window.addEventListener("open-capture", handleOpenCapture);
    window.addEventListener("open-thread", handleOpenThread);

    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (isTyping) {
        if (e.key === "Escape") {
          setCaptureOpen(false);
          setSearchOpen(false);
          setThreadOpen(false);
        }
        return;
      }
      if (e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setThreadOpen(true);
      } else if (e.key === "n" || e.key === "+") {
        e.preventDefault();
        setCaptureOpen(true);
      } else if (e.key === "Escape") {
        setCaptureOpen(false);
        setSearchOpen(false);
        setThreadOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-capture", handleOpenCapture);
      window.removeEventListener("open-thread", handleOpenThread);
    };
  }, []);

  return (
    <div className="flex h-screen bg-bg">
      <Sidebar
        workspaces={workspaces}
        inboxCount={inboxCount}
        userEmail={userEmail}
        onCaptureClick={() => setCaptureOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
        onNewThreadClick={() => setThreadOpen(true)}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="flex items-center gap-3 border-b border-border-light bg-surface/80 backdrop-blur-sm px-4 py-2.5 md:hidden">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex h-11 w-11 -ml-2 items-center justify-center rounded-md text-text-secondary hover:bg-hover press"
            aria-label="Abrir menu"
          >
            <Menu size={20} />
          </button>
          <span className="text-base font-semibold text-text-primary">Nexus</span>
        </div>
        <main key={pathname} className="animate-fade-in flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* FAB Mobile */}
      <button
        onClick={() => setCaptureOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-text-primary text-surface shadow-lg shadow-black/15 transition-transform active:scale-95"
        aria-label="Captura rápida"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>

      <QuickCaptureModal open={captureOpen} onClose={() => setCaptureOpen(false)} />
      <GlobalSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onCaptureAction={() => setCaptureOpen(true)}
        onNewThreadAction={() => setThreadOpen(true)}
      />
      <QuickThreadModal
        open={threadOpen}
        onClose={() => setThreadOpen(false)}
        workspaces={workspaces}
      />
      <ToastHost />
    </div>
  );
}
