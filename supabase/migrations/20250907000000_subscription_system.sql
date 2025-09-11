-- Migration: Subscription System
-- Description: Create tables for subscription plans, profile subscriptions, usage tracking, and feature access
-- Date: 2025-09-07

-- Create subscription tier enum
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'enterprise');

-- Create subscription status enum  
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'pending', 'suspended');

-- Create billing period enum
CREATE TYPE billing_period AS ENUM ('monthly', 'yearly', 'lifetime');

-- Create feature type enum
CREATE TYPE feature_type AS ENUM ('poster_design', 'api_access', 'custom_branding', 'priority_support');

-- Create subscription_plans table
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier subscription_tier NOT NULL UNIQUE,
    name TEXT NOT NULL,
    name_en TEXT NOT NULL,
    description TEXT,
    description_en TEXT,
    
    -- Pricing
    monthly_price DECIMAL(10,2),
    yearly_price DECIMAL(10,2),
    lifetime_price DECIMAL(10,2),
    currency TEXT DEFAULT 'THB',
    
    -- Limits (NULL means unlimited)
    max_shops INTEGER,
    max_queues_per_day INTEGER,
    data_retention_months INTEGER,
    max_staff INTEGER,
    max_sms_per_month INTEGER,
    max_promotions INTEGER,
    max_free_poster_designs INTEGER DEFAULT 3,
    
    -- Features (boolean flags)
    has_advanced_reports BOOLEAN DEFAULT FALSE,
    has_custom_qr_code BOOLEAN DEFAULT FALSE,
    has_api_access BOOLEAN DEFAULT FALSE,
    has_priority_support BOOLEAN DEFAULT FALSE,
    has_custom_branding BOOLEAN DEFAULT FALSE,
    has_analytics BOOLEAN DEFAULT FALSE,
    has_promotion_features BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    features JSONB DEFAULT '[]',
    features_en JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profile_subscriptions table
CREATE TABLE profile_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    
    -- Subscription details
    status subscription_status DEFAULT 'active',
    billing_period billing_period NOT NULL,
    
    -- Dates
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ,
    trial_end_date TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    
    -- Payment
    price_per_period DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'THB',
    auto_renew BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    payment_provider TEXT,
    external_subscription_id TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_end_date CHECK (end_date IS NULL OR end_date > start_date),
    CONSTRAINT valid_trial_end CHECK (trial_end_date IS NULL OR trial_end_date >= start_date)
);

-- Create subscription_usage table for tracking usage against limits
CREATE TABLE subscription_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
    
    -- Usage period
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    usage_month DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE),
    
    -- Usage counters
    shops_count INTEGER DEFAULT 0,
    queues_count INTEGER DEFAULT 0,
    staff_count INTEGER DEFAULT 0,
    sms_sent_count INTEGER DEFAULT 0,
    promotions_count INTEGER DEFAULT 0,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint for daily usage per profile/shop
    UNIQUE(profile_id, shop_id, usage_date)
);

-- Add partial unique constraint for profile-only usage tracking
CREATE UNIQUE INDEX idx_subscription_usage_profile_only 
ON subscription_usage(profile_id, usage_date) 
WHERE shop_id IS NULL;

-- Create feature_access table for one-time purchases
CREATE TABLE feature_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Feature details
    feature_type feature_type NOT NULL,
    feature_id TEXT NOT NULL, -- e.g., poster_template_id
    
    -- Access details
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Payment
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'THB',
    
    -- Metadata
    payment_provider TEXT,
    external_payment_id TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate purchases
    UNIQUE(profile_id, feature_type, feature_id)
);

-- Create subscription_payments table for payment history
CREATE TABLE subscription_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES profile_subscriptions(id) ON DELETE CASCADE,
    
    -- Payment details
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'THB',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    
    -- Payment provider details
    payment_provider TEXT,
    external_payment_id TEXT,
    
    -- Dates
    payment_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_profile_subscriptions_profile_id ON profile_subscriptions(profile_id);
CREATE INDEX idx_profile_subscriptions_status ON profile_subscriptions(status);
CREATE INDEX idx_profile_subscriptions_end_date ON profile_subscriptions(end_date);

