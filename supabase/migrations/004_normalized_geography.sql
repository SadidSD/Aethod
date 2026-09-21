-- ============================================================
-- Aeethod Studio — Normalized Geography Schema Migration
-- Migration: 004_normalized_geography
--
-- Adds normalized, granular geography columns to sessions and visitors:
-- - country_code (ISO 3166-1 alpha-2, e.g. "BD", "US")
-- - country_name (Official canonical country name, e.g. "Bangladesh", "United States")
-- - region_code (State/Province code, e.g. "NY", "DHK")
-- - region_name (Full region name, e.g. "New York", "Dhaka Division")
-- - metro (Metropolitan hub or city fallback)
-- - timezone (IANA timezone name, e.g. "America/New_York", "Asia/Dhaka")
--
-- SAFE MIGRATION: Uses ADD COLUMN IF NOT EXISTS.
-- Preserves existing country/city legacy columns for full backwards compatibility.
-- ============================================================

-- Add normalized columns to sessions
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS country_name TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS region_code TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS region_name TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS metro TEXT;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS timezone TEXT;

-- Add normalized columns to visitors
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS country_code TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS country_name TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS region_code TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS region_name TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS metro TEXT;
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS timezone TEXT;

-- Performance indexes for country and city lookups
CREATE INDEX IF NOT EXISTS idx_sessions_country_code ON sessions (country_code);
CREATE INDEX IF NOT EXISTS idx_sessions_country_name ON sessions (country_name);
CREATE INDEX IF NOT EXISTS idx_sessions_city ON sessions (city);
CREATE INDEX IF NOT EXISTS idx_sessions_metro ON sessions (metro);
CREATE INDEX IF NOT EXISTS idx_visitors_country_code ON visitors (country_code);
