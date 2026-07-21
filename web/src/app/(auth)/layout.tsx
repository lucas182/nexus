import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2 justify-center">
          <Link href="/" className="text-lg font-medium tracking-tight text-text-primary">
            Nexus
          </Link>
        </div>
        <div className="rounded-[8px] border border-border-light bg-surface p-5">
          {children}
        </div>
        <p className="mt-4 text-center text-xs text-text-quaternary">
          Seu Sistema Operacional Pessoal de Contexto.
        </p>
      </div>
    </div>
  );
}
