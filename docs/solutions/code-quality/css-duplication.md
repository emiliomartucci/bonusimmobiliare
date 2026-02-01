---
title: CSS Massivo Duplicato in HTML Files
category: code-quality
date: 2026-02-01
tags: [bonusimmobiliare, css, maintainability, design-system]
severity: P1
---

## Problem

38 file HTML contengono CSS inline identico (~700 righe ciascuno):
- Design system variables (`:root`)
- CSS reset
- Component styles (header, footer, buttons)

Totale: ~25,000 LOC duplicati.

## Impact

- Modifica colore richiede edit su 38 file
- Rischio inconsistenza tra pagine
- Browser non puo cachare CSS
- Bundle size aumentato inutilmente

## Root Cause

Sviluppo senza build system. Copy-paste di styles tra pagine per velocita iniziale.

## Solution

### 1. Creare design-system.css

```css
/* src/css/design-system.css */
:root {
    --olive: #5C6B4A;
    --cream: #FAF7F2;
    --terracotta: #F06543;
    /* ... */
}

*, *::before, *::after {
    box-sizing: border-box;
}
/* ... reset e base styles */
```

### 2. Aggiornare HTML files

```html
<!-- Rimuovere <style> inline -->
<!-- Aggiungere: -->
<link rel="stylesheet" href="/css/design-system.css">
<link rel="stylesheet" href="/css/blog-article.css"> <!-- se blog -->
```

### 3. Migrazione incrementale

1. Creare design-system.css (fatto)
2. Nuovi file usano external CSS
3. Migrare file esistenti in batch

## Prevention

- Template con external CSS references
- Considerare SSG (Astro, 11ty) per progetti futuri
- CI lint per inline styles > 50 righe
