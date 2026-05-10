create extension if not exists pgcrypto;

create table if not exists public.gnss_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  saved_at timestamptz,
  kind text not null,
  session_id text,
  session jsonb not null default '{}'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  client jsonb not null default '{}'::jsonb
);

create index if not exists gnss_events_session_id_idx on public.gnss_events (session_id);
create index if not exists gnss_events_kind_idx on public.gnss_events (kind);
create index if not exists gnss_events_saved_at_idx on public.gnss_events (saved_at);

alter table public.gnss_events enable row level security;

drop policy if exists "allow anonymous inserts" on public.gnss_events;
create policy "allow anonymous inserts"
on public.gnss_events
for insert
to anon
with check (true);

-- Keep reads private by default. Use the Supabase dashboard, SQL editor,
-- or authenticated service role tools for analysis/export.
