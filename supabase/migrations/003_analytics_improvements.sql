-- ============================================================
-- Aeethod Studio — Analytics Improvements Migration
-- Migration: 003_analytics_improvements
--
-- Adds composite indexes for common analytics query patterns.
-- ============================================================

-- Composite index for geography queries (country + date range)
CREATE INDEX IF NOT EXISTS idx_sessions_started_country
  ON sessions (started_at, country);

-- Composite index for traffic source queries
CREATE INDEX IF NOT EXISTS idx_sessions_started_traffic
  ON sessions (started_at, traffic_source);

-- Index for active visitor queries (ended_at for filtering ongoing sessions)
CREATE INDEX IF NOT EXISTS idx_sessions_ended_at
  ON sessions (ended_at);

-- Index for landing page performance queries
CREATE INDEX IF NOT EXISTS idx_sessions_landing_page
  ON sessions (landing_page)
  WHERE landing_page IS NOT NULL;

-- Composite index for browser analytics
CREATE INDEX IF NOT EXISTS idx_sessions_started_browser
  ON sessions (started_at, browser);

-- Composite index for OS analytics  
CREATE INDEX IF NOT EXISTS idx_sessions_started_os
  ON sessions (started_at, operating_system);
