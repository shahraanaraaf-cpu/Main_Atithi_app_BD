-- Fix Schema to match Frontend Interfaces
-- Run this in your Supabase SQL Editor

-- 1. Drop old mismatched tables (Warning: this deletes existing data in these tables)
DROP TABLE IF EXISTS search_metadata CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Create the profiles table (linked to Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role TEXT DEFAULT 'GUEST',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'HOME', 'EXPERIENCE', 'SERVICE'
    title TEXT NOT NULL,
    description TEXT,
    city TEXT,
    district TEXT,
    address TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    price_bdt NUMERIC NOT NULL,
    currency TEXT DEFAULT 'BDT',
    service_fee_bdt NUMERIC DEFAULT 0,
    cleaning_fee_bdt NUMERIC DEFAULT 0,
    max_guests INT DEFAULT 1,
    bedrooms INT DEFAULT 0,
    bathrooms INT DEFAULT 0,
    amenities TEXT[] DEFAULT '{}',
    image_urls TEXT[] DEFAULT '{}',
    average_rating NUMERIC DEFAULT 0,
    review_count INT DEFAULT 0,
    is_guest_favorite BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    availability_calendar JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    amount_bdt NUMERIC NOT NULL,
    check_in DATE,
    check_out DATE,
    status TEXT DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
    rating NUMERIC CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: Disable RLS for now so seed scripts can insert easily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
