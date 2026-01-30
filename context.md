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
- Ultimo lavoro: 2026-01-30

## Stack
- **Frontend:** HTML5 + CSS3 + Vanilla JS
- **Hosting:** Cloudflare Pages (git-connected)
- **Backend:** Cloudflare Workers (middleware noindex, API tracking)
- **Database:** Cloudflare D1 (bonusimmobiliare-leads)
- **Email:** Da configurare (v3)
- **Dominio:** bonusimmobiliare.it (attivo)

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
│   │   ├── _templates/     # Templates articoli
│   │   │   ├── _template.html  # Template articolo generico
│   │   │   └── mappa-canone-concordato-citta.html
│   │   ├── articles.json   # Articles manifest
│   │   ├── canone-concordato-{citta}/ # Serie affitto (6)
│   │   ├── mappa-canone-concordato-roma/ # Articolo mappa Roma
│   │   ├── caparra-confirmatoria-penitenziale/
│   │   ├── clausola-sospensiva-mutuo/
│   │   ├── compromesso-notaio-agenzia/
│   │   ├── proposta-acquisto-vincolante/
│   │   └── mutuo-negato-cosa-fare/
│   ├── canone-concordato/  # Landing pages calcolatore
│   │   ├── torino/         # Landing Torino (colline SVG)
│   │   ├── milano/         # Landing Milano (skyline SVG)
│   │   ├── firenze/        # Landing Firenze (cupola SVG)
│   │   ├── bologna/        # Landing Bologna (torri SVG)
│   │   ├── napoli/         # Landing Napoli (Vesuvio SVG)
│   │   └── roma/           # Landing Roma (cupole SVG)
│   ├── mappe/              # Mappe interattive zone OMI
│   │   ├── _template.html  # Template mappa per nuove citta
│   │   └── roma/           # Mappa Roma
│   ├── data/               # Dati per mappe e calcolatori
│   │   ├── roma-zone-omi.json      # Valori canone per zona Roma
│   │   └── roma_omi_zones.geojson  # Poligoni zone OMI Roma
│   ├── servizi/            # Services slider
│   ├── privacy/            # Privacy policy GDPR
│   ├── cookie/             # Cookie policy
│   ├── logo/               # Logo assets (SVG)
│   ├── favicon/            # Favicon assets (light/dark)
│   ├── js/                 # JavaScript
│   │   ├── blog.js         # Dynamic blog loader
│   │   ├── cookie-consent.js # Cookie consent banner
│   │   ├── dokicasa-tracking.js # Click tracking
│   │   └── head-common.js  # Centralized head injection
│   └── scripts/            # Database scripts
│       └── schema.sql      # D1 schema
├── functions/              # Cloudflare Workers
│   ├── _middleware.ts      # Noindex for .pages.dev
│   └── api/
│       └── dokicasa-click.js # Click tracking API
├── wrangler.toml           # Cloudflare config (D1 binding)
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
- [x] Serie articoli canone concordato (6 citta: Milano, Roma, Napoli, Torino, Firenze, Bologna)
- [x] Privacy policy GDPR-compliant (/privacy/)
- [x] Cookie policy e consent banner (/cookie/, js/cookie-consent.js)
- [x] SEO files (sitemap.xml, robots.txt, llms.txt)
- [x] Serie articoli compravendita (5 articoli: caparra, clausola sospensiva, compromesso, proposta acquisto, mutuo negato)
- [x] Dokicasa click tracking (D1 database + API + frontend tracking)
- [x] Favicon con supporto dark mode (head-common.js injection)
- [x] Landing pages canone concordato (6 citta con SVG custom e CTA Dokicasa)
- [x] Mappa interattiva zone OMI Roma (Leaflet, 233 zone, ricerca indirizzo)
- [x] Articolo SEO mappa canone concordato Roma (/blog/mappa-canone-concordato-roma/)
- [x] Templates riutilizzabili per mappe e articoli altre citta

## Todo (v2)
✅ Completato

## Todo (v3)
- [ ] Mappe zone OMI altre citta (Milano, Torino, Napoli, Firenze, Bologna)
- [ ] Articoli SEO mappa per ogni citta
- [ ] Calcolatori interattivi

## Cambiamenti Recenti
- 2026-01-30: Articolo SEO mappa canone concordato Roma (keyword: mappa zone omi roma, microzone)
- 2026-01-30: Template articolo mappa per altre citta (src/blog/_templates/)
- 2026-01-30: Template mappa interattiva per altre citta (src/mappe/_template.html)
- 2026-01-30: Mappa interattiva zone OMI Roma con Leaflet (233 zone, ricerca indirizzo, info panel con fasce canone)
- 2026-01-30: Dropdown "Mappe" nella navbar per accesso rapido alle mappe citta
- 2026-01-30: Dati zone OMI estratti da PDF Accordo Territoriale Roma 2023
- 2026-01-24: 6 landing pages canone concordato con SVG custom per ogni citta e CTA Dokicasa
- 2026-01-24: Favicon con dark mode support e head-common.js injection centralizzata
- 2026-01-24: Dokicasa click tracking (D1 schema, API endpoint, frontend tracking)
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
**Last Update:** 2026-01-30
**Version:** 2.2.0
