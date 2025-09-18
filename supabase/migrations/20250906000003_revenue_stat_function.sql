-- Create revenue statistics by shop view
CREATE OR REPLACE VIEW revenue_stats_by_shop_view AS
SELECT
    s.id AS shop_id,
    s.name AS shop_name,
    s.slug AS shop_slug,
    s.status AS shop_status,
    s.currency,
    
    -- Overall Revenue Statistics
    COALESCE(revenue_stats.total_revenue, 0) AS total_revenue,
    COALESCE(revenue_stats.total_paid_amount, 0) AS total_paid_amount,
    COALESCE(revenue_stats.total_pending_amount, 0) AS total_pending_amount,
    COALESCE(revenue_stats.total_partial_amount, 0) AS total_partial_amount,
    COALESCE(revenue_stats.total_payments, 0) AS total_payments,
    COALESCE(revenue_stats.paid_payments, 0) AS paid_payments,
    COALESCE(revenue_stats.pending_payments, 0) AS pending_payments,
    COALESCE(revenue_stats.partial_payments, 0) AS partial_payments,
    
    -- Daily Revenue Statistics
    COALESCE(daily_stats.revenue_today, 0) AS revenue_today,
    COALESCE(daily_stats.payments_today, 0) AS payments_today,
    COALESCE(daily_stats.revenue_yesterday, 0) AS revenue_yesterday,
    COALESCE(daily_stats.payments_yesterday, 0) AS payments_yesterday,
    
    -- Weekly Revenue Statistics
    COALESCE(weekly_stats.revenue_this_week, 0) AS revenue_this_week,
    COALESCE(weekly_stats.payments_this_week, 0) AS payments_this_week,
    COALESCE(weekly_stats.revenue_last_week, 0) AS revenue_last_week,
    COALESCE(weekly_stats.payments_last_week, 0) AS payments_last_week,
    
    -- Monthly Revenue Statistics
    COALESCE(monthly_stats.revenue_this_month, 0) AS revenue_this_month,
    COALESCE(monthly_stats.payments_this_month, 0) AS payments_this_month,
    COALESCE(monthly_stats.revenue_last_month, 0) AS revenue_last_month,
    COALESCE(monthly_stats.payments_last_month, 0) AS payments_last_month,
    
    -- Payment Method Statistics
    COALESCE(method_stats.cash_revenue, 0) AS cash_revenue,
    COALESCE(method_stats.card_revenue, 0) AS card_revenue,
    COALESCE(method_stats.qr_revenue, 0) AS qr_revenue,
    COALESCE(method_stats.transfer_revenue, 0) AS transfer_revenue,
    COALESCE(method_stats.cash_payments, 0) AS cash_payments,
    COALESCE(method_stats.card_payments, 0) AS card_payments,
    COALESCE(method_stats.qr_payments, 0) AS qr_payments,
    COALESCE(method_stats.transfer_payments, 0) AS transfer_payments,
    
    -- Average Statistics
    COALESCE(avg_stats.average_payment_amount, 0) AS average_payment_amount,
    COALESCE(avg_stats.average_daily_revenue, 0) AS average_daily_revenue,
    COALESCE(avg_stats.average_queue_value, 0) AS average_queue_value,
    
    -- Service Revenue Statistics
    COALESCE(service_stats.most_revenue_service_name, '') AS most_revenue_service_name,
    COALESCE(service_stats.most_revenue_service_amount, 0) AS most_revenue_service_amount,
    COALESCE(service_stats.total_service_revenue, 0) AS total_service_revenue,
    
    -- Growth Statistics (comparing to previous periods)
    CASE 
        WHEN COALESCE(daily_stats.revenue_yesterday, 0) > 0 
        THEN ROUND(((COALESCE(daily_stats.revenue_today, 0) - COALESCE(daily_stats.revenue_yesterday, 0)) * 100.0 / COALESCE(daily_stats.revenue_yesterday, 1)), 2)
        ELSE 0 
    END AS daily_growth_percentage,
    
    CASE 
        WHEN COALESCE(weekly_stats.revenue_last_week, 0) > 0 
        THEN ROUND(((COALESCE(weekly_stats.revenue_this_week, 0) - COALESCE(weekly_stats.revenue_last_week, 0)) * 100.0 / COALESCE(weekly_stats.revenue_last_week, 1)), 2)
        ELSE 0 
    END AS weekly_growth_percentage,
    
    CASE 
        WHEN COALESCE(monthly_stats.revenue_last_month, 0) > 0 
        THEN ROUND(((COALESCE(monthly_stats.revenue_this_month, 0) - COALESCE(monthly_stats.revenue_last_month, 0)) * 100.0 / COALESCE(monthly_stats.revenue_last_month, 1)), 2)
        ELSE 0 
    END AS monthly_growth_percentage,
    
    -- Timestamps
    NOW() AS stats_generated_at

