-- Backend User API Functions
-- Created: 2025-08-11
-- Author: Marosdee Uma
-- Description: RPC functions for backend user operations

-- Function to get paginated users with roles and profiles count (admin only)
CREATE OR REPLACE FUNCTION public.get_paginated_users(
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10
)
RETURNS JSONB AS $$
DECLARE
    v_offset INTEGER;
    v_total INTEGER;
    v_result JSONB;
    v_users JSONB;
BEGIN
    -- Check if using service role or has admin privileges
    IF current_setting('role') != 'service_role' THEN
        -- For non-service role, check authentication and admin role
        IF auth.uid() IS NULL THEN
            RAISE EXCEPTION 'Authentication required';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM public.profile_roles 
            WHERE profile_id IN (
                SELECT id FROM public.profiles 
                WHERE auth_id = auth.uid() AND is_active = true
            ) AND role = 'admin'::public.profile_role
        ) THEN
            RAISE EXCEPTION 'Admin privileges required';
        END IF;
    END IF;

    -- Calculate offset
    v_offset := (p_page - 1) * p_limit;
    
    -- Get total count
    SELECT COUNT(*) INTO v_total FROM auth.users;
    
    -- Get users with roles and profiles count
    WITH profile_roles_by_user AS (
        SELECT 
            p.auth_id,
            MAX(pr.role) AS role  -- Taking the highest privilege role if multiple exist
        FROM 
            public.profiles p
        JOIN 
            public.profile_roles pr ON p.id = pr.profile_id
        GROUP BY 
            p.auth_id
    ),
    profile_counts AS (
        SELECT 
            p.auth_id,
            COUNT(*) AS count
        FROM 
            public.profiles p
        GROUP BY 
            p.auth_id
    ),
    users_data AS (
        SELECT 
            u.id,
            u.email,
            COALESCE(u.raw_user_meta_data->>'full_name', 'Unknown') AS name,
            u.created_at,
            u.banned_until,
            COALESCE(pr.role, 'user'::public.profile_role)::TEXT AS role,
            COALESCE(pc.count, 0)::BIGINT AS profiles_count
        FROM 
            auth.users u
        LEFT JOIN 
            profile_roles_by_user pr ON u.id = pr.auth_id
        LEFT JOIN 
            profile_counts pc ON u.id = pc.auth_id
        ORDER BY 
            u.created_at DESC
        LIMIT 
            p_limit
        OFFSET 
            v_offset
    )
    SELECT 
        jsonb_agg(jsonb_build_object(
            'id', id,
            'email', email,
            'name', name,
            'created_at', created_at,
            'banned_until', banned_until,
            'role', role,
            'profiles_count', profiles_count
        )) INTO v_users
    FROM 
        users_data;
    
    -- Build final result
    v_result := jsonb_build_object(
        'users', COALESCE(v_users, '[]'::jsonb),
        'total_count', v_total
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated role
GRANT EXECUTE ON FUNCTION public.get_paginated_users(INTEGER, INTEGER) TO authenticated;
