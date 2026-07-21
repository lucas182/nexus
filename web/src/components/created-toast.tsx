"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check } from "lucide-react";

export function CreatedToast({ label }: { label: string }) {
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const dismiss = setTimeout(() => setVisible(false), 2400);
    const clean = setTimeout(() => router.replace(pathname), 2600);
    return () => {
      clearTimeout(dismiss);
      clearTimeout(clean);
    };
  }, [router, pathname]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-toast-in fixed left-1/2 top-5 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border-light bg-surface py-1.5 pl-2 pr-3.5 text-sm text-text-primary shadow-sm"
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Check size={9} strokeWidth={2.5} />
      </span>
      <span className="text-xs">{label}</span>
    </div>
  );
}
