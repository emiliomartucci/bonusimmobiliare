/**
 * Cookie Consent Banner
 * v1.0.0 - 2026-01-24
 * Lightweight, GDPR-compliant cookie consent for Bonus Immobiliare
 */

(function() {
    'use strict';

    const COOKIE_NAME = 'cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;

    // Check if consent already given
    function hasConsent() {
        return document.cookie.split(';').some(c => c.trim().startsWith(COOKIE_NAME + '='));
    }

    // Get consent value
    function getConsent() {
        const match = document.cookie.match(new RegExp('(^| )' + COOKIE_NAME + '=([^;]+)'));
        return match ? match[2] : null;
    }

    // Set consent cookie
    function setConsent(value) {
        const date = new Date();
        date.setTime(date.getTime() + (COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000));
        document.cookie = COOKIE_NAME + '=' + value + ';expires=' + date.toUTCString() + ';path=/;SameSite=Lax';
    }

    // Remove consent cookie (for preference reset)
    function removeConsent() {
        document.cookie = COOKIE_NAME + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }

    // Create and show banner
    function showBanner() {
        if (hasConsent()) return;

        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <p>Utilizziamo cookie tecnici per garantire il corretto funzionamento del sito.
                   <a href="/cookie/">Scopri di pi\u00f9</a></p>
                <div class="cookie-banner-actions">
                    <button id="cookie-accept" class="cookie-btn cookie-btn-primary">Accetta</button>
                    <button id="cookie-reject" class="cookie-btn cookie-btn-secondary">Rifiuta</button>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: #2A3223;
                color: #FAF7F2;
                padding: 1rem 1.5rem;
                z-index: 99999;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
                animation: slideUp 0.4s ease;
            }
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            .cookie-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1.5rem;
                flex-wrap: wrap;
            }
            .cookie-banner-content p {
                margin: 0;
                font-size: 0.95rem;
                line-height: 1.5;
                flex: 1;
                min-width: 280px;
            }
            .cookie-banner-content a {
                color: #BFA67A;
                text-decoration: underline;
            }
            .cookie-banner-content a:hover {
                color: #D4C4A0;
            }
            .cookie-banner-actions {
                display: flex;
                gap: 0.75rem;
                flex-shrink: 0;
            }
            .cookie-btn {
                padding: 0.6rem 1.25rem;
                border-radius: 9999px;
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                border: none;
                transition: all 0.2s ease;
                font-family: inherit;
            }
            .cookie-btn-primary {
                background: #F06543;
                color: #FAF7F2;
            }
            .cookie-btn-primary:hover {
                background: #F4846A;
                transform: translateY(-1px);
            }
            .cookie-btn-secondary {
                background: transparent;
                color: #FAF7F2;
                border: 1px solid rgba(250, 247, 242, 0.4);
            }
            .cookie-btn-secondary:hover {
                background: rgba(250, 247, 242, 0.1);
                border-color: rgba(250, 247, 242, 0.6);
            }
            @media (max-width: 600px) {
                #cookie-banner { padding: 1rem; }
                .cookie-banner-content { flex-direction: column; text-align: center; }
                .cookie-banner-actions { width: 100%; justify-content: center; }
            }
        `;
        document.head.appendChild(style);

        // Event listeners
        document.getElementById('cookie-accept').addEventListener('click', function() {
            setConsent('accepted');
            hideBanner();
        });

        document.getElementById('cookie-reject').addEventListener('click', function() {
            setConsent('rejected');
            hideBanner();
        });
    }

    // Hide banner
    function hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.animation = 'slideDown 0.3s ease forwards';
            const slideDownStyle = document.createElement('style');
            slideDownStyle.textContent = `
                @keyframes slideDown {
                    from { transform: translateY(0); opacity: 1; }
                    to { transform: translateY(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(slideDownStyle);
            setTimeout(() => banner.remove(), 300);
        }
    }

    // Reset consent (expose globally for cookie settings page)
    window.resetCookieConsent = function() {
        removeConsent();
        showBanner();
    };

    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBanner);
    } else {
        showBanner();
    }
})();
