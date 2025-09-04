-- Service Stats View for ServiceStatsDTO
-- This view provides comprehensive service statistics for each shop
-- Service Stats View per Service (ไม่ group by shop)
CREATE OR REPLACE VIEW service_stats_summary_view AS
WITH service_basic_stats AS (
  SELECT 
    COUNT(*) AS total_services,
    COUNT(*) FILTER (WHERE is_available = true) AS available_services,
    COUNT(*) FILTER (WHERE is_available = false) AS unavailable_services,
    COALESCE(AVG(price), 0) AS average_price
  FROM services
),
service_revenue AS (
  SELECT 
    COALESCE(SUM(qs.price * qs.quantity), 0) AS total_revenue
  FROM services s
  LEFT JOIN queue_services qs ON s.id = qs.service_id
  LEFT JOIN queues q ON qs.queue_id = q.id
  WHERE q.status IN ('completed', 'serving')
),
services_by_category AS (
  SELECT 
    jsonb_object_agg(
      COALESCE(category, 'Uncategorized'),
      category_count
    ) AS services_by_category
  FROM (
    SELECT 
      COALESCE(category, 'Uncategorized') AS category,
      COUNT(*) AS category_count
    FROM services
    GROUP BY COALESCE(category, 'Uncategorized')
  ) s
),
popular_services_ranked AS (
  SELECT 
    s.id,
    s.name,
    COALESCE(sb.booking_count, 0) AS booking_count,
    ROW_NUMBER() OVER (ORDER BY COALESCE(sb.booking_count, 0) DESC) AS rank
  FROM services s
  LEFT JOIN (
    SELECT 
      qs.service_id,
      COUNT(*) AS booking_count
    FROM queue_services qs
    LEFT JOIN queues q ON qs.queue_id = q.id
    WHERE q.status IN ('completed', 'serving', 'confirmed', 'waiting')
    GROUP BY qs.service_id
  ) sb ON s.id = sb.service_id
),
popular_services AS (
  SELECT 
    jsonb_agg(
      jsonb_build_object(
        'id', id::text,
        'name', name,
        'bookingCount', booking_count
      ) ORDER BY booking_count DESC
    ) AS popular_services
  FROM popular_services_ranked
  WHERE rank <= 10
)
SELECT
  sbs.total_services,
  sbs.available_services,
  sbs.unavailable_services,
  ROUND(sbs.average_price::numeric, 2) AS average_price,
  ROUND(sr.total_revenue::numeric, 2) AS total_revenue,
  COALESCE(sbc.services_by_category, '{}'::jsonb) AS services_by_category,
  COALESCE(ps.popular_services, '[]'::jsonb) AS popular_services
FROM service_basic_stats sbs
CROSS JOIN service_revenue sr
CROSS JOIN services_by_category sbc
CROSS JOIN popular_services ps;


CREATE OR REPLACE VIEW service_by_shop_stats_view AS
WITH service_basic_stats AS (
  SELECT 
    s.shop_id,
    COUNT(*) as total_services,
    COUNT(*) FILTER (WHERE s.is_available = true) as available_services,
    COUNT(*) FILTER (WHERE s.is_available = false) as unavailable_services,
    COALESCE(AVG(s.price), 0) as average_price
  FROM services s
  GROUP BY s.shop_id
),
service_revenue AS (
  SELECT 
    s.shop_id,
    COALESCE(SUM(qs.price * qs.quantity), 0) as total_revenue
  FROM services s
  LEFT JOIN queue_services qs ON s.id = qs.service_id
  LEFT JOIN queues q ON qs.queue_id = q.id
  WHERE q.status IN ('completed', 'serving')
  GROUP BY s.shop_id
),
services_by_category AS (
  SELECT 
    s.shop_id,
    jsonb_object_agg(
      COALESCE(s.category, 'Uncategorized'), 
      category_count
    ) as services_by_category
  FROM (
    SELECT 
      shop_id,
      COALESCE(category, 'Uncategorized') as category,
      COUNT(*) as category_count
    FROM services
    GROUP BY shop_id, COALESCE(category, 'Uncategorized')
  ) s
  GROUP BY s.shop_id
),
popular_services_ranked AS (
  SELECT 
    s.shop_id,
    s.id,
    s.name,
    COALESCE(booking_count, 0) as booking_count,
    ROW_NUMBER() OVER (PARTITION BY s.shop_id ORDER BY COALESCE(booking_count, 0) DESC) as rank
  FROM services s
  LEFT JOIN (
    SELECT 
      qs.service_id,
      COUNT(*) as booking_count
    FROM queue_services qs
    LEFT JOIN queues q ON qs.queue_id = q.id
    WHERE q.status IN ('completed', 'serving', 'confirmed', 'waiting')
    GROUP BY qs.service_id
  ) service_bookings ON s.id = service_bookings.service_id
),
popular_services AS (
  SELECT 
    shop_id,
    jsonb_agg(
      jsonb_build_object(
        'id', id::text,
        'name', name,
        'bookingCount', booking_count
      ) 
      ORDER BY booking_count DESC
    ) as popular_services
  FROM popular_services_ranked
  WHERE rank <= 10
  GROUP BY shop_id
)
SELECT 
  sbs.shop_id,
  sbs.total_services,
  sbs.available_services,
  sbs.unavailable_services,
  ROUND(sbs.average_price::numeric, 2) as average_price,
  ROUND(COALESCE(sr.total_revenue, 0)::numeric, 2) as total_revenue,
  COALESCE(sbc.services_by_category, '{}'::jsonb) as services_by_category,
  COALESCE(ps.popular_services, '[]'::jsonb) as popular_services
FROM service_basic_stats sbs
LEFT JOIN service_revenue sr ON sbs.shop_id = sr.shop_id
LEFT JOIN services_by_category sbc ON sbs.shop_id = sbc.shop_id
LEFT JOIN popular_services ps ON sbs.shop_id = ps.shop_id;