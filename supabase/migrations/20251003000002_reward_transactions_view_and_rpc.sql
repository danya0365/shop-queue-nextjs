-- Create a view that enriches customer_point_transactions with shop/customer and reward usage metadata
-- Generated on 2025-10-03

create or replace view public.reward_transactions_view as
select
  cpt.id,
  cp.shop_id,
  cp.customer_id,
  cpt.type,
  cpt.points,
  cpt.description,
  cpt.transaction_date,
  cpt.created_at,
  cpt.related_queue_id,
  ru.reward_id,
  ru.redemption_code,
  ru.used_at
from public.customer_point_transactions cpt
join public.customer_points cp on cp.id = cpt.customer_point_id
left join public.reward_usages ru on ru.customer_point_transaction_id = cpt.id;

comment on view public.reward_transactions_view is 'Enriched reward transactions combining points transactions with shop/customer and reward usage metadata';

-- RPC to list from the view with filters and pagination
create or replace function public.get_reward_transactions_enriched(
  p_shop_id uuid,
  p_customer_id uuid,
  p_type public.transaction_type default null,
  p_start_date timestamptz default null,
  p_end_date timestamptz default null,
  p_page integer default 1,
  p_limit integer default 10
)
returns setof public.reward_transactions_view
language sql
security definer
stable
as $$
  select *
  from public.reward_transactions_view v
  where v.shop_id = p_shop_id
    and v.customer_id = p_customer_id
    and (p_type is null or v.type = p_type)
    and (p_start_date is null or coalesce(v.transaction_date, v.created_at) >= p_start_date)
    and (p_end_date is null or coalesce(v.transaction_date, v.created_at) <= p_end_date)
  order by coalesce(v.transaction_date, v.created_at) desc
  offset greatest((p_page - 1), 0) * p_limit
  limit p_limit;
$$;

comment on function public.get_reward_transactions_enriched(uuid, uuid, public.transaction_type, timestamptz, timestamptz, integer, integer)
is 'List enriched reward transactions from view with optional type/date filters and pagination';

-- RPC to count from the view
create or replace function public.get_reward_transactions_enriched_count(
  p_shop_id uuid,
  p_customer_id uuid,
  p_type public.transaction_type default null,
  p_start_date timestamptz default null,
  p_end_date timestamptz default null
)
returns bigint
language sql
security definer
stable
as $$
  select count(*)::bigint
  from public.reward_transactions_view v
  where v.shop_id = p_shop_id
    and v.customer_id = p_customer_id
    and (p_type is null or v.type = p_type)
    and (p_start_date is null or coalesce(v.transaction_date, v.created_at) >= p_start_date)
    and (p_end_date is null or coalesce(v.transaction_date, v.created_at) <= p_end_date);
$$;

comment on function public.get_reward_transactions_enriched_count(uuid, uuid, public.transaction_type, timestamptz, timestamptz)
is 'Count enriched reward transactions from view with optional type/date filters';
