-- Migration: Marketplace RPC Functions
-- Description: Create RPC functions for marketplace functionality to bypass RLS restrictions
-- Date: 2025-09-27

-- Create function to get shops with filters and pagination for marketplace
CREATE OR REPLACE FUNCTION public.get_marketplace_shops(
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10,
    p_search TEXT DEFAULT NULL,
    p_status TEXT DEFAULT 'active',
    p_category_id UUID DEFAULT NULL,
    p_sort_field TEXT DEFAULT 'createdAt',
    p_sort_direction TEXT DEFAULT 'DESC'
) RETURNS TABLE(
    -- Shop columns
    id UUID,
    name TEXT,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo TEXT,
    qr_code_url TEXT,
    currency TEXT,
    language TEXT,
    timezone TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    total_queues BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_offset INTEGER;
    v_sort_direction TEXT;
BEGIN
    -- Calculate offset for pagination
    v_offset := (p_page - 1) * p_limit;
    
    -- Validate sort direction
    v_sort_direction := UPPER(p_sort_direction);
    IF v_sort_direction NOT IN ('ASC', 'DESC') THEN
        v_sort_direction := 'DESC';
    END IF;
    
    -- Build and execute query with filters
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.description,
        s.address,
        s.phone,
        s.email,
        s.website,
        s.logo,
        s.qr_code_url,
        s.currency,
        s.language,
        s.timezone,
        s.status::TEXT,
        s.created_at,
        s.updated_at,
        COALESCE(ssv.total_queues, 0) as total_queues
    FROM shops s
    LEFT JOIN shop_stats_by_shop_view ssv ON s.id = ssv.shop_id
    WHERE 
        (p_status IS NULL OR s.status = p_status::shop_status) AND
        (p_search IS NULL OR 
            LOWER(s.name) LIKE LOWER('%' || p_search || '%') OR
            LOWER(s.description) LIKE LOWER('%' || p_search || '%') OR
            LOWER(s.address) LIKE LOWER('%' || p_search || '%')
        ) AND
        (p_category_id IS NULL OR EXISTS (
            SELECT 1 FROM category_shops cs 
            WHERE cs.shop_id = s.id AND cs.category_id = p_category_id
        ))
    ORDER BY 
        CASE 
            WHEN v_sort_direction = 'ASC' THEN
                CASE p_sort_field
                    WHEN 'name' THEN s.name
                    WHEN 'totalQueues' THEN COALESCE(ssv.total_queues, 0)::TEXT
                    WHEN 'createdAt' THEN s.created_at::TEXT
                    ELSE s.created_at::TEXT
                END
        END ASC,
        CASE 
            WHEN v_sort_direction = 'DESC' THEN
                CASE p_sort_field
                    WHEN 'name' THEN s.name
                    WHEN 'totalQueues' THEN COALESCE(ssv.total_queues, 0)::TEXT
                    WHEN 'createdAt' THEN s.created_at::TEXT
                    ELSE s.created_at::TEXT
                END
        END DESC
    LIMIT p_limit OFFSET v_offset;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_marketplace_shops(INTEGER, INTEGER, TEXT, TEXT, UUID, TEXT, TEXT) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_marketplace_shops(INTEGER, INTEGER, TEXT, TEXT, UUID, TEXT, TEXT) IS 'Get shops with filters and pagination for marketplace browsing';

-- Create function to get marketplace statistics
CREATE OR REPLACE FUNCTION public.get_marketplace_stats()
RETURNS TABLE(
    total_shops BIGINT,
    active_shops BIGINT,
    new_shops_this_month BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM shops) as total_shops,
        (SELECT COUNT(*) FROM shops WHERE status = 'active') as active_shops,
        (SELECT COUNT(*) FROM shops 
         WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
         AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)) as new_shops_this_month;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_marketplace_stats() TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_marketplace_stats() IS 'Get marketplace statistics including total, active, featured, and new shops';

