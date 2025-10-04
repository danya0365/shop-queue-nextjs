-- =============================================================================
-- Function: cancel_queue_by_id
-- Description: Securely cancel a queue by queue_id with explicit customer_id ownership check
-- Returns TRUE if successful, raises exception if failed
-- =============================================================================
CREATE OR REPLACE FUNCTION public.cancel_queue_by_id(
    p_queue_id UUID,
    p_customer_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_queue_status queue_status;
    v_owner_customer_id UUID;
    v_owner_profile_id UUID;
    v_current_profile_id UUID;
BEGIN
    -- Validate params
    IF p_queue_id IS NULL THEN
        RAISE EXCEPTION 'Queue ID is required';
    END IF;
    IF p_customer_id IS NULL THEN
        RAISE EXCEPTION 'Customer ID is required';
    END IF;

    -- Fetch queue, owner, and owner profile (if any)
    SELECT q.status, q.customer_id, c.profile_id
    INTO v_queue_status, v_owner_customer_id, v_owner_profile_id
    FROM public.queues q
    LEFT JOIN public.customers c ON c.id = q.customer_id
    WHERE q.id = p_queue_id;

    IF v_owner_customer_id IS NULL THEN
        RAISE EXCEPTION 'Queue not found';
    END IF;

    -- Ownership enforcement: provided customer_id must match queue.customer_id
    IF v_owner_customer_id != p_customer_id THEN
        RAISE EXCEPTION 'Access denied: You can only cancel your own queues';
    END IF;

    -- If the queue belongs to a member (has profile_id), require authentication and profile match
    IF v_owner_profile_id IS NOT NULL THEN
        BEGIN
            v_current_profile_id := public.get_active_profile_id();
        EXCEPTION
            WHEN OTHERS THEN
                v_current_profile_id := NULL;
        END;

        IF v_current_profile_id IS NULL OR v_current_profile_id != v_owner_profile_id THEN
            RAISE EXCEPTION 'Access denied: Authentication required for member queue or profile mismatch';
        END IF;
    END IF;

    -- Only allow cancelling waiting/confirmed
    IF v_queue_status NOT IN ('waiting', 'confirmed') THEN
        RAISE EXCEPTION 'Queue cannot be cancelled: Invalid status %', v_queue_status;
    END IF;

    -- Perform cancellation
    UPDATE public.queues
    SET status = 'cancelled',
        cancelled_at = CURRENT_TIMESTAMP,
        cancelled_reason = 'Customer cancelled',
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_queue_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Failed to cancel queue';
    END IF;

    RETURN TRUE;
END;
$$;

-- Grant execute permissions to both anon and authenticated (ownership enforced by params)
GRANT EXECUTE ON FUNCTION public.cancel_queue_by_id(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_queue_by_id(UUID, UUID) TO anon;
