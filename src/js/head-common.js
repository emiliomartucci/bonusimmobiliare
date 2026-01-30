/**
 * Head Common - Injects favicon, meta tags, and analytics
 * v1.3.0 - 2026-01-30
 *
 * Include this script in <head> to automatically add:
 * - Favicons (light/dark mode)
 * - Apple touch icon
 * - Web manifest
 * - Theme color
 * - Google Analytics (deferred to avoid blocking main thread)
 * - Microsoft Clarity (deferred)
 */

(function() {
    const head = document.head;

    // Favicon tags (sync - small, no blocking)
    const tags = [
        // SVG favicons with dark mode support
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon-light.svg', media: '(prefers-color-scheme: dark)' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon-dark.svg', media: '(prefers-color-scheme: light)' },
        // PNG fallbacks
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png' },
        // Apple
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' },
        // Manifest
        { rel: 'manifest', href: '/favicon/site.webmanifest' }
    ];

    tags.forEach(attrs => {
        const link = document.createElement('link');
        Object.keys(attrs).forEach(key => link.setAttribute(key, attrs[key]));
        head.appendChild(link);
    });

    // Theme color
    const theme = document.createElement('meta');
    theme.setAttribute('name', 'theme-color');
    theme.setAttribute('content', '#5C6B4A');
    head.appendChild(theme);

    // Google Analytics - deferred to avoid blocking main thread
    function loadGA() {
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XC2BT6R86M';
        head.appendChild(gtagScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-XC2BT6R86M');
    }

    // Microsoft Clarity - deferred to avoid blocking main thread
    function loadClarity() {
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "v9ju903t9e");
    }

    // Load analytics when browser is idle (no long tasks)
    function loadAnalytics() {
        loadGA();
        loadClarity();
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadAnalytics, { timeout: 2000 });
    } else {
        // Fallback: load after window load
        window.addEventListener('load', function() {
            setTimeout(loadAnalytics, 100);
        });
    }
})();
