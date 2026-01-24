/**
 * Dokicasa Click Tracking API
 * v1.0.0 - 2026-01-24
 *
 * Receives click data from dokicasa-tracking.js and stores in D1
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
            time_on_page_ms: data.time_on_page_ms || null,
            scroll_depth_percent: data.scroll_depth_percent || null,
            pages_before: data.pages_before ? JSON.stringify(data.pages_before) : null
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
            device_type, user_agent, screen_width, time_on_page_ms,
            scroll_depth_percent, pages_before
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        data.time_on_page_ms,
        data.scroll_depth_percent,
        data.pages_before
    ).run();
}
