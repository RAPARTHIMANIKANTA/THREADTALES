-- ============================================================
-- THREADTALES — Complete Production Database Schema
-- Execute this SQL script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql
-- ============================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. PROFILES TABLE
-- Stores user personal details & structured address info
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    door_number TEXT,
    street_name TEXT,
    village_block TEXT,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    pincode TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security & Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public update on profiles" ON public.profiles;
CREATE POLICY "Allow public select on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on profiles" ON public.profiles FOR UPDATE USING (true);

-- ------------------------------------------------------------
-- 2. WISHLISTS TABLE
-- Stores saved wishlist products per unique User ID
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Allow public insert on wishlists" ON public.wishlists;
DROP POLICY IF EXISTS "Allow public delete on wishlists" ON public.wishlists;
CREATE POLICY "Allow public select on wishlists" ON public.wishlists FOR SELECT USING (true);
CREATE POLICY "Allow public insert on wishlists" ON public.wishlists FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on wishlists" ON public.wishlists FOR DELETE USING (true);

-- ------------------------------------------------------------
-- 3. CART_ITEMS TABLE
-- Stores saved shopping cart items per unique User ID
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER DEFAULT 1,
    color TEXT,
    size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on cart_items" ON public.cart_items;
DROP POLICY IF EXISTS "Allow public insert on cart_items" ON public.cart_items;
DROP POLICY IF EXISTS "Allow public update on cart_items" ON public.cart_items;
DROP POLICY IF EXISTS "Allow public delete on cart_items" ON public.cart_items;
CREATE POLICY "Allow public select on cart_items" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on cart_items" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on cart_items" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on cart_items" ON public.cart_items FOR DELETE USING (true);

-- ------------------------------------------------------------
-- 4. ORDERS TABLE
-- Stores order transactions linked to unique User ID
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'Placed', -- 'Placed', 'Handcrafting', 'Shipping', 'Delivered'
    total_amount NUMERIC(10, 2) NOT NULL,
    shipping_address JSONB NOT NULL,
    payment_method TEXT DEFAULT 'Cash on Delivery',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);

-- ------------------------------------------------------------
-- 5. ORDER_ITEMS TABLE
-- Stores individual product items inside an order
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    quantity INTEGER DEFAULT 1,
    price NUMERIC(10, 2) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public insert on order_items" ON public.order_items;
CREATE POLICY "Allow public select on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- ------------------------------------------------------------
-- 6. CONTACT_INQUIRIES TABLE
-- Stores general contact messages submitted on Contact page
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'Responded', 'Closed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on contact_inquiries" ON public.contact_inquiries;
DROP POLICY IF EXISTS "Allow public select on contact_inquiries" ON public.contact_inquiries;
CREATE POLICY "Allow public insert on contact_inquiries" ON public.contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on contact_inquiries" ON public.contact_inquiries FOR SELECT USING (true);

-- ------------------------------------------------------------
-- 7. CUSTOM_PRODUCT_REQUESTS TABLE
-- Stores bespoke custom product commission requests
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_product_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    product_type TEXT NOT NULL,
    color_palette TEXT,
    target_date DATE,
    quantity INTEGER DEFAULT 1,
    custom_notes TEXT NOT NULL,
    status TEXT DEFAULT 'Pending', -- 'Pending', 'In Review', 'Quoted', 'In Production'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.custom_product_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on custom_product_requests" ON public.custom_product_requests;
DROP POLICY IF EXISTS "Allow public select on custom_product_requests" ON public.custom_product_requests;
CREATE POLICY "Allow public insert on custom_product_requests" ON public.custom_product_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on custom_product_requests" ON public.custom_product_requests FOR SELECT USING (true);

-- ------------------------------------------------------------
-- 8. ORDER_TRACKING TABLE
-- Stores step-by-step order tracking status logs
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert on order_tracking" ON public.order_tracking;
DROP POLICY IF EXISTS "Allow public select on order_tracking" ON public.order_tracking;
CREATE POLICY "Allow public insert on order_tracking" ON public.order_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select on order_tracking" ON public.order_tracking FOR SELECT USING (true);

-- ============================================================
-- SAMPLE SQL EXECUTED QUERY FOR PROFILE REGISTRATION
-- ============================================================
-- INSERT INTO public.profiles (
--     id, email, full_name, phone, door_number, street_name, 
--     village_block, city, state, country, pincode, updated_at
-- ) VALUES (
--     'usr_xyz123', 'user@example.com', 'Aria Chen', '+91 9876543210',
--     'Door No 42-A', 'Rosewood Lane', 'Velvet Gardens', 'Bangalore',
--     'Karnataka', 'India', '560001', NOW()
-- ) ON CONFLICT (id) DO UPDATE SET
--     full_name = EXCLUDED.full_name,
--     phone = EXCLUDED.phone,
--     door_number = EXCLUDED.door_number,
--     street_name = EXCLUDED.street_name,
--     village_block = EXCLUDED.village_block,
--     city = EXCLUDED.city,
--     state = EXCLUDED.state,
--     country = EXCLUDED.country,
--     pincode = EXCLUDED.pincode,
--     updated_at = NOW();
-- ============================================================
