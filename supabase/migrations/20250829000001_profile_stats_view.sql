
-- Create profile stats view
CREATE OR REPLACE VIEW public.profile_stats_view AS
WITH 
-- Base counts
base_stats AS (
  SELECT
    COUNT(*) as total_profiles,
    COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_profiles,
    COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_verification
  FROM public.profiles
),

-- Active profiles today (logged in today)
active_today AS (
  SELECT
    COUNT(*) as active_profiles_today
  FROM public.profiles
  WHERE last_login >= CURRENT_DATE
    AND is_active = TRUE
),

-- New profiles this month
new_this_month AS (
  SELECT
    COUNT(*) as new_profiles_this_month
  FROM public.profiles
  WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
),

-- Gender distribution
gender_stats AS (
  SELECT
    COUNT(CASE WHEN gender = 'male' THEN 1 END) as male,
    COUNT(CASE WHEN gender = 'female' THEN 1 END) as female,
    COUNT(CASE WHEN gender = 'other' THEN 1 END) as other,
    COUNT(CASE WHEN gender IS NULL OR gender = '' THEN 1 END) as not_specified
  FROM public.profiles
)

SELECT
  bs.total_profiles,
  bs.verified_profiles,
  bs.pending_verification,
  at.active_profiles_today,
  ntm.new_profiles_this_month,
  jsonb_build_object(
    'male', gs.male,
    'female', gs.female,
    'other', gs.other,
    'not_specified', gs.not_specified
  ) as profiles_by_gender
FROM base_stats bs
CROSS JOIN active_today at
CROSS JOIN new_this_month ntm
CROSS JOIN gender_stats gs;