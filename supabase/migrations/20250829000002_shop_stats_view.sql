-- Create shop stats view
CREATE OR REPLACE VIEW shop_stats_summary_view AS
SELECT
    COUNT(*) AS total_shops,
    COUNT(*) FILTER (WHERE status = 'active') AS active_shops,
    COUNT(*) FILTER (WHERE status = 'draft') AS pending_approval,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', NOW())) AS new_this_month
FROM shops;

-- View สำหรับแสดงสถิติรวมของแต่ละร้าน
CREATE OR REPLACE VIEW shop_stats_by_shop_view AS
SELECT 
    s.id AS shop_id,
    s.name AS shop_name,
    s.slug AS shop_slug,
    s.status AS shop_status,
    s.created_at AS shop_created_at,
    
    -- สถิติลูกค้า
    COALESCE(customer_stats.total_customers, 0) AS total_customers,
    COALESCE(customer_stats.active_customers, 0) AS active_customers,
    COALESCE(customer_stats.customers_with_profile, 0) AS customers_with_profile,
    
    -- สถิติคิว
    COALESCE(queue_stats.total_queues, 0) AS total_queues,
    COALESCE(queue_stats.waiting_queues, 0) AS waiting_queues,
    COALESCE(queue_stats.confirmed_queues, 0) AS confirmed_queues,
    COALESCE(queue_stats.serving_queues, 0) AS serving_queues,
    COALESCE(queue_stats.completed_queues, 0) AS completed_queues,
    COALESCE(queue_stats.cancelled_queues, 0) AS cancelled_queues,
    COALESCE(queue_stats.high_priority_queues, 0) AS high_priority_queues,
    COALESCE(queue_stats.vip_queues, 0) AS vip_queues,
    
    -- สถิติคิววันนี้
    COALESCE(today_queue_stats.today_total_queues, 0) AS today_total_queues,
    COALESCE(today_queue_stats.today_completed_queues, 0) AS today_completed_queues,
    COALESCE(today_queue_stats.today_cancelled_queues, 0) AS today_cancelled_queues,
    
    -- สถิติบริการ
    COALESCE(service_stats.total_services, 0) AS total_services,
    COALESCE(service_stats.available_services, 0) AS available_services,
    COALESCE(service_stats.unavailable_services, 0) AS unavailable_services,
    
    -- สถิติพนักงาน
    COALESCE(employee_stats.total_employees, 0) AS total_employees,
    COALESCE(employee_stats.active_employees, 0) AS active_employees,
    COALESCE(employee_stats.on_duty_employees, 0) AS on_duty_employees,
    COALESCE(employee_stats.inactive_employees, 0) AS inactive_employees,
    
    -- สถิติแผนก
    COALESCE(department_stats.total_departments, 0) AS total_departments,
    
    -- สถิติการชำระเงิน
    COALESCE(payment_stats.total_payments, 0) AS total_payments,
    COALESCE(payment_stats.paid_payments, 0) AS paid_payments,
    COALESCE(payment_stats.unpaid_payments, 0) AS unpaid_payments,
    COALESCE(payment_stats.partial_payments, 0) AS partial_payments,
    COALESCE(payment_stats.total_revenue, 0) AS total_revenue,
    COALESCE(payment_stats.total_paid_amount, 0) AS total_paid_amount,
    
    -- สถิติการชำระเงินวันนี้
    COALESCE(today_payment_stats.today_total_revenue, 0) AS today_total_revenue,
    COALESCE(today_payment_stats.today_paid_amount, 0) AS today_paid_amount,
    COALESCE(today_payment_stats.today_paid_payments, 0) AS today_paid_payments,
    
    -- สถิติโปรโมชั่น
    COALESCE(promotion_stats.total_promotions, 0) AS total_promotions,
    COALESCE(promotion_stats.active_promotions, 0) AS active_promotions,
    COALESCE(promotion_stats.expired_promotions, 0) AS expired_promotions,
    COALESCE(promotion_stats.total_promotion_usage, 0) AS total_promotion_usage,
    
    -- สถิติระบบจุดสะสม
    COALESCE(points_stats.total_customers_with_points, 0) AS total_customers_with_points,
    COALESCE(points_stats.total_points_distributed, 0) AS total_points_distributed,
    COALESCE(points_stats.total_points_redeemed, 0) AS total_points_redeemed,
    COALESCE(points_stats.bronze_members, 0) AS bronze_members,
    COALESCE(points_stats.silver_members, 0) AS silver_members,
    COALESCE(points_stats.gold_members, 0) AS gold_members,
    COALESCE(points_stats.platinum_members, 0) AS platinum_members,
    
    -- สถิติรางวัล
    COALESCE(reward_stats.total_rewards, 0) AS total_rewards,
    COALESCE(reward_stats.available_rewards, 0) AS available_rewards,
    COALESCE(reward_stats.total_reward_usages, 0) AS total_reward_usages,
    COALESCE(reward_stats.active_reward_usages, 0) AS active_reward_usages,
    COALESCE(reward_stats.used_reward_usages, 0) AS used_reward_usages,
    COALESCE(reward_stats.expired_reward_usages, 0) AS expired_reward_usages,
    
    -- สถิติกิจกรรม
    COALESCE(activity_stats.total_activities, 0) AS total_activities,
    COALESCE(activity_stats.today_activities, 0) AS today_activities

FROM shops s

-- สถิติลูกค้า
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_customers,
        COUNT(*) FILTER (WHERE is_active = true) AS active_customers,
        COUNT(*) FILTER (WHERE profile_id IS NOT NULL) AS customers_with_profile
    FROM customers
    GROUP BY shop_id
) customer_stats ON s.id = customer_stats.shop_id