-- Create function to get popular categories for marketplace
CREATE OR REPLACE FUNCTION public.get_marketplace_popular_categories(
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE(
    id UUID,
    name TEXT,
    description TEXT,
    color TEXT,
    icon TEXT,
    slug TEXT,
    is_active BOOLEAN,
    sort_order INTEGER,
    shop_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.description,
        c.color,
        c.icon,
        c.slug,
        c.is_active,
        c.sort_order,
        COUNT(cs.shop_id) as shop_count
    FROM categories c
    LEFT JOIN category_shops cs ON c.id = cs.category_id
    WHERE c.is_active = true
    GROUP BY c.id, c.name, c.description, c.color, c.icon, c.slug, c.is_active, c.sort_order
    ORDER BY shop_count DESC, c.sort_order ASC
    LIMIT p_limit;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_marketplace_popular_categories(INTEGER) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_marketplace_popular_categories(INTEGER) IS 'Get popular categories for marketplace with shop counts';

-- Create function to get popular locations for marketplace
CREATE OR REPLACE FUNCTION public.get_marketplace_popular_locations(
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE(
    id UUID,
    name TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    is_active BOOLEAN,
    shop_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Since there's no separate locations table, we'll extract unique locations from shops
    RETURN QUERY
    WITH location_groups AS (
        SELECT 
            -- Create a location key based on address parts
            CASE 
                WHEN s.address IS NOT NULL AND s.address != '' THEN
                    SUBSTRING(s.address FROM 1 FOR LEAST(100, LENGTH(s.address)))
                ELSE 'Unknown Location'
            END as location_key,
            s.id as shop_id,
            s.created_at
        FROM shops s
        WHERE s.status = 'active' AND s.address IS NOT NULL AND s.address != ''
    ),
    location_ranked AS (
        SELECT 
            location_key,
            shop_id,
            ROW_NUMBER() OVER (PARTITION BY location_key ORDER BY created_at) as rn
        FROM location_groups
    ),
    location_stats AS (
        SELECT 
            location_key,
            COUNT(*) OVER (PARTITION BY location_key) as shop_count,
            shop_id as representative_shop_id
        FROM location_ranked
        WHERE rn = 1
        ORDER BY shop_count DESC
        LIMIT p_limit
    )
    SELECT 
        ls.representative_shop_id as id,
        ls.location_key as name,
        ls.location_key as address,
        NULL::TEXT as phone,
        NULL::TEXT as email,
        NULL::TEXT as website,
        true as is_active,
        ls.shop_count
    FROM location_stats ls;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_marketplace_popular_locations(INTEGER) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_marketplace_popular_locations(INTEGER) IS 'Get popular locations for marketplace based on shop addresses';

-- Create function to get shops by category with pagination
CREATE OR REPLACE FUNCTION public.get_marketplace_shops_by_category(
    p_category_id UUID,
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE(
    -- Shop columns
    id UUID,
    name TEXT,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo TEXT,
    qr_code_url TEXT,
    currency TEXT,
    language TEXT,
    timezone TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    total_queues BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_offset INTEGER;
BEGIN
    -- Calculate offset for pagination
    v_offset := (p_page - 1) * p_limit;
    
    -- Get shops by category
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.description,
        s.address,
        s.phone,
        s.email,
        s.website,
        s.logo,
        s.qr_code_url,
        s.currency,
        s.language,
        s.timezone,
        s.status::TEXT,
        s.created_at,
        s.updated_at,
        COALESCE(ssv.total_queues, 0) as total_queues
    FROM shops s
    INNER JOIN category_shops cs ON s.id = cs.shop_id
    LEFT JOIN shop_stats_by_shop_view ssv ON s.id = ssv.shop_id
    WHERE 
        s.status = 'active' AND
        cs.category_id = p_category_id
    ORDER BY COALESCE(ssv.total_queues, 0) DESC, s.created_at DESC
    LIMIT p_limit OFFSET v_offset;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_marketplace_shops_by_category(UUID, INTEGER, INTEGER) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_marketplace_shops_by_category(UUID, INTEGER, INTEGER) IS 'Get shops by category with pagination for marketplace';

-- Create function to get shops by location with pagination
CREATE OR REPLACE FUNCTION public.get_marketplace_shops_by_location(
    p_location_name TEXT,
    p_page INTEGER DEFAULT 1,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE(
    -- Shop columns
    id UUID,
    name TEXT,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo TEXT,
    qr_code_url TEXT,
    currency TEXT,
    language TEXT,
    timezone TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    total_queues BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_offset INTEGER;
BEGIN
    -- Calculate offset for pagination
    v_offset := (p_page - 1) * p_limit;
    
    -- Get shops by location (address contains location name)
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.description,
        s.address,
        s.phone,
        s.email,
        s.website,
        s.logo,
        s.qr_code_url,
        s.currency,
        s.language,
        s.timezone,
        s.status::TEXT,
        s.created_at,
        s.updated_at,
        COALESCE(ssv.total_queues, 0) as total_queues
    FROM shops s
    LEFT JOIN shop_stats_by_shop_view ssv ON s.id = ssv.shop_id
    WHERE 
        s.status = 'active' AND
        (s.address ILIKE '%' || p_location_name || '%')
    ORDER BY COALESCE(ssv.total_queues, 0) DESC, s.created_at DESC
    LIMIT p_limit OFFSET v_offset;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_marketplace_shops_by_location(TEXT, INTEGER, INTEGER) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_marketplace_shops_by_location(TEXT, INTEGER, INTEGER) IS 'Get shops by location with pagination for marketplace';

-- Create function to get a single shop by ID for marketplace
CREATE OR REPLACE FUNCTION public.get_shop_by_id(
    p_shop_id UUID
) RETURNS TABLE(
    -- Shop columns
    id UUID,
    name TEXT,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo TEXT,
    qr_code_url TEXT,
    currency TEXT,
    language TEXT,
    timezone TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    total_queues BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Get shop by ID
    RETURN QUERY
    SELECT 
        s.id,
        s.name,
        s.description,
        s.address,
        s.phone,
        s.email,
        s.website,
        s.logo,
        s.qr_code_url,
        s.currency,
        s.language,
        s.timezone,
        s.status::TEXT,
        s.created_at,
        s.updated_at,
        COALESCE(ssv.total_queues, 0) as total_queues
    FROM shops s
    LEFT JOIN shop_stats_by_shop_view ssv ON s.id = ssv.shop_id
    WHERE s.id = p_shop_id;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_shop_by_id(UUID) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_shop_by_id(UUID) IS 'Get a single shop by ID for marketplace';

-- Create function to get categories with stats for marketplace categories page
CREATE OR REPLACE FUNCTION public.get_marketplace_categories_with_stats()
RETURNS TABLE(
    id UUID,
    name TEXT,
    slug TEXT,
    icon TEXT,
    color TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    shop_count BIGINT,
    is_active BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Get categories with stats using existing view
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.slug,
        c.icon,
        c.color,
        c.description,
        c.created_at,
        c.updated_at,
        COALESCE(c.shops_count, 0) as shop_count,
        CASE 
            WHEN COALESCE(c.shops_count, 0) > 0 THEN true
            ELSE false
        END as is_active
    FROM category_info_stats_view c
    ORDER BY c.shops_count DESC, c.name ASC;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_marketplace_categories_with_stats() TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_marketplace_categories_with_stats() IS 'Get categories with shop counts for marketplace categories page';

-- Create function to search categories for marketplace
CREATE OR REPLACE FUNCTION public.search_marketplace_categories(
    p_search_query TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 100
) RETURNS TABLE(
    id UUID,
    name TEXT,
    icon TEXT,
    shop_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Search categories with shop counts
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.icon,
        COUNT(cs.shop_id) as shop_count
    FROM categories c
    LEFT JOIN category_shops cs ON c.id = cs.category_id
    WHERE 
        c.is_active = true AND
        (p_search_query IS NULL OR 
            LOWER(c.name) LIKE LOWER('%' || p_search_query || '%') OR
            LOWER(c.description) LIKE LOWER('%' || p_search_query || '%')
        )
    GROUP BY c.id, c.name, c.icon
    ORDER BY shop_count DESC, c.name ASC
    LIMIT p_limit;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION search_marketplace_categories(TEXT, INTEGER) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION search_marketplace_categories(TEXT, INTEGER) IS 'Search categories with shop counts for marketplace';
