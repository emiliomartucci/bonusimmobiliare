/**
 * Dokicasa Click Tracking
 * v1.0.0 - 2026-01-24
 *
 * Tracks clicks on Dokicasa CTA links:
 * - Session ID generation
 * - UTM parameter extraction
 * - Time on page tracking
 * - Scroll depth tracking
 * - Pages visited history
 * - sendBeacon for reliable delivery
 */

class DokicasaTracking {
    constructor() {
        this.apiUrl = '/api/dokicasa-click';
        this.sessionKey = 'bi_session_id';
        this.utmKey = 'bi_utm_params';
        this.pagesKey = 'bi_pages_visited';
        this.startTime = Date.now();
        this.maxScrollDepth = 0;
        this.landingPage = window.location.pathname;
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

    attachClickHandlers() {
        // Find all Dokicasa links
        const dokicasaLinks = document.querySelectorAll('a[href*="dokicasa.it"]');

        dokicasaLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

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

        const trackingData = {
            session_id: this.getSessionId(),
            landing_page: this.landingPage,
            cta_location: ctaLocation,
            referrer: document.referrer || null,
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            utm_term: utmParams.utm_term,
            utm_content: utmParams.utm_content,
            screen_width: window.innerWidth,
            user_agent: navigator.userAgent,
            time_on_page_ms: Date.now() - this.startTime,
            scroll_depth_percent: this.maxScrollDepth,
            pages_before: pagesVisited.slice(0, -1) // Exclude current page
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
