-- Initial Schema for Shop Queue System
-- Based on presenter data usage patterns

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE shop_status AS ENUM ('draft', 'active', 'inactive', 'suspended');
CREATE TYPE queue_status AS ENUM ('waiting', 'confirmed', 'serving', 'completed', 'cancelled', 'no_show');
CREATE TYPE queue_priority AS ENUM ('normal', 'high', 'urgent');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'qr', 'transfer');
CREATE TYPE employee_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE promotion_type AS ENUM ('percentage', 'fixed_amount', 'buy_x_get_y', 'free_item');
CREATE TYPE promotion_status AS ENUM ('active', 'inactive', 'expired', 'scheduled');
CREATE TYPE poster_category AS ENUM ('modern', 'classic', 'minimal', 'professional');
CREATE TYPE poster_layout AS ENUM ('portrait', 'landscape', 'square');
CREATE TYPE membership_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE reward_type AS ENUM ('discount', 'free_item', 'cashback', 'special_privilege');
CREATE TYPE transaction_type AS ENUM ('earned', 'redeemed', 'expired');
CREATE TYPE redemption_type AS ENUM ('points_redemption', 'free_reward', 'special_event', 'promotional_gift', 'loyalty_bonus');
CREATE TYPE activity_type AS ENUM (
    -- Queue Activities
    'queue_created', 'queue_updated', 'queue_completed', 'queue_cancelled', 'queue_served', 'queue_confirmed',
    -- Customer Activities  
    'customer_registered', 'customer_updated', 'customer_deleted', 'customer_visit',
    -- Shop Activities
    'shop_created', 'shop_updated', 'shop_status_changed', 'shop_settings_updated',
    -- Employee Activities
    'employee_added', 'employee_updated', 'employee_removed', 'employee_login', 'employee_logout', 'employee_duty_start', 'employee_duty_end',
    -- Service Activities
    'service_added', 'service_updated', 'service_removed', 'service_availability_changed',
    -- Payment Activities
    'payment_created', 'payment_completed', 'payment_failed', 'payment_refunded',
    -- Promotion Activities
    'promotion_created', 'promotion_updated', 'promotion_activated', 'promotion_deactivated', 'promotion_used',
    -- Point & Reward Activities
    'points_earned', 'points_redeemed', 'points_expired', 'reward_claimed', 'membership_upgraded',
    -- System Activities
    'system_backup', 'system_maintenance', 'system_error', 'system_alert',
    -- Department Activities
    'department_created', 'department_updated', 'department_removed',
    -- Opening Hours Activities
    'opening_hours_updated', 'shop_opened', 'shop_closed'
);

-- 1. Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Shops table
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    logo TEXT,
    qr_code_url TEXT,
    timezone TEXT DEFAULT 'Asia/Bangkok',
    currency TEXT DEFAULT 'THB',
    language TEXT DEFAULT 'th',
    status shop_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3 Category shops
CREATE TABLE category_shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    date_of_birth DATE,
    gender TEXT,
    address TEXT,
    notes TEXT,
    last_visit TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Shop opening hours
CREATE TABLE shop_opening_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    day_of_week TEXT NOT NULL,
    is_open BOOLEAN DEFAULT true,
    open_time TIME,
    close_time TIME,
    break_start TIME,
    break_end TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    estimated_duration INTEGER DEFAULT 15, -- minutes
    category TEXT,
    is_available BOOLEAN DEFAULT true,
    icon TEXT,
    popularity_rank INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    employee_code TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT ,
    position_text TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    salary DECIMAL(10,2),
    hire_date DATE,
    status employee_status DEFAULT 'active',
    station_number INTEGER,
    is_on_duty BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    permissions TEXT[], -- JSON array of permissions
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Queues
CREATE TABLE queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    queue_number TEXT NOT NULL,
    status queue_status DEFAULT 'waiting',
    priority queue_priority DEFAULT 'normal',
    estimated_duration INTEGER DEFAULT 15, -- minutes
    estimated_call_time TIMESTAMP WITH TIME ZONE,
    served_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    note TEXT,
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    served_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancelled_reason TEXT,
    cancelled_note TEXT
);

-- 10. Queue Services (Many-to-Many)
CREATE TABLE queue_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_id UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_id UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    payment_status payment_status DEFAULT 'unpaid',
    payment_method payment_method,
    processed_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Payment Items
CREATE TABLE payment_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Promotions
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type promotion_type NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    start_at TIMESTAMP WITH TIME ZONE NOT NULL,
    end_at TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_limit INTEGER,
    status promotion_status DEFAULT 'active',
    conditions JSONB DEFAULT '[]',
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shop_id, name)
);

-- Promotion <> Service
CREATE TABLE promotion_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE
);

-- Promotion usage log
CREATE TABLE promotion_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id),
    queue_id UUID REFERENCES queues(id),
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- 14. Poster Templates
CREATE TABLE poster_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category poster_category NOT NULL,
    is_premium BOOLEAN DEFAULT false,
    preview_image TEXT,
    background_color TEXT,
    text_color TEXT,
    accent_color TEXT,
    layout poster_layout DEFAULT 'portrait',
    features TEXT[],
    price DECIMAL(10,2) DEFAULT 0, -- for premium templates
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Customer Points
CREATE TABLE customer_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    current_points INTEGER DEFAULT 0,
    total_earned INTEGER DEFAULT 0,
    total_redeemed INTEGER DEFAULT 0,
    membership_tier membership_tier DEFAULT 'bronze',
    tier_benefits TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Customer Point Transactions
CREATE TABLE customer_point_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_point_id UUID NOT NULL REFERENCES customer_points(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    points INTEGER NOT NULL,
    description TEXT,
    related_queue_id UUID REFERENCES queues(id) ON DELETE SET NULL,
    metadata JSONB,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Customer Point Expiry
CREATE TABLE customer_point_expiry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_point_transaction_id UUID NOT NULL REFERENCES customer_point_transactions(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Rewards
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type reward_type NOT NULL,
    points_required INTEGER NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    expiry_days INTEGER DEFAULT 30,
    usage_limit INTEGER,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Reward Usage
CREATE TABLE reward_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    reward_id UUID NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
    customer_point_transaction_id UUID REFERENCES customer_point_transactions(id) ON DELETE CASCADE, -- NULLABLE สำหรับรางวัลฟรี
    redemption_code TEXT NOT NULL UNIQUE, -- รหัสสำหรับใช้แลกรางวัล เช่น "RW240906001"
    redemption_type redemption_type DEFAULT 'points_redemption', -- ประเภทการแลกรางวัล
    source_description TEXT, -- อธิบายที่มาของรางวัลฟรี เช่น "Birthday Gift", "Grand Opening Event"
    points_used INTEGER NOT NULL DEFAULT 0, -- อนุญาตให้เป็น 0 สำหรับรางวัลฟรี
    reward_value DECIMAL(10,2) NOT NULL, -- มูลค่ารางวัลที่แลก
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- วันที่ออกรางวัล
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- วันหมดอายุของรางวัล
    used_at TIMESTAMP WITH TIME ZONE, -- วันที่ใช้รางวัล
    used_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL, -- พนักงานที่ให้ใช้รางวัล
    used_queue_id UUID REFERENCES queues(id) ON DELETE SET NULL, -- คิวที่ใช้รางวัล
    cancelled_at TIMESTAMP WITH TIME ZONE, -- วันที่ยกเลิกรางวัล
    cancelled_by_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL, -- พนักงานที่ยกเลิก
    cancelled_reason TEXT, -- เหตุผลในการยกเลิก
    notes TEXT, -- หมายเหตุเพิ่มเติม
    metadata JSONB, -- ข้อมูลเพิ่มเติมในรูปแบบ JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- ตรวจสอบว่าวันหมดอายุต้องไม่เก่ากว่าวันที่ออกรางวัล
    CONSTRAINT valid_expiry_date CHECK (expires_at IS NULL OR expires_at > issued_at),
    
    -- ตรวจสอบว่าวันที่ใช้รางวัลต้องไม่เก่ากว่าวันที่ออกรางวัล
    CONSTRAINT valid_used_date CHECK (used_at IS NULL OR used_at >= issued_at),
    
    -- ตรวจสอบว่าคะแนนที่ใช้ต้องเป็นจำนวนไม่ติดลบ
    CONSTRAINT non_negative_points_used CHECK (points_used >= 0),
    
    -- ตรวจสอบว่ามูลค่ารางวัลต้องเป็นจำนวนบวก
    CONSTRAINT positive_reward_value CHECK (reward_value >= 0)
);

-- 20. Shop Settings
CREATE TABLE shop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,

    estimated_service_time INTEGER DEFAULT 15, -- minutes
    
    maintenance_mode BOOLEAN DEFAULT false,
    allow_registration BOOLEAN DEFAULT true,
    session_timeout INTEGER DEFAULT 30, -- minutes
    backup_frequency TEXT DEFAULT 'daily',
    log_level TEXT DEFAULT 'info',
    data_retention_days INTEGER DEFAULT 365,
    
    -- Queue Settings
    auto_confirm_queues BOOLEAN DEFAULT true,
    max_queue_size INTEGER DEFAULT 50,
    max_queue_per_service INTEGER NOT NULL DEFAULT 10,
    queue_timeout_minutes INTEGER NOT NULL DEFAULT 30,
    allow_walk_in BOOLEAN NOT NULL DEFAULT true,
    allow_advance_booking BOOLEAN NOT NULL DEFAULT true,
    max_advance_booking_days INTEGER NOT NULL DEFAULT 7,
    booking_window_hours INTEGER DEFAULT 24,
    cancellation_deadline INTEGER DEFAULT 30, -- minutes
    
    -- Points System
    points_enabled BOOLEAN NOT NULL DEFAULT false,
    points_per_baht INTEGER NOT NULL DEFAULT 1,
    points_expiry_months INTEGER NOT NULL DEFAULT 12,
    minimum_points_to_redeem INTEGER NOT NULL DEFAULT 100,
    
    -- Notification Settings
    sms_enabled BOOLEAN NOT NULL DEFAULT false,
    email_enabled BOOLEAN NOT NULL DEFAULT true,
    line_notify_enabled BOOLEAN NOT NULL DEFAULT false,
    notify_before_minutes INTEGER NOT NULL DEFAULT 15,
    
    -- Payment Settings
    accept_cash BOOLEAN NOT NULL DEFAULT true,
    accept_credit_card BOOLEAN NOT NULL DEFAULT false,
    accept_bank_transfer BOOLEAN NOT NULL DEFAULT false,
    accept_promptpay BOOLEAN NOT NULL DEFAULT false,
    promptpay_id TEXT,
    
    -- Display Settings
    theme TEXT NOT NULL DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    date_format TEXT NOT NULL DEFAULT 'DD/MM/YYYY',
    time_format TEXT NOT NULL DEFAULT '24h' CHECK (time_format IN ('12h', '24h')),
    
    -- Advanced Settings
    auto_confirm_booking BOOLEAN NOT NULL DEFAULT false,
    require_customer_phone BOOLEAN NOT NULL DEFAULT true,
    allow_guest_booking BOOLEAN NOT NULL DEFAULT false,
    show_prices_public BOOLEAN NOT NULL DEFAULT true,
    enable_reviews BOOLEAN NOT NULL DEFAULT true,
    
    -- Security Settings
    enable_two_factor BOOLEAN NOT NULL DEFAULT false,
    require_email_verification BOOLEAN NOT NULL DEFAULT false,
    enable_session_timeout BOOLEAN NOT NULL DEFAULT false,
    
    -- Data & Privacy Settings
    enable_analytics BOOLEAN NOT NULL DEFAULT false,
    enable_data_backup BOOLEAN NOT NULL DEFAULT false,
    allow_data_export BOOLEAN NOT NULL DEFAULT false,
    
    -- API & Integration Settings
    api_key TEXT NOT NULL DEFAULT '',
    enable_webhooks BOOLEAN NOT NULL DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(shop_id),
    
    -- Check constraints
    CONSTRAINT shop_settings_max_queue_per_service_check CHECK (max_queue_per_service > 0),
    CONSTRAINT shop_settings_queue_timeout_minutes_check CHECK (queue_timeout_minutes > 0),
    CONSTRAINT shop_settings_max_advance_booking_days_check CHECK (max_advance_booking_days > 0),
    CONSTRAINT shop_settings_points_per_baht_check CHECK (points_per_baht >= 0),
    CONSTRAINT shop_settings_points_expiry_months_check CHECK (points_expiry_months > 0),
    CONSTRAINT shop_settings_minimum_points_to_redeem_check CHECK (minimum_points_to_redeem >= 0),
    CONSTRAINT shop_settings_notify_before_minutes_check CHECK (notify_before_minutes >= 0)
);

