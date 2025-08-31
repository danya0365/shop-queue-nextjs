-- FilmNest Seed Data - Users
-- Created: 2025-06-19
-- Author: Marosdee Uma
-- Description: Sample user data for testing FilmNest application

-- ตั้งค่ารหัสผ่านสำหรับผู้ใช้ทดสอบ
set session my.app_password = '12345678';

-- เพิ่มผู้ใช้ทดสอบใน auth.users
-- ใช้ฟังก์ชัน crypt และ gen_salt เพื่อเข้ารหัสรหัสผ่าน
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES 
    -- Admin user
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'admin@filmnest.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "admin",
          "full_name": "Admin User",
          "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
          "role": "admin",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    ),
    -- Moderator user
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'moderator@filmnest.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '25 days',
        NULL,
        NOW() - INTERVAL '2 days',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "moderator",
          "full_name": "Moderator User",
          "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=moderator",
          "role": "moderator",
          "is_active": true
        }',
        NOW() - INTERVAL '25 days',
        NOW() - INTERVAL '25 days',
        '',
        '',
        '',
        ''
    ),
    -- Regular user 1
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000003',
        'authenticated',
        'authenticated',
        'user1@filmnest.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '20 days',
        NULL,
        NOW() - INTERVAL '3 days',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "user1",
          "full_name": "Regular User 1",
          "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '20 days',
        NOW() - INTERVAL '20 days',
        '',
        '',
        '',
        ''
    ),
    -- Regular user 2
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000004',
        'authenticated',
        'authenticated',
        'user2@filmnest.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '15 days',
        NULL,
        NOW() - INTERVAL '4 days',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "user2",
          "full_name": "Regular User 2",
          "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '15 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for each user using subquery from auth.users
INSERT INTO
    auth.identities (
        id,
        user_id,
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
SELECT
    uuid_generate_v4(),
    id,
    id,
    format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
    'email',
    last_sign_in_at,
    created_at,
    updated_at
FROM
    auth.users
ON CONFLICT (provider_id, provider) DO NOTHING;

-- FilmNest Seed Data - Profiles
-- Created: 2025-06-19
-- Author: Marosdee Uma
-- Description: Sample profile data for testing FilmNest application with multiple profiles per user

-- Insert profiles for admin user (2 profiles)
INSERT INTO public.profiles (
  id,
  auth_id,
  username,
  full_name,
  avatar_url,
  is_active,
  created_at,
  updated_at
)
VALUES
  (
    '10000000-1000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'admin_personal',
    'Admin Personal Account',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=admin_personal',
    FALSE,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  
  -- Insert profiles for moderator user (2 profiles)
  (
    '10000000-1000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000002',
    'mod_personal',
    'Moderator Personal Account',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=mod_personal',
    FALSE,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  ),
  
  -- Insert profiles for regular user 1 (3 profiles)
  (
    '10000000-1000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000003',
    'user1_gaming',
    'User1 Gaming Channel',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user1_gaming',
    FALSE,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
  ),
  (
    '10000000-1000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000003',
    'user1_movies',
    'User1 Movie Reviews',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user1_movies',
    FALSE,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  
  -- Insert profiles for regular user 2 (2 profiles)
  (
    '10000000-1000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000004',
    'user2_tech',
    'User2 Tech Channel',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=user2_tech',
    FALSE,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Created at: 2025-06-21T10:15:00+07:00
-- Author: Marosdee Uma
-- Description: Seed initial profile_roles data for FilmNest application

-- Insert initial admin role for the first user's active profile
-- This assumes the first user in auth.users is the system admin
INSERT INTO public.profile_roles (profile_id, role, granted_by)
SELECT 
  p.id, 
  'admin'::public.profile_role, 
  p.auth_id
FROM 
  public.profiles p
  JOIN auth.users u ON p.auth_id = u.id
WHERE
  p.is_active = true
ORDER BY u.created_at
LIMIT 1
ON CONFLICT (profile_id) DO UPDATE
SET role = 'admin'::public.profile_role;

-- Execute the migration function
SELECT public.migrate_profile_roles();


-- Shop Queue Seed Data - Categories
-- Created: 2025-08-31
-- Author: Marosdee Uma
-- Description: Sample category data for testing Shop Queue application

-- Insert initial categories
INSERT INTO public.categories (name, slug, icon, color, description)
VALUES 
  ('ตัดผม', 'haircut', '✂️', '#3B82F6', 'ตัดผม'),
  ('ความงาม', 'beauty', '💄', '#EC4899', 'ความงาม'),
  ('ซ่อมมือถือ', 'repair', '📱', '#10B981', 'ซ่อมมือถือ'),
  ('ร้านอาหาร', 'restaurant', '🍽️', '#F59E0B', 'ร้านอาหาร'),
  ('สปา', 'spa', '🧘', '#8B5CF6', 'สปา'),
  ('ซักรีด', 'tailor', '👕', '#06B6D4', 'ซักรีด');