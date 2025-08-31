-- Create dashboard stats view
CREATE OR REPLACE VIEW dashboard_stats_view AS
SELECT
    (SELECT COUNT(*) FROM shops) AS total_shops,
    (SELECT COUNT(*) FROM queues) AS total_queues,
    (SELECT COUNT(*) FROM customers) AS total_customers,
    (SELECT COUNT(*) FROM employees) AS total_employees,
    (SELECT COUNT(*) FROM queues q 
        WHERE q.status IN ('waiting','confirmed','serving')) AS active_queues,
    (SELECT COUNT(*) FROM queues q
        WHERE q.status = 'completed'
          AND q.completed_at::date = CURRENT_DATE) AS completed_queues_today,
    COALESCE((SELECT SUM(p.total_amount) 
              FROM payments p 
              WHERE p.payment_status = 'paid'),0) AS total_revenue,
    COALESCE((
        SELECT AVG(EXTRACT(EPOCH FROM (q.completed_at - q.created_at)) / 60.0)
        FROM queues q
        WHERE q.status = 'completed'
          AND q.completed_at IS NOT NULL
    ),0) AS average_wait_time;
