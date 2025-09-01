-- Create function to get auth user statistics
CREATE OR REPLACE FUNCTION get_auth_user_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    total_users INTEGER;
    confirmed_users INTEGER;
    unconfirmed_users INTEGER;
    active_users_today INTEGER;
    new_users_this_month INTEGER;
    email_users INTEGER := 0;
    google_users INTEGER := 0;
    facebook_users INTEGER := 0;
    apple_users INTEGER := 0;
    phone_users INTEGER := 0;
    anonymous_users INTEGER := 0;
BEGIN
    -- Get total users
    SELECT COUNT(*) INTO total_users FROM auth.users;
    
    -- Get confirmed users (email confirmed)
    SELECT COUNT(*) INTO confirmed_users 
    FROM auth.users 
    WHERE email_confirmed_at IS NOT NULL;
    
    -- Get unconfirmed users
    unconfirmed_users := total_users - confirmed_users;
    
    -- Get active users today (signed in today)
    SELECT COUNT(*) INTO active_users_today 
    FROM auth.users 
    WHERE DATE(last_sign_in_at) = CURRENT_DATE;
    
    -- Get new users this month
    SELECT COUNT(*) INTO new_users_this_month 
    FROM auth.users 
    WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
    
    -- Get users by provider (fixed structure according to schema)
    SELECT COUNT(*) INTO email_users 
    FROM auth.users 
    WHERE COALESCE(raw_app_meta_data->>'provider', 'email') = 'email';
    
    SELECT COUNT(*) INTO google_users 
    FROM auth.users 
    WHERE raw_app_meta_data->>'provider' = 'google';
    
    SELECT COUNT(*) INTO facebook_users 
    FROM auth.users 
    WHERE raw_app_meta_data->>'provider' = 'facebook';
    
    SELECT COUNT(*) INTO apple_users 
    FROM auth.users 
    WHERE raw_app_meta_data->>'provider' = 'apple';
    
    SELECT COUNT(*) INTO phone_users 
    FROM auth.users 
    WHERE raw_app_meta_data->>'provider' = 'phone';
    
    SELECT COUNT(*) INTO anonymous_users 
    FROM auth.users 
    WHERE raw_app_meta_data->>'provider' = 'anonymous';
    
    -- Build result JSON with fixed structure
    result := json_build_object(
        'total_users', total_users,
        'confirmed_users', confirmed_users,
        'unconfirmed_users', unconfirmed_users,
        'active_users_today', active_users_today,
        'new_users_this_month', new_users_this_month,
        'users_by_provider', json_build_object(
            'email', email_users,
            'google', google_users,
            'facebook', facebook_users,
            'apple', apple_users,
            'phone', phone_users,
            'anonymous', anonymous_users
        )
    );
    
    RETURN result;
END;
$$;