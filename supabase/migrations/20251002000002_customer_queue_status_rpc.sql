-- =============================================================================
-- Customer Queue Status RPC Functions
-- Functions to support customer-side queue status operations with RLS bypass
-- =============================================================================

-- =============================================================================
-- Function: get_customer_queue_by_number
-- Description: Get queue information by queue number with security checks
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_customer_queue_by_number(
    p_shop_id UUID,
    p_queue_number TEXT
)
RETURNS TABLE (
    id UUID,
    shop_id UUID,
    customer_id UUID,
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
    customer_phone TEXT,
    services JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Validate required parameters
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'Shop ID is required';
    END IF;
    
    IF p_queue_number IS NULL OR p_queue_number = '' THEN
        RAISE EXCEPTION 'Queue number is required';
    END IF;
    
    -- Return query with queue info, customer details, and services
    -- Only return queues that are in active statuses (waiting, confirmed, serving)
    RETURN QUERY
    SELECT 
        q.id,
        q.shop_id,
        q.customer_id,
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
        c.phone as customer_phone,
        COALESCE(
            JSONB_AGG(
                JSONB_BUILD_OBJECT(
                    'id', qs.id,
                    'queue_id', qs.queue_id,
                    'service_id', qs.service_id,
                    'service_name', s.name,
                    'quantity', qs.quantity,
                    'price', qs.price,
                    'created_at', qs.created_at
                )
            ) FILTER (WHERE qs.service_id IS NOT NULL),
            '[]'::JSONB
        ) as services
    FROM public.queues q
    LEFT JOIN public.customers c ON q.customer_id = c.id
    LEFT JOIN public.queue_services qs ON q.id = qs.queue_id
    LEFT JOIN public.services s ON qs.service_id = s.id
    WHERE q.shop_id = p_shop_id
    AND q.queue_number = p_queue_number
    AND q.status IN ('waiting', 'confirmed', 'serving')
    GROUP BY q.id, q.shop_id, q.customer_id, q.queue_number, q.status, q.priority,
             q.estimated_duration, q.estimated_call_time, q.served_by_employee_id, q.actual_wait_time, 
             q.note, q.feedback, q.rating, q.created_at, q.updated_at, q.served_at, q.completed_at, 
             q.cancelled_at, q.cancelled_reason, q.cancelled_note, c.name, c.phone;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_customer_queue_by_number(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_customer_queue_by_number(UUID, TEXT) TO anon;

-- =============================================================================
-- Function: get_customer_queue_progress
-- Description: Get queue progress information for a shop
-- Returns current serving queue number and total queues ahead
-- =============================================================================
CREATE OR REPLACE FUNCTION public.get_customer_queue_progress(
    p_shop_id UUID
)
RETURNS TABLE (
    shop_id UUID,
    current_number TEXT,
    total_ahead BIGINT,
    average_service_time INTEGER,
    estimated_call_time TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_number TEXT;
    v_total_ahead BIGINT;
    v_average_service_time INTEGER;
    v_estimated_call_time TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Validate required parameters
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'Shop ID is required';
    END IF;
    
    -- Get current serving queue number (ordered by created_at, oldest first)
    SELECT q.queue_number INTO v_current_number
    FROM public.queues q
    WHERE q.shop_id = p_shop_id
    AND q.status = 'serving'
    ORDER BY q.created_at ASC
    LIMIT 1;
    
    -- If no queue is currently being served, use empty string
    v_current_number := COALESCE(v_current_number, '');
    
    -- Get total queues ahead (only confirmed, waiting is spam)
    SELECT COUNT(*) INTO v_total_ahead
    FROM public.queues q
    WHERE q.shop_id = p_shop_id
    AND q.status = 'confirmed';
    
    -- Calculate average service time from completed queues in the last 30 days
    -- Default to 8 minutes if no historical data
    SELECT COALESCE(
        AVG(EXTRACT(EPOCH FROM (q.completed_at - q.served_at)) / 60)::INTEGER,
        8
    ) INTO v_average_service_time
    FROM public.queues q
    WHERE q.shop_id = p_shop_id
    AND q.status = 'completed'
    AND q.served_at IS NOT NULL
    AND q.completed_at IS NOT NULL
    AND q.completed_at > CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Calculate estimated call time
    v_estimated_call_time := CURRENT_TIMESTAMP + (v_total_ahead * v_average_service_time * INTERVAL '1 minute');
    
    -- Return the progress data
    RETURN QUERY
    SELECT 
        p_shop_id,
        v_current_number,
        v_total_ahead,
        v_average_service_time,
        v_estimated_call_time;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_customer_queue_progress(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_customer_queue_progress(UUID) TO anon;

-- =============================================================================
-- Function: cancel_customer_queue
-- Description: Cancel a customer queue with proper validation and security checks
-- Returns TRUE if successful, raises exception if failed
-- =============================================================================
CREATE OR REPLACE FUNCTION public.cancel_customer_queue(
    p_shop_id UUID,
    p_queue_number TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_queue_id UUID;
    v_queue_status queue_status;
    v_customer_id UUID;
    v_customer_profile_id UUID;
    v_current_profile_id UUID;
BEGIN
    -- Validate required parameters
    IF p_shop_id IS NULL THEN
        RAISE EXCEPTION 'Shop ID is required';
    END IF;
    
    IF p_queue_number IS NULL OR p_queue_number = '' THEN
        RAISE EXCEPTION 'Queue number is required';
    END IF;
    
    -- Get the queue ID, status, and customer info
    SELECT q.id, q.status, q.customer_id, c.profile_id
    INTO v_queue_id, v_queue_status, v_customer_id, v_customer_profile_id
    FROM public.queues q
    LEFT JOIN public.customers c ON q.customer_id = c.id
    WHERE q.shop_id = p_shop_id
    AND q.queue_number = p_queue_number
    AND q.status IN ('waiting', 'confirmed', 'serving');
    
    -- Check if queue was found
    IF v_queue_id IS NULL THEN
        RAISE EXCEPTION 'Queue not found or already completed/cancelled';
    END IF;
    
    -- Security check: Only allow cancellation if:
    -- 1. Customer is not linked to any profile (unauthenticated), OR
    -- 2. Customer is linked to the currently authenticated user's profile
    IF v_customer_profile_id IS NOT NULL THEN
        -- Get current user's profile ID
        BEGIN
            v_current_profile_id := public.get_active_profile_id();
        EXCEPTION
            WHEN OTHERS THEN
                v_current_profile_id := NULL;
        END;
        
        -- Check if the authenticated user is the owner of this queue
        IF v_current_profile_id IS NULL OR v_current_profile_id != v_customer_profile_id THEN
            RAISE EXCEPTION 'Access denied: You can only cancel your own queues';
        END IF;
    END IF;
    
    -- Check if queue can be cancelled (only waiting or confirmed status)
    IF v_queue_status NOT IN ('waiting', 'confirmed') THEN
        RAISE EXCEPTION 'Queue cannot be cancelled: Invalid status %', v_queue_status;
    END IF;
    
    -- Update queue status to cancelled
    UPDATE public.queues
    SET 
        status = 'cancelled',
        cancelled_at = CURRENT_TIMESTAMP,
        cancelled_reason = 'Customer cancelled',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = v_queue_id;
    
    -- Check if update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Failed to cancel queue';
    END IF;
    
    -- Return success
    RETURN TRUE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.cancel_customer_queue(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_customer_queue(UUID, TEXT) TO anon;

-- =============================================================================
-- Comments
-- =============================================================================
COMMENT ON FUNCTION public.get_customer_queue_by_number IS 
'Get queue information by queue number with security checks. Only returns active queues (waiting, confirmed, serving).';

COMMENT ON FUNCTION public.get_customer_queue_progress IS 
'Get queue progress information including current serving number, total ahead, and estimated wait time.';

COMMENT ON FUNCTION public.cancel_customer_queue IS 
'Cancel a customer queue with proper validation and security checks. Only allows cancellation of waiting or confirmed queues.';
