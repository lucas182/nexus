"use client";

import { deleteWorkspace } from "@/lib/actions/workspaces";
import { ConfirmDeleteMenu } from "@/components/confirm-delete-menu";

export function WorkspaceRowMenu({
  workspaceId,
  workspaceName,
}: {
  workspaceId: string;
  workspaceName: string;
}) {
  return (
    <ConfirmDeleteMenu
      action={deleteWorkspace}
      hiddenFields={{ id: workspaceId }}
      menuItemLabel="Excluir workspace"
      confirmMessage={
        <>
          Excluir <strong className="text-text-primary">{workspaceName}</strong> e tudo dentro
          dele? Isso não pode ser desfeito.
        </>
      }
    />
  );
}
