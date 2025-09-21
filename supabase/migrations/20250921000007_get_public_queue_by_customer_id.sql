-- =============================================================================
-- Function to get public queue information by customer ID with pagination and status filter (for customers)
-- Returns queue details with customer info and services
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_public_queue_info_by_customer_id(
    p_customer_id UUID,
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10,
    p_status queue_status DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    shop_id UUID,
    queue_number TEXT,
    status queue_status,
    priority queue_priority,
    estimated_duration INTEGER,
    estimated_call_time TIMESTAMP WITH TIME ZONE,
    served_by_employee_id UUID,
    actual_wait_time INTEGER,
    note TEXT,
    feedback TEXT,
    rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    served_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_reason TEXT,
    cancelled_note TEXT,
    customer_name TEXT,
    services JSONB,
    total_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_offset INTEGER;
BEGIN
    -- Validate parameters
    IF p_page IS NULL OR p_page < 1 THEN
        p_page := 1;
    END IF;
    
    IF p_limit IS NULL OR p_limit < 1 OR p_limit > 100 THEN
        p_limit := 10;
    END IF;
    
    -- Calculate offset for pagination
    v_offset := (p_page - 1) * p_limit;
    
    -- Validate customer exists
    IF NOT EXISTS (
        SELECT 1 FROM public.customers 
        WHERE id = p_customer_id
    ) THEN
        RAISE EXCEPTION 'customer_not_found: Customer with ID % not found', p_customer_id;
    END IF;
    
    -- Return query with queue info, customer details, and services with pagination
    RETURN QUERY
    WITH queue_data AS (
        SELECT 
            q.id,
            q.shop_id,
            q.queue_number,
            q.status,
            q.priority,
            q.estimated_duration,
            q.estimated_call_time,
            q.served_by_employee_id,
            q.actual_wait_time,
            q.note,
            q.feedback,
            q.rating,
            q.created_at,
            q.updated_at,
            q.served_at,
            q.completed_at,
            q.cancelled_at,
            q.cancelled_reason,
            q.cancelled_note,
            c.name as customer_name,
            COALESCE(
                JSONB_AGG(
                    JSONB_BUILD_OBJECT(
                        'service_id', qs.service_id,
                        'service_name', s.name,
                        'quantity', qs.quantity,
                        'price', qs.price
                    )
                ) FILTER (WHERE qs.service_id IS NOT NULL),
                '[]'::JSONB
            ) as services,
            COUNT(*) OVER () as total_count
        FROM public.queues q
        LEFT JOIN public.customers c ON q.customer_id = c.id
        LEFT JOIN public.queue_services qs ON q.id = qs.queue_id
        LEFT JOIN public.services s ON qs.service_id = s.id
        WHERE q.customer_id = p_customer_id
        AND (p_status IS NULL OR q.status = p_status)
        GROUP BY q.id, c.name
        ORDER BY q.created_at DESC
        LIMIT p_limit
        OFFSET v_offset
    )
    SELECT 
        id,
        shop_id,
        queue_number,
        status,
        priority,
        estimated_duration,
        estimated_call_time,
        served_by_employee_id,
        actual_wait_time,
        note,
        feedback,
        rating,
        created_at,
        updated_at,
        served_at,
        completed_at,
        cancelled_at,
        cancelled_reason,
        cancelled_note,
        customer_name,
        services,
        COALESCE(total_count, 0) as total_count
    FROM queue_data;
END;
$$;

-- Grant execute permissions to authenticated and public roles
GRANT EXECUTE ON FUNCTION public.get_public_queue_info_by_customer_id(UUID, INTEGER, INTEGER, queue_status) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_queue_info_by_customer_id(UUID, INTEGER, INTEGER, queue_status) TO anon;