CREATE INDEX idx_subscription_usage_profile_id ON subscription_usage(profile_id);
CREATE INDEX idx_subscription_usage_shop_id ON subscription_usage(shop_id);
CREATE INDEX idx_subscription_usage_date ON subscription_usage(usage_date);
CREATE INDEX idx_subscription_usage_month ON subscription_usage(usage_month);

CREATE INDEX idx_feature_access_profile_id ON feature_access(profile_id);
CREATE INDEX idx_feature_access_feature_type ON feature_access(feature_type);
CREATE INDEX idx_feature_access_active ON feature_access(is_active);

CREATE INDEX idx_subscription_payments_subscription_id ON subscription_payments(subscription_id);
CREATE INDEX idx_subscription_payments_status ON subscription_payments(payment_status);

-- Insert default subscription plans
INSERT INTO subscription_plans (
    tier, name, name_en, description, description_en,
    monthly_price, yearly_price, lifetime_price,
    max_shops, max_queues_per_day, data_retention_months, max_staff, max_sms_per_month, max_promotions,
    has_advanced_reports, has_custom_qr_code, has_api_access, has_priority_support, 
    has_custom_branding, has_analytics, has_promotion_features,
    features, features_en, sort_order
) VALUES 
-- Free Plan
(
    'free', 'ฟรี', 'Free',
    'เหมาะสำหรับร้านเล็กที่เริ่มต้นใช้งาน',
    'Perfect for small shops getting started',
    0, 0, 0,
    1, 50, 1, 1, 10, 0,
    FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
    '["ร้านค้า 1 ร้าน", "คิวสูงสุด 50 คิว/วัน", "เก็บข้อมูล 1 เดือน", "พนักงาน 1 คน", "SMS 10 ข้อความ/เดือน", "โปสเตอร์ฟรี 3 แบบ"]',
    '["1 Shop", "Up to 50 queues/day", "1 month data retention", "1 Staff member", "10 SMS/month", "3 Free poster designs"]',
    1
),
-- Pro Plan  
(
    'pro', 'โปร', 'Pro',
    'เหมาะสำหรับร้านขนาดกลางที่ต้องการฟีเจอร์ครบครัน',
    'Perfect for medium-sized shops needing full features',
    299, 2990, 399,
    3, 200, 12, 5, 100, 10,
    TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, TRUE,
    '["ร้านค้า 3 ร้าน", "คิวสูงสุด 200 คิว/วัน", "เก็บข้อมูล 1 ปี", "พนักงาน 5 คน", "รายงานขั้นสูง + Analytics", "SMS 100 ข้อความ/เดือน", "QR Code แบบกำหนดเอง", "โปรโมชัน 10 รายการ"]',
    '["3 Shops", "Up to 200 queues/day", "1 year data retention", "5 Staff members", "Advanced reports + Analytics", "100 SMS/month", "Custom QR Code", "10 Promotions"]',
    2
),
-- Enterprise Plan
(
    'enterprise', 'เอนเตอร์ไพรส์', 'Enterprise', 
    'เหมาะสำหรับธุรกิจขนาดใหญ่และเครือข่ายร้านค้า',
    'Perfect for large businesses and shop networks',
    999, 9990, 1299,
    NULL, NULL, NULL, NULL, NULL, NULL,
    TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    '["ร้านค้าไม่จำกัด", "คิวไม่จำกัด", "เก็บข้อมูลตลอดชีพ", "พนักงานไม่จำกัด", "รายงานแบบกำหนดเอง + API", "SMS ไม่จำกัด", "QR Code แบรนด์ของคุณเอง", "โปรโมชันไม่จำกัด", "การสนับสนุน 24/7", "API Access เต็มรูปแบบ"]',
    '["Unlimited Shops", "Unlimited Queues", "Lifetime data retention", "Unlimited Staff", "Custom reports + API", "Unlimited SMS", "Custom branded QR Code", "Unlimited Promotions", "24/7 Priority Support", "Full API Access"]',
    3
);

