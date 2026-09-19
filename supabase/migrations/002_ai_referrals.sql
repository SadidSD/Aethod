-- ============================================================
-- Aeethod Studio — AI Referral & Traffic Attribution
-- Migration: 002_ai_referrals
--
-- Adds optional dedicated attribution fields to sessions table:
--   1. ai_platform        — Recognized AI platform (ChatGPT, Perplexity, Claude, Gemini, Copilot, etc.)
--   2. ai_attribution_type — VERIFIED_AI_REFERRAL or UNKNOWN_AI
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

-- Add AI platform and attribution type columns if they do not exist
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS ai_platform TEXT,
  ADD COLUMN IF NOT EXISTS ai_attribution_type TEXT;

-- Comments
COMMENT ON COLUMN sessions.ai_platform IS 'Attributed AI platform: ChatGPT, Perplexity, Gemini, Claude, Microsoft Copilot, etc.';
COMMENT ON COLUMN sessions.ai_attribution_type IS 'Attribution confidence: VERIFIED_AI_REFERRAL or UNKNOWN_AI.';

-- Indexes for high-performance telemetry queries
CREATE INDEX IF NOT EXISTS idx_sessions_ai_platform ON sessions (ai_platform);
CREATE INDEX IF NOT EXISTS idx_sessions_ai_attribution_type ON sessions (ai_attribution_type);
