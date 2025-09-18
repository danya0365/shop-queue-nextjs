-- Create overall dashboard stats summary view (single row)
CREATE OR REPLACE VIEW dashboard_stats_summary_view AS
SELECT
    -- Shop statistics
    (SELECT COUNT(*) FROM public.shops) AS total_shops,
    (SELECT COUNT(*) FROM public.shops WHERE status = 'active') AS active_shops,
    (SELECT COUNT(*) FROM public.shops WHERE status = 'draft') AS draft_shops,
    (SELECT COUNT(*) FROM public.shops WHERE status = 'inactive') AS inactive_shops,
    
    -- Queue statistics
    (SELECT COUNT(*) FROM public.queues) AS total_queues,
    (SELECT COUNT(*) FROM public.queues WHERE status IN ('waiting','confirmed','serving')) AS active_queues,
    (SELECT COUNT(*) FROM public.queues WHERE status = 'waiting') AS waiting_queues,
    (SELECT COUNT(*) FROM public.queues WHERE status = 'confirmed') AS confirmed_queues,
    (SELECT COUNT(*) FROM public.queues WHERE status = 'serving') AS serving_queues,
    (SELECT COUNT(*) FROM public.queues WHERE status = 'completed') AS completed_queues,
    (SELECT COUNT(*) FROM public.queues WHERE status = 'cancelled') AS cancelled_queues,
    (SELECT COUNT(*) FROM public.queues 
     WHERE status = 'completed' AND completed_at::date = CURRENT_DATE) AS completed_queues_today,
    (SELECT COUNT(*) FROM public.queues 
     WHERE created_at::date = CURRENT_DATE) AS queues_created_today,
    
    -- Customer statistics
    (SELECT COUNT(*) FROM public.customers) AS total_customers,
    (SELECT COUNT(*) FROM public.customers WHERE is_active = true) AS active_customers,
    (SELECT COUNT(*) FROM public.customers WHERE last_visit::date = CURRENT_DATE) AS customers_visited_today,
    (SELECT COUNT(*) FROM public.customers WHERE created_at::date = CURRENT_DATE) AS new_customers_today,
    
    -- Employee statistics
    (SELECT COUNT(*) FROM public.employees) AS total_employees,
    (SELECT COUNT(*) FROM public.employees WHERE status = 'active') AS active_employees,
    (SELECT COUNT(*) FROM public.employees WHERE is_on_duty = true) AS employees_on_duty,
    (SELECT COUNT(*) FROM public.employees WHERE status = 'inactive') AS inactive_employees,
    
    -- Service statistics
    (SELECT COUNT(*) FROM public.services) AS total_services,
    (SELECT COUNT(*) FROM public.services WHERE is_available = true) AS available_services,
    (SELECT COUNT(*) FROM public.services WHERE is_available = false) AS unavailable_services,
    
    -- Financial statistics
    COALESCE((SELECT SUM(p.total_amount) 
              FROM public.payments p 
              WHERE p.payment_status = 'paid'), 0) AS total_revenue,
    COALESCE((SELECT SUM(p.total_amount) 
              FROM public.payments p 
              WHERE p.payment_status = 'paid' 
                AND p.payment_date::date = CURRENT_DATE), 0) AS revenue_today,
    (SELECT COUNT(*) FROM public.payments WHERE payment_status = 'paid') AS paid_payments,
    (SELECT COUNT(*) FROM public.payments WHERE payment_status = 'unpaid') AS unpaid_payments,
    (SELECT COUNT(*) FROM public.payments WHERE payment_status = 'partial') AS partial_payments,
    
    -- Performance statistics
    COALESCE((
        SELECT AVG(EXTRACT(EPOCH FROM (q.completed_at - q.created_at)) / 60.0)
        FROM public.queues q
        WHERE q.status = 'completed'
          AND q.completed_at IS NOT NULL
    ), 0) AS average_wait_time_minutes,
    COALESCE((
        SELECT AVG(EXTRACT(EPOCH FROM (q.completed_at - q.served_at)) / 60.0)
        FROM public.queues q
        WHERE q.status = 'completed'
          AND q.completed_at IS NOT NULL
          AND q.served_at IS NOT NULL
    ), 0) AS average_service_time_minutes,
    COALESCE((
        SELECT AVG(q.rating)
        FROM public.queues q
        WHERE q.rating IS NOT NULL
    ), 0) AS average_rating,
    (SELECT COUNT(*) FROM public.queues WHERE rating IS NOT NULL) AS total_reviews,
    
    -- Points and rewards statistics
    COALESCE((SELECT SUM(cp.total_earned) FROM public.customer_points cp), 0) AS total_points_earned,
    COALESCE((SELECT SUM(cp.total_redeemed) FROM public.customer_points cp), 0) AS total_points_redeemed,
    COALESCE((SELECT SUM(cp.current_points) FROM public.customer_points cp), 0) AS current_points_balance,
    (SELECT COUNT(*) FROM public.rewards WHERE is_available = true) AS active_rewards,
    (SELECT COUNT(*) FROM public.reward_usages WHERE status = 'active') AS active_reward_usages,
    (SELECT COUNT(*) FROM public.reward_usages 
     WHERE issued_at::date = CURRENT_DATE) AS reward_usages_today,
    
    -- Promotion statistics
    (SELECT COUNT(*) FROM public.promotions 
     WHERE status = 'active' AND start_at <= NOW() AND end_at >= NOW()) AS active_promotions,
    (SELECT COUNT(*) FROM public.promotions WHERE status = 'active') AS total_active_promotions,
    (SELECT COUNT(*) FROM public.promotion_usage_logs 
     WHERE used_at::date = CURRENT_DATE) AS promotions_used_today,
    COALESCE((SELECT COUNT(*) FROM public.promotion_usage_logs), 0) AS total_promotion_usage,
    
    -- Department statistics
    (SELECT COUNT(*) FROM public.departments) AS total_departments,
    
    -- Category statistics
    (SELECT COUNT(*) FROM public.categories WHERE is_active = true) AS active_categories,
    (SELECT COUNT(*) FROM public.categories) AS total_categories,
    
    -- Membership tier statistics
    (SELECT COUNT(*) FROM public.customer_points WHERE membership_tier = 'bronze') AS bronze_members,
    (SELECT COUNT(*) FROM public.customer_points WHERE membership_tier = 'silver') AS silver_members,
    (SELECT COUNT(*) FROM public.customer_points WHERE membership_tier = 'gold') AS gold_members,
    (SELECT COUNT(*) FROM public.customer_points WHERE membership_tier = 'platinum') AS platinum_members,
    
    -- System statistics
    NOW() AS stats_generated_at,
    CURRENT_DATE AS stats_date;

