CREATE OR REPLACE VIEW promotion_stats_summary_view AS
WITH usage_info AS (
    SELECT 
        pul.promotion_id,
        COUNT(*) AS usage_count,
        SUM(
            CASE 
                WHEN p.type = 'percentage' THEN 
                    (p.value/100.0) * qs.price * qs.quantity
                WHEN p.type = 'fixed_amount' THEN
                    p.value * qs.quantity
                ELSE 0
            END
        ) AS total_discount
    FROM promotion_usage_logs pul
    JOIN promotions p ON pul.promotion_id = p.id
    LEFT JOIN queues q ON pul.queue_id = q.id
    LEFT JOIN queue_services qs ON qs.queue_id = q.id
        AND (p.type IN ('percentage', 'fixed_amount'))
    GROUP BY pul.promotion_id
)
SELECT
    (SELECT COUNT(*) FROM promotions) AS "total_promotions",
    (SELECT COUNT(*) FROM promotions WHERE status='active') AS "active_promotions",
    (SELECT COUNT(*) FROM promotions WHERE status='inactive') AS "inactive_promotions",
    (SELECT COUNT(*) FROM promotions WHERE end_at < NOW()) AS "expired_promotions",
    (SELECT COUNT(*) FROM promotions WHERE start_at > NOW()) AS "scheduled_promotions",
    (SELECT COALESCE(SUM(usage_count),0) FROM usage_info) AS "total_usage",
    (SELECT COALESCE(SUM(total_discount),0) FROM usage_info) AS "total_discount_given",
    (SELECT 
        CASE WHEN SUM(usage_count) = 0 THEN 0
             ELSE SUM(total_discount)/SUM(usage_count)
        END
     FROM usage_info
    ) AS "average_discount_amount",
    (SELECT p.type 
     FROM promotions p
     JOIN usage_info u ON u.promotion_id = p.id
     ORDER BY u.usage_count DESC
     LIMIT 1
    ) AS "most_used_promotion_type";


CREATE OR REPLACE VIEW promotion_stats_by_shop_view AS
WITH usage_info AS (
    SELECT 
        p.shop_id,
        pul.promotion_id,
        COUNT(*) AS usage_count,
        SUM(
            CASE 
                WHEN p.type = 'percentage' THEN 
                    (p.value/100.0) * qs.price * qs.quantity
                WHEN p.type = 'fixed_amount' THEN
                    p.value * qs.quantity
                ELSE 0
            END
        ) AS total_discount
    FROM promotion_usage_logs pul
    JOIN promotions p ON pul.promotion_id = p.id
    LEFT JOIN queues q ON pul.queue_id = q.id
    LEFT JOIN queue_services qs ON qs.queue_id = q.id
        AND (p.type IN ('percentage', 'fixed_amount'))
    GROUP BY p.shop_id, pul.promotion_id
)
SELECT
    p.shop_id,
    COUNT(*) AS "total_promotions",
    COUNT(*) FILTER (WHERE p.status='active') AS "active_promotions",
    COUNT(*) FILTER (WHERE p.status='inactive') AS "inactive_promotions",
    COUNT(*) FILTER (WHERE p.end_at < NOW()) AS "expired_promotions",
    COUNT(*) FILTER (WHERE p.start_at > NOW()) AS "scheduled_promotions",
    COALESCE(SUM(u.usage_count),0) AS "total_usage",
    COALESCE(SUM(u.total_discount),0) AS "total_discount_given",
    CASE WHEN SUM(u.usage_count) = 0 THEN 0
         ELSE SUM(u.total_discount)/SUM(u.usage_count)
    END AS "average_discount_amount",
    (SELECT p2.type 
     FROM promotions p2
     JOIN usage_info u2 ON u2.promotion_id = p2.id
     WHERE p2.shop_id = p.shop_id
     ORDER BY u2.usage_count DESC
     LIMIT 1
    ) AS "most_used_promotion_type"
FROM promotions p
LEFT JOIN usage_info u ON u.promotion_id = p.id
GROUP BY p.shop_id;
