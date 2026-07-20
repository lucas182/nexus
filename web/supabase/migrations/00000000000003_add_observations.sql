-- Sprint 2.5 — Observabilidade e Memória Comportamental (ver ../../SPRINT_2_5.md).
-- Observation é criada automaticamente pelo sistema, nunca pelo usuário, e é
-- imutável após criada (mesmo princípio de events, MVP_BLUEPRINT.md §16 regra 2).

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
