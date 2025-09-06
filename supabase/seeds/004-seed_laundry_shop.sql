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
    ('ซักรีด'::text, 'wash-iron'::text, 'แผนกซักรีดหลัก'::text),
    ('ต้อนรับ'::text, 'reception'::text, 'แผนกต้อนรับลูกค้า'::text)
) AS dept_info(name, slug, description)
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

-- Insert queue services
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'laundry_owner'
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
    WHEN qd.queue_number = 'L001' THEN (SELECT service_id FROM service_data WHERE name = 'ซักรีดเสื้อเชิ้ต')
    WHEN qd.queue_number = 'L002' THEN (SELECT service_id FROM service_data WHERE name = 'ซักรีดกางเกง')
    WHEN qd.queue_number = 'L003' THEN (SELECT service_id FROM service_data WHERE name = 'ซักรีดชุดสูท')
  END AS service_id,
  CASE 
    WHEN qd.queue_number = 'L001' THEN 5
    WHEN qd.queue_number = 'L002' THEN 3
    WHEN qd.queue_number = 'L003' THEN 1
  END AS quantity,
  CASE 
    WHEN qd.queue_number = 'L001' THEN 40.00
    WHEN qd.queue_number = 'L002' THEN 50.00
    WHEN qd.queue_number = 'L003' THEN 200.00
  END AS price,
  qd.created_at
FROM queue_data qd;