FROM public.shops s

-- Overall revenue statistics
LEFT JOIN (
    SELECT 
        q.shop_id,
        SUM(p.total_amount) AS total_revenue,
        SUM(p.paid_amount) AS total_paid_amount,
        SUM(p.total_amount - p.paid_amount) FILTER (WHERE p.payment_status = 'unpaid') AS total_pending_amount,
        SUM(p.paid_amount) FILTER (WHERE p.payment_status = 'partial') AS total_partial_amount,
        COUNT(p.id) AS total_payments,
        COUNT(p.id) FILTER (WHERE p.payment_status = 'paid') AS paid_payments,
        COUNT(p.id) FILTER (WHERE p.payment_status = 'unpaid') AS pending_payments,
        COUNT(p.id) FILTER (WHERE p.payment_status = 'partial') AS partial_payments
    FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    GROUP BY q.shop_id
) revenue_stats ON s.id = revenue_stats.shop_id

-- Daily statistics
LEFT JOIN (
    SELECT 
        q.shop_id,
        SUM(p.paid_amount) FILTER (WHERE p.payment_date::date = CURRENT_DATE) AS revenue_today,
        COUNT(p.id) FILTER (WHERE p.payment_date::date = CURRENT_DATE AND p.payment_status = 'paid') AS payments_today,
        SUM(p.paid_amount) FILTER (WHERE p.payment_date::date = CURRENT_DATE - INTERVAL '1 day') AS revenue_yesterday,
        COUNT(p.id) FILTER (WHERE p.payment_date::date = CURRENT_DATE - INTERVAL '1 day' AND p.payment_status = 'paid') AS payments_yesterday
    FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    WHERE p.payment_status = 'paid'
    GROUP BY q.shop_id
) daily_stats ON s.id = daily_stats.shop_id

-- Weekly statistics
LEFT JOIN (
    SELECT 
        q.shop_id,
        SUM(p.paid_amount) FILTER (WHERE p.payment_date >= DATE_TRUNC('week', CURRENT_DATE)) AS revenue_this_week,
        COUNT(p.id) FILTER (WHERE p.payment_date >= DATE_TRUNC('week', CURRENT_DATE) AND p.payment_status = 'paid') AS payments_this_week,
        SUM(p.paid_amount) FILTER (WHERE p.payment_date >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' AND p.payment_date < DATE_TRUNC('week', CURRENT_DATE)) AS revenue_last_week,
        COUNT(p.id) FILTER (WHERE p.payment_date >= DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '1 week' AND p.payment_date < DATE_TRUNC('week', CURRENT_DATE) AND p.payment_status = 'paid') AS payments_last_week
    FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    WHERE p.payment_status = 'paid'
    GROUP BY q.shop_id
) weekly_stats ON s.id = weekly_stats.shop_id

-- Monthly statistics
LEFT JOIN (
    SELECT 
        q.shop_id,
        SUM(p.paid_amount) FILTER (WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE)) AS revenue_this_month,
        COUNT(p.id) FILTER (WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE) AND p.payment_status = 'paid') AS payments_this_month,
        SUM(p.paid_amount) FILTER (WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND p.payment_date < DATE_TRUNC('month', CURRENT_DATE)) AS revenue_last_month,
        COUNT(p.id) FILTER (WHERE p.payment_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' AND p.payment_date < DATE_TRUNC('month', CURRENT_DATE) AND p.payment_status = 'paid') AS payments_last_month
    FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    WHERE p.payment_status = 'paid'
    GROUP BY q.shop_id
) monthly_stats ON s.id = monthly_stats.shop_id

