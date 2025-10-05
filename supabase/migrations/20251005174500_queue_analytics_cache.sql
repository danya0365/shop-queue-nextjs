-- Queue Analytics Cache table
-- Creates a simple cache table to store computed analytics blobs per shop
-- Safe to run multiple times (IF NOT EXISTS used where possible)

create extension if not exists pgcrypto;

create table if not exists public.queue_analytics_cache (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null,
  cache_key text not null,
  analytics_data jsonb not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for quick lookups
create index if not exists queue_analytics_cache_cache_key_idx on public.queue_analytics_cache(cache_key);
create index if not exists queue_analytics_cache_shop_id_idx on public.queue_analytics_cache(shop_id);
create index if not exists queue_analytics_cache_expires_at_idx on public.queue_analytics_cache(expires_at);

-- Update updated_at automatically
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger queue_analytics_cache_set_updated_at
before update on public.queue_analytics_cache
for each row execute procedure public.set_updated_at();
