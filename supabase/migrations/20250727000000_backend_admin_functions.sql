-- Backend Admin API Functions
-- Created: 2025-07-27
-- Author: Marosdee Uma
-- Description: Additional RPC functions for admin repository operations

-- Function to get database table statistics (admin only)
CREATE OR REPLACE FUNCTION public.get_database_stats()
RETURNS TABLE (
    profiles_count INTEGER,
    videos_count INTEGER,
    categories_count INTEGER,
    likes_count INTEGER,
    comments_count INTEGER,
    views_count INTEGER
) AS $$
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

    RETURN QUERY 
    SELECT
        (SELECT COUNT(*) FROM profiles)::INTEGER AS profiles_count,
        (SELECT COUNT(*) FROM videos)::INTEGER AS videos_count,
        (SELECT COUNT(*) FROM categories)::INTEGER AS categories_count,
        (SELECT COUNT(*) FROM likes)::INTEGER AS likes_count,
        (SELECT COUNT(*) FROM comments)::INTEGER AS comments_count,
        (SELECT COUNT(*) FROM views)::INTEGER AS views_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find duplicate videos by URL (admin only)
CREATE OR REPLACE FUNCTION public.find_duplicate_videos()
RETURNS TABLE (
    url TEXT,
    count BIGINT,
    video_ids UUID[]
) AS $$
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
            ) AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Admin privileges required';
        END IF;
    END IF;

    RETURN QUERY
    SELECT
        v.url,
        COUNT(*)::BIGINT as count,
        ARRAY_AGG(v.id) as video_ids
    FROM videos v
    GROUP BY v.url
    HAVING COUNT(*) > 1
    ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user activity statistics (admin only)
CREATE OR REPLACE FUNCTION public.get_user_activity_stats()
RETURNS TABLE (
    profile_id UUID,
    username TEXT,
    videos_count BIGINT,
    likes_count BIGINT
) AS $$
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
            ) AND role = 'admin'
        ) THEN
            RAISE EXCEPTION 'Admin privileges required';
        END IF;
    END IF;

    RETURN QUERY
    SELECT
        p.id as profile_id,
        p.username,
        COUNT(DISTINCT v.id)::BIGINT as videos_count,
        COUNT(DISTINCT l.id)::BIGINT as likes_count
    FROM profiles p
    LEFT JOIN videos v ON v.profile_id = p.id
    LEFT JOIN likes l ON l.profile_id = p.id
    GROUP BY p.id, p.username
    ORDER BY videos_count DESC, likes_count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated role
GRANT EXECUTE ON FUNCTION public.get_database_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_duplicate_videos() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_activity_stats() TO authenticated;