-- 21. Notification Settings
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    new_queue BOOLEAN DEFAULT true,
    queue_update BOOLEAN DEFAULT true,
    shift_reminder BOOLEAN DEFAULT true,
    system_alerts BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shop_id)
);

-- 22. Activity Log
CREATE TABLE shop_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    type activity_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_name ON categories(name);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_shops_owner_id ON shops(owner_id);
CREATE INDEX idx_shops_name ON shops(name);
CREATE INDEX idx_shops_slug ON shops(slug);
CREATE INDEX idx_shops_status ON shops(status);
CREATE INDEX idx_category_shops_category_id ON category_shops(category_id);
CREATE INDEX idx_category_shops_shop_id ON category_shops(shop_id);
CREATE INDEX idx_customer_shop_id ON customers(shop_id);
CREATE INDEX idx_customer_name ON customers(name);
CREATE INDEX idx_customer_phone ON customers(phone);
CREATE INDEX idx_customer_profile_id ON customers(profile_id);
CREATE INDEX idx_shop_opening_hours_shop_id ON shop_opening_hours(shop_id);
CREATE INDEX idx_services_shop_id ON services(shop_id);
CREATE INDEX idx_services_is_available ON services(is_available);
CREATE INDEX idx_departments_shop_id ON departments(shop_id);
CREATE INDEX idx_employees_shop_id ON employees(shop_id);
CREATE INDEX idx_employees_profile_id ON employees(profile_id);
CREATE INDEX idx_employees_is_on_duty ON employees(is_on_duty);
CREATE INDEX idx_queues_shop_id ON queues(shop_id);
CREATE INDEX idx_queues_status ON queues(status);
CREATE INDEX idx_queues_priority ON queues(priority);
CREATE INDEX idx_queues_created_at ON queues(created_at);
CREATE INDEX idx_queues_queue_number ON queues(queue_number);
CREATE INDEX idx_queue_services_queue_id ON queue_services(queue_id);
CREATE INDEX idx_queue_services_service_id ON queue_services(service_id);
CREATE INDEX idx_payments_queue_id ON payments(queue_id);
CREATE INDEX idx_payments_payment_status ON payments(payment_status);
CREATE INDEX idx_payment_items_payment_id ON payment_items(payment_id);
CREATE INDEX idx_promotions_shop_id ON promotions(shop_id);
CREATE INDEX idx_promotions_shop_id_name ON promotions(shop_id, name);
CREATE INDEX idx_promotions_type ON promotions(type);
CREATE INDEX idx_promotions_min_purchase_amount ON promotions(min_purchase_amount);
CREATE INDEX idx_promotions_max_discount_amount ON promotions(max_discount_amount);
CREATE INDEX idx_promotions_start_at ON promotions(start_at);
CREATE INDEX idx_promotions_end_at ON promotions(end_at);
CREATE INDEX idx_promotions_usage_limit ON promotions(usage_limit);
CREATE INDEX idx_promotions_status ON promotions(status);
CREATE INDEX idx_promotion_usage_logs_promotion_id ON promotion_usage_logs(promotion_id);
CREATE INDEX idx_promotion_usage_logs_customer_id ON promotion_usage_logs(customer_id);
CREATE INDEX idx_promotion_usage_logs_queue_id ON promotion_usage_logs(queue_id);
CREATE INDEX idx_promotion_usage_logs_used_at ON promotion_usage_logs(used_at);
CREATE INDEX idx_customer_points_shop_id ON customer_points(shop_id);
CREATE INDEX idx_customer_points_customer_id ON customer_points(customer_id);
CREATE INDEX idx_customer_points_membership_tier ON customer_points(membership_tier);
CREATE INDEX idx_customer_point_transactions_customer_point_id ON customer_point_transactions(customer_point_id);
CREATE INDEX idx_customer_point_transactions_type ON customer_point_transactions(type);
CREATE INDEX idx_customer_point_transactions_points ON customer_point_transactions(points);
CREATE INDEX idx_customer_point_transactions_transaction_date ON customer_point_transactions(transaction_date);
CREATE INDEX idx_rewards_shop_id ON rewards(shop_id);
CREATE INDEX idx_rewards_type ON rewards(type);
CREATE INDEX idx_rewards_points_required ON rewards(points_required);
CREATE INDEX idx_rewards_is_available ON rewards(is_available);
CREATE INDEX idx_reward_usages_shop_id ON reward_usages(shop_id);
CREATE INDEX idx_reward_usages_customer_id ON reward_usages(customer_id);
CREATE INDEX idx_reward_usages_reward_id ON reward_usages(reward_id);
CREATE INDEX idx_reward_usages_status ON reward_usages(status);
CREATE INDEX idx_reward_usages_redemption_type ON reward_usages(redemption_type);
CREATE INDEX idx_reward_usages_issued_at ON reward_usages(issued_at);
CREATE INDEX idx_reward_usages_expires_at ON reward_usages(expires_at);
CREATE INDEX idx_reward_usages_redemption_code ON reward_usages(redemption_code);
CREATE INDEX idx_shop_activities_shop_id ON shop_activity_log(shop_id);
CREATE INDEX idx_shop_activities_type ON shop_activity_log(type);
CREATE INDEX idx_shop_activities_created_at ON shop_activity_log(created_at DESC);

-- สำหรับเช็ครางวัลที่ใช้ได้
CREATE INDEX idx_reward_usages_active 
ON reward_usages(reward_id, status) 
WHERE status IN ('active', 'used');

-- สำหรับเช็ครางวัลหมดอายุ
CREATE INDEX idx_reward_usages_expiry 
ON reward_usages(expires_at) 
WHERE expires_at IS NOT NULL;


