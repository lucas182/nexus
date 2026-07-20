# NEXUS — Sprint 2.5: Observabilidade e Memória Comportamental

> Documento interno de referência oficial para desenvolvimento.
> Fase intermediária entre a Sprint 2 (`MVP_BLUEPRINT.md` §14, já implementada — ver `web/README.md`)
> e a Sprint 3 (`MVP_BLUEPRINT.md` §15). Não altera o escopo do MVP definido em `MVP_BLUEPRINT.md`
> nem as regras de `DOMAIN.md` — apenas adiciona uma camada de observação sobre o que já existe.

---

## 1. Objetivo

Fazer o Nexus **aprender como o usuário trabalha antes de começar a sugerir qualquer coisa**.

Esta sprint **não utiliza LLM, não chama `AIService`, e não toma nenhuma decisão automática**.
Ela existe para produzir uma coisa só: **contexto rico e real** sobre o comportamento do usuário,
para que a Sprint 3 tenha dados de verdade para raciocinar em cima — em vez de gerar insights
semânticos no vácuo, sem noção de como o usuário de fato usa o sistema.

---

## 2. Filosofia

> Antes de uma IA dar conselhos, ela precisa observar.

O Nexus não deve apenas armazenar conhecimento. Ele deve **aprender padrões**.

Toda interação relevante do usuário passa a gerar sinais. Esses sinais serão utilizados
futuramente pela IA (Sprint 3+), mas nesta sprint eles servem a um propósito mais simples:
responder, com dados reais, perguntas que hoje o Nexus não consegue responder:

- Quais Workspaces recebem mais atenção?
- Quais Threads ficam abandonadas?
- Quanto tempo uma decisão demora para ser consolidada?
- Quais tipos de Event eu mais crio?
- Em quais horários costumo capturar ideias?
- Qual assunto ocupa mais espaço na minha mente?

Isso é consistente com os princípios já congelados em `MVP_BLUEPRINT.md` §2: **contexto acima de
informação** — o valor não é o dado armazenado, é o que ele revela quando conectado a outros. Uma
`Observation` é justamente esse tipo de dado: sozinha não significa nada, agregada revela padrão.

**Não é analytics.** Não existe painel de métricas de produto, não existe funil, não existe
segmentação. Existe apenas construção de contexto para o próprio usuário e, depois, para a IA que
vai raciocinar em nome dele.

---

## 3. Nova Entidade: `Observation`

Uma `Observation` representa um **comportamento observado**. Ela nunca é criada pelo usuário —
é criada automaticamente pelo sistema, no momento em que uma ação relevante acontece.

Segue o mesmo princípio de imutabilidade dos `Events` (`MVP_BLUEPRINT.md` §16, regra 2): uma
`Observation`, uma vez criada, nunca é editada. Correções ou eventos futuros geram novas
`Observations` — o histórico bruto nunca é reescrito.

### Tipos de Observation (v1)

| `type` | Disparado quando... |
|---|---|
| `workspace_opened` | Usuário abre a tela de um Workspace |
| `thread_opened` | Usuário abre a tela de uma Thread |
| `knowledge_viewed` | Usuário visualiza um item de Knowledge |
| `insight_requested` | Usuário aciona um Requested Insight (preparação para Sprint 3) |
| `capture_created` | Um item novo entra no Inbox via Captura Rápida |
| `search_performed` | Uma busca é realizada no Global Search |
| `inbox_item_classified` | Um item do Inbox é classificado (vira Event) |
| `event_created` | Um Event é criado (via classificação ou direto na Thread) |
| `knowledge_consolidated` | Um Knowledge é consolidado a partir de Events |
| `thread_status_changed` | O status de uma Thread muda (ex: `in_progress` → `paused`) |
| `thread_archived` | Uma Thread é arquivada |

A lista é deliberadamente pequena — cobre exatamente as ações já existentes no produto. Novos
tipos só entram quando uma nova ação de usuário existir de fato no código, nunca especulativamente.

