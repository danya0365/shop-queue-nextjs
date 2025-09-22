-- Set app password for testing
set session my.app_password = '12345678';

-- Insert username: french_fry_owner for french fry restaurant owner
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
        '00000000-0000-0000-0000-000000000000',
        '97000000-0000-0000-0000-000000000001',
        'authenticated',
        'authenticated',
        'french_fry_owner@example.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "french_fry_owner",
          "full_name": "French Fry Owner",
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
    email = 'french_fry_owner@example.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Create username: chef1 for restaurant chef
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
        '00000000-0000-0000-0000-000000000000',
        '97000000-0000-0000-0000-000000000002',
        'authenticated',
        'authenticated',
        'chef1@frenchfryhapa.com',
        crypt(current_setting('my.app_password'), gen_salt('bf')),
        NOW() - INTERVAL '30 days',
        NULL,
        NOW() - INTERVAL '1 day',
        '{"provider":"email","providers":["email"]}',
        '{
          "username": "chef1",
          "full_name": "นายสมชาย ทอดกรอบ",
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

-- Create identities for chef1
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
    email = 'chef1@frenchfryhapa.com'
ON CONFLICT (provider_id, provider) DO NOTHING;

-- Insert french fry restaurant shop
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
  'เฟรนช์ฟรายฮาปา',
  'french-fry-hapa',
  'ร้านเฟรนช์ฟรายและเครื่องดื่มสดใส บรรยากาศสบาย ๆ',
  '456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
  '02-777-8888',
  'contact@frenchfryhapa.com',
  'https://frenchfryhapa.com',
  'https://example.com/french-fry-logo.png',
  'https://example.com/french-fry-qr.png',
  'Asia/Bangkok',
  'THB',
  'th',
  'active',
  NOW() - INTERVAL '8 months',
  NOW() - INTERVAL '1 day'
FROM profiles p
WHERE p.username = 'french_fry_owner'
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
AND p.username = 'french_fry_owner';

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
    ('saturday'::text, true, '09:00:00'::time, '23:00:00'::time, '15:00:00'::time, '16:00:00'::time),
    ('sunday'::text, true, '10:00:00'::time, '21:00:00'::time, '15:00:00'::time, '16:00:00'::time)
) AS day_info(day_of_week, is_open, open_time, close_time, break_start, break_end)
WHERE p.username = 'french_fry_owner';

