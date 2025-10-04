
-- สร้าง RPC Function สำหรับ Customer ในการ query ข้อมูล Popular Services
-- Customer สามารถเรียกใช้ผ่าน RPC เท่านั้นเพื่อความปลอดภัย
CREATE OR REPLACE FUNCTION get_customer_popular_services(
    p_shop_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    shop_id UUID,
    queue_count BIGINT,
    revenue NUMERIC,
    category TEXT,
    price NUMERIC,
    icon TEXT,
    description TEXT,
    estimate_duration INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- คืนค่าข้อมูล popular services ตามเงื่อนไข
    RETURN QUERY
    SELECT 
        v.id,
        v.name,
        v.shop_id,
        v.queue_count,
        v.revenue,
        v.category,
        s.price,
        s.icon,
        s.description,
        s.estimated_duration AS estimate_duration
    FROM 
        popular_services_view v
        JOIN services s ON s.id = v.id
    WHERE 
        v.shop_id = p_shop_id
    ORDER BY 
        v.queue_count DESC,
        v.revenue DESC
    LIMIT p_limit;
END;
$$;

-- สร้าง RPC Function สำหรับ Customer ในการ query ข้อมูล Popular Services ตาม Category
CREATE OR REPLACE FUNCTION get_customer_popular_services_by_category(
    p_shop_id UUID,
    p_category TEXT,
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    shop_id UUID,
    queue_count BIGINT,
    revenue NUMERIC,
    category TEXT,
    rank_in_category BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- ตรวจสอบว่า category มีอยู่จริง
    IF p_category IS NULL OR p_category = '' THEN
        RAISE EXCEPTION 'Category is required';
    END IF;
    
    -- คืนค่าข้อมูล popular services ตาม category
    RETURN QUERY
    WITH popular_services_by_category AS (
        SELECT 
            id,
            name,
            shop_id,
            queue_count,
            revenue,
            category,
            rank_in_category
        FROM 
            popular_services_by_category_view
        WHERE 
            popular_services_by_category_view.shop_id = p_shop_id
            AND popular_services_by_category_view.category = p_category
    )
    SELECT 
        id,
        name,
        shop_id,
        queue_count,
        revenue,
        category,
        rank_in_category
    FROM 
        popular_services_by_category
    ORDER BY 
        rank_in_category
    LIMIT p_limit;
END;
$$;

-- สร้าง RPC Function สำหรับ Customer ในการ query ข้อมูล Top Popular Services (ทั่วไป)
CREATE OR REPLACE FUNCTION get_customer_top_popular_services(
    p_shop_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    shop_id UUID,
    queue_count BIGINT,
    revenue NUMERIC,
    category TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- คืนค่าข้อมูล top popular services
    RETURN QUERY
    WITH top_popular_services AS (
        SELECT 
            id,
            name,
            shop_id,
            queue_count,
            revenue,
            category
        FROM 
            top_popular_services_view
        WHERE 
            shop_id = p_shop_id
    )
    SELECT 
        id,
        name,
        shop_id,
        queue_count,
        revenue,
        category
    FROM 
        top_popular_services
    ORDER BY 
        queue_count DESC,
        revenue DESC
    LIMIT p_limit;
END;
$$;

-- Grant execute permissions for anonymous customer role
GRANT EXECUTE ON FUNCTION get_customer_popular_services(UUID, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_customer_popular_services_by_category(UUID, TEXT, INTEGER) TO anon;
GRANT EXECUTE ON FUNCTION get_customer_top_popular_services(UUID, INTEGER) TO anon;

-- Create comments for documentation
COMMENT ON FUNCTION get_customer_popular_services(UUID, INTEGER) IS 'Get popular services for a specific shop';
COMMENT ON FUNCTION get_customer_popular_services_by_category(UUID, TEXT, INTEGER) IS 'Get popular services for a specific shop filtered by category with ranking';
COMMENT ON FUNCTION get_customer_top_popular_services(UUID, INTEGER) IS 'Get top popular services for a specific shop (limited results)';
