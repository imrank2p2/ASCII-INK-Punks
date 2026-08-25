-- ASCCI INK Punks WL database
create table if not exists public.wl_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  twitter text not null,
  proof_url text not null,
  wallet text not null,
  score integer not null default 0,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_at timestamptz null
);

create unique index if not exists wl_applications_wallet_unique on public.wl_applications (lower(wallet));
create unique index if not exists wl_applications_twitter_unique on public.wl_applications (lower(twitter));
create index if not exists wl_applications_status_idx on public.wl_applications (status);
create index if not exists wl_applications_created_idx on public.wl_applications (created_at desc);

-- The website API uses the Supabase service-role key, so keep RLS enabled and do not expose this table to the browser.
alter table public.wl_applications enable row level security;
