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
  'admin'::profile_role, 
  p.auth_id
FROM 
  public.profiles p
  JOIN auth.users u ON p.auth_id = u.id
WHERE
  p.is_active = true
ORDER BY u.created_at
LIMIT 1
ON CONFLICT (profile_id) DO UPDATE
SET role = 'admin'::profile_role;

-- Execute the migration function
SELECT public.migrate_profile_roles();


-- FilmNest Seed Data - Categories
-- Created: 2025-06-19
-- Author: Marosdee Uma
-- Description: Sample category data for testing FilmNest application

-- Insert initial categories
INSERT INTO public.categories (name, slug, description)
VALUES 
  ('สำหรับผู้ใหญ่', 'adult', 'สำหรับผู้ใหญ่'),
  ('การศึกษา', 'education', 'การศึกษา'),
  ('เกมส์', 'games', 'เกมส์ทุกประเภท'),
  ('สุขภาพ', 'health', 'สุขภาพทุกประเภท'),
  ('ประวัติศาสตร์', 'history', 'ประวัติศาสตร์ทุกประเภท'),
  ('สำหรับเด็ก', 'kids', 'สำหรับเด็ก'),
  ('สื่อ', 'media', 'สื่อทุกประเภท'),
  ('หนัง', 'movies', 'ภาพยนตร์ทุกประเภท'),
  ('เพลง', 'music', 'เพลงทุกประเภท'),
  ('ข่าว', 'news', 'ข่าวทุกประเภท'),
  ('วิทยุ', 'radio', 'รายการวิทยุ'),
  ('กีฬา', 'sports', 'กีฬาทุกประเภท'),
  ('นวัตกรรม', 'technology', 'นวัตกรรมทุกประเภท'),
  ('ซีรีส์', 'series', 'ซีรีส์ทั้งไทยและต่างประเทศ'),
  ('สารคดี', 'documentaries', 'สารคดีทุกประเภท'),
  ('แอนิเมชัน', 'animation', 'การ์ตูนและแอนิเมชัน'),
  ('รายการทีวี', 'tv-shows', 'รายการทีวีและวาไรตี้')

ON CONFLICT (slug) DO NOTHING;

-- FilmNest Seed Data - Adult Content Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample adult content video data for testing FilmNest application

