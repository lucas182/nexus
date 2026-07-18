"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Radar, Plus, Search } from "lucide-react";

import type { Workspace } from "@/types/domain";
import { WorkspaceIcon } from "@/lib/icon-map";

export function Sidebar({
  workspaces,
  inboxCount,
  onCaptureClick,
  onSearchClick,
  mobileOpen,
  onMobileClose,
}: {
  workspaces: Workspace[];
  inboxCount: number;
  onCaptureClick: () => void;
  onSearchClick: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const navItemClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
      active
        ? "bg-accent-soft text-accent font-medium"
        : "text-text-secondary hover:bg-hover"
    }`;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-60 flex-shrink-0 flex-col border-r border-border-light bg-surface transition-transform duration-200 md:sticky md:top-0 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-semibold tracking-tight text-text-primary">
              Nexus
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </div>
          <button
            onClick={onCaptureClick}
            title="Captura Rápida (+)"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border-light bg-surface text-text-secondary shadow-xs hover:bg-hover"
          >
            <Plus size={14} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 px-2">
          <Link href="/" onClick={onMobileClose} className={navItemClass(pathname === "/")}>
            <Radar size={18} strokeWidth={1.5} />
            <span>Radar</span>
          </Link>

          <Link
            href="/inbox"
            onClick={onMobileClose}
            className={navItemClass(pathname === "/inbox")}
          >
            <Inbox size={18} strokeWidth={1.5} />
            <span className="flex-1">Inbox</span>
            {inboxCount > 0 && (
              <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] text-white">
                {inboxCount}
              </span>
            )}
          </Link>

          <div className="mt-4 flex items-center justify-between px-3 pb-1">
            <span className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
              Workspaces
            </span>
            <Link
              href="/workspace/new"
              onClick={onMobileClose}
              title="Novo Workspace"
              className="text-text-tertiary hover:text-accent"
            >
              <Plus size={13} />
            </Link>
          </div>
          {workspaces.map((ws) => {
            const active = pathname === `/workspace/${ws.id}`;
            return (
              <Link
                key={ws.id}
                href={`/workspace/${ws.id}`}
                onClick={onMobileClose}
                className={navItemClass(active)}
              >
                <WorkspaceIcon slug={ws.icon} size={18} strokeWidth={1.5} />
                <span>{ws.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-2">
          <button
            onClick={onSearchClick}
            className="flex w-full items-center gap-2 rounded-md border border-border-light px-3 py-2 text-sm text-text-tertiary hover:bg-hover"
          >
            <Search size={16} strokeWidth={1.5} />
            <span className="flex-1 text-left">Buscar</span>
            <kbd className="rounded border border-border bg-hover px-1.5 py-0.5 text-[10px]">
              Ctrl K
            </kbd>
          </button>
        </div>
      </aside>
    </>
  );
}
