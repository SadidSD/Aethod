-- ============================================================
-- Aeethod Studio — Universal AI Referral & Traffic Attribution
-- Migration: 002_ai_referrals
--
-- Adds optional dedicated attribution and discovery fields to sessions table:
--   1. ai_platform             — Canonical AI platform name (ChatGPT, Claude, Gemini, DeepSeek, Copilot, etc.)
--   2. ai_attribution_type     — VERIFIED_AI_REFERRAL or UNKNOWN_AI
--   3. ai_referrer_host        — Normalized referring hostname (e.g. claude.ai, chatgpt.com)
--   4. ai_referrer_path        — Normalized referral path (e.g. /referral/2026-09-21)
--   5. landing_page            — Initial acquisition landing page path
--   6. unknown_referrer_host   — Candidate external host for AI platform discovery
--   7. attribution_reason      — Deterministic acquisition resolution reason
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → New Query → Paste & Run
--
-- NOTE:
-- The Aeethod Analytics engine is fully backward-compatible and
-- automatically derives and attributes AI referral platforms dynamically
-- from sessions.referrer and UTM parameters even if this migration has
-- not yet been executed in Supabase.
-- ============================================================

-- Add AI platform, attribution, and discovery columns if they do not exist
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS ai_platform TEXT,
  ADD COLUMN IF NOT EXISTS ai_attribution_type TEXT,
  ADD COLUMN IF NOT EXISTS ai_referrer_host TEXT,
  ADD COLUMN IF NOT EXISTS ai_referrer_path TEXT,
  ADD COLUMN IF NOT EXISTS landing_page TEXT,
  ADD COLUMN IF NOT EXISTS unknown_referrer_host TEXT,
  ADD COLUMN IF NOT EXISTS attribution_reason TEXT;

-- Comments
COMMENT ON COLUMN sessions.ai_platform IS 'Attributed canonical AI platform: ChatGPT, Perplexity, Gemini, Claude, DeepSeek, Microsoft Copilot, Grok, Meta AI, etc.';
COMMENT ON COLUMN sessions.ai_attribution_type IS 'Attribution confidence: VERIFIED_AI_REFERRAL or UNKNOWN_AI.';
COMMENT ON COLUMN sessions.ai_referrer_host IS 'Normalized hostname of the referring source.';
COMMENT ON COLUMN sessions.ai_referrer_path IS 'Normalized pathname of the referring source.';
COMMENT ON COLUMN sessions.landing_page IS 'Initial page path where session was acquired.';
COMMENT ON COLUMN sessions.unknown_referrer_host IS 'Unclassified external referrer host for emerging AI platform discovery.';
COMMENT ON COLUMN sessions.attribution_reason IS 'Deterministic acquisition resolution reason rule.';

-- Indexes for high-performance telemetry queries
CREATE INDEX IF NOT EXISTS idx_sessions_ai_platform ON sessions (ai_platform);
CREATE INDEX IF NOT EXISTS idx_sessions_ai_attribution_type ON sessions (ai_attribution_type);
CREATE INDEX IF NOT EXISTS idx_sessions_unknown_referrer_host ON sessions (unknown_referrer_host);