-- สำหรับผู้ใหญ่ (Adult)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  '365 Days: This Day | Official Trailer',
  'Official Netflix trailer for 365 Days: This Day.',
  'pyM3z73oMAk',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  104,
  12000000,
  180000,
  3200,
  NOW() - INTERVAL '3 days'
),
(
  'The Next 365 Days | Official Trailer',
  'Lauren and Massimo return in this sequel trailer.',
  'iXdw5wYI4cY',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  110,
  9000000,
  140000,
  2900,
  NOW() - INTERVAL '7 days'
),
(
  '365 dni (365 Days) Trailer',
  'Trailer of the original 2020 erotic thriller film.',
  'CXjdcCFxpac',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  120,
  8000000,
  130000,
  2500,
  NOW() - INTERVAL '15 days'
),
(
  'Fifty Shades Darker - Extended Trailer (HD)',
  'Extended trailer for Fifty Shades Darker featuring deeper scenes.',
  'vnLqJLeTMVU',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  130,
  8500000,
  500000,
  4200,
  NOW() - INTERVAL '5 days'
),
(
  'Fifty Shades Darker Official Trailer',
  'The official trailer for Fifty Shades Darker.',
  '4g-a3DZ774I',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  145,
  12300000,
  750000,
  6200,
  NOW() - INTERVAL '12 days'
),
(
  'Fifty Shades Darker Official Trailer #1',
  'Dakota Johnson and Jamie Dornan return in Fifty Shades Darker.',
  'aV-_c21tFkc',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  9200000,
  430000,
  5100,
  NOW() - INTERVAL '18 days'
),
(
  'Fifty Shades Darker Official Trailer #3',
  'Third official trailer with intense dramatic scenes.',
  'aRrVHR5zuQg',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  138,
  6200000,
  320000,
  3800,
  NOW() - INTERVAL '22 days'
),
(
  'FIFTY SHADES DARKER Trailer (2017)',
  'Universal Pictures official trailer for the second movie.',
  'IhLb-v9hXx0',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  148,
  10100000,
  580000,
  4700,
  NOW() - INTERVAL '10 days'
),
(
  'Fifty Shades Darker Trailer #2',
  'A second trailer with compelling romance and drama.',
  'oQCyZKsT82M',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  142,
  7300000,
  400000,
  4300,
  NOW() - INTERVAL '8 days'
),
(
  '365 Days 4: Last Day - Trailer (2025)',
  'First teaser for 365 Days 4: Last Day.',
  '5CdxbXm79e8',
  (SELECT id FROM public.categories WHERE slug = 'adult' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  95,
  2300000,
  85000,
  1200,
  NOW() - INTERVAL '5 days'
);

-- FilmNest Seed Data - Education Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample education video data for testing FilmNest application

-- การศึกษา (Education)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'Educational Videos For Kids | Channel Trailer',
  'Channel trailer for Apple Toast Kids – เชื่อมโยงตาม CDC และ Common Core.',
  'DhLicHC8FlM',
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  60,
  1700,
  50,
  5,
  NOW() - INTERVAL '2 days'
),
(
  'An Education | Official Trailer',
  'ตัวอย่างภาพยนตร์ An Education (2009) เกี่ยวกับการศึกษาและการเติบโต.',
  'eRbp-dd1QvM',
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  135,
  150000,
  3000,
  120,
  NOW() - INTERVAL '7 days'
),
(
  'The RH Learning YouTube Channel Trailer',
  'Trailer ของ Redefined Horizons Learning – แนะนำช่องการศึกษา.',
  '1DdgTIdv594',
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  70,
  1700,
  100,
  10,
  NOW() - INTERVAL '5 days'
),
(
  'EDUCATION INC | Official Documentary Trailer',
  'สารคดีเจาะข้อมูลเชิงลึกเกี่ยวกับระบบการศึกษาที่อเมริกา.',
  'GysP3JWSbTU',
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  120000,
  2800,
  200,
  NOW() - INTERVAL '10 days'
),
(
  'On The Way To School | Official Trailer',
  'ตัวอย่างสารคดีเกี่ยวกับเด็กนักเรียนที่เดินทางไปโรงเรียน.',
  'rFNTHjxP9Dw',
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  95,
  2500,
  75,
  15,
  NOW() - INTERVAL '8 days'
),
(
  'Miseducation | Official Trailer | Netflix',
  'ตัวอย่างซีรีส์ Miseducation ใน Netflix เน้นเรื่องการศึกษา.',
  'orLONbdMAvU',
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  135,
  637000,
  9000,
  300,
  NOW() - INTERVAL '3 days'
),
(
  'Sex Education | Season 3 | Official Trailer | Netflix',
  'เทรลเลอร์ซีรีส์ Sex Education ซีซัน 3 จาก Netflix.',
  'zmgYlYw7Uwk',
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  140,
  2400000,
  45000,
  1500,
  NOW() - INTERVAL '12 days'
),
(
  'Crash Course Channel Trailer',
  'แนะนำช่อง Crash Course โดย John และ Hank Green.',
  'https://www.youtube.com/education', -- placeholder, actual channel URL
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  60,
  18000000,
  320000,
  9000,
  NOW() - INTERVAL '15 days'
),
(
  'BrainCraft Trailer',
  'ตัวอย่างชาแนล BrainCraft โดย Vanessa Hill – วิทยาศาสตร์สมองและจิตใจ.',
  'https://www.youtube.com/watch?v=IsGoogleKillingYourMemory', -- assume available
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  90,
  29000000,
  500000,
  12000,
  NOW() - INTERVAL '20 days'
),
(
  'AsapSCIENCE Trailers',
  'แนะนำช่อง AsapSCIENCE – วิทยาศาสตร์ง่ายๆ สไตล์แคนาดา.',
  'UCC552Sd-3nyi_tk2BudLUzA',
  (SELECT id FROM public.categories WHERE slug = 'education' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  80,
  1900000000,
  15000000,
  250000,
  NOW() - INTERVAL '25 days'
);

-- FilmNest Seed Data - Games Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample games video data for testing FilmNest application

-- เกมส์ (Games)
INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'Chronicles: Medieval – Official Announcement Trailer',
  'First trailer from Summer Game Fest 2025 showing epic medieval combat.',
  '219vW0b-1aY',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  120,
  800000,
  25000,
  1500,
  NOW() - INTERVAL '3 days'
),
(
  'The Blood of Dawnwalker – Official Gameplay Trailer',
  'Gameplay trailer from Xbox Games Showcase 2025 featuring intense action.',
  'GA4uyOGf4Xc',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  140,
  550000,
  18000,
  1200,
  NOW() - INTERVAL '5 days'
),
(
  'Ninja Gaiden 4 – Official Gameplay Trailer',
  'New gameplay trailer from Xbox Games Showcase 2025.',
  '-H_ulqfguc0',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  135,
  650000,
  21000,
  1400,
  NOW() - INTERVAL '4 days'
),
(
  'HIGH ON LIFE 2 – Official Trailer',
  'Sequel trailer featuring new traversal gameplay and talking weapons.',
  'UubdWIkj8Wc',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  125,
  400000,
  15000,
  900,
  NOW() - INTERVAL '7 days'
),
(
  'Invincible VS – Official Gameplay Trailer',
  '3v3 tag fighting game based on Amazon Prime series.',
  '6MstABFeCME',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  110,
  300000,
  12000,
  800,
  NOW() - INTERVAL '6 days'
),
(
  'NEW UPCOMING GAMES 2025 & 2026 (Trailer)',
  'Compilation of the most anticipated upcoming game trailers.',
  'JLCq6HHlqtE',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  950000,
  40000,
  2500,
  NOW() - INTERVAL '10 days'
),
(
  'Best Summer Game Fest 2025 Trailers',
  'Top trailers compiled from Summer Game Fest 2025.',
  'Otkv00syx0I',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  200,
  600000,
  28000,
  1900,
  NOW() - INTERVAL '12 days'
),
(
  'FUTURE GAMES SHOW 2025 All Game Trailers 4K',
  '4K compilation of future game trailers from show.',
  '8kRm6Odo-As',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  220,
  450000,
  17000,
  1350,
  NOW() - INTERVAL '15 days'
),
(
  'Official Announce Trailer – Xbox Games Showcase 2025',
  'Major announcements from Xbox, Bethesda, Activision, Blizzard.',
  'jwLb8KlfuW8',
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  210,
  900000,
  35000,
  2200,
  NOW() - INTERVAL '8 days'
),
(
  'GTA 6 – Trailer 2 (May 2025)',
  'Official trailer #2 for Grand Theft Auto VI released May 6, 2025.',
  'GTA6Trailer2ID', -- แทนที่ด้วยไอดีจริงจาก YouTube
  (SELECT id FROM public.categories WHERE slug = 'games' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  100000000,
  2000000,
  50000,
  NOW() - INTERVAL '20 days'
);

-- FilmNest Seed Data - Health Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample health video data for testing FilmNest application

-- สุขภาพ (Health)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  '10-Minute Morning Yoga for Beginners',
  'Start your day with this energizing yoga routine suitable for all levels.',
  'v7AYKMP6rOE',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  600,
  12000000,
  800000,
  15000,
  NOW() - INTERVAL '2 days'
),
(
  '5 Tips to Boost Your Immune System Naturally',
  'Learn how to strengthen your immune system with these simple tips.',
  'GFLZH2l4QOY',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  420,
  3500000,
  90000,
  2500,
  NOW() - INTERVAL '5 days'
),
(
  'Meditation for Anxiety & Stress',
  'Guided meditation to help reduce anxiety and stress.',
  'MIr3RsUWrdo',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  8000000,
  400000,
  7000,
  NOW() - INTERVAL '7 days'
),
(
  'Healthy Meal Prep for the Week',
  'Easy and nutritious meal prep ideas to keep you healthy all week.',
  '1oAO5e5_Y08',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  720,
  4500000,
  120000,
  3000,
  NOW() - INTERVAL '3 days'
),
(
  'Full Body Stretching Routine',
  'A complete stretching routine to increase flexibility and reduce pain.',
  '4BOTvaRaDjI',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  6000000,
  350000,
  5000,
  NOW() - INTERVAL '10 days'
),
(
  'How to Improve Sleep Quality Naturally',
  'Tips and habits for better sleep every night.',
  'nxzL8D6V2DE',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  540,
  2900000,
  75000,
  2200,
  NOW() - INTERVAL '12 days'
),
(
  'Beginner Workout at Home - No Equipment',
  'A beginner-friendly workout you can do at home without any equipment.',
  'UItWltVZZmE',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  14000000,
  950000,
  18000,
  NOW() - INTERVAL '15 days'
),
(
  'Understanding Mental Health',
  'An educational video about mental health awareness and tips.',
  't7CxshP5kNA',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  600,
  2300000,
  65000,
  1600,
  NOW() - INTERVAL '20 days'
),
(
  'Healthy Habits for a Better Life',
  'Simple daily habits to improve your overall health and wellbeing.',
  '9c06GE2b35o',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  720,
  3900000,
  85000,
  2100,
  NOW() - INTERVAL '25 days'
),
(
  'Yoga for Lower Back Pain Relief',
  'Gentle yoga poses to relieve lower back pain and improve posture.',
  'sTANio_2E0Q',
  (SELECT id FROM public.categories WHERE slug = 'health' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  5200000,
  280000,
  4000,
  NOW() - INTERVAL '30 days'
);

-- FilmNest Seed Data - History Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample history video data for testing FilmNest application

-- ประวัติศาสตร์ (History)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'World War II in Colour | Official Trailer',
  'A colorful retelling of World War II through restored footage.',
  'PXi3Mv6KMzY',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  120,
  4500000,
  150000,
  5000,
  NOW() - INTERVAL '3 days'
),
(
  'The Rise and Fall of the Roman Empire',
  'A detailed documentary about Rome’s history and legacy.',
  'jQusS7z51Vw',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  135,
  3200000,
  90000,
  3500,
  NOW() - INTERVAL '7 days'
),
(
  'Ancient Egypt: Secrets and Mysteries',
  'Exploring the mysteries of ancient Egyptian civilization.',
  'yNp_Bf3c6N0',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  110,
  2700000,
  80000,
  2800,
  NOW() - INTERVAL '10 days'
),
(
  'History of the Samurai',
  'A journey into the life and culture of the samurai warriors.',
  'H4rzzH63i7o',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  100,
  1900000,
  65000,
  2200,
  NOW() - INTERVAL '5 days'
),
(
  'The Cold War Explained',
  'An animated overview of the Cold War between the USA and USSR.',
  'vlm2rEyNx5o',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  130,
  2100000,
  72000,
  2500,
  NOW() - INTERVAL '12 days'
),
(
  'Medieval Europe: Life and Times',
  'Exploring life in medieval Europe during the Middle Ages.',
  'XRV0MrbxDgI',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  125,
  1700000,
  60000,
  2000,
  NOW() - INTERVAL '9 days'
),
(
  'The French Revolution: Crash Course History',
  'Crash Course episode covering the French Revolution events.',
  'jSwB0ro0MlA',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  115,
  3500000,
  110000,
  4000,
  NOW() - INTERVAL '15 days'
),
(
  'The History of China in 10 Minutes',
  'A concise overview of Chinese history through the centuries.',
  'DbQY0UGQKAY',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  600,
  4000000,
  125000,
  4500,
  NOW() - INTERVAL '20 days'
),
(
  'The Great Depression Documentary',
  'A look at the causes and effects of the Great Depression.',
  '47FyHZt5nMc',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  140,
  2800000,
  90000,
  3000,
  NOW() - INTERVAL '18 days'
),
(
  'Vikings Documentary: The True Story',
  'Discover the truth behind the Vikings legend.',
  '4eEMOEbBjjk',
  (SELECT id FROM public.categories WHERE slug = 'history' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  110,
  2200000,
  75000,
  2100,
  NOW() - INTERVAL '25 days'
);

-- FilmNest Seed Data - Kids Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample kids video data for testing FilmNest application

-- สำหรับเด็ก (Kids)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'Baby Shark Dance | Sing and Dance!',
  'The official Baby Shark song and dance video.',
  'XqZsoesa55w',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  120,
  1000000000,
  35000000,
  800000,
  NOW() - INTERVAL '1 days'
),
(
  'Peppa Pig Official Channel - Muddy Puddles',
  'Peppa Pig plays in muddy puddles with George and friends.',
  '5oXjSfmvZjw',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  250000000,
  12000000,
  300000,
  NOW() - INTERVAL '3 days'
),
(
  'Cocomelon Nursery Rhymes & Kids Songs',
  'Popular nursery rhymes and kids songs by Cocomelon.',
  'qXcMNBQnQMM',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  3500000000,
  250000000,
  1000000,
  NOW() - INTERVAL '2 days'
),
(
  'Blippi - Learn Colors & Numbers',
  'Blippi teaches colors and numbers to kids in a fun way.',
  'n8W7XbXm1v4',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  600,
  180000000,
  9000000,
  220000,
  NOW() - INTERVAL '5 days'
),
(
  'Pinkfong! Kids’ Songs & Stories',
  'Pinkfong brings fun songs and stories for kids.',
  'nZ8NYxMwz7k',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  720,
  500000000,
  21000000,
  450000,
  NOW() - INTERVAL '7 days'
),
(
  'Sesame Street - Elmo’s Song',
  'Elmo sings his catchy song on Sesame Street.',
  'jxhCeZlK6jE',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  160000000,
  8500000,
  210000,
  NOW() - INTERVAL '9 days'
),
(
  'Thomas & Friends - Steam Team',
  'Exciting adventures of Thomas and friends on the rails.',
  '3XvtiwW5cZs',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  480,
  120000000,
  6500000,
  140000,
  NOW() - INTERVAL '4 days'
),
(
  'ABC Song | Alphabet Song for Children',
  'Classic ABC song to help kids learn the alphabet.',
  '75p-N9YKqNo',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  300000000,
  15000000,
  500000,
  NOW() - INTERVAL '6 days'
),
(
  'The Wiggles - Fruit Salad Song',
  'Fun song about fruit salad by The Wiggles.',
  'aQvLLC3le2E',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  200,
  70000000,
  3200000,
  90000,
  NOW() - INTERVAL '11 days'
),
(
  'Disney Junior | Mickey Mouse Clubhouse',
  'Adventures of Mickey and friends for preschoolers.',
  'r4voAsS59ac',
  (SELECT id FROM public.categories WHERE slug = 'kids' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  85000000,
  5400000,
  120000,
  NOW() - INTERVAL '8 days'
);

-- FilmNest Seed Data - Media Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample media video data for testing FilmNest application

-- สื่อ (Media)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'Inside the Newsroom: How a Story is Made',
  'A behind-the-scenes look at how news stories are created.',
  'JSM2tEfqojM',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  600,
  450000,
  32000,
  1500,
  NOW() - INTERVAL '3 days'
),
(
  'The Power of Media: Documentary',
  'Exploring the influence of media on society and culture.',
  'wPiOjNWWN04',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1200,
  600000,
  45000,
  2000,
  NOW() - INTERVAL '10 days'
),
(
  'How Social Media Changed the World',
  'A documentary on the impact of social media platforms globally.',
  'ZX0uHWpR1qg',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  780000,
  56000,
  2200,
  NOW() - INTERVAL '7 days'
),
(
  'Media Literacy: What You Need to Know',
  'An educational video on understanding media messages and bias.',
  'DdL-LRrnD34',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  750,
  530000,
  41000,
  1800,
  NOW() - INTERVAL '5 days'
),
(
  'The Evolution of Television',
  'Tracing the history and technological changes in TV media.',
  'f6JZpDqUTcQ',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  800,
  320000,
  22000,
  1200,
  NOW() - INTERVAL '15 days'
),
(
  'Journalism Today: Challenges and Ethics',
  'Discussion on modern journalism, ethics, and responsibilities.',
  'PzVs5z2Z0TI',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  950,
  400000,
  30000,
  1400,
  NOW() - INTERVAL '12 days'
),
(
  'The Role of Media in Politics',
  'Analyzing media influence on political processes and opinions.',
  'E2P6pq3ROaY',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1100,
  470000,
  35000,
  1600,
  NOW() - INTERVAL '8 days'
),
(
  'Fake News and Media Manipulation',
  'How misinformation spreads and affects public perception.',
  'ZWp0Zn7lg4w',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1000,
  520000,
  38000,
  1700,
  NOW() - INTERVAL '6 days'
),
(
  'The Future of Media: Trends to Watch',
  'Exploring upcoming trends and technologies in media industry.',
  'jZmIYjsv_3A',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  850,
  290000,
  18000,
  900,
  NOW() - INTERVAL '20 days'
),
(
  'Broadcast Journalism: Inside the Studio',
  'A look into broadcast journalism and studio operations.',
  'MEUJYgZqjHE',
  (SELECT id FROM public.categories WHERE slug = 'media' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  700,
  350000,
  24000,
  1100,
  NOW() - INTERVAL '18 days'
);

-- FilmNest Seed Data - Movies Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample movies video data for testing FilmNest application

-- ภาพยนตร์ (Movies)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'Dune (2021) Official Trailer',
  'Official trailer for the sci-fi movie Dune (2021).',
  '8g18jFHCLXk',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  35000000,
  1200000,
  35000,
  NOW() - INTERVAL '10 days'
),
(
  'No Time To Die - Official Trailer',
  'Official trailer for James Bond film No Time To Die.',
  'BIhNsAtPbPI',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  160,
  40000000,
  1300000,
  40000,
  NOW() - INTERVAL '15 days'
),
(
  'Spider-Man: No Way Home Trailer',
  'Official trailer for Spider-Man: No Way Home.',
  'JfVOs4VSpmA',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  120000000,
  5500000,
  125000,
  NOW() - INTERVAL '20 days'
),
(
  'The Batman (2022) Official Trailer',
  'Official trailer for The Batman movie starring Robert Pattinson.',
  'mqqft2x_Aa4',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  170,
  55000000,
  2100000,
  60000,
  NOW() - INTERVAL '18 days'
),
(
  'Black Panther - Official Trailer',
  'Official trailer for Black Panther Marvel movie.',
  'xjDjIWPwcPU',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  155,
  65000000,
  2400000,
  75000,
  NOW() - INTERVAL '25 days'
),
(
  'Avengers: Endgame Trailer',
  'Official trailer for Avengers: Endgame.',
  'TcMBFSGVi1c',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  150000000,
  7000000,
  150000,
  NOW() - INTERVAL '30 days'
),
(
  'Joker (2019) Official Trailer',
  'Official trailer for Joker movie starring Joaquin Phoenix.',
  'zAGVQLHvwOY',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  140,
  90000000,
  3800000,
  95000,
  NOW() - INTERVAL '22 days'
),
(
  'Interstellar Official Trailer',
  'Official trailer for Interstellar directed by Christopher Nolan.',
  'zSWdZVtXT7E',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  165,
  65000000,
  2700000,
  65000,
  NOW() - INTERVAL '28 days'
),
(
  'Frozen II Official Trailer',
  'Official trailer for Disney s Frozen II.',
  'Zi4LMpSDccc',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  45000000,
  1500000,
  30000,
  NOW() - INTERVAL '8 days'
),
(
  'Inception Official Trailer',
  'Official trailer for Inception directed by Christopher Nolan.',
  'YoHD9XEInc0',
  (SELECT id FROM public.categories WHERE slug = 'movies' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  110000000,
  4800000,
  110000,
  NOW() - INTERVAL '35 days'
);

-- FilmNest Seed Data - Music Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample music video data for testing FilmNest application

-- เพลง (Music)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'Ed Sheeran - Shape of You [Official Video]',
  'Official music video for "Shape of You" by Ed Sheeran.',
  'JGwWNGJdvx8',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  240,
  5800000000,
  19000000,
  550000,
  NOW() - INTERVAL '60 days'
),
(
  'Billie Eilish - bad guy',
  'Official video for Billie Eilish’s hit song "bad guy".',
  'DyDfgMOUjCI',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  210,
  1300000000,
  12000000,
  360000,
  NOW() - INTERVAL '45 days'
),
(
  'The Weeknd - Blinding Lights (Official Video)',
  'Music video for "Blinding Lights" by The Weeknd.',
  '4NRXx6U8ABQ',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  200,
  2800000000,
  15000000,
  480000,
  NOW() - INTERVAL '50 days'
),
(
  'Taylor Swift - Shake It Off',
  'Official music video for Taylor Swift’s "Shake It Off".',
  'nfWlot6h_JM',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  220,
  3500000000,
  17000000,
  530000,
  NOW() - INTERVAL '55 days'
),
(
  'Adele - Hello',
  'Official music video for Adele’s "Hello".',
  'YQHsXMglC9A',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  300,
  2200000000,
  14000000,
  430000,
  NOW() - INTERVAL '70 days'
),
(
  'Maroon 5 - Sugar',
  'Official music video for "Sugar" by Maroon 5.',
  '09R8_2nJtjg',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  260,
  3400000000,
  16000000,
  600000,
  NOW() - INTERVAL '65 days'
),
(
  'Bruno Mars - Uptown Funk (Official Video) ft. Mark Ronson',
  'Official music video for "Uptown Funk".',
  'OPf0YbXqDm0',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  270,
  4300000000,
  21000000,
  700000,
  NOW() - INTERVAL '40 days'
),
(
  'Dua Lipa - Levitating (Official Music Video)',
  'Official video for Dua Lipa’s "Levitating".',
  'TUVcZfQe-Kw',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  205,
  1400000000,
  11000000,
  330000,
  NOW() - INTERVAL '35 days'
),
(
  'Shawn Mendes, Camila Cabello - Señorita',
  'Official music video for "Señorita" by Shawn Mendes and Camila Cabello.',
  'Pkh8UtuejGw',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  200,
  1900000000,
  13000000,
  370000,
  NOW() - INTERVAL '42 days'
),
(
  'Imagine Dragons - Believer',
  'Official music video for "Believer" by Imagine Dragons.',
  '7wtfhZwyrcc',
  (SELECT id FROM public.categories WHERE slug = 'music' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  230,
  2100000000,
  14000000,
  390000,
  NOW() - INTERVAL '48 days'
);

-- FilmNest Seed Data - News Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample news video data for testing FilmNest application

-- ข่าว (News)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'BBC News - Latest World News Headlines',
  'Catch up with the latest world news from BBC.',
  'T1YVrEqkSTI',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  1200000,
  45000,
  1500,
  NOW() - INTERVAL '1 days'
),
(
  'CNN Newsroom - Breaking News Coverage',
  'Breaking news and updates from CNN newsroom.',
  '3o8rKFrRi4g',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1200,
  1500000,
  60000,
  1800,
  NOW() - INTERVAL '2 days'
),
(
  'Al Jazeera English - News Highlights',
  'Daily news highlights from Al Jazeera English.',
  'NgkqcNU4-Zk',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  800,
  1100000,
  35000,
  1400,
  NOW() - INTERVAL '3 days'
),
(
  'Reuters - Global News Report',
  'Latest global news report by Reuters.',
  '8yFJv0i2yo4',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  950,
  1300000,
  40000,
  1600,
  NOW() - INTERVAL '5 days'
),
(
  'The Guardian - Today’s Top Stories',
  'Top news stories of the day from The Guardian.',
  'F7Tmh1nco7g',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1100,
  1400000,
  42000,
  1700,
  NOW() - INTERVAL '7 days'
),
(
  'ABC News Australia - Evening News',
  'Evening news update from ABC Australia.',
  'OnHx1nV8yc0',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  850,
  900000,
  30000,
  1200,
  NOW() - INTERVAL '4 days'
),
(
  'Sky News - Breaking Stories',
  'Breaking stories and updates from Sky News.',
  'XmDj4Hh3avw',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1000,
  1250000,
  37000,
  1400,
  NOW() - INTERVAL '6 days'
),
(
  'CBS News - News Tonight',
  'CBS nightly news and special reports.',
  'bM3S6kXsNVs',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  950,
  1150000,
  33000,
  1300,
  NOW() - INTERVAL '8 days'
),
(
  'France 24 English - World News',
  'World news coverage from France 24 English.',
  'y0pxnR7TppQ',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  980,
  1050000,
  31000,
  1200,
  NOW() - INTERVAL '9 days'
),
(
  'DW News - Daily Update',
  'Daily news updates from Deutsche Welle (DW).',
  'UZ-QWnP0gHY',
  (SELECT id FROM public.categories WHERE slug = 'news' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  1000000,
  28000,
  1100,
  NOW() - INTERVAL '11 days'
);

-- FilmNest Seed Data - Radio Shows Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample radio shows video data for testing FilmNest application

-- วิทยุ (Radio Shows)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'BBC Radio 1 Live Lounge - Best Performances',
  'Compilation of the best live performances from BBC Radio 1 Live Lounge.',
  'HJ3F_DZ4EFA',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1800,
  1500000,
  45000,
  2000,
  NOW() - INTERVAL '2 days'
),
(
  'NPR Tiny Desk Concerts - Official Playlist',
  'A collection of the best Tiny Desk concerts by NPR.',
  'DGf9IKlgczM',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  2400,
  2500000,
  75000,
  3500,
  NOW() - INTERVAL '5 days'
),
(
  'Radiohead - Live at Glastonbury 2017',
  'Full concert performance of Radiohead at Glastonbury Festival.',
  'qzQpxA4ZQxo',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  5400,
  900000,
  30000,
  1800,
  NOW() - INTERVAL '10 days'
),
(
  'KEXP Live Performances - Official Channel',
  'Various live sessions from the KEXP radio station.',
  'VPnPbVh-bKw',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  3600,
  1200000,
  42000,
  2100,
  NOW() - INTERVAL '7 days'
),
(
  'The Breakfast Club - Full Episodes',
  'Popular radio show "The Breakfast Club" full episodes playlist.',
  'phmHZhjCzQ4',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  2700,
  1800000,
  60000,
  3200,
  NOW() - INTERVAL '3 days'
),
(
  'BBC Radio 2 - Live Music Sessions',
  'Live music sessions and interviews on BBC Radio 2.',
  'X7px7WyHefw',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  2100,
  1100000,
  38000,
  1500,
  NOW() - INTERVAL '6 days'
),
(
  'Radio Nova Live - Best Jazz Sessions',
  'Jazz sessions broadcasted on Radio Nova.',
  'F4A9_ezTyV4',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  3300,
  800000,
  25000,
  1200,
  NOW() - INTERVAL '8 days'
),
(
  'Classic FM - Relaxing Classical Music',
  'Relaxing classical music played on Classic FM radio station.',
  'ewkxTZye17o',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  2700,
  950000,
  29000,
  1400,
  NOW() - INTERVAL '9 days'
),
(
  'Radio Disney Live Performances',
  'Live performances featured on Radio Disney.',
  'Uu4tOmX9rvk',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1800,
  1250000,
  40000,
  1600,
  NOW() - INTERVAL '4 days'
),
(
  'KROQ Almost Acoustic Christmas',
  'Annual acoustic concert series hosted by KROQ radio.',
  'PfQOglW7C1Q',
  (SELECT id FROM public.categories WHERE slug = 'radio' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  4800,
  700000,
  22000,
  1000,
  NOW() - INTERVAL '12 days'
);

-- FilmNest Seed Data - Sports Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample sports video data for testing FilmNest application

-- กีฬา (Sports)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'Top 10 Football Goals of All Time',
  'A compilation of the best football goals ever scored.',
  'LSaTqBXTPh8',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  600,
  2200000,
  50000,
  2500,
  NOW() - INTERVAL '4 days'
),
(
  'NBA Top 10 Plays of the Week',
  'Highlighting the best NBA plays from the week.',
  'k6ZvZeb3M1w',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  480,
  1800000,
  42000,
  1900,
  NOW() - INTERVAL '2 days'
),
(
  'Usain Bolt - 100m World Record',
  'Usain Bolt legendary 100m sprint world record.',
  'WRfTs-MZ8jw',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  300,
  3500000,
  78000,
  3000,
  NOW() - INTERVAL '7 days'
),
(
  'Serena Williams - Best Moments',
  'A highlight reel of Serena Williams greatest tennis moments.',
  'zjYk5E9Haxw',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  1500000,
  43000,
  1700,
  NOW() - INTERVAL '5 days'
),
(
  'FIFA World Cup 2018 Highlights',
  'Best moments from the 2018 FIFA World Cup.',
  '0ebRp2cT9MI',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1200,
  2800000,
  60000,
  3500,
  NOW() - INTERVAL '10 days'
),
(
  'Michael Jordan - Top 10 Plays',
  'Compilation of Michael Jordan best plays.',
  'Yq3zHL5I0h8',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  700,
  2100000,
  52000,
  2300,
  NOW() - INTERVAL '8 days'
),
(
  'Simone Biles - Best Gymnastics Routines',
  'Highlights of Simone Biles best performances.',
  'GHm60oCJnxA',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  800,
  1300000,
  38000,
  1600,
  NOW() - INTERVAL '3 days'
),
(
  'Cristiano Ronaldo - Skills and Goals',
  'Amazing skills and goals by Cristiano Ronaldo.',
  '1R3e-6pVzGM',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  650,
  4000000,
  90000,
  4000,
  NOW() - INTERVAL '6 days'
),
(
  'Olympic Highlights Tokyo 2020',
  'Best highlights from the Tokyo 2020 Olympics.',
  '2yvz0XGv0WY',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1300,
  1900000,
  45000,
  2100,
  NOW() - INTERVAL '9 days'
),
(
  'Lionel Messi - Top 10 Goals',
  'Top 10 goals by Lionel Messi in his career.',
  '4QbmbJS3tjc',
  (SELECT id FROM public.categories WHERE slug = 'sports' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  600,
  3100000,
  75000,
  2900,
  NOW() - INTERVAL '11 days'
);

-- FilmNest Seed Data - Technology Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample technology video data for testing FilmNest application

-- เทคโนโลยี (Technology)

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'Top 10 Innovative Technologies in 2024',
  'An overview of the most innovative technologies emerging in 2024.',
  'tPnFSFQJHEk',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  720000,
  25000,
  1200,
  NOW() - INTERVAL '3 days'
),
(
  'How AI is Changing the World',
  'Exploring how artificial intelligence is transforming industries.',
  '3jqBtUUKOaY',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1100,
  950000,
  32000,
  1400,
  NOW() - INTERVAL '5 days'
),
(
  'The Future of Renewable Energy',
  'technologys in renewable energy technologies.',
  '8Cn9tgG77wA',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  850,
  680000,
  21000,
  900,
  NOW() - INTERVAL '7 days'
),
(
  'Breakthroughs in Medical Technology',
  'Recent breakthroughs revolutionizing healthcare.',
  'QMGHjvL1rCk',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  1000,
  790000,
  27000,
  1100,
  NOW() - INTERVAL '4 days'
),
(
  'Innovative Startups Changing the World',
  'Showcasing startups with groundbreaking technologys.',
  'LtLnFm9UbN8',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  920,
  840000,
  29000,
  1300,
  NOW() - INTERVAL '6 days'
),
(
  '3D Printing Revolution',
  'How 3D printing is transforming manufacturing and design.',
  'u8msV7uyN4Y',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  780,
  610000,
  19000,
  850,
  NOW() - INTERVAL '8 days'
),
(
  'Smart Cities: The Next Big Thing',
  'technologys behind the development of smart cities.',
  'x5bYsyJv8XE',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  730000,
  22000,
  1000,
  NOW() - INTERVAL '9 days'
),
(
  'The Rise of Electric Vehicles',
  'Advancements and technologys in electric vehicles industry.',
  'n0RXl8g6C3Q',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  870,
  890000,
  26000,
  1200,
  NOW() - INTERVAL '10 days'
),
(
  'Space Exploration technologys',
  'Cutting-edge technologies driving space exploration.',
  'Hp94JRaJPHk',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  940,
  810000,
  28000,
  1350,
  NOW() - INTERVAL '12 days'
),
(
  'Future of Robotics and Automation',
  'technologys shaping the future of robotics and automation.',
  '8AvtkLkx4qI',
  (SELECT id FROM public.categories WHERE slug = 'technology' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  880,
  760000,
  23000,
  1150,
  NOW() - INTERVAL '14 days'
);

-- FilmNest Seed Data - Series Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample series video data for testing FilmNest application 

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'REVIVAL – Official Trailer (2025) SYFY',
  'A small Wisconsin town experiences a mysterious resurrection in this thriller series.',
  'JG07w2bPhV4',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  500000,
  23000,
  1200,
  NOW() - INTERVAL '5 days'
),
(
  'IT: Welcome to Derry – Official Series Trailer',
  'New horror series set in the world of Stephen King’s IT.',
  'TVFip9YXefk',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  145,
  800000,
  45000,
  2000,
  NOW() - INTERVAL '7 days'
),
(
  'The Sandman: Season 2 | Official Trailer | Netflix',
  'Epic final season of Netflix’s Sandman is on the way.',
  'Er18gmgqy2k',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  165,
  1500000,
  90000,
  4500,
  NOW() - INTERVAL '4 days'
),
(
  'TASK Official Trailer (2025) Mark Ruffalo Series',
  'Mark Ruffalo stars in this new high-stakes series.',
  'Er3kmwGenP8',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  160,
  600000,
  28000,
  1400,
  NOW() - INTERVAL '10 days'
),
(
  'Government Cheese — Official Trailer | Apple TV+',
  'A biting new series on society and power on Apple TV+.',
  '7fQf2o2kEMQ',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  155,
  550000,
  26000,
  1300,
  NOW() - INTERVAL '30 days'
),
(
  'Countdown - Official Trailer | Prime Video',
  'New original series launching June 25 on Prime Video.',
  't72R6wZ0zQ8',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  135,
  700000,
  32000,
  1800,
  NOW() - INTERVAL '21 days'
),
(
  'The Four Seasons | Official Trailer | Netflix',
  'A new compelling drama series coming soon to Netflix.',
  'WKTwtIL4xyk',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  140,
  650000,
  35000,
  1900,
  NOW() - INTERVAL '60 days'
),
(
  'WEDNESDAY Season 2 Official Teaser Trailer (2025) Netflix',
  'First teaser for the much-anticipated Season 2 of Wednesday.',
  'ooSg4nSfYUo',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  105,
  1000000,
  50000,
  2200,
  NOW() - INTERVAL '2 days'
),
(
  'The Last of Us Season 2 | Official Trailer | Max',
  'HBO’s The Last of Us returns with a powerful second season.',
  '_zHPsmXCjB0',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  170,
  2000000,
  85000,
  3800,
  NOW() - INTERVAL '90 days'
),
(
  'Andor Season 2 Trailer | Disney+',
  'Official teaser trailer for Star Wars: Andor season 2.',
  'yURRVZyssyk',
  (SELECT id FROM public.categories WHERE slug = 'series' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  160,
  1200000,
  48000,
  2100,
  NOW() - INTERVAL '100 days'
);

-- FilmNest Seed Data - Documentaries Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample documentaries video data for testing FilmNest application

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'BECOMING LED ZEPPELIN | Full Length Trailer (2025)',
  'Official documentary trailer on the iconic rock band.',
  'EDKC77QS8WM',
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  1200000,
  35000,
  1500,
  NOW() - INTERVAL '3 days'
),
(
  'Springsteen: Deliver Me From Nowhere | Official Trailer',
  'Bruce Springsteen documentary exploring his impact.',
  'oQXdM3J33No',
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  165,
  900000,
  28000,
  1200,
  NOW() - INTERVAL '5 days'
),
(
  'The Carters: Hurts to Love You | Trailer',
  'Trailer for the documentary about Nick & Aaron Carter family.',
  'XXXXXabc123', -- แทรก YouTube ID จริงเมื่อมี
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  750000,
  24000,
  1100,
  NOW() - INTERVAL '10 days'
),
(
  'Last Take: Rust and the Story of Halyna | Trailer',
  'Emotional trailer revisiting Halyna Hutchins last moments.',
  'XXXXXdef456', -- แทรก YouTube ID จริงเมื่อมี
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  155,
  600000,
  20000,
  900,
  NOW() - INTERVAL '7 days'
),
(
  'Titan: The OceanGate Disaster | Trailer',
  'Recounting the Titan submersible tragedy.',
  'XXXXXghi789', -- แทรก ID จริง
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  170,
  1100000,
  30000,
  1600,
  NOW() - INTERVAL '4 days'
),
(
  'Louis Theroux: The Settlers | Trailer',
  'Louis Theroux explores Israeli settlers in West Bank.',
  'XXXXXjkl012',
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  160,
  500000,
  18000,
  800,
  NOW() - INTERVAL '12 days'
),
(
  'We Are Storror | Trailer',
  'Michael Bay’s parkour documentary teaser.',
  'XXXXXmno345',
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  130,
  450000,
  16000,
  700,
  NOW() - INTERVAL '9 days'
),
(
  'Avicii – I’m Tim | Documentary Teaser',
  'Preview of the Avicii documentary.',
  'XXXXXpqr678',
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  140,
  400000,
  15000,
  650,
  NOW() - INTERVAL '15 days'
),
(
  'Marlee Matlin: Not Alone Anymore | Trailer',
  'Story of the Deaf actress Marlee Matlin.',
  'XXXXXstu901',
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  145,
  380000,
  14000,
  600,
  NOW() - INTERVAL '18 days'
),
(
  'Pangolin: Kulus Journey | Trailer',
  'Environmental documentary on pangolin rescue.',
  'XXXXXvwx234',
  (SELECT id FROM public.categories WHERE slug = 'documentary' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  350000,
  13000,
  550,
  NOW() - INTERVAL '20 days'
);

-- FilmNest Seed Data - Animation Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample animation video data for testing FilmNest application

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  'FLOW – Official Trailer',
  'Trailer for Oscar-shortlisted stop-motion animation short film FLOW.',
  '82WW9dVbglI',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  249,
  14000000,
  120000,
  3500,
  NOW() - INTERVAL '3 days'
),
(
  'FLOW – US Trailer',
  'US version of the official trailer for FLOW.',
  'ZgZccxuj2RY',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  249,
  8000000,
  70000,
  2100,
  NOW() - INTERVAL '5 days'
),
(
  'Win or Lose – Pixar Series Trailer',
  'Official trailer for Pixar’s animated series Win or Lose on Disney+.',
  'AhxGObicnPs',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  142,
  1000000,
  50000,
  2200,
  NOW() - INTERVAL '7 days'
),
(
  'The Bad Guys 2 – Official Trailer',
  'Trailer for the upcoming animated movie The Bad Guys 2.',
  'TY1lWh20VSw',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  148,
  15000000,
  110000,
  5000,
  NOW() - INTERVAL '10 days'
),
(
  'Elio – Official Trailer',
  'Disney & Pixar’s trailer for the animated feature film Elio.',
  'ETVi5_cnnaE',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  132,
  12000000,
  90000,
  4000,
  NOW() - INTERVAL '4 days'
),
(
  'Memoir of a Snail – Official Trailer',
  'Trailer for the award‑nominated animated short Memoir of a Snail.',
  'Ehc8cc7g31I',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  490,
  1200000,
  60000,
  1800,
  NOW() - INTERVAL '12 days'
),
(
  'In The Shadow of The Cypress – Oscar-Winning Short',
  'Award-winning animated short film “In The Shadow of The Cypress”.',
  '3DcXqPLLDd0',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  800,
  1000000,
  40000,
  1500,
  NOW() - INTERVAL '14 days'
),
(
  'The Wild Robot – Official Trailer',
  'DreamWorks animated feature The Wild Robot trailer.',
  '67vbA5ZJdKQ',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  130,
  9000000,
  85000,
  3400,
  NOW() - INTERVAL '8 days'
),
(
  'Marathon – CGI Cinematic Short',
  'Reveal trailer for CGI short “Marathon”.',
  'fvbEnWLRo1s',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  1500000,
  50000,
  2000,
  NOW() - INTERVAL '11 days'
),
(
  'Snow Bear – Short Film Trailer',
  'Trailer for Aaron Blaise’s hand‑drawn short film Snow Bear.',
  'lv4wugFeKSc',
  (SELECT id FROM public.categories WHERE slug = 'animation' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  400000,
  20000,
  900,
  NOW() - INTERVAL '6 days'
);

-- FilmNest Seed Data - TV Shows Videos
-- Created: 2025-06-22
-- Author: Marosdee Uma
-- Description: Sample tv-shows video data for testing FilmNest application

INSERT INTO public.videos (
  title,
  description,
  youtube_id,
  category_id,
  profile_id,
  duration_seconds,
  views_count,
  likes_count,
  comments_count,
  created_at
)
VALUES
(
  '[OFFICIAL TRAILER] เพื่อนผมมีมรดกเป็นโฮมสเตย์ครับ',
  'ตัวอย่างรายการ เพื่อนผมมีมรดกเป็นโฮมสเตย์ครับ ทางช่อง 9 MCOT HD',
  'aY6FbUFnYCw',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  120,
  80000,
  5000,
  320,
  NOW() - INTERVAL '12 days'
),
(
  '[LIVE CLIP] โหนกระแส เกี่ยวสายไฟทำเสาล้ม',
  'ไฮไลต์รายการโหนกระแส เกี่ยวสายไฟทำเสาล้ม',
  'YawsX9IV948',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  720,
  50000,
  2200,
  210,
  NOW() - INTERVAL '15 days'
),
(
  'ตัวอย่างเต็ม ช.พ.๑ สมรภูมิคืนชีพ',
  'Official trailer ช.พ.๑ สมรภูมิคืนชีพ',
  'V7Hhnb0QQU4',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  150,
  120000,
  8000,
  600,
  NOW() - INTERVAL '20 days'
),
(
  '[OFFICIAL TRAILER] คุณชายน์ (The Cliche)',
  'ตัวอย่างละคร The Cliche ทางช่อง 4',
  'M-LR-MewZWM',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  140,
  90000,
  6000,
  450,
  NOW() - INTERVAL '9 days'
),
(
  '[OFFICIAL TRAILER] TAKLEE GENESIS ตาคลีเจเนซิส',
  'teaser trailer TAKLEE GENESIS ทางช่อง PPTV',
  'GV91Tm3PxDk',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  130,
  70000,
  4800,
  380,
  NOW() - INTERVAL '14 days'
),
(
  '[SHORT CLIP] เซียนหรั่ง เฮ็ดอย่างเซียนหรั่ง',
  'คลิปสั้นจากรายการ เซียนหรั่ง – One31',
  'dKXpovbDRmo',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  180,
  60000,
  3200,
  290,
  NOW() - INTERVAL '5 days'
),
(
  '[CLIP] โหนกระแส ฮุนเซนเร็กคอร์ด ทำวุ่น',
  'ไฮไลต์รายการโหนกระแส ตอน ฮุนเซนเร็กคอร์ด',
  'CIrHfueWn8c',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  900,
  670000,
  25000,
  1800,
  NOW() - INTERVAL '2 days'
),
(
  '[OFFICIAL TRAILER] ภารกิจรัก',
  'Teaser รายการซีรีส์ ภารกิจรัก ทางช่องสารคดี ThaiPBS',
  'O-SEZ1DhleQ',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  130,
  55000,
  4200,
  300,
  NOW() - INTERVAL '8 days'
),
(
  '[HIGHLIGHT] THE iCON ตอน ตามล่าเทวดา',
  'คลิป highlight จากโหนกระแส ตอน ตามล่าเทวดา',
  'zOHCnaLsqVc',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  600,
  36000,
  2400,
  200,
  NOW() - INTERVAL '18 days'
),
(
  '[OFFICIAL TRAILER] Jet Lag เจ๊ทแหลก',
  'ตัวอย่างรายการ Jet Lag เจ๊ทแหลก ทาง one31',
  'JQpKCM3y3-Q',
  (SELECT id FROM public.categories WHERE slug = 'tv-shows' LIMIT 1),
  (SELECT id FROM public.profiles ORDER BY RANDOM() LIMIT 1),
  110,
  45000,
  2500,
  200,
  NOW() - INTERVAL '6 days'
);
