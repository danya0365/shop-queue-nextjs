-- สร้าง RPC Function สำหรับ Customer ในการ query ข้อมูล Available Services
-- Customer สามารถเรียกใช้ผ่าน RPC เท่านั้นเพื่อความปลอดภัย
CREATE OR REPLACE FUNCTION get_available_services(
    p_shop_id UUID
)
RETURNS TABLE (
    id UUID,
    shop_id UUID,
    name TEXT,
    slug TEXT,
    description TEXT,
    category TEXT,
    price NUMERIC,
    estimated_duration INTEGER,
    icon TEXT,
    is_available BOOLEAN,
    popularity_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- ตรวจสอบว่า shop_id มีอยู่จริงและ active
    IF NOT EXISTS (SELECT 1 FROM shops WHERE shops.id = p_shop_id AND shops.status = 'active') THEN
        RAISE EXCEPTION 'Shop not found or inactive';
    END IF;
    
    -- คืนค่าข้อมูล available services ที่ active และ available
    RETURN QUERY
    SELECT 
        s.id,
        s.shop_id,
        s.name,
        s.slug,
        s.description,
        s.category,
        s.price,
        s.estimated_duration,
        s.icon,
        s.is_available,
        s.popularity_rank,
        s.created_at,
        s.updated_at
    FROM 
        services s
    WHERE 
        s.shop_id = p_shop_id
        AND s.is_available = true
    ORDER BY 
        s.category ASC NULLS LAST,
        s.name ASC NULLS LAST,
        s.popularity_rank ASC NULLS LAST;
END;
$$;
