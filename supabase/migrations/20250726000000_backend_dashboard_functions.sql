-- Backend Dashboard API Functions
-- Created: 2025-07-26
-- Author: Marosdee Uma
-- Description: RPC functions for backend dashboard statistics

-- Function to get dashboard statistics (admin only)
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS TABLE (
    total_users INTEGER,
    user_growth DECIMAL(5,2),
    total_videos INTEGER,
    video_growth DECIMAL(5,2),
    total_categories INTEGER,
    today_views INTEGER,
    views_growth DECIMAL(5,2)
) AS $$
DECLARE
    last_month_users INTEGER;
    last_month_videos INTEGER;
    last_month_views INTEGER;
BEGIN
    -- Check if using service role or has admin/moderator privileges
    IF current_setting('role') != 'service_role' THEN
        -- For non-service role, check authentication and admin/moderator role
        IF auth.uid() IS NULL THEN
            RAISE EXCEPTION 'Authentication required';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM public.profile_roles 
            WHERE profile_id IN (
                SELECT id FROM public.profiles 
                WHERE auth_id = auth.uid() AND is_active = true
            ) AND (role = 'admin'::public.profile_role OR role = 'moderator'::public.profile_role)
        ) THEN
            RAISE EXCEPTION 'Admin or Moderator privileges required';
        END IF;
    END IF;

    -- Get current month's users
    SELECT COUNT(*) INTO total_users
    FROM auth.users;
    
    -- Get last month's users
    SELECT COUNT(*) INTO last_month_users
    FROM auth.users
    WHERE created_at >= (CURRENT_DATE - INTERVAL '1 month');
    
    -- Calculate user growth (prevent division by zero)
    user_growth := CASE 
        WHEN last_month_users = 0 THEN 
            CASE WHEN total_users > 0 THEN 100.0 ELSE 0.0 END
        ELSE 
            ROUND((total_users::DECIMAL - last_month_users::DECIMAL) / last_month_users::DECIMAL * 100, 2)
        END;
    
    -- Get current month's videos
    SELECT COUNT(*) INTO total_videos
    FROM public.videos;
    
    -- Get last month's videos
    SELECT COUNT(*) INTO last_month_videos
    FROM public.videos
    WHERE created_at >= (CURRENT_DATE - INTERVAL '1 month');
    
    -- Calculate video growth (prevent division by zero)
    video_growth := CASE 
        WHEN last_month_videos = 0 THEN 
            CASE WHEN total_videos > 0 THEN 100.0 ELSE 0.0 END
        ELSE 
            ROUND((total_videos::DECIMAL - last_month_videos::DECIMAL) / last_month_videos::DECIMAL * 100, 2)
        END;
    
    -- Get total categories
    SELECT COUNT(*) INTO total_categories
    FROM public.categories;
    
    -- Get today's views
    SELECT COUNT(*) INTO today_views
    FROM public.views
    WHERE created_at >= CURRENT_DATE;
    
    -- Get last month's views
    SELECT COUNT(*) INTO last_month_views
    FROM public.views
    WHERE created_at >= (CURRENT_DATE - INTERVAL '1 month');
    
    -- Calculate views growth (prevent division by zero)
    views_growth := CASE 
        WHEN last_month_views = 0 THEN 
            CASE WHEN today_views > 0 THEN 100.0 ELSE 0.0 END
        ELSE 
            ROUND((today_views::DECIMAL - last_month_views::DECIMAL) / last_month_views::DECIMAL * 100, 2)
        END;
    
    RETURN QUERY 
    SELECT 
        total_users,
        user_growth,
        total_videos,
        video_growth,
        total_categories,
        today_views,
        views_growth;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get popular videos (admin only)
