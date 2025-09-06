-- Customer Point Expiry Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample customer point expiry data for Shop Queue application

-- Insert customer point expiry records for earned points
INSERT INTO public.customer_point_expiry (
    id,
    customer_point_transaction_id,
    expiry_date,
    points,
    created_at
)
SELECT 
    uuid_generate_v4(),
    cpt.id,
    CASE 
        WHEN cpt.metadata->>'bonus_type' = 'new_customer' THEN cpt.transaction_date + INTERVAL '365 days'
        WHEN cpt.metadata->>'promotion_id' IS NOT NULL THEN cpt.transaction_date + INTERVAL '90 days'
        WHEN cpt.metadata->>'source' = 'review' THEN cpt.transaction_date + INTERVAL '180 days'
        ELSE cpt.transaction_date + INTERVAL '365 days'
    END as expiry_date,
    cpt.points,
    cpt.created_at
FROM public.customer_point_transactions cpt
WHERE cpt.type = 'earned'
  AND cpt.points > 0
ON CONFLICT (id) DO NOTHING;
