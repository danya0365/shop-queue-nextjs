
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
    ('ตัดผม'::text, 'haircut'::text, 'แผนกตัดผม'::text),
    ('ทำสีผม'::text, 'coloring'::text, 'แผนกทำสีผม'::text),
    ('ต้อนรับ'::text, 'welcome'::text, 'แผนกต้อนรับ'::text)
) AS dept_info(name, slug, description)
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
    ('บริการฟรี'::text, 'บริการสระไดร์ฟรี 1 ครั้ง'::text, 'free_item'::public.reward_type, 200::integer, 150.00::numeric, true::boolean, 90::integer, 1::integer, '🎁'::text),
    ('ส่วนลด 20%'::text, 'ส่วนลด 20% สำหรับการใช้บริการครั้งต่อไป'::text, 'discount'::public.reward_type, 150::integer, 20.00::numeric, true::boolean, 90::integer, 1::integer, '🏷️'::text),
    ('เงินคืน 50 บาท'::text, 'รับเงินคืน 50 บาท สำหรับการใช้บริการครั้งต่อไป'::text, 'cashback'::public.reward_type, 250::integer, 50.00::numeric, true::boolean, 60::integer, 1::integer, '💰'::text),
    ('สิทธิพิเศษ VIP'::text, 'รับสิทธิพิเศษในการจองคิวล่วงหน้า'::text, 'special_privilege'::public.reward_type, 300::integer, 0.00::numeric, true::boolean, 365::integer, 1::integer, '👑'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert reward transactions for the haircut shop
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
-- Create some redeemed point transactions first
redeemed_transactions AS (
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
    cd.customer_point_id,
    'redeemed'::public.transaction_type,
    CASE 
      WHEN cd.name = 'สมหญิง ใจงาม' THEN -100  -- Redeem 100 points for 10% discount
    END AS points,
    CASE 
      WHEN cd.name = 'สมหญิง ใจงาม' THEN 'แลกรางวัลส่วนลด 10%'
    END AS description,
    qd.queue_id,
    '{"reward_type": "discount", "discount_percent": 10}'::jsonb AS metadata,
    NOW() - INTERVAL '3 days' AS transaction_date,
    NOW() - INTERVAL '3 days' AS created_at
  FROM customer_data cd
  JOIN queue_data qd ON cd.customer_id = qd.customer_id
  WHERE cd.name = 'สมหญิง ใจงาม'
  LIMIT 1
  RETURNING id, customer_point_id, related_queue_id, points, transaction_date
)
INSERT INTO reward_transactions (
  related_customer_id,
  customer_point_transaction_id,
  reward_id,
  type,
  points,
  description,
  related_queue_id,
  transaction_date,
  expiry_at,
  created_at
)
SELECT
  cd.customer_id,
  rt.id,
  rd.reward_id,
  'redeemed'::public.transaction_type,
  ABS(rt.points) AS points,
  'แลกรางวัล: ' || rd.name,
  rt.related_queue_id,
  rt.transaction_date,
  rt.transaction_date + INTERVAL '1 day' * rd.expiry_days AS expiry_at,
  rt.transaction_date AS created_at
FROM redeemed_transactions rt
JOIN customer_data cd ON rt.customer_point_id = cd.customer_point_id
JOIN rewards_data rd ON rd.points_required <= ABS(rt.points)
WHERE rd.name = 'ส่วนลด 10%'
LIMIT 1;

-- Insert promotions for the haircut shop
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'haircut_owner'
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
    ('ส่วนลดลูกค้าใหม่ 20%'::text, 'ส่วนลด 20% สำหรับลูกค้าใหม่ที่มาใช้บริการครั้งแรก'::text, 'percentage'::public.promotion_type, 20.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '30 days', NOW() + INTERVAL '60 days', 100::integer, NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day'),
    ('ลด 50 บาท'::text, 'ส่วนลดเงินสด 50 บาท สำหรับการใช้บริการตั้งแต่ 300 บาทขึ้นไป'::text, 'fixed_amount'::public.promotion_type, 50.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '15 days', NOW() + INTERVAL '45 days', 200::integer, NOW() - INTERVAL '15 days', NOW() - INTERVAL '2 hours'),
    ('Happy Hour 30%'::text, 'ส่วนลด 30% ในช่วงเวลา 14:00-16:00 น. ทุกวันจันทร์-ศุกร์'::text, 'percentage'::public.promotion_type, 30.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '7 days', NOW() + INTERVAL '30 days', 50::integer, NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 hours'),
    ('โปรโมชั่นสิ้นปี'::text, 'ส่วนลดพิเศษ 25% สำหรับการใช้บริการในช่วงสิ้นปี'::text, 'percentage'::public.promotion_type, 25.00::numeric, 'scheduled'::public.promotion_status, NOW() + INTERVAL '30 days', NOW() + INTERVAL '90 days', 150::integer, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
    ('ส่วนลดหมดอายุ'::text, 'โปรโมชั่นที่หมดอายุแล้ว สำหรับทดสอบ'::text, 'percentage'::public.promotion_type, 15.00::numeric, 'inactive'::public.promotion_status, NOW() - INTERVAL '60 days', NOW() - INTERVAL '10 days', 100::integer, NOW() - INTERVAL '60 days', NOW() - INTERVAL '10 days')
) AS promo_info(name, description, type, value, status, start_at, end_at, usage_limit, created_at, updated_at);