-- สถิติคิว
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_queues,
        COUNT(*) FILTER (WHERE status = 'waiting') AS waiting_queues,
        COUNT(*) FILTER (WHERE status = 'confirmed') AS confirmed_queues,
        COUNT(*) FILTER (WHERE status = 'serving') AS serving_queues,
        COUNT(*) FILTER (WHERE status = 'completed') AS completed_queues,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled_queues,
        COUNT(*) FILTER (WHERE priority = 'high') AS high_priority_queues,
        COUNT(*) FILTER (WHERE priority = 'vip') AS vip_queues
    FROM queues
    GROUP BY shop_id
) queue_stats ON s.id = queue_stats.shop_id

-- สถิติคิววันนี้
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS today_total_queues,
        COUNT(*) FILTER (WHERE status = 'completed') AS today_completed_queues,
        COUNT(*) FILTER (WHERE status = 'cancelled') AS today_cancelled_queues
    FROM queues
    WHERE created_at::date = CURRENT_DATE
    GROUP BY shop_id
) today_queue_stats ON s.id = today_queue_stats.shop_id

-- สถิติบริการ
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_services,
        COUNT(*) FILTER (WHERE is_available = true) AS available_services,
        COUNT(*) FILTER (WHERE is_available = false) AS unavailable_services
    FROM services
    GROUP BY shop_id
) service_stats ON s.id = service_stats.shop_id

-- สถิติพนักงาน
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_employees,
        COUNT(*) FILTER (WHERE status = 'active') AS active_employees,
        COUNT(*) FILTER (WHERE is_on_duty = true AND status = 'active') AS on_duty_employees,
        COUNT(*) FILTER (WHERE status = 'inactive') AS inactive_employees
    FROM employees
    GROUP BY shop_id
) employee_stats ON s.id = employee_stats.shop_id

-- สถิติแผนก
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_departments
    FROM departments
    GROUP BY shop_id
) department_stats ON s.id = department_stats.shop_id

-- สถิติการชำระเงิน
LEFT JOIN (
    SELECT 
        q.shop_id,
        COUNT(p.*) AS total_payments,
        COUNT(*) FILTER (WHERE p.payment_status = 'paid') AS paid_payments,
        COUNT(*) FILTER (WHERE p.payment_status = 'unpaid') AS unpaid_payments,
        COUNT(*) FILTER (WHERE p.payment_status = 'partial') AS partial_payments,
        COALESCE(SUM(p.total_amount), 0) AS total_revenue,
        COALESCE(SUM(p.paid_amount), 0) AS total_paid_amount
    FROM queues q
    LEFT JOIN payments p ON q.id = p.queue_id
    GROUP BY q.shop_id
) payment_stats ON s.id = payment_stats.shop_id

-- สถิติการชำระเงินวันนี้
LEFT JOIN (
    SELECT 
        q.shop_id,
        COALESCE(SUM(p.total_amount), 0) AS today_total_revenue,
        COALESCE(SUM(p.paid_amount), 0) AS today_paid_amount,
        COUNT(*) FILTER (WHERE p.payment_status = 'paid') AS today_paid_payments
    FROM queues q
    LEFT JOIN payments p ON q.id = p.queue_id
    WHERE q.created_at::date = CURRENT_DATE
    GROUP BY q.shop_id
) today_payment_stats ON s.id = today_payment_stats.shop_id

-- สถิติโปรโมชั่น
LEFT JOIN (
    SELECT 
        p.shop_id,
        COUNT(p.*) AS total_promotions,
        COUNT(*) FILTER (WHERE p.status = 'active') AS active_promotions,
        COUNT(*) FILTER (WHERE p.status = 'expired') AS expired_promotions,
        COUNT(pul.*) AS total_promotion_usage
    FROM promotions p
    LEFT JOIN promotion_usage_logs pul ON p.id = pul.promotion_id
    GROUP BY p.shop_id
) promotion_stats ON s.id = promotion_stats.shop_id

-- สถิติระบบจุดสะสม
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_customers_with_points,
        COALESCE(SUM(total_earned), 0) AS total_points_distributed,
        COALESCE(SUM(total_redeemed), 0) AS total_points_redeemed,
        COUNT(*) FILTER (WHERE membership_tier = 'bronze') AS bronze_members,
        COUNT(*) FILTER (WHERE membership_tier = 'silver') AS silver_members,
        COUNT(*) FILTER (WHERE membership_tier = 'gold') AS gold_members,
        COUNT(*) FILTER (WHERE membership_tier = 'platinum') AS platinum_members
    FROM customer_points
    GROUP BY shop_id
) points_stats ON s.id = points_stats.shop_id

-- สถิติรางวัล
LEFT JOIN (
    SELECT 
        r.shop_id,
        COUNT(r.*) AS total_rewards,
        COUNT(*) FILTER (WHERE r.is_available = true) AS available_rewards,
        COUNT(ru.*) AS total_reward_usages,
        COUNT(*) FILTER (WHERE ru.status = 'active') AS active_reward_usages,
        COUNT(*) FILTER (WHERE ru.status = 'used') AS used_reward_usages,
        COUNT(*) FILTER (WHERE ru.status = 'expired') AS expired_reward_usages
    FROM rewards r
    LEFT JOIN reward_usages ru ON r.id = ru.reward_id
    GROUP BY r.shop_id
) reward_stats ON s.id = reward_stats.shop_id

-- สถิติกิจกรรม
LEFT JOIN (
    SELECT 
        shop_id,
        COUNT(*) AS total_activities,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS today_activities
    FROM shop_activity_log
    GROUP BY shop_id
) activity_stats ON s.id = activity_stats.shop_id

ORDER BY s.created_at DESC;