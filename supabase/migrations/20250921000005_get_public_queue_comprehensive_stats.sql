CREATE OR REPLACE FUNCTION get_public_queue_comprehensive_stats(p_shop_id uuid)
RETURNS TABLE(
    -- Queue Counts
    active_queues integer,
    confirmed_queues integer,
    serving_queues integer,
    waiting_queues integer,
    cancelled_queues integer,
    completed_queues integer,
    no_show_queues integer,
    high_priority_queues integer,
    normal_priority_queues integer,
    urgent_priority_queues integer,
    total_queues integer,
    
    -- Time Statistics
    average_wait_time_minutes integer,
    average_service_time_minutes integer,
    average_total_time_minutes integer,
    current_wait_time_estimate integer,
    shortest_wait_time_minutes integer,
    longest_wait_time_minutes integer,
    longest_waiting_queue_minutes integer,
    
    -- Performance Metrics
    cancellation_rate_percentage numeric,
    completion_rate_percentage numeric,
    no_show_rate_percentage numeric,
    
    -- Growth Statistics
    daily_growth_percentage numeric,
    weekly_growth_percentage numeric,
    monthly_growth_percentage numeric,
    
    -- Today's Statistics
    queues_created_today integer,
    queues_completed_today integer,
    queues_cancelled_today integer,
    queues_created_yesterday integer,
    queues_completed_yesterday integer,
    
    -- Popular Data
    most_popular_service_id uuid,
    most_popular_service_name text,
    most_popular_service_queue_count integer,
    most_active_employee_id uuid,
    most_active_employee_name text,
    most_active_employee_queue_count integer,
    
    -- Peak Hours
    peak_hour integer,
    peak_hour_queue_count integer,
    
    -- Shop Information
    shop_id uuid,
    shop_name text,
    shop_slug text,
    shop_status text,
    timezone text,
    
    -- Metadata
    stats_generated_at timestamptz
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- Queue Counts
        COALESCE(qcs.active_queues, 0)::integer as active_queues,
        COALESCE(qcs.confirmed_queues, 0)::integer as confirmed_queues,
        COALESCE(qcs.serving_queues, 0)::integer as serving_queues,
        COALESCE(qcs.waiting_queues, 0)::integer as waiting_queues,
        COALESCE(qcs.cancelled_queues, 0)::integer as cancelled_queues,
        COALESCE(qcs.completed_queues, 0)::integer as completed_queues,
        COALESCE(qcs.no_show_queues, 0)::integer as no_show_queues,
        COALESCE(qcs.high_priority_queues, 0)::integer as high_priority_queues,
        COALESCE(qcs.normal_priority_queues, 0)::integer as normal_priority_queues,
        COALESCE(qcs.urgent_priority_queues, 0)::integer as urgent_priority_queues,
        COALESCE(qcs.total_queues, 0)::integer as total_queues,
        
        -- Time Statistics
        COALESCE(qcs.average_wait_time_minutes, 0)::integer as average_wait_time_minutes,
        COALESCE(qcs.average_service_time_minutes, 0)::integer as average_service_time_minutes,
        COALESCE(qcs.average_total_time_minutes, 0)::integer as average_total_time_minutes,
        COALESCE(qcs.current_wait_time_estimate, 0)::integer as current_wait_time_estimate,
        COALESCE(qcs.shortest_wait_time_minutes, 0)::integer as shortest_wait_time_minutes,
        COALESCE(qcs.longest_wait_time_minutes, 0)::integer as longest_wait_time_minutes,
        COALESCE(qcs.longest_waiting_queue_minutes, 0)::integer as longest_waiting_queue_minutes,
        
        -- Performance Metrics
        COALESCE(qcs.cancellation_rate_percentage, 0)::numeric as cancellation_rate_percentage,
        COALESCE(qcs.completion_rate_percentage, 0)::numeric as completion_rate_percentage,
        COALESCE(qcs.no_show_rate_percentage, 0)::numeric as no_show_rate_percentage,
        
        -- Growth Statistics
        COALESCE(qcs.daily_growth_percentage, 0)::numeric as daily_growth_percentage,
        COALESCE(qcs.weekly_growth_percentage, 0)::numeric as weekly_growth_percentage,
        COALESCE(qcs.monthly_growth_percentage, 0)::numeric as monthly_growth_percentage,
        
        -- Today's Statistics
        COALESCE(qcs.queues_created_today, 0)::integer as queues_created_today,
        COALESCE(qcs.queues_completed_today, 0)::integer as queues_completed_today,
        COALESCE(qcs.queues_cancelled_today, 0)::integer as queues_cancelled_today,
        COALESCE(qcs.queues_created_yesterday, 0)::integer as queues_created_yesterday,
        COALESCE(qcs.queues_completed_yesterday, 0)::integer as queues_completed_yesterday,
        
        -- Popular Data
        qcs.most_popular_service_id,
        qcs.most_popular_service_name,
        COALESCE(qcs.most_popular_service_queue_count, 0)::integer as most_popular_service_queue_count,
        qcs.most_active_employee_id,
        qcs.most_active_employee_name,
        COALESCE(qcs.most_active_employee_queue_count, 0)::integer as most_active_employee_queue_count,
        
        -- Peak Hours
        COALESCE(qcs.peak_hour, 0)::integer as peak_hour,
        COALESCE(qcs.peak_hour_queue_count, 0)::integer as peak_hour_queue_count,
        
        -- Shop Information
        qcs.shop_id,
        qcs.shop_name,
        qcs.shop_slug,
        qcs.shop_status,
        qcs.timezone,
        
        -- Metadata
        qcs.stats_generated_at
    FROM queue_comprehensive_stats_by_shop_view qcs
    WHERE qcs.shop_id = p_shop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;