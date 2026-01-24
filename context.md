# Bonus Immobiliare

## Config
- Language: HTML/CSS/JS
- Test: no
- Env Vars: no (per ora)
- Billing: yes

## Billing
- Total: 109.65 EUR
- Your Time: 56.50 EUR (1h 53m)
- AI Cost: 53.15 EUR
- Entries: 1
- Last Entry: 2026-01-21
- CSV: billing/entries.csv

## Obiettivo
Blog immobiliare italiano focalizzato su articoli informativi riguardo affitto e compravendita. Target: utenti che cercano informazioni pratiche sul mercato immobiliare italiano.

## Status
- Fase: development
- Ultimo lavoro: 2026-01-24

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
- **URL Custom:** https://bonusimmobiliare.it

## Struttura Cartelle
```
bonusimmobiliare/
├── src/                    # HTML, CSS, JS sorgente
│   ├── index.html          # Homepage
│   ├── sitemap.xml         # Sitemap SEO
│   ├── robots.txt          # Robots SEO
│   ├── llms.txt            # AI-readable site description
│   ├── blog/               # Blog section
│   │   ├── index.html      # Blog listing (dynamic)
│   │   ├── _template.html  # Article template
│   │   ├── articles.json   # Articles manifest
│   │   ├── canone-concordato-{citta}/ # Serie affitto (6)
│   │   ├── caparra-confirmatoria-penitenziale/
│   │   ├── clausola-sospensiva-mutuo/
│   │   ├── compromesso-notaio-agenzia/
│   │   ├── proposta-acquisto-vincolante/
│   │   └── mutuo-negato-cosa-fare/
│   ├── servizi/            # Services slider
│   ├── privacy/            # Privacy policy GDPR
│   ├── cookie/             # Cookie policy
│   ├── logo/               # Logo assets (SVG)
│   └── js/                 # JavaScript
│       ├── blog.js         # Dynamic blog loader
│       └── cookie-consent.js # Cookie consent banner
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
- [x] Serie articoli canone concordato (6 città: Milano, Roma, Napoli, Torino, Firenze, Bologna)
- [x] Privacy policy GDPR-compliant (/privacy/)
- [x] Cookie policy e consent banner (/cookie/, js/cookie-consent.js)
- [x] SEO files (sitemap.xml, robots.txt, llms.txt)
- [x] Serie articoli compravendita (5 articoli: caparra, clausola sospensiva, compromesso, proposta acquisto, mutuo negato)

## Todo (v2)
- [ ] Setup D1 database per leads

## Todo (v3)
- [ ] Calcolatori interattivi

## Cambiamenti Recenti
- 2026-01-24: Privacy policy, cookie policy e consent banner GDPR
- 2026-01-24: SEO files (sitemap.xml, robots.txt, llms.txt)
- 2026-01-24: 5 articoli compravendita (caparra, clausola sospensiva, compromesso, proposta acquisto, mutuo negato)
- 2026-01-24: Dominio bonusimmobiliare.it configurato con nameserver Cloudflare
- 2026-01-21: Serie articoli canone concordato per città (Milano, Roma, Napoli, Torino, Firenze, Bologna) con CTA Dokicasa
- 2026-01-21: articles.json aggiornato con 6 nuovi articoli e sezione "series"
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
**Last Update:** 2026-01-24
**Version:** 1.8.0
