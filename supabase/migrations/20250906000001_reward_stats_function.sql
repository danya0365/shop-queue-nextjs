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
        COALESCE(SUM(points_used), 0) AS total_points_redeemed,
        COALESCE(AVG(points_used), 0) AS average_redemption_value
    FROM customer_reward_redemptions crr
    WHERE crr.status IN ('used', 'active') -- รวมทั้งที่ใช้แล้วและยังใช้ได้
),
popular_reward_type AS (
    SELECT r.type as popular_type
    FROM customer_reward_redemptions crr
    INNER JOIN rewards r ON crr.reward_id = r.id
    WHERE crr.status IN ('used', 'active')
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
        crr.shop_id,
        COUNT(crr.*) AS total_redemptions,
        COALESCE(SUM(crr.points_used), 0) AS total_points_redeemed,
        COALESCE(AVG(crr.points_used), 0) AS average_redemption_value
    FROM customer_reward_redemptions crr
    WHERE crr.status IN ('used', 'active')
    GROUP BY crr.shop_id
),
popular_reward_type AS (
    SELECT DISTINCT ON (crr.shop_id)
        crr.shop_id,
        r.type as popular_type
    FROM customer_reward_redemptions crr
    INNER JOIN rewards r ON crr.reward_id = r.id
    WHERE crr.status IN ('used', 'active')
    GROUP BY crr.shop_id, r.type
    ORDER BY crr.shop_id, COUNT(*) DESC
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

-- View 3: สถิติรางวัลแยกตามประเภทการแลก (reward_stats_by_redemption_type_view)
CREATE OR REPLACE VIEW reward_stats_by_redemption_type_view AS
WITH redemption_type_summary AS (
    SELECT 
        crr.shop_id,
        crr.redemption_type,
        COUNT(*) AS total_redemptions,
        COALESCE(SUM(crr.points_used), 0) AS total_points_used,
        COALESCE(SUM(crr.reward_value), 0) AS total_reward_value,
        COUNT(*) FILTER (WHERE crr.status = 'active') AS active_redemptions,
        COUNT(*) FILTER (WHERE crr.status = 'used') AS used_redemptions,
        COUNT(*) FILTER (WHERE crr.status = 'expired') AS expired_redemptions
    FROM customer_reward_redemptions crr
    GROUP BY crr.shop_id, crr.redemption_type
)
SELECT 
    shop_id,
    redemption_type,
    total_redemptions,
    total_points_used,
    ROUND(total_reward_value::numeric, 2) AS total_reward_value,
    active_redemptions,
    used_redemptions,
    expired_redemptions,
    ROUND((used_redemptions::float / NULLIF(total_redemptions, 0) * 100)::numeric, 2) AS usage_rate_percent
FROM redemption_type_summary
ORDER BY shop_id, total_redemptions DESC;

-- View 4: สถิติการใช้รางวัลรายเดือน (monthly_reward_usage_view)
CREATE OR REPLACE VIEW monthly_reward_usage_view AS
WITH monthly_stats AS (
    SELECT 
        crr.shop_id,
        DATE_TRUNC('month', crr.issued_at) AS month_year,
        COUNT(*) AS redemptions_issued,
        COUNT(*) FILTER (WHERE crr.status = 'used') AS redemptions_used,
        COALESCE(SUM(crr.points_used), 0) AS points_used,
        COALESCE(SUM(crr.reward_value), 0) AS total_reward_value,
        COUNT(DISTINCT crr.customer_id) AS unique_customers
    FROM customer_reward_redemptions crr
    GROUP BY crr.shop_id, DATE_TRUNC('month', crr.issued_at)
)
SELECT 
    shop_id,
    month_year,
    TO_CHAR(month_year, 'YYYY-MM') AS month_display,
    redemptions_issued,
    redemptions_used,
    points_used,
    ROUND(total_reward_value::numeric, 2) AS total_reward_value,
    unique_customers,
    ROUND((redemptions_used::float / NULLIF(redemptions_issued, 0) * 100)::numeric, 2) AS usage_rate_percent
FROM monthly_stats
ORDER BY shop_id, month_year DESC;

-- View 5: Top 10 ลูกค้าที่แลกรางวัลมากที่สุด (top_reward_customers_view)
CREATE OR REPLACE VIEW top_reward_customers_view AS
WITH customer_stats AS (
    SELECT 
        crr.shop_id,
        crr.customer_id,
        c.name AS customer_name,
        c.phone AS customer_phone,
        COUNT(*) AS total_redemptions,
        COALESCE(SUM(crr.points_used), 0) AS total_points_used,
        COALESCE(SUM(crr.reward_value), 0) AS total_reward_value,
        MAX(crr.issued_at) AS last_redemption_date,
        COUNT(DISTINCT crr.redemption_type) AS redemption_type_variety
    FROM customer_reward_redemptions crr
    INNER JOIN customers c ON crr.customer_id = c.id
    GROUP BY crr.shop_id, crr.customer_id, c.name, c.phone
),
ranked_customers AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY shop_id ORDER BY total_redemptions DESC, total_points_used DESC) AS rank
    FROM customer_stats
)
SELECT 
    shop_id,
    customer_id,
    customer_name,
    customer_phone,
    total_redemptions,
    total_points_used,
    ROUND(total_reward_value::numeric, 2) AS total_reward_value,
    last_redemption_date,
    redemption_type_variety,
    rank
FROM ranked_customers
WHERE rank <= 10
ORDER BY shop_id, rank;

-- View 6: รางวัลที่ได้รับความนิยมมากที่สุด (popular_rewards_view)
CREATE OR REPLACE VIEW popular_rewards_view AS
WITH reward_stats AS (
    SELECT 
        crr.shop_id,
        crr.reward_id,
        r.name AS reward_name,
        r.type AS reward_type,
        r.points_required,
        COUNT(*) AS redemption_count,
        COALESCE(SUM(crr.points_used), 0) AS total_points_used,
        COALESCE(AVG(crr.points_used), 0) AS avg_points_per_redemption,
        COUNT(DISTINCT crr.customer_id) AS unique_customers,
        MAX(crr.issued_at) AS last_redemption_date
    FROM customer_reward_redemptions crr
    INNER JOIN rewards r ON crr.reward_id = r.id
    GROUP BY crr.shop_id, crr.reward_id, r.name, r.type, r.points_required
),
ranked_rewards AS (
    SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY shop_id ORDER BY redemption_count DESC, unique_customers DESC) AS popularity_rank
    FROM reward_stats
)
SELECT 
    shop_id,
    reward_id,
    reward_name,
    reward_type,
    points_required,
    redemption_count,
    total_points_used,
    ROUND(avg_points_per_redemption::numeric, 2) AS avg_points_per_redemption,
    unique_customers,
    last_redemption_date,
    popularity_rank
FROM ranked_rewards
ORDER BY shop_id, popularity_rank;