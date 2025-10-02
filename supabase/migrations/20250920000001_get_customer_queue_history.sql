-- Create RPC function to get customer queue history with pagination and filters
-- This function bypasses RLS and returns proper pagination result structure
CREATE OR REPLACE FUNCTION get_customer_queue_history_by_customer(
    p_customer_id UUID,
    p_shop_id UUID,
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10,
    p_status TEXT DEFAULT 'all',
    p_date_range TEXT DEFAULT 'all',
    p_start_date TEXT DEFAULT NULL,
    p_end_date TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
    v_total_count BIGINT;
    v_offset INTEGER;
    v_total_pages INTEGER;
    v_has_next BOOLEAN;
    v_has_prev BOOLEAN;
    v_result_data JSONB;
BEGIN
    -- Validate required parameters
    IF p_customer_id IS NULL THEN
        RAISE EXCEPTION 'Customer ID is required';
    END IF;
    
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'Shop ID is required';
    END IF;
    
    -- Calculate date range filter
    IF p_date_range = 'month' THEN
        v_start_date := DATE_TRUNC('month', CURRENT_DATE);
        v_end_date := CURRENT_DATE;
    ELSIF p_date_range = 'quarter' THEN
        v_start_date := DATE_TRUNC('quarter', CURRENT_DATE);
        v_end_date := DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months' - INTERVAL '1 day';
    ELSIF p_date_range = 'year' THEN
        v_start_date := DATE_TRUNC('year', CURRENT_DATE);
        v_end_date := CURRENT_DATE;
    ELSIF p_start_date IS NOT NULL THEN
        v_start_date := p_start_date::DATE;
        v_end_date := COALESCE(p_end_date::DATE, CURRENT_DATE);
    ELSE
        v_start_date := NULL;
        v_end_date := NULL;
    END IF;
    
    -- Validate pagination parameters
    IF p_page < 1 THEN
        p_page := 1;
    END IF;
    
    IF p_limit < 1 OR p_limit > 100 THEN
        p_limit := 10; -- Default to 10 if invalid
    END IF;
    
    -- Calculate offset for pagination
    v_offset := (p_page - 1) * p_limit;
    
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
    
    -- Get total count first
    SELECT COUNT(*) INTO v_total_count
    FROM queues q
    LEFT JOIN shops s ON q.shop_id = s.id
    WHERE q.customer_id = p_customer_id
    AND q.shop_id = p_shop_id
    AND (p_status = 'all' OR q.status::TEXT = p_status)
    AND (v_start_date IS NULL OR q.created_at::DATE >= v_start_date)
    AND (v_end_date IS NULL OR q.created_at::DATE <= v_end_date);
    
    -- Calculate pagination metadata
    v_total_pages := CEIL(v_total_count::FLOAT / p_limit::FLOAT);
    v_has_next := p_page < v_total_pages;
    v_has_prev := p_page > 1;
    
    -- Build the data array with proper joins using subquery for pagination
    WITH paginated_queues AS (
        SELECT q.id, q.shop_id, q.queue_number, q.status, q.priority, 
               q.estimated_duration, q.estimated_call_time, q.actual_wait_time,
               q.served_at, q.completed_at, q.cancelled_at, q.cancelled_reason,
               q.feedback, q.rating, q.created_at, q.updated_at
        FROM queues q
        WHERE q.customer_id = p_customer_id
        AND q.shop_id = p_shop_id
        AND (p_status = 'all' OR q.status::TEXT = p_status)
        AND (v_start_date IS NULL OR q.created_at::DATE >= v_start_date)
        AND (v_end_date IS NULL OR q.created_at::DATE <= v_end_date)
        ORDER BY q.created_at DESC
        LIMIT p_limit OFFSET v_offset
    )
    SELECT COALESCE(JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'id', pq.id,
            'shop_id', pq.shop_id,
            'shop_name', s.name,
            'queue_number', pq.queue_number,
            'status', pq.status::TEXT,
            'priority', pq.priority::TEXT,
            'customer_name', c.name,
            'services', (
                SELECT COALESCE(JSONB_AGG(
                    JSONB_BUILD_OBJECT(
                        'id', svc.id,
                        'name', svc.name,
                        'price', qs.price,
                        'quantity', qs.quantity
                    )
                ), '[]'::JSONB)
                FROM queue_services qs
                JOIN services svc ON qs.service_id = svc.id
                WHERE qs.queue_id = pq.id
            ),
            'estimated_duration', pq.estimated_duration,
            'estimated_call_time', pq.estimated_call_time,
            'actual_wait_time', pq.actual_wait_time,
            'served_at', pq.served_at,
            'completed_at', pq.completed_at,
            'cancelled_at', pq.cancelled_at,
            'cancelled_reason', pq.cancelled_reason,
            'feedback', pq.feedback,
            'rating', pq.rating,
            'created_at', pq.created_at,
            'updated_at', pq.updated_at,
            'queue_date', pq.created_at::DATE
        ) ORDER BY pq.created_at DESC
    ), '[]'::JSONB) INTO v_result_data
    FROM paginated_queues pq
    LEFT JOIN shops s ON pq.shop_id = s.id
    LEFT JOIN customers c ON c.id = p_customer_id;
    
    -- Return the paginated result structure as JSONB
    RETURN JSONB_BUILD_OBJECT(
        'data', v_result_data,
        'pagination', JSONB_BUILD_OBJECT(
            'currentPage', p_page,
            'perPage', p_limit,
            'totalItems', v_total_count,
            'totalPages', v_total_pages,
            'hasNext', v_has_next,
            'hasPrev', v_has_prev
        )
    );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_customer_queue_history_by_customer TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_queue_history_by_customer TO service_role;