-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON shops FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_opening_hours_updated_at BEFORE UPDATE ON shop_opening_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_queues_updated_at BEFORE UPDATE ON queues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_poster_templates_updated_at BEFORE UPDATE ON poster_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customer_points_updated_at BEFORE UPDATE ON customer_points FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shop_settings_updated_at BEFORE UPDATE ON shop_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger function to automatically create shop_settings when a shop is created
CREATE OR REPLACE FUNCTION create_shop_settings_on_shop_create()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default shop settings for the new shop
  INSERT INTO public.shop_settings (
    shop_id,
    estimated_service_time,
    maintenance_mode,
    allow_registration,
    session_timeout,
    backup_frequency,
    log_level,
    data_retention_days,
    auto_confirm_queues,
    max_queue_size,
    max_queue_per_service,
    queue_timeout_minutes,
    allow_walk_in,
    allow_advance_booking,
    max_advance_booking_days,
    booking_window_hours,
    cancellation_deadline,
    points_enabled,
    points_per_baht,
    points_expiry_months,
    minimum_points_to_redeem,
    sms_enabled,
    email_enabled,
    line_notify_enabled,
    notify_before_minutes,
    accept_cash,
    accept_credit_card,
    accept_bank_transfer,
    accept_promptpay,
    promptpay_id,
    theme,
    date_format,
    time_format,
    auto_confirm_booking,
    require_customer_phone,
    allow_guest_booking,
    show_prices_public,
    enable_reviews,
    enable_two_factor,
    require_email_verification,
    enable_session_timeout,
    enable_analytics,
    enable_data_backup,
    allow_data_export,
    api_key,
    enable_webhooks
  ) VALUES (
    NEW.id,
    15, -- estimated_service_time
    false, -- maintenance_mode
    true, -- allow_registration
    30, -- session_timeout
    'daily', -- backup_frequency
    'info', -- log_level
    365, -- data_retention_days
    true, -- auto_confirm_queues
    50, -- max_queue_size
    10, -- max_queue_per_service
    30, -- queue_timeout_minutes
    true, -- allow_walk_in
    true, -- allow_advance_booking
    7, -- max_advance_booking_days
    24, -- booking_window_hours
    30, -- cancellation_deadline
    false, -- points_enabled
    1, -- points_per_baht
    12, -- points_expiry_months
    100, -- minimum_points_to_redeem
    false, -- sms_enabled
    true, -- email_enabled
    false, -- line_notify_enabled
    15, -- notify_before_minutes
    true, -- accept_cash
    false, -- accept_credit_card
    false, -- accept_bank_transfer
    false, -- accept_promptpay
    '', -- promptpay_id
    'light', -- theme
    'DD/MM/YYYY', -- date_format
    '24h', -- time_format
    false, -- auto_confirm_booking
    true, -- require_customer_phone
    false, -- allow_guest_booking
    true, -- show_prices_public
    true, -- enable_reviews
    false, -- enable_two_factor
    false, -- require_email_verification
    false, -- enable_session_timeout
    false, -- enable_analytics
    false, -- enable_data_backup
    false, -- allow_data_export
    '', -- api_key
    false -- enable_webhooks
  )
  ON CONFLICT (shop_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically insert shop_settings when a shop is created
CREATE TRIGGER trigger_create_shop_settings_on_shop_create
AFTER INSERT ON public.shops
FOR EACH ROW
EXECUTE FUNCTION create_shop_settings_on_shop_create();

-- Enable Row Level Security on all shop tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poster_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_point_expiry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_activity_log ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is shop owner
CREATE OR REPLACE FUNCTION public.is_shop_owner(shop_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.shops 
    WHERE id = shop_id_param 
    AND owner_id = public.get_active_profile_id()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Helper function to check if user is shop manager
CREATE OR REPLACE FUNCTION public.is_shop_manager(shop_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, only shop owner is considered manager
  RETURN EXISTS (
    SELECT 1 FROM public.shops 
    WHERE id = shop_id_param 
    AND owner_id = public.get_active_profile_id()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is shop employee (can be extended)
CREATE OR REPLACE FUNCTION public.is_shop_employee(shop_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, only shop manager is considered employee
  RETURN public.is_shop_manager(shop_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Table policies

-- Categories table policies
-- Categories are viewable by everyone
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

-- Only admins can create, update, or delete categories
CREATE POLICY "Only admins can create categories"
  ON public.categories FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update categories"
  ON public.categories FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete categories"
  ON public.categories FOR DELETE
  USING (is_admin());


-- Shops table policies
-- Anyone can view shops
CREATE POLICY "Shops are viewable by everyone"
  ON public.shops FOR SELECT
  USING (true);

-- Only authenticated users can create shops
CREATE POLICY "Authenticated users can create shops"
  ON public.shops FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE auth_id = auth.uid() AND id = owner_id AND is_active = true
  ));

-- Only shop managers can update their shops
CREATE POLICY "Shop managers can update their shops"
  ON public.shops FOR UPDATE
  USING (public.is_shop_manager(id))
  WITH CHECK (public.is_shop_manager(id));

-- Only shop managers can delete their shops
CREATE POLICY "Shop managers can delete their shops"
  ON public.shops FOR DELETE
  USING (public.is_shop_manager(id));

-- Column-level privileges to prevent clients from setting/changing shop status
-- Remove broad INSERT/UPDATE privileges then grant only allowed columns to authenticated users
REVOKE INSERT ON TABLE public.shops FROM authenticated;
REVOKE UPDATE ON TABLE public.shops FROM authenticated;
GRANT INSERT (owner_id, slug, name, description, address, phone, email, status, website, logo, qr_code_url, timezone, currency, language, created_at, updated_at) ON TABLE public.shops TO authenticated;
GRANT UPDATE (name, slug, description, address, phone, email, status, website, logo, qr_code_url, timezone, currency, language, updated_at) ON TABLE public.shops TO authenticated;

-- Row-level privileges for shop_activity_log
CREATE POLICY "Shop managers can view their shop activities"
    ON public.shop_activity_log FOR SELECT
    USING (public.is_shop_manager(shop_id));

-- Row-level policy for shop_opening_hours for select
CREATE POLICY "Everyone can view shop opening hours"
    ON public.shop_opening_hours FOR SELECT
    USING (true);

-- Row-level policy for shop_opening_hours for update
CREATE POLICY "Shop managers can update their shop opening hours"
    ON public.shop_opening_hours FOR UPDATE
    USING (public.is_shop_manager(shop_id));

-- Row-level policy for shop_opening_hours for delete
CREATE POLICY "Shop managers can delete their shop opening hours"
    ON public.shop_opening_hours FOR DELETE
    USING (public.is_shop_manager(shop_id));

-- Row-level policy for shop_opening_hours for insert
CREATE POLICY "Shop managers can insert their shop opening hours"
    ON public.shop_opening_hours FOR INSERT
    WITH CHECK (public.is_shop_manager(shop_id));

-- Row-level policy for category_shops for select
CREATE POLICY "Everyone can view category shops"
    ON public.category_shops FOR SELECT
    USING (true);

-- Row-level policy for category_shops for update
CREATE POLICY "Shop managers can update their category shops"
    ON public.category_shops FOR UPDATE
    USING (public.is_shop_manager(shop_id));

-- Row-level policy for category_shops for delete
CREATE POLICY "Shop managers can delete their category shops"
    ON public.category_shops FOR DELETE
    USING (public.is_shop_manager(shop_id));

-- Row-level policy for category_shops for insert
CREATE POLICY "Shop managers can insert their category shops"
    ON public.category_shops FOR INSERT
    WITH CHECK (public.is_shop_manager(shop_id));

-- Only Owner can update shop status
CREATE OR REPLACE FUNCTION public.owner_update_shop_status(
  p_shop_id UUID,
  p_new_status shop_status
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_shop_owner(p_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: owner role required';
  END IF;

  UPDATE public.shops
  SET status = p_new_status,
      updated_at = NOW()
  WHERE id = p_shop_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'shop_not_found: %', p_shop_id;
  END IF;
END;
$$;

-- Clean up old activities (optional maintenance function)
CREATE OR REPLACE FUNCTION public.cleanup_old_activities(
    p_days_to_keep INTEGER DEFAULT 90
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM shop_activity_log 
    WHERE created_at < NOW() - INTERVAL '1 day' * p_days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- =============================================================================
-- CUSTOMERS TABLE RLS POLICIES
-- =============================================================================

-- Customers can be viewed by everyone (for queue system)
CREATE POLICY "Everyone can view customers"
  ON public.customers FOR SELECT
  USING (true);

-- Only shop managers can update/delete customers directly
CREATE POLICY "Shop managers can update customers"
  ON public.customers FOR UPDATE
  USING (public.is_shop_manager(shop_id))
  WITH CHECK (public.is_shop_manager(shop_id));

CREATE POLICY "Shop managers can delete customers"
  ON public.customers FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- Remove direct INSERT access - customers are created through queue API functions
REVOKE INSERT ON TABLE public.customers FROM anon;
REVOKE INSERT ON TABLE public.customers FROM authenticated;

-- =============================================================================
-- SECURE API FUNCTIONS FOR CUSTOMER OPERATIONS
-- =============================================================================

-- Function to register customer with phone verification
CREATE OR REPLACE FUNCTION public.register_customer_with_phone(
  p_shop_id UUID,
  p_name TEXT,
  p_phone TEXT,
  p_email TEXT DEFAULT NULL,
  p_verification_code TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
BEGIN
  -- Validate shop exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.shops 
    WHERE id = p_shop_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'shop_not_found_or_inactive: %', p_shop_id;
  END IF;

  -- Validate required fields
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'customer_name_required';
  END IF;

  IF p_phone IS NULL OR LENGTH(TRIM(p_phone)) = 0 THEN
    RAISE EXCEPTION 'customer_phone_required';
  END IF;

  -- TODO: Add phone verification logic here
  -- For now, we'll create the customer directly
  -- In production, you would verify p_verification_code against sent OTP

  -- Check if customer already exists
  SELECT id INTO v_customer_id
  FROM public.customers
  WHERE shop_id = p_shop_id 
    AND phone = TRIM(p_phone)
  LIMIT 1;

  IF v_customer_id IS NOT NULL THEN
    -- Update existing customer
    UPDATE public.customers
    SET name = TRIM(p_name),
        email = p_email,
        last_visit = NOW(),
        updated_at = NOW()
    WHERE id = v_customer_id;
  ELSE
    -- Create new customer
    INSERT INTO public.customers (shop_id, name, phone, email, is_active, created_at, updated_at)
    VALUES (p_shop_id, TRIM(p_name), TRIM(p_phone), p_email, true, NOW(), NOW())
    RETURNING id INTO v_customer_id;
  END IF;

  RETURN v_customer_id;
END;
$$;

-- Function to link customer to authenticated profile
CREATE OR REPLACE FUNCTION public.link_customer_to_profile(
  p_customer_id UUID,
  p_phone TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_id UUID;
  v_customer_phone TEXT;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'authentication_required';
  END IF;

  -- Get current user's profile
  SELECT id INTO v_profile_id
  FROM public.profiles
  WHERE auth_id = auth.uid() AND is_active = true;

  IF v_profile_id IS NULL THEN
    RAISE EXCEPTION 'profile_not_found';
  END IF;

  -- Verify customer exists and phone matches
  SELECT phone INTO v_customer_phone
  FROM public.customers
  WHERE id = p_customer_id;

  IF v_customer_phone IS NULL THEN
    RAISE EXCEPTION 'customer_not_found: %', p_customer_id;
  END IF;

  IF v_customer_phone != p_phone THEN
    RAISE EXCEPTION 'phone_mismatch';
  END IF;

  -- Link customer to profile
  UPDATE public.customers
  SET profile_id = v_profile_id, updated_at = NOW()
  WHERE id = p_customer_id;
END;
$$;

-- =============================================================================
-- QUEUES TABLE RLS POLICIES
-- =============================================================================

-- Only shop employees, shop managers and shop owners can view queues
CREATE POLICY "Shop employees, managers and owners can view queues"
  ON public.queues FOR SELECT
  USING (public.is_shop_employee(shop_id) OR public.is_shop_manager(shop_id) OR public.is_shop_owner(shop_id));

-- Only shop managers can update/delete queues directly
CREATE POLICY "Shop managers can update queues"
  ON public.queues FOR UPDATE
  USING (public.is_shop_manager(shop_id))
  WITH CHECK (public.is_shop_manager(shop_id));

CREATE POLICY "Shop managers can delete queues"
  ON public.queues FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- Remove direct INSERT access - queues are created through queue API functions
REVOKE INSERT ON TABLE public.queues FROM anon;
REVOKE INSERT ON TABLE public.queues FROM authenticated;

-- =============================================================================
-- SECURE API FUNCTIONS FOR QUEUE OPERATIONS
-- =============================================================================
-- Function to create a new queue (for customers)
CREATE OR REPLACE FUNCTION public.create_queue(
  p_shop_id UUID,
  p_customer_name TEXT,
  p_customer_phone TEXT DEFAULT NULL,
  p_customer_email TEXT DEFAULT NULL,
  p_customer_id UUID DEFAULT NULL,
  p_services JSONB DEFAULT '[]',
  p_note TEXT DEFAULT NULL,
  p_priority queue_priority DEFAULT 'normal'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_queue_id UUID;
  v_queue_number TEXT;
  v_service_item JSONB;
  v_service_id UUID;
  v_service_quantity INTEGER;
  v_service_price DECIMAL(10,2);
  v_service_duration INTEGER;
  v_total_duration INTEGER := 0;
BEGIN
  -- Validate shop exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.shops 
    WHERE id = p_shop_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'shop_not_found_or_inactive: %', p_shop_id;
  END IF;

  -- Validate required fields
  IF p_customer_name IS NULL OR LENGTH(TRIM(p_customer_name)) = 0 THEN
    RAISE EXCEPTION 'customer_name_required';
  END IF;

  -- Validate services parameter structure
  IF p_services IS NOT NULL AND jsonb_typeof(p_services) != 'array' THEN
    RAISE EXCEPTION 'services_must_be_array';
  END IF;

  -- Create or find customer
  IF p_customer_id IS NOT NULL THEN
    -- Use provided customer_id and validate it exists
    SELECT id INTO v_customer_id
    FROM public.customers
    WHERE id = p_customer_id AND shop_id = p_shop_id AND is_active = true;
    
    IF v_customer_id IS NULL THEN
      RAISE EXCEPTION 'customer_not_found_or_inactive: %', p_customer_id;
    END IF;
  ELSE
    -- Find existing customer by name/phone or create new one
    SELECT id INTO v_customer_id
    FROM public.customers
    WHERE shop_id = p_shop_id 
      AND name = TRIM(p_customer_name)
      AND (p_customer_phone IS NULL OR phone = p_customer_phone)
    LIMIT 1;

    IF v_customer_id IS NULL THEN
      INSERT INTO public.customers (shop_id, name, phone, email, is_active)
      VALUES (p_shop_id, TRIM(p_customer_name), p_customer_phone, p_customer_email, true)
      RETURNING id INTO v_customer_id;
    END IF;
  END IF;

  -- Generate queue number
  SELECT COALESCE(MAX(CAST(SUBSTRING(queue_number FROM '[0-9]+') AS INTEGER)), 0) + 1
  INTO v_queue_number
  FROM public.queues
  WHERE shop_id = p_shop_id 
    AND DATE(created_at) = CURRENT_DATE;
  
  v_queue_number := LPAD(v_queue_number::TEXT, 3, '0');

  -- Calculate total estimated duration from services
  IF p_services IS NOT NULL AND jsonb_array_length(p_services) > 0 THEN
    FOR v_service_item IN SELECT * FROM jsonb_array_elements(p_services)
    LOOP
      -- Validate required fields in service object
      IF NOT (v_service_item ? 'service_id') THEN
        RAISE EXCEPTION 'service_id_required_in_services_array';
      END IF;

      v_service_id := (v_service_item->>'service_id')::UUID;
      v_service_quantity := COALESCE((v_service_item->>'quantity')::INTEGER, 1);
      
      -- Get service duration
      SELECT estimated_duration INTO v_service_duration
      FROM public.services
      WHERE id = v_service_id AND shop_id = p_shop_id AND is_available = true;
      
      IF v_service_duration IS NOT NULL THEN
        v_total_duration := v_total_duration + (v_service_duration * v_service_quantity);
      END IF;
    END LOOP;
  END IF;

  -- Set default duration if no services or total is 0
  IF v_total_duration = 0 THEN
    v_total_duration := 15;
  END IF;

  -- Create queue
  INSERT INTO public.queues (
    shop_id, customer_id, queue_number, status, priority,
    estimated_duration, note, created_at, updated_at
  ) VALUES (
    p_shop_id, v_customer_id, v_queue_number, 'waiting', p_priority,
    v_total_duration, p_note, NOW(), NOW()
  ) RETURNING id INTO v_queue_id;

  -- Add services to queue
  IF p_services IS NOT NULL AND jsonb_array_length(p_services) > 0 THEN
    FOR v_service_item IN SELECT * FROM jsonb_array_elements(p_services)
    LOOP
      v_service_id := (v_service_item->>'service_id')::UUID;
      v_service_quantity := COALESCE((v_service_item->>'quantity')::INTEGER, 1);
      
      -- Use provided price or get from database
      IF v_service_item ? 'price' AND (v_service_item->>'price') IS NOT NULL THEN
        v_service_price := (v_service_item->>'price')::DECIMAL(10,2);
      ELSE
        SELECT price INTO v_service_price
        FROM public.services
        WHERE id = v_service_id AND shop_id = p_shop_id AND is_available = true;
      END IF;
      
      -- Validate service exists and is available
      IF NOT EXISTS (
        SELECT 1 FROM public.services
        WHERE id = v_service_id AND shop_id = p_shop_id AND is_available = true
      ) THEN
        RAISE EXCEPTION 'service_not_found_or_unavailable: %', v_service_id;
      END IF;
      
      -- Insert queue service
      IF v_service_price IS NOT NULL THEN
        INSERT INTO public.queue_services (queue_id, service_id, quantity, price)
        VALUES (v_queue_id, v_service_id, v_service_quantity, v_service_price);
      END IF;
    END LOOP;
  END IF;

  RETURN v_queue_id;
END;
$$;

-- Function to update queue status (for shop managers)
CREATE OR REPLACE FUNCTION public.update_queue_status(
  p_queue_id UUID,
  p_status queue_status,
  p_served_by_employee_id UUID DEFAULT NULL,
  p_note TEXT DEFAULT NULL,
  p_cancelled_reason TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_current_status queue_status;
BEGIN
  -- Get queue info and validate access
  SELECT shop_id, status INTO v_shop_id, v_current_status
  FROM public.queues
  WHERE id = p_queue_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'queue_not_found: %', p_queue_id;
  END IF;

  -- Check if user is shop manager
  IF NOT public.is_shop_manager(v_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Update queue based on status
  CASE p_status
    WHEN 'confirmed' THEN
      UPDATE public.queues
      SET status = p_status, updated_at = NOW()
      WHERE id = p_queue_id AND status = 'waiting';
      
    WHEN 'serving' THEN
      UPDATE public.queues
      SET status = p_status, served_by_employee_id = p_served_by_employee_id,
          served_at = NOW(), updated_at = NOW()
      WHERE id = p_queue_id AND status IN ('waiting', 'confirmed');
      
    WHEN 'completed' THEN
      UPDATE public.queues
      SET status = p_status, completed_at = NOW(), updated_at = NOW()
      WHERE id = p_queue_id AND status = 'serving';
      
    WHEN 'cancelled' THEN
      UPDATE public.queues
      SET status = p_status, cancelled_at = NOW(), cancelled_reason = p_cancelled_reason,
          cancelled_note = p_note, updated_at = NOW()
      WHERE id = p_queue_id AND status IN ('waiting', 'confirmed', 'serving');
      
    ELSE
      RAISE EXCEPTION 'invalid_status_transition: % to %', v_current_status, p_status;
  END CASE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid_status_transition: % to %', v_current_status, p_status;
  END IF;
END;
$$;

-- Function to add feedback and rating (for customers) with enhanced security
CREATE OR REPLACE FUNCTION public.add_queue_feedback(
  p_queue_id UUID,
  p_customer_id UUID,  -- Added for customer validation
  p_feedback TEXT,
  p_rating INTEGER DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_status queue_status;
  v_completed_at TIMESTAMP WITH TIME ZONE;
  v_feedback_deadline TIMESTAMP WITH TIME ZONE;
  feedback_window_days INTEGER := 30; -- Configurable feedback window
BEGIN
  -- Validate rating
  IF p_rating IS NOT NULL AND (p_rating < 1 OR p_rating > 5) THEN
    RAISE EXCEPTION 'invalid_rating: must be between 1 and 5';
  END IF;

  -- Get queue info
  SELECT customer_id, status, updated_at INTO v_customer_id, v_status, v_completed_at
  FROM public.queues
  WHERE id = p_queue_id;

  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'queue_not_found: %', p_queue_id;
  END IF;

  -- Validate customer ownership
  IF v_customer_id != p_customer_id THEN
    RAISE EXCEPTION 'unauthorized: customer does not own this queue';
  END IF;

  -- Only allow feedback for completed queues
  IF v_status != 'completed' THEN
    RAISE EXCEPTION 'feedback_not_allowed: queue must be completed';
  END IF;

  -- Calculate feedback deadline
  v_feedback_deadline := v_completed_at + INTERVAL '1 day' * feedback_window_days;

  -- Check if feedback period has expired
  IF NOW() > v_feedback_deadline THEN
    RAISE EXCEPTION 'feedback_expired: feedback period has expired. Deadline was %', 
      v_feedback_deadline::DATE;
  END IF;

  -- Validate feedback content (optional sanitization)
  IF p_feedback IS NOT NULL AND LENGTH(TRIM(p_feedback)) = 0 THEN
    RAISE EXCEPTION 'invalid_feedback: feedback cannot be empty';
  END IF;

  IF p_feedback IS NOT NULL AND LENGTH(p_feedback) > 1000 THEN
    RAISE EXCEPTION 'invalid_feedback: feedback too long (max 1000 characters)';
  END IF;

  -- Update feedback
  UPDATE public.queues
  SET 
    feedback = p_feedback, 
    rating = p_rating, 
    updated_at = NOW()
  WHERE id = p_queue_id;

  -- Log successful feedback (optional for audit trail)
  INSERT INTO public.audit_logs (
    table_name, 
    record_id, 
    action, 
    customer_id, 
    created_at
  ) VALUES (
    'queues', 
    p_queue_id, 
    'feedback_added', 
    p_customer_id, 
    NOW()
  ) ON CONFLICT DO NOTHING; -- Ignore if audit_logs table doesn't exist

EXCEPTION
  WHEN others THEN
    -- Re-raise the exception to maintain error handling
    RAISE;
END;
$$;

-- Function to get queue position and estimated wait time
CREATE OR REPLACE FUNCTION public.get_queue_position(
  p_queue_id UUID
) RETURNS TABLE(
  queue_position INTEGER,
  estimated_wait_minutes INTEGER,
  ahead_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_created_at TIMESTAMP WITH TIME ZONE;
  v_status queue_status;
BEGIN
  -- Get queue info
  SELECT shop_id, created_at, status 
  INTO v_shop_id, v_created_at, v_status
  FROM public.queues
  WHERE id = p_queue_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'queue_not_found: %', p_queue_id;
  END IF;

  -- If queue is not waiting, return special values
  IF v_status != 'waiting' THEN
    RETURN QUERY SELECT 0, 0, 0;
    RETURN;
  END IF;

  -- Calculate position and wait time
  RETURN QUERY
  WITH queue_stats AS (
    SELECT 
      ROW_NUMBER() OVER (ORDER BY created_at) as pos,
      id,
      estimated_duration
    FROM public.queues
    WHERE shop_id = v_shop_id 
      AND status = 'waiting'
      AND created_at <= v_created_at
  ),
  current_queue AS (
    SELECT pos, estimated_duration
    FROM queue_stats
    WHERE id = p_queue_id
  ),
  ahead_queues AS (
    SELECT COALESCE(SUM(estimated_duration), 0) as total_wait
    FROM queue_stats qs, current_queue cq
    WHERE qs.pos < cq.pos
  )
  SELECT 
    cq.pos::INTEGER,
    aq.total_wait::INTEGER,
    (cq.pos - 1)::INTEGER
  FROM current_queue cq, ahead_queues aq;
END;
$$;


-- =============================================================================
-- QUEUE SERVICES TABLE RLS POLICIES
-- =============================================================================

-- Everyone can view queue services
CREATE POLICY "Everyone can view queue services"
  ON public.queue_services FOR SELECT
  USING (true);

-- Only shop employees, managers and owners can insert queue services
CREATE POLICY "Only shop employees, managers and owners can insert queue services"
  ON public.queue_services FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.queues q 
    WHERE q.id = queue_id AND (public.is_shop_manager(q.shop_id) OR public.is_shop_owner(q.shop_id))
  ));

-- Only shop employees, managers and owners can update queue services
CREATE POLICY "Only shop employees, managers and owners can update queue services"
  ON public.queue_services FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.queues q 
    WHERE q.id = queue_id AND (public.is_shop_manager(q.shop_id) OR public.is_shop_owner(q.shop_id))
  ));

-- Only shop employees, managers and owners can delete queue services
CREATE POLICY "Only shop employees, managers and owners can delete queue services"
  ON public.queue_services FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.queues q 
    WHERE q.id = queue_id AND (public.is_shop_manager(q.shop_id) OR public.is_shop_owner(q.shop_id))
  ));


-- =============================================================================
-- SERVICES TABLE RLS POLICIES
-- =============================================================================

-- Everyone can view services (for public service listing)
CREATE POLICY "Everyone can view services"
  ON public.services FOR SELECT
  USING (true);

-- Only shop managers can create, update, or delete services
CREATE POLICY "Only shop managers can create services"
  ON public.services FOR INSERT
  WITH CHECK (public.is_shop_manager(shop_id));

-- Only shop managers can update services
CREATE POLICY "Only shop managers can update services"
  ON public.services FOR UPDATE
  USING (public.is_shop_manager(shop_id));

-- Only shop managers can delete services (emergency cleanup)
CREATE POLICY "Shop managers can delete services"
  ON public.services FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- SECURE API FUNCTIONS FOR SERVICES
-- =============================================================================

-- Function to create service
CREATE OR REPLACE FUNCTION public.create_service(
  p_shop_id UUID,
  p_name TEXT,
  p_slug TEXT,
  p_price DECIMAL(10,2),
  p_description TEXT DEFAULT NULL,
  p_estimated_duration INTEGER DEFAULT 15,
  p_category TEXT DEFAULT NULL,
  p_icon TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_service_id UUID;
BEGIN
  -- Check if user is shop manager
  IF NOT public.is_shop_manager(p_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Validate required fields
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'service_name_required';
  END IF;

  IF p_slug IS NULL OR LENGTH(TRIM(p_slug)) = 0 THEN
    RAISE EXCEPTION 'service_slug_required';
  END IF;

  IF p_price IS NULL OR p_price < 0 THEN
    RAISE EXCEPTION 'invalid_price: must be >= 0';
  END IF;

  IF p_estimated_duration IS NULL OR p_estimated_duration <= 0 THEN
    RAISE EXCEPTION 'invalid_duration: must be > 0';
  END IF;

  -- Check slug uniqueness within shop
  IF EXISTS (
    SELECT 1 FROM public.services 
    WHERE shop_id = p_shop_id AND slug = TRIM(p_slug)
  ) THEN
    RAISE EXCEPTION 'slug_already_exists: %', TRIM(p_slug);
  END IF;

  -- Create service
  INSERT INTO public.services (
    shop_id, name, slug, description, price, estimated_duration,
    category, icon, is_available, popularity_rank, created_at, updated_at
  ) VALUES (
    p_shop_id, TRIM(p_name), TRIM(p_slug), p_description, p_price, p_estimated_duration,
    p_category, p_icon, true, 0, NOW(), NOW()
  ) RETURNING id INTO v_service_id;

  RETURN v_service_id;
END;
$$;

-- Function to update service
CREATE OR REPLACE FUNCTION public.update_service(
  p_service_id UUID,
  p_name TEXT DEFAULT NULL,
  p_slug TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_price DECIMAL(10,2) DEFAULT NULL,
  p_estimated_duration INTEGER DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_icon TEXT DEFAULT NULL,
  p_is_available BOOLEAN DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_current_slug TEXT;
BEGIN
  -- Get service info and validate access
  SELECT shop_id, slug INTO v_shop_id, v_current_slug
  FROM public.services
  WHERE id = p_service_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'service_not_found: %', p_service_id;
  END IF;

  -- Check if user is shop manager
  IF NOT public.is_shop_manager(v_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Validate inputs if provided
  IF p_price IS NOT NULL AND p_price < 0 THEN
    RAISE EXCEPTION 'invalid_price: must be >= 0';
  END IF;

  IF p_estimated_duration IS NOT NULL AND p_estimated_duration <= 0 THEN
    RAISE EXCEPTION 'invalid_duration: must be > 0';
  END IF;

  -- Check slug uniqueness if changing
  IF p_slug IS NOT NULL AND TRIM(p_slug) != v_current_slug THEN
    IF EXISTS (
      SELECT 1 FROM public.services 
      WHERE shop_id = v_shop_id AND slug = TRIM(p_slug) AND id != p_service_id
    ) THEN
      RAISE EXCEPTION 'slug_already_exists: %', TRIM(p_slug);
    END IF;
  END IF;

  -- Update service
  UPDATE public.services
  SET 
    name = COALESCE(TRIM(p_name), name),
    slug = COALESCE(TRIM(p_slug), slug),
    description = COALESCE(p_description, description),
    price = COALESCE(p_price, price),
    estimated_duration = COALESCE(p_estimated_duration, estimated_duration),
    category = COALESCE(p_category, category),
    icon = COALESCE(p_icon, icon),
    is_available = COALESCE(p_is_available, is_available),
    updated_at = NOW()
  WHERE id = p_service_id;
END;
$$;

-- =============================================================================
-- DEPARTMENTS TABLE RLS POLICIES
-- =============================================================================

-- Everyone can view departments
CREATE POLICY "Everyone can view departments"
  ON public.departments FOR SELECT
  USING (true);

-- Remove direct INSERT/UPDATE access - use API functions
REVOKE INSERT, UPDATE ON TABLE public.departments FROM authenticated;
REVOKE INSERT, UPDATE ON TABLE public.departments FROM anon;

-- Only shop managers can delete departments (emergency cleanup)
CREATE POLICY "Shop managers can delete departments"
  ON public.departments FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- SECURE API FUNCTIONS FOR DEPARTMENTS
-- =============================================================================

-- Function to create department
CREATE OR REPLACE FUNCTION public.create_department(
  p_shop_id UUID,
  p_name TEXT,
  p_slug TEXT,
  p_description TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_department_id UUID;
BEGIN
  -- Check if user is shop manager
  IF NOT public.is_shop_manager(p_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Validate required fields
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'department_name_required';
  END IF;

  IF p_slug IS NULL OR LENGTH(TRIM(p_slug)) = 0 THEN
    RAISE EXCEPTION 'department_slug_required';
  END IF;

  -- Check slug uniqueness within shop
  IF EXISTS (
    SELECT 1 FROM public.departments 
    WHERE shop_id = p_shop_id AND slug = TRIM(p_slug)
  ) THEN
    RAISE EXCEPTION 'slug_already_exists: %', TRIM(p_slug);
  END IF;

  -- Create department
  INSERT INTO public.departments (
    shop_id, name, slug, description, created_at, updated_at
  ) VALUES (
    p_shop_id, TRIM(p_name), TRIM(p_slug), p_description, NOW(), NOW()
  ) RETURNING id INTO v_department_id;

  RETURN v_department_id;
END;
$$;

-- Function to update department
CREATE OR REPLACE FUNCTION public.update_department(
  p_department_id UUID,
  p_name TEXT DEFAULT NULL,
  p_slug TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_current_slug TEXT;
BEGIN
  -- Get department info and validate access
  SELECT shop_id, slug INTO v_shop_id, v_current_slug
  FROM public.departments
  WHERE id = p_department_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'department_not_found: %', p_department_id;
  END IF;

  -- Check if user is shop manager
  IF NOT public.is_shop_manager(v_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Check slug uniqueness if changing
  IF p_slug IS NOT NULL AND TRIM(p_slug) != v_current_slug THEN
    IF EXISTS (
      SELECT 1 FROM public.departments 
      WHERE shop_id = v_shop_id AND slug = TRIM(p_slug) AND id != p_department_id
    ) THEN
      RAISE EXCEPTION 'slug_already_exists: %', TRIM(p_slug);
    END IF;
  END IF;

  -- Update department
  UPDATE public.departments
  SET 
    name = COALESCE(TRIM(p_name), name),
    slug = COALESCE(TRIM(p_slug), slug),
    description = COALESCE(p_description, description),
    updated_at = NOW()
  WHERE id = p_department_id;
END;
$$;

-- =============================================================================
-- EMPLOYEES TABLE RLS POLICIES
-- =============================================================================

-- Shop managers can view their employees
CREATE POLICY "Shop managers can view employees"
  ON public.employees FOR SELECT
  USING (public.is_shop_manager(shop_id));

-- Remove direct INSERT/UPDATE access - use API functions for sensitive data
REVOKE INSERT, UPDATE ON TABLE public.employees FROM authenticated;
REVOKE INSERT, UPDATE ON TABLE public.employees FROM anon;

-- Only shop managers can delete employees (emergency cleanup)
CREATE POLICY "Shop managers can delete employees"
  ON public.employees FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- SECURE API FUNCTIONS FOR EMPLOYEES
-- =============================================================================

-- Function to create employee (sensitive operation)
CREATE OR REPLACE FUNCTION public.create_employee(
  p_shop_id UUID,
  p_profile_id UUID,
  p_employee_code TEXT,
  p_name TEXT,
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_position_text TEXT DEFAULT NULL,
  p_department_id UUID DEFAULT NULL,
  p_salary DECIMAL(10,2) DEFAULT NULL,
  p_hire_date DATE DEFAULT NULL,
  p_station_number INTEGER DEFAULT NULL,
  p_permissions TEXT[] DEFAULT '{}',
  p_notes TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_employee_id UUID;
BEGIN
  -- Check if user is shop owner (more restrictive for employee management)
  IF NOT public.is_shop_owner(p_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop owner role required';
  END IF;

  -- Validate required fields
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'employee_name_required';
  END IF;

  IF p_employee_code IS NULL OR LENGTH(TRIM(p_employee_code)) = 0 THEN
    RAISE EXCEPTION 'employee_code_required';
  END IF;

  -- Validate profile exists and is not already an employee
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = p_profile_id AND is_active = true
  ) THEN
    RAISE EXCEPTION 'profile_not_found: %', p_profile_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.employees 
    WHERE profile_id = p_profile_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'profile_already_employee: %', p_profile_id;
  END IF;

  -- Check employee code uniqueness within shop
  IF EXISTS (
    SELECT 1 FROM public.employees 
    WHERE shop_id = p_shop_id AND employee_code = TRIM(p_employee_code)
  ) THEN
    RAISE EXCEPTION 'employee_code_already_exists: %', TRIM(p_employee_code);
  END IF;

  -- Validate department if provided
  IF p_department_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.departments 
      WHERE id = p_department_id AND shop_id = p_shop_id
    ) THEN
      RAISE EXCEPTION 'department_not_found: %', p_department_id;
    END IF;
  END IF;

  -- Validate salary
  IF p_salary IS NOT NULL AND p_salary < 0 THEN
    RAISE EXCEPTION 'invalid_salary: must be >= 0';
  END IF;

  -- Create employee
  INSERT INTO public.employees (
    shop_id, profile_id, employee_code, name, email, phone,
    position_text, department_id, salary, hire_date, status,
    station_number, is_on_duty, permissions, notes, created_at, updated_at
  ) VALUES (
    p_shop_id, p_profile_id, TRIM(p_employee_code), TRIM(p_name), p_email, p_phone,
    p_position_text, p_department_id, p_salary, COALESCE(p_hire_date, CURRENT_DATE), 'active',
    p_station_number, false, COALESCE(p_permissions, '{}'), p_notes, NOW(), NOW()
  ) RETURNING id INTO v_employee_id;

  RETURN v_employee_id;
END;
$$;

-- Function to update employee (sensitive operation)
CREATE OR REPLACE FUNCTION public.update_employee(
  p_employee_id UUID,
  p_name TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_position_text TEXT DEFAULT NULL,
  p_department_id UUID DEFAULT NULL,
  p_salary DECIMAL(10,2) DEFAULT NULL,
  p_station_number INTEGER DEFAULT NULL,
  p_status employee_status DEFAULT NULL,
  p_permissions TEXT[] DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
BEGIN
  -- Get employee info and validate access
  SELECT shop_id INTO v_shop_id
  FROM public.employees
  WHERE id = p_employee_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'employee_not_found: %', p_employee_id;
  END IF;

  -- Check if user is shop owner
  IF NOT public.is_shop_owner(v_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop owner role required';
  END IF;

  -- Validate department if provided
  IF p_department_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.departments 
      WHERE id = p_department_id AND shop_id = v_shop_id
    ) THEN
      RAISE EXCEPTION 'department_not_found: %', p_department_id;
    END IF;
  END IF;

  -- Validate salary
  IF p_salary IS NOT NULL AND p_salary < 0 THEN
    RAISE EXCEPTION 'invalid_salary: must be >= 0';
  END IF;

  -- Update employee
  UPDATE public.employees
  SET 
    name = COALESCE(TRIM(p_name), name),
    email = COALESCE(p_email, email),
    phone = COALESCE(p_phone, phone),
    position_text = COALESCE(p_position_text, position_text),
    department_id = COALESCE(p_department_id, department_id),
    salary = COALESCE(p_salary, salary),
    station_number = COALESCE(p_station_number, station_number),
    status = COALESCE(p_status, status),
    permissions = COALESCE(p_permissions, permissions),
    notes = COALESCE(p_notes, notes),
    updated_at = NOW()
  WHERE id = p_employee_id;
END;
$$;

-- Function to update employee duty status (less sensitive)
CREATE OR REPLACE FUNCTION public.update_employee_duty(
  p_employee_id UUID,
  p_is_on_duty BOOLEAN
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
BEGIN
  -- Get employee info and validate access
  SELECT shop_id INTO v_shop_id
  FROM public.employees
  WHERE id = p_employee_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'employee_not_found: %', p_employee_id;
  END IF;

  -- Check if user is shop manager (less restrictive for duty status)
  IF NOT public.is_shop_manager(v_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Update duty status and login time
  UPDATE public.employees
  SET 
    is_on_duty = p_is_on_duty,
    last_login = CASE WHEN p_is_on_duty THEN NOW() ELSE last_login END,
    updated_at = NOW()
  WHERE id = p_employee_id;
END;
$$;

-- =============================================================================
-- PAYMENTS TABLE RLS POLICIES
-- =============================================================================

-- Shop managers can view payments
CREATE POLICY "Shop managers can view payments"
  ON public.payments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.queues q 
    WHERE q.id = queue_id AND public.is_shop_manager(q.shop_id)
  ));

-- Remove direct INSERT/UPDATE access - use API functions for financial data
REVOKE INSERT, UPDATE ON TABLE public.payments FROM authenticated;
REVOKE INSERT, UPDATE ON TABLE public.payments FROM anon;

-- Only shop managers can delete payments (emergency cleanup)
CREATE POLICY "Shop managers can delete payments"
  ON public.payments FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.queues q 
    WHERE q.id = queue_id AND public.is_shop_manager(q.shop_id)
  ));

-- =============================================================================
-- SECURE API FUNCTIONS FOR PAYMENTS
-- =============================================================================

-- Function to create payment from queue
CREATE OR REPLACE FUNCTION public.create_payment_from_queue(
  p_queue_id UUID,
  p_processed_by_employee_id UUID DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment_id UUID;
  v_shop_id UUID;
  v_total_amount DECIMAL(10,2) := 0;
  v_service_record RECORD;
BEGIN
  -- Get queue info and validate access
  SELECT shop_id INTO v_shop_id
  FROM public.queues
  WHERE id = p_queue_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'queue_not_found: %', p_queue_id;
  END IF;

  -- Check if user is shop manager
  IF NOT public.is_shop_manager(v_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Validate employee if provided
  IF p_processed_by_employee_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.employees 
      WHERE id = p_processed_by_employee_id AND shop_id = v_shop_id AND status = 'active'
    ) THEN
      RAISE EXCEPTION 'employee_not_found: %', p_processed_by_employee_id;
    END IF;
  END IF;

  -- Check if payment already exists
  IF EXISTS (SELECT 1 FROM public.payments WHERE queue_id = p_queue_id) THEN
    RAISE EXCEPTION 'payment_already_exists: %', p_queue_id;
  END IF;

  -- Calculate total amount from queue services
  SELECT COALESCE(SUM(qs.price * qs.quantity), 0) INTO v_total_amount
  FROM public.queue_services qs
  WHERE qs.queue_id = p_queue_id;

  IF v_total_amount = 0 THEN
    RAISE EXCEPTION 'no_services_found: %', p_queue_id;
  END IF;

  -- Create payment
  INSERT INTO public.payments (
    queue_id, total_amount, paid_amount, payment_status,
    processed_by_employee_id, created_at, updated_at
  ) VALUES (
    p_queue_id, v_total_amount, 0, 'unpaid',
    p_processed_by_employee_id, NOW(), NOW()
  ) RETURNING id INTO v_payment_id;

  -- Create payment items from queue services
  FOR v_service_record IN 
    SELECT qs.service_id, qs.quantity, qs.price, s.name
    FROM public.queue_services qs
    JOIN public.services s ON s.id = qs.service_id
    WHERE qs.queue_id = p_queue_id
  LOOP
    INSERT INTO public.payment_items (
      payment_id, service_id, name, price, quantity, total, created_at
    ) VALUES (
      v_payment_id, v_service_record.service_id, v_service_record.name,
      v_service_record.price, v_service_record.quantity,
      v_service_record.price * v_service_record.quantity, NOW()
    );
  END LOOP;

  RETURN v_payment_id;
END;
$$;

-- Function to process payment
CREATE OR REPLACE FUNCTION public.process_payment(
  p_payment_id UUID,
  p_paid_amount DECIMAL(10,2),
  p_payment_method payment_method,
  p_processed_by_employee_id UUID
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_total_amount DECIMAL(10,2);
  v_current_paid DECIMAL(10,2);
  v_new_status payment_status;
BEGIN
  -- Get payment info and validate access
  SELECT q.shop_id, p.total_amount, p.paid_amount
  INTO v_shop_id, v_total_amount, v_current_paid
  FROM public.payments p
  JOIN public.queues q ON q.id = p.queue_id
  WHERE p.id = p_payment_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'payment_not_found: %', p_payment_id;
  END IF;

  -- Check if user is shop manager
  IF NOT public.is_shop_manager(v_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Validate employee
  IF NOT EXISTS (
    SELECT 1 FROM public.employees 
    WHERE id = p_processed_by_employee_id AND shop_id = v_shop_id AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'employee_not_found: %', p_processed_by_employee_id;
  END IF;

  -- Validate payment amount
  IF p_paid_amount <= 0 THEN
    RAISE EXCEPTION 'invalid_payment_amount: must be > 0';
  END IF;

  -- Calculate new paid amount and status
  v_current_paid := v_current_paid + p_paid_amount;
  
  IF v_current_paid >= v_total_amount THEN
    v_new_status := 'paid';
  ELSE
    v_new_status := 'partial';
  END IF;

  -- Update payment
  UPDATE public.payments
  SET 
    paid_amount = v_current_paid,
    payment_status = v_new_status,
    payment_method = p_payment_method,
    processed_by_employee_id = p_processed_by_employee_id,
    payment_date = NOW(),
    updated_at = NOW()
  WHERE id = p_payment_id;
END;
$$;

-- =============================================================================
-- PAYMENT ITEMS TABLE RLS POLICIES
-- =============================================================================

-- Shop managers can view payment items
CREATE POLICY "Shop managers can view payment items"
  ON public.payment_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    WHERE p.id = payment_id AND public.is_shop_manager(q.shop_id)
  ));

-- Remove direct INSERT/UPDATE access - payment items created through payment API functions
REVOKE INSERT, UPDATE ON TABLE public.payment_items FROM authenticated;
REVOKE INSERT, UPDATE ON TABLE public.payment_items FROM anon;

-- Only shop managers can delete payment items (emergency cleanup)
CREATE POLICY "Shop managers can delete payment items"
  ON public.payment_items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.payments p
    JOIN public.queues q ON q.id = p.queue_id
    WHERE p.id = payment_id AND public.is_shop_manager(q.shop_id)
  ));

-- =============================================================================
-- PROMOTIONS TABLE RLS POLICIES
-- =============================================================================

-- Everyone can view active promotions
CREATE POLICY "Everyone can view promotions"
  ON public.promotions FOR SELECT
  USING (true);

-- Remove direct INSERT/UPDATE access - use API functions
REVOKE INSERT, UPDATE ON TABLE public.promotions FROM authenticated;
REVOKE INSERT, UPDATE ON TABLE public.promotions FROM anon;

-- Only shop managers can delete promotions (emergency cleanup)
CREATE POLICY "Shop managers can delete promotions"
  ON public.promotions FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- SECURE API FUNCTIONS FOR PROMOTIONS
-- =============================================================================

-- Function to create promotion (Fixed parameter ordering)
CREATE OR REPLACE FUNCTION public.create_promotion(
  p_shop_id UUID,
  p_name TEXT,
  p_type promotion_type,
  p_value DECIMAL(10,2),
  p_start_at TIMESTAMP WITH TIME ZONE,
  p_end_at TIMESTAMP WITH TIME ZONE,
  p_description TEXT DEFAULT NULL,
  p_min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  p_max_discount_amount DECIMAL(10,2) DEFAULT NULL,
  p_usage_limit INTEGER DEFAULT NULL,
  p_conditions JSONB DEFAULT '[]',
  p_service_ids UUID[] DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_promotion_id UUID;
  v_service_id UUID;
BEGIN
  -- Check if user is shop manager
  IF NOT public.is_shop_manager(p_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Validate required fields
  IF p_name IS NULL OR LENGTH(TRIM(p_name)) = 0 THEN
    RAISE EXCEPTION 'promotion_name_required';
  END IF;

  IF p_value IS NULL OR p_value <= 0 THEN
    RAISE EXCEPTION 'invalid_promotion_value: must be > 0';
  END IF;

  IF p_start_at IS NULL OR p_end_at IS NULL THEN
    RAISE EXCEPTION 'promotion_dates_required';
  END IF;

  IF p_start_at >= p_end_at THEN
    RAISE EXCEPTION 'invalid_promotion_dates: start must be before end';
  END IF;

  -- Validate amounts
  IF p_min_purchase_amount < 0 THEN
    RAISE EXCEPTION 'invalid_min_purchase: must be >= 0';
  END IF;

  IF p_max_discount_amount IS NOT NULL AND p_max_discount_amount <= 0 THEN
    RAISE EXCEPTION 'invalid_max_discount: must be > 0';
  END IF;

  IF p_usage_limit IS NOT NULL AND p_usage_limit <= 0 THEN
    RAISE EXCEPTION 'invalid_usage_limit: must be > 0';
  END IF;

  -- Check name uniqueness within shop
  IF EXISTS (
    SELECT 1 FROM public.promotions 
    WHERE shop_id = p_shop_id AND name = TRIM(p_name)
  ) THEN
    RAISE EXCEPTION 'promotion_name_already_exists: %', TRIM(p_name);
  END IF;

  -- Create promotion
  INSERT INTO public.promotions (
    shop_id, name, description, type, value, min_purchase_amount,
    max_discount_amount, start_at, end_at, usage_limit, status,
    conditions, created_by, created_at, updated_at
  ) VALUES (
    p_shop_id, TRIM(p_name), p_description, p_type, p_value, p_min_purchase_amount,
    p_max_discount_amount, p_start_at, p_end_at, p_usage_limit, 'active',
    p_conditions, public.get_active_profile_id(), NOW(), NOW()
  ) RETURNING id INTO v_promotion_id;

  -- Link services to promotion
  IF array_length(p_service_ids, 1) > 0 THEN
    FOREACH v_service_id IN ARRAY p_service_ids
    LOOP
      -- Validate service belongs to shop
      IF EXISTS (
        SELECT 1 FROM public.services 
        WHERE id = v_service_id AND shop_id = p_shop_id
      ) THEN
        INSERT INTO public.promotion_services (promotion_id, service_id)
        VALUES (v_promotion_id, v_service_id);
      END IF;
    END LOOP;
  END IF;

  RETURN v_promotion_id;
END;
$$;

-- Function to update promotion
CREATE OR REPLACE FUNCTION public.update_promotion(
  p_promotion_id UUID,
  p_name TEXT DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_value DECIMAL(10,2) DEFAULT NULL,
  p_min_purchase_amount DECIMAL(10,2) DEFAULT NULL,
  p_max_discount_amount DECIMAL(10,2) DEFAULT NULL,
  p_start_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_usage_limit INTEGER DEFAULT NULL,
  p_status promotion_status DEFAULT NULL,
  p_conditions JSONB DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_current_name TEXT;
BEGIN
  -- Get promotion info and validate access
  SELECT shop_id, name INTO v_shop_id, v_current_name
  FROM public.promotions
  WHERE id = p_promotion_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'promotion_not_found: %', p_promotion_id;
  END IF;

  -- Check if user is shop manager
  IF NOT public.is_shop_manager(v_shop_id) THEN
    RAISE EXCEPTION 'insufficient_privilege: shop manager role required';
  END IF;

  -- Validate inputs if provided
  IF p_value IS NOT NULL AND p_value <= 0 THEN
    RAISE EXCEPTION 'invalid_promotion_value: must be > 0';
  END IF;

  IF p_min_purchase_amount IS NOT NULL AND p_min_purchase_amount < 0 THEN
    RAISE EXCEPTION 'invalid_min_purchase: must be >= 0';
  END IF;

  IF p_max_discount_amount IS NOT NULL AND p_max_discount_amount <= 0 THEN
    RAISE EXCEPTION 'invalid_max_discount: must be > 0';
  END IF;

  IF p_usage_limit IS NOT NULL AND p_usage_limit <= 0 THEN
    RAISE EXCEPTION 'invalid_usage_limit: must be > 0';
  END IF;

  -- Check name uniqueness if changing
  IF p_name IS NOT NULL AND TRIM(p_name) != v_current_name THEN
    IF EXISTS (
      SELECT 1 FROM public.promotions 
      WHERE shop_id = v_shop_id AND name = TRIM(p_name) AND id != p_promotion_id
    ) THEN
      RAISE EXCEPTION 'promotion_name_already_exists: %', TRIM(p_name);
    END IF;
  END IF;

  -- Update promotion
  UPDATE public.promotions
  SET 
    name = COALESCE(TRIM(p_name), name),
    description = COALESCE(p_description, description),
    value = COALESCE(p_value, value),
    min_purchase_amount = COALESCE(p_min_purchase_amount, min_purchase_amount),
    max_discount_amount = COALESCE(p_max_discount_amount, max_discount_amount),
    start_at = COALESCE(p_start_at, start_at),
    end_at = COALESCE(p_end_at, end_at),
    usage_limit = COALESCE(p_usage_limit, usage_limit),
    status = COALESCE(p_status, status),
    conditions = COALESCE(p_conditions, conditions),
    updated_at = NOW()
  WHERE id = p_promotion_id;
END;
$$;

-- =============================================================================
-- PROMOTION SERVICES TABLE RLS POLICIES
-- =============================================================================

-- Everyone can view promotion services
CREATE POLICY "Everyone can view promotion services"
  ON public.promotion_services FOR SELECT
  USING (true);

-- Remove direct INSERT/UPDATE access - managed through promotion API functions
REVOKE INSERT, UPDATE ON TABLE public.promotion_services FROM authenticated;
REVOKE INSERT, UPDATE ON TABLE public.promotion_services FROM anon;

-- Shop managers can delete promotion services
CREATE POLICY "Shop managers can delete promotion services"
  ON public.promotion_services FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.promotions p 
    WHERE p.id = promotion_id AND public.is_shop_manager(p.shop_id)
  ));

-- =============================================================================
-- PROMOTION USAGE LOGS TABLE RLS POLICIES
-- =============================================================================

-- Shop managers can view promotion usage logs
CREATE POLICY "Shop managers can view promotion usage logs"
  ON public.promotion_usage_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.promotions p 
    WHERE p.id = promotion_id AND public.is_shop_manager(p.shop_id)
  ));

-- Anyone can insert promotion usage logs (when using promotion)
CREATE POLICY "Anyone can insert promotion usage logs"
  ON public.promotion_usage_logs FOR INSERT
  WITH CHECK (true);

-- Shop managers can update promotion usage logs
CREATE POLICY "Shop managers can update promotion usage logs"
  ON public.promotion_usage_logs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.promotions p 
    WHERE p.id = promotion_id AND public.is_shop_manager(p.shop_id)
  ));

-- Shop managers can delete promotion usage logs
CREATE POLICY "Shop managers can delete promotion usage logs"
  ON public.promotion_usage_logs FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.promotions p 
    WHERE p.id = promotion_id AND public.is_shop_manager(p.shop_id)
  ));

-- =============================================================================
-- POSTER TEMPLATES TABLE RLS POLICIES
-- =============================================================================

-- Everyone can view poster templates
CREATE POLICY "Everyone can view poster templates"
  ON public.poster_templates FOR SELECT
  USING (true);

-- Only admins can manage poster templates
CREATE POLICY "Only admins can insert poster templates"
  ON public.poster_templates FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can update poster templates"
  ON public.poster_templates FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Only admins can delete poster templates"
  ON public.poster_templates FOR DELETE
  USING (is_admin());

-- =============================================================================
-- CUSTOMER POINTS TABLE RLS POLICIES
-- =============================================================================

-- Customers can view their own points, shop managers can view all
CREATE POLICY "Customers and shop managers can view customer points"
  ON public.customer_points FOR SELECT
  USING (
    public.is_shop_manager(shop_id) OR
    EXISTS (
      SELECT 1 FROM public.customers c 
      WHERE c.id = customer_id AND c.profile_id = public.get_active_profile_id()
    )
  );

-- Remove direct INSERT/UPDATE access - use API functions for points management
REVOKE INSERT, UPDATE ON TABLE public.customer_points FROM authenticated;
REVOKE INSERT, UPDATE ON TABLE public.customer_points FROM anon;

-- Shop managers can delete customer points (emergency cleanup)
CREATE POLICY "Shop managers can delete customer points"
  ON public.customer_points FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- SECURE API FUNCTIONS FOR CUSTOMER POINTS
-- =============================================================================

-- Function to initialize customer points
CREATE OR REPLACE FUNCTION public.initialize_customer_points(
  p_customer_id UUID
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_points_id UUID;
BEGIN
  -- Get customer info
  SELECT shop_id INTO v_shop_id
  FROM public.customers
  WHERE id = p_customer_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'customer_not_found: %', p_customer_id;
  END IF;

  -- Check if points already exist
  SELECT id INTO v_points_id
  FROM public.customer_points
  WHERE customer_id = p_customer_id;

  IF v_points_id IS NOT NULL THEN
    RETURN v_points_id;
  END IF;

  -- Create customer points record
  INSERT INTO public.customer_points (
    shop_id, customer_id, current_points, total_earned, total_redeemed,
    membership_tier, tier_benefits, created_at, updated_at
  ) VALUES (
    v_shop_id, p_customer_id, 0, 0, 0,
    'bronze', '{}', NOW(), NOW()
  ) RETURNING id INTO v_points_id;

  RETURN v_points_id;
END;
$$;

-- Function to add points (from queue completion)
CREATE OR REPLACE FUNCTION public.add_customer_points(
  p_customer_id UUID,
  p_points INTEGER,
  p_description TEXT,
  p_queue_id UUID DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_points_id UUID;
  v_new_total INTEGER;
  v_new_tier membership_tier;
BEGIN
  -- Get customer info
  SELECT shop_id INTO v_shop_id
  FROM public.customers
  WHERE id = p_customer_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'customer_not_found: %', p_customer_id;
  END IF;

  -- Validate points
  IF p_points <= 0 THEN
    RAISE EXCEPTION 'invalid_points: must be > 0';
  END IF;

  -- Initialize points if not exists
  SELECT public.initialize_customer_points(p_customer_id) INTO v_points_id;

  -- Update points
  UPDATE public.customer_points
  SET 
    current_points = current_points + p_points,
    total_earned = total_earned + p_points,
    updated_at = NOW()
  WHERE customer_id = p_customer_id
  RETURNING current_points INTO v_new_total;

  -- Determine new tier based on total points
  v_new_tier := CASE 
    WHEN v_new_total >= 10000 THEN 'platinum'
    WHEN v_new_total >= 5000 THEN 'gold'
    WHEN v_new_total >= 1000 THEN 'silver'
    ELSE 'bronze'
  END;

  -- Update tier if changed
  UPDATE public.customer_points
  SET membership_tier = v_new_tier
  WHERE customer_id = p_customer_id AND membership_tier != v_new_tier;

  -- Create transaction record
  INSERT INTO public.customer_point_transactions (
    customer_point_id, type, points, description, related_queue_id,
    transaction_date, created_at
  ) VALUES (
    v_points_id, 'earned', p_points, p_description, p_queue_id,
    NOW(), NOW()
  );
END;
$$;

-- Function to redeem points
CREATE OR REPLACE FUNCTION public.redeem_customer_points(
  p_customer_id UUID,
  p_points INTEGER,
  p_description TEXT,
  p_reward_id UUID DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_shop_id UUID;
  v_points_id UUID;
  v_current_points INTEGER;
BEGIN
  -- Get customer info
  SELECT shop_id INTO v_shop_id
  FROM public.customers
  WHERE id = p_customer_id;

  IF v_shop_id IS NULL THEN
    RAISE EXCEPTION 'customer_not_found: %', p_customer_id;
  END IF;

  -- Validate points
  IF p_points <= 0 THEN
    RAISE EXCEPTION 'invalid_points: must be > 0';
  END IF;

  -- Get current points
  SELECT id, current_points INTO v_points_id, v_current_points
  FROM public.customer_points
  WHERE customer_id = p_customer_id;

  IF v_points_id IS NULL THEN
    RAISE EXCEPTION 'customer_points_not_found: %', p_customer_id;
  END IF;

  -- Check sufficient points
  IF v_current_points < p_points THEN
    RAISE EXCEPTION 'insufficient_points: have %, need %', v_current_points, p_points;
  END IF;

  -- Update points
  UPDATE public.customer_points
  SET 
    current_points = current_points - p_points,
    total_redeemed = total_redeemed + p_points,
    updated_at = NOW()
  WHERE customer_id = p_customer_id;

  -- Create transaction record
  INSERT INTO public.customer_point_transactions (
    customer_point_id, type, points, description,
    transaction_date, created_at
  ) VALUES (
    v_points_id, 'redeemed', p_points, p_description,
    NOW(), NOW()
  );
END;
$$;

-- =============================================================================
-- CUSTOMER POINT TRANSACTIONS TABLE RLS POLICIES
-- =============================================================================

-- Customers can view their own transactions, shop managers can view all
CREATE POLICY "Customers and shop managers can view point transactions"
  ON public.customer_point_transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.customer_points cp
    JOIN public.customers c ON c.id = cp.customer_id
    WHERE cp.id = customer_point_id AND (
      public.is_shop_manager(cp.shop_id) OR
      c.profile_id = public.get_active_profile_id()
    )
  ));

-- Shop managers can insert point transactions
CREATE POLICY "Shop managers can insert point transactions"
  ON public.customer_point_transactions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.customer_points cp
    WHERE cp.id = customer_point_id AND public.is_shop_manager(cp.shop_id)
  ));

-- Shop managers can update point transactions
CREATE POLICY "Shop managers can update point transactions"
  ON public.customer_point_transactions FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.customer_points cp
    WHERE cp.id = customer_point_id AND public.is_shop_manager(cp.shop_id)
  ));

-- Shop managers can delete point transactions
CREATE POLICY "Shop managers can delete point transactions"
  ON public.customer_point_transactions FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.customer_points cp
    WHERE cp.id = customer_point_id AND public.is_shop_manager(cp.shop_id)
  ));

-- =============================================================================
-- CUSTOMER POINT EXPIRY TABLE RLS POLICIES
-- =============================================================================

-- Shop managers can view point expiry
CREATE POLICY "Shop managers can view point expiry"
  ON public.customer_point_expiry FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.customer_point_transactions cpt
    JOIN public.customer_points cp ON cp.id = cpt.customer_point_id
    WHERE cpt.id = customer_point_transaction_id AND public.is_shop_manager(cp.shop_id)
  ));

-- Shop managers can insert point expiry
CREATE POLICY "Shop managers can insert point expiry"
  ON public.customer_point_expiry FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.customer_point_transactions cpt
    JOIN public.customer_points cp ON cp.id = cpt.customer_point_id
    WHERE cpt.id = customer_point_transaction_id AND public.is_shop_manager(cp.shop_id)
  ));

-- Shop managers can update point expiry
CREATE POLICY "Shop managers can update point expiry"
  ON public.customer_point_expiry FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.customer_point_transactions cpt
    JOIN public.customer_points cp ON cp.id = cpt.customer_point_id
    WHERE cpt.id = customer_point_transaction_id AND public.is_shop_manager(cp.shop_id)
  ));

