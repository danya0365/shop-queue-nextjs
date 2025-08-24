-- FilmNest Get Recent Videos Function
-- Created: 2025-07-16
-- Author: Marosdee Uma
-- Description: RPC function to get most recent videos without requiring authentication

-- Create API function to get most recent videos with pagination
CREATE OR REPLACE FUNCTION public.get_recent_videos(
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

-- Grant execute permission to public (anonymous) users
GRANT EXECUTE ON FUNCTION public.get_recent_videos(INTEGER, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION public.get_recent_videos(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_recent_videos(INTEGER, INTEGER) TO service_role;
