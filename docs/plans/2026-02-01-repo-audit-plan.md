# Bonusimmobiliare Improvement Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Risolvere 21 findings (P1 + P2) emersi da repo-audit per migliorare sicurezza, performance, e manutenibilità.

**Architecture:** Static site HTML/CSS/JS con Cloudflare Workers API. Focus su: consolidamento CSS, hardening API, ottimizzazione GeoJSON.

**Tech Stack:** HTML5, CSS3, Vanilla JS, Cloudflare Pages, Cloudflare Workers, D1 Database

**Findings Addressed:** P1: 9, P2: 12

---

## PHASE 1: Security Hardening (Critical)

### Task 1: Remove CORS Wildcard from API

**Severity:** P1
**Files:**
- Modify: `functions/api/dokicasa-click.js:14-19`
- Modify: `functions/api/dokicasa-click.js:104-108`

**Step 1: Review current CORS config**
L'API tracking usa CORS wildcard (`*`) che permette a qualsiasi sito di chiamare l'endpoint.

**Step 2: Update corsHeaders to whitelist specific domains**
```javascript
// functions/api/dokicasa-click.js:14-19
const ALLOWED_ORIGINS = [
    'https://bonusimmobiliare.it',
    'https://www.bonusimmobiliare.it',
    'https://bonusimmobiliare.pages.dev'
];

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
```

**Step 3: Update OPTIONS handler**
```javascript
// functions/api/dokicasa-click.js:101-110
export async function onRequestOptions(context) {
    const corsHeaders = getCorsHeaders(context.request);
    return new Response(null, {
        status: 204,
        headers: corsHeaders
    });
}
```

**Step 4: Update all Response calls to use getCorsHeaders(request)**

**Step 5: Test locally**
```bash
npx wrangler dev
curl -X OPTIONS https://localhost:8788/api/dokicasa-click -H "Origin: https://evil.com" -v
# Expect: Access-Control-Allow-Origin: https://bonusimmobiliare.it (not evil.com)
```

