import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { NewWorkspaceForm } from "@/components/new-workspace-form";

export default function NewWorkspacePage() {
  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-text-tertiary transition-colors hover:text-text-secondary"
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        Voltar ao Radar
      </Link>

      <div>
        <h1 className="mb-1.5 text-xl font-semibold tracking-tight text-text-primary">
          Novo Workspace
        </h1>
        <p className="mb-8 text-sm text-text-tertiary leading-relaxed">
          Um Workspace representa uma área importante da sua vida — um projeto, sua casa, os
          estudos, um negócio. Você registra ideias, decisões e acontecimentos dentro dele, e o
          Nexus lembra por você.
        </p>

        <NewWorkspaceForm />
      </div>
    </div>
  );
}