-- Create dashboard stats view grouped by shop
CREATE OR REPLACE VIEW dashboard_stats_by_shop_view AS
SELECT
    s.id AS shop_id,
    s.name AS shop_name,
    s.slug AS shop_slug,
    s.status AS shop_status,
    
    -- Queue statistics
    COALESCE(queue_stats.total_queues, 0) AS total_queues,
    COALESCE(queue_stats.active_queues, 0) AS active_queues,
    COALESCE(queue_stats.completed_queues_today, 0) AS completed_queues_today,
    COALESCE(queue_stats.waiting_queues, 0) AS waiting_queues,
    COALESCE(queue_stats.serving_queues, 0) AS serving_queues,
    
    -- Customer statistics
    COALESCE(customer_stats.total_customers, 0) AS total_customers,
    COALESCE(customer_stats.active_customers, 0) AS active_customers,
    COALESCE(customer_stats.customers_visited_today, 0) AS customers_visited_today,
    
    -- Employee statistics
    COALESCE(employee_stats.total_employees, 0) AS total_employees,
    COALESCE(employee_stats.active_employees, 0) AS active_employees,
    COALESCE(employee_stats.employees_on_duty, 0) AS employees_on_duty,
    
    -- Service statistics
    COALESCE(service_stats.total_services, 0) AS total_services,
    COALESCE(service_stats.available_services, 0) AS available_services,
    
    -- Financial statistics
    COALESCE(payment_stats.total_revenue, 0) AS total_revenue,
    COALESCE(payment_stats.revenue_today, 0) AS revenue_today,
    COALESCE(payment_stats.paid_payments, 0) AS paid_payments,
    COALESCE(payment_stats.pending_payments, 0) AS pending_payments,
    
    -- Performance statistics
    COALESCE(performance_stats.average_wait_time_minutes, 0) AS average_wait_time_minutes,
    COALESCE(performance_stats.average_service_time_minutes, 0) AS average_service_time_minutes,
    COALESCE(performance_stats.average_rating, 0) AS average_rating,
    COALESCE(performance_stats.total_reviews, 0) AS total_reviews,
    
    -- Points and rewards statistics
    COALESCE(points_stats.total_points_earned, 0) AS total_points_earned,
    COALESCE(points_stats.total_points_redeemed, 0) AS total_points_redeemed,
    COALESCE(points_stats.active_rewards, 0) AS active_rewards,
    COALESCE(points_stats.reward_usages_today, 0) AS reward_usages_today,
    
    -- Promotion statistics
    COALESCE(promo_stats.active_promotions, 0) AS active_promotions,
    COALESCE(promo_stats.promotions_used_today, 0) AS promotions_used_today,
    
    -- Timestamps
    NOW() AS stats_generated_at

FROM public.shops s

