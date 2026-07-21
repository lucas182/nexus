"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Radar, Plus, Search, LogOut, PenLine } from "lucide-react";

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
        {/* Brand + Capture */}
        <div className="flex items-center justify-between px-3 pt-4 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              Nexus
            </span>
            <span className="h-1 w-1 rounded-full bg-accent/60" />
          </div>
          <button
            onClick={onCaptureClick}
            title="Captura Rápida (+)"
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-hover hover:text-text-primary"
          >
            <Plus size={14} strokeWidth={1.5} />
          </button>
        </div>

        {/* Always-visible quick action */}
        <div className="px-2 pb-2">
          <button
            onClick={onNewThreadClick}
            title="Novo assunto (Shift+N)"
            className="flex w-full items-center gap-2 rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-all hover:border-accent-muted hover:bg-accent-soft hover:text-accent"
          >
            <PenLine size={13} strokeWidth={1.5} />
            <span className="flex-1 text-left">Novo assunto</span>
          </button>
        </div>

        {/* Navigation */}
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

        {/* Workspaces section */}
        <div className="mt-6 mb-1 flex items-center justify-between px-3">
          <span className="text-[10px] font-medium uppercase tracking-widest text-text-tertiary">
            Workspaces
          </span>
          <Link
            href="/workspace/new"
            onClick={onMobileClose}
            title="Novo Workspace"
            className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
              workspaces.length === 0
                ? "text-accent hover:bg-accent-soft"
                : "text-text-tertiary hover:text-text-primary hover:bg-hover"
            }`}
          >
            <Plus size={12} strokeWidth={1.5} />
          </Link>
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
                  <div key={ws.id} className="group relative">
                    <Link
                      href={`/workspace/${ws.id}`}
                      onClick={onMobileClose}
                      className={navItemClass(active)}
                    >
                      <WorkspaceIcon slug={ws.icon} size={16} strokeWidth={1.5} />
                      <span className="flex-1 truncate">{ws.name}</span>
                      <span className="w-4 flex-shrink-0" />
                    </Link>
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                      <WorkspaceRowMenu workspaceId={ws.id} workspaceName={ws.name} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom: Search + User */}
        <div className="flex flex-col gap-0.5 border-t border-border-light p-2">
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
