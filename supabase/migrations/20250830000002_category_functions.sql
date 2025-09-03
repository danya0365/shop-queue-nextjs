-- Create view for Category Statistics DTO
CREATE OR REPLACE VIEW category_stats_view AS
WITH category_popularity AS (
  SELECT 
    c.id,
    c.name,
    COUNT(cs.shop_id) as shop_count
  FROM categories c
  LEFT JOIN category_shops cs ON c.id = cs.category_id
  GROUP BY c.id, c.name
),
popularity_ranking AS (
  SELECT 
    name,
    shop_count,
    ROW_NUMBER() OVER (ORDER BY shop_count DESC) as rank_desc,
    ROW_NUMBER() OVER (ORDER BY shop_count ASC) as rank_asc
  FROM category_popularity
),
stats_calculation AS (
  SELECT 
    -- Total categories count
    (SELECT COUNT(*) FROM categories) as total_categories,
    
    -- Active categories (categories that have at least one shop)
    (SELECT COUNT(DISTINCT cs.category_id) FROM category_shops cs) as active_categories,
    
    -- Total shops count
    (SELECT COUNT(*) FROM shops WHERE status = 'active') as total_shops,
    
    -- Total services count
    (SELECT COUNT(*) FROM services WHERE is_available = true) as total_services,
    
    -- Most popular category (highest shop count)
    (SELECT name FROM popularity_ranking WHERE rank_desc = 1 LIMIT 1) as most_popular_category,
    
    -- Least popular category (lowest shop count, but only among categories that have shops)
    (SELECT name FROM popularity_ranking WHERE shop_count > 0 AND rank_asc = 1 LIMIT 1) as least_popular_category
)
SELECT 
  total_categories,
  active_categories,
  total_shops,
  total_services,
  COALESCE(most_popular_category, 'No categories with shops') as most_popular_category,
  COALESCE(least_popular_category, 'No categories with shops') as least_popular_category
FROM stats_calculation;

CREATE OR REPLACE VIEW public.category_info_stats_view AS
SELECT 
    c.id,
    c.name,
    c.slug,
    c.icon,
    c.color,
    c.description,
    c.created_at,
    c.updated_at,
    COALESCE(shop_counts.shops_count, 0) as shops_count,
    COALESCE(service_counts.services_count, 0) as services_count,
    -- เพิ่มข้อมูลเสริมที่อาจจะมีประโยชน์
    COALESCE(active_shop_counts.active_shops_count, 0) as active_shops_count,
    COALESCE(available_service_counts.available_services_count, 0) as available_services_count
FROM 
    public.categories c
    
-- นับจำนวน shops ทั้งหมดในแต่ละ category
LEFT JOIN (
    SELECT 
        cs.category_id,
        COUNT(DISTINCT cs.shop_id) as shops_count
    FROM public.category_shops cs
    INNER JOIN public.shops s ON cs.shop_id = s.id
    GROUP BY cs.category_id
) shop_counts ON c.id = shop_counts.category_id

-- นับจำนวน active shops ในแต่ละ category
LEFT JOIN (
    SELECT 
        cs.category_id,
        COUNT(DISTINCT cs.shop_id) as active_shops_count
    FROM public.category_shops cs
    INNER JOIN public.shops s ON cs.shop_id = s.id
    WHERE s.status = 'active'
    GROUP BY cs.category_id
) active_shop_counts ON c.id = active_shop_counts.category_id

-- นับจำนวน services ทั้งหมดในแต่ละ category
LEFT JOIN (
    SELECT 
        cs.category_id,
        COUNT(ser.id) as services_count
    FROM public.category_shops cs
    INNER JOIN public.shops s ON cs.shop_id = s.id
    INNER JOIN public.services ser ON s.id = ser.shop_id
    GROUP BY cs.category_id
) service_counts ON c.id = service_counts.category_id

-- นับจำนวน available services ในแต่ละ category  
LEFT JOIN (
    SELECT 
        cs.category_id,
        COUNT(ser.id) as available_services_count
    FROM public.category_shops cs
    INNER JOIN public.shops s ON cs.shop_id = s.id
    INNER JOIN public.services ser ON s.id = ser.shop_id
    WHERE ser.is_available = true
    GROUP BY cs.category_id
) available_service_counts ON c.id = available_service_counts.category_id

ORDER BY c.name;