"use client";

import { useEffect, useState } from "react";
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
        onCaptureClick={() => setCaptureOpen(true)}
      />
      <main className="flex-1 overflow-y-auto bg-bg px-10 py-8">{children}</main>
      <QuickCaptureModal open={captureOpen} onClose={() => setCaptureOpen(false)} />
    </div>
  );
}
