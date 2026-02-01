/**
 * Dokicasa Click Tracking API
 * v1.3.0 - 2026-02-01
 *
 * Receives click data from dokicasa-tracking.js and stores in D1
 * Also sends to Google Sheets via Apps Script webhook
 * Includes IP and geo data from Cloudflare headers
 * Endpoint: POST /api/dokicasa-click
 */

// Allowed origins for CORS (P1.5 fix)
const ALLOWED_ORIGINS = [
    'https://bonusimmobiliare.it',
    'https://www.bonusimmobiliare.it',
    'https://bonusimmobiliare.pages.dev'
];

// Input validation limits (P1.7 fix)
const LIMITS = {
    session_id: 100,
    landing_page: 500,
    cta_location: 100,
    referrer: 500,
    utm_source: 100,
    utm_medium: 100,
    utm_campaign: 200,
    utm_term: 200,
    utm_content: 200,
    user_agent: 500,
    language: 20,
    platform: 50,
    connection_type: 50,
    screen_width: { min: 0, max: 10000 },
    screen_height: { min: 0, max: 10000 },
    viewport_width: { min: 0, max: 10000 },
    viewport_height: { min: 0, max: 10000 },
    time_on_page_ms: { min: 0, max: 86400000 },
    scroll_depth_percent: { min: 0, max: 100 },
    clicks_on_page: { min: 0, max: 10000 },
    page_load_time_ms: { min: 0, max: 300000 }
};

function getCorsHeaders(request) {
    const origin = request.headers.get('Origin');
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
}

function validateString(value, maxLength) {
    if (value === null || value === undefined) return null;
    const str = String(value).trim();
    return str.length > maxLength ? str.substring(0, maxLength) : str;
}

function validateNumber(value, limits) {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    if (isNaN(num)) return null;
    if (num < limits.min || num > limits.max) return null;
    return num;
}

function anonymizeIP(ip) {
    if (!ip) return null;
    // IPv4: remove last octet (e.g., 192.168.1.100 -> 192.168.1.0)
    if (ip.includes('.')) {
        const parts = ip.split('.');
        if (parts.length === 4) {
            parts[3] = '0';
            return parts.join('.');
        }
    }
    // IPv6: remove last 80 bits (keep first 48 bits)
    if (ip.includes(':')) {
        const parts = ip.split(':');
        if (parts.length >= 3) {
            return parts.slice(0, 3).join(':') + '::';
        }
    }
    return null;
}

