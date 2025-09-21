-- สร้าง RPC Function สำหรับ Customer ในการ query ข้อมูล Public Shop Info
-- Customer สามารถเรียกใช้ผ่าน RPC เท่านั้นเพื่อความปลอดภัย
CREATE OR REPLACE FUNCTION get_public_shop_info(
    p_shop_id UUID
)
RETURNS TABLE (
    -- Shop columns
    shop_id UUID,
    shop_name TEXT,
    shop_description TEXT,
    shop_address TEXT,
    shop_phone TEXT,
    shop_email TEXT,
    shop_website TEXT,
    shop_logo TEXT,
    shop_qr_code_url TEXT,
    shop_currency TEXT,
    shop_language TEXT,
    shop_timezone TEXT,
    shop_status TEXT,
    shop_created_at TIMESTAMP WITH TIME ZONE,
    shop_updated_at TIMESTAMP WITH TIME ZONE,
    
    -- Shop Settings columns
    settings_id UUID,
    settings_shop_id UUID,
    settings_estimated_service_time INTEGER,
    settings_maintenance_mode BOOLEAN,
    settings_allow_registration BOOLEAN,
    settings_session_timeout INTEGER,
    settings_backup_frequency TEXT,
    settings_log_level TEXT,
    settings_data_retention_days INTEGER,
    settings_is_accepting_queues BOOLEAN,
    settings_auto_confirm_queues BOOLEAN,
    settings_max_queue_size INTEGER,
    settings_max_queue_per_service INTEGER,
    settings_queue_timeout_minutes INTEGER,
    settings_allow_walk_in BOOLEAN,
    settings_allow_advance_booking BOOLEAN,
    settings_max_advance_booking_days INTEGER,
    settings_booking_window_hours INTEGER,
    settings_cancellation_deadline INTEGER,
    settings_points_enabled BOOLEAN,
    settings_points_per_baht INTEGER,
    settings_points_expiry_months INTEGER,
    settings_minimum_points_to_redeem INTEGER,
    settings_sms_enabled BOOLEAN,
    settings_email_enabled BOOLEAN,
    settings_line_notify_enabled BOOLEAN,
    settings_notify_before_minutes INTEGER,
    settings_accept_cash BOOLEAN,
    settings_accept_credit_card BOOLEAN,
    settings_accept_bank_transfer BOOLEAN,
    settings_accept_promptpay BOOLEAN,
    settings_promptpay_id TEXT,
    settings_theme TEXT,
    settings_date_format TEXT,
    settings_time_format TEXT,
    settings_auto_confirm_booking BOOLEAN,
    settings_require_customer_phone BOOLEAN,
    settings_allow_guest_booking BOOLEAN,
    settings_show_prices_public BOOLEAN,
    settings_enable_reviews BOOLEAN,
    settings_enable_two_factor BOOLEAN,
    settings_require_email_verification BOOLEAN,
    settings_enable_session_timeout BOOLEAN,
    settings_enable_analytics BOOLEAN,
    settings_enable_data_backup BOOLEAN,
    settings_allow_data_export BOOLEAN,
    settings_api_key TEXT,
    settings_enable_webhooks BOOLEAN,
    settings_created_at TIMESTAMP WITH TIME ZONE,
    settings_updated_at TIMESTAMP WITH TIME ZONE
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
    
    -- คืนค่าข้อมูล shop และ shop_settings ด้วย LEFT JOIN
    RETURN QUERY
    SELECT 
        -- Shop columns
        s.id AS shop_id,
        s.name AS shop_name,
        s.description AS shop_description,
        s.address AS shop_address,
        s.phone AS shop_phone,
        s.email AS shop_email,
        s.website AS shop_website,
        s.logo AS shop_logo,
        s.qr_code_url AS shop_qr_code_url,
        s.currency AS shop_currency,
        s.language AS shop_language,
        s.timezone AS shop_timezone,
        s.status AS shop_status,
        s.created_at AS shop_created_at,
        s.updated_at AS shop_updated_at,
        
        -- Shop Settings columns
        ss.id AS settings_id,
        ss.shop_id AS settings_shop_id,
        ss.estimated_service_time AS settings_estimated_service_time,
        ss.maintenance_mode AS settings_maintenance_mode,
        ss.allow_registration AS settings_allow_registration,
        ss.session_timeout AS settings_session_timeout,
        ss.backup_frequency AS settings_backup_frequency,
        ss.log_level AS settings_log_level,
        ss.data_retention_days AS settings_data_retention_days,
        ss.is_accepting_queues AS settings_is_accepting_queues,
        ss.auto_confirm_queues AS settings_auto_confirm_queues,
        ss.max_queue_size AS settings_max_queue_size,
        ss.max_queue_per_service AS settings_max_queue_per_service,
        ss.queue_timeout_minutes AS settings_queue_timeout_minutes,
        ss.allow_walk_in AS settings_allow_walk_in,
        ss.allow_advance_booking AS settings_allow_advance_booking,
        ss.max_advance_booking_days AS settings_max_advance_booking_days,
        ss.booking_window_hours AS settings_booking_window_hours,
        ss.cancellation_deadline AS settings_cancellation_deadline,
        ss.points_enabled AS settings_points_enabled,
        ss.points_per_baht AS settings_points_per_baht,
        ss.points_expiry_months AS settings_points_expiry_months,
        ss.minimum_points_to_redeem AS settings_minimum_points_to_redeem,
        ss.sms_enabled AS settings_sms_enabled,
        ss.email_enabled AS settings_email_enabled,
        ss.line_notify_enabled AS settings_line_notify_enabled,
        ss.notify_before_minutes AS settings_notify_before_minutes,
        ss.accept_cash AS settings_accept_cash,
        ss.accept_credit_card AS settings_accept_credit_card,
        ss.accept_bank_transfer AS settings_accept_bank_transfer,
        ss.accept_promptpay AS settings_accept_promptpay,
        ss.promptpay_id AS settings_promptpay_id,
        ss.theme AS settings_theme,
        ss.date_format AS settings_date_format,
        ss.time_format AS settings_time_format,
        ss.auto_confirm_booking AS settings_auto_confirm_booking,
        ss.require_customer_phone AS settings_require_customer_phone,
        ss.allow_guest_booking AS settings_allow_guest_booking,
        ss.show_prices_public AS settings_show_prices_public,
        ss.enable_reviews AS settings_enable_reviews,
        ss.enable_two_factor AS settings_enable_two_factor,
        ss.require_email_verification AS settings_require_email_verification,
        ss.enable_session_timeout AS settings_enable_session_timeout,
        ss.enable_analytics AS settings_enable_analytics,
        ss.enable_data_backup AS settings_enable_data_backup,
        ss.allow_data_export AS settings_allow_data_export,
        ss.api_key AS settings_api_key,
        ss.enable_webhooks AS settings_enable_webhooks,
        ss.created_at AS settings_created_at,
        ss.updated_at AS settings_updated_at
    FROM 
        shops s
    LEFT JOIN 
        shop_settings ss ON s.id = ss.shop_id
    WHERE 
        s.id = p_shop_id;
END;
$$;