-- Queue statistics subquery
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_queues,
        COUNT(*) FILTER (WHERE status IN ('waiting','confirmed','serving')) AS active_queues,
        COUNT(*) FILTER (WHERE status = 'completed' AND completed_at::date = CURRENT_DATE) AS completed_queues_today,
        COUNT(*) FILTER (WHERE status = 'waiting') AS waiting_queues,
        COUNT(*) FILTER (WHERE status = 'serving') AS serving_queues
    FROM public.queues
    GROUP BY shop_id
) queue_stats ON s.id = queue_stats.shop_id

-- Customer statistics subquery
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_customers,
        COUNT(*) FILTER (WHERE is_active = true) AS active_customers,
        COUNT(*) FILTER (WHERE last_visit::date = CURRENT_DATE) AS customers_visited_today
    FROM public.customers
    GROUP BY shop_id
) customer_stats ON s.id = customer_stats.shop_id

-- Employee statistics subquery
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_employees,
        COUNT(*) FILTER (WHERE status = 'active') AS active_employees,
        COUNT(*) FILTER (WHERE is_on_duty = true) AS employees_on_duty
    FROM public.employees
    GROUP BY shop_id
) employee_stats ON s.id = employee_stats.shop_id

-- Service statistics subquery
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_services,
        COUNT(*) FILTER (WHERE is_available = true) AS available_services
    FROM public.services
    GROUP BY shop_id
) service_stats ON s.id = service_stats.shop_id

-- Payment statistics subquery
LEFT JOIN (
    SELECT 
        q.shop_id,
        SUM(p.total_amount) FILTER (WHERE p.payment_status = 'paid') AS total_revenue,
        SUM(p.total_amount) FILTER (WHERE p.payment_status = 'paid' AND p.payment_date::date = CURRENT_DATE) AS revenue_today,
        COUNT(*) FILTER (WHERE p.payment_status = 'paid') AS paid_payments,
        COUNT(*) FILTER (WHERE p.payment_status IN ('unpaid', 'partial')) AS pending_payments
    FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    GROUP BY q.shop_id
) payment_stats ON s.id = payment_stats.shop_id

-- Performance statistics subquery
LEFT JOIN (
    SELECT 
        shop_id,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60.0) AS average_wait_time_minutes,
        AVG(EXTRACT(EPOCH FROM (completed_at - served_at)) / 60.0) FILTER (WHERE served_at IS NOT NULL) AS average_service_time_minutes,
        AVG(rating) FILTER (WHERE rating IS NOT NULL) AS average_rating,
        COUNT(*) FILTER (WHERE rating IS NOT NULL) AS total_reviews
    FROM public.queues
    WHERE status = 'completed' AND completed_at IS NOT NULL
    GROUP BY shop_id
) performance_stats ON s.id = performance_stats.shop_id

-- Points and rewards statistics subquery
LEFT JOIN (
    SELECT 
        cp.shop_id,
        SUM(cp.total_earned) AS total_points_earned,
        SUM(cp.total_redeemed) AS total_points_redeemed,
        COUNT(r.id) FILTER (WHERE r.is_available = true) AS active_rewards,
        COUNT(ru.id) FILTER (WHERE ru.issued_at::date = CURRENT_DATE) AS reward_usages_today
    FROM public.customer_points cp
    LEFT JOIN public.rewards r ON r.shop_id = cp.shop_id
    LEFT JOIN public.reward_usages ru ON ru.shop_id = cp.shop_id
    GROUP BY cp.shop_id
) points_stats ON s.id = points_stats.shop_id

-- Promotion statistics subquery
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) FILTER (WHERE status = 'active' AND start_at <= NOW() AND end_at >= NOW()) AS active_promotions,
        COUNT(pul.id) FILTER (WHERE pul.used_at::date = CURRENT_DATE) AS promotions_used_today
    FROM public.promotions p
    LEFT JOIN public.promotion_usage_logs pul ON pul.promotion_id = p.id
    GROUP BY shop_id
) promo_stats ON s.id = promo_stats.shop_id

-- Only include active shops
WHERE s.status IN ('active', 'draft')

ORDER BY s.name;


-- View for Queue Status Distribution Dashboard
-- Maps to QueueStatusDistributionDTO

CREATE OR REPLACE VIEW public.queue_status_distribution_view AS
SELECT 
    -- Count queues by status for all queues
    COUNT(CASE WHEN q.status = 'waiting' THEN 1 END) as waiting,
    COUNT(CASE WHEN q.status = 'confirmed' THEN 1 END) as confirmed,
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
    COUNT(CASE WHEN q.status = 'confirmed' THEN 1 END) as confirmed,
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
    COUNT(CASE WHEN q.status = 'confirmed' THEN 1 END) as confirmed,
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
    COUNT(CASE WHEN q.status = 'confirmed' THEN 1 END) as confirmed,
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
    confirmed BIGINT,
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
        COUNT(CASE WHEN q.status = 'confirmed' THEN 1 END) as confirmed,
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
