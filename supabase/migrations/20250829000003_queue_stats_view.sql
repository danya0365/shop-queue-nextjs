-- Create queue stats summary view
CREATE OR REPLACE VIEW queue_stats_summary_view AS
SELECT
    -- Today's statistics
    COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS total_queue_today,
    COUNT(*) FILTER (WHERE status = 'waiting' AND created_at::date = CURRENT_DATE) AS waiting_queue_today,
    COUNT(*) FILTER (WHERE status = 'confirmed' AND created_at::date = CURRENT_DATE) AS confirmed_queue_today,
    COUNT(*) FILTER (WHERE status = 'serving' AND created_at::date = CURRENT_DATE) AS serving_queue_today,
    COUNT(*) FILTER (WHERE status IN ('confirmed','serving') AND created_at::date = CURRENT_DATE) AS in_progress_queue_today,
    COUNT(*) FILTER (
        WHERE status = 'completed'
          AND completed_at::date = CURRENT_DATE
    ) AS total_completed_today,
    COUNT(*) FILTER (
        WHERE status = 'cancelled'
          AND updated_at::date = CURRENT_DATE
    ) AS total_cancelled_today,
    
    -- All-time statistics
    COUNT(*) AS all_queue_total,
    COUNT(*) FILTER (WHERE status = 'waiting') AS all_waiting_queue,
    COUNT(*) FILTER (WHERE status = 'confirmed') AS all_confirmed_queue,
    COUNT(*) FILTER (WHERE status = 'serving') AS all_serving_queue,
    COUNT(*) FILTER (WHERE status IN ('confirmed','serving')) AS all_in_progress_queue,
    COUNT(*) FILTER (WHERE status = 'completed') AS all_completed_total,
    COUNT(*) FILTER (WHERE status = 'cancelled') AS all_cancelled_total,
    
    -- Performance metrics
    COALESCE((
        SELECT AVG(EXTRACT(EPOCH FROM (q.completed_at - q.created_at)) / 60.0)
        FROM queues q
        WHERE q.status = 'completed'
          AND q.completed_at IS NOT NULL
    ), 0) AS avg_wait_time_minutes
FROM queues;


-- Create queue stats by shop view
CREATE OR REPLACE VIEW queue_stats_by_shop_view AS
SELECT
    shop_id,
    
    -- Today's statistics
    COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS total_queue_today,
    COUNT(*) FILTER (WHERE status = 'waiting' AND created_at::date = CURRENT_DATE) AS waiting_queue_today,
    COUNT(*) FILTER (WHERE status = 'confirmed' AND created_at::date = CURRENT_DATE) AS confirmed_queue_today,
    COUNT(*) FILTER (WHERE status = 'serving' AND created_at::date = CURRENT_DATE) AS serving_queue_today,
    COUNT(*) FILTER (WHERE status IN ('confirmed','serving') AND created_at::date = CURRENT_DATE) AS in_progress_queue_today,
    COUNT(*) FILTER (
        WHERE status = 'completed'
          AND completed_at::date = CURRENT_DATE
    ) AS total_completed_today,
    COUNT(*) FILTER (
        WHERE status = 'cancelled'
          AND updated_at::date = CURRENT_DATE
    ) AS total_cancelled_today,
    
    -- All-time statistics
    COUNT(*) AS all_queue_total,
    COUNT(*) FILTER (WHERE status = 'waiting') AS all_waiting_queue,
    COUNT(*) FILTER (WHERE status = 'confirmed') AS all_confirmed_queue,
    COUNT(*) FILTER (WHERE status = 'serving') AS all_serving_queue,
    COUNT(*) FILTER (WHERE status IN ('confirmed','serving')) AS all_in_progress_queue,
    COUNT(*) FILTER (WHERE status = 'completed') AS all_completed_total,
    COUNT(*) FILTER (WHERE status = 'cancelled') AS all_cancelled_total,
    
    -- Performance metrics
    COALESCE(
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60.0) 
        FILTER (WHERE status = 'completed' AND completed_at IS NOT NULL),
        0
    ) AS avg_wait_time_minutes
FROM queues
GROUP BY shop_id;