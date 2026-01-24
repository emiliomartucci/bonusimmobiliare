-- Bonus Immobiliare D1 Schema
-- v1.0.0 - 2026-01-24
-- Database: bonusimmobiliare-leads

-- Dokicasa Click Tracking
-- Tracks clicks on Dokicasa CTA buttons across the site
CREATE TABLE IF NOT EXISTS dokicasa_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
    landing_page TEXT NOT NULL,
    cta_location TEXT,
    referrer TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,
    device_type TEXT,
    user_agent TEXT,
    screen_width INTEGER,
    time_on_page_ms INTEGER,
    scroll_depth_percent INTEGER,
    pages_before TEXT
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON dokicasa_clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_clicks_landing_page ON dokicasa_clicks(landing_page);
CREATE INDEX IF NOT EXISTS idx_clicks_utm_source ON dokicasa_clicks(utm_source);
CREATE INDEX IF NOT EXISTS idx_clicks_utm_campaign ON dokicasa_clicks(utm_campaign);
