-- Notification Settings Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample notification settings data for Shop Queue application

-- Create notification settings for all active shops
INSERT INTO public.notification_settings (
    id,
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
    uuid_generate_v4(),
    s.id,
    true as email_notifications,
    CASE 
        WHEN s.name LIKE '%อาหาร%' OR s.name LIKE '%สปา%' THEN true
        ELSE false
    END as sms_notifications,
    true as push_notifications,
    true as new_queue,
    true as queue_update,
    CASE 
        WHEN s.name LIKE '%ตัดผม%' OR s.name LIKE '%ความงาม%' OR s.name LIKE '%สปา%' THEN true
        ELSE false
    END as shift_reminder,
    true as system_alerts,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
FROM public.shops s
WHERE s.status = 'active'
ON CONFLICT (shop_id) DO NOTHING;
