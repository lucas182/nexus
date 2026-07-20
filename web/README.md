# Nexus — Web (Sprint 1 + 2 + 2.5)

Next.js (App Router) + Supabase implementation of the Nexus MVP described in
[`../MVP_BLUEPRINT.md`](../MVP_BLUEPRINT.md) and [`../DOMAIN.md`](../DOMAIN.md).
The original UX prototype lives in [`../prototype`](../prototype).

Live at **https://nexuslife360.vercel.app**.

## Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) and grab
   the Project URL and anon key (Project Settings → API).
2. Copy the env file and fill it in:
   ```bash
   cp .env.local.example .env.local
   ```
3. **Run the migrations** in `supabase/migrations/` against your project, in
   order — either paste them into the Supabase SQL Editor, or, if you have the
   Supabase CLI linked to the project:
   ```bash
   npx supabase db push
   ```
4. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) — you'll be redirected
   to `/signup` since there's no session yet.

## What's implemented

**Sprint 1** — the core flow (Capture → Inbox → classify → Event → Radar):
- Auth (Supabase email/password, session refresh via proxy)
- Quick Capture (global `+` shortcut, optional link attachment) → `inbox_items`
- Inbox: listing, heuristic suggestion (keyword match / last-used thread —
  **not AI**, see `src/lib/heuristics.ts`), manual classification into an
  Event, discard
- Workspace: CRUD, editable context panel, Threads list
- Thread: its own route (`/thread/[id]`), editable objetivo/resumo vivo,
  status lifecycle, Event timeline, manual Event creation

**Sprint 2** — intelligence and polish:
- Deterministic Insights: stalled Thread (no Event in 7 days), Inbox overload
  (pending 48h+) — see `src/lib/data/insights.ts`. Surfaced on Radar and on
  Workspace via `InsightChip`
- Manual Knowledge consolidation: select Events on a Thread and consolidate
  them into a Knowledge record
- Global Search (`Ctrl+K`) across Workspaces, Threads, Events, and Knowledge
  (`ILIKE`-based, `src/app/api/search/route.ts`)
- Mobile-responsive shell (collapsible Sidebar drawer below the `md` breakpoint)

Radar now answers all 4 questions from `MVP_BLUEPRINT.md` §8 with real, live-computed data.

**Sprint 2.5** — Observabilidade e Memória Comportamental (see [`../SPRINT_2_5.md`](../SPRINT_2_5.md)):
- `Observation` entity — auto-created behavioral signal (workspace/thread opened, capture
  created, event created, knowledge consolidated, thread status changed, search performed) —
  `supabase/migrations/00000000000003_add_observations.sql`
- Behavior Engine (`src/lib/behavior/`) — `log.ts` (non-blocking `logObservation()`, wired into
  the existing Server Actions and page loaders) and `metrics.ts` (deterministic aggregation, no
  LLM: most/least active Workspace, forgotten Threads, dominant Event types, capture time-of-day
  pattern, consolidation lag, consecutive active days, daily timeline, weekly evolution)
- Personal Timeline section on the Radar (today's captures/decisions/Knowledge, longest gap,
  streak) and behavioral `InsightChip`s (most active Workspace, forgotten Threads, capture vs.
  consolidation ratio) — all derived from real usage, still no LLM
- `WorkspaceActivityBadge` (Workspace header) and `ThreadActivityMeter`
  (`ThreadCard`/`ThreadDetailsPanel`) surfacing access frequency and recency
- No new screens (per the 5-screen rule) and no `AIService` calls — this sprint exists purely to
  give Sprint 3 real behavioral context to reason over

## Deliberately out of scope

Per `MVP_BLUEPRINT.md` §15 (Sprint 3): LLM-assisted classification, automatic
thread/workspace summarization, semantic insights (contradiction/dependency
detection), Requested Insights on demand, Memory Replay (see `SPRINT_2_5.md` §14).

## Deploying

Connected to Vercel, auto-deploys on push to `main`. Project env vars
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SITE_URL`) are set in the Vercel project's Production
environment. The Supabase project's Auth → URL Configuration must list the
production URL's `/auth/callback` as a Redirect URL for email confirmation to
work there.
