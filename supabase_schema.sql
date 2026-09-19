-- ========================================================
-- THREADTALES SUPABASE DATABASE SCHEMA
-- Execute this SQL script in your Supabase SQL Editor
-- ========================================================

-- 1. PROFILES TABLE (Linked to auth.users.id)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile." on public.profiles;
create policy "Users can view their own profile." 
  on public.profiles for select 
  using ( (select auth.uid()) = id );

drop policy if exists "Users can update their own profile." on public.profiles;
create policy "Users can update their own profile." 
  on public.profiles for update 
  using ( (select auth.uid()) = id );

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." 
  on public.profiles for insert 
  with check ( (select auth.uid()) = id );

-- Automatic profile creation trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. ORDERS TABLE
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  order_number text unique not null,
  status text not null default 'ORDER_PLACED',
  total_amount numeric(10,2) not null,
  delivery_address jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for orders
alter table public.orders enable row level security;

drop policy if exists "Users can select their own orders." on public.orders;
create policy "Users can select their own orders." 
  on public.orders for select 
  using ( (select auth.uid()) = user_id );

drop policy if exists "Users can insert their own orders." on public.orders;
create policy "Users can insert their own orders." 
  on public.orders for insert 
  with check ( (select auth.uid()) = user_id );


-- 3. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text not null,
  product_name text not null,
  product_image text,
  quantity integer not null default 1,
  price numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for order_items
alter table public.order_items enable row level security;

drop policy if exists "Users can view order items of their own orders." on public.order_items;
create policy "Users can view order items of their own orders." 
  on public.order_items for select 
  using (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_items.order_id
        and public.orders.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can insert order items into their own orders." on public.order_items;
create policy "Users can insert order items into their own orders." 
  on public.order_items for insert 
  with check (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_items.order_id
        and public.orders.user_id = (select auth.uid())
    )
  );


-- 4. ORDER TRACKING TABLE
create table if not exists public.order_tracking (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  status text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for order_tracking
alter table public.order_tracking enable row level security;

drop policy if exists "Users can view tracking of their own orders." on public.order_tracking;
create policy "Users can view tracking of their own orders." 
  on public.order_tracking for select 
  using (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_tracking.order_id
        and public.orders.user_id = (select auth.uid())
    )
  );

drop policy if exists "Users can insert tracking events for their own orders." on public.order_tracking;
create policy "Users can insert tracking events for their own orders." 
  on public.order_tracking for insert 
  with check (
    exists (
      select 1 from public.orders
      where public.orders.id = public.order_tracking.order_id
        and public.orders.user_id = (select auth.uid())
    )
  );
