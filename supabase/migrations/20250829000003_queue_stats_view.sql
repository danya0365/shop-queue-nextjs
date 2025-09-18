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

-- Create queue statistics by shop view
CREATE OR REPLACE VIEW queue_comprehensive_stats_by_shop_view AS
SELECT
    s.id AS shop_id,
    s.name AS shop_name,
    s.slug AS shop_slug,
    s.status AS shop_status,
    s.timezone,
    
    -- Overall Queue Statistics
    COALESCE(overall_stats.total_queues, 0) AS total_queues,
    COALESCE(overall_stats.waiting_queues, 0) AS waiting_queues,
    COALESCE(overall_stats.confirmed_queues, 0) AS confirmed_queues,
    COALESCE(overall_stats.serving_queues, 0) AS serving_queues,
    COALESCE(overall_stats.completed_queues, 0) AS completed_queues,
    COALESCE(overall_stats.cancelled_queues, 0) AS cancelled_queues,
    COALESCE(overall_stats.no_show_queues, 0) AS no_show_queues,
    COALESCE(overall_stats.active_queues, 0) AS active_queues,
    
    -- Priority Statistics
    COALESCE(priority_stats.normal_priority_queues, 0) AS normal_priority_queues,
    COALESCE(priority_stats.high_priority_queues, 0) AS high_priority_queues,
    COALESCE(priority_stats.urgent_priority_queues, 0) AS urgent_priority_queues,
    
    -- Daily Statistics
    COALESCE(daily_stats.queues_created_today, 0) AS queues_created_today,
    COALESCE(daily_stats.queues_completed_today, 0) AS queues_completed_today,
    COALESCE(daily_stats.queues_cancelled_today, 0) AS queues_cancelled_today,
    COALESCE(daily_stats.queues_created_yesterday, 0) AS queues_created_yesterday,
    COALESCE(daily_stats.queues_completed_yesterday, 0) AS queues_completed_yesterday,
    
    -- Weekly Statistics
    COALESCE(weekly_stats.queues_created_this_week, 0) AS queues_created_this_week,
    COALESCE(weekly_stats.queues_completed_this_week, 0) AS queues_completed_this_week,
    COALESCE(weekly_stats.queues_created_last_week, 0) AS queues_created_last_week,
    COALESCE(weekly_stats.queues_completed_last_week, 0) AS queues_completed_last_week,
    
    -- Monthly Statistics
    COALESCE(monthly_stats.queues_created_this_month, 0) AS queues_created_this_month,
    COALESCE(monthly_stats.queues_completed_this_month, 0) AS queues_completed_this_month,
    COALESCE(monthly_stats.queues_created_last_month, 0) AS queues_created_last_month,
    COALESCE(monthly_stats.queues_completed_last_month, 0) AS queues_completed_last_month,
    
    -- Performance Statistics
    COALESCE(performance_stats.average_wait_time_minutes, 0) AS average_wait_time_minutes,
    COALESCE(performance_stats.average_service_time_minutes, 0) AS average_service_time_minutes,
    COALESCE(performance_stats.average_total_time_minutes, 0) AS average_total_time_minutes,
    COALESCE(performance_stats.shortest_wait_time_minutes, 0) AS shortest_wait_time_minutes,
    COALESCE(performance_stats.longest_wait_time_minutes, 0) AS longest_wait_time_minutes,
    
    -- Completion Rate Statistics
    CASE 
        WHEN COALESCE(overall_stats.total_queues, 0) > 0 
        THEN ROUND((COALESCE(overall_stats.completed_queues, 0) * 100.0 / overall_stats.total_queues), 2)
        ELSE 0 
    END AS completion_rate_percentage,
    
    CASE 
        WHEN COALESCE(overall_stats.total_queues, 0) > 0 
        THEN ROUND((COALESCE(overall_stats.cancelled_queues, 0) * 100.0 / overall_stats.total_queues), 2)
        ELSE 0 
    END AS cancellation_rate_percentage,
    
    CASE 
        WHEN COALESCE(overall_stats.total_queues, 0) > 0 
        THEN ROUND((COALESCE(overall_stats.no_show_queues, 0) * 100.0 / overall_stats.total_queues), 2)
        ELSE 0 
    END AS no_show_rate_percentage,
    
    -- Customer Satisfaction Statistics
    COALESCE(satisfaction_stats.average_rating, 0) AS average_rating,
    COALESCE(satisfaction_stats.total_ratings, 0) AS total_ratings,
    COALESCE(satisfaction_stats.five_star_ratings, 0) AS five_star_ratings,
    COALESCE(satisfaction_stats.four_star_ratings, 0) AS four_star_ratings,
    COALESCE(satisfaction_stats.three_star_ratings, 0) AS three_star_ratings,
    COALESCE(satisfaction_stats.two_star_ratings, 0) AS two_star_ratings,
    COALESCE(satisfaction_stats.one_star_ratings, 0) AS one_star_ratings,
    COALESCE(satisfaction_stats.queues_with_feedback, 0) AS queues_with_feedback,
    
    -- Peak Hours Statistics
    COALESCE(peak_stats.peak_hour, 0) AS peak_hour,
    COALESCE(peak_stats.peak_hour_queue_count, 0) AS peak_hour_queue_count,
    
    -- Employee Performance
    COALESCE(employee_stats.most_active_employee_id, NULL) AS most_active_employee_id,
    COALESCE(employee_stats.most_active_employee_name, '') AS most_active_employee_name,
    COALESCE(employee_stats.most_active_employee_queue_count, 0) AS most_active_employee_queue_count,
    
    -- Service Statistics
    COALESCE(service_stats.most_popular_service_id, NULL) AS most_popular_service_id,
    COALESCE(service_stats.most_popular_service_name, '') AS most_popular_service_name,
    COALESCE(service_stats.most_popular_service_queue_count, 0) AS most_popular_service_queue_count,
    
    -- Growth Statistics
    CASE 
        WHEN COALESCE(daily_stats.queues_created_yesterday, 0) > 0 
        THEN ROUND(((COALESCE(daily_stats.queues_created_today, 0) - COALESCE(daily_stats.queues_created_yesterday, 0)) * 100.0 / COALESCE(daily_stats.queues_created_yesterday, 1)), 2)
        ELSE 0 
    END AS daily_growth_percentage,
    
    CASE 
        WHEN COALESCE(weekly_stats.queues_created_last_week, 0) > 0 
        THEN ROUND(((COALESCE(weekly_stats.queues_created_this_week, 0) - COALESCE(weekly_stats.queues_created_last_week, 0)) * 100.0 / COALESCE(weekly_stats.queues_created_last_week, 1)), 2)
        ELSE 0 
    END AS weekly_growth_percentage,
    
    CASE 
        WHEN COALESCE(monthly_stats.queues_created_last_month, 0) > 0 
        THEN ROUND(((COALESCE(monthly_stats.queues_created_this_month, 0) - COALESCE(monthly_stats.queues_created_last_month, 0)) * 100.0 / COALESCE(monthly_stats.queues_created_last_month, 1)), 2)
        ELSE 0 
    END AS monthly_growth_percentage,
    
    -- Current Status
    COALESCE(current_stats.current_wait_time_estimate, 0) AS current_wait_time_estimate,
    COALESCE(current_stats.longest_waiting_queue_minutes, 0) AS longest_waiting_queue_minutes,
    
    -- Timestamps
    NOW() AS stats_generated_at

