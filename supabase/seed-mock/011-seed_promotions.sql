-- Promotions Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample promotion data for Shop Queue application

-- Insert promotions for various shops
INSERT INTO public.promotions (
    id,
    shop_id,
    name,
    description,
    type,
    value,
    min_purchase_amount,
    max_discount_amount,
    start_at,
    end_at,
    usage_limit,
    status,
    conditions,
    created_by,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4(),
    s.id,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 1 THEN 'ลูกค้าใหม่ลด 20%'
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 2 THEN 'ซื้อ 2 แถม 1'
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 3 THEN 'Happy Hour ลด 50 บาท'
        ELSE 'สมาชิก VIP ลด 15%'
    END as name,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 1 THEN 'ส่วนลด 20% สำหรับลูกค้าใหม่'
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 2 THEN 'ซื้อบริการ 2 ครั้ง แถมฟรี 1 ครั้ง'
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 3 THEN 'ลดทันที 50 บาท ในช่วง 14:00-16:00'
        ELSE 'ส่วนลด 15% สำหรับสมาชิก VIP'
    END as description,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 1 THEN 'percentage'::promotion_type
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 2 THEN 'buy_x_get_y'::promotion_type
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 3 THEN 'fixed_amount'::promotion_type
        ELSE 'percentage'::promotion_type
    END as type,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 1 THEN 20.00
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 2 THEN 1.00
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 3 THEN 50.00
        ELSE 15.00
    END as value,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 1 THEN 100.00
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 2 THEN 200.00
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 3 THEN 0.00
        ELSE 150.00
    END as min_purchase_amount,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 1 THEN 100.00
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 2 THEN NULL
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 3 THEN 50.00
        ELSE 200.00
    END as max_discount_amount,
    NOW() - INTERVAL '15 days' as start_at,
    NOW() + INTERVAL '30 days' as end_at,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 1 THEN 100
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 2 THEN 50
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 3 THEN 200
        ELSE 75
    END as usage_limit,
    'active'::promotion_status as status,
    CASE 
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 1 THEN '["first_time_customer"]'::jsonb
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 2 THEN '["minimum_services": 2]'::jsonb
        WHEN ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY s.created_at) = 3 THEN '["time_range": "14:00-16:00"]'::jsonb
        ELSE '["membership_tier": "gold"]'::jsonb
    END as conditions,
    s.owner_id as created_by,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
FROM public.shops s
CROSS JOIN generate_series(1, 2) as promo_num
WHERE s.status = 'active'
LIMIT 20
ON CONFLICT (shop_id, name) DO NOTHING;
