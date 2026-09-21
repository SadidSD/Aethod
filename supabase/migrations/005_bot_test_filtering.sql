-- ============================================================
-- Aeethod Studio — Session Classification Schema Migration
-- Migration: 005_bot_test_filtering
--
-- Adds session classification column:
-- - classification: 'human_or_unknown' (default), 'bot', 'test'
--
-- Excluded sessions are NEVER deleted. They remain in Supabase
-- for forensic audit, while being excluded from KPI metrics.
-- ============================================================

-- Add classification column to sessions
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'human_or_unknown';

-- Performance index for session filtering
CREATE INDEX IF NOT EXISTS idx_sessions_classification ON sessions (classification);

-- Add classification column to visitors (optional)
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'human_or_unknown';
CREATE INDEX IF NOT EXISTS idx_visitors_classification ON visitors (classification);
