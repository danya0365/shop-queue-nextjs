-- Migration: Queue Comprehensive Stats RPC Function
-- Description: Create RPC function to get comprehensive queue status statistics for anonymous customer access
-- Date: 2025-09-21

-- Create function to get comprehensive queue status statistics for a specific shop
CREATE OR REPLACE FUNCTION public.get_queue_comprehensive_stats(
    p_shop_id UUID
) RETURNS TABLE(
    waiting_queues BIGINT,
    serving_queues BIGINT,
    average_wait_time_minutes DECIMAL(10,2),
    average_service_time_minutes DECIMAL(10,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(qcsv.waiting_queues, 0) as waiting_queues,
        COALESCE(qcsv.serving_queues, 0) as serving_queues,
        COALESCE(qcsv.average_wait_time_minutes, 0) as average_wait_time_minutes,
        COALESCE(qcsv.average_service_time_minutes, 0) as average_service_time_minutes
    FROM public.queue_comprehensive_stats_by_shop_view qcsv
    WHERE qcsv.shop_id = p_shop_id;
END;
$$;

-- Grant execute permission for anonymous customer role
GRANT EXECUTE ON FUNCTION get_queue_comprehensive_stats(UUID) TO anon;

-- Create comment for documentation
COMMENT ON FUNCTION get_queue_comprehensive_stats(UUID) IS 'Get comprehensive queue status statistics for a specific shop including waiting/serving counts and average wait/service times';
