-- Rewards Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample rewards data for Shop Queue application

-- Insert rewards for various shops
INSERT INTO public.rewards (
    id,
    shop_id,
    name,
    description,
    type,
    points_required,
    value,
    is_available,
    expiry_days,
    usage_limit,
    icon,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4(),
    s.id,
    CASE 
        WHEN reward_num = 1 THEN 'ส่วนลด 10%'
        WHEN reward_num = 2 THEN 'บริการฟรี'
        WHEN reward_num = 3 THEN 'เงินคืน 50 บาท'
        ELSE 'สิทธิพิเศษ VIP'
    END as name,
    CASE 
        WHEN reward_num = 1 THEN 'รับส่วนลด 10% สำหรับการใช้บริการครั้งถัดไป'
        WHEN reward_num = 2 THEN 'รับบริการฟรี 1 ครั้ง (มูลค่าไม่เกิน 200 บาท)'
        WHEN reward_num = 3 THEN 'รับเงินคืน 50 บาท เข้าบัญชี'
        ELSE 'สิทธิพิเศษสมาชิก VIP ใช้บริการได้โดยไม่ต้องรอคิว'
    END as description,
    CASE 
        WHEN reward_num = 1 THEN 'discount'::reward_type
        WHEN reward_num = 2 THEN 'free_item'::reward_type
        WHEN reward_num = 3 THEN 'cashback'::reward_type
        ELSE 'special_privilege'::reward_type
    END as type,
    CASE 
        WHEN reward_num = 1 THEN 100
        WHEN reward_num = 2 THEN 300
        WHEN reward_num = 3 THEN 250
        ELSE 500
    END as points_required,
    CASE 
        WHEN reward_num = 1 THEN 10.00
        WHEN reward_num = 2 THEN 200.00
        WHEN reward_num = 3 THEN 50.00
        ELSE 0.00
    END as value,
    true as is_available,
    CASE 
        WHEN reward_num = 1 THEN 30
        WHEN reward_num = 2 THEN 60
        WHEN reward_num = 3 THEN 90
        ELSE 365
    END as expiry_days,
    CASE 
        WHEN reward_num = 1 THEN 5
        WHEN reward_num = 2 THEN 2
        WHEN reward_num = 3 THEN 3
        ELSE 1
    END as usage_limit,
    CASE 
        WHEN reward_num = 1 THEN '🎫'
        WHEN reward_num = 2 THEN '🎁'
        WHEN reward_num = 3 THEN '💰'
        ELSE '👑'
    END as icon,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
FROM public.shops s
CROSS JOIN generate_series(1, 4) as reward_num
WHERE s.status = 'active'
ON CONFLICT (id) DO NOTHING;
