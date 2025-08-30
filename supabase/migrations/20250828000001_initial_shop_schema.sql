-- Initial Schema for Shop Queue System
-- Based on presenter data usage patterns

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE shop_status AS ENUM ('draft', 'active', 'inactive', 'suspended');
CREATE TYPE queue_status AS ENUM ('waiting', 'confirmed', 'serving', 'completed', 'cancelled');
CREATE TYPE queue_priority AS ENUM ('normal', 'high', 'vip');
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

-- 1. Shops table
CREATE TABLE shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
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

-- 2. Customers table
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

-- 3. Shop opening hours
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

-- 4. Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
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

-- 5. Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    employee_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    employee_code TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT ,
    position TEXT,
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

-- 7. Queues
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
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 8. Queue Services (Many-to-Many)
CREATE TABLE queue_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_id UUID NOT NULL REFERENCES queues(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Payments
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

-- 10. Payment Items
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

-- 11. Promotions
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type promotion_type NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    applicable_services UUID[], -- Array of service IDs
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    status promotion_status DEFAULT 'active',
    conditions TEXT[],
    created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Poster Templates
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

-- 13. Customer Points
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

-- 14. Customer Point Transactions
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

-- 15. Customer Point Expiry
CREATE TABLE customer_point_expiry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_point_transaction_id UUID NOT NULL REFERENCES customer_point_transactions(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    points INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Rewards
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

-- 17. Reward Transaction
CREATE TABLE reward_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_point_transaction_id UUID NOT NULL REFERENCES customer_point_transactions(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id) ON DELETE SET NULL,
    type transaction_type NOT NULL,
    points INTEGER NOT NULL,
    description TEXT,
    related_queue_id UUID REFERENCES queues(id) ON DELETE SET NULL,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Shop Settings
CREATE TABLE shop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
    max_queue_size INTEGER DEFAULT 50,
    estimated_service_time INTEGER DEFAULT 15, -- minutes
    allow_advance_booking BOOLEAN DEFAULT false,
    booking_window_hours INTEGER DEFAULT 24,
    auto_confirm_queues BOOLEAN DEFAULT true,
    cancellation_deadline INTEGER DEFAULT 30, -- minutes
    maintenance_mode BOOLEAN DEFAULT false,
    allow_registration BOOLEAN DEFAULT true,
    require_email_verification BOOLEAN DEFAULT false,
    session_timeout INTEGER DEFAULT 30, -- minutes
    backup_frequency TEXT DEFAULT 'daily',
    log_level TEXT DEFAULT 'info',
    data_retention_days INTEGER DEFAULT 365,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shop_id)
);

-- 19. Notification Settings
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

-- Create indexes for performance
CREATE INDEX idx_shops_owner_id ON shops(owner_id);
CREATE INDEX idx_shops_status ON shops(status);
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
CREATE INDEX idx_promotions_status ON promotions(status);
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
CREATE INDEX idx_reward_transactions_customer_point_transaction_id ON reward_transactions(customer_point_transaction_id);
CREATE INDEX idx_reward_transactions_reward_id ON reward_transactions(reward_id);
CREATE INDEX idx_reward_transactions_type ON reward_transactions(type);
CREATE INDEX idx_reward_transactions_points ON reward_transactions(points);
CREATE INDEX idx_reward_transactions_transaction_date ON reward_transactions(transaction_date);


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

-- Enable Row Level Security on all shop tables
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.poster_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_point_expiry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

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

-- Shops table policies
-- Anyone can view shops
CREATE POLICY "Shops are viewable by everyone"
  ON public.shops FOR SELECT
  USING (true);

-- Only authenticated users can create shops
CREATE POLICY "Authenticated users can create shops"
  ON public.shops FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated'
    AND owner_id = public.get_active_profile_id()
  );

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
GRANT INSERT (owner_id, name, description, address, qr_code_url, timezone, currency, language, created_at, updated_at) ON TABLE public.shops TO authenticated;
GRANT UPDATE (name, description, address, qr_code_url, timezone, currency, language, updated_at) ON TABLE public.shops TO authenticated;

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
