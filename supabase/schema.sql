-- Primefront backend schema
-- Run this once in the Supabase SQL Editor (Project → SQL Editor → New query).

-- Whitelist of staff allowed into the admin area, keyed by the Supabase auth user id.
-- Rows are added manually after someone logs in once with Discord.
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('admin', 'moderator')),
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create policy "authenticated can read admins"
  on public.admins for select
  to authenticated
  using (true);

-- News posts published by staff. Readable by everyone, writable only by whitelisted staff.
create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  body text[] not null,
  category text not null check (category in ('Update', 'Community', 'Tournament', 'Patch')),
  author_name text not null,
  author_role text not null,
  created_at timestamptz not null default now()
);

alter table public.news_posts enable row level security;

create policy "public can read news_posts"
  on public.news_posts for select
  to public
  using (true);

create policy "admins can insert news_posts"
  on public.news_posts for insert
  to authenticated
  with check (exists (select 1 from public.admins where admins.user_id = auth.uid()));

create policy "admins can delete news_posts"
  on public.news_posts for delete
  to authenticated
  using (exists (select 1 from public.admins where admins.user_id = auth.uid()));

-- Player profiles created via the /register flow. Each player owns exactly one row.
create table if not exists public.players (
  user_id uuid primary key references auth.users(id) on delete cascade,
  discord_username text not null,
  in_game_name text not null,
  region text not null,
  openfront_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.players enable row level security;

create policy "public can read players"
  on public.players for select
  to public
  using (true);

create policy "users can insert own player row"
  on public.players for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "users can update own player row"
  on public.players for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
