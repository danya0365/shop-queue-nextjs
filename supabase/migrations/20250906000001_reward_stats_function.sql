-- View 1: Summary ยอดรวมทั้งหมด (reward_stats_summary_view)
CREATE OR REPLACE VIEW reward_stats_summary_view AS
WITH reward_summary AS (
    SELECT 
        COUNT(*) AS total_rewards,
        COUNT(*) FILTER (WHERE is_available = true) AS active_rewards
    FROM rewards
),
redemption_summary AS (
    SELECT 
        COUNT(*) AS total_redemptions,
        COALESCE(SUM(ABS(points)), 0) AS total_points_redeemed,
        COALESCE(AVG(ABS(points)), 0) AS average_redemption_value
    FROM reward_transactions rt
    WHERE rt.type = 'redeemed'
),
popular_reward_type AS (
    SELECT r.type as popular_type
    FROM reward_transactions rt
    INNER JOIN rewards r ON rt.reward_id = r.id
    WHERE rt.type = 'redeemed'
    GROUP BY r.type
    ORDER BY COUNT(*) DESC
    LIMIT 1
)
SELECT 
    rs.total_rewards,
    rs.active_rewards,
    rds.total_redemptions,
    rds.total_points_redeemed,
    ROUND(rds.average_redemption_value::numeric, 2) AS average_redemption_value,
    prt.popular_type AS popular_reward_type
FROM reward_summary rs
CROSS JOIN redemption_summary rds
LEFT JOIN popular_reward_type prt ON true;

-- View 2: แบ่งตาม shop_id (reward_stats_by_shop_view)
CREATE OR REPLACE VIEW reward_stats_by_shop_view AS
WITH reward_summary AS (
    SELECT 
        shop_id,
        COUNT(*) AS total_rewards,
        COUNT(*) FILTER (WHERE is_available = true) AS active_rewards
    FROM rewards
    GROUP BY shop_id
),
redemption_summary AS (
    SELECT 
        r.shop_id,
        COUNT(rt.*) AS total_redemptions,
        COALESCE(SUM(ABS(rt.points)), 0) AS total_points_redeemed,
        COALESCE(AVG(ABS(rt.points)), 0) AS average_redemption_value
    FROM reward_transactions rt
    INNER JOIN rewards r ON rt.reward_id = r.id
    WHERE rt.type = 'redeemed'
    GROUP BY r.shop_id
),
popular_reward_type AS (
    SELECT DISTINCT ON (r.shop_id)
        r.shop_id,
        r.type as popular_type
    FROM reward_transactions rt
    INNER JOIN rewards r ON rt.reward_id = r.id
    WHERE rt.type = 'redeemed'
    GROUP BY r.shop_id, r.type
    ORDER BY r.shop_id, COUNT(*) DESC
)
SELECT 
    COALESCE(rs.shop_id, rds.shop_id) AS shop_id,
    COALESCE(rs.total_rewards, 0) AS total_rewards,
    COALESCE(rs.active_rewards, 0) AS active_rewards,
    COALESCE(rds.total_redemptions, 0) AS total_redemptions,
    COALESCE(rds.total_points_redeemed, 0) AS total_points_redeemed,
    COALESCE(ROUND(rds.average_redemption_value::numeric, 2), 0) AS average_redemption_value,
    prt.popular_type AS popular_reward_type
FROM reward_summary rs
FULL OUTER JOIN redemption_summary rds ON rs.shop_id = rds.shop_id
LEFT JOIN popular_reward_type prt ON COALESCE(rs.shop_id, rds.shop_id) = prt.shop_id;