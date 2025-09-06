-- Shop Activity Log Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample shop activity log data for Shop Queue application

-- Insert various shop activities for existing shops
INSERT INTO public.shop_activity_log (
    id,
    shop_id,
    type,
    title,
    description,
    metadata,
    created_at
)
SELECT 
    uuid_generate_v4(),
    s.id as shop_id,
    activity_data.type::activity_type,
    activity_data.title,
    activity_data.description,
    activity_data.metadata::jsonb,
    NOW() - INTERVAL (FLOOR(RANDOM() * 30 + 1)::TEXT || ' days')::INTERVAL + 
    INTERVAL (FLOOR(RANDOM() * 24)::TEXT || ' hours')::INTERVAL as created_at
FROM public.shops s
CROSS JOIN (
    VALUES 
    ('shop_created', 'ร้านค้าถูกสร้าง', 'ร้านค้าได้รับการสร้างและเปิดใช้งานเรียบร้อยแล้ว', '{"initial_setup": true, "status": "active"}'),
    ('shop_updated', 'อัปเดตข้อมูลร้านค้า', 'มีการอัปเดตข้อมูลร้านค้า เช่น ชื่อ ที่อยู่ หรือข้อมูลติดต่อ', '{"fields_updated": ["name", "address"], "updated_by": "owner"}'),
    ('shop_settings_updated', 'อัปเดตการตั้งค่าร้านค้า', 'มีการเปลี่ยนแปลงการตั้งค่าร้านค้า', '{"settings_changed": ["max_queue_size", "estimated_service_time"]}'),
    ('customer_registered', 'ลูกค้าใหม่ลงทะเบียน', 'มีลูกค้าใหม่เข้ามาลงทะเบียนใช้บริการ', '{"customer_type": "new", "registration_method": "walk_in"}'),
    ('queue_created', 'สร้างคิวใหม่', 'มีการสร้างคิวใหม่สำหรับลูกค้า', '{"queue_type": "regular", "priority": "normal"}'),
    ('queue_completed', 'คิวเสร็จสิ้น', 'คิวได้รับการบริการเสร็จสิ้นแล้ว', '{"service_duration": 30, "customer_satisfaction": 5}'),
    ('employee_added', 'เพิ่มพนักงานใหม่', 'มีการเพิ่มพนักงานใหม่เข้าสู่ระบบ', '{"employee_role": "staff", "department": "service"}'),
    ('service_added', 'เพิ่มบริการใหม่', 'มีการเพิ่มบริการใหม่เข้าสู่ระบบ', '{"service_category": "premium", "price": 150}'),
    ('payment_completed', 'ชำระเงินเสร็จสิ้น', 'ลูกค้าชำระเงินเสร็จสิ้นแล้ว', '{"payment_method": "cash", "amount": 200}'),
    ('promotion_created', 'สร้างโปรโมชั่นใหม่', 'มีการสร้างโปรโมชั่นใหม่', '{"promotion_type": "percentage", "discount": 20}'),
    ('points_earned', 'ลูกค้าได้รับแต้ม', 'ลูกค้าได้รับแต้มสะสมจากการใช้บริการ', '{"points_earned": 25, "total_points": 150}'),
    ('reward_claimed', 'แลกรางวัล', 'ลูกค้าแลกแต้มรับรางวัล', '{"reward_type": "discount", "points_used": 100}'),
    ('shop_opened', 'เปิดร้าน', 'ร้านค้าเปิดให้บริการ', '{"opening_time": "09:00", "staff_count": 3}'),
    ('shop_closed', 'ปิดร้าน', 'ร้านค้าปิดให้บริการ', '{"closing_time": "18:00", "daily_revenue": 2500}'),
    ('system_backup', 'สำรองข้อมูล', 'ระบบทำการสำรองข้อมูลอัตโนมัติ', '{"backup_type": "daily", "status": "success"}')
) AS activity_data(type, title, description, metadata)
WHERE s.status = 'active'
ORDER BY RANDOM()
LIMIT 200
ON CONFLICT (id) DO NOTHING;
