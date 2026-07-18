-- Nexus MVP schema — 6 tables per MVP_BLUEPRINT.md section 5.
-- Single-tenant per account: every table is scoped by user_id (directly or
-- transitively through workspace_id/thread_id) and protected by RLS.

create extension if not exists "pgcrypto";

-- ─── workspaces ───────────────────────────────────────────────────────────
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  icon text not null default 'home',
  description text,
  context_status text,
  context_maior_risco text,
  context_decisao_recente text,
  context_proximo_passo text,
  context_updated_at timestamptz,
  created_at timestamptz not null default now()
);

create index workspaces_user_id_idx on workspaces (user_id);

-- ─── threads ──────────────────────────────────────────────────────────────
create type thread_status as enum ('created', 'in_progress', 'paused', 'resolved', 'archived');

create table threads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  title text not null,
  objetivo text,
  resumo_vivo text,
  status thread_status not null default 'created',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index threads_workspace_id_idx on threads (workspace_id);

-- ─── events ───────────────────────────────────────────────────────────────
create type event_type as enum ('decision', 'idea', 'problem', 'note', 'learning', 'meeting', 'activity');
create type impact_level as enum ('low', 'medium', 'high');

create table events (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads (id) on delete cascade,
  type event_type not null,
  description text not null,
  impact impact_level not null default 'medium',
  metadata jsonb not null default '{}'::jsonb,
  timestamp timestamptz not null default now()
);

create index events_thread_id_idx on events (thread_id);

-- ─── knowledge ────────────────────────────────────────────────────────────
create type knowledge_type as enum ('consolidatedDecision', 'architectureDefinition', 'process', 'pattern', 'validatedHypothesis');

create table knowledge (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references threads (id) on delete cascade,
  type knowledge_type not null,
  title text not null,
  content text not null,
  source_event_ids uuid[] not null default '{}',
  version integer not null default 1,
  updated_at timestamptz not null default now()
);

create index knowledge_thread_id_idx on knowledge (thread_id);

-- ─── insights ─────────────────────────────────────────────────────────────
create type insight_type as enum ('stalledThread', 'inboxOverload', 'contradiction', 'regression');
create type insight_status as enum ('active', 'dismissed');

create table insights (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces (id) on delete cascade,
  type insight_type not null,
  message text not null,
  related_entity_ids uuid[] not null default '{}',
  status insight_status not null default 'active',
  created_at timestamptz not null default now()
);

create index insights_workspace_id_idx on insights (workspace_id);

-- ─── inbox_items ──────────────────────────────────────────────────────────
create type inbox_status as enum ('pending', 'classified', 'discarded');

create table inbox_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  raw_text text not null,
  suggested_workspace_id uuid references workspaces (id) on delete set null,
  suggested_thread_id uuid references threads (id) on delete set null,
  status inbox_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index inbox_items_user_id_idx on inbox_items (user_id);

-- ─── Row Level Security ───────────────────────────────────────────────────
-- Regra arquitetural imutável nº 7 (MVP_BLUEPRINT.md): single-tenant por conta,
-- RLS estritamente por user_id em todas as tabelas.

alter table workspaces enable row level security;
alter table threads enable row level security;
alter table events enable row level security;
alter table knowledge enable row level security;
alter table insights enable row level security;
alter table inbox_items enable row level security;

create policy "workspaces_owner" on workspaces
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "threads_owner" on threads
  for all using (
    exists (select 1 from workspaces w where w.id = threads.workspace_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from workspaces w where w.id = threads.workspace_id and w.user_id = auth.uid())
  );

create policy "events_owner" on events
  for all using (
    exists (
      select 1 from threads t
      join workspaces w on w.id = t.workspace_id
      where t.id = events.thread_id and w.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from threads t
      join workspaces w on w.id = t.workspace_id
      where t.id = events.thread_id and w.user_id = auth.uid()
    )
  );

create policy "knowledge_owner" on knowledge
  for all using (
    exists (
      select 1 from threads t
      join workspaces w on w.id = t.workspace_id
      where t.id = knowledge.thread_id and w.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from threads t
      join workspaces w on w.id = t.workspace_id
      where t.id = knowledge.thread_id and w.user_id = auth.uid()
    )
  );

create policy "insights_owner" on insights
  for all using (
    exists (select 1 from workspaces w where w.id = insights.workspace_id and w.user_id = auth.uid())
  ) with check (
    exists (select 1 from workspaces w where w.id = insights.workspace_id and w.user_id = auth.uid())
  );

create policy "inbox_items_owner" on inbox_items
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ─── context_updated_at automation ────────────────────────────────────────
-- Regra do blueprint: Workspace.context_updated_at é atualizado automaticamente
-- quando um Event impact=High é criado em uma das suas Threads.
create or replace function set_workspace_context_updated_at()
returns trigger as $$
begin
  if new.impact = 'high' then
    update workspaces
    set context_updated_at = now()
    where id = (select workspace_id from threads where id = new.thread_id);
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger events_high_impact_updates_workspace
  after insert on events
  for each row
  execute function set_workspace_context_updated_at();

-- ─── threads.updated_at bump on new event ─────────────────────────────────
create or replace function bump_thread_updated_at()
returns trigger as $$
begin
  update threads set updated_at = now() where id = new.thread_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger events_bump_thread_updated_at
  after insert on events
  for each row
  execute function bump_thread_updated_at();
