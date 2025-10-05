-- =====================================================
-- Queue Analytics Materialized Views
-- Purpose: Improve analytics performance by pre-calculating queue statistics
-- Created: 2025-10-05
-- =====================================================

-- =====================================================
-- 1. Queue Analytics View (Main Analytics Data)
-- =====================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS public.queue_analytics AS
WITH queue_stats AS (
  SELECT
    q.shop_id,
    DATE_TRUNC('day', q.created_at) AS date_from,
    DATE_TRUNC('day', q.created_at) + INTERVAL '1 day' AS date_to,
    
    -- Queue counts by status
    COUNT(*) AS total_queues,
    COUNT(*) FILTER (WHERE q.status = 'completed') AS completed_queues,
    COUNT(*) FILTER (WHERE q.status = 'cancelled') AS cancelled_queues,
    COUNT(*) FILTER (WHERE q.status = 'no_show') AS no_show_queues,
    COUNT(*) FILTER (WHERE q.status IN ('waiting', 'confirmed', 'serving')) AS in_progress_queues,
    COUNT(*) FILTER (WHERE q.status = 'waiting') AS waiting_queues,
    
    -- Wait time statistics (in minutes)
    ROUND(AVG(q.actual_wait_time)) AS average_wait_time,
    
    -- Service time statistics (in minutes)
    ROUND(AVG(
      CASE 
        WHEN q.completed_at IS NOT NULL AND q.served_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (q.completed_at - q.served_at)) / 60
        ELSE NULL
      END
    )) AS average_service_time,
    
    -- Rates (as percentages)
    ROUND(
      (COUNT(*) FILTER (WHERE q.status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
      2
    ) AS completion_rate,
    ROUND(
      (COUNT(*) FILTER (WHERE q.status = 'cancelled')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
      2
    ) AS cancellation_rate,
    ROUND(
      (COUNT(*) FILTER (WHERE q.status = 'no_show')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
      2
    ) AS no_show_rate
    
  FROM public.queues q
  GROUP BY q.shop_id, DATE_TRUNC('day', q.created_at)
)
SELECT
  uuid_generate_v4() AS id,
  shop_id,
  date_from,
  date_to,
  total_queues,
  completed_queues,
  cancelled_queues,
  no_show_queues,
  in_progress_queues,
  waiting_queues,
  COALESCE(average_wait_time, 0) AS average_wait_time,
  COALESCE(average_service_time, 0) AS average_service_time,
  COALESCE(completion_rate, 0) AS completion_rate,
  COALESCE(cancellation_rate, 0) AS cancellation_rate,
  COALESCE(no_show_rate, 0) AS no_show_rate,
  NOW() AS created_at,
  NOW() AS updated_at
FROM queue_stats;

-- Create unique index for concurrent refresh (required for CONCURRENTLY option)
CREATE UNIQUE INDEX IF NOT EXISTS idx_queue_analytics_unique ON public.queue_analytics(id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_queue_analytics_shop_id ON public.queue_analytics(shop_id);
CREATE INDEX IF NOT EXISTS idx_queue_analytics_date_from ON public.queue_analytics(date_from);
CREATE INDEX IF NOT EXISTS idx_queue_analytics_date_to ON public.queue_analytics(date_to);
CREATE INDEX IF NOT EXISTS idx_queue_analytics_shop_date ON public.queue_analytics(shop_id, date_from, date_to);

-- =====================================================
-- 2. Queue Peak Hours View
-- =====================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS public.queue_peak_hours AS
WITH hourly_stats AS (
  SELECT
    q.shop_id,
    DATE_TRUNC('day', q.created_at) AS date_from,
    DATE_TRUNC('day', q.created_at) + INTERVAL '1 day' AS date_to,
    EXTRACT(HOUR FROM q.created_at)::INTEGER AS hour,
    
    COUNT(*) AS queue_count,
    ROUND(AVG(q.actual_wait_time)) AS average_wait_time,
    ROUND(
      (COUNT(*) FILTER (WHERE q.status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
      2
    ) AS completion_rate
    
  FROM public.queues q
  GROUP BY q.shop_id, DATE_TRUNC('day', q.created_at), EXTRACT(HOUR FROM q.created_at)
),
peak_hours_data AS (
  SELECT
    shop_id,
    date_from,
    date_to,
    hour,
    queue_count,
    COALESCE(average_wait_time, 0) AS average_wait_time,
    COALESCE(completion_rate, 0) AS completion_rate,
    -- Determine if this is a peak hour (above average for the day)
    CASE 
      WHEN queue_count > AVG(queue_count) OVER (PARTITION BY shop_id, date_from) 
      THEN true 
      ELSE false 
    END AS is_peak_hour
  FROM hourly_stats
),
staffing_recommendations AS (
  SELECT
    shop_id,
    date_from,
    date_to,
    hour,
    queue_count,
    average_wait_time,
    completion_rate,
    is_peak_hour,
    -- Staffing recommendation based on queue count
    CASE
      WHEN queue_count >= 20 THEN 3
      WHEN queue_count >= 10 THEN 2
      ELSE 1
    END AS recommended_employees,
    -- Reason for staffing recommendation
    CASE
      WHEN queue_count >= 20 THEN 'High volume - 20+ queues'
      WHEN queue_count >= 10 THEN 'Medium volume - 10-19 queues'
      ELSE 'Normal volume - Less than 10 queues'
    END AS staffing_reason
  FROM peak_hours_data
)
SELECT
  uuid_generate_v4() AS id,
  shop_id,
  date_from,
  date_to,
  
  -- Peak hours (top 8 busiest hours)
  (
    SELECT json_agg(
      json_build_object(
        'hour', hour,
        'queueCount', queue_count,
        'averageWaitTime', average_wait_time,
        'completionRate', completion_rate
      ) ORDER BY queue_count DESC
    )
    FROM (
      SELECT hour, queue_count, average_wait_time, completion_rate
      FROM staffing_recommendations sr
      WHERE sr.shop_id = s.shop_id 
        AND sr.date_from = s.date_from
        AND sr.is_peak_hour = true
      ORDER BY queue_count DESC
      LIMIT 8
    ) peak
  ) AS peak_hours,
  
  -- Quiet hours (top 8 quietest hours)
  (
    SELECT json_agg(
      json_build_object(
        'hour', hour,
        'queueCount', queue_count,
        'averageWaitTime', average_wait_time
      ) ORDER BY queue_count ASC
    )
    FROM (
      SELECT hour, queue_count, average_wait_time
      FROM staffing_recommendations sr
      WHERE sr.shop_id = s.shop_id 
        AND sr.date_from = s.date_from
        AND sr.is_peak_hour = false
      ORDER BY queue_count ASC
      LIMIT 8
    ) quiet
  ) AS quiet_hours,
  
  -- Recommended staffing per hour
  (
    SELECT json_agg(
      json_build_object(
        'hour', hour,
        'recommendedEmployees', recommended_employees,
        'reason', staffing_reason
      ) ORDER BY hour
    )
    FROM staffing_recommendations sr
    WHERE sr.shop_id = s.shop_id 
      AND sr.date_from = s.date_from
  ) AS recommended_staffing,
  
  NOW() AS created_at,
  NOW() AS updated_at
  
FROM (
  SELECT DISTINCT shop_id, date_from, date_to
  FROM staffing_recommendations
) s;

-- Create unique index for concurrent refresh (required for CONCURRENTLY option)
CREATE UNIQUE INDEX IF NOT EXISTS idx_queue_peak_hours_unique ON public.queue_peak_hours(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_queue_peak_hours_shop_id ON public.queue_peak_hours(shop_id);
CREATE INDEX IF NOT EXISTS idx_queue_peak_hours_date_from ON public.queue_peak_hours(date_from);
CREATE INDEX IF NOT EXISTS idx_queue_peak_hours_shop_date ON public.queue_peak_hours(shop_id, date_from, date_to);

-- =====================================================
-- 3. Queue Service Analytics View
-- =====================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS public.queue_service_analytics AS
WITH service_queue_stats AS (
  SELECT
    q.shop_id,
    DATE_TRUNC('day', q.created_at) AS date_from,
    DATE_TRUNC('day', q.created_at) + INTERVAL '1 day' AS date_to,
    qs.service_id,
    s.name AS service_name,
    
    COUNT(DISTINCT q.id) AS total_queues,
    COUNT(DISTINCT q.id) FILTER (WHERE q.status = 'completed') AS completed_queues,
    
    ROUND(AVG(q.actual_wait_time)) AS average_wait_time,
    ROUND(AVG(
      CASE 
        WHEN q.completed_at IS NOT NULL AND q.served_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (q.completed_at - q.served_at)) / 60
        ELSE NULL
      END
    )) AS average_service_time,
    
    COALESCE(SUM(qs.price * qs.quantity), 0) AS revenue,
    
    -- Popularity score calculation
    ROUND(
      (COUNT(DISTINCT q.id)::DECIMAL * 0.4) + 
      (COUNT(DISTINCT q.id) FILTER (WHERE q.status = 'completed')::DECIMAL * 0.3) +
      (COALESCE(SUM(qs.price * qs.quantity), 0) * 0.3),
      2
    ) AS popularity_score
    
  FROM public.queues q
  INNER JOIN public.queue_services qs ON q.id = qs.queue_id
  INNER JOIN public.services s ON qs.service_id = s.id
  GROUP BY q.shop_id, DATE_TRUNC('day', q.created_at), qs.service_id, s.name
),
service_stats_aggregated AS (
  SELECT
    sqs_main.shop_id,
    sqs_main.date_from,
    sqs_main.date_to,
    
    -- Service stats array
    json_agg(
      json_build_object(
        'serviceId', sqs_main.service_id,
        'serviceName', sqs_main.service_name,
        'totalQueues', sqs_main.total_queues,
        'completedQueues', sqs_main.completed_queues,
        'averageWaitTime', COALESCE(sqs_main.average_wait_time, 0),
        'averageServiceTime', COALESCE(sqs_main.average_service_time, 0),
        'revenue', sqs_main.revenue,
        'popularityScore', sqs_main.popularity_score
      ) ORDER BY sqs_main.popularity_score DESC
    ) AS service_stats,
    
    -- Top 10 services
    (
      SELECT json_agg(
        json_build_object(
          'serviceId', service_id,
          'serviceName', service_name,
          'queueCount', total_queues,
          'revenue', revenue
        )
      )
      FROM (
        SELECT service_id, service_name, total_queues, revenue
        FROM service_queue_stats sqs_top
        WHERE sqs_top.shop_id = sqs_main.shop_id 
          AND sqs_top.date_from = sqs_main.date_from
        ORDER BY total_queues DESC
        LIMIT 10
      ) top
    ) AS top_services,
    
    -- Least popular 10 services
    (
      SELECT json_agg(
        json_build_object(
          'serviceId', service_id,
          'serviceName', service_name,
          'queueCount', total_queues,
          'revenue', revenue
        )
      )
      FROM (
        SELECT service_id, service_name, total_queues, revenue
        FROM service_queue_stats sqs_least
        WHERE sqs_least.shop_id = sqs_main.shop_id 
          AND sqs_least.date_from = sqs_main.date_from
        ORDER BY total_queues ASC
        LIMIT 10
      ) least
    ) AS least_popular_services
    
  FROM service_queue_stats sqs_main
  GROUP BY sqs_main.shop_id, sqs_main.date_from, sqs_main.date_to
)
SELECT
  uuid_generate_v4() AS id,
  shop_id,
  date_from,
  date_to,
  service_stats,
  top_services,
  least_popular_services,
  NOW() AS created_at,
  NOW() AS updated_at
FROM service_stats_aggregated;

-- Create unique index for concurrent refresh (required for CONCURRENTLY option)
CREATE UNIQUE INDEX IF NOT EXISTS idx_queue_service_analytics_unique ON public.queue_service_analytics(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_queue_service_analytics_shop_id ON public.queue_service_analytics(shop_id);
CREATE INDEX IF NOT EXISTS idx_queue_service_analytics_date_from ON public.queue_service_analytics(date_from);
CREATE INDEX IF NOT EXISTS idx_queue_service_analytics_shop_date ON public.queue_service_analytics(shop_id, date_from, date_to);

-- =====================================================
-- 4. Queue Analytics Cache Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.queue_analytics_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  analytics_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for cache table
CREATE INDEX IF NOT EXISTS idx_queue_analytics_cache_shop_id ON public.queue_analytics_cache(shop_id);
CREATE INDEX IF NOT EXISTS idx_queue_analytics_cache_key ON public.queue_analytics_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_queue_analytics_cache_expires_at ON public.queue_analytics_cache(expires_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_queue_analytics_cache_shop_key ON public.queue_analytics_cache(shop_id, cache_key);

-- =====================================================
-- 5. Refresh Functions
-- =====================================================

-- Function to refresh all analytics views
CREATE OR REPLACE FUNCTION refresh_queue_analytics_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.queue_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.queue_peak_hours;
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.queue_service_analytics;
END;
$$;

-- Function to refresh analytics for a specific shop
CREATE OR REPLACE FUNCTION refresh_queue_analytics_for_shop(p_shop_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Note: Materialized views don't support partial refresh
  -- This function is a placeholder for future optimization
  PERFORM refresh_queue_analytics_views();
END;
$$;

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_analytics_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.queue_analytics_cache
  WHERE expires_at < NOW();
END;
$$;

-- =====================================================
-- 6. Automatic Refresh Schedule (using pg_cron if available)
-- =====================================================

-- Note: Uncomment the following if pg_cron extension is installed
-- SELECT cron.schedule(
--   'refresh-queue-analytics',
--   '*/15 * * * *', -- Every 15 minutes
--   'SELECT refresh_queue_analytics_views();'
-- );

-- SELECT cron.schedule(
--   'clean-analytics-cache',
--   '0 * * * *', -- Every hour
--   'SELECT clean_expired_analytics_cache();'
-- );

-- =====================================================
-- 7. Triggers for Auto-refresh (Alternative to pg_cron)
-- =====================================================

-- Function to invalidate cache when queue data changes
CREATE OR REPLACE FUNCTION invalidate_queue_analytics_cache()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete cache entries for the affected shop
  DELETE FROM public.queue_analytics_cache
  WHERE shop_id = COALESCE(NEW.shop_id, OLD.shop_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger on queues table
DROP TRIGGER IF EXISTS trigger_invalidate_queue_analytics_cache ON public.queues;
CREATE TRIGGER trigger_invalidate_queue_analytics_cache
  AFTER INSERT OR UPDATE OR DELETE ON public.queues
  FOR EACH ROW
  EXECUTE FUNCTION invalidate_queue_analytics_cache();

-- =====================================================
-- 8. Helper Views for Quick Access
-- =====================================================

-- Today's analytics
CREATE OR REPLACE VIEW public.queue_analytics_today AS
SELECT * FROM public.queue_analytics
WHERE date_from = CURRENT_DATE;

-- This week's analytics
CREATE OR REPLACE VIEW public.queue_analytics_this_week AS
SELECT * FROM public.queue_analytics
WHERE date_from >= DATE_TRUNC('week', CURRENT_DATE)
  AND date_from < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week';

-- This month's analytics
CREATE OR REPLACE VIEW public.queue_analytics_this_month AS
SELECT * FROM public.queue_analytics
WHERE date_from >= DATE_TRUNC('month', CURRENT_DATE)
  AND date_from < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';

-- =====================================================
-- 9. Grant Permissions
-- =====================================================

-- Grant access to authenticated users
GRANT SELECT ON public.queue_analytics TO authenticated;
GRANT SELECT ON public.queue_peak_hours TO authenticated;
GRANT SELECT ON public.queue_service_analytics TO authenticated;
GRANT SELECT ON public.queue_analytics_cache TO authenticated;
GRANT ALL ON public.queue_analytics_cache TO authenticated;

GRANT SELECT ON public.queue_analytics_today TO authenticated;
GRANT SELECT ON public.queue_analytics_this_week TO authenticated;
GRANT SELECT ON public.queue_analytics_this_month TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION refresh_queue_analytics_views() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_queue_analytics_for_shop(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION clean_expired_analytics_cache() TO authenticated;

-- =====================================================
-- 10. Initial Data Population
-- =====================================================

-- Refresh all views with existing data
SELECT refresh_queue_analytics_views();

-- =====================================================
-- Migration Complete
-- =====================================================
-- The following materialized views have been created:
-- 1. queue_analytics - Main analytics data
-- 2. queue_peak_hours - Peak hours analysis
-- 3. queue_service_analytics - Service-level analytics
-- 4. queue_analytics_cache - Cache table for performance
--
-- Helper functions:
-- - refresh_queue_analytics_views() - Refresh all views
-- - refresh_queue_analytics_for_shop(shop_id) - Refresh for specific shop
-- - clean_expired_analytics_cache() - Clean expired cache
--
-- Auto-refresh triggers have been set up on the queues table
-- =====================================================
