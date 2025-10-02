-- ========================================
-- Notification Credentials Table
-- ========================================
-- Purpose: เก็บ LINE Notify และ Telegram Bot credentials
-- สำหรับส่ง notification ไปยัง shop owners และ managers

CREATE TABLE IF NOT EXISTS public.notification_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Keys
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    
    -- LINE Notify Configuration
    line_notify_token TEXT,
    line_notify_enabled BOOLEAN DEFAULT false,
    
    -- Telegram Bot Configuration
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    telegram_enabled BOOLEAN DEFAULT false,
    
    -- Notification Preferences (per shop)
    notify_new_queue BOOLEAN DEFAULT true,
    notify_queue_confirmed BOOLEAN DEFAULT true,
    notify_queue_serving BOOLEAN DEFAULT true,
    notify_queue_completed BOOLEAN DEFAULT false,
    notify_queue_cancelled BOOLEAN DEFAULT true,
    notify_queue_no_show BOOLEAN DEFAULT true,
    
    -- Daily Summary
    notify_daily_summary BOOLEAN DEFAULT false,
    daily_summary_time TIME DEFAULT '18:00:00', -- 6 PM
    
    -- Quiet Hours (ไม่ส่ง notification ในช่วงเวลานี้)
    enable_quiet_hours BOOLEAN DEFAULT false,
    quiet_hours_start TIME DEFAULT '22:00:00', -- 10 PM
    quiet_hours_end TIME DEFAULT '08:00:00',   -- 8 AM
    
    -- Metadata
    last_notification_sent_at TIMESTAMP WITH TIME ZONE,
    notification_count_today INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT notification_credentials_profile_shop_unique UNIQUE(profile_id, shop_id),
    CONSTRAINT notification_credentials_line_token_check CHECK (
        (line_notify_enabled = false) OR 
        (line_notify_enabled = true AND line_notify_token IS NOT NULL)
    ),
    CONSTRAINT notification_credentials_telegram_check CHECK (
        (telegram_enabled = false) OR 
        (telegram_enabled = true AND telegram_bot_token IS NOT NULL AND telegram_chat_id IS NOT NULL)
    )
);

-- ========================================
-- Indexes
-- ========================================
CREATE INDEX idx_notification_credentials_profile_id ON public.notification_credentials(profile_id);
CREATE INDEX idx_notification_credentials_shop_id ON public.notification_credentials(shop_id);
CREATE INDEX idx_notification_credentials_enabled ON public.notification_credentials(profile_id, shop_id) 
    WHERE line_notify_enabled = true OR telegram_enabled = true;

-- ========================================
-- Row Level Security (RLS)
-- ========================================
ALTER TABLE public.notification_credentials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notification credentials
CREATE POLICY "Users can view their own notification credentials"
    ON public.notification_credentials FOR SELECT
    USING (profile_id = public.get_active_profile_id());

-- Policy: Users can insert their own notification credentials
CREATE POLICY "Users can insert their own notification credentials"
    ON public.notification_credentials FOR INSERT
    WITH CHECK (profile_id = public.get_active_profile_id());

-- Policy: Users can update their own notification credentials
CREATE POLICY "Users can update their own notification credentials"
    ON public.notification_credentials FOR UPDATE
    USING (profile_id = public.get_active_profile_id())
    WITH CHECK (profile_id = public.get_active_profile_id());

-- Policy: Users can delete their own notification credentials
CREATE POLICY "Users can delete their own notification credentials"
    ON public.notification_credentials FOR DELETE
    USING (profile_id = public.get_active_profile_id());

-- Policy: Shop owners can view credentials for their shops
CREATE POLICY "Shop owners can view notification credentials for their shops"
    ON public.notification_credentials FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.shops
            WHERE shops.id = notification_credentials.shop_id
            AND shops.owner_id = public.get_active_profile_id()
        )
    );

-- ========================================
-- Helper Functions
-- ========================================

