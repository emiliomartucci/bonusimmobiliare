# Bonus Immobiliare

## Config
- Language: HTML/CSS/JS
- Test: no
- Env Vars: no (per ora)
- Billing: no

## Obiettivo
Blog immobiliare italiano focalizzato su articoli informativi riguardo affitto e compravendita. Target: utenti che cercano informazioni pratiche sul mercato immobiliare italiano.

## Status
- Fase: development
- Ultimo lavoro: 2026-01-20

## Stack
- **Frontend:** HTML5 + CSS3 + Vanilla JS
- **Hosting:** Cloudflare Pages (git-connected)
- **Backend:** Cloudflare Workers (middleware noindex)
- **Email:** Da configurare (v2)
- **Dominio:** bonusimmobiliare.it (da collegare)

## Brand Identity
- **Design System:** [docs/design-system.md](docs/design-system.md)
- **Colori primari:** Verde oliva (#5C6B4A), Cream (#FAF7F2), Terracotta (#F06543)
- **Colori secondari:** Gold (#BFA67A), Sage (#D4DEC9), Stone (#DAD7CD), Bark (#4A3F35)
- **Font display:** Fraunces (serif)
- **Font body:** Source Serif 4 (serif)
- **Stile:** Caldo, editoriale, accogliente
- **Tono:** Professionale ma accessibile, informativo

## Deploy
- **Hosting:** Cloudflare Pages
- **Git-connected:** yes
- **Repo:** github.com/emiliomartucci/bonusimmobiliare
- **Project name:** bonusimmobiliare
- **Source dir:** src/
- **URL Prod:** https://bonusimmobiliare.pages.dev
- **URL Custom:** https://bonusimmobiliare.it (pending)

## Struttura Cartelle
```
bonusimmobiliare/
├── src/                    # HTML, CSS, JS sorgente
│   ├── index.html          # Homepage
│   ├── blog/               # Blog section
│   │   ├── index.html      # Blog listing (dynamic)
│   │   ├── _template.html  # Article template
│   │   └── articles.json   # Articles manifest
│   ├── servizi/            # Services slider
│   │   └── index.html      # Dokicasa partner referral
│   ├── logo/               # Logo assets
│   │   ├── logo_dark_bg.svg    # Icona per sfondo scuro
│   │   ├── logo_light_bg.svg   # Icona per sfondo chiaro
│   │   ├── logo_text_dark.svg  # Testo per sfondo scuro
│   │   └── logo_text_light.svg # Testo per sfondo chiaro
│   └── js/                 # JavaScript
│       └── blog.js         # Dynamic blog loader
├── functions/              # Cloudflare Workers
│   ├── _middleware.ts      # Noindex for .pages.dev
│   └── api/                # API endpoints (future)
├── docs/                   # Documentazione
│   └── design-system.md    # Palette, typography, components
├── memory/                 # Handoff sessioni
└── context.md              # Questo file
```

## Features Implementate
- [x] Homepage con hero e magazine grid
- [x] Blog index con dynamic loading da JSON
- [x] Template articolo blog (TOC, CTA sidebar, FAQ)
- [x] Slider servizi partner Dokicasa
- [x] Newsletter signup (UI only)
- [x] Middleware noindex per preview domains
- [x] Logo SVG con switching dark/light su scroll
- [x] Nuvolette animate fluttuanti nell'hero

## Todo (v2)
- [ ] Creare contenuti reali per gli articoli
- [ ] Setup D1 database per leads
- [ ] Configurare email marketing (Brevo)
- [ ] Setup dominio bonusimmobiliare.it
- [ ] Privacy policy e cookie consent
- [ ] SEO (sitemap, robots.txt, llms.txt)
- [ ] Calcolatori interattivi

## Cambiamenti Recenti
- 2026-01-20: Logo SVG implementati (icona + testo) con switching dark/light
- 2026-01-20: Nuvolette animate aggiunte all'hero
- 2026-01-20: Navbar semplificata, rimossa sezione contatti
- 2026-01-20: Palette aggiornata (terracotta #F06543, stone #DAD7CD)
- 2026-01-20: Progetto creato, homepage, blog, servizi slider, deploy Cloudflare

## Blockers
- Nessuno

## Note
- Design "warm editorial" con palette verde oliva
- Partner integration: Dokicasa (UTM tracking)
- Focus su contenuti informativi per affitto e compravendita

---
**Last Update:** 2026-01-20
**Version:** 1.3.0