-- Insert services for the french fry restaurant
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
    ('เฟรนช์ฟรายคลาสสิก'::text, 'classic-french-fries'::text, 'เฟรนช์ฟรายแบบดั้งเดิม กรอบนอกนุ่มใน'::text, 55.00::numeric, 8::integer, 'main'::text, true::boolean, '🍟'::text, 1::integer),
    ('เฟรนช์ฟรายชีส'::text, 'cheese-french-fries'::text, 'เฟรนช์ฟรายราดชีสเข้มข้น'::text, 75.00::numeric, 10::integer, 'main'::text, true::boolean, '🧀'::text, 2::integer),
    ('เฟรนช์ฟรายเบคอน'::text, 'bacon-french-fries'::text, 'เฟรนช์ฟรายโรยเบคอนกรอบ'::text, 85.00::numeric, 12::integer, 'main'::text, true::boolean, '🥓'::text, 3::integer),
    ('เฟรนช์ฟรายพิซซ่า'::text, 'pizza-french-fries'::text, 'เฟรนช์ฟรายรสพิซซ่า ราดซอสมะเขือเทศ'::text, 80.00::numeric, 10::integer, 'main'::text, true::boolean, '🍕'::text, 4::integer),
    ('เฟรนช์ฟรายเผ็ด'::text, 'spicy-french-fries'::text, 'เฟรนช์ฟรายรสเผ็ด เสิร์ฟกับซอสเผ็ด'::text, 65.00::numeric, 8::integer, 'main'::text, true::boolean, '🌶️'::text, 5::integer),
    ('เฟรนช์ฟรายหวาน'::text, 'sweet-potato-fries'::text, 'เฟรนช์ฟรายมันเทศ หวานหอม'::text, 70.00::numeric, 10::integer, 'main'::text, true::boolean, '🍠'::text, 6::integer),
    ('โค้กเย็น'::text, 'cold-coke'::text, 'โคคาโคล่าเย็น ๆ สดชื่น'::text, 25.00::numeric, 2::integer, 'drink'::text, true::boolean, '🥤'::text, 7::integer),
    ('น้ำส้มสด'::text, 'fresh-orange-juice'::text, 'น้ำส้มคั้นสด 100% ไม่ใส่น้ำตาล'::text, 45.00::numeric, 5::integer, 'drink'::text, true::boolean, '🍊'::text, 8::integer),
    ('น้ำแอปเปิ้ลสด'::text, 'fresh-apple-juice'::text, 'น้ำแอปเปิ้ลคั้นสด หวานซ่า'::text, 50.00::numeric, 5::integer, 'drink'::text, true::boolean, '🍎'::text, 9::integer),
    ('ชาเย็น'::text, 'iced-tea'::text, 'ชาเย็นหวานมัน รสชาติเข้มข้น'::text, 30.00::numeric, 3::integer, 'drink'::text, true::boolean, '🧊'::text, 10::integer),
    ('น้ำเปล่า'::text, 'water'::text, 'น้ำเปล่าเย็น ๆ'::text, 15.00::numeric, 1::integer, 'drink'::text, true::boolean, '💧'::text, 11::integer),
    ('เฟรนช์ฟรายคอมโบ'::text, 'french-fry-combo'::text, 'เฟรนช์ฟรายคลาสสิก + เครื่องดื่ม'::text, 70.00::numeric, 10::integer, 'combo'::text, true::boolean, '🍽️'::text, 12::integer)
) AS service_info(name, slug, description, price, estimated_duration, category, is_available, icon, popularity_rank)
WHERE p.username = 'french_fry_owner';

-- Insert departments
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
    ('ครัว'::text, 'kitchen'::text, 'แผนกครัวและเตรียมอาหาร'::text),
    ('เสิร์ฟ'::text, 'service'::text, 'แผนกเสิร์ฟและบริการลูกค้า'::text),
    ('เครื่องดื่ม'::text, 'beverage'::text, 'แผนกเครื่องดื่มและบาร์'::text)
) AS dept_info(name, slug, description)
WHERE p.username = 'french_fry_owner';

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
    ('FF001', 'chef1', 'นายสมชาย ทอดกรอบ', 'chef1@frenchfryhapa.com', '081-777-8888', 'หัวหน้าครัว', 28000.00, '2024-03-01'::date, 'active', 1, true, NOW() - INTERVAL '1 day', ARRAY['manage_queues','manage_customers','manage_services'], 'หัวหน้าครัวมืออาชีพ เชี่ยวชาญเฟรนช์ฟราย', NOW() - INTERVAL '7 months', NOW())
) AS emp_info(employee_code, username, name, email, phone, position_text, salary, hire_date, status, station_number, is_on_duty, last_login, permissions, notes, created_at, updated_at)
JOIN profiles p ON p.username = emp_info.username
JOIN departments d ON d.shop_id = s.id AND d.name = 'ครัว'
WHERE p1.username = 'french_fry_owner';

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
    ('คุณนิรันดร์ กินอร่อย'::text, '089-111-2222'::text, 'niran@example.com'::text, '1990-05-15'::date, 'male'::text, '123 ถนนสุขุมวิท กรุงเทพฯ'::text, 'ชอบเฟรนช์ฟรายชีส'::text, NOW() - INTERVAL '5 days', true::boolean, NULL::uuid, NOW() - INTERVAL '6 months', NOW() - INTERVAL '5 days'),
    ('คุณสมใส ดื่มเก่ง'::text, '088-333-4444'::text, 'somsai@example.com'::text, '1985-08-22'::date, 'female'::text, '456 ถนนเพลินจิต กรุงเทพฯ'::text, 'ชอบน้ำส้มสด'::text, NOW() - INTERVAL '10 days', true::boolean, NULL::uuid, NOW() - INTERVAL '4 months', NOW() - INTERVAL '10 days'),
    ('คุณประเสริฐ ทานเก่ง'::text, '087-555-6666'::text, 'prasert@example.com'::text, '1992-12-03'::date, 'male'::text, '789 ถนนราชดำริ กรุงเทพฯ'::text, 'ชอบเฟรนช์ฟรายคอมโบ'::text, NOW() - INTERVAL '15 days', true::boolean, NULL::uuid, NOW() - INTERVAL '3 months', NOW() - INTERVAL '15 days')
) AS cust_info(name, phone, email, date_of_birth, gender, address, notes, last_visit, is_active, profile_id, created_at, updated_at)
WHERE p.username = 'french_fry_owner';