-- Create function to get active subscription for a profile
CREATE OR REPLACE FUNCTION get_active_subscription(p_profile_id UUID)
RETURNS TABLE (
    subscription_id UUID,
    tier subscription_tier,
    status subscription_status,
    end_date TIMESTAMPTZ,
    plan_limits JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ps.id,
        sp.tier,
        ps.status,
        ps.end_date,
        jsonb_build_object(
            'max_shops', sp.max_shops,
            'max_queues_per_day', sp.max_queues_per_day,
            'data_retention_months', sp.data_retention_months,
            'max_staff', sp.max_staff,
            'max_sms_per_month', sp.max_sms_per_month,
            'max_promotions', sp.max_promotions,
            'max_free_poster_designs', sp.max_free_poster_designs,
            'has_advanced_reports', sp.has_advanced_reports,
            'has_custom_qr_code', sp.has_custom_qr_code,
            'has_api_access', sp.has_api_access,
            'has_priority_support', sp.has_priority_support,
            'has_custom_branding', sp.has_custom_branding,
            'has_analytics', sp.has_analytics,
            'has_promotion_features', sp.has_promotion_features
        ) as plan_limits
    FROM profile_subscriptions ps
    JOIN subscription_plans sp ON ps.plan_id = sp.id
    WHERE ps.profile_id = p_profile_id
        AND ps.status = 'active'
        AND (ps.end_date IS NULL OR ps.end_date > NOW())
    ORDER BY ps.created_at DESC
    LIMIT 1;
END;
$$;

-- Create function to get current usage for a profile
CREATE OR REPLACE FUNCTION get_current_usage(p_profile_id UUID, p_shop_id UUID DEFAULT NULL)
RETURNS TABLE (
    today_queues INTEGER,
    current_shops INTEGER,
    current_staff INTEGER,
    monthly_sms INTEGER,
    active_promotions INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER  
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(
            (SELECT SUM(queues_count) 
             FROM subscription_usage 
             WHERE profile_id = p_profile_id 
               AND usage_date = CURRENT_DATE
               AND (p_shop_id IS NULL OR shop_id = p_shop_id)
            ), 0
        )::INTEGER as today_queues,
        
        COALESCE(
            (SELECT COUNT(DISTINCT s.id)
             FROM shops s 
             WHERE s.profile_id = p_profile_id 
               AND s.status = 'active'
            ), 0
        )::INTEGER as current_shops,
        
        COALESCE(
            (SELECT COUNT(*)
             FROM employees e
             JOIN shops s ON e.shop_id = s.id
             WHERE s.profile_id = p_profile_id
               AND e.status = 'active'
               AND (p_shop_id IS NULL OR s.id = p_shop_id)
            ), 0
        )::INTEGER as current_staff,
        
        COALESCE(
            (SELECT SUM(sms_sent_count)
             FROM subscription_usage
             WHERE profile_id = p_profile_id
               AND usage_month = DATE_TRUNC('month', CURRENT_DATE)
               AND (p_shop_id IS NULL OR shop_id = p_shop_id)
            ), 0
        )::INTEGER as monthly_sms,
        
        COALESCE(
            (SELECT COUNT(*)
             FROM promotions p
             JOIN shops s ON p.shop_id = s.id  
             WHERE s.profile_id = p_profile_id
               AND p.status = 'active'
               AND p.start_at <= NOW()
               AND p.end_at >= NOW()
               AND (p_shop_id IS NULL OR s.id = p_shop_id)
            ), 0
        )::INTEGER as active_promotions;
END;
$$;

-- Create function to check if user can perform action
CREATE OR REPLACE FUNCTION can_perform_action(
    p_profile_id UUID,
    p_action TEXT,
    p_shop_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_subscription RECORD;
    v_usage RECORD;
BEGIN
    -- Get active subscription
    SELECT * INTO v_subscription 
    FROM get_active_subscription(p_profile_id) 
    LIMIT 1;
    
    -- If no subscription, use free tier limits from profile role
    IF v_subscription IS NULL THEN
        SELECT * INTO v_subscription
        FROM get_active_subscription(p_profile_id)
        WHERE tier = 'free'
        LIMIT 1;
    END IF;
    
    -- Get current usage
    SELECT * INTO v_usage
    FROM get_current_usage(p_profile_id, p_shop_id);
    
    -- Check limits based on action
    CASE p_action
        WHEN 'create_shop' THEN
            RETURN (v_subscription.plan_limits->>'max_shops')::INTEGER IS NULL 
                OR v_usage.current_shops < (v_subscription.plan_limits->>'max_shops')::INTEGER;
                
        WHEN 'create_queue' THEN  
            RETURN (v_subscription.plan_limits->>'max_queues_per_day')::INTEGER IS NULL
                OR v_usage.today_queues < (v_subscription.plan_limits->>'max_queues_per_day')::INTEGER;
                
        WHEN 'add_staff' THEN
            RETURN (v_subscription.plan_limits->>'max_staff')::INTEGER IS NULL
                OR v_usage.current_staff < (v_subscription.plan_limits->>'max_staff')::INTEGER;
                
        WHEN 'send_sms' THEN
            RETURN (v_subscription.plan_limits->>'max_sms_per_month')::INTEGER IS NULL  
                OR v_usage.monthly_sms < (v_subscription.plan_limits->>'max_sms_per_month')::INTEGER;
                
        WHEN 'create_promotion' THEN
            RETURN (v_subscription.plan_limits->>'max_promotions')::INTEGER IS NULL
                OR v_usage.active_promotions < (v_subscription.plan_limits->>'max_promotions')::INTEGER;
                
        ELSE
            RETURN TRUE;
    END CASE;
END;
$$;

-- Create trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_subscriptions_updated_at BEFORE UPDATE ON profile_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_usage_updated_at BEFORE UPDATE ON subscription_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_access_updated_at BEFORE UPDATE ON feature_access FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_payments_updated_at BEFORE UPDATE ON subscription_payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- subscription_plans: Public read access for active plans
CREATE POLICY "Users can view active subscription plans" ON subscription_plans FOR SELECT USING (is_active = true);

-- profile_subscriptions: Users can only see their own subscriptions
CREATE POLICY "Users can view their own profile subscriptions" ON profile_subscriptions FOR SELECT USING (
    profile_id = (SELECT id FROM profiles WHERE auth_id = auth.uid())
);

-- subscription_usage: Users can only see their own usage statistics
CREATE POLICY "Users can view their own subscription usage stats" ON subscription_usage FOR SELECT USING (
    profile_id = (SELECT id FROM profiles WHERE auth_id = auth.uid())
);

-- feature_access: Users can only see their own purchased features
CREATE POLICY "Users can view their own purchased feature access" ON feature_access FOR SELECT USING (
    profile_id = (SELECT id FROM profiles WHERE auth_id = auth.uid())
);

-- subscription_payments: Users can only see their own payment history
CREATE POLICY "Users can view their own subscription payment history" ON subscription_payments FOR SELECT USING (
    subscription_id IN (
        SELECT id FROM profile_subscriptions 
        WHERE profile_id = (SELECT id FROM profiles WHERE auth_id = auth.uid())
    )
);

-- Admin policies (for backend management)
CREATE POLICY "Admins have full access to manage subscription plans" ON subscription_plans FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profile_roles pr
        JOIN profiles p ON pr.profile_id = p.id
        WHERE p.auth_id = auth.uid() AND pr.role = 'admin'
    )
);

CREATE POLICY "Admins have full access to manage profile subscriptions" ON profile_subscriptions FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profile_roles pr
        JOIN profiles p ON pr.profile_id = p.id
        WHERE p.auth_id = auth.uid() AND pr.role = 'admin'
    )
);

CREATE POLICY "Admins have full access to view subscription usage analytics" ON subscription_usage FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profile_roles pr
        JOIN profiles p ON pr.profile_id = p.id
        WHERE p.auth_id = auth.uid() AND pr.role = 'admin'
    )
);

CREATE POLICY "Admins have full access to manage feature access purchases" ON feature_access FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profile_roles pr
        JOIN profiles p ON pr.profile_id = p.id
        WHERE p.auth_id = auth.uid() AND pr.role = 'admin'
    )
);

CREATE POLICY "Admins have full access to manage subscription payments" ON subscription_payments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profile_roles pr
        JOIN profiles p ON pr.profile_id = p.id
        WHERE p.auth_id = auth.uid() AND pr.role = 'admin'
    )
);
