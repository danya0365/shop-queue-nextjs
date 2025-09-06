-- Customer Points Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample customer points data for Shop Queue application

-- Insert customer points for existing customers
INSERT INTO public.customer_points (
    id,
    shop_id,
    customer_id,
    current_points,
    total_earned,
    total_redeemed,
    membership_tier,
    tier_benefits,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4(),
    c.shop_id,
    c.id,
    CASE 
        WHEN RANDOM() < 0.3 THEN FLOOR(RANDOM() * 50 + 10)::INTEGER  -- Low points
        WHEN RANDOM() < 0.7 THEN FLOOR(RANDOM() * 200 + 50)::INTEGER -- Medium points
        ELSE FLOOR(RANDOM() * 500 + 200)::INTEGER -- High points
    END as current_points,
    FLOOR(RANDOM() * 1000 + 100)::INTEGER as total_earned,
    FLOOR(RANDOM() * 300 + 50)::INTEGER as total_redeemed,
    CASE 
        WHEN RANDOM() < 0.4 THEN 'bronze'::membership_tier
        WHEN RANDOM() < 0.7 THEN 'silver'::membership_tier
        WHEN RANDOM() < 0.9 THEN 'gold'::membership_tier
        ELSE 'platinum'::membership_tier
    END as membership_tier,
    CASE 
        WHEN RANDOM() < 0.4 THEN ARRAY['basic_rewards', 'birthday_discount']
        WHEN RANDOM() < 0.7 THEN ARRAY['basic_rewards', 'birthday_discount', 'priority_booking', 'extra_points']
        WHEN RANDOM() < 0.9 THEN ARRAY['basic_rewards', 'birthday_discount', 'priority_booking', 'extra_points', 'vip_service', 'exclusive_offers']
        ELSE ARRAY['basic_rewards', 'birthday_discount', 'priority_booking', 'extra_points', 'vip_service', 'exclusive_offers', 'concierge_service', 'premium_support']
    END as tier_benefits,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '1 day'
FROM public.customers c
WHERE c.is_active = true
ON CONFLICT (id) DO NOTHING;
