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