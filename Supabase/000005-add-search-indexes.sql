-- Migration: Search Indexes
-- File: 000005-add-search-indexes.sql

-- Create full-text search configuration
CREATE TEXT SEARCH CONFIGURATION marketplace_search_config (
    PARSER = pg_catalog.default,
    TEMPLATE = pg_catalog.simple
);

-- Create full-text search index on listings
CREATE INDEX idx_listings_title_search ON listings
USING GIN(to_tsvector('english', title));

-- Create full-text search index on listing descriptions
CREATE INDEX idx_listings_description_search ON listings
USING GIN(to_tsvector('english', description));

-- Create combined search index
CREATE INDEX idx_listings_combined_search ON listings
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
