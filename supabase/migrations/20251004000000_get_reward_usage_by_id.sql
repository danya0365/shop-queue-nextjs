-- RPC to fetch a single reward_usages row by id
-- Generated on 2025-10-04

create or replace function public.get_reward_usage_by_id(
  p_id uuid
)
returns public.reward_usages
language sql
security definer
stable
as $$
  select ru.*
  from public.reward_usages ru
  where ru.id = p_id
  limit 1;
$$;

comment on function public.get_reward_usage_by_id(uuid)
is 'Get a single reward_usages row by id';
