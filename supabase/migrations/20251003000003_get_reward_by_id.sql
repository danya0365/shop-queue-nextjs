-- RPC to fetch a single reward by shop and reward id
-- Generated on 2025-10-03

create or replace function public.get_reward_by_id(
  p_shop_id uuid,
  p_reward_id uuid
)
returns public.rewards
language sql
security definer
stable
as $$
  select r.*
  from public.rewards r
  where r.shop_id = p_shop_id
    and r.id = p_reward_id
  limit 1;
$$;

comment on function public.get_reward_by_id(uuid, uuid)
is 'Get a single reward row from rewards filtered by shop_id and id';
