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
