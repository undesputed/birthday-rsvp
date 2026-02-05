-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor) to create the RSVPs table.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  attending text not null check (attending in ('yes', 'no', 'maybe')),
  number_of_guests smallint not null default 0 check (number_of_guests >= 0 and number_of_guests <= 5),
  additional_guests text not null default '',
  dietary_restrictions text not null default '',
  created_at timestamptz not null default now()
);

-- Row Level Security (RLS)
-- ------------------------
-- Simplest option: allow all operations (read/write) for this table.
-- This is safe as long as you ONLY access it via your server-side
-- API using the service role key (as this project does).

alter table public.rsvps enable row level security;

create policy "allow-all-rsvps"
  on public.rsvps
  for all
  using (true)
  with check (true);

-- If you later want to use the anon/public key directly from the browser,
-- replace the policy above with more restrictive ones (e.g. insert-only).
