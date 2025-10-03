-- Compute customer reward statistics for a given shop and customer
-- Generated on 2025-10-04

create or replace function public.get_customer_reward_stats(
  p_shop_id uuid,
  p_customer_id uuid
)
returns table (
  shop_id uuid,
  customer_id uuid,
  total_rewards_available bigint,
  total_rewards_redeemed bigint,
  total_points_earned bigint,
  total_points_redeemed bigint,
  average_points_per_transaction numeric,
  most_redeemed_category text,
  redemption_rate numeric,
  last_redemption_date timestamp with time zone,
  last_earn_date timestamp with time zone,
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
language plpgsql
security definer
set search_path = public
stable
as $$
begin
  -- Basic validation
  if p_shop_id is null then
    raise exception 'Shop ID is required';
  end if;
  if p_customer_id is null then
    raise exception 'Customer ID is required';
  end if;

  return query
  with cust_pts as (
    select cp.id as customer_point_id
    from customer_points cp
    where cp.shop_id = p_shop_id
      and cp.customer_id = p_customer_id
    limit 1
  ),
  points_tx as (
    select
      cpt.type,
      cpt.points,
      cpt.transaction_date
    from customer_point_transactions cpt
    join cust_pts cp on cp.customer_point_id = cpt.customer_point_id
  ),
  redemptions as (
    select
      ru.*
    from reward_usages ru
    where ru.shop_id = p_shop_id
      and ru.customer_id = p_customer_id
  ),
  agg as (
    select
      -- available rewards at shop
      (select count(*) from rewards r where r.shop_id = p_shop_id and coalesce(r.is_available, true) = true) as total_rewards_available,
      -- total redemptions (all statuses)
      (select count(*) from redemptions) as total_rewards_redeemed,
      -- total points earned (sum of positive or earned type)
      coalesce((select sum(cpt.points) from points_tx cpt where cpt.type = 'earned'), 0) as total_points_earned,
      -- total points redeemed (from usages)
      coalesce((select sum(greatest(ru.points_used,0)) from redemptions ru), 0) as total_points_redeemed,
      -- avg points per transaction (use absolute points over all txns)
      coalesce((select round(avg(abs(cpt.points))::numeric, 2) from points_tx cpt), 0) as average_points_per_transaction,
      -- most redeemed category (not available in schema) -> empty string
      ''::text as most_redeemed_category,
      -- redemption rate: used / issued
      coalesce((
        select round((count(*) filter (where ru.status = 'used')::numeric / nullif(count(*),0)) * 100, 2)
        from redemptions ru
      ), 0) as redemption_rate,
      -- last redemption date (used_at)
      (select max(ru.used_at) from redemptions ru) as last_redemption_date,
      -- last earn date
      (select max(cpt.transaction_date) from points_tx cpt where cpt.type = 'earned') as last_earn_date
  )
  select
    p_shop_id as shop_id,
    p_customer_id as customer_id,
    agg.total_rewards_available,
    agg.total_rewards_redeemed,
    agg.total_points_earned,
    agg.total_points_redeemed,
    agg.average_points_per_transaction,
    agg.most_redeemed_category,
    agg.redemption_rate,
    agg.last_redemption_date,
    agg.last_earn_date,
    now() as created_at,
    now() as updated_at
  from agg;
end;
$$;

comment on function public.get_customer_reward_stats(uuid, uuid)
is 'Return computed reward statistics for a specific customer within a shop';