FROM public.shops s

-- Overall statistics
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_queues,
        COUNT(*) FILTER (WHERE status = 'waiting') AS waiting_queues,
        COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_queues,
        COUNT(*) FILTER (WHERE status = 'serving') AS serving_queues,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_queues,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_queues,
        COUNT(*) FILTER (WHERE status = 'no_show') AS no_show_queues,
        COUNT(*) FILTER (WHERE status IN ('waiting','confirmed','serving')) AS active_queues
    FROM public.queues
    GROUP BY shop_id
) overall_stats ON s.id = overall_stats.shop_id

-- Priority statistics
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) FILTER (WHERE priority = 'normal') AS normal_priority_queues,
        COUNT(*) FILTER (WHERE priority = 'high') AS high_priority_queues,
        COUNT(*) FILTER (WHERE priority = 'urgent') AS urgent_priority_queues
    FROM public.queues
    GROUP BY shop_id
) priority_stats ON s.id = priority_stats.shop_id

-- Daily statistics
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS queues_created_today,
        COUNT(*) FILTER (WHERE completed_at::date = CURRENT_DATE) AS queues_completed_today,
        COUNT(*) FILTER (WHERE cancelled_at::date = CURRENT_DATE) AS queues_cancelled_today,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day') AS queues_created_yesterday,
        COUNT(*) FILTER (WHERE completed_at::date = CURRENT_DATE - INTERVAL '1 day') AS queues_completed_yesterday
    FROM public.queues
    GROUP BY shop_id
) daily_stats ON s.id = daily_stats.shop_id

-- Weekly statistics
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) AS queues_created_this_week,
        COUNT(*) FILTER (WHERE completed_at >= DATE_TRUNC('week', CURRENT_DATE)) AS queues_completed_this_week,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' AND created_at < DATE_TRUNC('week', CURRENT_DATE)) AS queues_created_last_week,
        COUNT(*) FILTER (WHERE completed_at >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' AND completed_at < DATE_TRUNC('week', CURRENT_DATE)) AS queues_completed_last_week
    FROM public.queues
    GROUP BY shop_id
) weekly_stats ON s.id = weekly_stats.shop_id

