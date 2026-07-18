export default function OfflinePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-bg px-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <span className="text-sm font-semibold">N</span>
      </div>
      <h1 className="mt-2 text-lg font-semibold text-text-primary">Você está offline</h1>
      <p className="max-w-xs text-sm text-text-tertiary">
        Sem conexão no momento. Verifique sua internet e tente novamente.
      </p>
    </div>
  );
}
