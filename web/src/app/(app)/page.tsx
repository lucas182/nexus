import Link from "next/link";
import { getInboxCount } from "@/lib/data/inbox";
import { getRecentEventsWithContext } from "@/lib/data/events";
import { getWorkspaces } from "@/lib/data/workspaces";
import { getStalledThreads, getInboxOverloadCount, daysSince } from "@/lib/data/insights";
import { RadarSection } from "@/components/radar-section";
import { EventTypeBadge } from "@/components/badges";

function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function RadarPage() {
  const [inboxCount, recentEvents, workspaces, stalledThreads, inboxOverloadCount] =
    await Promise.all([
      getInboxCount(),
      getRecentEventsWithContext(8),
      getWorkspaces(),
      getStalledThreads(),
      getInboxOverloadCount(),
    ]);

  const highImpactRecent = recentEvents.filter((e) => e.impact === "high");
  const nextSteps = workspaces.filter((w) => w.context_proximo_passo);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-text-primary">
        Radar do Sistema
      </h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* 1. Onde devo prestar atenção? */}
        <RadarSection title="Onde devo prestar atenção?">
          {inboxOverloadCount > 0 && (
            <Link
              href="/inbox"
              className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
            >
              {inboxOverloadCount}{" "}
              {inboxOverloadCount === 1
                ? "item parado no Inbox há mais de 48h"
                : "itens parados no Inbox há mais de 48h"}
            </Link>
          )}
          {inboxCount > 0 ? (
            <Link
              href="/inbox"
              className="rounded-md bg-accent-soft px-3 py-2 text-sm text-accent hover:bg-accent-muted"
            >
              {inboxCount} {inboxCount === 1 ? "item aguardando" : "itens aguardando"}{" "}
              classificação no Inbox
            </Link>
          ) : (
            <p className="text-sm text-text-tertiary">Inbox limpo. Nada pendente agora.</p>
          )}
        </RadarSection>

        {/* 2. O que mudou? */}
        <RadarSection title="O que mudou? (alto impacto)">
          {highImpactRecent.length === 0 ? (
            <p className="text-sm text-text-tertiary">
              Nenhum acontecimento de alto impacto recente.
            </p>
          ) : (
            highImpactRecent.slice(0, 5).map((e) => (
              <Link
                key={e.id}
                href={`/thread/${e.thread_id}`}
                className="flex items-start justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-hover"
              >
                <span className="flex-1 text-text-primary">{e.description}</span>
                <span className="flex-shrink-0 text-xs text-text-tertiary">
                  {e.thread?.workspace?.name}
                </span>
              </Link>
            ))
          )}
        </RadarSection>

        {/* 3. O que está parado? */}
        <RadarSection title="O que está parado?">
          {stalledThreads.length === 0 ? (
            <p className="text-sm text-text-tertiary">
              Nenhuma Thread parada. Tudo em andamento.
            </p>
          ) : (
            stalledThreads.map((t) => (
              <Link
                key={t.id}
                href={`/thread/${t.id}`}
                className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-hover"
              >
                <span className="flex-1 text-text-primary">{t.title}</span>
                <span className="flex-shrink-0 text-xs text-text-tertiary">
                  {daysSince(t.updated_at)}d parada · {t.workspace_name}
                </span>
              </Link>
            ))
          )}
        </RadarSection>

        {/* 4. Qual deveria ser meu próximo passo? */}
        <RadarSection title="Qual deveria ser meu próximo passo?">
          {nextSteps.length === 0 ? (
            <p className="text-sm text-text-tertiary">
              Nenhum Workspace com próximo passo definido ainda.
            </p>
          ) : (
            nextSteps.map((w) => (
              <Link
                key={w.id}
                href={`/workspace/${w.id}`}
                className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-hover"
              >
                <span className="text-text-primary">{w.context_proximo_passo}</span>
                <span className="flex-shrink-0 text-xs text-text-tertiary">{w.name}</span>
              </Link>
            ))
          )}
        </RadarSection>
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold text-text-primary">
          Timeline de Acontecimentos Recentes
        </h2>
        <div className="rounded-lg border border-border-light bg-surface px-4">
          {recentEvents.length === 0 ? (
            <p className="py-6 text-center text-sm text-text-tertiary">
              Nada registrado ainda. Capture algo com o botão + ou tecla &quot;+&quot;.
            </p>
          ) : (
            recentEvents.map((e) => (
              <Link
                key={e.id}
                href={`/thread/${e.thread_id}`}
                className="flex items-center gap-3 border-b border-border-light py-3 last:border-0 hover:opacity-80"
              >
                <EventTypeBadge type={e.type} />
                <span className="flex-1 truncate text-sm text-text-primary">
                  {e.description}
                </span>
                <span className="flex-shrink-0 text-xs text-text-tertiary">
                  {e.thread?.workspace?.name} · {formatDateTime(e.timestamp)}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
