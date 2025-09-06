-- Promotion Services Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample promotion services linking data for Shop Queue application

-- Link promotions to services (many-to-many relationship)
INSERT INTO public.promotion_services (
    id,
    promotion_id,
    service_id
)
SELECT 
    uuid_generate_v4(),
    p.id as promotion_id,
    s.id as service_id
FROM public.promotions p
JOIN public.services s ON s.shop_id = p.shop_id
WHERE s.is_available = true
  AND RANDOM() < 0.4  -- Link about 40% of services to promotions
ON CONFLICT (id) DO NOTHING;
