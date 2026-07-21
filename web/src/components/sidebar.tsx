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

  const navItemClass = (active: boolean) =>
    `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-all ${
      active
        ? "bg-accent-soft text-accent font-medium"
        : "text-text-secondary hover:text-text-primary hover:bg-hover"
    }`;

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-screen w-56 flex-shrink-0 flex-col bg-surface border-r border-border-light transition-transform duration-200 md:sticky md:top-0 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2 px-3 pt-5 pb-5">
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            Nexus
          </span>
          <span className="h-1 w-1 rounded-full bg-accent/60" />
        </div>

        {/* Navigation — just the essentials */}
        <nav className="flex flex-col gap-0.5 px-2">
          <Link href="/" onClick={onMobileClose} className={navItemClass(pathname === "/")}>
            <Radar size={16} strokeWidth={1.5} />
            <span>Radar</span>
          </Link>

          <Link
            href="/inbox"
            onClick={onMobileClose}
            className={navItemClass(pathname === "/inbox")}
          >
            <Inbox size={16} strokeWidth={1.5} />
            <span className="flex-1">Inbox</span>
            {inboxCount > 0 && (
              <span className="min-w-[18px] rounded-md bg-accent px-1.5 py-[1px] text-[10px] font-medium leading-[18px] text-white text-center">
                {inboxCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Quick actions */}
        <div className="mt-3 flex flex-col gap-0.5 px-2">
          <button
            onClick={onCaptureClick}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-text-tertiary transition-colors hover:bg-hover hover:text-text-secondary"
          >
            <Plus size={16} strokeWidth={1.5} />
            <span className="flex-1 text-left">Capturar</span>
            <kbd className="rounded border border-border bg-hover px-1.5 py-[1px] text-[9px] font-medium text-text-tertiary">
              N
            </kbd>
          </button>

          <button
            onClick={onSearchClick}
            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-text-tertiary transition-colors hover:bg-hover hover:text-text-secondary"
          >
            <Search size={16} strokeWidth={1.5} />
            <span className="flex-1 text-left">Buscar</span>
            <kbd className="rounded border border-border bg-hover px-1.5 py-[1px] text-[9px] font-medium text-text-tertiary">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Content areas — shown contextually from Radar/Inbox */}
        <div className="mt-6 mb-1 px-3">
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
            Workspaces
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {workspaces.length === 0 ? (
            <div className="mx-1 rounded-md border border-dashed border-border-light px-3 py-4 text-center">
              <p className="text-xs text-text-tertiary">Nenhum ainda</p>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {workspaces.map((ws) => {
                const active = pathname === `/workspace/${ws.id}`;
                return (
                  <Link
                    key={ws.id}
                    href={`/workspace/${ws.id}`}
                    onClick={onMobileClose}
                    className={navItemClass(active)}
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
            className="mt-1 flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-text-tertiary transition-colors hover:text-text-primary hover:bg-hover"
          >
            <Plus size={12} strokeWidth={1.5} />
            <span>Novo workspace</span>
          </Link>
        </div>

        {/* Bottom: User */}
        <div className="flex flex-col gap-0.5 border-t border-border-light p-2">
          {userEmail && (
            <div className="flex items-center gap-2 rounded-md px-2.5 py-1.5">
              <span className="min-w-0 flex-1 truncate text-xs text-text-tertiary" title={userEmail}>
                {userEmail}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  title="Sair"
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded text-text-tertiary transition-colors hover:bg-hover hover:text-text-primary"
                >
                  <LogOut size={12} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
