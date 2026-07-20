"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Radar, Plus, Search, LogOut } from "lucide-react";

import type { Workspace } from "@/types/domain";
import { WorkspaceIcon } from "@/lib/icon-map";
import { logout } from "@/lib/actions/auth";
import { WorkspaceRowMenu } from "@/components/workspace-row-menu";

export function Sidebar({
  workspaces,
  inboxCount,
  userEmail = null,
  onCaptureClick,
  onSearchClick,
  mobileOpen,
  onMobileClose,
}: {
  workspaces: Workspace[];
  inboxCount: number;
  userEmail?: string | null;
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
              className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border transition-colors ${
                workspaces.length === 0
                  ? "border-accent-muted bg-accent-soft text-accent"
                  : "border-transparent text-text-tertiary hover:border-border-light hover:bg-hover hover:text-text-primary"
              }`}
            >
              <Plus size={13} />
            </Link>
          </div>
          {workspaces.length === 0 ? (
            <div className="mx-1 rounded-md border border-dashed border-border-light px-3 py-3 text-center">
              <p className="text-xs text-text-tertiary">Nenhum workspace ainda</p>
            </div>
          ) : (
            workspaces.map((ws) => {
              const active = pathname === `/workspace/${ws.id}`;
              return (
                <div key={ws.id} className="group relative">
                  <Link
                    href={`/workspace/${ws.id}`}
                    onClick={onMobileClose}
                    className={navItemClass(active)}
                  >
                    <WorkspaceIcon slug={ws.icon} size={18} strokeWidth={1.5} />
                    <span className="flex-1 truncate">{ws.name}</span>
                    <span className="w-5 flex-shrink-0" />
                  </Link>
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                    <WorkspaceRowMenu workspaceId={ws.id} workspaceName={ws.name} />
                  </div>
                </div>
              );
            })
          )}
        </nav>

        <div className="mt-auto flex flex-col gap-1 p-2">
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

          {userEmail && (
            <div className="flex items-center gap-2 rounded-md px-3 py-1.5">
              <span className="min-w-0 flex-1 truncate text-xs text-text-tertiary" title={userEmail}>
                {userEmail}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  title="Sair"
                  className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-hover hover:text-text-primary"
                >
                  <LogOut size={13} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
