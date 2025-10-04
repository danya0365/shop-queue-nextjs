-- Set app password for testing
set session my.app_password = '12345678';

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
        '00000000-0000-0000-0000-000000000000',
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
        '00000000-0000-0000-0000-000000000000',
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
    ('นวด'::text, 'massage'::text, 'แผนกนวดและบำบัด'::text),
    ('ดูแลผิว'::text, 'skincare'::text, 'แผนกดูแลผิวและทรีทเมนต์'::text),
    ('ต้อนรับ'::text, 'reception'::text, 'แผนกต้อนรับและให้คำปรึกษา'::text)
) AS dept_info(name, slug, description)
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
UPDATE customer_points
SET
  current_points = CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN 180
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN 250
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN 320
  END,
  total_earned = CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN 180
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN 250
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN 320
  END,
  total_redeemed = 0,
  membership_tier = CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN 'gold'::public.membership_tier
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN 'platinum'::public.membership_tier
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN 'platinum'::public.membership_tier
  END,
  tier_benefits = CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN ARRAY['15% discount', 'Priority booking', 'Complimentary tea']
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN ARRAY['20% discount', 'VIP room', 'Free aromatherapy upgrade']
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN ARRAY['25% discount', 'VIP treatment', 'Free couple upgrade']
  END,
  created_at = CASE 
    WHEN cd.name = 'คุณสมหวัง ผ่อนคลาย' THEN NOW() - INTERVAL '10 months'
    WHEN cd.name = 'คุณวิมลรัตน์ สบายใจ' THEN NOW() - INTERVAL '8 months'
    WHEN cd.name = 'คุณประยุทธ์ สุขสบาย' THEN NOW() - INTERVAL '6 months'
  END,
  updated_at = cd.last_visit
FROM shop_data sd
CROSS JOIN customer_data cd
WHERE customer_points.customer_id = cd.customer_id;

-- Insert queue services
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'spa_owner'
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
    WHEN qd.queue_number = 'S001' THEN (SELECT service_id FROM service_data WHERE name = 'นวดแผนไทย')
    WHEN qd.queue_number = 'S002' THEN (SELECT service_id FROM service_data WHERE name = 'นวดน้ำมันหอมระเหย')
    WHEN qd.queue_number = 'S003' THEN (SELECT service_id FROM service_data WHERE name = 'สปาแพ็คเกจคู่')
  END AS service_id,
  1 AS quantity,
  CASE 
    WHEN qd.queue_number = 'S001' THEN 800.00
    WHEN qd.queue_number = 'S002' THEN 1200.00
    WHEN qd.queue_number = 'S003' THEN 3000.00
  END AS price,
  qd.created_at
FROM queue_data qd;

-- Insert payments
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'spa_owner'
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
    WHEN qd.queue_number = 'S001' THEN 800.00
    WHEN qd.queue_number = 'S002' THEN 1200.00
  END AS total_amount,
  CASE 
    WHEN qd.queue_number = 'S001' THEN 800.00
    WHEN qd.queue_number = 'S002' THEN 1200.00
  END AS paid_amount,
  'paid'::public.payment_status AS payment_status,
  CASE 
    WHEN qd.queue_number = 'S001' THEN 'cash'::public.payment_method
    WHEN qd.queue_number = 'S002' THEN 'card'::public.payment_method
  END AS payment_method,
  (SELECT employee_id FROM employee_data WHERE position_text = 'นักบำบัดหลัก' LIMIT 1) AS processed_by_employee_id,
  qd.completed_at,
  qd.completed_at,
  qd.completed_at
FROM queue_data qd
WHERE qd.queue_number IN ('S001', 'S002');

