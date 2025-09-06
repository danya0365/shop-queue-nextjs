-- Shop Settings Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample shop settings data for Shop Queue application

-- Get shop IDs from existing shops
INSERT INTO public.shop_settings (
    id,
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
    uuid_generate_v4(),
    s.id,
    CASE 
        WHEN s.name LIKE '%ตัดผม%' THEN 30
        WHEN s.name LIKE '%ความงาม%' THEN 25
        WHEN s.name LIKE '%ซ่อม%' THEN 20
        WHEN s.name LIKE '%อาหาร%' THEN 50
        WHEN s.name LIKE '%สปา%' THEN 15
        ELSE 35
    END as max_queue_size,
    CASE 
        WHEN s.name LIKE '%ตัดผม%' THEN 30
        WHEN s.name LIKE '%ความงาม%' THEN 45
        WHEN s.name LIKE '%ซ่อม%' THEN 60
        WHEN s.name LIKE '%อาหาร%' THEN 20
        WHEN s.name LIKE '%สปา%' THEN 90
        ELSE 30
    END as estimated_service_time,
    CASE 
        WHEN s.name LIKE '%สปา%' OR s.name LIKE '%ความงาม%' THEN true
        ELSE false
    END as allow_advance_booking,
    CASE 
        WHEN s.name LIKE '%สปา%' OR s.name LIKE '%ความงาม%' THEN 48
        ELSE 24
    END as booking_window_hours,
    CASE 
        WHEN s.name LIKE '%อาหาร%' THEN true
        ELSE false
    END as auto_confirm_queues,
    CASE 
        WHEN s.name LIKE '%อาหาร%' THEN 15
        WHEN s.name LIKE '%สปา%' THEN 60
        ELSE 30
    END as cancellation_deadline,
    false as maintenance_mode,
    true as allow_registration,
    CASE 
        WHEN s.name LIKE '%สปา%' OR s.name LIKE '%ความงาม%' THEN true
        ELSE false
    END as require_email_verification,
    CASE 
        WHEN s.name LIKE '%อาหาร%' THEN 15
        WHEN s.name LIKE '%ซ่อม%' THEN 45
        ELSE 30
    END as session_timeout,
    'daily' as backup_frequency,
    'info' as log_level,
    365 as data_retention_days,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
FROM public.shops s
WHERE s.status = 'active'
ON CONFLICT (shop_id) DO NOTHING;
