/**
 * Head Common - Injects favicon, meta tags, and analytics
 * v1.1.0 - 2026-01-24
 *
 * Include this script in <head> to automatically add:
 * - Favicons (light/dark mode)
 * - Apple touch icon
 * - Web manifest
 * - Theme color
 * - Google Analytics (gtag.js)
 */

(function() {
    const head = document.head;

    // Google Analytics (gtag.js)
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XC2BT6R86M';
    head.appendChild(gtagScript);

    const gtagConfig = document.createElement('script');
    gtagConfig.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XC2BT6R86M');
    `;
    head.appendChild(gtagConfig);

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
})();
