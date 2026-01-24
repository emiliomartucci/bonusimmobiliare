-- Bonus Immobiliare D1 Schema
-- v1.0.0 - 2026-01-24
-- Database: bonusimmobiliare-leads

-- Dokicasa Click Tracking
-- Tracks clicks on Dokicasa CTA buttons across the site
CREATE TABLE IF NOT EXISTS dokicasa_clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT UNIQUE NOT NULL,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP,

    -- Page & CTA info
    landing_page TEXT NOT NULL,
    cta_location TEXT,
    referrer TEXT,

    -- UTM params
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_term TEXT,
    utm_content TEXT,

    -- Device & browser
    device_type TEXT,
    user_agent TEXT,
    screen_width INTEGER,
    screen_height INTEGER,
    viewport_width INTEGER,
    viewport_height INTEGER,

    -- User behavior
    time_on_page_ms INTEGER,
    scroll_depth_percent INTEGER,
    pages_before TEXT,
    clicks_on_page INTEGER DEFAULT 0,

    -- Network & geo (from Cloudflare headers)
    ip TEXT,
    ip_country TEXT,
    ip_city TEXT,
    ip_region TEXT,
    ip_timezone TEXT,
    ip_asn TEXT,

    -- Browser info
    language TEXT,
    platform TEXT,
    cookies_enabled INTEGER,
    do_not_track INTEGER,

    -- Performance
    connection_type TEXT,
    page_load_time_ms INTEGER
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_clicks_timestamp ON dokicasa_clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_clicks_landing_page ON dokicasa_clicks(landing_page);
CREATE INDEX IF NOT EXISTS idx_clicks_utm_source ON dokicasa_clicks(utm_source);
CREATE INDEX IF NOT EXISTS idx_clicks_utm_campaign ON dokicasa_clicks(utm_campaign);