-- Insert queues
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
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
    WHEN q.queue_number = 'FF001' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณนิรันดร์ กินอร่อย')
    WHEN q.queue_number = 'FF002' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณสมใส ดื่มเก่ง')
    WHEN q.queue_number = 'FF003' THEN (SELECT customer_id FROM customer_data WHERE name = 'คุณประเสริฐ ทานเก่ง')
  END AS customer_id,
  q.queue_number,
  q.status,
  q.priority,
  q.estimated_duration,
  q.estimated_call_time,
  CASE 
    WHEN q.queue_number IN ('FF001', 'FF002') THEN (SELECT employee_id FROM employee_data WHERE position_text = 'หัวหน้าครัว')
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
    ('FF001'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 10::integer, NOW() - INTERVAL '5 days' + INTERVAL '15 minutes', 'เฟรนช์ฟรายชีส + โค้กเย็น'::text, 'อร่อยมาก กรอบดี'::text, 5::integer, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '10 minutes', NOW() - INTERVAL '5 days' + INTERVAL '15 minutes', NOW() - INTERVAL '5 days' + INTERVAL '25 minutes'),
    ('FF002'::text, 'completed'::public.queue_status, 'normal'::public.queue_priority, 5::integer, NOW() - INTERVAL '10 days' + INTERVAL '20 minutes', 'น้ำส้มสด'::text, 'สดชื่นดี'::text, 4::integer, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days' + INTERVAL '15 minutes', NOW() - INTERVAL '10 days' + INTERVAL '20 minutes', NOW() - INTERVAL '10 days' + INTERVAL '25 minutes'),
    ('FF003'::text, 'confirmed'::public.queue_status, 'high'::public.queue_priority, 10::integer, NOW() + INTERVAL '1 hour', 'เฟรนช์ฟรายคอมโบ'::text, NULL::text, NULL::integer, NOW() - INTERVAL '15 minutes', NOW() - INTERVAL '15 minutes', NULL::timestamp, NULL::timestamp)
) AS q(queue_number, status, priority, estimated_duration, estimated_call_time, note, feedback, rating, created_at, updated_at, served_at, completed_at);

