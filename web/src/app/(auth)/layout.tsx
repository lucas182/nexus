import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2 justify-center">
          <Link href="/" className="text-lg font-semibold tracking-tight text-text-primary">
            Nexus
          </Link>
          <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
        </div>
        <div className="rounded-lg border border-border-light bg-surface p-6 shadow-sm">
          {children}
        </div>
        <p className="mt-4 text-center text-xs text-text-tertiary">
          Seu Sistema Operacional Pessoal de Contexto.
        </p>
      </div>
    </div>
  );
}
