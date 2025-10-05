-- =====================================================
-- Global Dashboard RPC Functions
-- =====================================================
-- Description: RPC functions for retrieving aggregated dashboard data across all shops owned by a user
-- Created: 2025-10-05
-- =====================================================

-- =====================================================
-- Function: get_global_dashboard_stats
-- Description: Get aggregated statistics across all shops owned by a user
-- Parameters:
--   - p_profile_id: The profile ID of the shop owner
-- Returns: JSON object with global dashboard statistics
-- =====================================================
CREATE OR REPLACE FUNCTION get_global_dashboard_stats(p_profile_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
  v_today_start TIMESTAMPTZ;
  v_yesterday_start TIMESTAMPTZ;
  v_yesterday_end TIMESTAMPTZ;
  v_week_start TIMESTAMPTZ;
  v_month_start TIMESTAMPTZ;
BEGIN
  -- Set date ranges
  v_today_start := DATE_TRUNC('day', NOW());
  v_yesterday_start := DATE_TRUNC('day', NOW() - INTERVAL '1 day');
  v_yesterday_end := DATE_TRUNC('day', NOW());
  v_week_start := DATE_TRUNC('week', NOW());
  v_month_start := DATE_TRUNC('month', NOW());

  -- Build result JSON
  SELECT JSON_BUILD_OBJECT(
    -- Shop Statistics
    'total_shops', (
      SELECT COUNT(*)
      FROM shops
      WHERE owner_id = p_profile_id
    ),
    'active_shops', (
      SELECT COUNT(*)
      FROM shops
      WHERE owner_id = p_profile_id AND status = 'active'
    ),
    'inactive_shops', (
      SELECT COUNT(*)
      FROM shops
      WHERE owner_id = p_profile_id AND status = 'inactive'
    ),
    
    -- Queue Statistics
    'total_queues_all_time', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
    ),
    'active_queues', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.status IN ('waiting', 'confirmed', 'serving')
    ),
    'waiting_queues', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id AND q.status = 'waiting'
    ),
    'confirmed_queues', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id AND q.status = 'confirmed'
    ),
    'serving_queues', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id AND q.status = 'serving'
    ),
    'completed_queues_today', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.status = 'completed'
        AND q.completed_at >= v_today_start
    ),
    'cancelled_queues_today', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.status = 'cancelled'
        AND q.updated_at >= v_today_start
    ),
    'pending_queues', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.status IN ('waiting', 'confirmed')
    ),
    
    -- Revenue Statistics
    'today_revenue', COALESCE((
      SELECT SUM(p.paid_amount)
      FROM payments p
      JOIN queues q ON p.queue_id = q.id
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND p.payment_status = 'paid'
        AND p.payment_date >= v_today_start
    ), 0),
    'yesterday_revenue', COALESCE((
      SELECT SUM(p.paid_amount)
      FROM payments p
      JOIN queues q ON p.queue_id = q.id
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND p.payment_status = 'paid'
        AND p.payment_date >= v_yesterday_start
        AND p.payment_date < v_yesterday_end
    ), 0),
    'this_week_revenue', COALESCE((
      SELECT SUM(p.paid_amount)
      FROM payments p
      JOIN queues q ON p.queue_id = q.id
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND p.payment_status = 'paid'
        AND p.payment_date >= v_week_start
    ), 0),
    'this_month_revenue', COALESCE((
      SELECT SUM(p.paid_amount)
      FROM payments p
      JOIN queues q ON p.queue_id = q.id
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND p.payment_status = 'paid'
        AND p.payment_date >= v_month_start
    ), 0),
    'revenue_change', (
      SELECT CASE
        WHEN yesterday_rev = 0 THEN 0
        ELSE ROUND(((today_rev - yesterday_rev) / yesterday_rev * 100)::NUMERIC, 2)
      END
      FROM (
        SELECT
          COALESCE((
            SELECT SUM(p.paid_amount)
            FROM payments p
            JOIN queues q ON p.queue_id = q.id
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND p.payment_status = 'paid'
              AND p.payment_date >= v_today_start
          ), 0) AS today_rev,
          COALESCE((
            SELECT SUM(p.paid_amount)
            FROM payments p
            JOIN queues q ON p.queue_id = q.id
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND p.payment_status = 'paid'
              AND p.payment_date >= v_yesterday_start
              AND p.payment_date < v_yesterday_end
          ), 0) AS yesterday_rev
      ) AS rev_calc
    ),
    'revenue_change_type', (
      SELECT CASE
        WHEN today_rev > yesterday_rev THEN 'increase'
        WHEN today_rev < yesterday_rev THEN 'decrease'
        ELSE 'stable'
      END
      FROM (
        SELECT
          COALESCE((
            SELECT SUM(p.paid_amount)
            FROM payments p
            JOIN queues q ON p.queue_id = q.id
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND p.payment_status = 'paid'
              AND p.payment_date >= v_today_start
          ), 0) AS today_rev,
          COALESCE((
            SELECT SUM(p.paid_amount)
            FROM payments p
            JOIN queues q ON p.queue_id = q.id
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND p.payment_status = 'paid'
              AND p.payment_date >= v_yesterday_start
              AND p.payment_date < v_yesterday_end
          ), 0) AS yesterday_rev
      ) AS rev_calc
    ),
    
    -- Service Statistics
    'served_today', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.status = 'completed'
        AND q.completed_at >= v_today_start
    ),
    'served_yesterday', (
      SELECT COUNT(*)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.status = 'completed'
        AND q.completed_at >= v_yesterday_start
        AND q.completed_at < v_yesterday_end
    ),
    'served_change', (
      SELECT CASE
        WHEN yesterday_served = 0 THEN 0
        ELSE ROUND(((today_served - yesterday_served)::NUMERIC / yesterday_served * 100), 2)
      END
      FROM (
        SELECT
          (
            SELECT COUNT(*)
            FROM queues q
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND q.status = 'completed'
              AND q.completed_at >= v_today_start
          ) AS today_served,
          (
            SELECT COUNT(*)
            FROM queues q
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND q.status = 'completed'
              AND q.completed_at >= v_yesterday_start
              AND q.completed_at < v_yesterday_end
          ) AS yesterday_served
      ) AS served_calc
    ),
    'served_change_type', (
      SELECT CASE
        WHEN today_served > yesterday_served THEN 'increase'
        WHEN today_served < yesterday_served THEN 'decrease'
        ELSE 'stable'
      END
      FROM (
        SELECT
          (
            SELECT COUNT(*)
            FROM queues q
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND q.status = 'completed'
              AND q.completed_at >= v_today_start
          ) AS today_served,
          (
            SELECT COUNT(*)
            FROM queues q
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND q.status = 'completed'
              AND q.completed_at >= v_yesterday_start
              AND q.completed_at < v_yesterday_end
          ) AS yesterday_served
      ) AS served_calc
    ),
    
    -- Wait Time Statistics
    'average_wait_time', COALESCE((
      SELECT ROUND(AVG(EXTRACT(EPOCH FROM (q.served_at - q.created_at)) / 60)::NUMERIC, 0)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.served_at IS NOT NULL
        AND q.created_at >= v_today_start
    ), 0),
    'average_wait_time_yesterday', COALESCE((
      SELECT ROUND(AVG(EXTRACT(EPOCH FROM (q.served_at - q.created_at)) / 60)::NUMERIC, 0)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.served_at IS NOT NULL
        AND q.created_at >= v_yesterday_start
        AND q.created_at < v_yesterday_end
    ), 0),
    'wait_time_change', (
      SELECT CASE
        WHEN yesterday_wait = 0 THEN 0
        ELSE ROUND(((today_wait - yesterday_wait) / yesterday_wait * 100)::NUMERIC, 2)
      END
      FROM (
        SELECT
          COALESCE((
            SELECT AVG(EXTRACT(EPOCH FROM (q.served_at - q.created_at)) / 60)
            FROM queues q
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND q.served_at IS NOT NULL
              AND q.created_at >= v_today_start
          ), 0) AS today_wait,
          COALESCE((
            SELECT AVG(EXTRACT(EPOCH FROM (q.served_at - q.created_at)) / 60)
            FROM queues q
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND q.served_at IS NOT NULL
              AND q.created_at >= v_yesterday_start
              AND q.created_at < v_yesterday_end
          ), 0) AS yesterday_wait
      ) AS wait_calc
    ),
    'wait_time_change_type', (
      SELECT CASE
        WHEN today_wait > yesterday_wait THEN 'increase'
        WHEN today_wait < yesterday_wait THEN 'decrease'
        ELSE 'stable'
      END
      FROM (
        SELECT
          COALESCE((
            SELECT AVG(EXTRACT(EPOCH FROM (q.served_at - q.created_at)) / 60)
            FROM queues q
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND q.served_at IS NOT NULL
              AND q.created_at >= v_today_start
          ), 0) AS today_wait,
          COALESCE((
            SELECT AVG(EXTRACT(EPOCH FROM (q.served_at - q.created_at)) / 60)
            FROM queues q
            JOIN shops s ON q.shop_id = s.id
            WHERE s.owner_id = p_profile_id
              AND q.served_at IS NOT NULL
              AND q.created_at >= v_yesterday_start
              AND q.created_at < v_yesterday_end
          ), 0) AS yesterday_wait
      ) AS wait_calc
    ),
    
    -- Employee Statistics
    'total_employees', (
      SELECT COUNT(*)
      FROM employees e
      JOIN shops s ON e.shop_id = s.id
      WHERE s.owner_id = p_profile_id
    ),
    'active_employees', (
      SELECT COUNT(*)
      FROM employees e
      JOIN shops s ON e.shop_id = s.id
      WHERE s.owner_id = p_profile_id AND e.status = 'active'
    ),
    'online_employees', (
      SELECT COUNT(*)
      FROM employees e
      JOIN shops s ON e.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND e.status = 'active'
        AND e.last_login >= NOW() - INTERVAL '5 minutes'
    ),
    'serving_employees', (
      SELECT COUNT(DISTINCT q.served_by_employee_id)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.status = 'serving'
        AND q.served_by_employee_id IS NOT NULL
    ),
    
    -- Customer Statistics
    'total_customers', (
      SELECT COUNT(DISTINCT c.id)
      FROM customers c
      JOIN shops s ON c.shop_id = s.id
      WHERE s.owner_id = p_profile_id
    ),
    'new_customers_today', (
      SELECT COUNT(*)
      FROM customers c
      JOIN shops s ON c.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND c.created_at >= v_today_start
    ),
    'returning_customers_today', (
      SELECT COUNT(DISTINCT q.customer_id)
      FROM queues q
      JOIN shops s ON q.shop_id = s.id
      WHERE s.owner_id = p_profile_id
        AND q.created_at >= v_today_start
        AND q.customer_id IN (
          SELECT customer_id
          FROM queues q2
          WHERE q2.shop_id = q.shop_id
            AND q2.created_at < v_today_start
        )
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_global_dashboard_stats(UUID) TO authenticated;

-- =====================================================
-- Function: get_global_recent_activities
-- Description: Get recent activities across all shops owned by a user
-- Parameters:
--   - p_profile_id: The profile ID of the shop owner
--   - p_limit: Maximum number of activities to return (default: 10)
-- Returns: Array of recent activity records
-- =====================================================
CREATE OR REPLACE FUNCTION get_global_recent_activities(
  p_profile_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  id UUID,
  shop_id UUID,
  shop_name TEXT,
  type TEXT,
  title TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.shop_id,
    s.name AS shop_name,
    a.type::TEXT,
    a.title,
    a.description,
    a.metadata,
    a.created_at
  FROM shop_activity_log a
  JOIN shops s ON a.shop_id = s.id
  WHERE s.owner_id = p_profile_id
  ORDER BY a.created_at DESC
  LIMIT p_limit;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_global_recent_activities(UUID, INTEGER) TO authenticated;

-- =====================================================
-- Function: get_shop_performances
-- Description: Get performance summary for each shop owned by a user
-- Parameters:
--   - p_profile_id: The profile ID of the shop owner
-- Returns: Array of shop performance summaries
-- =====================================================
CREATE OR REPLACE FUNCTION get_shop_performances(p_profile_id UUID)
RETURNS TABLE (
  shop_id UUID,
  shop_name TEXT,
  today_queues BIGINT,
  today_revenue NUMERIC,
  today_served BIGINT,
  average_wait_time NUMERIC,
  active_queues BIGINT,
  completion_rate NUMERIC,
  status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today_start TIMESTAMPTZ;
BEGIN
  v_today_start := DATE_TRUNC('day', NOW());

  RETURN QUERY
  SELECT
    s.id AS shop_id,
    s.name AS shop_name,
    COALESCE((
      SELECT COUNT(*)
      FROM queues q
      WHERE q.shop_id = s.id
        AND q.created_at >= v_today_start
    ), 0) AS today_queues,
    COALESCE((
      SELECT SUM(p.paid_amount)
      FROM payments p
      JOIN queues q ON p.queue_id = q.id
      WHERE q.shop_id = s.id
        AND p.payment_status = 'paid'
        AND p.payment_date >= v_today_start
    ), 0) AS today_revenue,
    COALESCE((
      SELECT COUNT(*)
      FROM queues q
      WHERE q.shop_id = s.id
        AND q.status = 'completed'
        AND q.completed_at >= v_today_start
    ), 0) AS today_served,
    COALESCE((
      SELECT ROUND(AVG(EXTRACT(EPOCH FROM (q.served_at - q.created_at)) / 60)::NUMERIC, 0)
      FROM queues q
      WHERE q.shop_id = s.id
        AND q.served_at IS NOT NULL
        AND q.created_at >= v_today_start
    ), 0) AS average_wait_time,
    COALESCE((
      SELECT COUNT(*)
      FROM queues q
      WHERE q.shop_id = s.id
        AND q.status IN ('waiting', 'confirmed', 'serving')
    ), 0) AS active_queues,
    COALESCE((
      SELECT CASE
        WHEN total_queues = 0 THEN 0
        ELSE ROUND((completed_queues::NUMERIC / total_queues * 100), 2)
      END
      FROM (
        SELECT
          COUNT(*) AS total_queues,
          COUNT(*) FILTER (WHERE q.status = 'completed') AS completed_queues
        FROM queues q
        WHERE q.shop_id = s.id
          AND q.created_at >= v_today_start
      ) AS queue_calc
    ), 0) AS completion_rate,
    s.status::TEXT AS status
  FROM shops s
  WHERE s.owner_id = p_profile_id
  ORDER BY s.name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_shop_performances(UUID) TO authenticated;

-- =====================================================
-- Comments
-- =====================================================
COMMENT ON FUNCTION get_global_dashboard_stats(UUID) IS 'Get aggregated statistics across all shops owned by a user';
COMMENT ON FUNCTION get_global_recent_activities(UUID, INTEGER) IS 'Get recent activities across all shops owned by a user';
COMMENT ON FUNCTION get_shop_performances(UUID) IS 'Get performance summary for each shop owned by a user';
