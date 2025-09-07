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
    FROM reward_usages crr
    WHERE crr.status IN ('used', 'active') -- รวมทั้งที่ใช้แล้วและยังใช้ได้
),
popular_reward_type AS (
    SELECT r.type as popular_type
    FROM reward_usages crr
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
    FROM reward_usages crr
    WHERE crr.status IN ('used', 'active')
    GROUP BY crr.shop_id
),
popular_reward_type AS (
    SELECT DISTINCT ON (crr.shop_id)
        crr.shop_id,
        r.type as popular_type
    FROM reward_usages crr
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
    FROM reward_usages crr
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
    FROM reward_usages crr
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
    FROM reward_usages crr
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
    FROM reward_usages crr
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


-- View สำหรับสถิติประเภทของรางวัล (Reward Type Stats)
-- View สำหรับ Global Summary (ไม่แยกตาม shop)
CREATE OR REPLACE VIEW public.reward_type_stats_summary_view AS
WITH reward_stats AS (
  SELECT 
    r.type,
    COUNT(*) as count,
    SUM(r.value) as total_value,
    COUNT(*) * 100.0 / (SELECT COUNT(*) FROM rewards WHERE is_available = true) as percentage
  FROM public.rewards r
  WHERE r.is_available = true
  GROUP BY r.type
),
total_rewards AS (
  SELECT COUNT(*) as total_count
  FROM public.rewards r
  WHERE r.is_available = true
)
SELECT 
  -- Discount rewards
  COALESCE(
    (SELECT jsonb_build_object(
      'count', rs.count,
      'percentage', ROUND(rs.percentage, 2),
      'totalValue', rs.total_value
    )
    FROM reward_stats rs 
    WHERE rs.type = 'discount'), 
    jsonb_build_object('count', 0, 'percentage', 0, 'totalValue', 0)
  ) as discount,
  
  -- Free item rewards
  COALESCE(
    (SELECT jsonb_build_object(
      'count', rs.count,
      'percentage', ROUND(rs.percentage, 2),
      'totalValue', rs.total_value
    )
    FROM reward_stats rs 
    WHERE rs.type = 'free_item'), 
    jsonb_build_object('count', 0, 'percentage', 0, 'totalValue', 0)
  ) as free_item,
  
  -- Cashback rewards
  COALESCE(
    (SELECT jsonb_build_object(
      'count', rs.count,
      'percentage', ROUND(rs.percentage, 2),
      'totalValue', rs.total_value
    )
    FROM reward_stats rs 
    WHERE rs.type = 'cashback'), 
    jsonb_build_object('count', 0, 'percentage', 0, 'totalValue', 0)
  ) as cashback,
  
  -- Special privilege rewards
  COALESCE(
    (SELECT jsonb_build_object(
      'count', rs.count,
      'percentage', ROUND(rs.percentage, 2),
      'totalValue', rs.total_value
    )
    FROM reward_stats rs 
    WHERE rs.type = 'special_privilege'), 
    jsonb_build_object('count', 0, 'percentage', 0, 'totalValue', 0)
  ) as special_privilege,
  
  -- Total rewards count
  tr.total_count as total_rewards

FROM total_rewards tr;

-- Create a function version that can filter by shop_id if needed
CREATE OR REPLACE FUNCTION public.get_reward_type_stats(
  p_shop_id UUID DEFAULT NULL
)
RETURNS TABLE(
  discount JSONB,
  free_item JSONB,
  cashback JSONB,
  special_privilege JSONB,
  total_rewards BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH reward_stats AS (
    SELECT 
      r.type,
      COUNT(*) as count,
      SUM(r.value) as total_value,
      COUNT(*) * 100.0 / (
        SELECT COUNT(*) 
        FROM rewards r2 
        WHERE r2.is_available = true 
        AND (p_shop_id IS NULL OR r2.shop_id = p_shop_id)
      ) as percentage
    FROM public.rewards r
    WHERE r.is_available = true
    AND (p_shop_id IS NULL OR r.shop_id = p_shop_id)
    GROUP BY r.type
  ),
  total_rewards AS (
    SELECT COUNT(*) as total_count
    FROM public.rewards r
    WHERE r.is_available = true
    AND (p_shop_id IS NULL OR r.shop_id = p_shop_id)
  )
  SELECT 
    -- Discount rewards
    COALESCE(
      (SELECT jsonb_build_object(
        'count', rs.count,
        'percentage', ROUND(rs.percentage, 2),
        'totalValue', rs.total_value
      )
      FROM reward_stats rs 
      WHERE rs.type = 'discount'), 
      jsonb_build_object('count', 0, 'percentage', 0, 'totalValue', 0)
    ) as discount,
    
    -- Free item rewards
    COALESCE(
      (SELECT jsonb_build_object(
        'count', rs.count,
        'percentage', ROUND(rs.percentage, 2),
        'totalValue', rs.total_value
      )
      FROM reward_stats rs 
      WHERE rs.type = 'free_item'), 
      jsonb_build_object('count', 0, 'percentage', 0, 'totalValue', 0)
    ) as free_item,
    
    -- Cashback rewards
    COALESCE(
      (SELECT jsonb_build_object(
        'count', rs.count,
        'percentage', ROUND(rs.percentage, 2),
        'totalValue', rs.total_value
      )
      FROM reward_stats rs 
      WHERE rs.type = 'cashback'), 
      jsonb_build_object('count', 0, 'percentage', 0, 'totalValue', 0)
    ) as cashback,
    
    -- Special privilege rewards
    COALESCE(
      (SELECT jsonb_build_object(
        'count', rs.count,
        'percentage', ROUND(rs.percentage, 2),
        'totalValue', rs.total_value
      )
      FROM reward_stats rs 
      WHERE rs.type = 'special_privilege'), 
      jsonb_build_object('count', 0, 'percentage', 0, 'totalValue', 0)
    ) as special_privilege,
    
    -- Total rewards count
    tr.total_count::BIGINT as total_rewards

  FROM total_rewards tr;
END;
$$;

-- แยกตาม shop_id และแสดง summary ของแต่ละประเภทรางวัล

CREATE OR REPLACE VIEW reward_type_stats_by_shop_view AS
WITH reward_stats_base AS (
    SELECT 
        shop_id,
        type as reward_type,
        COUNT(*) as count,
        SUM(value) as total_value
    FROM public.rewards
    WHERE is_available = true  -- เฉพาะรางวัลที่ยังใช้งานได้
    GROUP BY shop_id, type
),
shop_totals AS (
    SELECT 
        shop_id,
        SUM(count) as total_rewards
    FROM reward_stats_base
    GROUP BY shop_id
),
reward_type_details AS (
    SELECT 
        st.shop_id,
        st.total_rewards,
        
        -- Discount rewards
        COALESCE(discount_stats.count, 0) as discount_count,
        CASE 
            WHEN st.total_rewards > 0 
            THEN ROUND((COALESCE(discount_stats.count, 0)::DECIMAL / st.total_rewards * 100), 2)
            ELSE 0 
        END as discount_percentage,
        COALESCE(discount_stats.total_value, 0) as discount_total_value,
        
        -- Free item rewards  
        COALESCE(free_item_stats.count, 0) as free_item_count,
        CASE 
            WHEN st.total_rewards > 0 
            THEN ROUND((COALESCE(free_item_stats.count, 0)::DECIMAL / st.total_rewards * 100), 2)
            ELSE 0 
        END as free_item_percentage,
        COALESCE(free_item_stats.total_value, 0) as free_item_total_value,
        
        -- Cashback rewards
        COALESCE(cashback_stats.count, 0) as cashback_count,
        CASE 
            WHEN st.total_rewards > 0 
            THEN ROUND((COALESCE(cashback_stats.count, 0)::DECIMAL / st.total_rewards * 100), 2)
            ELSE 0 
        END as cashback_percentage,
        COALESCE(cashback_stats.total_value, 0) as cashback_total_value,
        
        -- Special privilege rewards
        COALESCE(special_privilege_stats.count, 0) as special_privilege_count,
        CASE 
            WHEN st.total_rewards > 0 
            THEN ROUND((COALESCE(special_privilege_stats.count, 0)::DECIMAL / st.total_rewards * 100), 2)
            ELSE 0 
        END as special_privilege_percentage,
        COALESCE(special_privilege_stats.total_value, 0) as special_privilege_total_value
        
    FROM shop_totals st
    LEFT JOIN reward_stats_base discount_stats 
        ON st.shop_id = discount_stats.shop_id 
        AND discount_stats.reward_type = 'discount'
    LEFT JOIN reward_stats_base free_item_stats 
        ON st.shop_id = free_item_stats.shop_id 
        AND free_item_stats.reward_type = 'free_item'
    LEFT JOIN reward_stats_base cashback_stats 
        ON st.shop_id = cashback_stats.shop_id 
        AND cashback_stats.reward_type = 'cashback'
    LEFT JOIN reward_stats_base special_privilege_stats 
        ON st.shop_id = special_privilege_stats.shop_id 
        AND special_privilege_stats.reward_type = 'special_privilege'
)
SELECT 
    rtd.shop_id,
    s.name as shop_name,
    s.slug as shop_slug,
    
    -- JSON Object ตาม DTO Structure
    JSON_BUILD_OBJECT(
        'discount', JSON_BUILD_OBJECT(
            'count', rtd.discount_count,
            'percentage', rtd.discount_percentage,
            'totalValue', rtd.discount_total_value
        ),
        'free_item', JSON_BUILD_OBJECT(
            'count', rtd.free_item_count,
            'percentage', rtd.free_item_percentage,
            'totalValue', rtd.free_item_total_value
        ),
        'cashback', JSON_BUILD_OBJECT(
            'count', rtd.cashback_count,
            'percentage', rtd.cashback_percentage,
            'totalValue', rtd.cashback_total_value
        ),
        'special_privilege', JSON_BUILD_OBJECT(
            'count', rtd.special_privilege_count,
            'percentage', rtd.special_privilege_percentage,
            'totalValue', rtd.special_privilege_total_value
        ),
        'total_rewards', rtd.total_rewards
    ) as reward_type_stats,
    
    -- Individual columns for easier querying
    rtd.discount_count,
    rtd.discount_percentage,
    rtd.discount_total_value,
    rtd.free_item_count,
    rtd.free_item_percentage,
    rtd.free_item_total_value,
    rtd.cashback_count,
    rtd.cashback_percentage,
    rtd.cashback_total_value,
    rtd.special_privilege_count,
    rtd.special_privilege_percentage,
    rtd.special_privilege_total_value,
    rtd.total_rewards,
    
    -- Metadata
    NOW() as calculated_at
    
FROM reward_type_details rtd
JOIN public.shops s ON rtd.shop_id = s.id
ORDER BY s.name, rtd.total_rewards DESC;