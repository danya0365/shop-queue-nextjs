-- Payment Items Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample payment items data for Shop Queue application

-- Insert payment items for existing payments
INSERT INTO public.payment_items (
    id,
    payment_id,
    service_id,
    name,
    price,
    quantity,
    total,
    created_at
)
SELECT 
    uuid_generate_v4(),
    p.id as payment_id,
    qs.service_id,
    s.name,
    qs.price,
    qs.quantity,
    qs.price * qs.quantity as total,
    p.created_at
FROM public.payments p
JOIN public.queues q ON q.id = p.queue_id
JOIN public.queue_services qs ON qs.queue_id = q.id
JOIN public.services s ON s.id = qs.service_id
WHERE p.payment_status IN ('paid', 'partial')
ON CONFLICT (id) DO NOTHING;
