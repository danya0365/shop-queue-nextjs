-- Create queue stats view
CREATE OR REPLACE VIEW queue_stats_view AS
SELECT
    COUNT(*) AS total_queues,
    COUNT(*) FILTER (WHERE status = 'waiting') AS waiting_queues,
    COUNT(*) FILTER (WHERE status IN ('confirmed','serving')) AS in_progress_queues,
    COUNT(*) FILTER (
        WHERE status = 'completed'
          AND completed_at::date = CURRENT_DATE
    ) AS completed_today,
    COUNT(*) FILTER (
        WHERE status = 'cancelled'
          AND updated_at::date = CURRENT_DATE
    ) AS cancelled_today,
    COALESCE((
        SELECT AVG(EXTRACT(EPOCH FROM (q.completed_at - q.created_at)) / 60.0)
        FROM queues q
        WHERE q.status = 'completed'
          AND q.completed_at IS NOT NULL
    ),0) AS average_wait_time
FROM queues;
