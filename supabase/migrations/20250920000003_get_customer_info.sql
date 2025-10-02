-- Create RPC function to get customer information
-- This function bypasses RLS and returns basic customer information
CREATE OR REPLACE FUNCTION get_customer_info_by_customer(
    p_customer_id UUID,
    p_shop_id UUID
)
RETURNS TABLE (
    id UUID,
    shop_id UUID,
    customer_name TEXT,
    customer_phone TEXT,
    member_since DATE,
    profile_id UUID,
    is_linked_to_profile BOOLEAN,
    total_visits BIGINT,
    last_visit_date DATE
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
    SELECT 
        c.id,
        c.shop_id,
        c.name as customer_name,
        c.phone as customer_phone,
        c.created_at::DATE as member_since,
        c.profile_id,
        CASE WHEN c.profile_id IS NOT NULL THEN true ELSE false END as is_linked_to_profile,
        COUNT(q.id) as total_visits,
        MAX(CASE WHEN q.status = 'completed' THEN q.completed_at ELSE NULL END)::DATE as last_visit_date
    FROM customers c
    LEFT JOIN queues q ON c.id = q.customer_id AND q.shop_id = c.shop_id
    WHERE c.id = p_customer_id
    AND c.shop_id = p_shop_id
    GROUP BY c.id, c.shop_id, c.name, c.phone, c.created_at, c.profile_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_customer_info_by_customer TO authenticated;
GRANT EXECUTE ON FUNCTION get_customer_info_by_customer TO service_role;