CREATE OR REPLACE FUNCTION public.get_popular_videos(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id UUID,
    title TEXT,
    profile_name TEXT,
    views BIGINT
) AS $$
BEGIN
    -- Check if using service role or has admin/moderator privileges
    IF current_setting('role') != 'service_role' THEN
        -- For non-service role, check authentication and admin/moderator role
        IF auth.uid() IS NULL THEN
            RAISE EXCEPTION 'Authentication required';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM public.profile_roles 
            WHERE profile_id IN (
                SELECT id FROM public.profiles 
                WHERE auth_id = auth.uid() AND is_active = true
            ) AND (role = 'admin' OR role = 'moderator')
        ) THEN
            RAISE EXCEPTION 'Admin or Moderator privileges required';
        END IF;
    END IF;

    RETURN QUERY
    SELECT 
        v.id,
        v.title,
        p.full_name AS profile_name,
        COUNT(vv.id) AS views
    FROM public.videos v
    JOIN public.profiles p ON v.profile_id = p.id
    LEFT JOIN public.views vv ON vv.video_id = v.id
    GROUP BY v.id, p.full_name
    ORDER BY views DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent profiles (admin only)
CREATE OR REPLACE FUNCTION public.get_recent_profiles(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    id UUID,
    name TEXT,
    email VARCHAR(255),
    created_at TIMESTAMPTZ,
    is_active BOOLEAN
) AS $$
BEGIN
    -- Check if using service role or has admin/moderator privileges
    IF current_setting('role') != 'service_role' THEN
        -- For non-service role, check authentication and admin/moderator role
        IF auth.uid() IS NULL THEN
            RAISE EXCEPTION 'Authentication required';
        END IF;
        
        IF NOT EXISTS (
            SELECT 1 FROM public.profile_roles 
            WHERE profile_id IN (
                SELECT id FROM public.profiles 
                WHERE auth_id = auth.uid() AND is_active = true
            ) AND (role = 'admin' OR role = 'moderator')
        ) THEN
            RAISE EXCEPTION 'Admin or Moderator privileges required';
        END IF;
    END IF;

    RETURN QUERY
    SELECT 
        p.id,
        p.full_name AS name,
        u.email,
        p.created_at,
        p.is_active
    FROM public.profiles p
    JOIN auth.users u ON p.auth_id = u.id
    ORDER BY p.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated role
GRANT EXECUTE ON FUNCTION public.get_dashboard_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_popular_videos(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_profiles(INTEGER) TO authenticated;

-- Function to get daily views data for the specified number of days
CREATE OR REPLACE FUNCTION public.get_daily_views(days_count INT DEFAULT 7)
RETURNS TABLE (
  date DATE,
  count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT 
      generate_series(
        current_date - ((days_count - 1) || ' days')::interval, 
        current_date, 
        '1 day'::interval
      )::date AS date
  )
  SELECT 
    ds.date,
    COALESCE(COUNT(v.id), 0)::BIGINT AS count
  FROM 
    date_series ds
  LEFT JOIN 
    views v ON ds.date = date_trunc('day', v.created_at)::date
  GROUP BY 
    ds.date
  ORDER BY 
    ds.date;
END;
$$;

-- Function to get monthly new videos data for the specified number of months
CREATE OR REPLACE FUNCTION public.get_monthly_new_videos(months_count INT DEFAULT 6)
RETURNS TABLE (
  month TEXT,
  count BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH month_series AS (
    SELECT 
      to_char(generate_series(
        date_trunc('month', current_date) - ((months_count - 1) || ' months')::interval, 
        date_trunc('month', current_date), 
        '1 month'::interval
      ), 'YYYY-MM') AS month
  )
  SELECT 
    ms.month,
    COALESCE(COUNT(v.id), 0)::BIGINT AS count
  FROM 
    month_series ms
  LEFT JOIN 
    videos v ON ms.month = to_char(date_trunc('month', v.created_at), 'YYYY-MM')
  GROUP BY 
    ms.month
  ORDER BY 
    ms.month;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_daily_views(INT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_monthly_new_videos(INT) TO authenticated;