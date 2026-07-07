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

-- ============================================================
-- Clans (with sub-clans via parent_clan_id) and join requests.
-- Membership lives on players.clan_id / players.clan_role, which
-- guarantees a player can only ever be in one clan at a time.
-- ============================================================

create table if not exists public.clans (
  id uuid primary key default gen_random_uuid(),
  parent_clan_id uuid references public.clans(id) on delete set null,
  tag text not null unique,
  name text not null,
  description text not null default '',
  icon_url text,
  region text not null,
  recruiting boolean not null default true,
  league_wins integer not null default 0,
  league_losses integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.clans enable row level security;

create policy "public can read clans"
  on public.clans for select
  to public
  using (true);

alter table public.players add column if not exists clan_id uuid references public.clans(id) on delete set null;
alter table public.players add column if not exists clan_role text check (clan_role in ('leader', 'co_leader', 'member'));

create table if not exists public.clan_join_requests (
  id uuid primary key default gen_random_uuid(),
  clan_id uuid not null references public.clans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (clan_id, user_id)
);

alter table public.clan_join_requests enable row level security;

create policy "user can view own requests"
  on public.clan_join_requests for select
  to authenticated
  using (user_id = auth.uid());

create policy "clan leadership can view requests"
  on public.clan_join_requests for select
  to authenticated
  using (
    exists (
      select 1 from public.players p
      where p.user_id = auth.uid()
        and p.clan_id = clan_join_requests.clan_id
        and p.clan_role in ('leader', 'co_leader')
    )
  );

-- All clan/membership mutations go through these functions so the
-- permission checks (one clan per player, 10-member cap, who can
-- promote/kick/transfer) live in one place instead of in RLS policies
-- that would otherwise need to reach across rows they don't own.

create or replace function public.create_clan(
  p_name text,
  p_tag text,
  p_description text,
  p_icon_url text,
  p_region text,
  p_parent_clan_id uuid default null
) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  v_clan_id uuid;
  v_existing_clan uuid;
begin
  select clan_id into v_existing_clan from public.players where user_id = auth.uid();
  if v_existing_clan is not null then
    raise exception 'You are already in a clan';
  end if;

  insert into public.clans (name, tag, description, icon_url, region, parent_clan_id)
  values (p_name, p_tag, coalesce(p_description, ''), p_icon_url, p_region, p_parent_clan_id)
  returning id into v_clan_id;

  update public.players
  set clan_id = v_clan_id, clan_role = 'leader'
  where user_id = auth.uid();

  return v_clan_id;
end;
$$;

create or replace function public.request_join_clan(p_clan_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_existing_clan uuid;
begin
  select clan_id into v_existing_clan from public.players where user_id = auth.uid();
  if v_existing_clan is not null then
    raise exception 'You are already in a clan';
  end if;

  insert into public.clan_join_requests (clan_id, user_id)
  values (p_clan_id, auth.uid())
  on conflict (clan_id, user_id) do update set status = 'pending', created_at = now();
end;
$$;

create or replace function public.cancel_join_request(p_request_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from public.clan_join_requests
  where id = p_request_id and user_id = auth.uid() and status = 'pending';
end;
$$;

create or replace function public.approve_join_request(p_request_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_clan_id uuid;
  v_user_id uuid;
  v_member_count int;
  v_caller_role text;
begin
  select clan_id, user_id into v_clan_id, v_user_id
  from public.clan_join_requests where id = p_request_id and status = 'pending';

  if v_clan_id is null then
    raise exception 'Request not found';
  end if;

  select clan_role into v_caller_role from public.players where user_id = auth.uid() and clan_id = v_clan_id;
  if v_caller_role is null or v_caller_role not in ('leader', 'co_leader') then
    raise exception 'Not authorized';
  end if;

  select count(*) into v_member_count from public.players where clan_id = v_clan_id;
  if v_member_count >= 10 then
    raise exception 'Clan is full';
  end if;

  if exists (select 1 from public.players where user_id = v_user_id and clan_id is not null) then
    raise exception 'Player already joined a clan';
  end if;

  update public.players set clan_id = v_clan_id, clan_role = 'member' where user_id = v_user_id;
  update public.clan_join_requests set status = 'approved' where id = p_request_id;
  update public.clan_join_requests set status = 'rejected' where user_id = v_user_id and status = 'pending' and id <> p_request_id;
end;
$$;

create or replace function public.reject_join_request(p_request_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_clan_id uuid;
  v_caller_role text;
begin
  select clan_id into v_clan_id from public.clan_join_requests where id = p_request_id and status = 'pending';
  if v_clan_id is null then
    raise exception 'Request not found';
  end if;

  select clan_role into v_caller_role from public.players where user_id = auth.uid() and clan_id = v_clan_id;
  if v_caller_role is null or v_caller_role not in ('leader', 'co_leader') then
    raise exception 'Not authorized';
  end if;

  update public.clan_join_requests set status = 'rejected' where id = p_request_id;
end;
$$;

create or replace function public.set_member_role(p_target_user_id uuid, p_role text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_clan_id uuid;
  v_caller_role text;
  v_target_clan uuid;
begin
  if p_role not in ('co_leader', 'member') then
    raise exception 'Invalid role';
  end if;

  select clan_id, clan_role into v_clan_id, v_caller_role from public.players where user_id = auth.uid();
  if v_caller_role <> 'leader' then
    raise exception 'Only the leader can change roles';
  end if;

  select clan_id into v_target_clan from public.players where user_id = p_target_user_id;
  if v_target_clan is distinct from v_clan_id then
    raise exception 'Player is not in your clan';
  end if;

  update public.players set clan_role = p_role where user_id = p_target_user_id;
end;
$$;

create or replace function public.transfer_leadership(p_new_leader_user_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_clan_id uuid;
  v_caller_role text;
  v_target_clan uuid;
begin
  select clan_id, clan_role into v_clan_id, v_caller_role from public.players where user_id = auth.uid();
  if v_caller_role <> 'leader' then
    raise exception 'Only the leader can transfer leadership';
  end if;

  select clan_id into v_target_clan from public.players where user_id = p_new_leader_user_id;
  if v_target_clan is distinct from v_clan_id then
    raise exception 'Player is not in your clan';
  end if;

  update public.players set clan_role = 'co_leader' where user_id = auth.uid();
  update public.players set clan_role = 'leader' where user_id = p_new_leader_user_id;
end;
$$;

create or replace function public.kick_member(p_target_user_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_clan_id uuid;
  v_caller_role text;
  v_target_role text;
  v_target_clan uuid;
begin
  select clan_id, clan_role into v_clan_id, v_caller_role from public.players where user_id = auth.uid();
  if v_caller_role not in ('leader', 'co_leader') then
    raise exception 'Not authorized';
  end if;

  select clan_id, clan_role into v_target_clan, v_target_role from public.players where user_id = p_target_user_id;
  if v_target_clan is distinct from v_clan_id then
    raise exception 'Player is not in your clan';
  end if;

  if p_target_user_id = auth.uid() then
    raise exception 'Use leave_clan instead';
  end if;

  if v_target_role = 'leader' then
    raise exception 'Cannot kick the leader';
  end if;

  if v_caller_role = 'co_leader' and v_target_role = 'co_leader' then
    raise exception 'Co-leaders cannot kick other co-leaders';
  end if;

  update public.players set clan_id = null, clan_role = null where user_id = p_target_user_id;
end;
$$;

create or replace function public.leave_clan() returns void
language plpgsql security definer set search_path = public as $$
declare
  v_clan_role text;
begin
  select clan_role into v_clan_role from public.players where user_id = auth.uid();
  if v_clan_role = 'leader' then
    raise exception 'Transfer leadership before leaving';
  end if;
  update public.players set clan_id = null, clan_role = null where user_id = auth.uid();
end;
$$;

create or replace function public.update_clan_info(p_clan_id uuid, p_description text, p_icon_url text) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_caller_role text;
begin
  select clan_role into v_caller_role from public.players where user_id = auth.uid() and clan_id = p_clan_id;
  if v_caller_role is null or v_caller_role not in ('leader', 'co_leader') then
    raise exception 'Not authorized';
  end if;

  update public.clans set description = coalesce(p_description, description), icon_url = p_icon_url where id = p_clan_id;
end;
$$;

grant execute on function public.create_clan(text, text, text, text, text, uuid) to authenticated;
grant execute on function public.request_join_clan(uuid) to authenticated;
grant execute on function public.cancel_join_request(uuid) to authenticated;
grant execute on function public.approve_join_request(uuid) to authenticated;
grant execute on function public.reject_join_request(uuid) to authenticated;
grant execute on function public.set_member_role(uuid, text) to authenticated;
grant execute on function public.transfer_leadership(uuid) to authenticated;
grant execute on function public.kick_member(uuid) to authenticated;
grant execute on function public.leave_clan() to authenticated;
grant execute on function public.update_clan_info(uuid, text, text) to authenticated;

-- Leader can delete their clan. Members are freed (clan_id/clan_role
-- cleared) and any sub-clans become top-level clans automatically
-- (parent_clan_id has on delete set null).
create or replace function public.delete_clan(p_clan_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_caller_role text;
begin
  select clan_role into v_caller_role from public.players where user_id = auth.uid() and clan_id = p_clan_id;
  if v_caller_role is distinct from 'leader' then
    raise exception 'Only the leader can delete the clan';
  end if;

  update public.players set clan_id = null, clan_role = null where clan_id = p_clan_id;
  delete from public.clans where id = p_clan_id;
end;
$$;

grant execute on function public.delete_clan(uuid) to authenticated;

-- ============================================================
-- Storage bucket for clan icons, uploaded directly by leaders/
-- co-leaders instead of pasting an image URL.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('clan-icons', 'clan-icons', true)
on conflict (id) do nothing;

create policy "public can view clan icons"
  on storage.objects for select
  to public
  using (bucket_id = 'clan-icons');

create policy "authenticated can upload clan icons"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'clan-icons');

create policy "owners can update their clan icon uploads"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'clan-icons' and owner = auth.uid());

create policy "owners can delete their clan icon uploads"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'clan-icons' and owner = auth.uid());

-- ============================================================
-- League membership. Clans no longer join the league automatically
-- on creation — leaders/co-leaders request membership and a staff
-- member (from the admins whitelist) approves or rejects it. A
-- sub-clan cannot request membership while its parent clan is
-- already a league member (see Rules page for the promotion note).
-- ============================================================

alter table public.clans add column if not exists league_status text not null default 'none'
  check (league_status in ('none', 'requested', 'member'));

create or replace function public.request_league_membership(p_clan_id uuid) returns void
language plpgsql security definer set search_path = public as $$
declare
  v_caller_role text;
  v_current_status text;
  v_parent_id uuid;
  v_parent_status text;
begin
  select clan_role into v_caller_role from public.players where user_id = auth.uid() and clan_id = p_clan_id;
  if v_caller_role is null or v_caller_role not in ('leader', 'co_leader') then
    raise exception 'Not authorized';
  end if;

  select league_status, parent_clan_id into v_current_status, v_parent_id from public.clans where id = p_clan_id;
  if v_current_status is distinct from 'none' then
    raise exception 'A league request already exists for this clan';
  end if;

  if v_parent_id is not null then
    select league_status into v_parent_status from public.clans where id = v_parent_id;
    if v_parent_status = 'member' then
      raise exception 'A sub-clan cannot join the league while its parent clan is a league member';
    end if;
  end if;

  update public.clans set league_status = 'requested' where id = p_clan_id;
end;
$$;

create or replace function public.approve_league_request(p_clan_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admins where admins.user_id = auth.uid()) then
    raise exception 'Not authorized';
  end if;

  update public.clans set league_status = 'member' where id = p_clan_id and league_status = 'requested';
end;
$$;

create or replace function public.reject_league_request(p_clan_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.admins where admins.user_id = auth.uid()) then
    raise exception 'Not authorized';
  end if;

  update public.clans set league_status = 'none' where id = p_clan_id and league_status = 'requested';
end;
$$;

grant execute on function public.request_league_membership(uuid) to authenticated;
grant execute on function public.approve_league_request(uuid) to authenticated;
grant execute on function public.reject_league_request(uuid) to authenticated;