-- Shop managers can delete point expiry
CREATE POLICY "Shop managers can delete point expiry"
  ON public.customer_point_expiry FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.customer_point_transactions cpt
    JOIN public.customer_points cp ON cp.id = cpt.customer_point_id
    WHERE cpt.id = customer_point_transaction_id AND public.is_shop_manager(cp.shop_id)
  ));

-- =============================================================================
-- REWARDS TABLE RLS POLICIES
-- =============================================================================

-- Everyone can view available rewards
CREATE POLICY "Everyone can view rewards"
  ON public.rewards FOR SELECT
  USING (true);

-- Shop managers can insert rewards
CREATE POLICY "Shop managers can insert rewards"
  ON public.rewards FOR INSERT
  WITH CHECK (public.is_shop_manager(shop_id));

-- Shop managers can update rewards
CREATE POLICY "Shop managers can update rewards"
  ON public.rewards FOR UPDATE
  USING (public.is_shop_manager(shop_id))
  WITH CHECK (public.is_shop_manager(shop_id));

-- Shop managers can delete rewards
CREATE POLICY "Shop managers can delete rewards"
  ON public.rewards FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- REWARD USAGES TABLE RLS POLICIES
-- =============================================================================

-- Customers can view their own reward usages, shop managers can view all
CREATE POLICY "Customers and shop managers can view reward usages"
  ON public.reward_usages FOR SELECT
  USING (
    public.is_shop_manager(shop_id) OR
    EXISTS (
      SELECT 1 FROM public.customers c 
      WHERE c.id = customer_id AND c.profile_id = public.get_active_profile_id()
    )
  );

