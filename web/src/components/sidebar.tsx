"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Radar, Plus, Search, LogOut } from "lucide-react";

import type { Workspace } from "@/types/domain";
import { logout } from "@/lib/actions/auth";

export function Sidebar({
  workspaces,
  inboxCount,
  userEmail = null,
  onCaptureClick,
  onSearchClick,
  onNewThreadClick,
  mobileOpen,
  onMobileClose,
}: {
  workspaces: Workspace[];
  inboxCount: number;
  userEmail?: string | null;
  onCaptureClick: () => void;
  onSearchClick: () => void;
  onNewThreadClick: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();

  const navPrimaryClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-sm transition-all duration-150 ${
      active
        ? "bg-accent-soft text-accent font-medium"
        : "text-text-secondary hover:text-text-primary hover:bg-hover"
    }`;

  const wsClass = (active: boolean) =>
    `flex items-center rounded-[5px] px-3 py-1.5 text-xs transition-all duration-150 ${
      active
        ? "bg-hover text-text-primary font-medium"
        : "text-text-tertiary hover:text-text-secondary hover:bg-hover/60"
    }`;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/5 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-52 flex-shrink-0 flex-col bg-surface border-r border-border-light transition-transform duration-250 md:sticky md:top-0 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 pt-5 pb-6">
          <span className="text-sm font-semibold tracking-tight text-text-primary">Nexus</span>
        </div>

        {/* Primary navigation */}
        <nav className="flex flex-col gap-0.5 px-2.5">
          <Link href="/" onClick={onMobileClose} className={navPrimaryClass(pathname === "/")}>
            <Radar size={15} strokeWidth={1.5} />
            <span>Radar</span>
          </Link>

          <Link
            href="/inbox"
            onClick={onMobileClose}
            className={navPrimaryClass(pathname === "/inbox")}
          >
            <Inbox size={15} strokeWidth={1.5} />
            <span className="flex-1">Inbox</span>
            {inboxCount > 0 && (
              <span className="min-w-[20px] rounded-[4px] bg-accent px-1.5 py-[2px] text-[10px] font-medium leading-normal text-white text-center">
                {inboxCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Quick actions */}
        <div className="mt-4 flex flex-col gap-0.5 px-2.5">
          <button
            onClick={onCaptureClick}
            className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-sm text-text-tertiary transition-all duration-150 hover:bg-hover hover:text-text-secondary"
          >
            <Plus size={15} strokeWidth={1.5} />
            <span className="flex-1 text-left">Capturar</span>
            <kbd className="rounded-[3px] border border-border bg-surface px-1 py-[1px] text-[9px] font-medium text-text-quaternary">
              N
            </kbd>
          </button>

          <button
            onClick={onSearchClick}
            className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-sm text-text-tertiary transition-all duration-150 hover:bg-hover hover:text-text-secondary"
          >
            <Search size={15} strokeWidth={1.5} />
            <span className="flex-1 text-left">Buscar</span>
            <kbd className="rounded-[3px] border border-border bg-surface px-1 py-[1px] text-[9px] font-medium text-text-quaternary">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Workspaces section */}
        <div className="mt-7 mb-2 px-4">
          <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-text-quaternary">
            Workspaces
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-2.5 pb-3">
          {workspaces.length === 0 ? (
            <div className="mx-1 rounded-[6px] border border-dashed border-border-light/60 px-3 py-3">
              <p className="text-center text-xs text-text-quaternary">Nenhum ainda</p>
            </div>
          ) : (
            <div className="flex flex-col gap-px">
              {workspaces.map((ws) => {
                const active = pathname === `/workspace/${ws.id}`;
                return (
                  <Link
                    key={ws.id}
                    href={`/workspace/${ws.id}`}
                    onClick={onMobileClose}
                    className={wsClass(active)}
                    title={ws.description ?? ws.name}
                  >
                    <span className="flex-1 truncate">{ws.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
          <Link
            href="/workspace/new"
            onClick={onMobileClose}
            className="mt-1.5 flex items-center gap-2 rounded-[5px] px-3 py-1.5 text-xs text-text-quaternary transition-all duration-150 hover:text-text-secondary hover:bg-hover/60"
          >
            <Plus size={11} strokeWidth={1.5} />
            <span>Novo workspace</span>
          </Link>
        </div>

        {/* Bottom: User */}
        <div className="border-t border-border-light p-2.5">
          {userEmail && (
            <div className="flex items-center gap-2 rounded-[5px] px-3 py-1.5">
              <span className="min-w-0 flex-1 truncate text-xs text-text-quaternary" title={userEmail}>
                {userEmail}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  title="Sair"
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-text-quaternary transition-colors hover:bg-hover hover:text-text-secondary"
                >
                  <LogOut size={11} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
