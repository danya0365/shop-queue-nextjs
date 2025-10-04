-- Migration: Customer Promotions RPC Function
-- Description: Create RPC function to get active promotions for a specific shop for anonymous customer access
-- Date: 2025-09-21

-- Create function to get active promotions for a specific shop
CREATE OR REPLACE FUNCTION public.get_customer_promotions(
    p_shop_id UUID,
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE(
    id UUID,
    shop_id UUID,
    name TEXT,
    description TEXT,
    value DECIMAL(10,2),
    type promotion_type,
    status promotion_status,
    start_at TIMESTAMPTZ,
    end_at TIMESTAMPTZ,
    usage_limit INTEGER,
    conditions JSONB,
    icon TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.shop_id,
        p.name,
        p.description,
        p.value,
        p.type,
        p.status,
        p.start_at,
        p.end_at,
        p.usage_limit,
        p.conditions,
        p.icon,
        p.image_url,
        p.created_at,
        p.updated_at
    FROM public.promotions p
    WHERE 
        p.shop_id = p_shop_id
        AND p.status = 'active'
        AND p.start_at <= NOW()
        AND p.end_at >= NOW()
    ORDER BY 
        p.created_at DESC
    LIMIT p_limit
    OFFSET GREATEST((p_page - 1) * p_limit, 0);
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_customer_promotions(UUID, INTEGER, INTEGER) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_customer_promotions(UUID, INTEGER, INTEGER) IS 'Get active promotions for a specific shop that are currently valid and available for customers with pagination support (page, limit).';

-- Count function for pagination
CREATE OR REPLACE FUNCTION public.get_customer_promotions_count(
    p_shop_id UUID
) RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)::INTEGER
    FROM public.promotions p
    WHERE 
        p.shop_id = p_shop_id
        AND p.status = 'active'
        AND p.start_at <= NOW()
        AND p.end_at >= NOW();
$$;

GRANT EXECUTE ON FUNCTION get_customer_promotions_count(UUID) TO anon;
COMMENT ON FUNCTION get_customer_promotions_count(UUID) IS 'Count of active and currently valid promotions for a specific shop.';
