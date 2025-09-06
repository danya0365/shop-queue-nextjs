-- Promotion Usage Logs Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample promotion usage logs data for Shop Queue application

-- Insert promotion usage logs for existing promotions and customers
INSERT INTO public.promotion_usage_logs (
    id,
    promotion_id,
    customer_id,
    queue_id,
    used_at
)
SELECT 
    uuid_generate_v4(),
    p.id as promotion_id,
    c.id as customer_id,
    q.id as queue_id,
    q.created_at + INTERVAL (FLOOR(RANDOM() * 60)::TEXT || ' minutes')::INTERVAL as used_at
FROM public.promotions p
JOIN public.customers c ON c.shop_id = p.shop_id
JOIN public.queues q ON q.customer_id = c.id AND q.shop_id = p.shop_id
WHERE p.status = 'active'
  AND q.status IN ('completed', 'serving')
  AND RANDOM() < 0.2  -- Only 20% of queues used promotions
  AND q.created_at >= p.start_at
  AND q.created_at <= p.end_at
ORDER BY RANDOM()
LIMIT 50
ON CONFLICT (id) DO NOTHING;