-- Insert payment items
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'spa_owner'
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
    WHEN qd.queue_number = 'S001' THEN (SELECT service_id FROM service_data WHERE name = 'นวดแผนไทย')
    WHEN qd.queue_number = 'S002' THEN (SELECT service_id FROM service_data WHERE name = 'นวดน้ำมันหอมระเหย')
  END AS service_id,
  CASE 
    WHEN qd.queue_number = 'S001' THEN 'นวดแผนไทย'
    WHEN qd.queue_number = 'S002' THEN 'นวดน้ำมันหอมระเหย'
  END AS name,
  CASE 
    WHEN qd.queue_number = 'S001' THEN 800.00
    WHEN qd.queue_number = 'S002' THEN 1200.00
  END AS price,
  1 AS quantity,
  CASE 
    WHEN qd.queue_number = 'S001' THEN 800.00
    WHEN qd.queue_number = 'S002' THEN 1200.00
  END AS total,
  pd.created_at
FROM payment_data pd
JOIN queue_data qd ON pd.queue_id = qd.queue_id
WHERE qd.queue_number IN ('S001', 'S002');

-- Insert notification settings
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'spa_owner'
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
    ('ส่วนลด 30%'::text, 'ส่วนลด 30% สำหรับสมาชิก VIP'::text, 'discount'::public.reward_type, 300::integer, 30.00::numeric, true::boolean, 120::integer, 1::integer, '⭐'::text),
    ('เงินคืน 200 บาท'::text, 'รับเงินคืน 200 บาท สำหรับบริการสปาครั้งต่อไป'::text, 'cashback'::public.reward_type, 350::integer, 200.00::numeric, true::boolean, 90::integer, 1::integer, '💰'::text),
    ('สิทธิพิเศษสปา'::text, 'รับสิทธิพิเศษในการจองห้องสปาพรีเมียม'::text, 'special_privilege'::public.reward_type, 400::integer, 0.00::numeric, true::boolean, 365::integer, 1::integer, '👑'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon);

-- Insert promotions for the spa
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'spa_owner'
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
  icon,
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
  promo_info.icon,
  p.id AS created_by,
  promo_info.created_at,
  promo_info.updated_at
FROM shop_data sd
JOIN shops s ON s.id = sd.shop_id
JOIN profiles p ON s.owner_id = p.id
CROSS JOIN (
  VALUES 
    ('ส่วนลดสปา 25%'::text, 'ส่วนลด 25% สำหรับบริการสปาทุกประเภท'::text, 'percentage'::public.promotion_type, 25.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '28 days', NOW() + INTERVAL '32 days', 90::integer, '🌿'::text, NOW() - INTERVAL '28 days', NOW() - INTERVAL '35 minutes'),
    ('ลด 300 บาท'::text, 'ส่วนลดเงินสด 300 บาท เมื่อใช้บริการครบ 1500 บาท'::text, 'fixed_amount'::public.promotion_type, 300.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '20 days', NOW() + INTERVAL '40 days', 70::integer, '💵'::text, NOW() - INTERVAL '20 days', NOW() - INTERVAL '1 hour'),
    ('นวดฟรี 30 นาที'::text, 'บริการนวดฟรี 30 นาที เมื่อใช้บริการครบ 2000 บาท'::text, 'free_item'::public.promotion_type, 0.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '15 days', NOW() + INTERVAL '25 days', 50::integer, '🆓'::text, NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 minutes'),
    ('โปรโมชั่นสงกรานต์'::text, 'ส่วนลด 40% ในช่วงเทศกาลสงกรานต์'::text, 'percentage'::public.promotion_type, 40.00::numeric, 'scheduled'::public.promotion_status, NOW() + INTERVAL '50 days', NOW() + INTERVAL '80 days', 120::integer, '💦'::text, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
    ('โปรโมชั่นหมดอายุ'::text, 'ส่วนลดที่หมดอายุแล้ว สำหรับทดสอบ'::text, 'percentage'::public.promotion_type, 28.00::numeric, 'inactive'::public.promotion_status, NOW() - INTERVAL '110 days', NOW() - INTERVAL '25 days', 100::integer, '⛔'::text, NOW() - INTERVAL '110 days', NOW() - INTERVAL '25 days')
) AS promo_info(name, description, type, value, status, start_at, end_at, usage_limit, icon, created_at, updated_at)
WHERE p.username = 'spa_owner';

