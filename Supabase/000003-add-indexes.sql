-- Migration: Performance Indexes
-- File: 000003-add-indexes.sql

-- Users
CREATE INDEX idx_users_first_name ON users(first_name);
CREATE INDEX idx_users_last_name ON users(last_name);

-- Categories
CREATE INDEX idx_categories_name ON categories(name);

-- Listings
CREATE INDEX idx_listings_title ON listings(title);
CREATE INDEX idx_listings_category_id ON listings(category_id);
CREATE INDEX idx_listings_user_id ON listings(user_id);

-- Bookings
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);

-- Reviews
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);

-- Search metadata (GIN index for array of keywords)
CREATE INDEX idx_search_metadata_keywords ON search_metadata USING GIN(keywords);
