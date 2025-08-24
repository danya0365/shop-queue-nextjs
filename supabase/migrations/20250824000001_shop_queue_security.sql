-- Shop Queue System Security Policies
-- Created: 2025-08-24
-- Author: Cascade AI
-- Description: Row Level Security (RLS) policies for Shop Queue System

-- Enable Row Level Security on all shop queue tables
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_local_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_queue_notes_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_promotions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is shop owner
CREATE OR REPLACE FUNCTION public.is_shop_owner(shop_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.shops 
    WHERE id = shop_id_param 
    AND owner_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid() LIMIT 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is shop staff (can be extended)
CREATE OR REPLACE FUNCTION public.is_shop_staff(shop_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- For now, only shop owner is considered staff
  -- Can be extended to include other staff roles
  RETURN public.is_shop_owner(shop_id_param);
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
  WITH CHECK (auth.role() = 'authenticated');

-- Only shop owners can update their shops
CREATE POLICY "Shop owners can update their shops"
  ON public.shops FOR UPDATE
  USING (public.is_shop_owner(id))
  WITH CHECK (public.is_shop_owner(id));

-- Only shop owners can delete their shops
CREATE POLICY "Shop owners can delete their shops"
  ON public.shops FOR DELETE
  USING (public.is_shop_owner(id));

-- Local users policies
-- Shop staff can view local users in their shop
CREATE POLICY "Shop staff can view local users in their shop"
  ON public.shop_local_users FOR SELECT
  USING (public.is_shop_staff(shop_id));

-- Shop staff can create local users in their shop
CREATE POLICY "Shop staff can create local users in their shop"
  ON public.shop_local_users FOR INSERT
  WITH CHECK (public.is_shop_staff(shop_id));

-- Shop staff can update local users in their shop
CREATE POLICY "Shop staff can update local users in their shop"
  ON public.shop_local_users FOR UPDATE
  USING (public.is_shop_staff(shop_id))
  WITH CHECK (public.is_shop_staff(shop_id));

-- Shop staff can delete local users in their shop
CREATE POLICY "Shop staff can delete local users in their shop"
  ON public.shop_local_users FOR DELETE
  USING (public.is_shop_staff(shop_id));

-- Queues policies
-- Shop staff can view all queues in their shop
CREATE POLICY "Shop staff can view all queues in their shop"
  ON public.shop_queues FOR SELECT
  USING (public.is_shop_staff(shop_id));

-- Customers can view their own queues
CREATE POLICY "Users can view their own queues"
  ON public.shop_queues FOR SELECT
  USING (
    local_user_id IN (
      SELECT id FROM public.shop_local_users 
      WHERE profile_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid() LIMIT 1)
    )
  );

-- Shop staff can create queues in their shop
CREATE POLICY "Shop staff can create queues in their shop"
  ON public.shop_queues FOR INSERT
  WITH CHECK (public.is_shop_staff(shop_id));

-- Shop staff can update queues in their shop
CREATE POLICY "Shop staff can update queues in their shop"
  ON public.shop_queues FOR UPDATE
  USING (public.is_shop_staff(shop_id))
  WITH CHECK (public.is_shop_staff(shop_id));

-- Queue notes suggestions policies
-- Anyone can view queue notes suggestions
CREATE POLICY "Queue notes suggestions are viewable by everyone"
  ON public.shop_queue_notes_suggestions FOR SELECT
  USING (true);

-- Only shop staff can manage queue notes suggestions
CREATE POLICY "Only shop staff can manage queue notes suggestions"
  ON public.shop_queue_notes_suggestions FOR ALL
  USING (public.is_shop_staff(shop_id))
  WITH CHECK (public.is_shop_staff(shop_id));

-- Loyalty points policies
-- Users can view their own loyalty points
CREATE POLICY "Users can view their own loyalty points"
  ON public.profile_loyalty_points FOR SELECT
  USING (
    profile_id = (SELECT id FROM public.profiles WHERE auth_id = auth.uid() LIMIT 1)
  );

-- Shop staff can view all loyalty points in their shop
CREATE POLICY "Shop staff can view all loyalty points in their shop"
  ON public.profile_loyalty_points FOR SELECT
  USING (public.is_shop_staff(shop_id));

-- Shop staff can manage loyalty points in their shop
CREATE POLICY "Shop staff can manage loyalty points in their shop"
  ON public.profile_loyalty_points FOR ALL
  USING (public.is_shop_staff(shop_id))
  WITH CHECK (public.is_shop_staff(shop_id));

-- Promotions policies
-- Anyone can view promotions
CREATE POLICY "Promotions are viewable by everyone"
  ON public.shop_promotions FOR SELECT
  USING (true);

-- Only shop staff can manage promotions
CREATE POLICY "Only shop staff can manage promotions"
  ON public.shop_promotions FOR ALL
  USING (public.is_shop_staff(shop_id))
  WITH CHECK (public.is_shop_staff(shop_id));