-- Insert customer points
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
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
updated_customer_points AS (
  UPDATE customer_points
  SET
    current_points = CASE 
      WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN 120
      WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN 85
      WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN 150
    END,
    total_earned = CASE 
      WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN 170  -- 50 welcome + 120 earned
      WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN 135   -- 50 welcome + 85 earned  
      WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN 200  -- 50 welcome + 150 earned
    END,
    total_redeemed = 0,
    membership_tier = CASE 
      WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN 'silver'::public.membership_tier
      WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN 'bronze'::public.membership_tier
      WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN 'gold'::public.membership_tier
    END,
    tier_benefits = CASE 
      WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN ARRAY['10% discount', 'Free drink upgrade']
      WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN ARRAY['5% discount', 'Birthday special']
      WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN ARRAY['15% discount', 'Free combo upgrade', 'Priority queue']
    END,
    created_at = CASE 
      WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN NOW() - INTERVAL '6 months'
      WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN NOW() - INTERVAL '4 months'
      WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN NOW() - INTERVAL '3 months'
    END,
    updated_at = cd.last_visit
  FROM shop_data sd
  CROSS JOIN customer_data cd
  WHERE customer_points.customer_id = cd.customer_id
  RETURNING id, cd.customer_id, sd.shop_id, created_at
)
-- Insert customer point transactions
INSERT INTO customer_point_transactions (
  customer_point_id,
  type,
  points,
  description,
  metadata,
  transaction_date,
  created_at
)
SELECT 
  icp.id AS customer_point_id,
  'earned'::transaction_type AS type,
  50 AS points,  -- Welcome points for everyone
  'ยินดีต้อนรับสู่ร้าน French Fry House! รับแต้มต้อนรับ 50 แต้ม' AS description,
  jsonb_build_object(
    'source', 'welcome_bonus',
    'reason', 'new_customer_registration',
    'bonus_type', 'welcome'
  ) AS metadata,
  icp.created_at AS transaction_date,
  icp.created_at AS created_at
FROM updated_customer_points icp

UNION ALL

-- Additional earned points for each customer based on their activity
SELECT 
  icp.id AS customer_point_id,
  'earned'::transaction_type AS type,
  CASE 
    WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN 70  -- Additional 70 points from purchases
    WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN 35     -- Additional 35 points from purchases
    WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN 100   -- Additional 100 points from purchases
  END AS points,
  CASE 
    WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN 'รับแต้มจากการซื้อสินค้า - ชุดมื้อเช้า'
    WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN 'รับแต้มจากการซื้อสินค้า - เฟรนช์ฟราย + โค้ก'
    WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN 'รับแต้มจากการซื้อสินค้า - ชุดใหญ่พิเศษ'
  END AS description,
  CASE 
    WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN jsonb_build_object(
      'source', 'purchase',
      'purchase_amount', 350.00,
      'points_rate', '1_point_per_5_baht'
    )
    WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN jsonb_build_object(
      'source', 'purchase', 
      'purchase_amount', 175.00,
      'points_rate', '1_point_per_5_baht'
    )
    WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN jsonb_build_object(
      'source', 'purchase',
      'purchase_amount', 500.00,
      'points_rate', '1_point_per_5_baht'
    )
  END AS metadata,
  CASE 
    WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN NOW() - INTERVAL '2 months'
    WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN NOW() - INTERVAL '1 month'
    WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN NOW() - INTERVAL '2 weeks'
  END AS transaction_date,
  CASE 
    WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN NOW() - INTERVAL '2 months'
    WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN NOW() - INTERVAL '1 month'
    WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN NOW() - INTERVAL '2 weeks'
  END AS created_at
FROM updated_customer_points icp
JOIN customer_data cd ON icp.customer_id = cd.customer_id

UNION ALL

-- Bonus points for special occasions
SELECT 
  icp.id AS customer_point_id,
  'earned'::transaction_type AS type,
  CASE 
    WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN 50   -- Birthday bonus
    WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN 50      -- Birthday bonus  
    WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN 50    -- Birthday bonus
  END AS points,
  'รับแต้มโบนัสวันเกิด - ขอบคุณที่เป็นลูกค้าของเรา!' AS description,
  jsonb_build_object(
    'source', 'birthday_bonus',
    'event_type', 'birthday_celebration',
    'bonus_amount', 50
  ) AS metadata,
  CASE 
    WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN NOW() - INTERVAL '3 weeks'
    WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN NOW() - INTERVAL '5 weeks'
    WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN NOW() - INTERVAL '1 week'
  END AS transaction_date,
  CASE 
    WHEN cd.name = 'คุณนิรันดร์ กินอร่อย' THEN NOW() - INTERVAL '3 weeks'
    WHEN cd.name = 'คุณสมใส ดื่มเก่ง' THEN NOW() - INTERVAL '5 weeks'
    WHEN cd.name = 'คุณประเสริฐ ทานเก่ง' THEN NOW() - INTERVAL '1 week'
  END AS created_at
