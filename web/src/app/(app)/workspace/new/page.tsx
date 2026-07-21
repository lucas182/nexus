import Link from "next/link";

import { NewWorkspaceForm } from "@/components/new-workspace-form";

export default function NewWorkspacePage() {
  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-tertiary transition-colors hover:text-text-secondary"
      >
        ← Radar
      </Link>

      <div>
        <h1 className="mb-1.5 text-xl font-semibold tracking-tight text-text-primary">
          Novo Workspace
        </h1>
        <p className="mb-6 text-sm text-text-tertiary leading-relaxed">
          Um Workspace representa uma área importante da sua vida. Você pode editá-lo depois.
        </p>

        <NewWorkspaceForm />
      </div>
    </div>
  );
}