### Modelo de dados

```
Observation
├── id                uuid, pk
├── user_id           uuid, fk auth.users — dono do dado (RLS)
├── type              observation_type (enum, tabela acima)
├── workspace_id      uuid, fk workspaces, nullable — denormalizado para agregação rápida
├── thread_id         uuid, fk threads, nullable
├── entity_id         uuid, nullable — aponta para o registro afetado (event, knowledge, inbox_item...)
├── metadata          jsonb — livre, ex: { "query": "..." } em search_performed
└── created_at        timestamptz
```

`workspace_id` e `thread_id` são denormalizados diretamente na `Observation` (em vez de exigir
join até `events`/`threads` toda vez) porque toda métrica do Behavior Engine (§4) agrega por
Workspace ou por Thread — essa é a leitura mais frequente do sistema, então vale desnormalizar
na escrita.

---

## 4. Behavior Engine

Um serviço novo, **sem IA**, que apenas interpreta os dados já coletados. Vive em
`web/src/lib/behavior/`, no mesmo espírito de `src/lib/data/insights.ts` (funções puras,
determinísticas, sem chamada externa).

```
src/lib/behavior/
├── log.ts       — logObservation(): grava uma Observation, nunca bloqueia a ação principal
└── metrics.ts   — funções de agregação (leitura), consumidas pela UI
```

### `log.ts` — captura de sinal

```ts
logObservation(type: ObservationType, opts?: {
  workspaceId?: string;
  threadId?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void>
```

Regra não-negociável: **uma falha ao gravar uma `Observation` nunca pode quebrar a ação do
usuário.** `logObservation` é sempre `try/catch` internamente e nunca propaga erro — é
"fire-and-forget" do ponto de vista de quem chama. Isso é análogo à forma como `AIService`
(`src/ai/ai-service.ts`) já é isolado do core do produto: telemetria comportamental é uma camada
auxiliar, nunca uma dependência crítica.

Chamado a partir dos Server Actions e data-loaders já existentes, no ponto exato onde a ação
acontece — sem introduzir uma camada de eventos genérica. Exemplos de onde entra:

| Observation | Onde é disparada |
|---|---|
| `workspace_opened` | `src/app/(app)/workspace/[id]/page.tsx` (Server Component, no load) |
| `thread_opened` | `src/app/(app)/thread/[id]/page.tsx` (Server Component, no load) |
| `capture_created` | `src/lib/actions/inbox.ts` (criação de item) |
| `inbox_item_classified` | `src/lib/actions/inbox.ts` (classificação) |
| `event_created` | `src/lib/actions/events.ts` |
| `knowledge_consolidated` | `src/lib/actions/knowledge.ts` |
| `thread_status_changed` / `thread_archived` | `src/lib/actions/threads.ts` |
| `search_performed` | `src/app/api/search/route.ts` |

### `metrics.ts` — leitura agregada

Funções puras, cada uma respondendo a uma das perguntas da Filosofia (§2):

- `getMostActiveWorkspace()` — Workspace com mais `Observations` nos últimos N dias.
- `getAbandonedWorkspaces()` — Workspaces sem nenhuma `Observation` há N dias.
- `getMostActiveThread()` — Thread com mais `Observations`/`Events` recentes.
- `getForgottenThreads()` — Threads `in_progress` sem `Observation` há N dias (complementa,
  não substitui, o `getStalledThreads()` já existente em `insights.ts`, que olha só para Events).
- `getDominantEventTypes()` — distribuição de `event_created` por `type`, no período.
- `getCapturePatterns()` — distribuição de `capture_created` por hora do dia (horário de maior
  captura de ideias).
- `getConsolidationLag()` — tempo médio entre o primeiro Event de uma Thread e a criação do
  Knowledge que o consolidou (`knowledge_consolidated.created_at - min(event.timestamp)` dos
  `source_event_ids`).