FROM updated_customer_points icp
JOIN customer_data cd ON icp.customer_id = cd.customer_id;

-- Insert queue services
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
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
  sd.service_id,
  qs.quantity,
  qs.price,
  qd.created_at
FROM queue_data qd
CROSS JOIN (
  VALUES 
    ('FF001', 'เฟรนช์ฟรายชีส', 1, 75.00),
    ('FF001', 'โค้กเย็น', 1, 25.00),
    ('FF002', 'น้ำส้มสด', 1, 45.00),
    ('FF003', 'เฟรนช์ฟรายคอมโบ', 1, 70.00)
) AS qs(queue_number, service_name, quantity, price)
JOIN service_data sd ON sd.name = qs.service_name
WHERE qd.queue_number = qs.queue_number;

-- Insert payments for the restaurant
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
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
    WHEN qd.queue_number = 'FF001' THEN 100.00
    WHEN qd.queue_number = 'FF002' THEN 45.00
  END AS total_amount,
  CASE 
    WHEN qd.queue_number = 'FF001' THEN 100.00
    WHEN qd.queue_number = 'FF002' THEN 45.00
  END AS paid_amount,
  'paid'::public.payment_status AS payment_status,
  CASE 
    WHEN qd.queue_number = 'FF001' THEN 'cash'::public.payment_method
    WHEN qd.queue_number = 'FF002' THEN 'card'::public.payment_method
  END AS payment_method,
  (SELECT employee_id FROM employee_data WHERE position_text = 'หัวหน้าครัว' LIMIT 1) AS processed_by_employee_id,
  qd.completed_at,
  qd.completed_at,
  qd.completed_at
FROM queue_data qd
WHERE qd.queue_number IN ('FF001', 'FF002');

-- Insert payment items for the restaurant
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
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
  sd.service_id,
  pi.name,
  pi.price,
  pi.quantity,
  pi.total,
  pd.created_at
FROM payment_data pd
JOIN queue_data qd ON pd.queue_id = qd.queue_id
CROSS JOIN (
  VALUES 
    ('FF001', 'เฟรนช์ฟรายชีส', 75.00, 1, 75.00),
    ('FF001', 'โค้กเย็น', 25.00, 1, 25.00),
    ('FF002', 'น้ำส้มสด', 45.00, 1, 45.00)
) AS pi(queue_number, name, price, quantity, total)
JOIN service_data sd ON sd.name = pi.name
WHERE qd.queue_number = pi.queue_number
AND qd.queue_number IN ('FF001', 'FF002');

-- Insert notification settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
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
  NOW() - INTERVAL '8 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd;

-- Insert rewards
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
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
  NOW() - INTERVAL '8 months' AS created_at,
  NOW() - INTERVAL '1 day' AS updated_at
