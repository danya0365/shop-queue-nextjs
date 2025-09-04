-- Shop Queue Seed Data - Users
-- Created: 2025-06-19
-- Author: Marosdee Uma
-- Description: Sample user data for testing Shop Queue application

-- Set app password for testing
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
        'admin@shopqueue.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "admin",
          "full_name": "Admin User",
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
    -- Regular user 1
    (
        '00000000-0000-0000-0000-000000000000',
        '00000000-0000-0000-0000-000000000003',
        'authenticated',
        'authenticated',
        'user1@shopqueue.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '20 days',
        NULL,
        NOW() - INTERVAL '3 days',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "user1",
          "full_name": "Regular User 1",
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
        'user2@shopqueue.com',
        crypt (current_setting('my.app_password'), gen_salt ('bf')),
        NOW() - INTERVAL '15 days',
        NULL,
        NOW() - INTERVAL '4 days',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "user2",
          "full_name": "Regular User 2",
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

--  ShopQueue Seed Data - Profiles
-- Created: 2025-06-19
-- Author: Marosdee Uma
-- Description: Sample profile data for testing ShopQueue application with multiple profiles per user

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
    '',
    FALSE,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
  ),
  
  -- Insert profiles for regular user 1 (3 profiles)
  (
    '10000000-1000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000003',
    'user1_gaming',
    'User1 Gaming Channel',
    '',
    FALSE,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
  ),
  (
    '10000000-1000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000003',
    'user1_movies',
    'User1 Movie Reviews',
    '',
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
    '',
    FALSE,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  )
ON CONFLICT (id) DO NOTHING;

-- Created at: 2025-06-21T10:15:00+07:00
-- Author: Marosdee Uma
-- Description: Seed initial profile_roles data for ShopQueue application

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


-- Insert categories
INSERT INTO public.categories (name, slug, icon, color, description, is_active, sort_order)
VALUES 
  ('ตัดผม', 'haircut', '✂️', '#3B82F6', 'บริการตัดผมและทำผม', true, 1),
  ('ความงาม', 'beauty', '💄', '#EC4899', 'บริการด้านความงาม', true, 2),
  ('ซ่อมมือถือ', 'repair', '📱', '#10B981', 'บริการซ่อมมือถือและอุปกรณ์อิเล็กทรอนิกส์', true, 3),
  ('ร้านอาหาร', 'restaurant', '🍽️', '#F59E0B', 'บริการอาหารและเครื่องดื่ม', true, 4),
  ('สปา', 'spa', '🧘', '#8B5CF6', 'บริการสปาและนวด', true, 5),
  ('ซักรีด', 'tailor', '👕', '#06B6D4', 'บริการซักรีดและตัดเย็บ', true, 6)
ON CONFLICT (slug) DO NOTHING;


