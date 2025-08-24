-- Shop Queue System Database Schema
-- Created: 2025-08-24
-- Author: Cascade AI
-- Description: Schema for Shop Queue Management System

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE shop_queue_status AS ENUM ('waiting', 'confirmed', 'served', 'canceled');
CREATE TYPE shop_payment_status AS ENUM ('unpaid', 'partial', 'paid');

-- Create shops table
CREATE TABLE IF NOT EXISTS public.shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT,
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shop_local_users table
CREATE TABLE IF NOT EXISTS public.shop_local_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_shop_user UNIQUE (shop_id, id)
);

-- Create shop_queues table
CREATE TABLE IF NOT EXISTS public.shop_queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    local_user_id UUID NOT NULL REFERENCES public.local_users(id) ON DELETE CASCADE,
    queue_number INTEGER NOT NULL,
    status shop_queue_status NOT NULL DEFAULT 'waiting',
    note TEXT,
    payment_status shop_payment_status NOT NULL DEFAULT 'unpaid',
    amount_due DECIMAL(10, 2) NOT NULL DEFAULT 0,
    amount_paid DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shop_queue_notes_suggestions table
CREATE TABLE IF NOT EXISTS public.shop_queue_notes_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    suggestion_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profile_loyalty_points table
CREATE TABLE IF NOT EXISTS public.profile_loyalty_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    points INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(shop_id, profile_id)
);

-- Create shop_promotions table
CREATE TABLE IF NOT EXISTS public.shop_promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    condition TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_local_users_shop_id ON public.local_users(shop_id);
CREATE INDEX IF NOT EXISTS idx_local_users_profile_id ON public.local_users(profile_id);
CREATE INDEX IF NOT EXISTS idx_queues_shop_id ON public.queues(shop_id);
CREATE INDEX IF NOT EXISTS idx_queues_local_user_id ON public.queues(local_user_id);
CREATE INDEX IF NOT EXISTS idx_queues_status ON public.queues(status);
CREATE INDEX IF NOT EXISTS idx_queues_payment_status ON public.queues(payment_status);
CREATE INDEX IF NOT EXISTS idx_queue_notes_suggestions_shop_id ON public.queue_notes_suggestions(shop_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_shop_id ON public.loyalty_points(shop_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_points_profile_id ON public.loyalty_points(profile_id);
CREATE INDEX IF NOT EXISTS idx_promotions_shop_id ON public.promotions(shop_id);
