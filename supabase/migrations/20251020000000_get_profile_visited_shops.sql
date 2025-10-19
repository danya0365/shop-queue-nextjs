-- Create RPC function to get visited shops by profile with pagination
-- This function returns all distinct shops that the profile has interacted with through customers
-- It aggregates visits across all customers belonging to the profile
CREATE OR REPLACE FUNCTION get_profile_visited_shops(
    p_profile_id UUID,
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_offset INTEGER;
    v_total_count BIGINT;
    v_total_pages INTEGER;
    v_has_next BOOLEAN;
    v_has_prev BOOLEAN;
    v_result_data JSONB;
BEGIN
    IF p_profile_id IS NULL THEN
        RAISE EXCEPTION 'Profile ID is required';
    END IF;

    -- Validate pagination parameters
    IF p_page < 1 THEN
        p_page := 1;
    END IF;

    IF p_limit < 1 OR p_limit > 100 THEN
        p_limit := 10;
    END IF;

    v_offset := (p_page - 1) * p_limit;

    -- Security check: allow if caller is the profile owner or service role
    IF current_setting('role') <> 'service_role'
       AND NOT EXISTS (
           SELECT 1
           FROM profiles p
           WHERE p.id = p_profile_id
             AND p.auth_id = auth.uid()
       ) THEN
        RAISE EXCEPTION 'Access denied: invalid profile';
    END IF;

    -- Aggregate visited shops
    WITH profile_customers AS (
        SELECT c.id AS customer_id, c.shop_id
        FROM customers c
        WHERE c.profile_id = p_profile_id
    ),
    customer_visits AS (
        SELECT
            pc.shop_id,
            pc.customer_id,
            COUNT(q.id) AS total_visits,
            MIN(q.created_at) AS first_visited_at,
            MAX(q.created_at) AS last_visited_at
        FROM profile_customers pc
        JOIN queues q ON q.customer_id = pc.customer_id
        GROUP BY pc.shop_id, pc.customer_id
    ),
    visited_shops AS (
        SELECT
            s.id AS shop_id,
            s.slug AS shop_slug,
            s.name AS shop_name,
            cv.customer_id,
            cv.total_visits,
            cv.first_visited_at,
            cv.last_visited_at
        FROM customer_visits cv
        JOIN shops s ON s.id = cv.shop_id
    )
    SELECT COALESCE(JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'shop_id', vs.shop_id,
            'shop_slug', vs.shop_slug,
            'shop_name', vs.shop_name,
            'customer_id', vs.customer_id,
            'total_visits', vs.total_visits,
            'first_visited_at', vs.first_visited_at,
            'last_visited_at', vs.last_visited_at
        )
        ORDER BY vs.last_visited_at DESC
    ), '[]'::JSONB)
    INTO v_result_data
    FROM (
        SELECT *
        FROM visited_shops
        ORDER BY last_visited_at DESC
        LIMIT p_limit OFFSET v_offset
    ) vs;

    -- Count total distinct shop-customer pairs for pagination
    SELECT COUNT(*) INTO v_total_count FROM visited_shops;

    v_total_pages := CEIL(v_total_count::FLOAT / p_limit::FLOAT);
    v_has_next := p_page < v_total_pages;
    v_has_prev := p_page > 1;

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

GRANT EXECUTE ON FUNCTION get_profile_visited_shops TO authenticated;
GRANT EXECUTE ON FUNCTION get_profile_visited_shops TO service_role;
