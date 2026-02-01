-- Migration 001: Fix NULL timestamps
-- v1.0.0 - 2026-02-01
-- Run against D1 production database

-- Fix existing NULL timestamps (if any)
UPDATE dokicasa_clicks
SET timestamp = CURRENT_TIMESTAMP
WHERE timestamp IS NULL;

-- Note: D1 (SQLite) doesn't support ALTER COLUMN for constraints.
-- For production, the NOT NULL constraint is enforced by:
-- 1. The updated schema.sql for new tables
-- 2. This migration fixes existing NULL values
-- 3. The API now always provides a default timestamp
