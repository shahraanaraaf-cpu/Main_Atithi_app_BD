-- Migration: Row Level Security Policies (Fixed)
-- File: 000002-add-rls-policies.sql

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Users can insert their own profile (auto-created via auth)
CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
    ON users FOR DELETE
    USING (auth.uid() = id);

-- Enable RLS on listings table
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Anyone can view active listings
CREATE POLICY "Anyone can view active listings"
    ON listings FOR SELECT
    USING (is_active = TRUE);

-- Users can create listings for themselves
CREATE POLICY "Users can create own listings"
    ON listings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own listings
CREATE POLICY "Users can update own listings"
    ON listings FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own listings
CREATE POLICY "Users can delete own listings"
    ON listings FOR DELETE
    USING (auth.uid() = user_id);

-- Enable RLS on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create bookings for themselves
CREATE POLICY "Users can create own bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own bookings
CREATE POLICY "Users can delete own bookings"
    ON bookings FOR DELETE
    USING (auth.uid() = user_id);

-- Enable RLS on reviews table
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view reviews for active listings
CREATE POLICY "Anyone can view reviews"
    ON reviews FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM listings
        WHERE listings.id = reviews.listing_id
        AND listings.is_active = TRUE
    ));

-- Only logged-in users can create reviews
CREATE POLICY "Users can create reviews"
    ON reviews FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
    ON reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Enable RLS on categories table (read-only for everyone, admin-only write)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view categories
CREATE POLICY "Anyone can view categories"
    ON categories FOR SELECT
    USING (TRUE);

-- Only authenticated users can insert categories (or use admin role)
CREATE POLICY "Authenticated users can create categories"
    ON categories FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update categories
CREATE POLICY "Authenticated users can update categories"
    ON categories FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Only authenticated users can delete categories
CREATE POLICY "Authenticated users can delete categories"
    ON categories FOR DELETE
    USING (auth.role() = 'authenticated');