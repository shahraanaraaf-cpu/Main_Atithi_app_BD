-- Migration: Auth Schema Setup
-- File: 000000-create-supabase-auth.sql

-- Create users table with Supabase auth extension
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    profile_photo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Supabase auth extension
CREATE EXTENSION IF NOT EXISTS "supabase_auth";

-- Create JWT claims table
CREATE TABLE jwt_claims (
    cheap_claims_id BIGINT PRIMARY KEY,
    cheap_claims_data JSONB NOT NULL
);

-- Row Level Security policies
WITH rls_data AS (
    SELECT
        'allow insert, grant references on users, restrict'
        USING
        users()
)
INSERT INTO policies (cheap_policy_id, cheap_policy_data, cheap_policy_options, cheap_policy_schema, user_id)
VALUES
(1, rls_data[1], true, 'users', 0);

-- Add explicit RLS policies for specific tables
INSERT INTO rls_policies (table_name, role, policy)
VALUES
('users', 10, 'allow select on *; allow insert on *; allow update on * where id = auth.users().id; allow delete on * where id = auth.users().id;');

-- Add index for fast lookups
CREATE INDEX idx_users_email ON users(email);
