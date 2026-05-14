-- Migration: Metadata Fields
-- File: 000004-add-metadata-fields.sql

-- Add profile metadata
ALTER TABLE users
ADD COLUMN profile_metadata JSONB DEFAULT '{}';

-- Add listing metadata
ALTER TABLE listings
ADD COLUMN metadata JSONB DEFAULT '{}';

-- Add booking metadata
ALTER TABLE bookings
ADD COLUMN metadata JSONB DEFAULT '{}';

-- Add review metadata
ALTER TABLE reviews
ADD COLUMN metadata JSONB DEFAULT '{}';

-- Add search metadata
ALTER TABLE search_metadata
ADD COLUMN metadata JSONB DEFAULT '{}';
