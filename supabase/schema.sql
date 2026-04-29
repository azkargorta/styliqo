create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text unique,
  avatar_url text,
  tier text not null default 'free' check (tier in ('free', 'premium')),
  monthly_ai_credits integer not null default 10,
  used_ai_credits integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.garments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  category text not null,
  color text not null,
  brand text,
  notes text,
  seasons text[] not null default '{}',
  occasions text[] not null default '{}',
  is_favorite boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.garment_images (
  id uuid primary key default gen_random_uuid(),
  garment_id uuid not null references public.garments (id) on delete cascade,
  storage_path text not null,
  alt_text text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  occasion text not null,
  season text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.outfit_items (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  garment_id uuid not null references public.garments (id) on delete cascade,
  sort_order integer not null default 0
);

create table if not exists public.planner_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  outfit_id uuid references public.outfits (id) on delete set null,
  title text not null,
  date date not null,
  weather text,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  store text,
  target_price numeric(10,2),
  url text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  prompt_context jsonb not null default '{}'::jsonb,
  response_payload jsonb not null default '{}'::jsonb,
  credits_used integer not null default 1,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.usage_limits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  feature_key text not null,
  monthly_limit integer not null,
  monthly_used integer not null default 0,
  period_start date not null default current_date,
  unique (user_id, feature_key)
);

alter table public.profiles enable row level security;
alter table public.garments enable row level security;
alter table public.garment_images enable row level security;
alter table public.outfits enable row level security;
alter table public.outfit_items enable row level security;
alter table public.planner_entries enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.ai_generations enable row level security;
alter table public.usage_limits enable row level security;

create or replace function public.is_owner(owner_id uuid)
returns boolean
language sql
stable
as $$
  select auth.uid() = owner_id
$$;

create policy "profiles_select_own"
on public.profiles
for select
using (public.is_owner(id));

create policy "profiles_update_own"
on public.profiles
for update
using (public.is_owner(id));

create policy "garments_all_own"
on public.garments
for all
using (public.is_owner(user_id))
with check (public.is_owner(user_id));

create policy "garment_images_all_own"
on public.garment_images
for all
using (
  exists (
    select 1
    from public.garments
    where public.garments.id = garment_images.garment_id
      and public.is_owner(public.garments.user_id)
  )
)
with check (
  exists (
    select 1
    from public.garments
    where public.garments.id = garment_images.garment_id
      and public.is_owner(public.garments.user_id)
  )
);

create policy "outfits_all_own"
on public.outfits
for all
using (public.is_owner(user_id))
with check (public.is_owner(user_id));

create policy "outfit_items_all_own"
on public.outfit_items
for all
using (
  exists (
    select 1
    from public.outfits
    where public.outfits.id = outfit_items.outfit_id
      and public.is_owner(public.outfits.user_id)
  )
)
with check (
  exists (
    select 1
    from public.outfits
    where public.outfits.id = outfit_items.outfit_id
      and public.is_owner(public.outfits.user_id)
  )
);

create policy "planner_entries_all_own"
on public.planner_entries
for all
using (public.is_owner(user_id))
with check (public.is_owner(user_id));

create policy "wishlist_items_all_own"
on public.wishlist_items
for all
using (public.is_owner(user_id))
with check (public.is_owner(user_id));

create policy "subscriptions_all_own"
on public.subscriptions
for all
using (public.is_owner(user_id))
with check (public.is_owner(user_id));

create policy "ai_generations_all_own"
on public.ai_generations
for all
using (public.is_owner(user_id))
with check (public.is_owner(user_id));

create policy "usage_limits_all_own"
on public.usage_limits
for all
using (public.is_owner(user_id))
with check (public.is_owner(user_id));
