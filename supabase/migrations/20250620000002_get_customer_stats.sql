-- Create RPC function to get customer statistics
-- This function bypasses RLS and returns customer statistics
CREATE OR REPLACE FUNCTION get_customer_stats_by_customer(
    p_customer_id UUID,
    p_shop_id UUID
)
RETURNS TABLE (
    customer_id UUID,
    shop_id UUID,
    total_queues INTEGER,
    completed_queues INTEGER,
    cancelled_queues INTEGER,
    no_show_queues INTEGER,
    average_wait_time_minutes NUMERIC,
    average_service_time_minutes NUMERIC,
    average_rating NUMERIC,
    total_spent NUMERIC,
    member_since DATE,
    last_visit_date DATE,
    favorite_service_id UUID,
    favorite_service_name TEXT,
    most_visited_shop_id UUID,
    most_visited_shop_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate required parameters
    IF p_customer_id IS NULL THEN
        RAISE EXCEPTION 'Customer ID is required';
    END IF;
    
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'Shop ID is required';
    END IF;
    
    -- Security check: Only return data if:
    -- 1. Customer is not linked to any profile (unauthenticated), OR
    -- 2. Customer is linked to the currently authenticated user's profile
    IF NOT EXISTS (
        SELECT 1 FROM customers c 
        WHERE c.id = p_customer_id 
        AND c.shop_id = p_shop_id
        AND (
            c.profile_id IS NULL -- Unauthenticated customer
            OR 
            c.profile_id = public.get_active_profile_id() -- Authenticated user's own customer
        )
    ) THEN
        RAISE EXCEPTION 'Access denied: Customer not found or access restricted';
    END IF;
    
    RETURN QUERY
    WITH customer_stats AS (
        SELECT 
            c.id as customer_id,
            c.shop_id,
            COUNT(q.id) as total_queues,
            COUNT(CASE WHEN q.status = 'completed' THEN 1 END) as completed_queues,
            COUNT(CASE WHEN q.status = 'cancelled' THEN 1 END) as cancelled_queues,
            COUNT(CASE WHEN q.status = 'no_show' THEN 1 END) as no_show_queues,
            ROUND(AVG(CASE WHEN q.actual_wait_time IS NOT NULL THEN q.actual_wait_time ELSE NULL END), 2) as average_wait_time_minutes,
            ROUND(AVG(CASE WHEN q.completed_at IS NOT NULL AND q.served_at IS NOT NULL 
                THEN EXTRACT(EPOCH FROM (q.completed_at - q.served_at))/60 ELSE NULL END), 2) as average_service_time_minutes,
            ROUND(AVG(CASE WHEN q.rating IS NOT NULL THEN q.rating ELSE NULL END), 2) as average_rating,
            COALESCE(SUM(p.amount), 0) as total_spent,
            MIN(c.created_at)::DATE as member_since,
            MAX(CASE WHEN q.status = 'completed' THEN q.completed_at ELSE NULL END)::DATE as last_visit_date
        FROM customers c
        LEFT JOIN queues q ON c.id = q.customer_id AND q.shop_id = c.shop_id
        LEFT JOIN payments p ON q.id = p.queue_id AND p.status = 'completed'
        WHERE c.id = p_customer_id
        AND c.shop_id = p_shop_id
        GROUP BY c.id, c.shop_id
    ),
    favorite_service AS (
        SELECT 
            qs.service_id,
            s.name as service_name,
            COUNT(*) as usage_count
        FROM queues q
        JOIN LATERAL jsonb_array_elements(q.services) AS qs(service_id, service_name, price, duration) ON true
        LEFT JOIN services s ON qs.service_id::UUID = s.id
        WHERE q.customer_id = p_customer_id
        AND q.shop_id = p_shop_id
        AND q.status = 'completed'
        GROUP BY qs.service_id, s.name
        ORDER BY usage_count DESC
        LIMIT 1
    )
    SELECT 
        cs.customer_id,
        cs.shop_id,
        COALESCE(cs.total_queues, 0) as total_queues,
        COALESCE(cs.completed_queues, 0) as completed_queues,
        COALESCE(cs.cancelled_queues, 0) as cancelled_queues,
        COALESCE(cs.no_show_queues, 0) as no_show_queues,
        COALESCE(cs.average_wait_time_minutes, 0) as average_wait_time_minutes,
        COALESCE(cs.average_service_time_minutes, 0) as average_service_time_minutes,
        COALESCE(cs.average_rating, 0) as average_rating,
        COALESCE(cs.total_spent, 0) as total_spent,
        cs.member_since,
        cs.last_visit_date,
        fs.service_id as favorite_service_id,
        fs.service_name as favorite_service_name,
        cs.shop_id as most_visited_shop_id,
        (SELECT name FROM shops WHERE id = cs.shop_id) as most_visited_shop_name
    FROM customer_stats cs
    LEFT JOIN favorite_service fs ON true;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_customer_stats_by_customer TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_stats_by_customer TO service_role;
