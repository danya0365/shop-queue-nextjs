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

-- Insert queue services
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'beauty_owner'
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
    WHEN qd.queue_number = 'B001' THEN (SELECT service_id FROM service_data WHERE name = 'ทำเล็บมือ')
    WHEN qd.queue_number = 'B002' THEN (SELECT service_id FROM service_data WHERE name = 'ทำผมสี')
    WHEN qd.queue_number = 'B003' THEN (SELECT service_id FROM service_data WHERE name = 'ขัดผิวหน้า')
  END AS service_id,
  1 AS quantity,
  CASE 
    WHEN qd.queue_number = 'B001' THEN 300.00
    WHEN qd.queue_number = 'B002' THEN 1500.00
    WHEN qd.queue_number = 'B003' THEN 500.00
  END AS price,
  qd.created_at
FROM queue_data qd;

-- Insert payments
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'beauty_owner'
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
    WHEN qd.queue_number = 'B001' THEN 300.00
    WHEN qd.queue_number = 'B002' THEN 1500.00
  END AS total_amount,
  CASE 
    WHEN qd.queue_number = 'B001' THEN 300.00
    WHEN qd.queue_number = 'B002' THEN 1500.00
  END AS paid_amount,
  'paid'::public.payment_status AS payment_status,
  CASE 
    WHEN qd.queue_number = 'B001' THEN 'card'::public.payment_method
    WHEN qd.queue_number = 'B002' THEN 'cash'::public.payment_method
  END AS payment_method,
  (SELECT employee_id FROM employee_data WHERE position_text = 'ช่างทำเล็บหลัก' LIMIT 1) AS processed_by_employee_id,
  qd.completed_at,
  qd.completed_at,
  qd.completed_at
FROM queue_data qd
WHERE qd.queue_number IN ('B001', 'B002');

-- Insert payment items
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'beauty_owner'
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
    WHEN qd.queue_number = 'B001' THEN (SELECT service_id FROM service_data WHERE name = 'ทำเล็บมือ')
    WHEN qd.queue_number = 'B002' THEN (SELECT service_id FROM service_data WHERE name = 'ทำผมสี')
  END AS service_id,
  CASE 
    WHEN qd.queue_number = 'B001' THEN 'ทำเล็บมือ'
    WHEN qd.queue_number = 'B002' THEN 'ทำผมสี'
  END AS name,
  CASE 
    WHEN qd.queue_number = 'B001' THEN 300.00
    WHEN qd.queue_number = 'B002' THEN 1500.00
  END AS price,
  1 AS quantity,
  CASE 
    WHEN qd.queue_number = 'B001' THEN 300.00
    WHEN qd.queue_number = 'B002' THEN 1500.00
  END AS total,
  pd.created_at
FROM payment_data pd
JOIN queue_data qd ON pd.queue_id = qd.queue_id
WHERE qd.queue_number IN ('B001', 'B002');

-- Insert notification settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'beauty_owner'
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

-- Insert promotions for the gym
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'gym_owner'
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
    ('ส่วนลดความงาม 20%'::text, 'ส่วนลด 20% สำหรับบริการความงามทุกประเภท'::text, 'percentage'::public.promotion_type, 20.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '22 days', NOW() + INTERVAL '38 days', 100::integer, NOW() - INTERVAL '22 days', NOW() - INTERVAL '25 minutes'),
    ('ลด 150 บาท'::text, 'ส่วนลดเงินสด 150 บาท เมื่อใช้บริการครบ 800 บาท'::text, 'fixed_amount'::public.promotion_type, 150.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '16 days', NOW() + INTERVAL '34 days', 80::integer, NOW() - INTERVAL '16 days', NOW() - INTERVAL '50 minutes'),
    ('ทำเล็บฟรี'::text, 'บริการทำเล็บมือฟรี เมื่อทำผมครบ 1000 บาท'::text, 'free_item'::public.promotion_type, 0.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '12 days', NOW() + INTERVAL '18 days', 60::integer, NOW() - INTERVAL '12 days', NOW() - INTERVAL '10 minutes'),
    ('โปรโมชั่นวาเลนไทน์'::text, 'ส่วนลด 30% ในช่วงเทศกาลวาเลนไทน์'::text, 'percentage'::public.promotion_type, 30.00::numeric, 'scheduled'::public.promotion_status, NOW() + INTERVAL '35 days', NOW() + INTERVAL '65 days', 150::integer, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
    ('โปรโมชั่นเก่า'::text, 'ส่วนลดที่หมดอายุแล้ว สำหรับทดสอบ'::text, 'percentage'::public.promotion_type, 22.00::numeric, 'inactive'::public.promotion_status, NOW() - INTERVAL '100 days', NOW() - INTERVAL '18 days', 90::integer, NOW() - INTERVAL '100 days', NOW() - INTERVAL '18 days')
) AS promo_info(name, description, type, value, status, start_at, end_at, usage_limit, created_at, updated_at);
