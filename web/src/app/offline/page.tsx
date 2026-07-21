export default function OfflinePage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-bg px-6 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
        <span className="text-sm font-semibold">N</span>
      </div>
      <h1 className="text-base font-semibold text-text-primary">Você está offline</h1>
      <p className="max-w-xs text-sm text-text-tertiary leading-relaxed">
        Sem conexão no momento. Verifique sua internet e tente novamente.
      </p>
    </div>
  );
}
