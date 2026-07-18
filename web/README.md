# Nexus — Web (Sprint 1)

Next.js (App Router) + Supabase implementation of the Nexus MVP described in
[`../MVP_BLUEPRINT.md`](../MVP_BLUEPRINT.md) and [`../DOMAIN.md`](../DOMAIN.md).
The original UX prototype lives in [`../prototype`](../prototype).

## Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) and grab
   the Project URL and anon key (Project Settings → API).
2. Copy the env file and fill it in:
   ```bash
   cp .env.local.example .env.local
   ```
3. **Run the migration** in `supabase/migrations/00000000000001_initial_schema.sql`
   against your project — either paste it into the Supabase SQL Editor, or, if
   you have the Supabase CLI linked to the project:
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

## What's implemented (Sprint 1)

- Auth (Supabase email/password, session refresh via middleware)
- Quick Capture (global `+` shortcut) → `inbox_items`
- Inbox: listing, heuristic suggestion (keyword match / last-used thread —
  **not AI**, see `src/lib/heuristics.ts`), manual classification into an
  Event, discard
- Workspace: CRUD, editable context panel, Threads list
- Thread: its own route (`/thread/[id]`), editable objetivo/resumo vivo,
  status lifecycle, Event timeline, manual Event creation
- Radar (`/`) answering the 4 questions from `MVP_BLUEPRINT.md` §8 with real
  data — except "o que está parado?", which needs the stalled-thread rule
  from Sprint 2

## Deliberately not in this Sprint

Per `MVP_BLUEPRINT.md` §14, these are Sprint 2: deterministic Insights
(stalled thread / inbox 48h+ rules), manual Knowledge consolidation, Global
Search (Ctrl+K, full-text), attachments, empty-state polish.

## Deploying

Not deployed yet. When ready: push this repo to GitHub, import it into
Vercel, and set the same env vars from `.env.local` in the Vercel project
settings.
