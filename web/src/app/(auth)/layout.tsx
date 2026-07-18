export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-lg border border-border-light bg-surface p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-1.5">
          <span className="text-lg font-semibold tracking-tight text-text-primary">
            Nexus
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        </div>
        {children}
      </div>
    </div>
  );
}