-- Insert username: haircut_owner for shop owner
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
    -- Shop owner user
    (
        '90000000-0000-0000-0000-000000000000',
        '90000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'haircut_owner@example.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "haircut_owner",
          "full_name": "Shop Owner 1",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'haircut_owner@example.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: somchai for shop employee

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
    -- Shop owner user
    (
        '90000000-0000-0000-0000-000000000000',
        '90000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'somchai@stylehair.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "somchai",
          "full_name": "นายสมชาย ใจดี",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'somchai@stylehair.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: somsri for shop employee

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
    -- Shop owner user
    (
        '90000000-0000-0000-0000-000000000000',
        '90000000-0000-0000-0000-000000000003',
        'authenticated',
        'authenticated',
        'somsri@stylehair.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "somsri",
          "full_name": "สมศรี มีสุข",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'somsri@stylehair.com'
ON CONFLICT (provider_id, provider) DO NOTHING;


-- Insert a single shop
INSERT INTO shops (
  owner_id,
  name,
  slug,
  description,
  address,
  phone,
  email,
  website,
  logo,
  qr_code_url,
  timezone,
  currency,
  language,
  status,
  created_at,
  updated_at
)
SELECT
  p.id AS owner_id,
  'ร้านตัดผมสไตล์',
  'stylehair',
  'ร้านตัดผมชาย-หญิง บริการครบครัน',
  '123 ถนนสุขุมวิท แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
  '02-123-4567',
  'contact@stylehair.com',
  'https://stylehair.com',
  'https://example.com/logo.png',
  'https://example.com/qr.png',
  'Asia/Bangkok',
  'THB',
  'th',
  'active',
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM profiles p
WHERE p.username = 'haircut_owner'
LIMIT 1;

-- Link shop to categories
INSERT INTO category_shops (category_id, shop_id, created_at, updated_at)
SELECT 
  c.id AS category_id,
  s.id AS shop_id,
  NOW(),
  NOW()
FROM categories c
CROSS JOIN shops s
JOIN profiles p ON s.owner_id = p.id
WHERE c.slug = 'haircut'
AND p.username = 'haircut_owner';

-- Insert shop opening hours
INSERT INTO shop_opening_hours (shop_id, day_of_week, is_open, open_time, close_time, break_start, break_end, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  day_info.day_of_week,
  day_info.is_open,
  day_info.open_time,
  day_info.close_time,
  day_info.break_start,
  day_info.break_end,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('monday'::text, true, '09:00:00'::time, '18:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('tuesday'::text, true, '09:00:00'::time, '18:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('wednesday'::text, true, '09:00:00'::time, '18:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('thursday'::text, true, '09:00:00'::time, '18:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('friday'::text, true, '09:00:00'::time, '18:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('saturday'::text, true, '10:00:00'::time, '17:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('sunday'::text, false, NULL, NULL, NULL, NULL)
) AS day_info(day_of_week, is_open, open_time, close_time, break_start, break_end)
WHERE p.username = 'haircut_owner';

-- Insert services for the shop
INSERT INTO services (shop_id, name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  service_info.name,
  service_info.slug,
  service_info.description,
  service_info.price,
  service_info.estimated_duration,
  service_info.category,
  service_info.is_available,
  service_info.icon,
  service_info.popularity_rank,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('ตัดผมชาย'::text, 'haircut_men'::text, 'บริการตัดผมสำหรับสุภาพบุรุษ'::text, 200.00::numeric, 30::integer, 'haircut'::text, true::boolean, '✂️'::text, 1::integer),
    ('ตัดผมหญิง'::text, 'haircut_women'::text, 'บริการตัดผมสำหรับสุภาพสตรี'::text, 300.00::numeric, 45::integer, 'haircut'::text, true::boolean, '✂️'::text, 2::integer),
    ('สระไดร์'::text, 'wash_and_dry'::text, 'บริการสระผมและเป่าแห้ง'::text, 150.00::numeric, 20::integer, 'wash_and_dry'::text, true::boolean, '💧'::text, 3::integer),
    ('ทำสีผม'::text, 'coloring'::text, 'บริการทำสีผม'::text, 1500.00::numeric, 120::integer, 'coloring'::text, true::boolean, '🎨'::text, 4::integer),
    ('ดัดผม'::text, 'styling'::text, 'บริการดัดผม'::text, 1200.00::numeric, 90::integer, 'styling'::text, true::boolean, '🌀'::text, 5::integer)
) AS service_info(name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank)
WHERE p.username = 'haircut_owner';

-- Insert departments
INSERT INTO departments (shop_id, name, slug, description, employee_count, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  dept_info.name,
  dept_info.slug,
  dept_info.description,
  dept_info.employee_count,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('ตัดผม'::text, 'haircut'::text, 'แผนกตัดผม'::text, 3::integer),
    ('ทำสีผม'::text, 'coloring'::text, 'แผนกทำสีผม'::text, 2::integer),
    ('ต้อนรับ'::text, 'welcome'::text, 'แผนกต้อนรับ'::text, 1::integer)
) AS dept_info(name, slug, description, employee_count)
WHERE p.username = 'haircut_owner';

-- Insert employees
INSERT INTO employees (
  shop_id,
  profile_id,
  employee_code,
  name,
  email,
  phone,
  position_text,
  department_id,
  salary,
  hire_date,
  status,
  station_number,
  is_on_duty,
  last_login,
  permissions,
  notes,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  p.id AS profile_id,
  emp_info.employee_code,
  emp_info.name,
  emp_info.email,
  emp_info.phone,
  emp_info.position_text,
  d.id AS department_id,
  emp_info.salary,
  emp_info.hire_date,
  emp_info.status::public.employee_status,
  emp_info.station_number,
  emp_info.is_on_duty,
  emp_info.last_login,
  emp_info.permissions,
  emp_info.notes,
  emp_info.created_at,
  emp_info.updated_at
FROM shops s
JOIN profiles p1 ON s.owner_id = p1.id
CROSS JOIN (
  VALUES 
    ('EMP001', 'somchai', 'นายสมชาย ใจดี', 'somchai@stylehair.com', '081-234-5678', 'ช่างตัดผมอาวุโส', 25000.00, '2023-01-15'::date, 'active', 1, true, NOW() - INTERVAL '1 day', ARRAY['manage_queues','manage_employees','manage_services','manage_customers','manage_settings'], 'ช่างตัดผมที่มีประสบการณ์มากกว่า 10 ปี', NOW() - INTERVAL '12 months', NOW()),
    ('EMP002', 'somsri', 'สมศรี มีสุข', 'somsri@stylehair.com', '082-345-6789', 'ช่างทำสีผม', 22000.00, '2024-02-01'::date, 'active', 2, true, NOW() - INTERVAL '2 days', ARRAY['manage_customers','manage_services'], 'ช่างทำสีผมที่มีความเชี่ยวชาญด้านสีผมแฟชั่น', NOW() - INTERVAL '10 months', NOW())
) AS emp_info(employee_code, username, name, email, phone, position_text, salary, hire_date, status, station_number, is_on_duty, last_login, permissions, notes, created_at, updated_at)
JOIN profiles p ON p.username = emp_info.username
JOIN departments d ON d.shop_id = s.id AND d.name = CASE 
  WHEN emp_info.position_text = 'ช่างตัดผมอาวุโส' THEN 'ตัดผม'
  WHEN emp_info.position_text = 'ช่างทำสีผม' THEN 'ทำสีผม'
  ELSE 'ต้อนรับ'
END
WHERE p1.username = 'haircut_owner';


-- Insert customers
INSERT INTO customers (
  shop_id,
  name,
  phone,
  email,
  date_of_birth,
  gender,
  address,
  notes,
  last_visit,
  is_active,
  profile_id,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  cust_info.name,
  cust_info.phone,
  cust_info.email,
  cust_info.date_of_birth,
  cust_info.gender,
  cust_info.address,
  cust_info.notes,
  cust_info.last_visit,
  cust_info.is_active,
  cust_info.profile_id,
  cust_info.created_at,
  cust_info.updated_at
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('วิชัย รักสวย'::text, '083-456-7890'::text, 'wichai@example.com'::text, '1990-05-15'::date, 'male'::text, '456 ถนนสุขุมวิท กรุงเทพฯ'::text, 'ชอบตัดผมทรงสั้น'::text, NOW() - INTERVAL '7 days', true::boolean, NULL::uuid, NOW() - INTERVAL '6 months', NOW() - INTERVAL '7 days'),
    ('สมหญิง ใจงาม'::text, '084-567-8901'::text, 'somying@example.com'::text, '1995-08-20'::date, 'female'::text, '789 ถนนลาดพร้าว กรุงเทพฯ'::text, 'ชอบทำสีผมโทนน้ำตาล'::text, NOW() - INTERVAL '14 days', true::boolean, NULL::uuid, NOW() - INTERVAL '5 months', NOW() - INTERVAL '14 days')
) AS cust_info(name, phone, email, date_of_birth, gender, address, notes, last_visit, is_active, profile_id, created_at, updated_at)
WHERE p.username = 'haircut_owner';

-- Insert queues
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name,
    c.notes
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
),
employee_data AS (
  SELECT 
    e.id AS employee_id,
    e.position_text
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
)
INSERT INTO queues (
  shop_id,
  customer_id,
  queue_number,
  status,
  priority,
  estimated_duration,
  estimated_call_time,
  served_by_employee_id,
  note,
  feedback,
  rating,
  created_at,
  updated_at,
  served_at,
  completed_at
)
SELECT
  sd.shop_id,
  CASE 
    WHEN q.queue_number IN ('A001', 'A003') THEN (SELECT customer_id FROM customer_data WHERE name = 'วิชัย รักสวย')
    WHEN q.queue_number = 'A002' THEN (SELECT customer_id FROM customer_data WHERE name = 'สมหญิง ใจงาม')
  END AS customer_id,
  q.queue_number,
  q.status,
  q.priority,
  q.estimated_duration,
  q.estimated_call_time,
  CASE 
    WHEN q.queue_number = 'A001' THEN (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างตัดผมอาวุโส')
    WHEN q.queue_number = 'A002' THEN (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างทำสีผม')
    ELSE NULL
  END AS served_by_employee_id,
  q.note,
  q.feedback,
  q.rating,
  q.created_at,
  q.updated_at,
  q.served_at,
  q.completed_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('A001'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 30::integer, NOW() - INTERVAL '7 days' + INTERVAL '30 minutes', 'ตัดผมทรงสั้น'::text, 'บริการดีมาก'::text, 5::integer, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '1 hour', NOW() - INTERVAL '7 days' + INTERVAL '30 minutes', NOW() - INTERVAL '7 days' + INTERVAL '1 hour'),
    ('A002'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 120::integer, NOW() - INTERVAL '14 days' + INTERVAL '30 minutes', 'ทำสีผมโทนน้ำตาล'::text, 'พนักงานบริการดี'::text, 4::integer, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days' + INTERVAL '2 hours', NOW() - INTERVAL '14 days' + INTERVAL '30 minutes', NOW() - INTERVAL '14 days' + INTERVAL '2 hours'),
    ('A003'::text, 'waiting'::public.queue_status, 'normal'::public.queue_priority, 30::integer, NOW() + INTERVAL '30 minutes', 'ตัดผมทรงสั้น'::text, NULL::text, NULL::integer, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', NULL::timestamp, NULL::timestamp)
) AS q(queue_number, status, priority, estimated_duration, estimated_call_time, note, feedback, rating, created_at, updated_at, served_at, completed_at);

-- Insert queue services
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
),
queue_data AS (
  SELECT 
    q.id AS queue_id,
    q.queue_number,
    q.created_at
  FROM queues q
  JOIN shop_data sd ON q.shop_id = sd.shop_id
),
service_data AS (
  SELECT 
    s.id AS service_id,
    s.name,
    s.price
  FROM services s
  JOIN shop_data sd ON s.shop_id = sd.shop_id
)
INSERT INTO queue_services (
  queue_id,
  service_id,
  quantity,
  price,
  created_at
)
SELECT
  qd.queue_id,
  CASE 
    WHEN qd.queue_number IN ('A001', 'A003') THEN (SELECT service_id FROM service_data WHERE name = 'ตัดผมชาย')
    WHEN qd.queue_number = 'A002' THEN (SELECT service_id FROM service_data WHERE name = 'ทำสีผม')
  END AS service_id,
  1 AS quantity,
  CASE 
    WHEN qd.queue_number IN ('A001', 'A003') THEN 200.00
    WHEN qd.queue_number = 'A002' THEN 1500.00
  END AS price,
  qd.created_at
FROM queue_data qd;

-- Insert payments
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
),
queue_data AS (
  SELECT 
    q.id AS queue_id,
    q.queue_number,
    q.completed_at
  FROM queues q
  JOIN shop_data sd ON q.shop_id = sd.shop_id
  WHERE q.status = 'completed'::public.queue_status
),
employee_data AS (
  SELECT 
    e.id AS employee_id,
    e.position_text
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
)
INSERT INTO payments (
  queue_id,
  total_amount,
  paid_amount,
  payment_status,
  payment_method,
  processed_by_employee_id,
  payment_date,
  created_at,
  updated_at
)
SELECT
  qd.queue_id,
  CASE 
    WHEN qd.queue_number = 'A001' THEN 200.00
    WHEN qd.queue_number = 'A002' THEN 1500.00
  END AS total_amount,
  CASE 
    WHEN qd.queue_number = 'A001' THEN 200.00
    WHEN qd.queue_number = 'A002' THEN 1500.00
  END AS paid_amount,
  'paid'::public.payment_status AS payment_status,
  CASE 
    WHEN qd.queue_number = 'A001' THEN 'cash'::public.payment_method
    WHEN qd.queue_number = 'A002' THEN 'card'::public.payment_method
  END AS payment_method,
  CASE 
    WHEN qd.queue_number = 'A001' THEN (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างตัดผมอาวุโส')
    WHEN qd.queue_number = 'A002' THEN (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างทำสีผม')
  END AS processed_by_employee_id,
  qd.completed_at,
  qd.completed_at,
  qd.completed_at
FROM queue_data qd
WHERE qd.queue_number IN ('A001', 'A002');

-- Insert payment items
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
),
service_data AS (
  SELECT 
    s.id AS service_id,
    s.name,
    s.price
  FROM services s
  JOIN shop_data sd ON s.shop_id = sd.shop_id
),
payment_data AS (
  SELECT 
    p.id AS payment_id,
    p.queue_id,
    p.created_at
  FROM payments p
  JOIN queues q ON p.queue_id = q.id
  JOIN shop_data sd ON q.shop_id = sd.shop_id
),
queue_data AS (
  SELECT 
    q.id AS queue_id,
    q.queue_number
  FROM queues q
  JOIN shop_data sd ON q.shop_id = sd.shop_id
)
INSERT INTO payment_items (
  payment_id,
  service_id,
  name,
  price,
  quantity,
  total,
  created_at
)
SELECT
  pd.payment_id,
  CASE 
    WHEN qd.queue_number = 'A001' THEN (SELECT service_id FROM service_data WHERE name = 'ตัดผมชาย')
    WHEN qd.queue_number = 'A002' THEN (SELECT service_id FROM service_data WHERE name = 'ทำสีผม')
  END AS service_id,
  CASE 
    WHEN qd.queue_number = 'A001' THEN 'ตัดผมชาย'
    WHEN qd.queue_number = 'A002' THEN 'ทำสีผม'
  END AS name,
  CASE 
    WHEN qd.queue_number = 'A001' THEN 200.00
    WHEN qd.queue_number = 'A002' THEN 1500.00
  END AS price,
  1 AS quantity,
  CASE 
    WHEN qd.queue_number = 'A001' THEN 200.00
    WHEN qd.queue_number = 'A002' THEN 1500.00
  END AS total,
  pd.created_at
FROM payment_data pd
JOIN queue_data qd ON pd.queue_id = qd.queue_id
WHERE qd.queue_number IN ('A001', 'A002');

-- Insert shop settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
)
INSERT INTO shop_settings (
  shop_id,
  max_queue_size,
  estimated_service_time,
  allow_advance_booking,
  booking_window_hours,
  auto_confirm_queues,
  cancellation_deadline,
  maintenance_mode,
  allow_registration,
  require_email_verification,
  session_timeout,
  backup_frequency,
  log_level,
  data_retention_days,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  50,
  30,
  true,
  48,
  true,
  30,
  false,
  true,
  false,
  30,
  'daily',
  'info',
  90,
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM shop_data sd;

-- Insert notification settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
)
INSERT INTO notification_settings (
  shop_id,
  email_notifications,
  sms_notifications,
  push_notifications,
  new_queue,
  queue_update,
  shift_reminder,
  system_alerts,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  true AS email_notifications,
  false AS sms_notifications,
  true AS push_notifications,
  true AS new_queue,
  true AS queue_update,
  true AS shift_reminder,
  true AS system_alerts,
  NOW() - INTERVAL '12 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd;

-- Insert customer points
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name,
    c.last_visit
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
)
INSERT INTO customer_points (
  shop_id,
  customer_id,
  current_points,
  total_earned,
  total_redeemed,
  membership_tier,
  tier_benefits,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  cd.customer_id,
  CASE 
    WHEN cd.name = 'วิชัย รักสวย' THEN 50
    WHEN cd.name = 'สมหญิง ใจงาม' THEN 150
  END AS current_points,
  CASE 
    WHEN cd.name = 'วิชัย รักสวย' THEN 50
    WHEN cd.name = 'สมหญิง ใจงาม' THEN 150
  END AS total_earned,
  0 AS total_redeemed,
  CASE 
    WHEN cd.name = 'วิชัย รักสวย' THEN 'bronze'::public.membership_tier
    WHEN cd.name = 'สมหญิง ใจงาม' THEN 'silver'::public.membership_tier
  END AS membership_tier,
  CASE 
    WHEN cd.name = 'วิชัย รักสวย' THEN ARRAY['5% discount', 'Birthday gift']
    WHEN cd.name = 'สมหญิง ใจงาม' THEN ARRAY['10% discount', 'Birthday gift', 'Priority booking']
  END AS tier_benefits,
  CASE 
    WHEN cd.name = 'วิชัย รักสวย' THEN NOW() - INTERVAL '6 months'
    WHEN cd.name = 'สมหญิง ใจงาม' THEN NOW() - INTERVAL '5 months'
  END AS created_at,
  cd.last_visit AS updated_at
FROM shop_data sd
CROSS JOIN customer_data cd
WHERE cd.name IN ('วิชัย รักสวย', 'สมหญิง ใจงาม');

-- Insert customer point transactions
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name,
    c.last_visit
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
),
queue_data AS (
  SELECT 
    q.id AS queue_id,
    q.queue_number,
    q.customer_id,
    q.completed_at
  FROM queues q
  JOIN shop_data sd ON q.shop_id = sd.shop_id
),
customer_points_data AS (
  SELECT 
    cp.id AS customer_point_id,
    cp.customer_id,
    c.name AS customer_name
  FROM customer_points cp
  JOIN customers c ON cp.customer_id = c.id
  JOIN shop_data sd ON cp.shop_id = sd.shop_id
)
INSERT INTO customer_point_transactions (
  customer_point_id,
  type,
  points,
  description,
  related_queue_id,
  metadata,
  transaction_date,
  created_at
)
SELECT
  cpd.customer_point_id,
  'earned'::public.transaction_type as type,
  CASE 
    WHEN cpd.customer_name = 'วิชัย รักสวย' AND trans_data.description = 'คะแนนจากการใช้บริการ' THEN 20
    WHEN cpd.customer_name = 'วิชัย รักสวย' AND trans_data.description = 'คะแนนจากการแนะนำเพื่อน' THEN 30
    WHEN cpd.customer_name = 'สมหญิง ใจงาม' THEN 150
  END AS points,
  trans_data.description,
  CASE 
    WHEN trans_data.description = 'คะแนนจากการใช้บริการ' THEN (
      SELECT qd.queue_id FROM queue_data qd 
      WHERE qd.customer_id = cpd.customer_id 
      AND qd.queue_number = CASE 
        WHEN cpd.customer_name = 'วิชัย รักสวย' THEN 'A001'
        WHEN cpd.customer_name = 'สมหญิง ใจงาม' THEN 'A002'
      END
      LIMIT 1
    )
    ELSE NULL
  END AS related_queue_id,
  CASE 
    WHEN trans_data.description = 'คะแนนจากการใช้บริการ' AND cpd.customer_name = 'วิชัย รักสวย' THEN '{"service": "ตัดผมชาย"}'::jsonb
    WHEN trans_data.description = 'คะแนนจากการแนะนำเพื่อน' THEN (
      SELECT format('{"referral": "%s"}', c2.id::text)::jsonb
      FROM customers c2
      JOIN shop_data sd ON c2.shop_id = sd.shop_id
      WHERE c2.name = 'สมหญิง ใจงาม'
      LIMIT 1
    )
    WHEN trans_data.description = 'คะแนนจากการใช้บริการ' AND cpd.customer_name = 'สมหญิง ใจงาม' THEN '{"service": "ทำสีผม"}'::jsonb
  END AS metadata,
  CASE 
    WHEN cpd.customer_name = 'วิชัย รักสวย' AND trans_data.description = 'คะแนนจากการใช้บริการ' THEN NOW() - INTERVAL '7 days' + INTERVAL '1 hour'
    WHEN cpd.customer_name = 'วิชัย รักสวย' AND trans_data.description = 'คะแนนจากการแนะนำเพื่อน' THEN NOW() - INTERVAL '30 days'
    WHEN cpd.customer_name = 'สมหญิง ใจงาม' THEN NOW() - INTERVAL '14 days' + INTERVAL '2 hours'
  END AS transaction_date,
  CASE 
    WHEN cpd.customer_name = 'วิชัย รักสวย' AND trans_data.description = 'คะแนนจากการใช้บริการ' THEN NOW() - INTERVAL '7 days' + INTERVAL '1 hour'
    WHEN cpd.customer_name = 'วิชัย รักสวย' AND trans_data.description = 'คะแนนจากการแนะนำเพื่อน' THEN NOW() - INTERVAL '30 days'
    WHEN cpd.customer_name = 'สมหญิง ใจงาม' THEN NOW() - INTERVAL '14 days' + INTERVAL '2 hours'
  END AS created_at
FROM customer_points_data cpd
CROSS JOIN (
  VALUES 
    ('คะแนนจากการใช้บริการ'::text),
    ('คะแนนจากการแนะนำเพื่อน'::text)
) AS trans_data(description)
WHERE 
  (cpd.customer_name = 'วิชัย รักสวย') OR
  (cpd.customer_name = 'สมหญิง ใจงาม' AND trans_data.description = 'คะแนนจากการใช้บริการ');

-- Insert rewards
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
  LIMIT 1
)
INSERT INTO rewards (
  shop_id,
  name,
  description,
  type,
  points_required,
  value,
  is_available,
  expiry_days,
  usage_limit,
  icon,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  reward_info.name,
  reward_info.description,
  reward_info.type,
  reward_info.points_required,
  reward_info.value,
  reward_info.is_available,
  reward_info.expiry_days,
  reward_info.usage_limit,
  reward_info.icon,
  NOW() - INTERVAL '12 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('ส่วนลด 10%'::text, 'ส่วนลด 10% สำหรับการใช้บริการครั้งต่อไป'::text, 'discount'::public.reward_type, 100::integer, 10.00::numeric, true::boolean, 90::integer, 1::integer, '🏷️'::text),
    ('บริการฟรี'::text, 'บริการสระไดร์ฟรี 1 ครั้ง'::text, 'free_item'::public.reward_type, 200::integer, 150.00::numeric, true::boolean, 90::integer, 1::integer, '🎁'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert username: restaurant_owner for restaurant owner
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
    -- Restaurant owner user
    (
        '91000000-0000-0000-0000-000000000000',
        '91000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'restaurant_owner@example.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "restaurant_owner",
          "full_name": "Restaurant Owner",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'restaurant_owner@example.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: chef for restaurant employee
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
    -- Restaurant employee user
    (
        '91000000-0000-0000-0000-000000000000',
        '91000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'chef@thaidelicious.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "chef",
          "full_name": "นายสมศักดิ์ ทำอาหารเก่ง",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'chef@thaidelicious.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: waiter for restaurant employee
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
    -- Restaurant employee user
    (
        '91000000-0000-0000-0000-000000000000',
        '91000000-0000-0000-0000-000000000003',
        'authenticated',
        'authenticated',
        'waiter@thaidelicious.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "waiter",
          "full_name": "นางสาวสมใจ บริการดี",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'waiter@thaidelicious.com'
ON CONFLICT (provider_id, provider) DO NOTHING;


-- Insert a single restaurant shop
INSERT INTO shops (
  owner_id,
  name,
  slug,
  description,
  address,
  phone,
  email,
  website,
  logo,
  qr_code_url,
  timezone,
  currency,
  language,
  status,
  created_at,
  updated_at
)
SELECT
  p.id AS owner_id,
  'ครัวไทยอร่อย',
  'restaurant',
  'ร้านอาหารไทยรสชาติดั้งเดิม บรรยากาศอบอุ่น',
  '456 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
  '02-987-6543',
  'contact@thaidelicious.com',
  'https://thaidelicious.com',
  'https://example.com/restaurant-logo.png',
  'https://example.com/restaurant-qr.png',
  'Asia/Bangkok',
  'THB',
  'th',
  'active',
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM profiles p
WHERE p.username = 'restaurant_owner'
LIMIT 1;

-- Link shop to categories
INSERT INTO category_shops (category_id, shop_id, created_at, updated_at)
SELECT 
  c.id AS category_id,
  s.id AS shop_id,
  NOW(),
  NOW()
FROM categories c
CROSS JOIN shops s
JOIN profiles p ON s.owner_id = p.id
WHERE c.slug = 'restaurant'
AND p.username = 'restaurant_owner';

-- Insert shop opening hours
INSERT INTO shop_opening_hours (shop_id, day_of_week, is_open, open_time, close_time, break_start, break_end, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  day_info.day_of_week,
  day_info.is_open,
  day_info.open_time,
  day_info.close_time,
  day_info.break_start,
  day_info.break_end,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('monday'::text, true, '10:00:00'::time, '22:00:00'::time, '15:00:00'::time, '16:00:00'::time),
    ('tuesday'::text, true, '10:00:00'::time, '22:00:00'::time, '15:00:00'::time, '16:00:00'::time),
    ('wednesday'::text, true, '10:00:00'::time, '22:00:00'::time, '15:00:00'::time, '16:00:00'::time),
    ('thursday'::text, true, '10:00:00'::time, '22:00:00'::time, '15:00:00'::time, '16:00:00'::time),
    ('friday'::text, true, '10:00:00'::time, '23:00:00'::time, '15:00:00'::time, '16:00:00'::time),
    ('saturday'::text, true, '10:00:00'::time, '23:00:00'::time, '15:00:00'::time, '16:00:00'::time),
    ('sunday'::text, true, '10:00:00'::time, '22:00:00'::time, '15:00:00'::time, '16:00:00'::time)
) AS day_info(day_of_week, is_open, open_time, close_time, break_start, break_end)
WHERE p.username = 'restaurant_owner';

-- Insert restaurant services (menu items)
INSERT INTO services (shop_id, name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank, created_at, updated_at)
SELECT
  s.id AS shop_id,
  service_info.name,
  service_info.slug,
  service_info.description,
  service_info.price,
  service_info.estimated_duration,
  service_info.category,
  service_info.is_available,
  service_info.icon,
  service_info.popularity_rank,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES
    -- Main dishes
    ('ผัดไทยกุ้งสด'::text, 'pad-thai-guang-shi'::text, 'ผัดไทยกุ้งสดรสเด็ด เส้นนุ่ม กุ้งสดตัวใหญ่'::text, 120.00, 15, 'main_dish'::text, true, 'food'::text, 1),
    ('ต้มยำกุ้ง'::text, 'tom-yam-guang-shi'::text, 'ต้มยำกุ้งน้ำข้น รสจัดจ้าน กุ้งสดตัวใหญ่'::text, 180.00, 15, 'main_dish'::text, true, 'soup'::text, 2),
    ('แกงเขียวหวานไก่'::text, 'green-curry-chicken'::text, 'แกงเขียวหวานไก่เนื้อนุ่ม น้ำแกงข้น หอมกลิ่นใบโหระพา'::text, 150.00, 15, 'main_dish'::text, true, 'curry'::text, 3),
    ('ผัดกระเพราหมูกรอบ'::text, 'pad-krapao-moo-krob'::text, 'ผัดกระเพราหมูกรอบ รสชาติจัดจ้าน เผ็ดร้อน'::text, 120.00, 10, 'main_dish'::text, true, 'food'::text, 4),
    ('ข้าวผัดปู'::text, 'pad-pao-poo'::text, 'ข้าวผัดเนื้อปูก้อนใหญ่ หอมกลิ่นใบมะกรูด'::text, 160.00, 15, 'main_dish'::text, true, 'rice'::text, 5),
    ('สเต็กเนื้อนำเข้า'::text, 'steak-nam-khao'::text, 'สเต็กเนื้อนำเข้าคุณภาพพรีเมียม เสิร์ฟพร้อมซอสและผักย่าง'::text, 450.00, 25, 'main_dish'::text, true, 'steak'::text, 6),
    
    -- Appetizers
    ('ปอเปี๊ยะทอด'::text, 'pad-pao-yao-thai'::text, 'ปอเปี๊ยะทอดกรอบ ไส้หมูสับและผัก เสิร์ฟพร้อมน้ำจิ้มรสหวาน'::text, 80.00, 10, 'appetizer'::text, true, 'appetizer'::text, 7),
    ('ยำวุ้นเส้น'::text, 'yum-wun-sean'::text, 'ยำวุ้นเส้นกุ้งสด รสเปรี้ยวหวานเผ็ด'::text, 120.00, 15, 'appetizer'::text, true, 'salad'::text, 8),
    ('ส้มตำไทย'::text, 'som-tam-thai'::text, 'ส้มตำไทยรสจัดจ้าน ใส่ถั่วลิสงบด กุ้งแห้ง'::text, 90.00, 10, 'appetizer'::text, true, 'salad'::text, 9),
    
    -- Drinks
    ('น้ำมะนาว'::text, 'nam-manao'::text, 'น้ำมะนาวสดคั้น หวานเย็นชื่นใจ'::text, 50.00, 5, 'drink'::text, true, 'juice'::text, 10),
    ('ชาไทยเย็น'::text, 'cha-thai-yen'::text, 'ชาไทยเย็นรสชาติเข้มข้น หอมกลิ่นชา'::text, 45.00, 5, 'drink'::text, true, 'tea'::text, 11),
    ('กาแฟดำเย็น'::text, 'coffee-black-yen'::text, 'กาแฟดำเย็น รสชาติเข้มข้น'::text, 45.00, 5, 'drink'::text, true, 'coffee'::text, 12),
    
    -- Desserts
    ('ข้าวเหนียวมะม่วง'::text, 'nam-maow-mang'::text, 'ข้าวเหนียวมะม่วงหวานมัน ราดด้วยกะทิสด'::text, 90.00, 10, 'dessert'::text, true, 'dessert'::text, 13),
    ('ทับทิมกรอบ'::text, 'tap-tim-grab'::text, 'ทับทิมกรอบเย็นชื่นใจ ราดด้วยกะทิสด'::text, 70.00, 10, 'dessert'::text, true, 'dessert'::text, 14),
    ('ไอศกรีมกะทิ'::text, 'ice-cream-kati'::text, 'ไอศกรีมกะทิสดรสหอมมัน เสิร์ฟพร้อมถั่วลิสงคั่ว'::text, 60.00, 5, 'dessert'::text, true, 'ice_cream'::text, 15)
) AS service_info(name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank)
WHERE p.username = 'restaurant_owner';

-- Insert departments for the restaurant
INSERT INTO departments (shop_id, name, slug, description, created_at, updated_at)
SELECT
  s.id AS shop_id,
  dept_info.name,
  dept_info.slug,
  dept_info.description,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES
    ('ครัว'::text, 'crew'::text, 'แผนกครัว รับผิดชอบการปรุงอาหารทั้งหมด'::text),
    ('บริการ'::text, 'service'::text, 'แผนกบริการลูกค้า รับผิดชอบการต้อนรับและเสิร์ฟอาหาร'::text),
    ('บาร์'::text, 'bar'::text, 'แผนกบาร์ รับผิดชอบเครื่องดื่มและค็อกเทล'::text)
) AS dept_info(name, slug, description)
WHERE p.username = 'restaurant_owner';

-- Insert employees for the restaurant
INSERT INTO employees (
  shop_id,
  profile_id,
  employee_code,
  name,
  email,
  phone,
  position_text,
  department_id,
  salary,
  hire_date,
  status,
  station_number,
  is_on_duty,
  last_login,
  permissions,
  notes,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  p_emp.id AS profile_id,
  emp_info.employee_code,
  p_emp.full_name AS name,
  emp_info.email,
  emp_info.phone,
  emp_info.position_text,
  d.id AS department_id,
  emp_info.salary,
  NOW() - emp_info.employed_days * INTERVAL '1 day' AS hire_date,
  'active'::public.employee_status AS status,
  emp_info.station_number,
  true AS is_on_duty,
  NOW() - INTERVAL '1 day' AS last_login,
  emp_info.permissions,
  emp_info.notes,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
JOIN departments d ON d.shop_id = s.id
CROSS JOIN (
  VALUES
    ('chef'::text, 'chef@restaurant.com', '0812345678'::text, 'EMP001'::text, 'หัวหน้าเชฟ'::text, 35000.00, 180, 1::integer, ARRAY['manage_queues','manage_employees','manage_services','manage_customers','manage_settings']::text[], 'เชฟประจำร้าน มีประสบการณ์ 10 ปี'::text, 'ครัว'::text),
    ('waiter'::text, 'waiter@restaurant.com', '0812345678'::text, 'EMP002'::text, 'พนักงานเสิร์ฟ'::text, 18000.00, 90, 2::integer, ARRAY['manage_queues','manage_employees','manage_services','manage_customers','manage_settings']::text[], 'พนักงานเสิร์ฟที่มีใจบริการ'::text, 'บริการ'::text)
) AS emp_info(username, email, phone, employee_code, position_text, salary, employed_days, station_number, permissions, notes, department)
JOIN profiles p_emp ON p_emp.username = emp_info.username
WHERE p.username = 'restaurant_owner'
AND d.name = emp_info.department;

-- Insert customers for the restaurant
INSERT INTO customers (
  shop_id,
  name,
  phone,
  email,
  date_of_birth,
  gender,
  address,
  notes,
  last_visit,
  is_active,
  profile_id,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  customer_info.name,
  customer_info.phone,
  customer_info.email,
  customer_info.date_of_birth,
  customer_info.gender,
  customer_info.address,
  customer_info.notes,
  customer_info.last_visit,
  customer_info.is_active,
  p_cust.id AS profile_id,
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '1 day'
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES
    ('customer1'::text, 'สมชาย ใจดี'::text, '0891234567'::text, 'somchai@example.com'::text, '1985-06-15'::date, 'male'::text, '123 ถนนสุขุมวิท กรุงเทพฯ'::text, 'ลูกค้าประจำ ชอบอาหารรสจัด'::text, NOW() - INTERVAL '7 days', true::boolean),
    ('customer2'::text, 'สมหญิง รักสวย'::text, '0891234568'::text, 'somying@example.com'::text, '1990-03-20'::date, 'female'::text, '456 ถนนเพชรบุรี กรุงเทพฯ'::text, 'แพ้อาหารทะเล'::text, NOW() - INTERVAL '14 days', true::boolean),
    ('customer3'::text, 'วิชัย มั่งมี'::text, '0891234569'::text, 'wichai@example.com'::text, '1978-11-05'::date, 'male'::text, '789 ถนนสีลม กรุงเทพฯ'::text, 'ชอบโต๊ะริมหน้าต่าง'::text, NOW() - INTERVAL '30 days', true::boolean)
) AS customer_info(username, name, phone, email, date_of_birth, gender, address, notes, last_visit, is_active)
LEFT JOIN profiles p_cust ON p_cust.username = customer_info.username
WHERE p.username = 'restaurant_owner';

-- Insert queues for the restaurant
INSERT INTO queues (
  shop_id,
  customer_id,
  queue_number,
  status,
  priority,
  estimated_duration,
  estimated_call_time,
  served_by_employee_id,
  note,
  feedback,
  rating,
  created_at,
  updated_at,
  served_at,
  completed_at
)
SELECT
  s.id AS shop_id,
  c.id AS customer_id,
  queue_info.queue_number,
  queue_info.status::public.queue_status,
  'normal'::public.queue_priority AS priority,
  queue_info.estimated_duration,
  NOW() - queue_info.minutes_ago * INTERVAL '1 minute' + INTERVAL '30 minutes' AS estimated_call_time,
  CASE 
    WHEN queue_info.status = 'completed' OR queue_info.status = 'in_progress' THEN 
      (SELECT e.id FROM employees e WHERE e.shop_id = s.id AND e.position_text = 'พนักงานเสิร์ฟ' LIMIT 1)
    ELSE NULL
  END AS served_by_employee_id,
  queue_info.note,
  queue_info.feedback,
  queue_info.rating,
  NOW() - queue_info.minutes_ago * INTERVAL '1 minute',
  NOW() - queue_info.minutes_ago * INTERVAL '1 minute',
  CASE 
    WHEN queue_info.status = 'completed' OR queue_info.status = 'in_progress' THEN 
      NOW() - queue_info.minutes_ago * INTERVAL '1 minute' + INTERVAL '15 minutes'
    ELSE NULL
  END AS served_at,
  CASE 
    WHEN queue_info.status = 'completed' THEN 
      NOW() - queue_info.minutes_ago * INTERVAL '1 minute' + INTERVAL '1 hour'
    ELSE NULL
  END AS completed_at
FROM shops s
JOIN profiles p ON s.owner_id = p.id
JOIN customers c ON c.shop_id = s.id
JOIN profiles p_cust ON p_cust.id = c.profile_id
CROSS JOIN (
  VALUES
    ('customer1'::text, 'R001'::text, 'completed'::text, 'โต๊ะสำหรับ 4 ท่าน'::text, 60, 'บริการดีมาก'::text, 5::integer, 120),
    ('customer2'::text, 'R002'::text, 'in_progress'::text, 'โต๊ะริมหน้าต่าง'::text, 90, NULL::text, NULL::integer, 45),
    ('customer3'::text, 'R003'::text, 'waiting'::text, 'โต๊ะสำหรับ 2 ท่าน'::text, 45, NULL::text, NULL::integer, 15)
) AS queue_info(username, queue_number, status, note, estimated_duration, feedback, rating, minutes_ago)
WHERE p.username = 'restaurant_owner'
AND p_cust.username = queue_info.username;

-- Insert queue services for the restaurant (menu items ordered)
INSERT INTO queue_services (queue_id, service_id, quantity, price, created_at)
SELECT
  q.id AS queue_id,
  s.id AS service_id,
  qs_info.quantity,
  qs_info.price,
  q.created_at
FROM queues q
JOIN shops sh ON q.shop_id = sh.id
JOIN profiles p ON sh.owner_id = p.id
JOIN customers c ON q.customer_id = c.id
JOIN profiles p_cust ON c.profile_id = p_cust.id
JOIN services s ON s.shop_id = sh.id
CROSS JOIN (
  VALUES
    ('customer1'::text, 'ผัดไทยกุ้งสด'::text, 2, 120.00),
    ('customer1'::text, 'ต้มยำกุ้ง'::text, 1, 150.00),
    ('customer1'::text, 'ข้าวสวย'::text, 3, 25.00),
    ('customer1'::text, 'น้ำมะนาว'::text, 3, 50.00),
    ('customer2'::text, 'ผัดกะเพราหมูสับ'::text, 1, 90.00),
    ('customer2'::text, 'ข้าวสวย'::text, 1, 25.00),
    ('customer2'::text, 'ชาไทยเย็น'::text, 1, 45.00),
    ('customer3'::text, 'ส้มตำไทย'::text, 1, 80.00),
    ('customer3'::text, 'ไก่ย่าง'::text, 1, 120.00),
    ('customer3'::text, 'ข้าวเหนียว'::text, 2, 20.00)
) AS qs_info(username, service_name, quantity, price)
WHERE p.username = 'restaurant_owner'
AND p_cust.username = qs_info.username
AND s.name = qs_info.service_name;

-- Insert payments for the restaurant
INSERT INTO payments (
  queue_id,
  total_amount,
  paid_amount,
  payment_status,
  payment_method,
  processed_by_employee_id,
  payment_date,
  created_at,
  updated_at
)
SELECT
  q.id AS queue_id,
  CASE
    WHEN q.queue_number = 'R001' THEN 1200.00
    WHEN q.queue_number = 'R002' THEN 850.00
    WHEN q.queue_number = 'R003' THEN 500.00
  END AS total_amount,
  CASE
    WHEN q.queue_number = 'R001' THEN 1200.00
    WHEN q.queue_number = 'R002' THEN 850.00
    WHEN q.queue_number = 'R003' THEN 500.00
  END AS paid_amount,
  'paid'::public.payment_status AS payment_status,
  'card'::public.payment_method AS payment_method,
  (SELECT e.id FROM employees e WHERE e.shop_id = sh.id AND e.position_text = 'พนักงานเสิร์ฟ' LIMIT 1) AS processed_by_employee_id,
  q.created_at + INTERVAL '1 hour' AS payment_date,
  q.created_at + INTERVAL '1 hour' AS created_at,
  q.created_at + INTERVAL '1 hour' AS updated_at
FROM shops sh
JOIN profiles p ON sh.owner_id = p.id
JOIN customers c ON c.shop_id = sh.id
JOIN profiles p_cust ON c.profile_id = p_cust.id
JOIN queues q ON q.customer_id = c.id
CROSS JOIN (
  VALUES
    ('customer1'::text, 'R001'::text),
    ('customer2'::text, 'R002'::text),
    ('customer3'::text, 'R003'::text)
) AS payment_info(username, queue_number)
WHERE p.username = 'restaurant_owner'
AND p_cust.username = payment_info.username
AND q.queue_number = payment_info.queue_number;

-- Insert payment items for the restaurant
INSERT INTO payment_items (
  payment_id,
  service_id,
  name,
  price,
  quantity,
  total,
  created_at
)
SELECT
  pay.id AS payment_id,
  s.id AS service_id,
  s.name,
  s.price,
  qs.quantity,
  s.price * qs.quantity AS total,
  pay.created_at
FROM payments pay
JOIN queues q ON pay.queue_id = q.id
JOIN queue_services qs ON qs.queue_id = q.id
JOIN services s ON qs.service_id = s.id
JOIN customers c ON q.customer_id = c.id
JOIN profiles p_cust ON c.profile_id = p_cust.id
JOIN shops sh ON q.shop_id = sh.id
JOIN profiles p ON sh.owner_id = p.id
WHERE p.username = 'restaurant_owner'
AND pay.payment_status = 'paid';

-- Insert shop settings for the restaurant
INSERT INTO shop_settings (
  shop_id,
  max_queue_size,
  estimated_service_time,
  allow_advance_booking,
  booking_window_hours,
  auto_confirm_queues,
  cancellation_deadline,
  maintenance_mode,
  allow_registration,
  require_email_verification,
  session_timeout,
  backup_frequency,
  log_level,
  data_retention_days,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  50 AS max_queue_size,
  15 AS estimated_service_time,
  true AS allow_advance_booking,
  24 AS booking_window_hours,
  true AS auto_confirm_queues,
  30 AS cancellation_deadline,
  false AS maintenance_mode,
  true AS allow_registration,
  false AS require_email_verification,
  30 AS session_timeout,
  'daily'::text AS backup_frequency,
  'info'::text AS log_level,
  365 AS data_retention_days,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
WHERE p.username = 'restaurant_owner';

-- Insert notification settings for the restaurant
INSERT INTO notification_settings (
  shop_id,
  email_notifications,
  sms_notifications,
  push_notifications,
  new_queue,
  queue_update,
  shift_reminder,
  system_alerts,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  true AS email_notifications,
  false AS sms_notifications,
  true AS push_notifications,
  true AS new_queue,
  true AS queue_update,
  true AS shift_reminder,
  true AS system_alerts,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
WHERE p.username = 'restaurant_owner';

-- Insert customer points for the restaurant
INSERT INTO customer_points (
  shop_id,
  customer_id,
  current_points,
  total_earned,
  total_redeemed,
  membership_tier,
  tier_benefits,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  c.id AS customer_id,
  cp_info.current_points,
  cp_info.total_earned,
  cp_info.total_redeemed,
  cp_info.membership_tier,
  cp_info.tier_benefits,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
JOIN customers c ON c.shop_id = s.id
JOIN profiles p_cust ON c.profile_id = p_cust.id
CROSS JOIN (
  VALUES
    ('customer1'::text, 100::integer, 150::integer, 50::integer, 'gold'::public.membership_tier, ARRAY['5% discount', 'Birthday gift']::text[]),
    ('customer2'::text, 75::integer, 75::integer, 0::integer, 'silver'::public.membership_tier, ARRAY['10% discount', 'Birthday gift', 'Priority booking']::text[]),
    ('customer3'::text, 25::integer, 25::integer, 0::integer, 'bronze'::public.membership_tier, ARRAY['5% discount', 'Birthday gift']::text[])
) AS cp_info(username, current_points, total_earned, total_redeemed, membership_tier, tier_benefits)
WHERE p.username = 'restaurant_owner'
AND p_cust.username = cp_info.username;

-- Insert customer point transactions for the restaurant
INSERT INTO customer_point_transactions (
  customer_point_id,
  type,
  points,
  description,
  related_queue_id,
  metadata,
  transaction_date,
  created_at
)
SELECT
  cp.id AS customer_point_id,
  pt_info.type,
  pt_info.points,
  pt_info.description,
  q.id AS related_queue_id,
  pt_info.metadata,
  pay.created_at AS transaction_date,
  pay.created_at
FROM shops s
JOIN profiles p ON s.owner_id = p.id
JOIN customers c ON c.shop_id = s.id
JOIN profiles p_cust ON c.profile_id = p_cust.id
JOIN customer_points cp ON cp.customer_id = c.id
JOIN payments pay ON pay.queue_id IN (SELECT id FROM queues WHERE customer_id = c.id)
JOIN queues q ON pay.queue_id = q.id
CROSS JOIN (
  VALUES
    ('customer1'::text, 'earned'::public.transaction_type, 50, 'คะแนนจากการใช้บริการร้านอาหาร'::text, '{"order_total": 1200}'::jsonb),
    ('customer2'::text, 'earned'::public.transaction_type, 25, 'คะแนนจากการใช้บริการร้านอาหาร'::text, '{"order_total": 850}'::jsonb),
    ('customer3'::text, 'earned'::public.transaction_type, 15, 'คะแนนจากการใช้บริการร้านอาหาร'::text, '{"order_total": 500}'::jsonb)
) AS pt_info(username, type, points, description, metadata)
WHERE p.username = 'restaurant_owner'
AND p_cust.username = pt_info.username;

-- Insert rewards for the restaurant
INSERT INTO rewards (
  shop_id,
  name,
  description,
  type,
  points_required,
  value,
  is_available,
  expiry_days,
  usage_limit,
  icon,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  reward_info.name,
  reward_info.description,
  reward_info.type,
  reward_info.points_required,
  reward_info.value,
  reward_info.is_available,
  reward_info.expiry_days,
  reward_info.usage_limit,
  reward_info.icon,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES
    ('ส่วนลด 10%'::text, 'ส่วนลด 10% สำหรับการสั่งอาหารครั้งต่อไป'::text, 'discount'::public.reward_type, 50, 10.0, true, 90, 1, 'discount_icon'::text),
    ('เครื่องดื่มฟรี'::text, 'รับเครื่องดื่มฟรี 1 แก้วเมื่อสั่งอาหารครบ 500 บาท'::text, 'free_item'::public.reward_type, 75, 1.0, true, 60, 1, 'drink_icon'::text),
    ('อาหารฟรี 1 จาน'::text, 'รับอาหารฟรี 1 จาน (ไม่เกิน 200 บาท)'::text, 'free_item'::public.reward_type, 150, 1.0, true, 30, 1, 'food_icon'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon)
WHERE p.username = 'restaurant_owner';

-- Insert username: mobile_repair_owner for mobile repair shop owner
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
    (
        '92000000-0000-0000-0000-000000000000',
        '92000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'mobile_repair_owner@example.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "mobile_repair_owner",
          "full_name": "Mobile Repair Owner",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'mobile_repair_owner@example.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: technician1 for mobile repair technician
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
    (
        '92000000-0000-0000-0000-000000000000',
        '92000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'technician1@mobilerepair.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "technician1",
          "full_name": "นายสมเกียรติ ซ่อมเก่ง",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for technician1
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
WHERE
    email = 'technician1@mobilerepair.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: technician2 for mobile repair technician
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
    (
        '92000000-0000-0000-0000-000000000000',
        '92000000-0000-0000-0000-000000000003',
        'authenticated',
        'authenticated',
        'technician2@mobilerepair.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "technician2",
          "full_name": "นางสาวสมหญิง ช่างดี",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for technician2
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
WHERE
    email = 'technician2@mobilerepair.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Insert mobile repair shop
INSERT INTO shops (
  owner_id,
  name,
  slug,
  description,
  address,
  phone,
  email,
  website,
  logo,
  qr_code_url,
  timezone,
  currency,
  language,
  status,
  created_at,
  updated_at
)
SELECT
  p.id AS owner_id,
  'ศูนย์ซ่อมมือถือ',
  'mobile-repair',
  'ศูนย์บริการซ่อมมือถือและอุปกรณ์อิเล็กทรอนิกส์ครบวงจร',
  '789 ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
  '02-555-1234',
  'contact@mobilerepair.com',
  'https://mobilerepair.com',
  'https://example.com/mobile-repair-logo.png',
  'https://example.com/mobile-repair-qr.png',
  'Asia/Bangkok',
  'THB',
  'th',
  'active',
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM profiles p
WHERE p.username = 'mobile_repair_owner'
LIMIT 1;

-- Link shop to categories
INSERT INTO category_shops (category_id, shop_id, created_at, updated_at)
SELECT 
  c.id AS category_id,
  s.id AS shop_id,
  NOW(),
  NOW()
FROM categories c
CROSS JOIN shops s
JOIN profiles p ON s.owner_id = p.id
WHERE c.slug IN ('electronics', 'repair')
AND p.username = 'mobile_repair_owner'
LIMIT 1;

-- Insert shop opening hours
INSERT INTO shop_opening_hours (shop_id, day_of_week, is_open, open_time, close_time, break_start, break_end, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  day_info.day_of_week,
  day_info.is_open,
  day_info.open_time,
  day_info.close_time,
  day_info.break_start,
  day_info.break_end,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('monday'::text, true, '09:00:00'::time, '19:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('tuesday'::text, true, '09:00:00'::time, '19:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('wednesday'::text, true, '09:00:00'::time, '19:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('thursday'::text, true, '09:00:00'::time, '19:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('friday'::text, true, '09:00:00'::time, '19:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('saturday'::text, true, '10:00:00'::time, '18:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('sunday'::text, true, '10:00:00'::time, '17:00:00'::time, '12:00:00'::time, '13:00:00'::time)
) AS day_info(day_of_week, is_open, open_time, close_time, break_start, break_end)
WHERE p.username = 'mobile_repair_owner';

-- Insert services for the mobile repair shop
INSERT INTO services (shop_id, name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  service_info.name,
  service_info.slug,
  service_info.description,
  service_info.price,
  service_info.estimated_duration,
  service_info.category,
  service_info.is_available,
  service_info.icon,
  service_info.popularity_rank,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('เปลี่ยนจอ iPhone'::text, 'iphone-screen-repair'::text, 'เปลี่ยนจอ iPhone ทุกรุ่น รับประกัน 3 เดือน'::text, 2500.00::numeric, 45::integer, 'screen_repair'::text, true::boolean, '📱'::text, 1::integer),
    ('เปลี่ยนจอ Samsung'::text, 'samsung-screen-repair'::text, 'เปลี่ยนจอ Samsung ทุกรุ่น รับประกัน 3 เดือน'::text, 2200.00::numeric, 45::integer, 'screen_repair'::text, true::boolean, '📱'::text, 2::integer),
    ('เปลี่ยนแบตเตอรี่ iPhone'::text, 'iphone-battery-repair'::text, 'เปลี่ยนแบตเตอรี่ iPhone แท้ รับประกัน 6 เดือน'::text, 1200.00::numeric, 30::integer, 'battery'::text, true::boolean, '🔋'::text, 3::integer),
    ('เปลี่ยนแบตเตอรี่ Samsung'::text, 'samsung-battery-repair'::text, 'เปลี่ยนแบตเตอรี่ Samsung แท้ รับประกัน 6 เดือน'::text, 1000.00::numeric, 30::integer, 'battery'::text, true::boolean, '🔋'::text, 4::integer),
    ('ซ่อมช่องชาร์จ'::text, 'charging-port-repair'::text, 'ซ่อมช่องชาร์จมือถือทุกรุ่น'::text, 700.00::numeric, 60::integer, 'charging_port'::text, true::boolean, '🔌'::text, 5::integer),
    ('ซ่อมกล้องหลัง'::text, 'back-camera-repair'::text, 'ซ่อมกล้องหลังมือถือทุกรุ่น'::text, 1500.00::numeric, 90::integer, 'camera'::text, true::boolean, '📷'::text, 6::integer),
    ('ซ่อมลำโพง'::text, 'speaker-repair'::text, 'ซ่อมลำโพงมือถือทุกรุ่น'::text, 500.00::numeric, 45::integer, 'speaker'::text, true::boolean, '🔊'::text, 7::integer),
    ('ติดตั้งระบบปฏิบัติการ'::text, 'software-installation'::text, 'ติดตั้งระบบปฏิบัติการใหม่'::text, 300.00::numeric, 60::integer, 'software'::text, true::boolean, '💾'::text, 8::integer),
    ('ตรวจสอบเครื่อง'::text, 'diagnostic-check'::text, 'ตรวจสอบปัญหาเครื่องโดยละเอียด'::text, 100.00::numeric, 15::integer, 'diagnostic'::text, true::boolean, '🔍'::text, 9::integer)
) AS service_info(name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank)
WHERE p.username = 'mobile_repair_owner';

-- Insert departments
INSERT INTO departments (shop_id, name, slug, description, employee_count, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  dept_info.name,
  dept_info.slug,
  dept_info.description,
  dept_info.employee_count,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('ซ่อมฮาร์ดแวร์'::text, 'hardware-repair'::text, 'แผนกซ่อมฮาร์ดแวร์ จอ แบตเตอรี่ กล้อง'::text, 2::integer),
    ('ซ่อมซอฟต์แวร์'::text, 'software-repair'::text, 'แผนกซ่อมซอฟต์แวร์ ติดตั้งระบบ'::text, 1::integer),
    ('ต้อนรับ'::text, 'welcome'::text, 'แผนกต้อนรับลูกค้า'::text, 1::integer)
) AS dept_info(name, slug, description, employee_count)
WHERE p.username = 'mobile_repair_owner';

-- Insert employees
INSERT INTO employees (
  shop_id,
  profile_id,
  employee_code,
  name,
  email,
  phone,
  position_text,
  department_id,
  salary,
  hire_date,
  status,
  station_number,
  is_on_duty,
  last_login,
  permissions,
  notes,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  p.id AS profile_id,
  emp_info.employee_code,
  emp_info.name,
  emp_info.email,
  emp_info.phone,
  emp_info.position_text,
  d.id AS department_id,
  emp_info.salary,
  emp_info.hire_date,
  emp_info.status::public.employee_status,
  emp_info.station_number,
  emp_info.is_on_duty,
  emp_info.last_login,
  emp_info.permissions,
  emp_info.notes,
  emp_info.created_at,
  emp_info.updated_at
FROM shops s
JOIN profiles p1 ON s.owner_id = p1.id
CROSS JOIN (
  VALUES 
    ('TECH001', 'technician1', 'นายสมเกียรติ ซ่อมเก่ง', 'technician1@mobilerepair.com', '081-555-1111', 'ช่างซ่อมอาวุโส', 28000.00, '2023-03-15'::date, 'active', 1, true, NOW() - INTERVAL '1 day', ARRAY['manage_queues','manage_customers','manage_services'], 'ช่างซ่อมที่มีประสบการณ์มากกว่า 8 ปี', NOW() - INTERVAL '10 months', NOW()),
    ('TECH002', 'technician2', 'นางสาวสมหญิง ช่างดี', 'technician2@mobilerepair.com', '082-555-2222', 'ช่างซ่อมซอฟต์แวร์', 22000.00, '2023-08-01'::date, 'active', 2, true, NOW() - INTERVAL '2 days', ARRAY['manage_customers','manage_services'], 'ช่างซ่อมซอฟต์แวร์เชี่ยวชาญ', NOW() - INTERVAL '5 months', NOW())
) AS emp_info(employee_code, username, name, email, phone, position_text, salary, hire_date, status, station_number, is_on_duty, last_login, permissions, notes, created_at, updated_at)
JOIN profiles p ON p.username = emp_info.username
JOIN departments d ON d.shop_id = s.id AND d.name = CASE 
  WHEN emp_info.position_text = 'ช่างซ่อมอาวุโส' THEN 'ซ่อมฮาร์ดแวร์'
  WHEN emp_info.position_text = 'ช่างซ่อมซอฟต์แวร์' THEN 'ซ่อมซอฟต์แวร์'
  ELSE 'ต้อนรับ'
END
WHERE p1.username = 'mobile_repair_owner';

-- Insert customers
INSERT INTO customers (
  shop_id,
  name,
  phone,
  email,
  date_of_birth,
  gender,
  address,
  notes,
  last_visit,
  is_active,
  profile_id,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  cust_info.name,
  cust_info.phone,
  cust_info.email,
  cust_info.date_of_birth,
  cust_info.gender,
  cust_info.address,
  cust_info.notes,
  cust_info.last_visit,
  cust_info.is_active,
  cust_info.profile_id,
  cust_info.created_at,
  cust_info.updated_at
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('นายธนากร มือถือใหม่'::text, '089-111-2222'::text, 'thanakorn@example.com'::text, '1992-07-10'::date, 'male'::text, '123 ถนนพหลโยธิน กรุงเทพฯ'::text, 'ใช้ iPhone 14 Pro จอแตกบ่อย'::text, NOW() - INTERVAL '5 days', true::boolean, NULL::uuid, NOW() - INTERVAL '4 months', NOW() - INTERVAL '5 days'),
    ('นางสาวพิมพ์ใจ สมาร์ทโฟน'::text, '088-333-4444'::text, 'pimjai@example.com'::text, '1988-12-25'::date, 'female'::text, '456 ถนนลาดพร้าว กรุงเทพฯ'::text, 'ใช้ Samsung Galaxy S23 แบตเสื่อม'::text, NOW() - INTERVAL '10 days', true::boolean, NULL::uuid, NOW() - INTERVAL '3 months', NOW() - INTERVAL '10 days'),
    ('นายวิทยา เทคโนโลยี'::text, '087-555-6666'::text, 'wittaya@example.com'::text, '1985-04-18'::date, 'male'::text, '789 ถนนสุขุมวิท กรุงเทพฯ'::text, 'ใช้หลายรุ่น ชอบลองของใหม่'::text, NOW() - INTERVAL '20 days', true::boolean, NULL::uuid, NOW() - INTERVAL '6 months', NOW() - INTERVAL '20 days')
) AS cust_info(name, phone, email, date_of_birth, gender, address, notes, last_visit, is_active, profile_id, created_at, updated_at)
WHERE p.username = 'mobile_repair_owner';

-- Insert queues
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'mobile_repair_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
),
employee_data AS (
  SELECT 
    e.id AS employee_id,
    e.position_text
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
)
INSERT INTO queues (
  shop_id,
  customer_id,
  queue_number,
  status,
  priority,
  estimated_duration,
  estimated_call_time,
  served_by_employee_id,
  note,
  feedback,
  rating,
  created_at,
  updated_at,
  served_at,
  completed_at
)
SELECT
  sd.shop_id,
  CASE 
    WHEN q.queue_number = 'M001' THEN (SELECT customer_id FROM customer_data WHERE name = 'นายธนากร มือถือใหม่')
    WHEN q.queue_number = 'M002' THEN (SELECT customer_id FROM customer_data WHERE name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน')
    WHEN q.queue_number = 'M003' THEN (SELECT customer_id FROM customer_data WHERE name = 'นายวิทยา เทคโนโลยี')
  END AS customer_id,
  q.queue_number,
  q.status,
  q.priority,
  q.estimated_duration,
  q.estimated_call_time,
  CASE 
    WHEN q.queue_number IN ('M001', 'M002') THEN (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างซ่อมอาวุโส')
    ELSE NULL
  END AS served_by_employee_id,
  q.note,
  q.feedback,
  q.rating,
  q.created_at,
  q.updated_at,
  q.served_at,
  q.completed_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('M001'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 45::integer, NOW() - INTERVAL '5 days' + INTERVAL '30 minutes', 'เปลี่ยนจอ iPhone 14 Pro'::text, 'ซ่อมเร็ว คุณภาพดี'::text, 5::integer, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '1 hour', NOW() - INTERVAL '5 days' + INTERVAL '30 minutes', NOW() - INTERVAL '5 days' + INTERVAL '1 hour'),
    ('M002'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 30::integer, NOW() - INTERVAL '10 days' + INTERVAL '30 minutes', 'เปลี่ยนแบตเตอรี่ Samsung Galaxy S23'::text, 'บริการดี ราคาเป็นธรรม'::text, 4::integer, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '45 minutes', NOW() - INTERVAL '10 days' + INTERVAL '30 minutes', NOW() - INTERVAL '10 days' + INTERVAL '45 minutes'),
    ('M003'::text, 'waiting'::public.queue_status, 'high'::public.queue_priority, 60::integer, NOW() + INTERVAL '45 minutes', 'ซ่อมช่องชาร์จ Huawei P50'::text, NULL::text, NULL::integer, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes', NULL::timestamp, NULL::timestamp)
) AS q(queue_number, status, priority, estimated_duration, estimated_call_time, note, feedback, rating, created_at, updated_at, served_at, completed_at);

-- Insert queue services
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'mobile_repair_owner'
  LIMIT 1
),
queue_data AS (
  SELECT 
    q.id AS queue_id,
    q.queue_number,
    q.created_at
  FROM queues q
  JOIN shop_data sd ON q.shop_id = sd.shop_id
),
service_data AS (
  SELECT 
    s.id AS service_id,
    s.name,
    s.price
  FROM services s
  JOIN shop_data sd ON s.shop_id = sd.shop_id
)
INSERT INTO queue_services (
  queue_id,
  service_id,
  quantity,
  price,
  created_at
)
SELECT
  qd.queue_id,
  CASE 
    WHEN qd.queue_number = 'M001' THEN (SELECT service_id FROM service_data WHERE name = 'เปลี่ยนจอ iPhone')
    WHEN qd.queue_number = 'M002' THEN (SELECT service_id FROM service_data WHERE name = 'เปลี่ยนแบตเตอรี่ Samsung')
    WHEN qd.queue_number = 'M003' THEN (SELECT service_id FROM service_data WHERE name = 'ซ่อมช่องชาร์จ')
  END AS service_id,
  1 AS quantity,
  CASE 
    WHEN qd.queue_number = 'M001' THEN 2500.00
    WHEN qd.queue_number = 'M002' THEN 1000.00
    WHEN qd.queue_number = 'M003' THEN 700.00
  END AS price,
  qd.created_at
FROM queue_data qd;

-- Insert payments
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'mobile_repair_owner'
  LIMIT 1
),
queue_data AS (
  SELECT 
    q.id AS queue_id,
    q.queue_number,
    q.completed_at
  FROM queues q
  JOIN shop_data sd ON q.shop_id = sd.shop_id
  WHERE q.status = 'completed'::public.queue_status
),
employee_data AS (
  SELECT 
    e.id AS employee_id,
    e.position_text
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
)
INSERT INTO payments (
  queue_id,
  total_amount,
  paid_amount,
  payment_status,
  payment_method,
  processed_by_employee_id,
  payment_date,
  created_at,
  updated_at
)
SELECT
  qd.queue_id,
  CASE 
    WHEN qd.queue_number = 'M001' THEN 2500.00
    WHEN qd.queue_number = 'M002' THEN 1000.00
  END AS total_amount,
  CASE 
    WHEN qd.queue_number = 'M001' THEN 2500.00
    WHEN qd.queue_number = 'M002' THEN 1000.00
  END AS paid_amount,
  'paid'::public.payment_status AS payment_status,
  CASE 
    WHEN qd.queue_number = 'M001' THEN 'card'::public.payment_method
    WHEN qd.queue_number = 'M002' THEN 'cash'::public.payment_method
  END AS payment_method,
  (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างซ่อมอาวุโส' LIMIT 1) AS processed_by_employee_id,
  qd.completed_at,
  qd.completed_at,
  qd.completed_at
FROM queue_data qd
WHERE qd.queue_number IN ('M001', 'M002');

-- Insert payment items
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'mobile_repair_owner'
  LIMIT 1
),
service_data AS (
  SELECT 
    s.id AS service_id,
    s.name,
    s.price
  FROM services s
  JOIN shop_data sd ON s.shop_id = sd.shop_id
),
payment_data AS (
  SELECT 
    p.id AS payment_id,
    p.queue_id,
    p.created_at
  FROM payments p
  JOIN queues q ON p.queue_id = q.id
  JOIN shop_data sd ON q.shop_id = sd.shop_id
),
queue_data AS (
  SELECT 
    q.id AS queue_id,
    q.queue_number
  FROM queues q
  JOIN shop_data sd ON q.shop_id = sd.shop_id
)
INSERT INTO payment_items (
  payment_id,
  service_id,
  name,
  price,
  quantity,
  total,
  created_at
)
SELECT
  pd.payment_id,
  CASE 
    WHEN qd.queue_number = 'M001' THEN (SELECT service_id FROM service_data WHERE name = 'เปลี่ยนจอ iPhone')
    WHEN qd.queue_number = 'M002' THEN (SELECT service_id FROM service_data WHERE name = 'เปลี่ยนแบตเตอรี่ Samsung')
  END AS service_id,
  CASE 
    WHEN qd.queue_number = 'M001' THEN 'เปลี่ยนจอ iPhone'
    WHEN qd.queue_number = 'M002' THEN 'เปลี่ยนแบตเตอรี่ Samsung'
  END AS name,
  CASE 
    WHEN qd.queue_number = 'M001' THEN 2500.00
    WHEN qd.queue_number = 'M002' THEN 1000.00
  END AS price,
  1 AS quantity,
  CASE 
    WHEN qd.queue_number = 'M001' THEN 2500.00
    WHEN qd.queue_number = 'M002' THEN 1000.00
  END AS total,
  pd.created_at
FROM payment_data pd
JOIN queue_data qd ON pd.queue_id = qd.queue_id
WHERE qd.queue_number IN ('M001', 'M002');

-- Insert shop settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'mobile_repair_owner'
  LIMIT 1
)
INSERT INTO shop_settings (
  shop_id,
  max_queue_size,
  estimated_service_time,
  allow_advance_booking,
  booking_window_hours,
  auto_confirm_queues,
  cancellation_deadline,
  maintenance_mode,
  allow_registration,
  require_email_verification,
  session_timeout,
  backup_frequency,
  log_level,
  data_retention_days,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  30,
  45,
  true,
  72,
  true,
  60,
  false,
  true,
  false,
  45,
  'daily',
  'info',
  180,
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM shop_data sd;

-- Insert notification settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'mobile_repair_owner'
  LIMIT 1
)
INSERT INTO notification_settings (
  shop_id,
  email_notifications,
  sms_notifications,
  push_notifications,
  new_queue,
  queue_update,
  shift_reminder,
  system_alerts,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  true AS email_notifications,
  true AS sms_notifications,
  true AS push_notifications,
  true AS new_queue,
  true AS queue_update,
  true AS shift_reminder,
  true AS system_alerts,
  NOW() - INTERVAL '12 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd;

-- Insert customer points
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'mobile_repair_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name,
    c.last_visit
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
)
INSERT INTO customer_points (
  shop_id,
  customer_id,
  current_points,
  total_earned,
  total_redeemed,
  membership_tier,
  tier_benefits,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  cd.customer_id,
  CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN 125
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN 50
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN 200
  END AS current_points,
  CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN 125
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN 50
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN 200
  END AS total_earned,
  0 AS total_redeemed,
  CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN 'silver'::public.membership_tier
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN 'bronze'::public.membership_tier
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN 'gold'::public.membership_tier
  END AS membership_tier,
  CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN ARRAY['10% discount', 'Priority service']
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN ARRAY['5% discount', 'Birthday gift']
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN ARRAY['15% discount', 'Priority service', 'Free diagnostic']
  END AS tier_benefits,
  CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN NOW() - INTERVAL '4 months'
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN NOW() - INTERVAL '3 months'
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN NOW() - INTERVAL '6 months'
  END AS created_at,
  cd.last_visit AS updated_at
FROM shop_data sd
CROSS JOIN customer_data cd;

-- Insert rewards
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'mobile_repair_owner'
  LIMIT 1
)
INSERT INTO rewards (
  shop_id,
  name,
  description,
  type,
  points_required,
  value,
  is_available,
  expiry_days,
  usage_limit,
  icon,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  reward_info.name,
  reward_info.description,
  reward_info.type,
  reward_info.points_required,
  reward_info.value,
  reward_info.is_available,
  reward_info.expiry_days,
  reward_info.usage_limit,
  reward_info.icon,
  NOW() - INTERVAL '12 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('ส่วนลด 10%'::text, 'ส่วนลด 10% สำหรับการซ่อมครั้งต่อไป'::text, 'discount'::public.reward_type, 100::integer, 10.00::numeric, true::boolean, 90::integer, 1::integer, '🏷️'::text),
    ('ตรวจสอบฟรี'::text, 'บริการตรวจสอบเครื่องฟรี 1 ครั้ง'::text, 'free_item'::public.reward_type, 50::integer, 100.00::numeric, true::boolean, 60::integer, 1::integer, '🔍'::text),
    ('ส่วนลด 20%'::text, 'ส่วนลด 20% สำหรับสมาชิก VIP'::text, 'discount'::public.reward_type, 200::integer, 20.00::numeric, true::boolean, 120::integer, 1::integer, '⭐'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert username: laundry_owner for laundry shop owner
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
    (
        '93000000-0000-0000-0000-000000000000',
        '93000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'laundry_owner@example.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "laundry_owner",
          "full_name": "Laundry Owner",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'laundry_owner@example.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: washer1 for laundry employee
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
    (
        '93000000-0000-0000-0000-000000000000',
        '93000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'washer1@cleanlaundry.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "washer1",
          "full_name": "นายสมพงษ์ ซักสะอาด",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for washer1
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
WHERE
    email = 'washer1@cleanlaundry.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Insert laundry shop
INSERT INTO shops (
  owner_id,
  name,
  slug,
  description,
  address,
  phone,
  email,
  website,
  logo,
  qr_code_url,
  timezone,
  currency,
  language,
  status,
  created_at,
  updated_at
)
SELECT
  p.id AS owner_id,
  'ร้านซักรีดคลีนแลนดรี้',
  'clean-laundry',
  'บริการซักรีดคุณภาพ ส่งผลงานรวดเร็ว สะอาดหอมสด',
  '321 ถนนพระราม 4 แขวงคลองตัน เขตคลองตัน กรุงเทพฯ 10110',
  '02-777-8888',
  'contact@cleanlaundry.com',
  'https://cleanlaundry.com',
  'https://example.com/laundry-logo.png',
  'https://example.com/laundry-qr.png',
  'Asia/Bangkok',
  'THB',
  'th',
  'active',
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM profiles p
WHERE p.username = 'laundry_owner'
LIMIT 1;

-- Link shop to categories
INSERT INTO category_shops (category_id, shop_id, created_at, updated_at)
SELECT 
  c.id AS category_id,
  s.id AS shop_id,
  NOW(),
  NOW()
FROM categories c
CROSS JOIN shops s
JOIN profiles p ON s.owner_id = p.id
WHERE c.slug = 'tailor'
AND p.username = 'laundry_owner';

-- Insert shop opening hours
INSERT INTO shop_opening_hours (shop_id, day_of_week, is_open, open_time, close_time, break_start, break_end, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  day_info.day_of_week,
  day_info.is_open,
  day_info.open_time,
  day_info.close_time,
  day_info.break_start,
  day_info.break_end,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('monday'::text, true, '08:00:00'::time, '20:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('tuesday'::text, true, '08:00:00'::time, '20:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('wednesday'::text, true, '08:00:00'::time, '20:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('thursday'::text, true, '08:00:00'::time, '20:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('friday'::text, true, '08:00:00'::time, '20:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('saturday'::text, true, '08:00:00'::time, '19:00:00'::time, '12:00:00'::time, '13:00:00'::time),
    ('sunday'::text, true, '09:00:00'::time, '18:00:00'::time, '12:00:00'::time, '13:00:00'::time)
) AS day_info(day_of_week, is_open, open_time, close_time, break_start, break_end)
WHERE p.username = 'laundry_owner';

-- Insert services for the laundry shop
INSERT INTO services (shop_id, name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  service_info.name,
  service_info.slug,
  service_info.description,
  service_info.price,
  service_info.estimated_duration,
  service_info.category,
  service_info.is_available,
  service_info.icon,
  service_info.popularity_rank,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('ซักรีดเสื้อเชิ้ต'::text, 'shirt-wash-iron'::text, 'ซักรีดเสื้อเชิ้ตธรรมดา รีดเรียบร้อย'::text, 40.00::numeric, 1440::integer, 'wash_iron'::text, true::boolean, '👔'::text, 1::integer),
    ('ซักรีดกางเกง'::text, 'pants-wash-iron'::text, 'ซักรีดกางเกงทุกประเภท รีดพับเรียบร้อย'::text, 50.00::numeric, 1440::integer, 'wash_iron'::text, true::boolean, '👖'::text, 2::integer),
    ('ซักรีดชุดสูท'::text, 'suit-wash-iron'::text, 'ซักรีดชุดสูท ดูแลพิเศษ รีดให้เรียบร้อย'::text, 200.00::numeric, 2880::integer, 'suit'::text, true::boolean, '🤵'::text, 3::integer),
    ('ซักรีดชุดกระโปรง'::text, 'dress-wash-iron'::text, 'ซักรีดชุดกระโปรง ดูแลผ้าอย่างดี'::text, 80.00::numeric, 1440::integer, 'dress'::text, true::boolean, '👗'::text, 4::integer),
    ('ซักแห้ง'::text, 'dry-clean'::text, 'บริการซักแห้งสำหรับผ้าพิเศษ'::text, 150.00::numeric, 2880::integer, 'dry_clean'::text, true::boolean, '🧥'::text, 5::integer),
    ('รีดอย่างเดียว'::text, 'iron-only'::text, 'บริการรีดผ้าอย่างเดียว'::text, 20.00::numeric, 30::integer, 'iron'::text, true::boolean, '🔥'::text, 6::integer),
    ('ซักผ้าห่ม'::text, 'blanket-wash'::text, 'ซักผ้าห่มขนาดใหญ่'::text, 120.00::numeric, 2880::integer, 'blanket'::text, true::boolean, '🛏️'::text, 7::integer),
    ('ซักผ้าม่าน'::text, 'curtain-wash'::text, 'ซักผ้าม่านทุกขนาด'::text, 100.00::numeric, 2880::integer, 'curtain'::text, true::boolean, '🪟'::text, 8::integer)
) AS service_info(name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank)
WHERE p.username = 'laundry_owner';

-- Insert departments
INSERT INTO departments (shop_id, name, slug, description, employee_count, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  dept_info.name,
  dept_info.slug,
  dept_info.description,
  dept_info.employee_count,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('ซักรีด'::text, 'wash-iron'::text, 'แผนกซักรีดหลัก'::text, 2::integer),
    ('ต้อนรับ'::text, 'reception'::text, 'แผนกต้อนรับลูกค้า'::text, 1::integer)
) AS dept_info(name, slug, description, employee_count)
WHERE p.username = 'laundry_owner';

-- Insert employees
INSERT INTO employees (
  shop_id,
  profile_id,
  employee_code,
  name,
  email,
  phone,
  position_text,
  department_id,
  salary,
  hire_date,
  status,
  station_number,
  is_on_duty,
  last_login,
  permissions,
  notes,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  p.id AS profile_id,
  emp_info.employee_code,
  emp_info.name,
  emp_info.email,
  emp_info.phone,
  emp_info.position_text,
  d.id AS department_id,
  emp_info.salary,
  emp_info.hire_date,
  emp_info.status::public.employee_status,
  emp_info.station_number,
  emp_info.is_on_duty,
  emp_info.last_login,
  emp_info.permissions,
  emp_info.notes,
  emp_info.created_at,
  emp_info.updated_at
FROM shops s
JOIN profiles p1 ON s.owner_id = p1.id
CROSS JOIN (
  VALUES 
    ('WASH001', 'washer1', 'นายสมพงษ์ ซักสะอาด', 'washer1@cleanlaundry.com', '081-777-8888', 'ช่างซักรีดหลัก', 20000.00, '2023-05-01'::date, 'active', 1, true, NOW() - INTERVAL '1 day', ARRAY['manage_queues','manage_customers','manage_services'], 'ช่างซักรีดที่มีประสบการณ์ 5 ปี', NOW() - INTERVAL '8 months', NOW())
) AS emp_info(employee_code, username, name, email, phone, position_text, salary, hire_date, status, station_number, is_on_duty, last_login, permissions, notes, created_at, updated_at)
JOIN profiles p ON p.username = emp_info.username
JOIN departments d ON d.shop_id = s.id AND d.name = 'ซักรีด'
WHERE p1.username = 'laundry_owner';

-- Insert customers
INSERT INTO customers (
  shop_id,
  name,
  phone,
  email,
  date_of_birth,
  gender,
  address,
  notes,
  last_visit,
  is_active,
  profile_id,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  cust_info.name,
  cust_info.phone,
  cust_info.email,
  cust_info.date_of_birth,
  cust_info.gender,
  cust_info.address,
  cust_info.notes,
  cust_info.last_visit,
  cust_info.is_active,
  cust_info.profile_id,
  cust_info.created_at,
  cust_info.updated_at
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('คุณสมศรี ใส่สะอาด'::text, '089-555-1111'::text, 'somsri@example.com'::text, '1987-03-12'::date, 'female'::text, '111 ถนนสุขุมวิท กรุงเทพฯ'::text, 'ลูกค้าประจำ ส่งเสื้อเชิ้ตทุกสัปดาห์'::text, NOW() - INTERVAL '3 days', true::boolean, NULL::uuid, NOW() - INTERVAL '6 months', NOW() - INTERVAL '3 days'),
    ('คุณวิชัย เรียบร้อย'::text, '088-666-2222'::text, 'wichai@example.com'::text, '1982-11-08'::date, 'male'::text, '222 ถนนพระราม 4 กรุงเทพฯ'::text, 'ชอบรีดให้เรียบมาก'::text, NOW() - INTERVAL '7 days', true::boolean, NULL::uuid, NOW() - INTERVAL '4 months', NOW() - INTERVAL '7 days'),
    ('คุณมาลี สะอาดใส'::text, '087-777-3333'::text, 'malee@example.com'::text, '1990-06-25'::date, 'female'::text, '333 ถนนเพชรบุรี กรุงเทพฯ'::text, 'ส่งชุดสูทบ่อย'::text, NOW() - INTERVAL '14 days', true::boolean, NULL::uuid, NOW() - INTERVAL '3 months', NOW() - INTERVAL '14 days')
) AS cust_info(name, phone, email, date_of_birth, gender, address, notes, last_visit, is_active, profile_id, created_at, updated_at)
WHERE p.username = 'laundry_owner';

-- Insert queues
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'laundry_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
),
employee_data AS (
  SELECT 
    e.id AS employee_id,
    e.position_text
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
)
INSERT INTO queues (
  shop_id,
  customer_id,
  queue_number,
  status,
  priority,
  estimated_duration,
  estimated_call_time,
  served_by_employee_id,
  note,
  feedback,
  rating,
  created_at,
  updated_at,
  served_at,
  completed_at
)
SELECT
  sd.shop_id,
  CASE 
    WHEN q.queue_number = 'L001' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณสมศรี ใส่สะอาด')
    WHEN q.queue_number = 'L002' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณวิชัย เรียบร้อย')
    WHEN q.queue_number = 'L003' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณมาลี สะอาดใส')
  END AS customer_id,
  q.queue_number,
  q.status,
  q.priority,
  q.estimated_duration,
  q.estimated_call_time,
  CASE 
    WHEN q.queue_number IN ('L001', 'L002') THEN (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างซักรีดหลัก')
    ELSE NULL
  END AS served_by_employee_id,
  q.note,
  q.feedback,
  q.rating,
  q.created_at,
  q.updated_at,
  q.served_at,
  q.completed_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('L001'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 1440::integer, NOW() - INTERVAL '3 days' + INTERVAL '30 minutes', 'เสื้อเชิ้ต 5 ตัว'::text, 'รีดเรียบร้อยมาก'::text, 5::integer, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '1 day', NOW() - INTERVAL '3 days' + INTERVAL '30 minutes', NOW() - INTERVAL '2 days'),
    ('L002'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 1440::integer, NOW() - INTERVAL '7 days' + INTERVAL '30 minutes', 'กางเกง 3 ตัว'::text, 'บริการดี'::text, 4::integer, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '1 day', NOW() - INTERVAL '7 days' + INTERVAL '30 minutes', NOW() - INTERVAL '6 days'),
    ('L003'::text, 'serving'::public.queue_status, 'high'::public.queue_priority, 2880::integer, NOW() + INTERVAL '1 day', 'ชุดสูท 1 ชุด'::text, NULL::text, NULL::integer, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day', NOW() - INTERVAL '30 minutes', NULL::timestamp)
) AS q(queue_number, status, priority, estimated_duration, estimated_call_time, note, feedback, rating, created_at, updated_at, served_at, completed_at);

-- Insert shop settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'laundry_owner'
  LIMIT 1
)
INSERT INTO shop_settings (
  shop_id,
  max_queue_size,
  estimated_service_time,
  allow_advance_booking,
  booking_window_hours,
  auto_confirm_queues,
  cancellation_deadline,
  maintenance_mode,
  allow_registration,
  require_email_verification,
  session_timeout,
  backup_frequency,
  log_level,
  data_retention_days,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  40,
  1440,
  true,
  168,
  true,
  120,
  false,
  true,
  false,
  60,
  'daily',
  'info',
  180,
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM shop_data sd;

-- Insert customer points
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'laundry_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name,
    c.last_visit
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
)
INSERT INTO customer_points (
  shop_id,
  customer_id,
  current_points,
  total_earned,
  total_redeemed,
  membership_tier,
  tier_benefits,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  cd.customer_id,
  CASE 
    WHEN cd.name = 'คุณสมศรี ใส่สะอาด' THEN 80
    WHEN cd.name = 'คุณวิชัย เรียบร้อย' THEN 60
    WHEN cd.name = 'คุณมาลี สะอาดใส' THEN 120
  END AS current_points,
  CASE 
    WHEN cd.name = 'คุณสมศรี ใส่สะอาด' THEN 80
    WHEN cd.name = 'คุณวิชัย เรียบร้อย' THEN 60
    WHEN cd.name = 'คุณมาลี สะอาดใส' THEN 120
  END AS total_earned,
  0 AS total_redeemed,
  CASE 
    WHEN cd.name = 'คุณสมศรี ใส่สะอาด' THEN 'silver'::public.membership_tier
    WHEN cd.name = 'คุณวิชัย เรียบร้อย' THEN 'bronze'::public.membership_tier
    WHEN cd.name = 'คุณมาลี สะอาดใส' THEN 'gold'::public.membership_tier
  END AS membership_tier,
  CASE 
    WHEN cd.name = 'คุณสมศรี ใส่สะอาด' THEN ARRAY['10% discount', 'Express service']
    WHEN cd.name = 'คุณวิชัย เรียบร้อย' THEN ARRAY['5% discount', 'Birthday gift']
    WHEN cd.name = 'คุณมาลี สะอาดใส' THEN ARRAY['15% discount', 'Priority service', 'Free pickup']
  END AS tier_benefits,
  CASE 
    WHEN cd.name = 'คุณสมศรี ใส่สะอาด' THEN NOW() - INTERVAL '6 months'
    WHEN cd.name = 'คุณวิชัย เรียบร้อย' THEN NOW() - INTERVAL '4 months'
    WHEN cd.name = 'คุณมาลี สะอาดใส' THEN NOW() - INTERVAL '3 months'
  END AS created_at,
  cd.last_visit AS updated_at
FROM shop_data sd
CROSS JOIN customer_data cd;

-- Insert rewards
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'laundry_owner'
  LIMIT 1
)
INSERT INTO rewards (
  shop_id,
  name,
  description,
  type,
  points_required,
  value,
  is_available,
  expiry_days,
  usage_limit,
  icon,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  reward_info.name,
  reward_info.description,
  reward_info.type,
  reward_info.points_required,
  reward_info.value,
  reward_info.is_available,
  reward_info.expiry_days,
  reward_info.usage_limit,
  reward_info.icon,
  NOW() - INTERVAL '12 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('ส่วนลด 10%'::text, 'ส่วนลด 10% สำหรับการซักรีดครั้งต่อไป'::text, 'discount'::public.reward_type, 50::integer, 10.00::numeric, true::boolean, 90::integer, 1::integer, '🏷️'::text),
    ('รีดฟรี 1 ชิ้น'::text, 'บริการรีดฟรี 1 ชิ้น'::text, 'free_item'::public.reward_type, 100::integer, 20.00::numeric, true::boolean, 60::integer, 1::integer, '🔥'::text),
    ('ส่วนลด 20%'::text, 'ส่วนลด 20% สำหรับสมาชิก VIP'::text, 'discount'::public.reward_type, 150::integer, 20.00::numeric, true::boolean, 120::integer, 1::integer, '⭐'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert username: beauty_owner for beauty salon owner
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
    (
        '94000000-0000-0000-0000-000000000000',
        '94000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'beauty_owner@example.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "beauty_owner",
          "full_name": "Beauty Salon Owner",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'beauty_owner@example.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: beautician1 for beauty salon employee
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
    (
        '94000000-0000-0000-0000-000000000000',
        '94000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'beautician1@beautyworld.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "beautician1",
          "full_name": "นางสาวสุดา ความงาม",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for beautician1
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
WHERE
    email = 'beautician1@beautyworld.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Insert beauty salon shop
INSERT INTO shops (
  owner_id,
  name,
  slug,
  description,
  address,
  phone,
  email,
  website,
  logo,
  qr_code_url,
  timezone,
  currency,
  language,
  status,
  created_at,
  updated_at
)
SELECT
  p.id AS owner_id,
  'บิวตี้เวิลด์ สาลอน',
  'beauty-world',
  'ศูนย์ความงามครบวงจร บริการมืออาชีพ ผลิตภัณฑ์คุณภาพ',
  '555 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
  '02-999-1234',
  'contact@beautyworld.com',
  'https://beautyworld.com',
  'https://example.com/beauty-logo.png',
  'https://example.com/beauty-qr.png',
  'Asia/Bangkok',
  'THB',
  'th',
  'active',
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM profiles p
WHERE p.username = 'beauty_owner'
LIMIT 1;

-- Link shop to categories
INSERT INTO category_shops (category_id, shop_id, created_at, updated_at)
SELECT 
  c.id AS category_id,
  s.id AS shop_id,
  NOW(),
  NOW()
FROM categories c
CROSS JOIN shops s
JOIN profiles p ON s.owner_id = p.id
WHERE c.slug = 'beauty'
AND p.username = 'beauty_owner';

-- Insert shop opening hours
INSERT INTO shop_opening_hours (shop_id, day_of_week, is_open, open_time, close_time, break_start, break_end, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  day_info.day_of_week,
  day_info.is_open,
  day_info.open_time,
  day_info.close_time,
  day_info.break_start,
  day_info.break_end,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('monday'::text, true, '10:00:00'::time, '20:00:00'::time, '14:00:00'::time, '15:00:00'::time),
    ('tuesday'::text, true, '10:00:00'::time, '20:00:00'::time, '14:00:00'::time, '15:00:00'::time),
    ('wednesday'::text, true, '10:00:00'::time, '20:00:00'::time, '14:00:00'::time, '15:00:00'::time),
    ('thursday'::text, true, '10:00:00'::time, '20:00:00'::time, '14:00:00'::time, '15:00:00'::time),
    ('friday'::text, true, '10:00:00'::time, '21:00:00'::time, '14:00:00'::time, '15:00:00'::time),
    ('saturday'::text, true, '09:00:00'::time, '21:00:00'::time, '14:00:00'::time, '15:00:00'::time),
    ('sunday'::text, true, '10:00:00'::time, '19:00:00'::time, '14:00:00'::time, '15:00:00'::time)
) AS day_info(day_of_week, is_open, open_time, close_time, break_start, break_end)
WHERE p.username = 'beauty_owner';

-- Insert services for the beauty salon
INSERT INTO services (shop_id, name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  service_info.name,
  service_info.slug,
  service_info.description,
  service_info.price,
  service_info.estimated_duration,
  service_info.category,
  service_info.is_available,
  service_info.icon,
  service_info.popularity_rank,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('ทำเล็บมือ'::text, 'manicure'::text, 'บริการทำเล็บมือ ตัดแต่งเล็บ ทาสี'::text, 300.00::numeric, 60::integer, 'nail'::text, true::boolean, '💅'::text, 1::integer),
    ('ทำเล็บเท้า'::text, 'pedicure'::text, 'บริการทำเล็บเท้า ตัดแต่งเล็บ ทาสี'::text, 350.00::numeric, 75::integer, 'nail'::text, true::boolean, '🦶'::text, 2::integer),
    ('ต่อเล็บเจล'::text, 'gel-nail-extension'::text, 'บริการต่อเล็บเจล ทำลาย สวยงาม'::text, 800.00::numeric, 120::integer, 'nail'::text, true::boolean, '✨'::text, 3::integer),
    ('ทำผมสี'::text, 'hair-coloring'::text, 'บริการทำสีผม สีสวย ติดทน'::text, 1500.00::numeric, 180::integer, 'hair'::text, true::boolean, '🎨'::text, 4::integer),
    ('ดัดผม'::text, 'hair-perm'::text, 'บริการดัดผม ลอนสวย ธรรมชาติ'::text, 1200.00::numeric, 150::integer, 'hair'::text, true::boolean, '🌀'::text, 5::integer),
    ('ยืดผม'::text, 'hair-straightening'::text, 'บริการยืดผม เรียบตรง เงางาม'::text, 1000.00::numeric, 120::integer, 'hair'::text, true::boolean, '📏'::text, 6::integer),
    ('ทรีทเมนต์ผม'::text, 'hair-treatment'::text, 'บริการบำรุงผม ฟื้นฟูเส้นผม'::text, 600.00::numeric, 90::integer, 'hair'::text, true::boolean, '💆'::text, 7::integer),
    ('แต่งหน้า'::text, 'makeup'::text, 'บริการแต่งหน้า สำหรับงานพิเศษ'::text, 800.00::numeric, 90::integer, 'makeup'::text, true::boolean, '💄'::text, 8::integer),
    ('ขัดผิวหน้า'::text, 'facial-scrub'::text, 'บริการขัดผิวหน้า ผิวใส เนียนนุ่ม'::text, 500.00::numeric, 60::integer, 'facial'::text, true::boolean, '✨'::text, 9::integer),
    ('มาส์กหน้า'::text, 'facial-mask'::text, 'บริการมาส์กหน้า บำรุงผิว'::text, 400.00::numeric, 45::integer, 'facial'::text, true::boolean, '🧴'::text, 10::integer)
) AS service_info(name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank)
WHERE p.username = 'beauty_owner';

-- Insert departments
INSERT INTO departments (shop_id, name, slug, description, employee_count, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  dept_info.name,
  dept_info.slug,
  dept_info.description,
  dept_info.employee_count,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('เล็บ'::text, 'nail'::text, 'แผนกทำเล็บ'::text, 2::integer),
    ('ผม'::text, 'hair'::text, 'แผนกทำผม'::text, 2::integer),
    ('หน้า'::text, 'facial'::text, 'แผนกดูแลผิวหน้า'::text, 1::integer)
) AS dept_info(name, slug, description, employee_count)
WHERE p.username = 'beauty_owner';

-- Insert employees
INSERT INTO employees (
  shop_id,
  profile_id,
  employee_code,
  name,
  email,
  phone,
  position_text,
  department_id,
  salary,
  hire_date,
  status,
  station_number,
  is_on_duty,
  last_login,
  permissions,
  notes,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  p.id AS profile_id,
  emp_info.employee_code,
  emp_info.name,
  emp_info.email,
  emp_info.phone,
  emp_info.position_text,
  d.id AS department_id,
  emp_info.salary,
  emp_info.hire_date,
  emp_info.status::public.employee_status,
  emp_info.station_number,
  emp_info.is_on_duty,
  emp_info.last_login,
  emp_info.permissions,
  emp_info.notes,
  emp_info.created_at,
  emp_info.updated_at
FROM shops s
JOIN profiles p1 ON s.owner_id = p1.id
CROSS JOIN (
  VALUES 
    ('BEAUTY001', 'beautician1', 'นางสาวสุดา ความงาม', 'beautician1@beautyworld.com', '081-999-1111', 'ช่างทำเล็บหลัก', 25000.00, '2023-04-01'::date, 'active', 1, true, NOW() - INTERVAL '1 day', ARRAY['manage_queues','manage_customers','manage_services'], 'ช่างทำเล็บมืออาชีพ มีประสบการณ์ 7 ปี', NOW() - INTERVAL '9 months', NOW())
) AS emp_info(employee_code, username, name, email, phone, position_text, salary, hire_date, status, station_number, is_on_duty, last_login, permissions, notes, created_at, updated_at)
JOIN profiles p ON p.username = emp_info.username
JOIN departments d ON d.shop_id = s.id AND d.name = 'เล็บ'
WHERE p1.username = 'beauty_owner';

-- Insert customers
INSERT INTO customers (
  shop_id,
  name,
  phone,
  email,
  date_of_birth,
  gender,
  address,
  notes,
  last_visit,
  is_active,
  profile_id,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  cust_info.name,
  cust_info.phone,
  cust_info.email,
  cust_info.date_of_birth,
  cust_info.gender,
  cust_info.address,
  cust_info.notes,
  cust_info.last_visit,
  cust_info.is_active,
  cust_info.profile_id,
  cust_info.created_at,
  cust_info.updated_at
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('คุณปราณี สวยงาม'::text, '089-111-1111'::text, 'pranee@example.com'::text, '1985-08-15'::date, 'female'::text, '123 ถนนสีลม กรุงเทพฯ'::text, 'ลูกค้าประจำ ชอบทำเล็บสีแดง'::text, NOW() - INTERVAL '5 days', true::boolean, NULL::uuid, NOW() - INTERVAL '8 months', NOW() - INTERVAL '5 days'),
    ('คุณสุภาพร เปล่งปลั่ง'::text, '088-222-2222'::text, 'supaporn@example.com'::text, '1992-12-03'::date, 'female'::text, '456 ถนนเพชรบุรี กรุงเทพฯ'::text, 'ชอบทำผมสีน้ำตาล'::text, NOW() - INTERVAL '10 days', true::boolean, NULL::uuid, NOW() - INTERVAL '6 months', NOW() - INTERVAL '10 days'),
    ('คุณมณีรัตน์ ใสสะอาด'::text, '087-333-3333'::text, 'maneerat@example.com'::text, '1988-05-20'::date, 'female'::text, '789 ถนนสุขุมวิท กรุงเทพฯ'::text, 'ชอบบริการดูแลผิวหน้า'::text, NOW() - INTERVAL '15 days', true::boolean, NULL::uuid, NOW() - INTERVAL '4 months', NOW() - INTERVAL '15 days')
) AS cust_info(name, phone, email, date_of_birth, gender, address, notes, last_visit, is_active, profile_id, created_at, updated_at)
WHERE p.username = 'beauty_owner';

-- Insert queues
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'beauty_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
),
employee_data AS (
  SELECT 
    e.id AS employee_id,
    e.position_text
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
)
INSERT INTO queues (
  shop_id,
  customer_id,
  queue_number,
  status,
  priority,
  estimated_duration,
  estimated_call_time,
  served_by_employee_id,
  note,
  feedback,
  rating,
  created_at,
  updated_at,
  served_at,
  completed_at
)
SELECT
  sd.shop_id,
  CASE 
    WHEN q.queue_number = 'B001' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณปราณี สวยงาม')
    WHEN q.queue_number = 'B002' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณสุภาพร เปล่งปลั่ง')
    WHEN q.queue_number = 'B003' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณมณีรัตน์ ใสสะอาด')
  END AS customer_id,
  q.queue_number,
  q.status,
  q.priority,
  q.estimated_duration,
  q.estimated_call_time,
  CASE 
    WHEN q.queue_number IN ('B001', 'B002') THEN (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างทำเล็บหลัก')
    ELSE NULL
  END AS served_by_employee_id,
  q.note,
  q.feedback,
  q.rating,
  q.created_at,
  q.updated_at,
  q.served_at,
  q.completed_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('B001'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 60::integer, NOW() - INTERVAL '5 days' + INTERVAL '30 minutes', 'ทำเล็บมือสีแดง'::text, 'สวยมาก พอใจ'::text, 5::integer, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '1 hour', NOW() - INTERVAL '5 days' + INTERVAL '30 minutes', NOW() - INTERVAL '5 days' + INTERVAL '1 hour'),
    ('B002'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 180::integer, NOW() - INTERVAL '10 days' + INTERVAL '30 minutes', 'ทำผมสีน้ำตาล'::text, 'บริการดีมาก'::text, 4::integer, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '3 hours', NOW() - INTERVAL '10 days' + INTERVAL '30 minutes', NOW() - INTERVAL '10 days' + INTERVAL '3 hours'),
    ('B003'::text, 'waiting'::public.queue_status, 'high'::public.queue_priority, 60::integer, NOW() + INTERVAL '45 minutes', 'ขัดผิวหน้า'::text, NULL::text, NULL::integer, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes', NULL::timestamp, NULL::timestamp)
) AS q(queue_number, status, priority, estimated_duration, estimated_call_time, note, feedback, rating, created_at, updated_at, served_at, completed_at);

-- Insert customer points
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'beauty_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name,
    c.last_visit
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
)
INSERT INTO customer_points (
  shop_id,
  customer_id,
  current_points,
  total_earned,
  total_redeemed,
  membership_tier,
  tier_benefits,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  cd.customer_id,
  CASE 
    WHEN cd.name = 'คุณปราณี สวยงาม' THEN 150
    WHEN cd.name = 'คุณสุภาพร เปล่งปลั่ง' THEN 200
    WHEN cd.name = 'คุณมณีรัตน์ ใสสะอาด' THEN 100
  END AS current_points,
  CASE 
    WHEN cd.name = 'คุณปราณี สวยงาม' THEN 150
    WHEN cd.name = 'คุณสุภาพร เปล่งปลั่ง' THEN 200
    WHEN cd.name = 'คุณมณีรัตน์ ใสสะอาด' THEN 100
  END AS total_earned,
  0 AS total_redeemed,
  CASE 
    WHEN cd.name = 'คุณปราณี สวยงาม' THEN 'gold'::public.membership_tier
    WHEN cd.name = 'คุณสุภาพร เปล่งปลั่ง' THEN 'platinum'::public.membership_tier
    WHEN cd.name = 'คุณมณีรัตน์ ใสสะอาด' THEN 'silver'::public.membership_tier
  END AS membership_tier,
  CASE 
    WHEN cd.name = 'คุณปราณี สวยงาม' THEN ARRAY['15% discount', 'Priority booking', 'Birthday special']
    WHEN cd.name = 'คุณสุภาพร เปล่งปลั่ง' THEN ARRAY['20% discount', 'VIP treatment', 'Free consultation']
    WHEN cd.name = 'คุณมณีรัตน์ ใสสะอาด' THEN ARRAY['10% discount', 'Birthday gift']
  END AS tier_benefits,
  CASE 
    WHEN cd.name = 'คุณปราณี สวยงาม' THEN NOW() - INTERVAL '8 months'
    WHEN cd.name = 'คุณสุภาพร เปล่งปลั่ง' THEN NOW() - INTERVAL '6 months'
    WHEN cd.name = 'คุณมณีรัตน์ ใสสะอาด' THEN NOW() - INTERVAL '4 months'
  END AS created_at,
  cd.last_visit AS updated_at
FROM shop_data sd
CROSS JOIN customer_data cd;

-- Insert rewards
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'beauty_owner'
  LIMIT 1
)
INSERT INTO rewards (
  shop_id,
  name,
  description,
  type,
  points_required,
  value,
  is_available,
  expiry_days,
  usage_limit,
  icon,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  reward_info.name,
  reward_info.description,
  reward_info.type,
  reward_info.points_required,
  reward_info.value,
  reward_info.is_available,
  reward_info.expiry_days,
  reward_info.usage_limit,
  reward_info.icon,
  NOW() - INTERVAL '12 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('ส่วนลด 15%'::text, 'ส่วนลด 15% สำหรับบริการความงาม'::text, 'discount'::public.reward_type, 100::integer, 15.00::numeric, true::boolean, 90::integer, 1::integer, '🏷️'::text),
    ('ทำเล็บฟรี'::text, 'บริการทำเล็บมือฟรี 1 ครั้ง'::text, 'free_item'::public.reward_type, 150::integer, 300.00::numeric, true::boolean, 60::integer, 1::integer, '💅'::text),
    ('ส่วนลด 25%'::text, 'ส่วนลด 25% สำหรับสมาชิก VIP'::text, 'discount'::public.reward_type, 200::integer, 25.00::numeric, true::boolean, 120::integer, 1::integer, '⭐'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert username: spa_owner for spa owner
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
    (
        '95000000-0000-0000-0000-000000000000',
        '95000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'spa_owner@example.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "spa_owner",
          "full_name": "Spa Owner",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for the user
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
WHERE
    email = 'spa_owner@example.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: therapist1 for spa therapist
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
    (
        '95000000-0000-0000-0000-000000000000',
        '95000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'therapist1@relaxspa.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "therapist1",
          "full_name": "นางสาวสุขใจ ผ่อนคลาย",
          "role": "user",
          "is_active": true
        }',
        NOW() - INTERVAL '30 days',
        NOW() - INTERVAL '30 days',
        '',
        '',
        '',
        ''
    );

-- Create identities for therapist1
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
WHERE
    email = 'therapist1@relaxspa.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Insert spa shop
INSERT INTO shops (
  owner_id,
  name,
  slug,
  description,
  address,
  phone,
  email,
  website,
  logo,
  qr_code_url,
  timezone,
  currency,
  language,
  status,
  created_at,
  updated_at
)
SELECT
  p.id AS owner_id,
  'รีแลกซ์ สปา แอนด์ เวลเนส',
  'relax-spa',
  'สปาและเวลเนสครบวงจร บริการนวดผ่อนคลาย บรรยากาศสงบ',
  '777 ถนนวิทยุ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330',
  '02-888-7777',
  'contact@relaxspa.com',
  'https://relaxspa.com',
  'https://example.com/spa-logo.png',
  'https://example.com/spa-qr.png',
  'Asia/Bangkok',
  'THB',
  'th',
  'active',
  NOW() - INTERVAL '12 months',
  NOW() - INTERVAL '1 day'
FROM profiles p
WHERE p.username = 'spa_owner'
LIMIT 1;

-- Link shop to categories
INSERT INTO category_shops (category_id, shop_id, created_at, updated_at)
SELECT 
  c.id AS category_id,
  s.id AS shop_id,
  NOW(),
  NOW()
FROM categories c
CROSS JOIN shops s
JOIN profiles p ON s.owner_id = p.id
WHERE c.slug = 'spa'
AND p.username = 'spa_owner';

-- Insert shop opening hours
INSERT INTO shop_opening_hours (shop_id, day_of_week, is_open, open_time, close_time, break_start, break_end, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  day_info.day_of_week,
  day_info.is_open,
  day_info.open_time,
  day_info.close_time,
  day_info.break_start,
  day_info.break_end,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('monday'::text, true, '09:00:00'::time, '21:00:00'::time, '13:00:00'::time, '14:00:00'::time),
    ('tuesday'::text, true, '09:00:00'::time, '21:00:00'::time, '13:00:00'::time, '14:00:00'::time),
    ('wednesday'::text, true, '09:00:00'::time, '21:00:00'::time, '13:00:00'::time, '14:00:00'::time),
    ('thursday'::text, true, '09:00:00'::time, '21:00:00'::time, '13:00:00'::time, '14:00:00'::time),
    ('friday'::text, true, '09:00:00'::time, '22:00:00'::time, '13:00:00'::time, '14:00:00'::time),
    ('saturday'::text, true, '08:00:00'::time, '22:00:00'::time, '13:00:00'::time, '14:00:00'::time),
    ('sunday'::text, true, '09:00:00'::time, '20:00:00'::time, '13:00:00'::time, '14:00:00'::time)
) AS day_info(day_of_week, is_open, open_time, close_time, break_start, break_end)
WHERE p.username = 'spa_owner';

-- Insert services for the spa
INSERT INTO services (shop_id, name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  service_info.name,
  service_info.slug,
  service_info.description,
  service_info.price,
  service_info.estimated_duration,
  service_info.category,
  service_info.is_available,
  service_info.icon,
  service_info.popularity_rank,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('นวดแผนไทย'::text, 'thai-massage'::text, 'นวดแผนไทยดั้งเดิม คลายกล้ามเนื้อ ผ่อนคลาย'::text, 800.00::numeric, 90::integer, 'massage'::text, true::boolean, '🙏'::text, 1::integer),
    ('นวดน้ำมันหอมระเหย'::text, 'aromatherapy-massage'::text, 'นวดด้วยน้ำมันหอมระเหย ผ่อนคลายจิตใจ'::text, 1200.00::numeric, 120::integer, 'massage'::text, true::boolean, '🌸'::text, 2::integer),
    ('นวดหินร้อน'::text, 'hot-stone-massage'::text, 'นวดด้วยหินร้อน คลายความตึงเครียด'::text, 1500.00::numeric, 120::integer, 'massage'::text, true::boolean, '🔥'::text, 3::integer),
    ('นวดเท้า'::text, 'foot-massage'::text, 'นวดเท้าและน่อง คลายความเมื่อยล้า'::text, 500.00::numeric, 60::integer, 'massage'::text, true::boolean, '🦶'::text, 4::integer),
    ('ขัดผิวทั้งตัว'::text, 'body-scrub'::text, 'ขัดผิวทั้งตัว ผิวเนียนนุ่ม'::text, 1000.00::numeric, 90::integer, 'body_treatment'::text, true::boolean, '✨'::text, 5::integer),
    ('ครีมอาบน้ำ'::text, 'milk-bath'::text, 'อาบครีมนม บำรุงผิว'::text, 800.00::numeric, 60::integer, 'body_treatment'::text, true::boolean, '🛁'::text, 6::integer),
    ('ทรีทเมนต์หน้า'::text, 'facial-treatment'::text, 'ทรีทเมนต์หน้าแบบครบวงจร'::text, 1200.00::numeric, 90::integer, 'facial'::text, true::boolean, '💆'::text, 7::integer),
    ('มาส์กหน้าทองคำ'::text, 'gold-facial-mask'::text, 'มาส์กหน้าทองคำ บำรุงผิวพิเศษ'::text, 2000.00::numeric, 75::integer, 'facial'::text, true::boolean, '👑'::text, 8::integer),
    ('สปาแพ็คเกจคู่'::text, 'couple-spa-package'::text, 'แพ็คเกจสปาสำหรับคู่รัก'::text, 3000.00::numeric, 180::integer, 'package'::text, true::boolean, '💕'::text, 9::integer),
    ('ดีท็อกซ์บอดี้'::text, 'detox-body-wrap'::text, 'ดีท็อกซ์ร่างกาย ลดความบวม'::text, 1800.00::numeric, 120::integer, 'body_treatment'::text, true::boolean, '🌿'::text, 10::integer)
) AS service_info(name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank)
WHERE p.username = 'spa_owner';

-- Insert departments
INSERT INTO departments (shop_id, name, slug, description, employee_count, created_at, updated_at)
SELECT 
  s.id AS shop_id,
  dept_info.name,
  dept_info.slug,
  dept_info.description,
  dept_info.employee_count,
  NOW(),
  NOW()
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('นวด'::text, 'massage'::text, 'แผนกนวดและบำบัด'::text, 3::integer),
    ('ดูแลผิว'::text, 'skincare'::text, 'แผนกดูแลผิวและทรีทเมนต์'::text, 2::integer),
    ('ต้อนรับ'::text, 'reception'::text, 'แผนกต้อนรับและให้คำปรึกษา'::text, 1::integer)
) AS dept_info(name, slug, description, employee_count)
WHERE p.username = 'spa_owner';

-- Insert employees
INSERT INTO employees (
  shop_id,
  profile_id,
  employee_code,
  name,
  email,
  phone,
  position_text,
  department_id,
  salary,
  hire_date,
  status,
  station_number,
  is_on_duty,
  last_login,
  permissions,
  notes,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  p.id AS profile_id,
  emp_info.employee_code,
  emp_info.name,
  emp_info.email,
  emp_info.phone,
  emp_info.position_text,
  d.id AS department_id,
  emp_info.salary,
  emp_info.hire_date,
  emp_info.status::public.employee_status,
  emp_info.station_number,
  emp_info.is_on_duty,
  emp_info.last_login,
  emp_info.permissions,
  emp_info.notes,
  emp_info.created_at,
  emp_info.updated_at
FROM shops s
JOIN profiles p1 ON s.owner_id = p1.id
CROSS JOIN (
  VALUES 
    ('SPA001', 'therapist1', 'นางสาวสุขใจ ผ่อนคลาย', 'therapist1@relaxspa.com', '081-888-7777', 'นักบำบัดหลัก', 30000.00, '2023-02-15'::date, 'active', 1, true, NOW() - INTERVAL '1 day', ARRAY['manage_queues','manage_customers','manage_services'], 'นักบำบัดมืออาชีพ มีใบรับรองนวดแผนไทย', NOW() - INTERVAL '11 months', NOW())
) AS emp_info(employee_code, username, name, email, phone, position_text, salary, hire_date, status, station_number, is_on_duty, last_login, permissions, notes, created_at, updated_at)
JOIN profiles p ON p.username = emp_info.username
JOIN departments d ON d.shop_id = s.id AND d.name = 'นวด'
WHERE p1.username = 'spa_owner';

-- Insert customers
INSERT INTO customers (
  shop_id,
  name,
  phone,
  email,
  date_of_birth,
  gender,
  address,
  notes,
  last_visit,
  is_active,
  profile_id,
  created_at,
  updated_at
)
SELECT
  s.id AS shop_id,
  cust_info.name,
  cust_info.phone,
  cust_info.email,
  cust_info.date_of_birth,
  cust_info.gender,
  cust_info.address,
  cust_info.notes,
  cust_info.last_visit,
  cust_info.is_active,
  cust_info.profile_id,
  cust_info.created_at,
  cust_info.updated_at
FROM shops s
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('คุณสมหวัง ผ่อนคลาย'::text, '089-888-1111'::text, 'somwang@example.com'::text, '1980-09-12'::date, 'male'::text, '111 ถนนวิทยุ กรุงเทพฯ'::text, 'ลูกค้าประจำ ชอบนวดแผนไทย'::text, NOW() - INTERVAL '7 days', true::boolean, NULL::uuid, NOW() - INTERVAL '10 months', NOW() - INTERVAL '7 days'),
    ('คุณวิมลรัตน์ สบายใจ'::text, '088-777-2222'::text, 'wimonrat@example.com'::text, '1975-04-28'::date, 'female'::text, '222 ถนนเพลินจิต กรุงเทพฯ'::text, 'ชอบนวดน้ำมันหอมระเหย'::text, NOW() - INTERVAL '12 days', true::boolean, NULL::uuid, NOW() - INTERVAL '8 months', NOW() - INTERVAL '12 days'),
    ('คุณประยุทธ์ สุขสบาย'::text, '087-666-3333'::text, 'prayuth@example.com'::text, '1983-11-15'::date, 'male'::text, '333 ถนนราชดำริ กรุงเทพฯ'::text, 'มากับภรรยา ชอบแพ็คเกจคู่'::text, NOW() - INTERVAL '20 days', true::boolean, NULL::uuid, NOW() - INTERVAL '6 months', NOW() - INTERVAL '20 days')
) AS cust_info(name, phone, email, date_of_birth, gender, address, notes, last_visit, is_active, profile_id, created_at, updated_at)
WHERE p.username = 'spa_owner';

-- Insert queues
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'spa_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
),
employee_data AS (
  SELECT 
    e.id AS employee_id,
    e.position_text
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
)
INSERT INTO queues (
  shop_id,
  customer_id,
  queue_number,
  status,
  priority,
  estimated_duration,
  estimated_call_time,
  served_by_employee_id,
  note,
  feedback,
  rating,
  created_at,
  updated_at,
  served_at,
  completed_at
)
SELECT
  sd.shop_id,
  CASE 
    WHEN q.queue_number = 'S001' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณสมหวัง ผ่อนคลาย')
    WHEN q.queue_number = 'S002' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณวิมลรัตน์ สบายใจ')
    WHEN q.queue_number = 'S003' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณประยุทธ์ สุขสบาย')
  END AS customer_id,
  q.queue_number,
  q.status,
  q.priority,
  q.estimated_duration,
  q.estimated_call_time,
  CASE 
    WHEN q.queue_number IN ('S001', 'S002') THEN (SELECT employee_id FROM employee_data WHERE position_text = 'นักบำบัดหลัก')
    ELSE NULL
  END AS served_by_employee_id,
  q.note,
  q.feedback,
  q.rating,
  q.created_at,
  q.updated_at,
  q.served_at,
  q.completed_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('S001'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 90::integer, NOW() - INTERVAL '7 days' + INTERVAL '30 minutes', 'นวดแผนไทย 90 นาที'::text, 'นวดดีมาก ผ่อนคลาย'::text, 5::integer, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days' + INTERVAL '1 hour 30 minutes', NOW() - INTERVAL '7 days' + INTERVAL '30 minutes', NOW() - INTERVAL '7 days' + INTERVAL '2 hours'),
    ('S002'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 120::integer, NOW() - INTERVAL '12 days' + INTERVAL '30 minutes', 'นวดน้ำมันหอมระเหย'::text, 'บริการดี บรรยากาศสงบ'::text, 4::integer, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days' + INTERVAL '2 hours', NOW() - INTERVAL '12 days' + INTERVAL '30 minutes', NOW() - INTERVAL '12 days' + INTERVAL '2 hours 30 minutes'),
    ('S003'::text, 'confirmed'::public.queue_status, 'high'::public.queue_priority, 180::integer, NOW() + INTERVAL '2 hours', 'สปาแพ็คเกจคู่'::text, NULL::text, NULL::integer, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes', NULL::timestamp, NULL::timestamp)
) AS q(queue_number, status, priority, estimated_duration, estimated_call_time, note, feedback, rating, created_at, updated_at, served_at, completed_at);

-- Insert customer points
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'spa_owner'
  LIMIT 1
),
customer_data AS (
  SELECT 
    c.id AS customer_id,
    c.name,
    c.last_visit
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
)
INSERT INTO customer_points (
  shop_id,
  customer_id,
  current_points,
  total_earned,
  total_redeemed,
  membership_tier,
  tier_benefits,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  cd.customer_id,
  CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN 180
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN 250
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN 320
  END AS current_points,
  CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN 180
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN 250
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN 320
  END AS total_earned,
  0 AS total_redeemed,
  CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN 'gold'::public.membership_tier
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN 'platinum'::public.membership_tier
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN 'platinum'::public.membership_tier
  END AS membership_tier,
  CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN ARRAY['15% discount', 'Priority booking', 'Complimentary tea']
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN ARRAY['20% discount', 'VIP room', 'Free aromatherapy upgrade']
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN ARRAY['25% discount', 'VIP treatment', 'Free couple upgrade']
  END AS tier_benefits,
  CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN NOW() - INTERVAL '10 months'
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN NOW() - INTERVAL '8 months'
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN NOW() - INTERVAL '6 months'
  END AS created_at,
  cd.last_visit AS updated_at
FROM shop_data sd
CROSS JOIN customer_data cd;

-- Insert rewards
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'spa_owner'
  LIMIT 1
)
INSERT INTO rewards (
  shop_id,
  name,
  description,
  type,
  points_required,
  value,
  is_available,
  expiry_days,
  usage_limit,
  icon,
  created_at,
  updated_at
)
SELECT
  sd.shop_id,
  reward_info.name,
  reward_info.description,
  reward_info.type,
  reward_info.points_required,
  reward_info.value,
  reward_info.is_available,
  reward_info.expiry_days,
  reward_info.usage_limit,
  reward_info.icon,
  NOW() - INTERVAL '12 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('ส่วนลด 20%'::text, 'ส่วนลด 20% สำหรับบริการสปา'::text, 'discount'::public.reward_type, 150::integer, 20.00::numeric, true::boolean, 90::integer, 1::integer, '🏷️'::text),
    ('นวดเท้าฟรี'::text, 'บริการนวดเท้าฟรี 60 นาที'::text, 'free_item'::public.reward_type, 200::integer, 500.00::numeric, true::boolean, 60::integer, 1::integer, '🦶'::text),
    ('ส่วนลด 30%'::text, 'ส่วนลด 30% สำหรับสมาชิก VIP'::text, 'discount'::public.reward_type, 300::integer, 30.00::numeric, true::boolean, 120::integer, 1::integer, '⭐'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);
