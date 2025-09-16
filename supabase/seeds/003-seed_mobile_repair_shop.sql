-- Set app password for testing
set session my.app_password = '12345678';

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
    ('ซ่อมฮาร์ดแวร์'::text, 'hardware-repair'::text, 'แผนกซ่อมฮาร์ดแวร์ จอ แบตเตอรี่ กล้อง'::text),
    ('ซ่อมซอฟต์แวร์'::text, 'software-repair'::text, 'แผนกซ่อมซอฟต์แวร์ ติดตั้งระบบ'::text),
    ('ต้อนรับ'::text, 'welcome'::text, 'แผนกต้อนรับลูกค้า'::text)
) AS dept_info(name, slug, description)
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
UPDATE customer_points
SET
  current_points = CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN 125
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN 50
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN 200
  END,
  total_earned = CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN 125
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN 50
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN 200
  END,
  total_redeemed = 0,
  membership_tier = CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN 'silver'::public.membership_tier
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN 'bronze'::public.membership_tier
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN 'gold'::public.membership_tier
  END,
  tier_benefits = CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN ARRAY['10% discount', 'Priority service']
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN ARRAY['5% discount', 'Birthday gift']
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN ARRAY['15% discount', 'Priority service', 'Free diagnostic']
  END,
  created_at = CASE 
    WHEN cd.name = 'นายธนากร มือถือใหม่' THEN NOW() - INTERVAL '4 months'
    WHEN cd.name = 'นางสาวพิมพ์ใจ สมาร์ทโฟน' THEN NOW() - INTERVAL '3 months'
    WHEN cd.name = 'นายวิทยา เทคโนโลยี' THEN NOW() - INTERVAL '6 months'
  END,
  updated_at = cd.last_visit
FROM shop_data sd
CROSS JOIN customer_data cd
WHERE customer_points.customer_id = cd.customer_id;

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
    ('ส่วนลด 20%'::text, 'ส่วนลด 20% สำหรับสมาชิก VIP'::text, 'discount'::public.reward_type, 200::integer, 20.00::numeric, true::boolean, 120::integer, 1::integer, '⭐'::text),
    ('เงินคืน 80 บาท'::text, 'รับเงินคืน 80 บาท สำหรับการซ่อมครั้งต่อไป'::text, 'cashback'::public.reward_type, 180::integer, 80.00::numeric, true::boolean, 90::integer, 1::integer, '💰'::text),
    ('สิทธิพิเศษ VIP'::text, 'รับสิทธิพิเศษในการจองคิวซ่อมล่วงหน้า'::text, 'special_privilege'::public.reward_type, 250::integer, 0.00::numeric, true::boolean, 365::integer, 1::integer, '👑'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert promotions for the coffee shop
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'coffee_owner'
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
    ('ส่วนลดซ่อมจอ 20%'::text, 'ส่วนลด 20% สำหรับการซ่อมหน้าจอมือถือทุกรุ่น'::text, 'percentage'::public.promotion_type, 20.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '25 days', NOW() + INTERVAL '35 days', 80::integer, NOW() - INTERVAL '25 days', NOW() - INTERVAL '45 minutes'),
    ('ลด 200 บาท'::text, 'ส่วนลดเงินสด 200 บาท เมื่อซ่อมมือถือครบ 1000 บาท'::text, 'fixed_amount'::public.promotion_type, 200.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '12 days', NOW() + INTERVAL '28 days', 60::integer, NOW() - INTERVAL '12 days', NOW() - INTERVAL '1 hour'),
    ('ตรวจเช็คฟรี'::text, 'บริการตรวจเช็คเครื่องฟรี ไม่มีค่าใช้จ่าย'::text, 'free_item'::public.promotion_type, 0.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days', 100::integer, NOW() - INTERVAL '8 days', NOW() - INTERVAL '20 minutes'),
    ('โปรโมชั่นปีใหม่'::text, 'ส่วนลดพิเศษ 35% ในช่วงเทศกาลปีใหม่'::text, 'percentage'::public.promotion_type, 35.00::numeric, 'scheduled'::public.promotion_status, NOW() + INTERVAL '60 days', NOW() + INTERVAL '90 days', 120::integer, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ('โปรโมชั่นเก่า'::text, 'ส่วนลดที่หมดอายุแล้ว สำหรับทดสอบ'::text, 'percentage'::public.promotion_type, 25.00::numeric, 'inactive'::public.promotion_status, NOW() - INTERVAL '120 days', NOW() - INTERVAL '20 days', 100::integer, NOW() - INTERVAL '120 days', NOW() - INTERVAL '20 days')
) AS promo_info(name, description, type, value, status, start_at, end_at, usage_limit, created_at, updated_at);

