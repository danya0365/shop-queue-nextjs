-- Create customer_stats_view for aggregated customer statistics
CREATE OR REPLACE VIEW customer_stats_view AS
SELECT
    s.id AS shop_id,
    COUNT(c.id) AS total_customers,
    COUNT(c.id) FILTER (WHERE c.created_at >= DATE_TRUNC('month', NOW())) AS new_customers_this_month,
    COUNT(c.id) FILTER (WHERE c.last_visit >= CURRENT_DATE) AS active_customers_today,
    COUNT(c.id) FILTER (WHERE cp.membership_tier = 'gold') AS gold_members,
    COUNT(c.id) FILTER (WHERE cp.membership_tier = 'silver') AS silver_members,
    COUNT(c.id) FILTER (WHERE cp.membership_tier = 'bronze') AS bronze_members,
    COUNT(c.id) FILTER (WHERE cp.membership_tier IS NULL OR cp.membership_tier = 'bronze') AS regular_members
FROM
    shops s
LEFT JOIN
    customers c ON c.shop_id = s.id
LEFT JOIN
    customer_points cp ON cp.customer_id = c.id
GROUP BY
    s.id;

-- Create function to get customer stats for a specific shop
CREATE OR REPLACE FUNCTION get_customer_stats(shop_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
BEGIN
    -- Skip permission check for service role
    IF NOT is_service_role() AND NOT public.is_shop_manager(shop_id_param) THEN
        RAISE EXCEPTION 'insufficient_privilege: manager role required';
    END IF;

    SELECT json_build_object(
        'total_customers', total_customers,
        'new_customers_this_month', new_customers_this_month,
        'active_customers_today', active_customers_today,
        'gold_members', gold_members,
        'silver_members', silver_members,
        'bronze_members', bronze_members,
        'regular_members', regular_members
    ) INTO result
    FROM customer_stats_view
    WHERE shop_id = shop_id_param;

    RETURN COALESCE(result, '{}'::json);
END;
$$;

-- Create function to get paginated customers with joined data
CREATE OR REPLACE FUNCTION get_paginated_customers(
    shop_id_param UUID,
    page_param INTEGER DEFAULT 1,
    page_size_param INTEGER DEFAULT 10,
    search_term TEXT DEFAULT NULL,
    sort_by TEXT DEFAULT 'created_at',
    sort_order TEXT DEFAULT 'desc'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    offset_val INTEGER;
    total_count INTEGER;
    customers_json JSON;
    stats_json JSON;
    result JSON;
BEGIN
    -- Skip permission check for service role
    IF NOT is_service_role() AND NOT public.is_shop_manager(shop_id_param) THEN
        RAISE EXCEPTION 'insufficient_privilege: manager role required';
    END IF;

    -- Calculate offset
    offset_val := (page_param - 1) * page_size_param;

    -- Get total count for pagination
    SELECT COUNT(*)
    INTO total_count
    FROM customers c
    WHERE c.shop_id = shop_id_param
    AND (
        search_term IS NULL
        OR c.name ILIKE '%' || search_term || '%'
        OR c.phone ILIKE '%' || search_term || '%'
        OR c.email ILIKE '%' || search_term || '%'
    );

    -- Get customers with joined data
    WITH customer_data AS (
        SELECT
            c.id,
            c.name,
            c.phone,
            c.email,
            c.date_of_birth,
            c.gender,
            c.address,
            c.notes,
            c.last_visit,
            c.is_active,
            c.created_at,
            c.updated_at,
            COALESCE(cp.current_points, 0) AS total_points,
            COALESCE(cp.membership_tier, 'regular') AS membership_tier,
            COUNT(q.id) AS total_queues
        FROM
            customers c
        LEFT JOIN
            customer_points cp ON cp.customer_id = c.id
        LEFT JOIN
            queues q ON q.customer_id = c.id
        WHERE
            c.shop_id = shop_id_param
        AND (
            search_term IS NULL
            OR c.name ILIKE '%' || search_term || '%'
            OR c.phone ILIKE '%' || search_term || '%'
            OR c.email ILIKE '%' || search_term || '%'
        )
        GROUP BY
            c.id, cp.current_points, cp.membership_tier
        ORDER BY
            CASE WHEN sort_order = 'asc' THEN
                CASE
                    WHEN sort_by = 'name' THEN c.name
                    WHEN sort_by = 'total_points' THEN cp.current_points::text
                    WHEN sort_by = 'total_queues' THEN COUNT(q.id)::text
                    WHEN sort_by = 'last_visit' THEN c.last_visit::text
                    ELSE c.created_at::text
                END
            END ASC,
            CASE WHEN sort_order = 'desc' OR sort_order IS NULL THEN
                CASE
                    WHEN sort_by = 'name' THEN c.name
                    WHEN sort_by = 'total_points' THEN cp.current_points::text
                    WHEN sort_by = 'total_queues' THEN COUNT(q.id)::text
                    WHEN sort_by = 'last_visit' THEN c.last_visit::text
                    ELSE c.created_at::text
                END
            END DESC
        LIMIT page_size_param
        OFFSET offset_val
    )
    SELECT json_agg(
        json_build_object(
            'id', cd.id,
            'name', cd.name,
            'phone', cd.phone,
            'email', cd.email,
            'date_of_birth', cd.date_of_birth,
            'gender', cd.gender,
            'address', cd.address,
            'notes', cd.notes,
            'last_visit', cd.last_visit,
            'is_active', cd.is_active,
            'created_at', cd.created_at,
            'updated_at', cd.updated_at,
            'total_points', cd.total_points,
            'membership_tier', cd.membership_tier,
            'total_queues', cd.total_queues
        )
    )
    INTO customers_json
    FROM customer_data cd;

    -- Get stats
    SELECT json_build_object(
        'total_customers', total_customers,
        'new_customers_this_month', new_customers_this_month,
        'active_customers_today', active_customers_today,
        'gold_members', gold_members,
        'silver_members', silver_members,
        'bronze_members', bronze_members,
        'regular_members', regular_members
    )
    INTO stats_json
    FROM customer_stats_view
    WHERE shop_id = shop_id_param;

    -- Build final result
    SELECT json_build_object(
        'customers', COALESCE(customers_json, '[]'::json),
        'stats', COALESCE(stats_json, '{}'::json),
        'total_count', total_count,
        'current_page', page_param,
        'per_page', page_size_param
    ) INTO result;

    RETURN result;
END;
$$;

-- Create function to get a single customer by ID
CREATE OR REPLACE FUNCTION get_customer_by_id(
    shop_id_param UUID,
    customer_id_param UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
BEGIN
    IF NOT public.is_shop_manager(shop_id_param) THEN
        RAISE EXCEPTION 'insufficient_privilege: manager role required';
    END IF;

    SELECT json_build_object(
        'id', c.id,
        'name', c.name,
        'phone', c.phone,
        'email', c.email,
        'date_of_birth', c.date_of_birth,
        'gender', c.gender,
        'address', c.address,
        'notes', c.notes,
        'last_visit', c.last_visit,
        'is_active', c.is_active,
        'created_at', c.created_at,
        'updated_at', c.updated_at,
        'total_points', COALESCE(cp.current_points, 0),
        'membership_tier', COALESCE(cp.membership_tier, 'regular'),
        'total_queues', (SELECT COUNT(*) FROM queues q WHERE q.customer_id = c.id)
    ) INTO result
    FROM customers c
    LEFT JOIN customer_points cp ON cp.customer_id = c.id
    WHERE c.shop_id = shop_id_param AND c.id = customer_id_param;

    IF result IS NULL THEN
        RAISE EXCEPTION 'customer_not_found: %', customer_id_param;
    END IF;

    RETURN result;
END;
$$;

-- Create function to create a new customer
CREATE OR REPLACE FUNCTION create_customer(
    shop_id_param UUID,
    name_param TEXT,
    phone_param TEXT DEFAULT NULL,
    email_param TEXT DEFAULT NULL,
    date_of_birth_param DATE DEFAULT NULL,
    gender_param TEXT DEFAULT NULL,
    address_param TEXT DEFAULT NULL,
    notes_param TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_customer_id UUID;
    result JSON;
BEGIN
    IF NOT public.is_shop_manager(shop_id_param) THEN
        RAISE EXCEPTION 'insufficient_privilege: manager role required';
    END IF;

    -- Insert new customer
    INSERT INTO customers (
        shop_id, name, phone, email, date_of_birth, gender, address, notes
    ) VALUES (
        shop_id_param, name_param, phone_param, email_param, date_of_birth_param, gender_param, address_param, notes_param
    )
    RETURNING id INTO new_customer_id;

    -- Initialize customer points
    INSERT INTO customer_points (
        shop_id, customer_id, current_points, total_earned, total_redeemed, membership_tier
    ) VALUES (
        shop_id_param, new_customer_id, 0, 0, 0, 'bronze'
    );

    -- Return the created customer
    SELECT get_customer_by_id(shop_id_param, new_customer_id) INTO result;
    
    RETURN result;
END;
$$;

-- Create function to update a customer
CREATE OR REPLACE FUNCTION update_customer(
    shop_id_param UUID,
    customer_id_param UUID,
    name_param TEXT DEFAULT NULL,
    phone_param TEXT DEFAULT NULL,
    email_param TEXT DEFAULT NULL,
    date_of_birth_param DATE DEFAULT NULL,
    gender_param TEXT DEFAULT NULL,
    address_param TEXT DEFAULT NULL,
    notes_param TEXT DEFAULT NULL,
    is_active_param BOOLEAN DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSON;
BEGIN
    IF NOT public.is_shop_manager(shop_id_param) THEN
        RAISE EXCEPTION 'insufficient_privilege: manager role required';
    END IF;

    -- Check if customer exists
    IF NOT EXISTS (SELECT 1 FROM customers WHERE id = customer_id_param AND shop_id = shop_id_param) THEN
        RAISE EXCEPTION 'customer_not_found: %', customer_id_param;
    END IF;

    -- Update customer with non-null parameters
    UPDATE customers
    SET
        name = COALESCE(name_param, name),
        phone = COALESCE(phone_param, phone),
        email = COALESCE(email_param, email),
        date_of_birth = COALESCE(date_of_birth_param, date_of_birth),
        gender = COALESCE(gender_param, gender),
        address = COALESCE(address_param, address),
        notes = COALESCE(notes_param, notes),
        is_active = COALESCE(is_active_param, is_active),
        updated_at = NOW()
    WHERE
        id = customer_id_param AND shop_id = shop_id_param;

    -- Return the updated customer
    SELECT get_customer_by_id(shop_id_param, customer_id_param) INTO result;
    
    RETURN result;
END;
$$;

-- Create function to delete a customer
CREATE OR REPLACE FUNCTION delete_customer(
    shop_id_param UUID,
    customer_id_param UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_shop_manager(shop_id_param) THEN
        RAISE EXCEPTION 'insufficient_privilege: manager role required';
    END IF;

    -- Check if customer exists
    IF NOT EXISTS (SELECT 1 FROM customers WHERE id = customer_id_param AND shop_id = shop_id_param) THEN
        RAISE EXCEPTION 'customer_not_found: %', customer_id_param;
    END IF;

    -- Delete customer (will cascade to customer_points)
    DELETE FROM customers
    WHERE id = customer_id_param AND shop_id = shop_id_param;

    RETURN true;
END;
$$;