- `getConsecutiveActiveDays()` — sequência de dias consecutivos com ao menos uma `Observation`.
- `getDailyTimeline(date)` — contagem de `capture_created`, `event_created` (por tipo, incl.
  decisões), `knowledge_consolidated` e maior intervalo entre `Observations` (sessões) num dia.
- `getWeeklyEvolution()` — comparação semana atual vs. anterior das métricas acima.

Todas as agregações rodam via query SQL direta (Postgres agrupando por `type`/`workspace_id`/
`created_at`) — nenhuma tabela de agregação pré-computada é necessária no volume de dados de um
único usuário. Isso mantém a regra de simplicidade da sprint: sem jobs, sem cron, sem
materialized views.

---

## 5. Timeline Pessoal

Uma visão cronológica do próprio usuário, não dos projetos — "o que eu fiz hoje", não "o que
mudou no Workspace X". Implementada como **seção do Radar**, não como tela nova (ver §7, regra
arquitetural nº 5: máximo de 5 telas).

Exemplo de conteúdo (dados reais, via `getDailyTimeline()`):

```
Hoje
12 capturas · 2 decisões · 1 Knowledge consolidado
Maior intervalo sem atividade: 3h (entre 14h e 17h)
```

---

## 6. Radar Enriquecido

Sem IA. Com dados reais, produzidos pelo Behavior Engine — mesma filosofia de "sussurrar, nunca
gritar" já aplicada aos `InsightChip`s determinísticos da Sprint 2 (`stalledThread`,
`inboxOverload`). Exemplos:

- *"Você acessou o Tríade.fit 18 vezes nesta semana."*
- *"A Thread Arquitetura está parada há 9 dias."*
- *"Você criou 14 ideias mas consolidou apenas 2."*
- *"Seu foco esta semana concentrou-se em Casa."*

Tecnicamente, reaproveita o componente `InsightChip` já existente (mensagem curta, nunca modal,
nunca bloqueia — regra arquitetural nº 6) alimentado por `metrics.ts` em vez de `insights.ts`.
Não é um novo tipo de `Insight` na tabela `insights` (essa tabela é reservada para os tipos do
blueprint, incl. `contradiction`/`regression` da Sprint 3) — é uma renderização direta das
métricas do Behavior Engine, sem persistência própria além da própria `Observation`.

---

## 7. Quais Telas Recebem Melhorias

Nenhuma tela nova é criada — respeita a regra arquitetural nº 5 (`MVP_BLUEPRINT.md` §16).

| Tela | Melhoria |
|---|---|
| **Radar** | Nova seção "Timeline Pessoal" (§5); chips comportamentais adicionais (§6) |
| **Workspace** | Badge de frequência de acesso no painel de contexto (ex: "18 acessos esta semana") |
| **Thread** | Indicador de atividade no `ThreadCard`/`ThreadDetailsPanel` (dias desde a última `Observation`, além do já existente "dias desde o último Event") |
| **Sidebar** | Destaque visual (não numérico obrigatório) do Workspace mais ativo da semana |

---

## 8. Preparação para IA (Sprint 3+)

Nenhuma decisão é tomada automaticamente nesta sprint. O único produto do Behavior Engine é
**contexto**.

O contrato pensado para a Sprint 3: uma função `getUserBehaviorContext(workspaceId?: string)` em
`metrics.ts` que serializa as métricas relevantes (workspace mais ativo, threads esquecidas,
padrão de captura, lag de consolidação) em um objeto simples. A Sprint 3 passa esse objeto como
contexto adicional para `AIService` ao gerar Requested/Passive Insights — por exemplo, um insight
de "Thread parada" pode ser enriquecido de "parada há 9 dias" (já existente) para "parada há 9
dias, mas historicamente você retoma Threads desse Workspace em média a cada 12 dias" (Sprint 3,
usando dado real da Sprint 2.5).

