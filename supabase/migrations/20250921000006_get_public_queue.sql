-- =============================================================================
-- Function to get public queue information by ID (for customers)
-- Returns queue details with customer info and services
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_public_queue_info_by_id(
    p_queue_id UUID
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
    services JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate queue exists
    IF NOT EXISTS (
        SELECT 1 FROM public.queues 
        WHERE id = p_queue_id
    ) THEN
        RAISE EXCEPTION 'queue_not_found: Queue with ID % not found', p_queue_id;
    END IF;
    
    -- Return query with queue info, customer details, and services
    RETURN QUERY
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
        ) as services
    FROM public.queues q
    LEFT JOIN public.customers c ON q.customer_id = c.id
    LEFT JOIN public.queue_services qs ON q.id = qs.queue_id
    LEFT JOIN public.services s ON qs.service_id = s.id
    WHERE q.id = p_queue_id
    GROUP BY q.id, c.name;
END;
$$;

-- Grant execute permissions to authenticated and public roles
GRANT EXECUTE ON FUNCTION public.get_public_queue_info_by_id(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_queue_info_by_id(UUID) TO anon;