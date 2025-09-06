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
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'restaurant_owner'
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
    WHEN qd.queue_number = 'R001' THEN 165.00
    WHEN qd.queue_number = 'R002' THEN 45.00
  END AS total_amount,
  CASE 
    WHEN qd.queue_number = 'R001' THEN 165.00
    WHEN qd.queue_number = 'R002' THEN 45.00
  END AS paid_amount,
  'paid'::public.payment_status AS payment_status,
  CASE 
    WHEN qd.queue_number = 'R001' THEN 'cash'::public.payment_method
    WHEN qd.queue_number = 'R002' THEN 'card'::public.payment_method
  END AS payment_method,
  (SELECT employee_id FROM employee_data WHERE position_text = 'พนักงานเสิร์ฟ' LIMIT 1) AS processed_by_employee_id,
  qd.completed_at,
  qd.completed_at,
  qd.completed_at
FROM queue_data qd
WHERE qd.queue_number IN ('R001', 'R002');

-- Insert payment items for the restaurant
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'restaurant_owner'
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
    ('R001', 'ผัดไทย', 80.00, 1, 80.00),
    ('R001', 'ต้มยำกุ้ง', 85.00, 1, 85.00),
    ('R002', 'ชาไทยเย็น', 45.00, 1, 45.00)
) AS pi(queue_number, name, price, quantity, total)
JOIN service_data sd ON sd.name = pi.name
WHERE qd.queue_number = pi.queue_number
AND qd.queue_number IN ('R001', 'R002');

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
    ('ส่วนลด 10%'::text, 'ส่วนลด 10% สำหรับการสั่งอาหารครั้งต่อไป'::text, 'discount'::public.reward_type, 50, 10.0, true, 90, 1, '🏷️'::text),
    ('เครื่องดื่มฟรี'::text, 'รับเครื่องดื่มฟรี 1 แก้วเมื่อสั่งอาหารครบ 500 บาท'::text, 'free_item'::public.reward_type, 75, 1.0, true, 60, 1, '🥤'::text),
    ('อาหารฟรี 1 จาน'::text, 'รับอาหารฟรี 1 จาน (ไม่เกิน 200 บาท)'::text, 'free_item'::public.reward_type, 150, 1.0, true, 30, 1, '🍽️'::text),
    ('เงินคืน 100 บาท'::text, 'รับเงินคืน 100 บาท สำหรับการสั่งอาหารครั้งต่อไป'::text, 'cashback'::public.reward_type, 200, 100.0, true, 60, 1, '💰'::text),
    ('สิทธิพิเศษ VIP'::text, 'รับสิทธิพิเศษในการจองโต๊ะล่วงหน้า'::text, 'special_privilege'::public.reward_type, 300, 0.0, true, 365, 1, '👑'::text)
) AS reward_info(name, description, type, points_required, value, is_available, expiry_days, usage_limit, icon)
WHERE p.username = 'restaurant_owner';

-- Insert promotions for the restaurant
WITH shop_data AS (
  SELECT s.id AS shop_id
  FROM shops s
  JOIN profiles p ON s.owner_id = p.id
  WHERE p.username = 'restaurant_owner'
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
    ('ส่วนลดมื้อเที่ยง 15%'::text, 'ส่วนลด 15% สำหรับการสั่งอาหารในช่วงเวลา 11:00-14:00 น.'::text, 'percentage'::public.promotion_type, 15.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '20 days', NOW() + INTERVAL '40 days', 150::integer, NOW() - INTERVAL '20 days', NOW() - INTERVAL '1 hour'),
    ('ลด 100 บาท'::text, 'ส่วนลดเงินสด 100 บาท เมื่อสั่งอาหารครบ 500 บาท'::text, 'fixed_amount'::public.promotion_type, 100.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '10 days', NOW() + INTERVAL '50 days', 100::integer, NOW() - INTERVAL '10 days', NOW() - INTERVAL '30 minutes'),
    ('โปรโมชั่นสุดสัปดาห์'::text, 'ส่วนลด 25% ทุกวันเสาร์-อาทิตย์'::text, 'percentage'::public.promotion_type, 25.00::numeric, 'active'::public.promotion_status, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', 80::integer, NOW() - INTERVAL '5 days', NOW() - INTERVAL '2 hours'),
    ('เทศกาลอาหาร'::text, 'ส่วนลดพิเศษ 30% ในเทศกาลอาหารประจำปี'::text, 'percentage'::public.promotion_type, 30.00::numeric, 'scheduled'::public.promotion_status, NOW() + INTERVAL '45 days', NOW() + INTERVAL '75 days', 200::integer, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
    ('โปรโมชั่นหมดอายุ'::text, 'ส่วนลดที่หมดอายุแล้ว สำหรับทดสอบระบบ'::text, 'fixed_amount'::public.promotion_type, 75.00::numeric, 'inactive'::public.promotion_status, NOW() - INTERVAL '90 days', NOW() - INTERVAL '15 days', 120::integer, NOW() - INTERVAL '90 days', NOW() - INTERVAL '15 days')
) AS promo_info(name, description, type, value, status, start_at, end_at, usage_limit, created_at, updated_at)
WHERE p.username = 'restaurant_owner';