`src/ai/ai-service.ts` não é tocado nesta sprint. A camada de IA continua isolada e sem uso real,
como decidido na ideação original do produto.

---

## 9. Estrutura de Banco Necessária

Nova migration, seguindo exatamente o padrão de `00000000000001_initial_schema.sql`:
`web/supabase/migrations/00000000000003_add_observations.sql`.

```sql
create type observation_type as enum (
  'workspace_opened',
  'thread_opened',
  'knowledge_viewed',
  'insight_requested',
  'capture_created',
  'search_performed',
  'inbox_item_classified',
  'event_created',
  'knowledge_consolidated',
  'thread_status_changed',
  'thread_archived'
);

create table observations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  type observation_type not null,
  workspace_id uuid references workspaces (id) on delete cascade,
  thread_id uuid references threads (id) on delete cascade,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index observations_user_id_idx on observations (user_id);
create index observations_workspace_id_idx on observations (workspace_id);
create index observations_thread_id_idx on observations (thread_id);
create index observations_type_created_at_idx on observations (type, created_at);

alter table observations enable row level security;

create policy "observations_owner" on observations
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
```

Sem tabelas de agregação adicionais (ver §4 — agregação é feita em leitura, não em escrita).
Sem alteração nas 6 tabelas existentes do MVP.

`web/src/types/domain.ts` recebe o tipo espelho:

```ts
export type ObservationType =
  | "workspace_opened"
  | "thread_opened"
  | "knowledge_viewed"
  | "insight_requested"
  | "capture_created"
  | "search_performed"
  | "inbox_item_classified"
  | "event_created"
  | "knowledge_consolidated"
  | "thread_status_changed"
  | "thread_archived";

export interface Observation {
  id: string;
  user_id: string;
  type: ObservationType;
  workspace_id: string | null;
  thread_id: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
```

---

## 10. Novos Componentes

| Componente | Responsabilidade |
|---|---|
| `PersonalTimelineSection` | Seção do Radar com o resumo do dia (§5) |
| `WorkspaceActivityBadge` | Badge de frequência de acesso, usado em Workspace e Sidebar |
| `ThreadActivityMeter` | Indicador de dias desde a última `Observation`, usado em `ThreadCard`/`ThreadDetailsPanel` |

`InsightChip` é **reaproveitado**, não substituído, para os chips comportamentais do Radar (§6).
Nenhum componente de gráfico ou dashboard configurável — mantém a regra "nenhum widget
configurável" (`MVP_BLUEPRINT.md` §9).

---

## 11. Plano de Implementação

1. **Schema** — migration `00000000000003_add_observations.sql` + `Observation`/`ObservationType`
   em `types/domain.ts`.
2. **Captura de sinal** — `src/lib/behavior/log.ts` (`logObservation`) + instrumentar os pontos
   listados em §4 dentro dos Server Actions/loaders já existentes.
3. **Behavior Engine** — `src/lib/behavior/metrics.ts` com as funções de agregação de §4.
4. **UI** — `PersonalTimelineSection` no Radar, chips comportamentais (§6), badges/meters em
   Workspace/Thread/Sidebar (§7/§10).
5. **Documentação** — atualizar `web/README.md` ("O que está implementado") e a tabela de
   roadmap em `MVP_BLUEPRINT.md` §12 apontando para este documento.

---

## 12. Checklist Técnico

