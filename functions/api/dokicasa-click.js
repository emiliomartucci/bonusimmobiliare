/**
 * Dokicasa Click Tracking API
 * v1.1.0 - 2026-01-24
 *
 * Receives click data from dokicasa-tracking.js and stores in D1
 * Includes IP and geo data from Cloudflare headers
 * Endpoint: POST /api/dokicasa-click
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    try {
        const data = await request.json();

        // Validate required fields
        if (!data.session_id || !data.landing_page) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields: session_id, landing_page' }),
                { status: 400, headers: corsHeaders }
            );
        }

        // Get IP and geo data from Cloudflare headers
        const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Real-IP') || null;
        const country = request.headers.get('CF-IPCountry') || null;
        const city = request.cf?.city || null;
        const region = request.cf?.region || null;
        const timezone = request.cf?.timezone || null;
        const asn = request.cf?.asn ? String(request.cf.asn) : null;

        // Detect device type from screen width
        const deviceType = getDeviceType(data.screen_width);

        // Insert into D1
        const result = await insertClick(env.DB, {
            session_id: data.session_id,
            landing_page: data.landing_page,
            cta_location: data.cta_location || null,
            referrer: data.referrer || null,
            utm_source: data.utm_source || null,
            utm_medium: data.utm_medium || null,
            utm_campaign: data.utm_campaign || null,
            utm_term: data.utm_term || null,
            utm_content: data.utm_content || null,
            device_type: deviceType,
            user_agent: data.user_agent || null,
            screen_width: data.screen_width || null,
            screen_height: data.screen_height || null,
            viewport_width: data.viewport_width || null,
            viewport_height: data.viewport_height || null,
            time_on_page_ms: data.time_on_page_ms || null,
            scroll_depth_percent: data.scroll_depth_percent || null,
            pages_before: data.pages_before ? JSON.stringify(data.pages_before) : null,
            clicks_on_page: data.clicks_on_page || 0,
            ip: ip,
            ip_country: country,
            ip_city: city,
            ip_region: region,
            ip_timezone: timezone,
            ip_asn: asn,
            language: data.language || null,
            platform: data.platform || null,
            cookies_enabled: data.cookies_enabled ? 1 : 0,
            do_not_track: data.do_not_track ? 1 : 0,
            connection_type: data.connection_type || null,
            page_load_time_ms: data.page_load_time_ms || null
        });

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

        console.error('Error tracking click:', error);
        return new Response(
            JSON.stringify({ error: 'Internal server error', details: error.message }),
            { status: 500, headers: corsHeaders }
        );
    }
}

// Handle OPTIONS preflight
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
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