-- Payment method statistics
LEFT JOIN (
    SELECT 
        q.shop_id,
        SUM(p.paid_amount) FILTER (WHERE p.payment_method = 'cash') AS cash_revenue,
        SUM(p.paid_amount) FILTER (WHERE p.payment_method = 'card') AS card_revenue,
        SUM(p.paid_amount) FILTER (WHERE p.payment_method = 'qr') AS qr_revenue,
        SUM(p.paid_amount) FILTER (WHERE p.payment_method = 'transfer') AS transfer_revenue,
        COUNT(p.id) FILTER (WHERE p.payment_method = 'cash' AND p.payment_status = 'paid') AS cash_payments,
        COUNT(p.id) FILTER (WHERE p.payment_method = 'card' AND p.payment_status = 'paid') AS card_payments,
        COUNT(p.id) FILTER (WHERE p.payment_method = 'qr' AND p.payment_status = 'paid') AS qr_payments,
        COUNT(p.id) FILTER (WHERE p.payment_method = 'transfer' AND p.payment_status = 'paid') AS transfer_payments
    FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    WHERE p.payment_status = 'paid'
    GROUP BY q.shop_id
) method_stats ON s.id = method_stats.shop_id

-- Average statistics
LEFT JOIN (
    SELECT 
        q.shop_id,
        AVG(p.paid_amount) FILTER (WHERE p.payment_status = 'paid') AS average_payment_amount,
        AVG(daily_revenue) AS average_daily_revenue,
        AVG(queue_total) AS average_queue_value
    FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    LEFT JOIN (
        SELECT 
            q2.shop_id,
            p2.payment_date::date,
            SUM(p2.paid_amount) AS daily_revenue
        FROM public.payments p2
        JOIN public.queues q2 ON q2.id = p2.queue_id
        WHERE p2.payment_status = 'paid'
        GROUP BY q2.shop_id, p2.payment_date::date
    ) daily_rev ON daily_rev.shop_id = q.shop_id
    LEFT JOIN (
        SELECT 
            queue_id,
            SUM(price * quantity) AS queue_total
        FROM public.queue_services
        GROUP BY queue_id
    ) qs ON qs.queue_id = q.id
    WHERE p.payment_status = 'paid'
    GROUP BY q.shop_id
) avg_stats ON s.id = avg_stats.shop_id

-- Service revenue statistics
LEFT JOIN (
    SELECT 
        q.shop_id,
        srv_rev.service_name AS most_revenue_service_name,
        srv_rev.service_revenue AS most_revenue_service_amount,
        SUM(srv_rev.service_revenue) AS total_service_revenue
    FROM public.queues q
    JOIN (
        SELECT 
            qs.queue_id,
            s.name AS service_name,
            SUM(qs.price * qs.quantity) AS service_revenue,
            ROW_NUMBER() OVER (PARTITION BY q2.shop_id ORDER BY SUM(qs.price * qs.quantity) DESC) as rn
        FROM public.queue_services qs
        JOIN public.services s ON s.id = qs.service_id
        JOIN public.queues q2 ON q2.id = qs.queue_id
        JOIN public.payments p ON p.queue_id = q2.id AND p.payment_status = 'paid'
        GROUP BY qs.queue_id, s.name, q2.shop_id
    ) srv_rev ON srv_rev.queue_id = q.id AND srv_rev.rn = 1
    GROUP BY q.shop_id, srv_rev.service_name, srv_rev.service_revenue
) service_stats ON s.id = service_stats.shop_id

-- Only include active and draft shops
WHERE s.status IN ('active', 'draft')

ORDER BY s.name;