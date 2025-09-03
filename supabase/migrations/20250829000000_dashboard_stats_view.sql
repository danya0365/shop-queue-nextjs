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


-- View for Queue Status Distribution Dashboard
-- Maps to QueueStatusDistributionDTO

CREATE OR REPLACE VIEW public.queue_status_distribution_view AS
SELECT 
    -- Count queues by status for all queues
    COUNT(CASE WHEN q.status = 'waiting' THEN 1 END) as waiting,
    COUNT(CASE WHEN q.status = 'serving' THEN 1 END) as serving,
    COUNT(CASE WHEN q.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN q.status = 'cancelled' THEN 1 END) as cancelled,
    -- Count no-show queues (queues that were never served and are past estimated call time)
    COUNT(CASE 
        WHEN q.status = 'waiting' 
        AND q.estimated_call_time IS NOT NULL 
        AND q.estimated_call_time < NOW() - INTERVAL '30 minutes'
        THEN 1 
    END) as no_show,
    -- Additional useful metrics
    COUNT(*) as total_queues,
    MAX(q.updated_at) as last_queue_update
FROM public.queues q;

CREATE OR REPLACE VIEW public.queue_status_distribution_today_view AS
SELECT 
    -- Count queues by status for today
    COUNT(CASE WHEN q.status = 'waiting' THEN 1 END) as waiting,
    COUNT(CASE WHEN q.status = 'serving' THEN 1 END) as serving,
    COUNT(CASE WHEN q.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN q.status = 'cancelled' THEN 1 END) as cancelled,
    -- Count no-show queues (queues that were never served and are past estimated call time)
    COUNT(CASE 
        WHEN q.status = 'waiting' 
        AND q.estimated_call_time IS NOT NULL 
        AND q.estimated_call_time < NOW() - INTERVAL '30 minutes'
        THEN 1 
    END) as no_show,
    -- Additional useful metrics
    COUNT(*) as total_queues_today,
    MAX(q.updated_at) as last_queue_update
FROM public.queues q
WHERE 
    -- Filter for today's queues
    q.created_at >= CURRENT_DATE 
    AND q.created_at < CURRENT_DATE + INTERVAL '1 day';

CREATE OR REPLACE VIEW public.queue_status_distribution_today_by_shop_view AS
SELECT 
    q.shop_id,
    s.name as shop_name,
    -- Count queues by status for today
    COUNT(CASE WHEN q.status = 'waiting' THEN 1 END) as waiting,
    COUNT(CASE WHEN q.status = 'serving' THEN 1 END) as serving,
    COUNT(CASE WHEN q.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN q.status = 'cancelled' THEN 1 END) as cancelled,
    -- Count no-show queues (queues that were never served and are past estimated call time)
    COUNT(CASE 
        WHEN q.status = 'waiting' 
        AND q.estimated_call_time IS NOT NULL 
        AND q.estimated_call_time < NOW() - INTERVAL '30 minutes'
        THEN 1 
    END) as no_show,
    -- Additional useful metrics
    COUNT(*) as total_queues_today,
    MAX(q.updated_at) as last_queue_update
FROM public.queues q
INNER JOIN public.shops s ON q.shop_id = s.id
WHERE 
    -- Filter for today's queues
    q.created_at >= CURRENT_DATE 
    AND q.created_at < CURRENT_DATE + INTERVAL '1 day'
GROUP BY q.shop_id, s.name
ORDER BY s.name;

-- Alternative view with time range flexibility
CREATE OR REPLACE VIEW public.queue_status_distribution_flexible_view AS
SELECT 
    q.shop_id,
    s.name as shop_name,
    DATE(q.created_at) as queue_date,
    -- Count queues by status
    COUNT(CASE WHEN q.status = 'waiting' THEN 1 END) as waiting,
    COUNT(CASE WHEN q.status = 'serving' THEN 1 END) as serving,
    COUNT(CASE WHEN q.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN q.status = 'cancelled' THEN 1 END) as cancelled,
    -- No-show calculation (more flexible logic)
    COUNT(CASE 
        WHEN q.status = 'waiting' 
        AND q.estimated_call_time IS NOT NULL 
        AND q.estimated_call_time < NOW() - INTERVAL '30 minutes'
        THEN 1 
        WHEN q.cancelled_reason = 'no_show'
        THEN 1
    END) as no_show,
    -- Additional metrics
    COUNT(*) as total_queues,
    AVG(EXTRACT(EPOCH FROM (COALESCE(q.completed_at, q.cancelled_at, NOW()) - q.created_at))/60)::INTEGER as avg_queue_time_minutes
FROM public.queues q
INNER JOIN public.shops s ON q.shop_id = s.id
GROUP BY q.shop_id, s.name, DATE(q.created_at)
ORDER BY s.name, queue_date DESC;

