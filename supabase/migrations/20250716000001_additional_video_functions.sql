-- FilmNest Additional Video Functions
-- Created: 2025-07-16
-- Author: Marosdee Uma
-- Description: Additional RPC functions for video operations without requiring authentication

-- Create API function to get most viewed videos with pagination
CREATE OR REPLACE FUNCTION public.get_most_viewed_videos(
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result JSON;
  total_count INTEGER;
BEGIN
  -- Get total count for pagination metadata
  SELECT COUNT(*) INTO total_count FROM public.videos;
  
  -- Get paginated videos with all details
  WITH paginated_videos AS (
    SELECT
      v.id,
      v.title,
      v.description,
      v.youtube_id,
      v.category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      v.profile_id,
      p.username,
      p.avatar_url,
      v.duration_seconds,
      v.views_count,
      v.likes_count,
      v.comments_count,
      v.created_at,
      v.updated_at
    FROM
      public.videos v
    LEFT JOIN
      public.categories c ON v.category_id = c.id
    LEFT JOIN
      public.profiles p ON v.profile_id = p.id
    ORDER BY
      v.views_count DESC,
      v.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  )
  
  -- Construct JSON result with videos array and total count
  SELECT json_build_object(
    'videos', COALESCE(json_agg(paginated_videos), '[]'::json),
    'total_count', total_count
  ) INTO result
  FROM paginated_videos;
  
  -- Return empty array with count if no videos found
  IF result IS NULL THEN
    result := json_build_object('videos', '[]'::json, 'total_count', total_count);
  END IF;
  
  RETURN result;
END;
$$;

-- Create API function to get most liked videos
CREATE OR REPLACE FUNCTION public.get_most_liked_videos(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  youtube_id TEXT,
  category_id UUID,
  category_name TEXT,
  category_slug TEXT,
  profile_id UUID,
  username TEXT,
  avatar_url TEXT,
  duration_seconds INTEGER,
  views_count BIGINT,
  likes_count BIGINT,
  comments_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
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
    v.profile_id,
    p.username,
    p.avatar_url,
    v.duration_seconds,
    v.views_count,
    v.likes_count,
    v.comments_count,
    v.created_at,
    v.updated_at
  FROM
    public.videos v
  LEFT JOIN
    public.categories c ON v.category_id = c.id
  LEFT JOIN
    public.profiles p ON v.profile_id = p.id
  ORDER BY
    v.likes_count DESC,
    v.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Create API function to search videos (improved version of existing search_videos)
CREATE OR REPLACE FUNCTION public.search_videos_extended(
  search_query TEXT, 
  limit_count INTEGER DEFAULT 20,
  filter_category_slug TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  youtube_id TEXT,
  category_id UUID,
  category_name TEXT,
  category_slug TEXT,
  profile_id UUID,
  username TEXT,
  avatar_url TEXT,
  duration_seconds INTEGER,
  views_count BIGINT,
  likes_count BIGINT,
  comments_count BIGINT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
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
    v.profile_id,
    p.username,
    p.avatar_url,
    v.duration_seconds,
    v.views_count,
    v.likes_count,
    v.comments_count,
    v.created_at,
    v.updated_at
  FROM
    public.videos v
  LEFT JOIN
    public.categories c ON v.category_id = c.id
  LEFT JOIN
    public.profiles p ON v.profile_id = p.id
  WHERE
    (search_query IS NULL OR search_query = '' OR
     v.title ILIKE '%' || search_query || '%' OR
     v.description ILIKE '%' || search_query || '%' OR
     c.name ILIKE '%' || search_query || '%')
    AND
    (filter_category_slug IS NULL OR c.slug = filter_category_slug)
  ORDER BY
    CASE WHEN search_query IS NOT NULL AND search_query != '' THEN
      ts_rank(
        to_tsvector('simple', v.title || ' ' || COALESCE(v.description, '')),
        plainto_tsquery('simple', search_query)
      )
    ELSE 0 END DESC,
    v.views_count DESC,
    v.likes_count DESC,
    v.created_at DESC
  LIMIT limit_count;
END;
$$;

-- Create API function to get videos liked by a profile with pagination
CREATE OR REPLACE FUNCTION public.get_videos_liked_by_profile(
  liked_by_profile_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result JSON;
  total_count INTEGER;
BEGIN
  -- Get total count for pagination metadata
  SELECT COUNT(*) INTO total_count 
  FROM public.videos v
  JOIN public.likes l ON v.id = l.video_id
  WHERE l.profile_id = liked_by_profile_id;
  
  -- Check if user is authenticated when accessing their own liked videos
  IF auth.uid() IS NOT NULL AND liked_by_profile_id IN (
    SELECT profiles.id FROM public.profiles WHERE auth_id = auth.uid()
  ) THEN
    -- User is accessing their own liked videos
    WITH paginated_videos AS (
      SELECT
        v.id,
        v.title,
        v.description,
        v.youtube_id,
        v.category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        v.profile_id,
        p.username,
        p.avatar_url,
        v.duration_seconds,
        v.views_count,
        v.likes_count,
        v.comments_count,
        v.created_at,
        v.updated_at
      FROM
        public.videos v
      JOIN
        public.likes l ON v.id = l.video_id
      LEFT JOIN
        public.categories c ON v.category_id = c.id
      LEFT JOIN
        public.profiles p ON v.profile_id = p.id
      WHERE
        l.profile_id = liked_by_profile_id
      ORDER BY
        l.created_at DESC
      LIMIT p_limit
      OFFSET p_offset
    )
    
    -- Construct JSON result with videos array and total count
    SELECT json_build_object(
      'videos', COALESCE(json_agg(paginated_videos), '[]'::json),
      'total_count', total_count
    ) INTO result
    FROM paginated_videos;
  ELSE
    -- Public access to liked videos (for profiles that allow public viewing)
    WITH paginated_videos AS (
      SELECT
        v.id,
        v.title,
        v.description,
        v.youtube_id,
        v.category_id,
        c.name AS category_name,
        c.slug AS category_slug,
        v.profile_id,
        p.username,
        p.avatar_url,
        v.duration_seconds,
        v.views_count,
        v.likes_count,
        v.comments_count,
        v.created_at,
        v.updated_at
      FROM
        public.videos v
      JOIN
        public.likes l ON v.id = l.video_id
      LEFT JOIN
        public.categories c ON v.category_id = c.id
      LEFT JOIN
        public.profiles p ON v.profile_id = p.id
      WHERE
        l.profile_id = liked_by_profile_id
      ORDER BY
        l.created_at DESC
      LIMIT p_limit
      OFFSET p_offset
    )
    
    -- Construct JSON result with videos array and total count
    SELECT json_build_object(
      'videos', COALESCE(json_agg(paginated_videos), '[]'::json),
      'total_count', total_count
    ) INTO result
    FROM paginated_videos;
  END IF;
  
  -- Return empty array with count if no videos found
  IF result IS NULL THEN
    result := json_build_object('videos', '[]'::json, 'total_count', total_count);
  END IF;
  
  RETURN result;
END;
$$;


-- Create API function to get videos by user (profile) with pagination
CREATE OR REPLACE FUNCTION public.get_videos_by_profile(
  p_profile_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result JSON;
  total_count INTEGER;
BEGIN
  -- Get total count for pagination metadata
  SELECT COUNT(*) INTO total_count 
  FROM public.videos v
  WHERE v.profile_id = p_profile_id;
  
  -- Get paginated videos with all details
  WITH paginated_videos AS (
    SELECT
      v.id,
      v.title,
      v.description,
      v.youtube_id,
      v.category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      v.profile_id,
      p.username,
      p.avatar_url,
      v.duration_seconds,
      v.views_count,
      v.likes_count,
      v.comments_count,
      v.created_at,
      v.updated_at
    FROM
      public.videos v
    LEFT JOIN
      public.categories c ON v.category_id = c.id
    LEFT JOIN
      public.profiles p ON v.profile_id = p.id
    WHERE
      v.profile_id = p_profile_id
    ORDER BY
      v.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  )
  
  -- Construct JSON result with videos array and total count
  SELECT json_build_object(
    'videos', COALESCE(json_agg(paginated_videos), '[]'::json),
    'total_count', total_count
  ) INTO result
  FROM paginated_videos;
  
  -- Return empty array with count if no videos found
  IF result IS NULL THEN
    result := json_build_object('videos', '[]'::json, 'total_count', total_count);
  END IF;
  
  RETURN result;
END;
$$;

-- Create API function to get videos by category with pagination
CREATE OR REPLACE FUNCTION public.get_videos_by_category(
  p_category_id UUID,
  p_limit INTEGER DEFAULT 10,
  p_offset INTEGER DEFAULT 0
)
RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  result JSON;
  total_count INTEGER;
BEGIN
  -- Get total count for pagination metadata
  SELECT COUNT(*) INTO total_count 
  FROM public.videos v
  WHERE v.category_id = p_category_id;
  
  -- Get paginated videos with all details
  WITH paginated_videos AS (
    SELECT
      v.id,
      v.title,
      v.description,
      v.youtube_id,
      v.category_id,
      c.name AS category_name,
      c.slug AS category_slug,
      v.profile_id,
      p.username,
      p.avatar_url,
      v.duration_seconds,
      v.views_count,
      v.likes_count,
      v.comments_count,
      v.created_at,
      v.updated_at
    FROM
      public.videos v
    LEFT JOIN
      public.categories c ON v.category_id = c.id
    LEFT JOIN
      public.profiles p ON v.profile_id = p.id
    WHERE
      v.category_id = p_category_id
    ORDER BY
      v.created_at DESC
    LIMIT p_limit
    OFFSET p_offset
  )
  
  -- Construct JSON result with videos array and total count
  SELECT json_build_object(
    'videos', COALESCE(json_agg(paginated_videos), '[]'::json),
    'total_count', total_count
  ) INTO result
  FROM paginated_videos;
  
  -- Return empty array with count if no videos found
  IF result IS NULL THEN
    result := json_build_object('videos', '[]'::json, 'total_count', total_count);
  END IF;
  
  RETURN result;
END;
$$;

-- Grant execute permission to public (anonymous) users for all functions
GRANT EXECUTE ON FUNCTION public.get_most_viewed_videos(INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_most_viewed_videos(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_most_viewed_videos(INTEGER, INTEGER) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_most_liked_videos(INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_most_liked_videos(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_most_liked_videos(INTEGER) TO service_role;

GRANT EXECUTE ON FUNCTION public.search_videos_extended(TEXT, INTEGER, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.search_videos_extended(TEXT, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_videos_extended(TEXT, INTEGER, TEXT) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_videos_liked_by_profile(UUID, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_videos_liked_by_profile(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_videos_liked_by_profile(UUID, INTEGER, INTEGER) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_videos_by_profile(UUID, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_videos_by_profile(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_videos_by_profile(UUID, INTEGER, INTEGER) TO service_role;

GRANT EXECUTE ON FUNCTION public.get_videos_by_category(UUID, INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_videos_by_category(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_videos_by_category(UUID, INTEGER, INTEGER) TO service_role;
