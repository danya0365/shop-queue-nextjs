-- Reward Transactions Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample reward transactions data using customer_point_transactions and rewards

-- Insert reward transactions based on existing customer_point_transactions that are 'redeemed' type
INSERT INTO public.reward_transactions (
    id,
    related_customer_id,
    customer_point_transaction_id,
    reward_id,
    type,
    points,
    description,
    related_queue_id,
    transaction_date,
    expiry_at,
    created_at
)
SELECT 
    uuid_generate_v4(),
    c.id as related_customer_id,
    cpt.id as customer_point_transaction_id,
    r.id as reward_id,
    'redeemed'::transaction_type as type,
    ABS(cpt.points) as points, -- Use absolute value since redeemed points are negative
    CONCAT('แลกแต้ม: ', r.name) as description,
    cpt.related_queue_id,
    cpt.transaction_date,
    cpt.transaction_date + INTERVAL (r.expiry_days::TEXT || ' days')::INTERVAL as expiry_at,
    cpt.created_at
FROM public.customer_point_transactions cpt
JOIN public.customer_points cp ON cpt.customer_point_id = cp.id
JOIN public.customers c ON cp.customer_id = c.id
JOIN public.rewards r ON r.shop_id = cp.shop_id
WHERE cpt.type = 'redeemed'
  AND ABS(cpt.points) >= r.points_required
  AND r.is_available = true
  -- Match reward based on points (select reward that customer can afford)
  AND r.points_required <= ABS(cpt.points)
  AND r.id = (
    SELECT r2.id 
    FROM public.rewards r2 
    WHERE r2.shop_id = cp.shop_id 
      AND r2.points_required <= ABS(cpt.points)
      AND r2.is_available = true
    ORDER BY r2.points_required DESC 
    LIMIT 1
  )
ON CONFLICT (id) DO NOTHING;
