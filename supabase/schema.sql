-- Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  favorite_colors text[],
  avatar_url text,
  created_at timestamp with time zone default now()
);

create table if not exists public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  commander_scryfall_ids text[] not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.events (
  id text primary key,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

create table if not exists public.event_participants (
  event_id text references public.events(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamp with time zone default now(),
  primary key(event_id, user_id)
);

-- Pods tables
create table if not exists public.pods (
  id uuid primary key default gen_random_uuid(),
  event_id text references public.events(id) on delete cascade,
  index_in_event int not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.pod_members (
  pod_id uuid references public.pods(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  primary key(pod_id, user_id)
);

create view public.event_participants_view as
select ep.event_id, u.id as user_id, p.username, p.avatar_url
from public.event_participants ep
join auth.users u on u.id = ep.user_id
left join public.profiles p on p.id = u.id;

-- RLS
alter table public.profiles enable row level security;
alter table public.decks enable row level security;
alter table public.events enable row level security;
alter table public.event_participants enable row level security;
alter table public.pods enable row level security;
alter table public.pod_members enable row level security;

create policy "profiles_select_self" on public.profiles for select using (auth.uid() = id);
create policy "profiles_upsert_self" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_self" on public.profiles for update using (auth.uid() = id);

-- Allow participants of the same event to read each other's public profile fields
create policy "profiles_select_same_event" on public.profiles
  for select using (
    exists (
      select 1
      from public.event_participants ep_self
      join public.event_participants ep_other on ep_self.event_id = ep_other.event_id
      where ep_self.user_id = auth.uid()
        and ep_other.user_id = profiles.id
    )
  );

create policy "decks_owner_all" on public.decks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "events_read_all" on public.events for select using (true);
create policy "events_insert_owner" on public.events for insert with check (auth.uid() = created_by);
create policy "events_delete_owner" on public.events for delete using (auth.uid() = created_by);

create policy "participants_read_event" on public.event_participants for select using (true);
create policy "participants_join_self" on public.event_participants for insert with check (auth.uid() = user_id);
create policy "participants_leave_self" on public.event_participants for delete using (auth.uid() = user_id);

-- Pods RLS: anyone can read pods for an event; only owner can insert/delete
create policy "pods_read_event" on public.pods for select using (true);
create policy "pods_insert_owner" on public.pods for insert with check (
  exists (select 1 from public.events e where e.id = pods.event_id and e.created_by = auth.uid())
);
create policy "pods_delete_owner" on public.pods for delete using (
  exists (select 1 from public.events e where e.id = pods.event_id and e.created_by = auth.uid())
);

create policy "pod_members_read_event" on public.pod_members for select using (true);
create policy "pod_members_insert_owner" on public.pod_members for insert with check (
  exists (
    select 1 from public.pods p
    join public.events e on e.id = p.event_id
    where p.id = pod_members.pod_id and e.created_by = auth.uid()
  )
);
create policy "pod_members_delete_owner" on public.pod_members for delete using (
  exists (
    select 1 from public.pods p
    join public.events e on e.id = p.event_id
    where p.id = pod_members.pod_id and e.created_by = auth.uid()
  )
);