-- Function to get queue status distribution for specific shop and date range
CREATE OR REPLACE FUNCTION public.get_queue_status_distribution(
    p_shop_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE,
    p_end_date DATE DEFAULT CURRENT_DATE
) RETURNS TABLE(
    waiting BIGINT,
    serving BIGINT,
    completed BIGINT,
    cancelled BIGINT,
    no_show BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user has permission to view this shop's data
    IF NOT public.is_shop_employee(p_shop_id) THEN
        RAISE EXCEPTION 'insufficient_privilege: shop access required';
    END IF;

    RETURN QUERY
    SELECT 
        COUNT(CASE WHEN q.status = 'waiting' THEN 1 END) as waiting,
        COUNT(CASE WHEN q.status = 'serving' THEN 1 END) as serving,
        COUNT(CASE WHEN q.status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN q.status = 'cancelled' THEN 1 END) as cancelled,
        COUNT(CASE 
            WHEN q.status = 'waiting' 
            AND q.estimated_call_time IS NOT NULL 
            AND q.estimated_call_time < NOW() - INTERVAL '30 minutes'
            THEN 1 
            WHEN q.cancelled_reason = 'no_show'
            THEN 1
        END) as no_show
    FROM public.queues q
    WHERE q.shop_id = p_shop_id
    AND q.created_at >= p_start_date
    AND q.created_at < p_end_date + INTERVAL '1 day';
END;
$$;

-- Row Level Security for the views
-- Views inherit RLS from underlying tables, but we can add explicit policies if needed

-- Grant usage permissions
GRANT SELECT ON public.queue_status_distribution_view TO authenticated;
GRANT SELECT ON public.queue_status_distribution_flexible_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_queue_status_distribution(UUID, DATE, DATE) TO authenticated;


-- สร้าง View สำหรับ Popular Services
CREATE OR REPLACE VIEW popular_services_view AS
SELECT 
    s.id,
    s.name,
    COALESCE(queue_stats.queue_count, 0) AS queue_count,
    COALESCE(revenue_stats.revenue, 0) AS revenue,
    s.category
FROM 
    services s
LEFT JOIN (
    -- คำนวณจำนวนคิวของแต่ละ service
    SELECT 
        qs.service_id,
        COUNT(DISTINCT qs.queue_id) AS queue_count
    FROM 
        queue_services qs
    INNER JOIN 
        queues q ON qs.queue_id = q.id
    WHERE 
        q.status IN ('waiting', 'serving', 'completed') -- กรองเฉพาะสถานะที่นับได้
    GROUP BY 
        qs.service_id
) queue_stats ON s.id = queue_stats.service_id
LEFT JOIN (
    -- คำนวณรายได้ของแต่ละ service
    SELECT 
        qs.service_id,
        SUM(qs.price * qs.quantity) AS revenue
    FROM 
        queue_services qs
    INNER JOIN 
        queues q ON qs.queue_id = q.id
    WHERE 
        q.status = 'completed' -- นับเฉพาะคิวที่เสร็จสิ้นแล้ว
    GROUP BY 
        qs.service_id
) revenue_stats ON s.id = revenue_stats.service_id
WHERE 
    s.is_available = true -- แสดงเฉพาะ service ที่ยังใช้งานได้
ORDER BY 
    COALESCE(queue_stats.queue_count, 0) DESC, -- เรียงตามจำนวนคิว
    COALESCE(revenue_stats.revenue, 0) DESC;   -- แล้วตามรายได้

-- สร้าง View แบบ filtered สำหรับ Popular Services (Top 10)
CREATE OR REPLACE VIEW top_popular_services_view AS
SELECT * FROM popular_services_view
LIMIT 10;

-- สร้าง View สำหรับ Popular Services ตาม category
CREATE OR REPLACE VIEW popular_services_by_category_view AS
SELECT 
    s.id,
    s.name,
    COALESCE(queue_stats.queue_count, 0) AS queue_count,
    COALESCE(revenue_stats.revenue, 0) AS revenue,
    s.category,
    ROW_NUMBER() OVER (PARTITION BY s.category ORDER BY COALESCE(queue_stats.queue_count, 0) DESC) AS rank_in_category
FROM 
    services s
LEFT JOIN (
    SELECT 
        qs.service_id,
        COUNT(DISTINCT qs.queue_id) AS queue_count
    FROM 
        queue_services qs
    INNER JOIN 
        queues q ON qs.queue_id = q.id
    WHERE 
        q.status IN ('waiting', 'serving', 'completed')
    GROUP BY 
        qs.service_id
) queue_stats ON s.id = queue_stats.service_id
LEFT JOIN (
    SELECT 
        qs.service_id,
        SUM(qs.price * qs.quantity) AS revenue
    FROM 
        queue_services qs
    INNER JOIN 
        queues q ON qs.queue_id = q.id
    WHERE 
        q.status = 'completed'
    GROUP BY 
        qs.service_id
) revenue_stats ON s.id = revenue_stats.service_id
WHERE 
    s.is_available = true
ORDER BY 
    s.category, 
    rank_in_category;
