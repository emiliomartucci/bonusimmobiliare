/**
 * Dokicasa Click Tracking
 * v1.1.0 - 2026-01-24
 *
 * Tracks clicks on Dokicasa CTA links with full data collection:
 * - Session ID, UTM params
 * - Time on page, scroll depth, pages visited
 * - Screen/viewport dimensions
 * - Browser info (language, platform, cookies, DNT)
 * - Connection type, page load time
 * - Click count on page
 */

class DokicasaTracking {
    constructor() {
        this.apiUrl = '/api/dokicasa-click';
        this.sessionKey = 'bi_session_id';
        this.utmKey = 'bi_utm_params';
        this.pagesKey = 'bi_pages_visited';
        this.startTime = Date.now();
        this.maxScrollDepth = 0;
        this.clicksOnPage = 0;
        this.landingPage = window.location.pathname;
        this.pageLoadTime = null;
    }

    init() {
        // Generate or retrieve session ID
        this.getSessionId();

        // Extract and store UTM params
        this.getUTMParams();

        // Record current page
        this.recordCurrentPage();

        // Track scroll depth
        this.trackScrollDepth();

        // Get page load time when available
        this.getPageLoadTime();

        // Attach click handlers to Dokicasa links
        this.attachClickHandlers();

        console.log('[DokicasaTracking] Initialized', {
            session_id: this.getSessionId(),
            landing_page: this.landingPage
        });
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem(this.sessionKey);
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
            sessionStorage.setItem(this.sessionKey, sessionId);
        }
        return sessionId;
    }

    getUTMParams() {
        // Check if already stored in session
        let stored = sessionStorage.getItem(this.utmKey);
        if (stored) {
            return JSON.parse(stored);
        }

        // Extract from URL
        const params = new URLSearchParams(window.location.search);
        const utmParams = {
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_term: params.get('utm_term'),
            utm_content: params.get('utm_content')
        };

        // Store in session
        sessionStorage.setItem(this.utmKey, JSON.stringify(utmParams));
        return utmParams;
    }

    recordCurrentPage() {
        let pages = JSON.parse(sessionStorage.getItem(this.pagesKey) || '[]');
        const currentPath = window.location.pathname;

        // Avoid duplicates and limit to 10
        if (pages[pages.length - 1] !== currentPath) {
            pages.push(currentPath);
            if (pages.length > 10) {
                pages = pages.slice(-10);
            }
            sessionStorage.setItem(this.pagesKey, JSON.stringify(pages));
        }

        return pages;
    }

    trackScrollDepth() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = Math.round((scrollTop / docHeight) * 100);

            if (scrollPercent > this.maxScrollDepth) {
                this.maxScrollDepth = scrollPercent;
            }
        });
    }

    getPageLoadTime() {
        // Use Performance API if available
        if (window.performance && window.performance.timing) {
            window.addEventListener('load', () => {
                const timing = window.performance.timing;
                this.pageLoadTime = timing.loadEventEnd - timing.navigationStart;
            });
        }
    }

    getBrowserInfo() {
        return {
            language: navigator.language || navigator.userLanguage || null,
            platform: navigator.platform || null,
            cookies_enabled: navigator.cookieEnabled,
            do_not_track: navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes',
            connection_type: this.getConnectionType()
        };
    }

    getConnectionType() {
        // Use Network Information API if available
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return connection.effectiveType || connection.type || null;
        }
        return null;
    }

    getScreenInfo() {
        return {
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            viewport_width: window.innerWidth,
            viewport_height: window.innerHeight
        };
    }

    attachClickHandlers() {
        // Find all Dokicasa links
        const dokicasaLinks = document.querySelectorAll('a[href*="dokicasa.it"]');

        dokicasaLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.clicksOnPage++;

                // Get CTA location from data attribute or infer
                const ctaLocation = link.dataset.ctaLocation || this.inferCtaLocation(link);

                // Track and then navigate
                this.trackClick(ctaLocation, link.href);
            });
        });

        console.log('[DokicasaTracking] Attached handlers to', dokicasaLinks.length, 'links');
    }

    inferCtaLocation(link) {
        // Try to infer location based on element context
        const parent = link.closest('section, aside, article, .cta-card, .info-box');

        if (parent) {
            if (parent.classList.contains('sidebar-cta') || parent.classList.contains('cta-card')) {
                return 'sidebar';
            }
            if (parent.classList.contains('article-hero') || parent.closest('.article-hero')) {
                return 'hero';
            }
            if (parent.tagName === 'ARTICLE' || parent.classList.contains('article-content')) {
                return 'article-inline';
            }
        }

        return 'unknown';
    }

    async trackClick(ctaLocation, destinationUrl) {
        const utmParams = this.getUTMParams();
        const pagesVisited = JSON.parse(sessionStorage.getItem(this.pagesKey) || '[]');
        const browserInfo = this.getBrowserInfo();
        const screenInfo = this.getScreenInfo();

        const trackingData = {
            // Session & page
            session_id: this.getSessionId(),
            landing_page: this.landingPage,
            cta_location: ctaLocation,
            referrer: document.referrer || null,

            // UTM params
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            utm_term: utmParams.utm_term,
            utm_content: utmParams.utm_content,

            // Screen & viewport
            screen_width: screenInfo.screen_width,
            screen_height: screenInfo.screen_height,
            viewport_width: screenInfo.viewport_width,
            viewport_height: screenInfo.viewport_height,

            // User agent
            user_agent: navigator.userAgent,

            // Behavior
            time_on_page_ms: Date.now() - this.startTime,
            scroll_depth_percent: this.maxScrollDepth,
            pages_before: pagesVisited.slice(0, -1),
            clicks_on_page: this.clicksOnPage,

            // Browser info
            language: browserInfo.language,
            platform: browserInfo.platform,
            cookies_enabled: browserInfo.cookies_enabled,
            do_not_track: browserInfo.do_not_track,
            connection_type: browserInfo.connection_type,
            page_load_time_ms: this.pageLoadTime
        };

        console.log('[DokicasaTracking] Tracking click', trackingData);

        // Use sendBeacon for reliable delivery
        const sent = navigator.sendBeacon(this.apiUrl, JSON.stringify(trackingData));

        if (!sent) {
            // Fallback to fetch with keepalive
            try {
                await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trackingData),
                    keepalive: true
                });
            } catch (err) {
                console.error('[DokicasaTracking] Failed to track click', err);
            }
        }

        // Small delay to ensure tracking completes, then open link
        setTimeout(() => {
            window.open(destinationUrl, '_blank', 'noopener');
        }, 100);
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.dokicasaTracking = new DokicasaTracking();
    window.dokicasaTracking.init();
});
