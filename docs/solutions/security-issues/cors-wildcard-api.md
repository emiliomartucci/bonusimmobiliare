---
title: CORS Wildcard su API Tracking
category: security-issues
date: 2026-02-01
tags: [bonusimmobiliare, cloudflare-workers, cors, api-security]
severity: P1
---

## Problem

L'API `/api/dokicasa-click` usava CORS wildcard (`Access-Control-Allow-Origin: *`) permettendo a qualsiasi sito web di chiamare l'endpoint.

```javascript
// PROBLEMA
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',  // Wildcard!
    ...
};
```

## Impact

- Qualsiasi sito puo inviare dati falsi di tracking
- Possibile inquinamento database analytics
- Rischio DoS attraverso flooding di richieste
- Nessuna protezione CSRF

## Root Cause

Configurazione CORS troppo permissiva per semplicità durante lo sviluppo. Non aggiornata prima del deploy in produzione.

## Solution

Whitelist dei domini autorizzati:

```javascript
const ALLOWED_ORIGINS = [
    'https://bonusimmobiliare.it',
    'https://www.bonusimmobiliare.it',
    'https://bonusimmobiliare.pages.dev'
];

function getCorsHeaders(request) {
    const origin = request.headers.get('Origin');
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
        ? origin
        : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        ...
    };
}
```

## Prevention

- Review CORS config prima di ogni deploy
- Default a whitelist, mai wildcard in produzione
- Documentare domini autorizzati in context.md