-- Shop managers can insert reward usages
CREATE POLICY "Shop managers can insert reward usages"
  ON public.reward_usages FOR INSERT
  WITH CHECK (public.is_shop_manager(shop_id));

-- Shop managers can update reward usages
CREATE POLICY "Shop managers can update reward usages"
  ON public.reward_usages FOR UPDATE
  USING (public.is_shop_manager(shop_id))
  WITH CHECK (public.is_shop_manager(shop_id));

-- Shop managers can delete reward usages
CREATE POLICY "Shop managers can delete reward usages"
  ON public.reward_usages FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- SHOP SETTINGS TABLE RLS POLICIES
-- =============================================================================

-- Shop managers can view their shop settings
CREATE POLICY "Shop managers can view shop settings"
  ON public.shop_settings FOR SELECT
  USING (public.is_shop_manager(shop_id));

-- Shop managers can insert shop settings
CREATE POLICY "Shop managers can insert shop settings"
  ON public.shop_settings FOR INSERT
  WITH CHECK (public.is_shop_manager(shop_id));

-- Shop managers can update shop settings
CREATE POLICY "Shop managers can update shop settings"
  ON public.shop_settings FOR UPDATE
  USING (public.is_shop_manager(shop_id))
  WITH CHECK (public.is_shop_manager(shop_id));