FROM shop_data sd
CROSS JOIN (
  VALUES 
    ('ส่วนลด 10%'::text, 'ส่วนลด 10% สำหรับเฟรนช์ฟราย'::text, 'discount'::public.reward_type, 100::integer, 10.00::numeric, true::boolean, 60::integer, 100::integer, '🏷️'::text),
    ('เงินคืน 20%'::text, 'เงินคืน 20% สำหรับเฟรนช์ฟราย'::text, 'cashback'::public.reward_type, 200::integer, 20.00::numeric, true::boolean, 60::integer, 100::integer, '🏷️'::text),
    ('เครื่องดื่มฟรี'::text, 'เครื่องดื่มฟรี 1 แก้ว'::text, 'free_item'::public.reward_type, 150::integer, 30.00::numeric, true::boolean, 30::integer, 100::integer, '🥤'::text),
    ('ส่วนลด 15%'::text, 'ส่วนลด 15% สำหรับสมาชิก VIP'::text, 'discount'::public.reward_type, 200::integer, 15.00::numeric, true::boolean, 90::integer, 100::integer, '⭐'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert promotions for the french fry restaurant
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
)
INSERT INTO promotions (
  id,
  shop_id,
  name,
  description,
  type,
  value,
  status,
  start_at,
  end_at,
  usage_limit,
  created_by,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  sd.shop_id,
  promo_info.name,
  promo_info.description,
  promo_info.type,
  promo_info.value,
  promo_info.status,
  promo_info.start_at,
  promo_info.end_at,
  promo_info.usage_limit,
  p.id AS created_by,
  promo_info.created_at,
  promo_info.updated_at
FROM shop_data sd
JOIN shops s ON s.id = sd.shop_id
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('ส่วนลดเฟรนช์ฟราย 18%'::text, 'ส่วนลด 18% สำหรับเฟรนช์ฟรายทุกเมนู'::text, 'percentage'::public.promotion_type, 18.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '24 days', NOW() + INTERVAL '36 days', 110::integer, NOW() - INTERVAL '24 days', NOW() - INTERVAL '40 minutes'),
    ('ลด 60 บาท'::text, 'ส่วนลดเงินสด 60 บาท เมื่อสั่งครบ 300 บาท'::text, 'fixed_amount'::public.promotion_type, 60.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '17 days', NOW() + INTERVAL '23 days', 85::integer, NOW() - INTERVAL '17 days', NOW() - INTERVAL '1 hour'),
    ('เครื่องดื่มฟรี'::text, 'เครื่องดื่มฟรี 1 แก้ว เมื่อสั่งเฟรนช์ฟรายครบ 200 บาท'::text, 'free_item'::public.promotion_type, 0.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '11 days', NOW() + INTERVAL '19 days', 75::integer, NOW() - INTERVAL '11 days', NOW() - INTERVAL '8 minutes'),
    ('โปรโมชั่นฤดูร้อน'::text, 'ส่วนลด 35% ในช่วงฤดูร้อน'::text, 'percentage'::public.promotion_type, 35.00::numeric, 'scheduled'::public.promotion_status, NOW() + INTERVAL '25 days', NOW() + INTERVAL '55 days', 130::integer, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
    ('โปรโมชั่นเก่า'::text, 'ส่วนลดที่หมดอายุแล้ว สำหรับทดสอบ'::text, 'percentage'::public.promotion_type, 20.00::numeric, 'inactive'::public.promotion_status, NOW() - INTERVAL '95 days', NOW() - INTERVAL '22 days', 95::integer, NOW() - INTERVAL '95 days', NOW() - INTERVAL '22 days')
) AS promo_info(name, description, type, value, status, start_at, end_at, usage_limit, created_at, updated_at)
WHERE p.username = 'french_fry_owner';

-- เรียกใช้ฟังก์ชัน redeem_customer_reward โดยดึงพารามิเตอร์จาก seed data ที่มีอยู่

-- 1. แลกรางวัลด้วยคะแนนสำหรับ คุณนิรันดร์ (แลกส่วนลด 10%)
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
  LIMIT 1
),
customer_data AS (
  SELECT c.id AS customer_id, c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
  WHERE c.name = 'คุณนิรันดร์ กินอร่อย'
  LIMIT 1
),
reward_data AS (
  SELECT r.id AS reward_id, r.name
  FROM rewards r
  JOIN shop_data sd ON r.shop_id = sd.shop_id
  WHERE r.name = 'ส่วนลด 10%'
    AND r.is_available = true
  LIMIT 1
)
SELECT redeem_customer_reward(
    sd.shop_id,
    cd.customer_id,
    rd.reward_id,
    'points_redemption'::redemption_type
) AS redemption_result
FROM shop_data sd
CROSS JOIN customer_data cd
CROSS JOIN reward_data rd;

-- 2. แลกรางวัลด้วยคะแนนสำหรับ คุณประเสริฐ (แลกเงินคืน 20%)
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
  LIMIT 1
),
customer_data AS (
  SELECT c.id AS customer_id, c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
  WHERE c.name = 'คุณประเสริฐ ทานเก่ง'
  LIMIT 1
),
reward_data AS (
  SELECT r.id AS reward_id, r.name
  FROM rewards r
  JOIN shop_data sd ON r.shop_id = sd.shop_id
  WHERE r.name = 'เงินคืน 20%'
    AND r.is_available = true
  LIMIT 1
)
SELECT redeem_customer_reward(
    sd.shop_id,
    cd.customer_id,
    rd.reward_id,
    'points_redemption'::redemption_type
) AS redemption_result
FROM shop_data sd
CROSS JOIN customer_data cd
CROSS JOIN reward_data rd;

