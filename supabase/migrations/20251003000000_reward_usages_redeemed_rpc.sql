-- RPCs for fetching redeemed rewards from reward_usages
-- Generated on 2025-10-03

create or replace function public.get_redeemed_rewards(
  p_shop_id uuid,
  p_customer_id uuid,
  p_start_date timestamptz default null,
  p_end_date timestamptz default null,
  p_page integer default 1,
  p_limit integer default 10
)
returns setof public.reward_usages
language sql
security definer
stable
as $$
  select *
  from public.reward_usages ru
  where ru.shop_id = p_shop_id
    and ru.customer_id = p_customer_id
    and (p_start_date is null or coalesce(ru.used_at, ru.issued_at, ru.created_at) >= p_start_date)
    and (p_end_date is null or coalesce(ru.used_at, ru.issued_at, ru.created_at) <= p_end_date)
  order by coalesce(ru.used_at, ru.issued_at, ru.created_at) desc
  offset greatest((p_page - 1), 0) * p_limit
  limit p_limit;
$$;

comment on function public.get_redeemed_rewards(uuid, uuid, timestamptz, timestamptz, integer, integer)
is 'List redeemed reward usages filtered by shop and customer with optional date range and pagination. Returns rows from reward_usages only.';

create or replace function public.get_redeemed_rewards_count(
  p_shop_id uuid,
  p_customer_id uuid,
  p_start_date timestamptz default null,
  p_end_date timestamptz default null
)
returns bigint
language sql
security definer
stable
as $$
  select count(*)::bigint
  from public.reward_usages ru
  where ru.shop_id = p_shop_id
    and ru.customer_id = p_customer_id
    and (p_start_date is null or coalesce(ru.used_at, ru.issued_at, ru.created_at) >= p_start_date)
    and (p_end_date is null or coalesce(ru.used_at, ru.issued_at, ru.created_at) <= p_end_date);
$$;

comment on function public.get_redeemed_rewards_count(uuid, uuid, timestamptz, timestamptz)
is 'Count redeemed reward usages filtered by shop and customer with optional date range. Counts rows from reward_usages only.';