-- Shop managers can delete shop settings
CREATE POLICY "Shop managers can delete shop settings"
  ON public.shop_settings FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- NOTIFICATION SETTINGS TABLE RLS POLICIES
-- =============================================================================

-- Shop managers can view their notification settings
CREATE POLICY "Shop managers can view notification settings"
  ON public.notification_settings FOR SELECT
  USING (public.is_shop_manager(shop_id));

-- Shop managers can insert notification settings
CREATE POLICY "Shop managers can insert notification settings"
  ON public.notification_settings FOR INSERT
  WITH CHECK (public.is_shop_manager(shop_id));

-- Shop managers can update notification settings
CREATE POLICY "Shop managers can update notification settings"
  ON public.notification_settings FOR UPDATE
  USING (public.is_shop_manager(shop_id))
  WITH CHECK (public.is_shop_manager(shop_id));

-- Shop managers can delete notification settings
CREATE POLICY "Shop managers can delete notification settings"
  ON public.notification_settings FOR DELETE
  USING (public.is_shop_manager(shop_id));

-- =============================================================================
-- SHOP ACTIVITY LOG TABLE RLS POLICIES
-- =============================================================================

-- Shop managers can insert activity logs
CREATE POLICY "Shop managers can insert activity logs"
  ON public.shop_activity_log FOR INSERT
  WITH CHECK (public.is_shop_manager(shop_id));
