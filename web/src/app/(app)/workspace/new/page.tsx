import { createWorkspace } from "@/lib/actions/workspaces";

export default function NewWorkspacePage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-text-primary">
        Novo Workspace
      </h1>
      <form action={createWorkspace} className="flex flex-col gap-3">
        <input
          name="name"
          placeholder="Nome (ex: Casa, Tríade.fit, Escola)"
          required
          className="rounded-md border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <select
          name="icon"
          defaultValue="home"
          className="rounded-md border border-border px-3 py-2 text-sm text-text-secondary"
        >
          <option value="home">🏠 Home</option>
          <option value="zap">⚡ Zap</option>
          <option value="book">📖 Livro</option>
        </select>
        <textarea
          name="description"
          placeholder="Descrição curta"
          className="h-20 resize-none rounded-md border border-border px-3 py-2 text-sm text-text-primary outline-none focus:border-accent"
        />
        <button
          type="submit"
          className="mt-1 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Criar Workspace
        </button>
      </form>
    </div>
  );
}
