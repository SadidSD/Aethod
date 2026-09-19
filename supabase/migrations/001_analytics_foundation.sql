-- ============================================================
-- Aeethod Studio — Analytics Database Foundation
-- Migration: 001_analytics_foundation
--
-- Creates the core tables for the 360° Analytics system:
--   1. visitors       — Persistent anonymous visitor identity
--   2. sessions       — Browsing sessions with traffic attribution
--   3. page_views     — Individual page view events
--   4. analytics_events — Meaningful user actions/conversions
--
-- Includes: indexes, foreign keys, RLS policies, constraints.
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → New Query → Paste & Run
--
-- All timestamps use TIMESTAMPTZ (UTC).
-- No raw IP addresses are stored.
-- ============================================================

-- Enable UUID generation (already enabled by default in Supabase,
-- but included for reproducibility in other environments)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. VISITORS
-- ============================================================

CREATE TABLE IF NOT EXISTS visitors (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id        TEXT        UNIQUE NOT NULL,
  first_seen        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen         TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Non-sensitive device/geo metadata
  device_type       TEXT,
  operating_system  TEXT,
  browser           TEXT,
  country           TEXT,
  city              TEXT
);

COMMENT ON TABLE visitors IS 'Persistent anonymous visitor identity for Aeethod Analytics. No PII stored.';
COMMENT ON COLUMN visitors.visitor_id IS 'Client-generated anonymous identifier (e.g., UUID stored in localStorage).';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_visitors_visitor_id   ON visitors (visitor_id);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen    ON visitors (last_seen);
CREATE INDEX IF NOT EXISTS idx_visitors_country      ON visitors (country);
CREATE INDEX IF NOT EXISTS idx_visitors_device_type  ON visitors (device_type);


-- ============================================================
-- 2. SESSIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS sessions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        TEXT        UNIQUE NOT NULL,
  visitor_id        TEXT        NOT NULL,
  started_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_activity_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at          TIMESTAMPTZ,

  -- Traffic attribution
  referrer          TEXT,
  utm_source        TEXT,
  utm_medium        TEXT,
  utm_campaign      TEXT,
  utm_term          TEXT,
  utm_content       TEXT,

  -- Classification
  traffic_source    TEXT        NOT NULL DEFAULT 'Direct',

  -- Device information
  device_type       TEXT,
  operating_system  TEXT,
  browser           TEXT,

  -- Geography
  country           TEXT,
  city              TEXT,

  -- Foreign key
  CONSTRAINT fk_sessions_visitor
    FOREIGN KEY (visitor_id)
    REFERENCES visitors (visitor_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

COMMENT ON TABLE sessions IS 'Browsing sessions with traffic attribution, device, and geo metadata.';
COMMENT ON COLUMN sessions.traffic_source IS 'Classified source: Direct, Organic Search, Social, Paid Ads, Referral.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id       ON sessions (visitor_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_id       ON sessions (session_id);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at       ON sessions (started_at);
CREATE INDEX IF NOT EXISTS idx_sessions_last_activity    ON sessions (last_activity_at);
CREATE INDEX IF NOT EXISTS idx_sessions_traffic_source   ON sessions (traffic_source);
CREATE INDEX IF NOT EXISTS idx_sessions_device_type      ON sessions (device_type);


-- ============================================================
-- 3. PAGE VIEWS
-- ============================================================

CREATE TABLE IF NOT EXISTS page_views (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        TEXT        NOT NULL,
  visitor_id        TEXT        NOT NULL,
  path              TEXT        NOT NULL,
  viewed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  duration_seconds  INTEGER     NOT NULL DEFAULT 0,

  -- Optional
  referrer          TEXT,

  -- Foreign keys
  CONSTRAINT fk_page_views_session
    FOREIGN KEY (session_id)
    REFERENCES sessions (session_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_page_views_visitor
    FOREIGN KEY (visitor_id)
    REFERENCES visitors (visitor_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

COMMENT ON TABLE page_views IS 'Individual page view events within sessions.';
COMMENT ON COLUMN page_views.path IS 'Page path, e.g., "/works", "/services/automation".';
COMMENT ON COLUMN page_views.duration_seconds IS 'Approximate time spent on page in seconds.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_page_views_session_id  ON page_views (session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id  ON page_views (visitor_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path        ON page_views (path);
CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at   ON page_views (viewed_at);


-- ============================================================
-- 4. ANALYTICS EVENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        TEXT        NOT NULL,
  visitor_id        TEXT        NOT NULL,
  event_name        TEXT        NOT NULL,
  event_value       JSONB,
  page_path         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Foreign keys
  CONSTRAINT fk_events_session
    FOREIGN KEY (session_id)
    REFERENCES sessions (session_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT fk_events_visitor
    FOREIGN KEY (visitor_id)
    REFERENCES visitors (visitor_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

COMMENT ON TABLE analytics_events IS 'Meaningful user actions and conversion events.';
COMMENT ON COLUMN analytics_events.event_name IS 'Event identifier: explore_services, view_work, cta_click, inquiry_submitted, etc.';
COMMENT ON COLUMN analytics_events.event_value IS 'Arbitrary JSON metadata for the event.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_session_id   ON analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_events_visitor_id   ON analytics_events (visitor_id);
CREATE INDEX IF NOT EXISTS idx_events_event_name   ON analytics_events (event_name);
CREATE INDEX IF NOT EXISTS idx_events_created_at   ON analytics_events (created_at);


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- Enable RLS on all analytics tables.
-- No permissive policies for the anon role.
-- All data access happens through server-side API routes
-- using the service_role key (which bypasses RLS).
-- ============================================================

-- Enable RLS
ALTER TABLE visitors         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views       ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owners too (extra safety)
ALTER TABLE visitors         FORCE ROW LEVEL SECURITY;
ALTER TABLE sessions         FORCE ROW LEVEL SECURITY;
ALTER TABLE page_views       FORCE ROW LEVEL SECURITY;
ALTER TABLE analytics_events FORCE ROW LEVEL SECURITY;

-- Deny all access via anon/authenticated roles.
-- The service_role key bypasses RLS entirely, so no explicit
-- service_role policies are needed.
--
-- If future requirements need fine-grained access (e.g., letting
-- authenticated Supabase users read analytics), add specific
-- policies here.

-- ============================================================
-- VERIFICATION QUERIES (run after migration to confirm)
-- ============================================================
-- SELECT tablename, rowsecurity FROM pg_tables
--   WHERE schemaname = 'public'
--   AND tablename IN ('visitors', 'sessions', 'page_views', 'analytics_events');
--
-- SELECT indexname, tablename FROM pg_indexes
--   WHERE schemaname = 'public'
--   AND tablename IN ('visitors', 'sessions', 'page_views', 'analytics_events');
--
-- SELECT conname, conrelid::regclass, confrelid::regclass
--   FROM pg_constraint
--   WHERE contype = 'f'
--   AND conrelid::regclass::text IN ('sessions', 'page_views', 'analytics_events');
-- ============================================================
