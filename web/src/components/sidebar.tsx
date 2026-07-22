"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inbox, Radar, Plus, Search, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    `flex items-center gap-3 md:gap-2.5 rounded-[8px] md:rounded-[6px] px-4 md:px-3 py-3 md:py-2 text-base md:text-sm transition-all duration-150 press ${
      active
        ? "bg-accent-soft text-accent font-medium"
        : "text-text-secondary hover:text-text-primary hover:bg-hover"
    }`;

  const wsClass = (active: boolean) =>
    `flex items-center rounded-[8px] md:rounded-[5px] px-4 md:px-3 py-2.5 md:py-1.5 text-sm md:text-xs transition-all duration-150 press ${
      active
        ? "bg-hover text-text-primary font-medium"
        : "text-text-tertiary hover:text-text-secondary hover:bg-hover/60"
    }`;

  const SidebarContent = (
    <>
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 md:px-4 pt-6 md:pt-5 pb-8 md:pb-6">
        <span className="text-base md:text-sm font-semibold tracking-tight text-text-primary">Nexus</span>
      </div>

      {/* Primary navigation */}
      <nav className="flex flex-col gap-1 md:gap-0.5 px-3 md:px-2.5">
        <Link href="/" onClick={onMobileClose} className={navPrimaryClass(pathname === "/")}>
          <Radar size={18} strokeWidth={1.5} className="md:w-[15px] md:h-[15px]" />
          <span>Radar</span>
        </Link>

        <Link
          href="/inbox"
          onClick={onMobileClose}
          className={navPrimaryClass(pathname === "/inbox")}
        >
          <Inbox size={18} strokeWidth={1.5} className="md:w-[15px] md:h-[15px]" />
          <span className="flex-1">Inbox</span>
          {inboxCount > 0 && (
            <span className="min-w-[22px] md:min-w-[20px] rounded-[5px] md:rounded-[4px] bg-accent px-2 py-0.5 md:px-1.5 md:py-[2px] text-xs md:text-[10px] font-medium leading-normal text-white text-center">
              {inboxCount}
            </span>
          )}
        </Link>
      </nav>

      {/* Quick actions */}
      <div className="mt-6 md:mt-4 flex flex-col gap-1 md:gap-0.5 px-3 md:px-2.5">
        <button
          onClick={() => { onCaptureClick(); onMobileClose(); }}
          className="flex w-full items-center gap-3 md:gap-2.5 rounded-[8px] md:rounded-[6px] px-4 md:px-3 py-3 md:py-2 text-base md:text-sm text-text-tertiary transition-all duration-150 hover:bg-hover hover:text-text-secondary press"
        >
          <Plus size={18} strokeWidth={1.5} className="md:w-[15px] md:h-[15px]" />
          <span className="flex-1 text-left">Capturar</span>
          <kbd className="hidden md:inline-block rounded-[3px] border border-border bg-surface px-1 py-[1px] text-[9px] font-medium text-text-quaternary">
            N
          </kbd>
        </button>

        <button
          onClick={() => { onSearchClick(); onMobileClose(); }}
          className="flex w-full items-center gap-3 md:gap-2.5 rounded-[8px] md:rounded-[6px] px-4 md:px-3 py-3 md:py-2 text-base md:text-sm text-text-tertiary transition-all duration-150 hover:bg-hover hover:text-text-secondary press"
        >
          <Search size={18} strokeWidth={1.5} className="md:w-[15px] md:h-[15px]" />
          <span className="flex-1 text-left">Buscar</span>
          <kbd className="hidden md:inline-block rounded-[3px] border border-border bg-surface px-1 py-[1px] text-[9px] font-medium text-text-quaternary">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Workspaces section */}
      <div className="mt-8 md:mt-7 mb-3 md:mb-2 px-6 md:px-4">
        <span className="text-[11px] md:text-[9px] font-medium uppercase tracking-[0.08em] text-text-quaternary">
          Workspaces
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-2.5 pb-4 md:pb-3">
        {workspaces.length === 0 ? (
          <div className="mx-2 md:mx-1 rounded-[8px] md:rounded-[6px] border border-dashed border-border-light/60 px-4 py-4 md:px-3 md:py-3">
            <p className="text-center text-sm md:text-xs text-text-quaternary">Nenhum ainda</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 md:gap-px">
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
          className="mt-2 md:mt-1.5 flex items-center gap-3 md:gap-2 rounded-[8px] md:rounded-[5px] px-4 md:px-3 py-2.5 md:py-1.5 text-sm md:text-xs text-text-quaternary transition-all duration-150 hover:text-text-secondary hover:bg-hover/60 press"
        >
          <Plus size={14} strokeWidth={1.5} className="md:w-[11px] md:h-[11px]" />
          <span>Novo workspace</span>
        </Link>
      </div>

      {/* Bottom: User */}
      <div className="border-t border-border-light p-4 md:p-2.5 mb-safe-bottom">
        {userEmail && (
          <div className="flex items-center gap-3 md:gap-2 rounded-[8px] md:rounded-[5px] px-2 md:px-3 py-2 md:py-1.5">
            <span className="min-w-0 flex-1 truncate text-sm md:text-xs text-text-quaternary" title={userEmail}>
              {userEmail}
            </span>
            <form action={logout}>
              <button
                type="submit"
                title="Sair"
                className="flex h-9 w-9 md:h-5 md:w-5 flex-shrink-0 items-center justify-center rounded-md md:rounded text-text-quaternary transition-colors hover:bg-hover hover:text-text-secondary press"
              >
                <LogOut size={16} strokeWidth={1.5} className="md:w-[11px] md:h-[11px]" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-72 flex-shrink-0 flex-col bg-surface border-r border-border-light md:hidden shadow-2xl"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex sticky top-0 inset-y-0 left-0 z-30 h-screen w-52 flex-shrink-0 flex-col bg-surface border-r border-border-light">
        {SidebarContent}
      </aside>
    </>
  );
}