-- Function: Get notification recipients for a shop
CREATE OR REPLACE FUNCTION public.get_notification_recipients_for_shop(p_shop_id UUID)
RETURNS TABLE (
    profile_id UUID,
    line_notify_token TEXT,
    line_notify_enabled BOOLEAN,
    telegram_bot_token TEXT,
    telegram_chat_id TEXT,
    telegram_enabled BOOLEAN,
    notify_new_queue BOOLEAN,
    enable_quiet_hours BOOLEAN,
    quiet_hours_start TIME,
    quiet_hours_end TIME
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nc.profile_id,
        nc.line_notify_token,
        nc.line_notify_enabled,
        nc.telegram_bot_token,
        nc.telegram_chat_id,
        nc.telegram_enabled,
        nc.notify_new_queue,
        nc.enable_quiet_hours,
        nc.quiet_hours_start,
        nc.quiet_hours_end
    FROM public.notification_credentials nc
    WHERE nc.shop_id = p_shop_id
    AND (nc.line_notify_enabled = true OR nc.telegram_enabled = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if notification should be sent (quiet hours check)
CREATE OR REPLACE FUNCTION public.should_send_notification(
    p_credential_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_enable_quiet_hours BOOLEAN;
    v_quiet_start TIME;
    v_quiet_end TIME;
    v_current_time TIME;
BEGIN
    SELECT 
        enable_quiet_hours,
        quiet_hours_start,
        quiet_hours_end
    INTO v_enable_quiet_hours, v_quiet_start, v_quiet_end
    FROM public.notification_credentials
    WHERE id = p_credential_id;
    
    -- If quiet hours not enabled, always send
    IF NOT v_enable_quiet_hours THEN
        RETURN true;
    END IF;
    
    v_current_time := CURRENT_TIME;
    
    -- Check if current time is within quiet hours
    IF v_quiet_start < v_quiet_end THEN
        -- Normal case: quiet hours within same day (e.g., 22:00-08:00 crosses midnight)
        RETURN NOT (v_current_time >= v_quiet_start AND v_current_time < v_quiet_end);
    ELSE
        -- Crosses midnight case (e.g., 22:00 to 08:00 next day)
        RETURN (v_current_time >= v_quiet_end AND v_current_time < v_quiet_start);
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update notification count and last sent timestamp
CREATE OR REPLACE FUNCTION public.update_notification_sent(
    p_credential_id UUID
)
RETURNS void AS $$
BEGIN
    UPDATE public.notification_credentials
    SET 
        last_notification_sent_at = NOW(),
        notification_count_today = notification_count_today + 1,
        updated_at = NOW()
    WHERE id = p_credential_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- Trigger: Auto-update updated_at
-- ========================================
CREATE TRIGGER update_notification_credentials_updated_at 
    BEFORE UPDATE ON public.notification_credentials 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- Trigger: Reset daily notification count at midnight
-- ========================================
CREATE OR REPLACE FUNCTION public.reset_daily_notification_count()
RETURNS void AS $$
BEGIN
    UPDATE public.notification_credentials
    SET notification_count_today = 0
    WHERE DATE(last_notification_sent_at) < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Schedule this function to run daily using pg_cron or external scheduler
-- Example with pg_cron:
-- SELECT cron.schedule('reset-notification-count', '0 0 * * *', 'SELECT public.reset_daily_notification_count()');

-- ========================================
-- Comments
-- ========================================
COMMENT ON TABLE public.notification_credentials IS 'Stores LINE Notify and Telegram Bot credentials for sending notifications';
COMMENT ON COLUMN public.notification_credentials.profile_id IS 'User who will receive notifications (owner or manager)';
COMMENT ON COLUMN public.notification_credentials.shop_id IS 'Shop that notifications are for';
COMMENT ON COLUMN public.notification_credentials.line_notify_token IS 'LINE Notify access token (encrypted recommended)';
COMMENT ON COLUMN public.notification_credentials.telegram_bot_token IS 'Telegram Bot API token';
COMMENT ON COLUMN public.notification_credentials.telegram_chat_id IS 'Telegram chat ID to send messages to';
COMMENT ON COLUMN public.notification_credentials.notify_new_queue IS 'Send notification when new queue is created';
COMMENT ON COLUMN public.notification_credentials.enable_quiet_hours IS 'Do not send notifications during quiet hours';
COMMENT ON COLUMN public.notification_credentials.notification_count_today IS 'Number of notifications sent today (for rate limiting)';