- [ ] Migration `observations` (enum + tabela + índices + RLS), seguindo o padrão das migrations existentes
- [ ] `Observation` / `ObservationType` em `src/types/domain.ts`
- [ ] `src/lib/behavior/log.ts` — `logObservation()`, non-blocking, nunca lança erro
- [ ] Instrumentar `capture_created` e `inbox_item_classified` em `src/lib/actions/inbox.ts`
- [ ] Instrumentar `event_created` em `src/lib/actions/events.ts`
- [ ] Instrumentar `knowledge_consolidated` em `src/lib/actions/knowledge.ts`
- [ ] Instrumentar `thread_status_changed` / `thread_archived` em `src/lib/actions/threads.ts`
- [ ] Instrumentar `workspace_opened` em `workspace/[id]/page.tsx`
- [ ] Instrumentar `thread_opened` em `thread/[id]/page.tsx`
- [ ] Instrumentar `search_performed` em `api/search/route.ts`
- [ ] `src/lib/behavior/metrics.ts` — todas as funções de agregação listadas em §4
- [ ] `PersonalTimelineSection` no Radar
- [ ] Chips comportamentais no Radar via `InsightChip` reaproveitado
- [ ] `WorkspaceActivityBadge` no painel de Workspace + Sidebar
- [ ] `ThreadActivityMeter` no `ThreadCard`/`ThreadDetailsPanel`
- [ ] Atualizar `web/README.md`
- [ ] Atualizar tabela de roadmap em `MVP_BLUEPRINT.md` §12

---

## 13. Fora de Escopo desta Sprint

- Qualquer chamada a `AIService`/LLM — continua reservado à Sprint 3
- Requested Insights sob demanda (usa `Observation` no futuro, mas é escopo da Sprint 3)
- Retenção/expiração de `Observations` antigas (tabela cresce sem limpeza por ora — revisitar
  quando o volume de dados justificar)
- Agregação cross-user, analytics de produto, exportação de dados
- Qualquer tela nova ou item de navegação novo
- Memory Replay (§14) — depende desta sprint, mas não é implementado aqui

---

## 14. Visão de Futuro: Memory Replay

Não faz parte do escopo técnico desta sprint, mas é registrado aqui porque **depende
diretamente** da camada de `Observation` construída nela — e porque, na visão do produto, é
provavelmente a funcionalidade mais diferenciada do Nexus a médio prazo.

**A ideia:** dentro de um Workspace ou Thread, um botão "Como chegamos até aqui?" reconstrói a
história do assunto — não como uma timeline de eventos, mas como uma **narrativa**: a ideia
inicial, as discussões, as decisões tomadas, as mudanças de direção, os bugs, os aprendizados, os
conhecimentos consolidados. Como se o sistema contasse a história do projeto, em vez de listar
registros.

**Por que entra no roadmap agora, mesmo sem ser implementado:** a narrativa só é possível se
existir, primeiro, um histórico comportamental rico o bastante para reconstruir *como* a Thread
evoluiu (não só *o quê* aconteceu) — é exatamente o que `Observation` + `Events` + `Knowledge`
juntos fornecem depois desta sprint. Sem a Sprint 2.5, a Sprint 3 teria só `Events`/`Knowledge`
como matéria-prima; com ela, tem também o *padrão de uso* ao redor desses registros.

**Por que não é a Sprint 3:** a Sprint 3 entrega a capacidade de gerar linguagem natural via
`AIService` (resumo automático, insights semânticos). Memory Replay é a aplicação mais ambiciosa
dessa capacidade — uma narrativa longa e coerente, não uma frase curta — e merece ser tratada como
sua própria fase, depois que a integração com LLM já estiver validada em usos mais simples
(Resumo Vivo, contexto de Workspace).

**Posição no roadmap:** Sprint 4 (pós-Sprint 3), a ser detalhada em documento próprio quando
chegar sua vez — não estimada nem escopada aqui, apenas registrada para não ser perdida.

Isso está consistente com a filosofia central do Nexus: **preservar contexto, não apenas dados**
(`DOMAIN.md` §1). Memory Replay é essa filosofia levada ao limite — o sistema não guarda o que
aconteceu, ele lembra *como* aconteceu.

---

*Este documento é a referência oficial da Sprint 2.5. Qualquer divergência entre código e este
documento deve ser resolvida atualizando o documento — não silenciosamente no código, seguindo a
mesma regra de `MVP_BLUEPRINT.md`.*
