-- Category Shops Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample category shops linking data for Shop Queue application

-- Link shops to categories based on shop names and services
INSERT INTO public.category_shops (
    id,
    category_id,
    shop_id,
    created_at,
    updated_at
)
SELECT 
    uuid_generate_v4(),
    c.id as category_id,
    s.id as shop_id,
    s.created_at,
    s.updated_at
FROM public.shops s
JOIN public.categories c ON (
    (s.name LIKE '%ตัดผม%' AND c.slug = 'haircut') OR
    (s.name LIKE '%ความงาม%' AND c.slug = 'beauty') OR
    (s.name LIKE '%ซ่อม%' AND c.slug = 'repair') OR
    (s.name LIKE '%อาหาร%' AND c.slug = 'restaurant') OR
    (s.name LIKE '%สปา%' AND c.slug = 'spa') OR
    (s.name LIKE '%ซักรีด%' AND c.slug = 'tailor')
)
WHERE s.status = 'active'
  AND c.is_active = true
ON CONFLICT (id) DO NOTHING;