**Step 6: Commit**
```bash
git add functions/api/dokicasa-click.js
git commit -m "fix(security): restrict CORS to allowed origins

Removes wildcard CORS that allowed any site to call tracking API.
Now only bonusimmobiliare.it and .pages.dev preview are allowed.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Add Input Validation with Range Checks

**Severity:** P1
**Files:**
- Modify: `functions/api/dokicasa-click.js:24-30`

**Step 1: Add validateInput function**
```javascript
// After line 9, add:
function validateInput(data) {
    const errors = [];

    // Required fields
    if (!data.session_id || typeof data.session_id !== 'string') {
        errors.push('session_id is required and must be string');
    }
    if (!data.landing_page || typeof data.landing_page !== 'string') {
        errors.push('landing_page is required and must be string');
    }

    // Length limits (prevent oversized payloads)
    if (data.session_id && data.session_id.length > 100) {
        errors.push('session_id too long (max 100)');
    }
    if (data.landing_page && data.landing_page.length > 500) {
        errors.push('landing_page too long (max 500)');
    }
    if (data.user_agent && data.user_agent.length > 500) {
        errors.push('user_agent too long (max 500)');
    }

    // Numeric range validation
    if (data.scroll_depth_percent !== undefined && data.scroll_depth_percent !== null) {
        const scroll = Number(data.scroll_depth_percent);
        if (isNaN(scroll) || scroll < 0 || scroll > 100) {
            errors.push('scroll_depth_percent must be 0-100');
        }
    }
    if (data.time_on_page_ms !== undefined && data.time_on_page_ms !== null) {
        const time = Number(data.time_on_page_ms);
        if (isNaN(time) || time < 0 || time > 3600000) { // max 1 hour
            errors.push('time_on_page_ms must be 0-3600000');
        }
    }
    if (data.clicks_on_page !== undefined && data.clicks_on_page !== null) {
        const clicks = Number(data.clicks_on_page);
        if (isNaN(clicks) || clicks < 0 || clicks > 1000) {
            errors.push('clicks_on_page must be 0-1000');
        }
    }

    // Sanitize HTML characters in text fields
    const htmlChars = /[<>"']/;
    if (data.referrer && htmlChars.test(data.referrer)) {
        data.referrer = data.referrer.replace(/[<>"']/g, '');
    }
    if (data.cta_location && htmlChars.test(data.cta_location)) {
        data.cta_location = data.cta_location.replace(/[<>"']/g, '');
    }

    return errors.length > 0 ? errors : null;
}
```

**Step 2: Call validation in onRequestPost**
```javascript
// After line 22, replace validation block:
const validationErrors = validateInput(data);
if (validationErrors) {
    return new Response(
        JSON.stringify({ error: 'Validation failed', details: validationErrors }),
        { status: 400, headers: getCorsHeaders(request) }
    );
}
```

**Step 3: Test with invalid data**
```bash
curl -X POST https://localhost:8788/api/dokicasa-click \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","landing_page":"/","scroll_depth_percent":150}'
# Expect: 400 with validation error
```

**Step 4: Commit**
```bash
git add functions/api/dokicasa-click.js
git commit -m "fix(security): add input validation with range checks

- Validates required fields and types
- Limits string lengths to prevent oversized payloads
- Validates numeric ranges (scroll 0-100, time 0-3600000)
- Sanitizes HTML characters from text fields

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Remove Error Details from Response

**Severity:** P2
**Files:**
- Modify: `functions/api/dokicasa-click.js:92-96`

**Step 1: Update error response to not leak details**
```javascript
// functions/api/dokicasa-click.js:92-97
console.error('Error tracking click:', error);
return new Response(
    JSON.stringify({ error: 'Unable to process request', code: 'TRACKING_ERROR' }),
    { status: 500, headers: getCorsHeaders(request) }
);
```

**Step 2: Commit**
```bash
git add functions/api/dokicasa-click.js
git commit -m "fix(security): remove error details from API response

Error messages no longer expose internal details to client.
Full errors still logged server-side for debugging.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Add NOT NULL Constraint to Timestamp

**Severity:** P1
**Files:**
- Modify: `src/scripts/schema.sql:10`

**Step 1: Update schema**
```sql
-- src/scripts/schema.sql:10
timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
```

**Step 2: Create migration script**
```sql
-- src/scripts/migrations/001-timestamp-not-null.sql
-- Fix existing NULL timestamps (if any)
UPDATE dokicasa_clicks
SET timestamp = CURRENT_TIMESTAMP
WHERE timestamp IS NULL;

-- Note: D1 doesn't support ALTER COLUMN for constraints
-- Need to recreate table for production fix
```

**Step 3: Commit**
```bash
git add src/scripts/schema.sql src/scripts/migrations/
git commit -m "fix(data): add NOT NULL constraint to timestamp column

Prevents NULL timestamps from corrupting temporal analytics.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Anonymize IP Address

**Severity:** P2 (GDPR)
**Files:**
- Modify: `functions/api/dokicasa-click.js:33,64`

**Step 1: Add anonymizeIP function**
```javascript
// After getDeviceType function:
function anonymizeIP(ip) {
    if (!ip) return null;

    // IPv4: 192.168.1.100 -> 192.168.1.0
    if (ip.includes('.')) {
        const parts = ip.split('.');
        parts[3] = '0';
        return parts.join('.');
    }

    // IPv6: mask last 80 bits
    if (ip.includes(':')) {
        const parts = ip.split(':');
        return parts.slice(0, 3).join(':') + '::';
    }

    return null;
}
```

**Step 2: Use anonymized IP in insert**
```javascript
// Line 64:
ip: anonymizeIP(ip),
```

**Step 3: Commit**
```bash
git add functions/api/dokicasa-click.js
git commit -m "fix(privacy): anonymize IP address for GDPR compliance

Masks last octet of IPv4 and last 80 bits of IPv6.
Maintains country/city analytics while protecting user privacy.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## PHASE 2: Performance Optimization

### Task 6: Simplify GeoJSON Files with Mapshaper

**Severity:** P1
**Files:**
- Modify: `src/data/bologna_concordato_zones.geojson` (11MB -> ~1MB)
- Modify: `Milano/italy_comuni.geojson` (36MB -> move to raw data, not deploy)

**Step 1: Install mapshaper**
```bash
npm install -g mapshaper
```

**Step 2: Simplify Bologna GeoJSON (target 90% reduction)**
```bash
cd "/Users/emiliomartucci/Desktop/EMI AI/projects-personal/bonusimmobiliare"
mapshaper src/data/bologna_concordato_zones.geojson \
  -simplify 10% keep-shapes \
  -o src/data/bologna_concordato_zones.geojson force
```

**Step 3: Verify file size reduction**
```bash
ls -lh src/data/bologna_concordato_zones.geojson
# Target: < 1.5MB
```

**Step 4: Move italy_comuni.geojson out of deploy**
```bash
# This 36MB file should not be in src/
mv Milano/italy_comuni.geojson raw_data/italy_comuni.geojson
echo "raw_data/" >> .gitignore
```

**Step 5: Test map still works**
```bash
npx wrangler pages dev src
# Open http://localhost:8788/mappe/bologna/ and verify zones render
```

**Step 6: Commit**
```bash
git add src/data/bologna_concordato_zones.geojson .gitignore
git commit -m "perf: simplify GeoJSON files (90% size reduction)

- Bologna zones: 11MB -> ~1MB (mapshaper 10% simplify)
- Moved italy_comuni.geojson (36MB) out of deploy directory
- Map visual quality maintained with keep-shapes option

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Add Font Preload for Non-Blocking Load

**Severity:** P2
**Files:**
- Modify: `src/js/head-common.js`

**Step 1: Add preconnect hints**
```javascript
// src/js/head-common.js - add after line 3:
// Preconnect to Google Fonts (non-blocking)
const preconnects = [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
];

preconnects.forEach(attrs => {
    const link = document.createElement('link');
    Object.keys(attrs).forEach(key => {
        if (key === 'crossorigin') {
            link.setAttribute('crossorigin', '');
        } else {
            link.setAttribute(key, attrs[key]);
        }
    });
    head.appendChild(link);
});
```

**Step 2: Commit**
```bash
git add src/js/head-common.js
git commit -m "perf: add font preconnect for faster font loading

Adds preconnect hints for fonts.googleapis.com and fonts.gstatic.com.
Reduces connection time by ~150ms.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Remove Duplicate GeoJSON Files

**Severity:** P2
**Files:**
- Delete duplicates in city folders, keep src/data/ as source of truth

**Step 1: Verify duplicates**
```bash
md5 Milano/canone_concordato_zones.geojson src/data/milano_concordato_zones.geojson
# Should be identical
```

**Step 2: Update references if any point to city folders**
```bash
grep -r "Milano/canone_concordato" src/
# Verify no references to city folder versions
```

**Step 3: Move city folders to raw_data (not deployed)**
```bash
mv Milano Bologna Napoli Roma Torino Firenze raw_data/
# These contain source/working files, not production data
```

**Step 4: Update .gitignore**
```bash
echo "raw_data/" >> .gitignore
```

**Step 5: Commit**
```bash
git add .gitignore
git rm -r --cached Milano Bologna Napoli Roma Torino Firenze 2>/dev/null || true
git commit -m "refactor: consolidate GeoJSON to src/data/, move source files to raw_data

- src/data/ is single source of truth for production GeoJSON
- City folders (Milano, Bologna, etc.) moved to raw_data/ (not deployed)
- Eliminates 5MB+ of duplicate files from deploy

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## PHASE 3: Code Quality

### Task 9: Extract Design System to External CSS

**Severity:** P1
**Files:**
- Create: `src/css/design-system.css`
- Modify: All HTML files to use external CSS

**Step 1: Create design-system.css with shared variables**
```css
/* src/css/design-system.css */
/* v1.0.0 - 2026-02-01 */
/* Extracted from inline styles for maintainability */

:root {
    /* Primary */
    --olive: #5C6B4A;
    --olive-deep: #4A573C;
    --olive-light: #7A8B68;
    --cream: #FAF7F2;
    --cream-dark: #F5F0E8;
    --terracotta: #F06543;
    --terracotta-dark: #D94E2E;

    /* Secondary */
    --gold: #BFA67A;
    --sage: #D4DEC9;
    --stone: #DAD7CD;
    --bark: #4A3F35;

    /* Neutrals */
    --gray-100: #F8F9FA;
    --gray-200: #E9ECEF;
    --gray-300: #DEE2E6;
    --gray-400: #CED4DA;
    --gray-500: #ADB5BD;
    --gray-600: #6C757D;
    --gray-700: #495057;
    --gray-800: #343A40;
    --gray-900: #212529;

    /* Spacing */
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    --space-lg: 1.5rem;
    --space-xl: 2rem;
    --space-2xl: 3rem;
    --space-3xl: 4rem;

    /* Typography */
    --font-display: 'Fraunces', Georgia, serif;
    --font-body: 'Source Serif 4', Georgia, serif;
    --font-mono: 'SF Mono', Monaco, monospace;

    /* Borders */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
}

/* Reset */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
}

body {
    font-family: var(--font-body);
    background: var(--cream);
    color: var(--gray-800);
    line-height: 1.6;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 500;
    line-height: 1.2;
    color: var(--olive-deep);
}

a {
    color: var(--olive);
    text-decoration: none;
    transition: color var(--transition-fast);
}

a:hover {
    color: var(--terracotta);
}
```

**Step 2: Update one file as example (index.html)**
```html
<!-- Remove inline <style> with :root variables -->
<!-- Add in <head>: -->
<link rel="stylesheet" href="/css/design-system.css">
```

**Step 3: Note - This is a large refactor, do incrementally**
Due to 38 files with inline CSS, recommend:
1. Create design-system.css (this task)
2. Update new files to use it
3. Migrate existing files in future sprints

**Step 4: Commit**
```bash
git add src/css/design-system.css
git commit -m "feat: create centralized design-system.css

Extracts CSS variables and reset from inline styles.
New files should use <link rel='stylesheet' href='/css/design-system.css'>
Existing files will be migrated incrementally.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Add Error Handling Fallback to Blog Loader

**Severity:** P1
**Files:**
- Modify: `src/js/blog.js:32-34`

**Step 1: Add fallback UI method**
```javascript
// After updateArticleCount method, add:
showLoadError() {
    const container = document.querySelector(this.articlesContainer);
    if (container) {
        container.innerHTML = `
            <div class="load-error" style="text-align: center; padding: 2rem;">
                <p style="color: var(--gray-600);">
                    Impossibile caricare gli articoli.
                    <a href="javascript:location.reload()">Riprova</a>
                </p>
            </div>
        `;
    }
}
```

**Step 2: Update init error handling**
```javascript
// src/js/blog.js:32-34
} catch (error) {
    console.error('Errore caricamento articoli:', error);
    this.showLoadError();
}
```

**Step 3: Add JSON parse error handling**
```javascript
// src/js/blog.js:42-44
try {
    const data = await response.json();
    this.articles = data.articles || [];
    this.categories = data.categories || [];
} catch (parseError) {
    console.error('Errore parsing JSON:', parseError);
    throw new Error('Formato dati non valido');
}
```

**Step 4: Commit**
```bash
git add src/js/blog.js
git commit -m "fix: add error handling fallback in blog loader

Shows user-friendly error message if articles.json fails to load.
Prevents white page on network or parse errors.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 11: Remove console.log from Production Code

**Severity:** P2
**Files:**
- Modify: `src/js/dokicasa-tracking.js`

**Step 1: Add debug flag**
```javascript
// src/js/dokicasa-tracking.js:1
const DEBUG = false; // Set true for development
```

**Step 2: Wrap all console.log in debug check**
```javascript
// Replace all console.log with:
if (DEBUG) console.log('[DokicasaTracking] ...');
```

**Step 3: Commit**
```bash
git add src/js/dokicasa-tracking.js
git commit -m "refactor: add debug flag to disable console.log in production

Sets DEBUG=false by default to prevent tracking data exposure in console.
Set DEBUG=true for local development debugging.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 12: Replace alert() with Toast Notification

**Severity:** P2
**Files:**
- Modify: `src/index.html` (newsletter form handler)

**Step 1: Add toast CSS to design-system.css**
```css
/* Add to src/css/design-system.css */
.toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: var(--olive-deep);
    color: white;
    padding: 1rem 2rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.toast.show {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
}

.toast.success {
    background: var(--olive);
}

.toast.error {
    background: var(--terracotta);
}
```

**Step 2: Add toast function to head-common.js**
```javascript
// Add showToast function
window.showToast = function(type, message, duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
};
```

**Step 3: Update newsletter handler in index.html**
```javascript
// Replace alert() with:
showToast('success', 'Grazie per l\'iscrizione! Ti terremo aggiornato.');
```

**Step 4: Commit**
```bash
git add src/css/design-system.css src/js/head-common.js src/index.html
git commit -m "refactor: replace alert() with toast notifications

Adds non-blocking toast notification system.
Better UX than browser alert dialogs.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 13: Fix Missing Article Directory

**Severity:** P2
**Files:**
- Modify: `src/blog/articles.json`

**Step 1: Check if canone-concordato article exists**
```bash
ls -la src/blog/canone-concordato/
# If missing, remove from articles.json
```

**Step 2: Remove orphan entry from articles.json OR create directory**
Option A: Remove from JSON if article was deleted intentionally
Option B: Create directory if article should exist

**Step 3: Create CI verification script**
```javascript
// scripts/verify-articles.js
const fs = require('fs');
const path = require('path');

const articlesPath = './src/blog/articles.json';
const blogDir = './src/blog';

const data = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
const slugs = data.articles.map(a => a.slug);

const errors = [];
slugs.forEach(slug => {
    const dir = path.join(blogDir, slug);
    if (!fs.existsSync(dir) || !fs.existsSync(path.join(dir, 'index.html'))) {
        errors.push(`Missing: ${slug}`);
    }
});

if (errors.length > 0) {
    console.error('Article verification failed:');
    errors.forEach(e => console.error('  - ' + e));
    process.exit(1);
}

console.log('All articles verified');
```

**Step 4: Commit**
```bash
git add src/blog/articles.json scripts/verify-articles.js
git commit -m "fix(data): sync articles.json with existing directories

Removes orphan entries and adds verification script.
Run: node scripts/verify-articles.js

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## PHASE 4: Minor Improvements

### Task 14: Add Magic Number Constants

**Severity:** P2
**Files:**
- Modify: `functions/api/dokicasa-click.js:112-117`
- Modify: `src/js/dokicasa-tracking.js`

**Step 1: Add constants for breakpoints**
```javascript
// functions/api/dokicasa-click.js:112
const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024
};

function getDeviceType(screenWidth) {
    if (!screenWidth) return 'unknown';
    if (screenWidth < BREAKPOINTS.MOBILE) return 'mobile';
    if (screenWidth < BREAKPOINTS.TABLET) return 'tablet';
    return 'desktop';
}
```

**Step 2: Commit**
```bash
git add functions/api/dokicasa-click.js
git commit -m "refactor: extract magic numbers to named constants

Improves readability and maintainability.
Breakpoints: MOBILE=768, TABLET=1024

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 15: Add Map Error UI Feedback

**Severity:** P2
**Files:**
- Modify: Map pages error handlers

**Step 1: Add showMapError function**
```javascript
// Add to each map page, or create shared maps-common.js
function showMapError(message) {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;padding:2rem;">
                <div>
                    <p style="color:#6c757d;margin-bottom:1rem;">${message}</p>
                    <button onclick="location.reload()"
                            style="background:var(--olive);color:white;padding:0.5rem 1rem;border:none;border-radius:8px;cursor:pointer;">
                        Ricarica
                    </button>
                </div>
            </div>
        `;
    }
}
```

**Step 2: Update catch blocks**
```javascript
.catch(err => {
    console.error('Errore caricamento dati:', err);
    showMapError('Impossibile caricare la mappa. Controlla la connessione.');
});
```

**Step 3: Commit**
```bash
git add src/mappe/*/index.html
git commit -m "fix(ux): add visual error feedback for map load failures

Shows user-friendly error message with reload button instead of blank map.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Verification Checklist

Before marking plan complete:

- [ ] CORS restricted to allowed origins only
- [ ] Input validation rejects invalid data
- [ ] Error responses don't leak internal details
- [ ] Timestamp column has NOT NULL constraint
- [ ] IP addresses are anonymized
- [ ] GeoJSON files are < 2MB each
- [ ] Font preconnect hints added
- [ ] Duplicate files removed from deploy
- [ ] design-system.css created
- [ ] Blog loader shows error UI on failure
- [ ] console.log wrapped in DEBUG flag
- [ ] alert() replaced with toast
- [ ] articles.json synced with directories
- [ ] Magic numbers extracted to constants
- [ ] Maps show error UI on load failure

---

## Summary

| Phase | Tasks | Priority | Estimated Time |
|-------|-------|----------|----------------|
| Security | 5 | P1/P2 | 2h |
| Performance | 3 | P1/P2 | 1.5h |
| Code Quality | 5 | P1/P2 | 2h |
| Minor | 2 | P2 | 30min |

**Total: 15 tasks, ~6 hours work**

---

**Created:** 2026-02-01
**Author:** Marvis + Claude Opus 4.5
**Version:** 1.0.0
