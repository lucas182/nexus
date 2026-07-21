"use client";

import { deleteThread } from "@/lib/actions/threads";
import { ConfirmDeleteMenu } from "@/components/confirm-delete-menu";

export function ThreadRowMenu({
  threadId,
  workspaceId,
  threadTitle,
  eventCount,
  align = "right",
}: {
  threadId: string;
  workspaceId: string;
  threadTitle: string;
  eventCount: number;
  align?: "left" | "right";
}) {
  const confirmMessage =
    eventCount > 0 ? (
      <>
        Excluir <strong className="text-text-primary">{threadTitle}</strong> e seus{" "}
        {eventCount} acontecimento{eventCount > 1 ? "s" : ""}? Isso não pode ser desfeito.
      </>
    ) : (
      <>
        Excluir <strong className="text-text-primary">{threadTitle}</strong>? Isso não pode ser
        desfeito.
      </>
    );

  return (
    <ConfirmDeleteMenu
      action={deleteThread}
      hiddenFields={{ id: threadId, workspace_id: workspaceId }}
      menuItemLabel="Excluir assunto"
      confirmMessage={confirmMessage}
      align={align}
    />
  );
}
