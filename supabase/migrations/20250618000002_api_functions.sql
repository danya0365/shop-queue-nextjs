-- FilmNest API Functions
-- Created: 2025-06-18
-- Author: Marosdee Uma
-- Description: Supabase API functions for FilmNest application


-- Function to create a new profile (can be called by authenticated users)
CREATE OR REPLACE FUNCTION public.create_profile(
  username TEXT,
  full_name TEXT DEFAULT NULL,
  avatar_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_profile_id UUID;
  auth_user_id UUID;
BEGIN
  -- Get the current user's auth ID
  auth_user_id := auth.uid();
  
  -- Check if the user exists
  IF auth_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required for creating a profile';
  END IF;
  
  -- Insert the new profile
  INSERT INTO public.profiles (auth_id, username, full_name, avatar_url, is_active)
  VALUES (auth_user_id, username, full_name, avatar_url, FALSE)
  RETURNING id INTO new_profile_id;

  RETURN new_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get profile role (can be called by anyone)
CREATE OR REPLACE FUNCTION public.get_profile_role(profile_id UUID)
RETURNS public.profile_role AS $$
DECLARE
  profile_role public.profile_role;
BEGIN
  SELECT role INTO profile_role FROM public.profile_roles WHERE profile_id = $1;
  RETURN COALESCE(profile_role, 'user'::public.profile_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get active profile role for current user (can be called by anyone)
CREATE OR REPLACE FUNCTION public.get_active_profile_role()
RETURNS public.profile_role AS $$
DECLARE
  active_profile_id UUID;
  user_role public.profile_role;
BEGIN
  -- Get the active profile ID for current user
  SELECT id INTO active_profile_id FROM public.profiles 
  WHERE auth_id = auth.uid() AND is_active = true;
  
  -- If no active profile, return 'user' as default role
  IF active_profile_id IS NULL THEN
    RETURN 'user'::public.profile_role;
  END IF;
  
  -- Get the role for this profile
  SELECT role INTO user_role FROM public.profile_roles WHERE profile_id = active_profile_id;
  RETURN COALESCE(user_role, 'user'::public.profile_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set profile role (admin only)
CREATE OR REPLACE FUNCTION public.set_profile_role(
  target_profile_id UUID,
  new_role public.profile_role
)
RETURNS BOOLEAN AS $$
DECLARE
  admin_profile_id UUID;
  admin_role public.profile_role;
BEGIN
  -- Get the active profile ID for current user
  SELECT id INTO admin_profile_id FROM public.profiles 
  WHERE auth_id = auth.uid() AND is_active = true;
  
  -- Check if current user's active profile is admin
  SELECT role INTO admin_role FROM public.profile_roles WHERE profile_id = admin_profile_id;
  
  IF admin_role != 'admin'::public.profile_role THEN
    RAISE EXCEPTION 'Only administrators can change profile roles';
    RETURN false;
  END IF;
  
  -- Update or insert role
  INSERT INTO public.profile_roles (profile_id, role, granted_by)
  VALUES (target_profile_id, new_role, auth.uid())
  ON CONFLICT (profile_id) 
  DO UPDATE SET 
    role = new_role,
    granted_by = auth.uid(),
    granted_at = NOW();
    
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Create API function to get video details with related data
CREATE OR REPLACE FUNCTION public.get_video_details(video_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  youtube_id TEXT,
  category_id UUID,
  category_name TEXT,
  category_slug TEXT,
  user_id UUID,
  username TEXT,
  avatar_url TEXT,
  duration_seconds INTEGER,
  views_count BIGINT,
  likes_count BIGINT,
  comments_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  is_liked BOOLEAN
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  active_profile_id UUID;
BEGIN
  -- Get the active profile ID
  active_profile_id := public.get_active_profile_id();
  
  RETURN QUERY
  SELECT
    v.id,
    v.title,
    v.description,
    v.youtube_id,
    v.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    v.profile_id AS user_id,
    p.username,
    p.avatar_url,
    v.duration_seconds,
    v.views_count,
    v.likes_count,
    v.comments_count,
    v.created_at,
    v.updated_at,
    EXISTS (
      SELECT 1 FROM public.likes l
      WHERE l.video_id = v.id AND l.profile_id = active_profile_id
    ) AS is_liked
  FROM
    public.videos v
  LEFT JOIN
    public.categories c ON v.category_id = c.id
  LEFT JOIN
    public.profiles p ON v.profile_id = p.id
  WHERE
    v.id = video_id;
END;
$$;

-- Create API function to get related videos
CREATE OR REPLACE FUNCTION public.get_related_videos(video_id UUID, limit_count INTEGER DEFAULT 4)
RETURNS TABLE (
  id UUID,
  title TEXT,
  youtube_id TEXT,
  views_count BIGINT,
  likes_count BIGINT,
  comments_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  WITH video_category AS (
    -- FIX: Explicitly qualify the 'id' column with the table name 'public.videos'.
    -- The error 'column reference "id" is ambiguous' occurs because the function's
    -- `RETURNS TABLE` clause also defines a column named 'id'. By specifying
    -- `public.videos.id`, we remove the ambiguity for the PostgreSQL parser.
    -- It's also good practice to qualify the parameter with the function name.
    SELECT category_id FROM public.videos WHERE public.videos.id = get_related_videos.video_id
  )
  SELECT
    v.id,
    v.title,
    v.youtube_id,
    v.views_count,
    v.likes_count,
    v.comments_count,
    v.created_at
  FROM
    public.videos v,
    video_category vc
  WHERE
    v.category_id = vc.category_id
    AND v.id != get_related_videos.video_id
  ORDER BY
    v.views_count DESC,
    v.likes_count DESC,
    v.comments_count DESC,
    v.created_at DESC
  LIMIT limit_count;
END;
$$;


-- Create API function to toggle like status
CREATE OR REPLACE FUNCTION public.toggle_video_like(video_id UUID)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  like_exists BOOLEAN;
  active_profile_id UUID;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required for toggling like status';
  END IF;
  
  -- Get the active profile ID
  active_profile_id := public.get_active_profile_id();
  
  -- Check if active profile exists
  IF active_profile_id IS NULL THEN
    RAISE EXCEPTION 'No active profile found';
  END IF;

  -- Check if like exists
  SELECT EXISTS (
    SELECT 1 FROM public.likes
    WHERE profile_id = active_profile_id AND video_id = toggle_video_like.video_id
  ) INTO like_exists;

  -- Toggle like status
  IF like_exists THEN
    DELETE FROM public.likes
    WHERE profile_id = active_profile_id AND video_id = toggle_video_like.video_id;
    RETURN FALSE;
  ELSE
    INSERT INTO public.likes (profile_id, video_id)
    VALUES (active_profile_id, toggle_video_like.video_id);
    RETURN TRUE;
  END IF;
END;
$$;

-- Create API function to search videos
CREATE OR REPLACE FUNCTION public.search_videos(search_query TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  youtube_id TEXT,
  category_id UUID,
  category_name TEXT,
  category_slug TEXT,
  views_count BIGINT,
  likes_count BIGINT,
  comments_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.title,
    v.description,
    v.youtube_id,
    v.category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    v.views_count,
    v.likes_count,
    v.comments_count,
    v.created_at
  FROM
    public.videos v
  LEFT JOIN
    public.categories c ON v.category_id = c.id
  WHERE
    v.title ILIKE '%' || search_query || '%'
    OR v.description ILIKE '%' || search_query || '%'
    OR c.name ILIKE '%' || search_query || '%'
  ORDER BY
    ts_rank(
      to_tsvector('thai', v.title || ' ' || COALESCE(v.description, '')),
      to_tsquery('thai', search_query)
    ) DESC,
    v.views_count DESC,
    v.likes_count DESC,
    v.comments_count DESC,
    v.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Create API function to get user dashboard data
CREATE OR REPLACE FUNCTION public.get_user_dashboard()
RETURNS TABLE (
  video_count BIGINT,
  total_views BIGINT,
  total_likes BIGINT,
  total_comments BIGINT,
  recent_videos JSON
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  active_profile_id UUID;
  auth_user_id UUID;
BEGIN
  -- Check if user is authenticated
  auth_user_id := auth.uid();
  IF auth_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required for getting user dashboard data';
  END IF;
  
  -- Get the active profile ID
  active_profile_id := public.get_active_profile_id();
  
  -- Check if active profile exists
  IF active_profile_id IS NULL THEN
    RAISE EXCEPTION 'No active profile found';
  END IF;

  RETURN QUERY
  SELECT
    (SELECT COUNT(*)::BIGINT FROM public.videos v WHERE v.profile_id = active_profile_id),
    (SELECT COALESCE(SUM(v.views_count), 0)::BIGINT FROM public.videos v WHERE v.profile_id = active_profile_id),
    (SELECT COALESCE(SUM(v.likes_count), 0)::BIGINT FROM public.videos v WHERE v.profile_id = active_profile_id),
    (SELECT COALESCE(SUM(v.comments_count), 0)::BIGINT FROM public.videos v WHERE v.profile_id = active_profile_id),
    (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', v.id,
          'title', v.title,
          'youtube_id', v.youtube_id,
          'views_count', v.views_count,
          'likes_count', v.likes_count,
          'comments_count', v.comments_count,
          'created_at', v.created_at
        )
      ), '[]'::json)
      FROM (
        SELECT * FROM public.videos v2
        WHERE v2.profile_id = active_profile_id
        ORDER BY created_at DESC
        LIMIT 30
      ) v
    );
END;
$$;



-- Create the corrected and improved function
-- The parameter is now named 'param_video_id' as requested.
CREATE OR REPLACE FUNCTION public.increment_video_view(param_video_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_client_ip TEXT;
  v_user_agent TEXT;
  v_active_profile_id UUID;
BEGIN
  -- Get client IP and user agent from request headers
  -- Use coalesce to handle cases where the header might not exist
  v_client_ip := coalesce(current_setting('request.headers', true)::json->>'x-forwarded-for', '0.0.0.0');
  v_user_agent := coalesce(current_setting('request.headers', true)::json->>'user-agent', 'unknown');
  
  -- Get the active profile ID if the user is authenticated
  IF auth.uid() IS NOT NULL THEN
    v_active_profile_id := public.get_active_profile_id();
  END IF;

  -- Case 1: Handle authenticated users
  IF v_active_profile_id IS NOT NULL THEN
    -- Attempt to insert a new view record for the profile and video.
    INSERT INTO public.views (profile_id, video_id, ip_address, user_agent)
    VALUES (
      v_active_profile_id,
      -- Qualify the parameter with the function name to avoid ambiguity
      increment_video_view.param_video_id,
      v_client_ip,
      v_user_agent
    )
    ON CONFLICT (profile_id, video_id) WHERE profile_id IS NOT NULL
    DO NOTHING;

    -- Update the count only if a new row was inserted.
    IF FOUND THEN
      UPDATE public.videos
      SET views_count = views_count + 1
      -- Qualify the parameter here as well for consistency
      WHERE id = increment_video_view.param_video_id;
    END IF;

  -- Case 2: Handle anonymous users (identified by IP address)
  ELSIF v_client_ip IS NOT NULL THEN
    -- Check if a view from this IP address for this video already exists in the last 6 hours.
    IF NOT EXISTS (
      SELECT 1 FROM public.views
      WHERE 
        -- FIX: This is the critical change to resolve ambiguity.
        -- We explicitly reference the table column and the function parameter.
        public.views.video_id = increment_video_view.param_video_id AND
        public.views.profile_id IS NULL AND -- Only check against other anonymous views
        public.views.ip_address = v_client_ip AND
        public.views.created_at > NOW() - INTERVAL '6 hours'
    ) THEN
      -- If no recent view exists, insert a new one.
      INSERT INTO public.views (profile_id, video_id, ip_address, user_agent)
      VALUES (NULL, increment_video_view.param_video_id, v_client_ip, v_user_agent);

      -- And then update the total view count for the video.
      UPDATE public.videos
      SET views_count = views_count + 1
      WHERE id = increment_video_view.param_video_id;
    END IF;
  END IF;
END;
$$;
