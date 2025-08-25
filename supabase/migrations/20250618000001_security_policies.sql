-- ShopQueue Security Policies
-- Created: 2025-06-18
-- Author: Marosdee Uma
-- Description: Row Level Security (RLS) policies for ShopQueue application

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;


-- Helper function to get active profile ID for current user
CREATE OR REPLACE FUNCTION public.get_active_profile_id()
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  active_profile_id UUID;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get the active profile for the current user
  SELECT id INTO active_profile_id
  FROM public.profiles
  WHERE auth_id = auth.uid() AND is_active = TRUE
  LIMIT 1;
  
  RETURN active_profile_id;
END;
$$;

-- Create security definer functions for admin checks
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_active_profile_role() = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_active_profile_role() IN ('moderator', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES POLICIES
-- Anyone can view public profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Authenticated users can create profiles for themselves
CREATE POLICY "Authenticated users can create profiles"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = auth_id);

-- Users can update their own profiles
CREATE POLICY "Users can update their own profiles"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = auth_id)
  WITH CHECK (auth.uid() = auth_id);

-- CATEGORIES POLICIES
-- Categories are viewable by everyone
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

-- Only admins can create, update, or delete categories
CREATE POLICY "Only admins can create categories"
  ON public.categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update categories"
  ON public.categories FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete categories"
  ON public.categories FOR DELETE
  USING (is_admin());

-- VIDEOS POLICIES
-- Videos are viewable by everyone
CREATE POLICY "Videos are viewable by everyone"
  ON public.videos FOR SELECT
  USING (true);

-- Authenticated users can create videos
CREATE POLICY "Authenticated users can create videos"
  ON public.videos FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ));

-- Users can update their own videos
CREATE POLICY "Users can update their own videos"
  ON public.videos FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ));

-- Users can delete their own videos
CREATE POLICY "Users can delete their own videos"
  ON public.videos FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ));

-- Moderators and admins can update any video
CREATE POLICY "Moderators and admins can update any video"
  ON public.videos FOR UPDATE
  USING (is_moderator_or_admin())
  WITH CHECK (is_moderator_or_admin());

-- Moderators and admins can delete any video
CREATE POLICY "Moderators and admins can delete any video"
  ON public.videos FOR DELETE
  USING (is_moderator_or_admin());

-- LIKES POLICIES
-- Likes are viewable by everyone
CREATE POLICY "Likes are viewable by everyone"
  ON public.likes FOR SELECT
  USING (true);

-- Authenticated users can create likes for themselves
CREATE POLICY "Authenticated users can create likes"
  ON public.likes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ));

-- Users can delete their own likes
CREATE POLICY "Users can delete their own likes"
  ON public.likes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ));

-- COMMENTS POLICIES
-- Comments are viewable by everyone
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ));

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ));

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON public.comments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = profile_id AND is_active = true
  ));

-- Moderators and admins can delete any comment
CREATE POLICY "Moderators and admins can delete any comment"
  ON public.comments FOR DELETE
  USING (is_moderator_or_admin());

-- VIEWS POLICIES
-- Views are viewable by admins and the video owner
CREATE POLICY "Views are viewable by admins and video owner"
  ON public.views FOR SELECT
  USING (
    is_admin() OR 
    EXISTS (
      SELECT 1 FROM public.videos v
      JOIN public.profiles p ON v.profile_id = p.id
      WHERE v.id = video_id AND p.auth_id = auth.uid() AND p.is_active = true
    )
  );

-- Authenticated users can create views
CREATE POLICY "Authenticated users can create views"
  ON public.views FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND is_active = true
  ));

-- Anonymous users can create views (with null user_id)
CREATE POLICY "Anonymous users can create views"
  ON public.views FOR INSERT
  WITH CHECK (auth.uid() IS NULL);

-- Create a secure view for analytics that only admins can access
CREATE OR REPLACE VIEW public.video_analytics AS
SELECT
  v.id,
  v.title,
  v.youtube_id,
  v.views_count,
  v.likes_count,
  COUNT(DISTINCT c.id) AS comments_count,
  v.created_at,
  v.updated_at,
  p.username AS creator_username,
  p.id AS profile_id,
  p.auth_id
FROM
  public.videos v
LEFT JOIN
  public.comments c ON v.id = c.video_id
LEFT JOIN
  public.profiles p ON v.profile_id = p.id
GROUP BY
  v.id, p.username, p.id, p.auth_id;

-- Note: RLS policies cannot be applied directly to views
-- Access control for this view is handled through the underlying tables' policies
-- and through the is_admin() function in application code

-- Function to create profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a profile for the new user
  INSERT INTO public.profiles (
    id, 
    auth_id,
    username, 
    full_name, 
    avatar_url, 
    is_active
  ) VALUES (
    gen_random_uuid(), 
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)), 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), 
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    true
  );
  
  -- Log the event
  RAISE NOTICE 'Profile created for user: %', NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists to avoid errors on migration rerun
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to run after auth user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Profile roles policies
-- Profile roles are viewable by everyone
CREATE POLICY "Profile roles are viewable by everyone"
  ON public.profile_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can update profile roles"
  ON public.profile_roles FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Insert policy: authenticated users can create their own profile_roles only as 'user'; admins can create for anyone with any role
CREATE POLICY "Authenticated users can create their own profile_roles as user"
  ON public.profile_roles FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND (
      public.is_admin()
      OR (
        role = 'user'
        AND profile_id = public.get_active_profile_id()
      )
    )
  );
