# Nexus — Web (Sprint 1 + 2)

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

## Deliberately out of scope

Per `MVP_BLUEPRINT.md` §15 (Sprint 3): LLM-assisted classification, automatic
thread/workspace summarization, semantic insights (contradiction/dependency
detection), Requested Insights on demand.

## Deploying

Connected to Vercel, auto-deploys on push to `main`. Project env vars
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`NEXT_PUBLIC_SITE_URL`) are set in the Vercel project's Production
environment. The Supabase project's Auth → URL Configuration must list the
production URL's `/auth/callback` as a Redirect URL for email confirmation to
work there.