-- Monthly statistics
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) AS queues_created_this_month,
        COUNT(*) FILTER (WHERE completed_at >= DATE_TRUNC('month', CURRENT_DATE)) AS queues_completed_this_month,
        COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND created_at < DATE_TRUNC('month', CURRENT_DATE)) AS queues_created_last_month,
        COUNT(*) FILTER (WHERE completed_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND completed_at < DATE_TRUNC('month', CURRENT_DATE)) AS queues_completed_last_month
    FROM public.queues
    GROUP BY shop_id
) monthly_stats ON s.id = monthly_stats.shop_id

-- Performance statistics
LEFT JOIN (
    SELECT 
        shop_id,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60.0) AS average_wait_time_minutes,
        AVG(EXTRACT(EPOCH FROM (completed_at - served_at)) / 60.0) FILTER (WHERE served_at IS NOT NULL) AS average_service_time_minutes,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60.0) AS average_total_time_minutes,
        MIN(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60.0) AS shortest_wait_time_minutes,
        MAX(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60.0) AS longest_wait_time_minutes
    FROM public.queues
    WHERE status = 'completed' AND completed_at IS NOT NULL
    GROUP BY shop_id
) performance_stats ON s.id = performance_stats.shop_id

-- Customer satisfaction statistics
LEFT JOIN (
    SELECT 
        shop_id,
        AVG(rating) AS average_rating,
        COUNT(rating) AS total_ratings,
        COUNT(*) FILTER (WHERE rating = 5) AS five_star_ratings,
        COUNT(*) FILTER (WHERE rating = 4) AS four_star_ratings,
        COUNT(*) FILTER (WHERE rating = 3) AS three_star_ratings,
        COUNT(*) FILTER (WHERE rating = 2) AS two_star_ratings,
        COUNT(*) FILTER (WHERE rating = 1) AS one_star_ratings,
        COUNT(*) FILTER (WHERE feedback IS NOT NULL AND LENGTH(TRIM(feedback)) > 0) AS queues_with_feedback
    FROM public.queues
    WHERE rating IS NOT NULL
    GROUP BY shop_id
) satisfaction_stats ON s.id = satisfaction_stats.shop_id

-- Peak hours statistics
LEFT JOIN (
    SELECT DISTINCT ON (shop_id)
        shop_id,
        hour AS peak_hour,
        hour_count AS peak_hour_queue_count
    FROM (
        SELECT 
            shop_id,
            EXTRACT(HOUR FROM created_at) AS hour,
            COUNT(*) AS hour_count,
            ROW_NUMBER() OVER (PARTITION BY shop_id ORDER BY COUNT(*) DESC) AS rn
        FROM public.queues
        GROUP BY shop_id, EXTRACT(HOUR FROM created_at)
    ) peak_hours
    WHERE rn = 1
) peak_stats ON s.id = peak_stats.shop_id

-- Employee performance statistics
LEFT JOIN (
    SELECT DISTINCT ON (shop_id)
        shop_id,
        served_by_employee_id AS most_active_employee_id,
        employee_name AS most_active_employee_name,
        queue_count AS most_active_employee_queue_count
    FROM (
        SELECT 
            q.shop_id,
            q.served_by_employee_id,
            e.name AS employee_name,
            COUNT(*) AS queue_count,
            ROW_NUMBER() OVER (PARTITION BY q.shop_id ORDER BY COUNT(*) DESC) AS rn
        FROM public.queues q
        JOIN public.employees e ON e.id = q.served_by_employee_id
        WHERE q.served_by_employee_id IS NOT NULL
        GROUP BY q.shop_id, q.served_by_employee_id, e.name
    ) emp_perf
    WHERE rn = 1
) employee_stats ON s.id = employee_stats.shop_id

-- Service popularity statistics
LEFT JOIN (
    SELECT DISTINCT ON (shop_id)
        shop_id,
        service_id AS most_popular_service_id,
        service_name AS most_popular_service_name,
        queue_count AS most_popular_service_queue_count
    FROM (
        SELECT 
            q.shop_id,
            qs.service_id,
            srv.name AS service_name,
            COUNT(DISTINCT q.id) AS queue_count,
            ROW_NUMBER() OVER (PARTITION BY q.shop_id ORDER BY COUNT(DISTINCT q.id) DESC) AS rn
        FROM public.queues q
        JOIN public.queue_services qs ON qs.queue_id = q.id
        JOIN public.services srv ON srv.id = qs.service_id
        GROUP BY q.shop_id, qs.service_id, srv.name
    ) srv_pop
    WHERE rn = 1
) service_stats ON s.id = service_stats.shop_id

-- Current status statistics
LEFT JOIN (
    SELECT 
        shop_id,
        SUM(estimated_duration) AS current_wait_time_estimate,
        MAX(EXTRACT(EPOCH FROM (NOW() - created_at)) / 60.0) FILTER (WHERE status = 'waiting') AS longest_waiting_queue_minutes
    FROM public.queues
    WHERE status IN ('waiting', 'confirmed')
    GROUP BY shop_id
) current_stats ON s.id = current_stats.shop_id

-- Only include active and draft shops
WHERE s.status IN ('active', 'draft')

ORDER BY s.name;