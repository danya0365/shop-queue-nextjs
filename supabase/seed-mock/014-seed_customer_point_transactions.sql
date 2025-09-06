-- Customer Point Transactions Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample customer point transactions data for Shop Queue application

-- Insert customer point transactions for existing customer points
INSERT INTO public.customer_point_transactions (
    id,
    customer_point_id,
    type,
    points,
    description,
    related_queue_id,
    metadata,
    transaction_date,
    created_at
)
SELECT 
    uuid_generate_v4(),
    cp.id,
    CASE 
        WHEN transaction_num <= 3 THEN 'earned'::transaction_type
        WHEN transaction_num = 4 THEN 'redeemed'::transaction_type
        ELSE 'earned'::transaction_type
    END as type,
    CASE 
        WHEN transaction_num <= 3 THEN FLOOR(RANDOM() * 50 + 10)::INTEGER
        WHEN transaction_num = 4 THEN -FLOOR(RANDOM() * 100 + 50)::INTEGER
        ELSE FLOOR(RANDOM() * 30 + 5)::INTEGER
    END as points,
    CASE 
        WHEN transaction_num = 1 THEN 'รับแต้มจากการใช้บริการ'
        WHEN transaction_num = 2 THEN 'โบนัสแต้มลูกค้าใหม่'
        WHEN transaction_num = 3 THEN 'แต้มพิเศษจากโปรโมชั่น'
        WHEN transaction_num = 4 THEN 'แลกแต้มรับส่วนลด'
        ELSE 'รับแต้มจากการรีวิว'
    END as description,
    -- Link some transactions to queues (randomly)
    CASE 
        WHEN RANDOM() < 0.6 THEN (
            SELECT q.id 
            FROM public.queues q 
            WHERE q.customer_id = (
                SELECT c.id 
                FROM public.customers c 
                WHERE c.id = cp.customer_id
            )
            ORDER BY RANDOM() 
            LIMIT 1
        )
        ELSE NULL
    END as related_queue_id,
    CASE 
        WHEN transaction_num = 1 THEN '{"service_type": "regular", "multiplier": 1.0}'::jsonb
        WHEN transaction_num = 2 THEN '{"bonus_type": "new_customer", "campaign": "welcome_2024"}'::jsonb
        WHEN transaction_num = 3 THEN '{"promotion_id": "promo_001", "bonus_rate": 2.0}'::jsonb
        WHEN transaction_num = 4 THEN '{"reward_type": "discount", "discount_percent": 10}'::jsonb
        ELSE '{"source": "review", "rating": 5}'::jsonb
    END as metadata,
    NOW() - INTERVAL (FLOOR(RANDOM() * 30 + 1)::TEXT || ' days')::INTERVAL as transaction_date,
    NOW() - INTERVAL (FLOOR(RANDOM() * 30 + 1)::TEXT || ' days')::INTERVAL as created_at
FROM public.customer_points cp
CROSS JOIN generate_series(1, 5) as transaction_num
WHERE cp.current_points > 0
ON CONFLICT (id) DO NOTHING;