export async function onRequestPost(context) {
    const { request, env } = context;
    const corsHeaders = getCorsHeaders(request);

    try {
        const data = await request.json();

        // Validate required fields with length limits
        const session_id = validateString(data.session_id, LIMITS.session_id);
        const landing_page = validateString(data.landing_page, LIMITS.landing_page);

        if (!session_id || !landing_page) {
            return new Response(
                JSON.stringify({ error: 'Invalid request' }),
                { status: 400, headers: corsHeaders }
            );
        }

        // Get IP and geo data from Cloudflare headers (anonymize IP for GDPR)
        const rawIP = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Real-IP') || null;
        const ip = anonymizeIP(rawIP);
        const country = request.headers.get('CF-IPCountry') || null;
        const city = request.cf?.city || null;
        const region = request.cf?.region || null;
        const timezone = request.cf?.timezone || null;
        const asn = request.cf?.asn ? String(request.cf.asn) : null;

        // Validate all input fields
        const screen_width = validateNumber(data.screen_width, LIMITS.screen_width);
        const deviceType = getDeviceType(screen_width);

        // Insert into D1 with validated data
        const result = await insertClick(env.DB, {
            session_id: session_id,
            landing_page: landing_page,
            cta_location: validateString(data.cta_location, LIMITS.cta_location),
            referrer: validateString(data.referrer, LIMITS.referrer),
            utm_source: validateString(data.utm_source, LIMITS.utm_source),
            utm_medium: validateString(data.utm_medium, LIMITS.utm_medium),
            utm_campaign: validateString(data.utm_campaign, LIMITS.utm_campaign),
            utm_term: validateString(data.utm_term, LIMITS.utm_term),
            utm_content: validateString(data.utm_content, LIMITS.utm_content),
            device_type: deviceType,
            user_agent: validateString(data.user_agent, LIMITS.user_agent),
            screen_width: screen_width,
            screen_height: validateNumber(data.screen_height, LIMITS.screen_height),
            viewport_width: validateNumber(data.viewport_width, LIMITS.viewport_width),
            viewport_height: validateNumber(data.viewport_height, LIMITS.viewport_height),
            time_on_page_ms: validateNumber(data.time_on_page_ms, LIMITS.time_on_page_ms),
            scroll_depth_percent: validateNumber(data.scroll_depth_percent, LIMITS.scroll_depth_percent),
            pages_before: data.pages_before ? JSON.stringify(data.pages_before).substring(0, 1000) : null,
            clicks_on_page: validateNumber(data.clicks_on_page, LIMITS.clicks_on_page) || 0,
            ip: ip,
            ip_country: country,
            ip_city: city,
            ip_region: region,
            ip_timezone: timezone,
            ip_asn: asn,
            language: validateString(data.language, LIMITS.language),
            platform: validateString(data.platform, LIMITS.platform),
            cookies_enabled: data.cookies_enabled ? 1 : 0,
            do_not_track: data.do_not_track ? 1 : 0,
            connection_type: validateString(data.connection_type, LIMITS.connection_type),
            page_load_time_ms: validateNumber(data.page_load_time_ms, LIMITS.page_load_time_ms)
        });

        // Send to Google Sheets (fire and forget, don't block response)
        if (env.GOOGLE_SHEETS_WEBHOOK) {
            sendToGoogleSheets(env.GOOGLE_SHEETS_WEBHOOK, {
                session_id,
                landing_page,
                cta_location: validateString(data.cta_location, LIMITS.cta_location),
                referrer: validateString(data.referrer, LIMITS.referrer),
                utm_source: validateString(data.utm_source, LIMITS.utm_source),
                utm_medium: validateString(data.utm_medium, LIMITS.utm_medium),
                utm_campaign: validateString(data.utm_campaign, LIMITS.utm_campaign),
                utm_term: validateString(data.utm_term, LIMITS.utm_term),
                utm_content: validateString(data.utm_content, LIMITS.utm_content),
                device_type: deviceType,
                screen_width,
                screen_height: validateNumber(data.screen_height, LIMITS.screen_height),
                viewport_width: validateNumber(data.viewport_width, LIMITS.viewport_width),
                viewport_height: validateNumber(data.viewport_height, LIMITS.viewport_height),
                time_on_page_ms: validateNumber(data.time_on_page_ms, LIMITS.time_on_page_ms),
                scroll_depth_percent: validateNumber(data.scroll_depth_percent, LIMITS.scroll_depth_percent),
                pages_before: data.pages_before ? JSON.stringify(data.pages_before) : null,
                clicks_on_page: validateNumber(data.clicks_on_page, LIMITS.clicks_on_page) || 0,
                ip_country: country,
                ip_city: city,
                ip_region: region,
                ip_timezone: timezone,
                language: validateString(data.language, LIMITS.language),
                platform: validateString(data.platform, LIMITS.platform),
                connection_type: validateString(data.connection_type, LIMITS.connection_type),
                page_load_time_ms: validateNumber(data.page_load_time_ms, LIMITS.page_load_time_ms)
            }).catch(err => console.error('Google Sheets webhook error:', err.message));
        }

        return new Response(
            JSON.stringify({ tracked: true, message: 'Click tracked successfully' }),
            { status: 200, headers: corsHeaders }
        );

    } catch (error) {
        // Handle UNIQUE constraint violation (duplicate session)
        if (error.message && error.message.includes('UNIQUE constraint failed')) {
            return new Response(
                JSON.stringify({ tracked: true, message: 'Click already tracked for this session' }),
                { status: 200, headers: corsHeaders }
            );
        }

        // Log error server-side only (P2.1 + P2.7 fix)
        console.error('Click tracking error:', error.message);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: corsHeaders }
        );
    }
}

// Handle OPTIONS preflight
export async function onRequestOptions(context) {
    const { request } = context;
    const origin = request.headers.get('Origin');
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': allowedOrigin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

function getDeviceType(screenWidth) {
    if (!screenWidth) return 'unknown';
    if (screenWidth < 768) return 'mobile';
    if (screenWidth < 1024) return 'tablet';
    return 'desktop';
}

async function insertClick(db, data) {
    const query = `
        INSERT INTO dokicasa_clicks (
            session_id, landing_page, cta_location, referrer,
            utm_source, utm_medium, utm_campaign, utm_term, utm_content,
            device_type, user_agent, screen_width, screen_height,
            viewport_width, viewport_height,
            time_on_page_ms, scroll_depth_percent, pages_before, clicks_on_page,
            ip, ip_country, ip_city, ip_region, ip_timezone, ip_asn,
            language, platform, cookies_enabled, do_not_track,
            connection_type, page_load_time_ms
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return await db.prepare(query).bind(
        data.session_id,
        data.landing_page,
        data.cta_location,
        data.referrer,
        data.utm_source,
        data.utm_medium,
        data.utm_campaign,
        data.utm_term,
        data.utm_content,
        data.device_type,
        data.user_agent,
        data.screen_width,
        data.screen_height,
        data.viewport_width,
        data.viewport_height,
        data.time_on_page_ms,
        data.scroll_depth_percent,
        data.pages_before,
        data.clicks_on_page,
        data.ip,
        data.ip_country,
        data.ip_city,
        data.ip_region,
        data.ip_timezone,
        data.ip_asn,
        data.language,
        data.platform,
        data.cookies_enabled,
        data.do_not_track,
        data.connection_type,
        data.page_load_time_ms
    ).run();
}

/**
 * Send click data to Google Sheets via Apps Script webhook
 * Fire and forget - errors don't affect main tracking
 */
async function sendToGoogleSheets(webhookUrl, data) {
    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`Google Sheets webhook returned ${response.status}`);
    }

    return response.json();
}