-- 3. มอบรางวัลฟรี (Birthday Gift) สำหรับ คุณสมใส โดยพนักงาน
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
  LIMIT 1
),
customer_data AS (
  SELECT c.id AS customer_id, c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
  WHERE c.name = 'คุณสมใส ดื่มเก่ง'
  LIMIT 1
),
reward_data AS (
  SELECT r.id AS reward_id, r.name
  FROM rewards r
  JOIN shop_data sd ON r.shop_id = sd.shop_id
  WHERE r.name = 'เครื่องดื่มฟรี'
    AND r.is_available = true
  LIMIT 1
),
employee_data AS (
  SELECT e.id AS employee_id, e.name
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
  WHERE e.status = 'active'
  LIMIT 1
)
SELECT redeem_customer_reward(
    sd.shop_id,
    cd.customer_id,
    rd.reward_id,
    'free_reward'::redemption_type,
    'Birthday Special Gift - ขอบคุณที่เป็นลูกค้าของเรา',
    ed.employee_id
) AS redemption_result
FROM shop_data sd
CROSS JOIN customer_data cd
CROSS JOIN reward_data rd
CROSS JOIN employee_data ed;

-- 4. แลกรางวัลส่วนลด 15% สำหรับ คุณนิรันดร์
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
  LIMIT 1
),
customer_data AS (
  SELECT c.id AS customer_id, c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
  WHERE c.name = 'คุณนิรันดร์ กินอร่อย'
  LIMIT 1
),
reward_data AS (
  SELECT r.id AS reward_id, r.name
  FROM rewards r
  JOIN shop_data sd ON r.shop_id = sd.shop_id
  WHERE r.name = 'ส่วนลด 15%'
    AND r.is_available = true
  LIMIT 1
)
SELECT redeem_customer_reward(
    sd.shop_id,
    cd.customer_id,
    rd.reward_id,
    'points_redemption'::redemption_type
) AS redemption_result
FROM shop_data sd
CROSS JOIN customer_data cd
CROSS JOIN reward_data rd;

-- 5. มอบเครื่องดื่มฟรี (Promotional Gift) สำหรับ คุณประเสริฐ
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'french_fry_owner'
  LIMIT 1
),
customer_data AS (
  SELECT c.id AS customer_id, c.name
  FROM customers c
  JOIN shop_data sd ON c.shop_id = sd.shop_id
  WHERE c.name = 'คุณประเสริฐ ทานเก่ง'
  LIMIT 1
),
reward_data AS (
  SELECT r.id AS reward_id, r.name
  FROM rewards r
  JOIN shop_data sd ON r.shop_id = sd.shop_id
  WHERE r.name = 'เครื่องดื่มฟรี'
    AND r.is_available = true
  LIMIT 1
),
employee_data AS (
  SELECT e.id AS employee_id, e.name
  FROM employees e
  JOIN shop_data sd ON e.shop_id = sd.shop_id
  WHERE e.status = 'active'
  ORDER BY e.created_at
  LIMIT 1
)
SELECT redeem_customer_reward(
    sd.shop_id,
    cd.customer_id,
    rd.reward_id,
    'promotional_gift'::redemption_type,
    'Grand Opening Special - รางวัลพิเศษสำหรับลูกค้าที่รัก',
    ed.employee_id
) AS redemption_result
FROM shop_data sd
CROSS JOIN customer_data cd
CROSS JOIN reward_data rd
CROSS JOIN employee_data ed;