-- Insert payments
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'laundry_owner'
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
    WHEN qd.queue_number = 'L001' THEN 200.00
    WHEN qd.queue_number = 'L002' THEN 150.00
  END AS total_amount,
  CASE 
    WHEN qd.queue_number = 'L001' THEN 200.00
    WHEN qd.queue_number = 'L002' THEN 150.00
  END AS paid_amount,
  'paid'::public.payment_status AS payment_status,
  CASE 
    WHEN qd.queue_number = 'L001' THEN 'cash'::public.payment_method
    WHEN qd.queue_number = 'L002' THEN 'card'::public.payment_method
  END AS payment_method,
  (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างซักรีดหลัก' LIMIT 1) AS processed_by_employee_id,
  qd.completed_at,
  qd.completed_at,
  qd.completed_at
FROM queue_data qd
WHERE qd.queue_number IN ('L001', 'L002');

-- Insert payment items
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'laundry_owner'
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
    WHEN qd.queue_number = 'L001' THEN (SELECT service_id FROM service_data WHERE name = 'ซักรีดเสื้อเชิ้ต')
    WHEN qd.queue_number = 'L002' THEN (SELECT service_id FROM service_data WHERE name = 'ซักรีดกางเกง')
  END AS service_id,
  CASE 
    WHEN qd.queue_number = 'L001' THEN 'ซักรีดเสื้อเชิ้ต'
    WHEN qd.queue_number = 'L002' THEN 'ซักรีดกางเกง'
  END AS name,
  CASE 
    WHEN qd.queue_number = 'L001' THEN 40.00
    WHEN qd.queue_number = 'L002' THEN 50.00
  END AS price,
  CASE 
    WHEN qd.queue_number = 'L001' THEN 5
    WHEN qd.queue_number = 'L002' THEN 3
  END AS quantity,
  CASE 
    WHEN qd.queue_number = 'L001' THEN 200.00
    WHEN qd.queue_number = 'L002' THEN 150.00
  END AS total,
  pd.created_at
FROM payment_data pd
JOIN queue_data qd ON pd.queue_id = qd.queue_id
WHERE qd.queue_number IN ('L001', 'L002');

-- Insert notification settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'laundry_owner'
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
    ('รีดฟรี 1 ชิ้น'::text, 'บริการรีดฟรี 1 ชิ้น'::text, 'free_item'::public.reward_type, 100::integer, 20.00::numeric, true::boolean, 60::integer, 1::integer, '👔'::text),
    ('ส่วนลด 20%'::text, 'ส่วนลด 20% สำหรับสมาชิก VIP'::text, 'discount'::public.reward_type, 150::integer, 20.00::numeric, true::boolean, 120::integer, 1::integer, '⭐'::text),
    ('เงินคืน 30 บาท'::text, 'รับเงินคืน 30 บาท สำหรับการซักรีดครั้งต่อไป'::text, 'cashback'::public.reward_type, 120::integer, 30.00::numeric, true::boolean, 90::integer, 1::integer, '💰'::text),
    ('สิทธิพิเศษ VIP'::text, 'รับสิทธิพิเศษในการจองคิวซักรีดล่วงหน้า'::text, 'special_privilege'::public.reward_type, 200::integer, 0.00::numeric, true::boolean, 365::integer, 1::integer, '👑'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert promotions for the bakery
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'bakery_owner'
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
JOIN profiles p ON p.id = s.owner_id
CROSS JOIN (
  VALUES 
    ('ส่วนลดซักรีด 15%'::text, 'ส่วนลด 15% สำหรับบริการซักรีดทุกประเภท'::text, 'percentage'::public.promotion_type, 15.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '18 days', NOW() + INTERVAL '42 days', 120::integer, NOW() - INTERVAL '18 days', NOW() - INTERVAL '30 minutes'),
    ('ลด 80 บาท'::text, 'ส่วนลดเงินสด 80 บาท เมื่อใช้บริการครบ 400 บาท'::text, 'fixed_amount'::public.promotion_type, 80.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '14 days', NOW() + INTERVAL '26 days', 90::integer, NOW() - INTERVAL '14 days', NOW() - INTERVAL '1 hour'),
    ('รีดฟรี 5 ชิ้น'::text, 'บริการรีดฟรี 5 ชิ้น เมื่อซักครบ 20 ชิ้น'::text, 'free_item'::public.promotion_type, 0.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 70::integer, NOW() - INTERVAL '10 days', NOW() - INTERVAL '15 minutes'),
    ('โปรโมชั่นเสื้อผ้า'::text, 'ส่วนลด 25% สำหรับการซักเสื้อผ้าในช่วงฤดูฝน'::text, 'percentage'::public.promotion_type, 25.00::numeric, 'scheduled'::public.promotion_status, NOW() + INTERVAL '20 days', NOW() + INTERVAL '50 days', 100::integer, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    ('โปรโมชั่นหมดอายุ'::text, 'ส่วนลดที่หมดอายุแล้ว สำหรับทดสอบ'::text, 'percentage'::public.promotion_type, 18.00::numeric, 'inactive'::public.promotion_status, NOW() - INTERVAL '80 days', NOW() - INTERVAL '12 days', 80::integer, NOW() - INTERVAL '80 days', NOW() - INTERVAL '12 days')
) AS promo_info(name, description, type, value, status, start_at, end_at, usage_limit, created_at, updated_at);


-- Insert reward transactions for laundry shop
-- Select all reward transactions based on existing redeemed point transactions
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
    cp.id AS customer_point_id
  FROM customers c
  JOIN customer_points cp ON c.id = cp.customer_id
  JOIN shop_data sd ON c.shop_id = sd.shop_id
),
queue_data AS (
  SELECT 
    q.id AS queue_id,
    q.customer_id,
    q.completed_at
  FROM queues q
  JOIN shop_data sd ON q.shop_id = sd.shop_id
  WHERE q.status = 'completed'
),
rewards_data AS (
  SELECT 
    r.id AS reward_id,
    r.name,
    r.points_required,
    r.expiry_days
  FROM rewards r
  JOIN shop_data sd ON r.shop_id = sd.shop_id
  WHERE r.is_available = true
),
redeemed_transactions AS (
  SELECT 
    cpt.id,
    cpt.customer_point_id,
    cpt.related_queue_id,
    cpt.points,
    cpt.transaction_date
  FROM customer_point_transactions cpt
  JOIN customer_data cd ON cpt.customer_point_id = cd.customer_point_id
  JOIN queue_data qd ON cpt.related_queue_id = qd.queue_id
  WHERE cpt.type = 'redeemed'
)
SELECT
  cd.customer_id AS related_customer_id,
  rt.id AS customer_point_transaction_id,
  rd.reward_id,
  'redeemed'::public.transaction_type AS type,
  ABS(rt.points) AS points,
  'แลกรางวัล: ' || rd.name AS description,
  rt.related_queue_id,
  rt.transaction_date,
  rt.transaction_date + INTERVAL '1 day' * rd.expiry_days AS expiry_at,
  rt.transaction_date AS created_at
FROM redeemed_transactions rt
JOIN customer_data cd ON rt.customer_point_id = cd.customer_point_id
JOIN rewards_data rd ON rd.points_required <= ABS(rt.points)
ORDER BY rt.transaction_date DESC;
