# Bonus Immobiliare

## Config
- Language: HTML/CSS/JS
- Test: no
- Env Vars: no (per ora)
- Billing: yes

## Documenti
| Data | Tipo | File | Descrizione |
|------|------|------|-------------|
| 2026-02-01 | plan | docs/plans/2026-02-01-repo-audit-plan.md | Piano fix 21 findings P1+P2 da repo-audit |
| 2026-02-01 | solution | docs/solutions/security-issues/cors-wildcard-api.md | Fix CORS wildcard su API tracking |
| 2026-02-01 | solution | docs/solutions/performance-issues/geojson-file-size.md | Ottimizzazione GeoJSON (11MB a 1.1MB) |
| 2026-02-01 | solution | docs/solutions/code-quality/css-duplication.md | Consolidamento CSS duplicato in 38 file |

## Handoffs
- 2026-01-20: memory/handoff-2026-01-20.md
  Creato sito completo: homepage warm editorial, blog dinamico, slider servizi Dokicasa. Deploy Cloudflare Pages.
- 2026-01-20: memory/handoff-2026-01-20-002.md
  Logo SVG dark/light switching, nuvolette animate hero, navbar semplificata.
- 2026-01-21: memory/handoff-2026-01-21.md
  Serie articoli canone concordato 6 citta (Milano, Roma, Napoli, Torino, Firenze, Bologna) con CTA Dokicasa.
- 2026-01-24: memory/handoff-2026-01-24.md
  Privacy/cookie GDPR, SEO foundation (sitemap, robots), 5 articoli compravendita.
- 2026-01-24: memory/handoff-2026-01-24-b.md
  Favicon dark mode support, head-common.js injection centralizzata.
- 2026-01-24: memory/handoff-2026-01-24-c.md
  6 landing pages canone concordato con SVG custom citta e CTA Dokicasa.
- 2026-01-30: memory/handoff-2026-01-30.md
  Mappa interattiva zone OMI Roma (233 zone Leaflet), ricerca indirizzo, template riutilizzabile.
- 2026-01-30: memory/handoff-2026-01-30-session2.md
  Articolo SEO mappa Roma, template articoli/mappe per altre citta, fix navbar.
- 2026-01-30: memory/handoff-2026-01-30-session3.md
  Mappa Napoli (67 zone OMI), completate tutte 6 mappe interattive.
- 2026-02-01: memory/handoff-2026-02-01.md
  Repo-audit completo (34 findings), piano P1+P2, solutions documentate.

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
- Fase: development (audit completato, piano pronto)
- Ultimo lavoro: 2026-02-01

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
│   │   ├── blog-article.css # CSS condiviso articoli blog
│   │   ├── canone-concordato-{citta}/ # Serie affitto (6)
│   │   ├── mappa-canone-concordato-roma/ # Articolo mappa Roma
│   │   ├── mappa-canone-concordato-milano/ # Articolo mappa Milano
│   │   ├── mappa-canone-concordato-torino/ # Articolo mappa Torino
│   │   ├── mappa-canone-concordato-bologna/ # Articolo mappa Bologna
│   │   ├── mappa-canone-concordato-firenze/ # Articolo mappa Firenze
│   │   ├── mappa-canone-concordato-napoli/  # Articolo mappa Napoli
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
│   │   ├── roma/           # Mappa Roma (233 zone OMI)
│   │   ├── milano/         # Mappa Milano (5 zone concordato)
│   │   ├── torino/         # Mappa Torino (47 zone OMI)
│   │   ├── bologna/        # Mappa Bologna (34 zone OMI)
│   │   ├── firenze/        # Mappa Firenze (34 zone OMI)
│   │   └── napoli/         # Mappa Napoli (67 zone OMI)
│   ├── css/                # CSS condivisi
│   │   └── mappa.css       # Stili condivisi mappe interattive
│   ├── data/               # Dati per mappe e calcolatori
│   │   ├── roma-zone-omi.json      # Valori canone per zona Roma
│   │   ├── roma_omi_zones.geojson  # Poligoni zone OMI Roma
│   │   ├── milano-zone-concordato.json  # Valori canone per zona Milano
│   │   ├── milano_concordato_zones.geojson  # Poligoni zone Milano
│   │   ├── torino-zone-omi.json         # Valori canone per zona Torino
│   │   ├── torino_omi_zones.geojson     # Poligoni zone OMI Torino
│   │   ├── bologna-zone-concordato.json     # Valori canone zone concordato Bologna
│   │   ├── bologna_zone_concordato.geojson  # Poligoni zone concordato Bologna (Open Data)
│   │   ├── firenze-zone-omi.json        # Valori canone per zona Firenze
│   │   ├── firenze_omi_zones.geojson    # Poligoni zone OMI Firenze
│   │   ├── napoli-zone-omi.json         # Valori canone per zona Napoli
│   │   └── napoli_omi_zones.geojson     # Poligoni zone OMI Napoli
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
- [x] Mappa interattiva zone canone concordato Milano (5 zone + GeoJSON da GIS Portal Comune)
- [x] Articolo SEO mappa canone concordato Milano (/blog/mappa-canone-concordato-milano/)
- [x] CSS condivisi per blog (blog-article.css) e mappe (mappa.css)
- [x] Mappa Milano con 7 zone hinterland Città Metropolitana (130 comuni)
- [x] Mappa interattiva zone OMI Torino (47 zone, 4 aree: Centro, Semicentro, Periferia, Collina)
- [x] Articolo SEO mappa canone concordato Torino (/blog/mappa-canone-concordato-torino/)
- [x] Mappa interattiva zone concordato Bologna (3 zone ufficiali da Open Data Città Metropolitana)
- [x] Articolo SEO mappa canone concordato Bologna (/blog/mappa-canone-concordato-bologna/)
- [x] Mappa interattiva zone OMI Firenze (34 zone, 5 tipologie: Centro, Semicentro, Periferia, Suburbana, Rurale)
- [x] Articolo SEO mappa canone concordato Firenze (/blog/mappa-canone-concordato-firenze/)
- [x] Mappa interattiva zone OMI Napoli (67 zone, 5 tipologie: Centro, Semicentro, Periferia, Suburbana, Rurale)
- [x] Articolo SEO mappa canone concordato Napoli (/blog/mappa-canone-concordato-napoli/)

## Todo (v2)
✅ Completato

## Todo (v3)
- [x] Mappa Torino (47 zone OMI)
- [x] Mappa Bologna (34 zone OMI)
- [x] Mappa Firenze (34 zone OMI)
- [x] Mappa Napoli (67 zone OMI)
- [ ] Calcolatori interattivi

## Repo Audit (2026-02-01)

**Report:** [docs/AUDIT-REPORT-2026-02-01.md](docs/AUDIT-REPORT-2026-02-01.md)
**Piano:** [docs/plans/2026-02-01-repo-audit-plan.md](docs/plans/2026-02-01-repo-audit-plan.md)

### Findings Summary
- **P1 Critical:** 9 (security, performance, code quality)
- **P2 High:** 12 (GDPR, error handling, duplications)
- **P3 Medium:** 13 (fuori scope attuale)

### Priority Fixes (P1+P2) - IMPLEMENTED
- [x] Security: CORS whitelist, input validation, error handling
- [x] Performance: GeoJSON simplify (11MB→1.1MB), font preconnect
- [x] Code: design-system.css, blog error UI, DEBUG flag
- [x] Data: NOT NULL timestamp, IP anonymization

### Solutions Documentate
- `docs/solutions/security-issues/cors-wildcard-api.md`
- `docs/solutions/performance-issues/geojson-file-size.md`
- `docs/solutions/code-quality/css-duplication.md`

## Cambiamenti Recenti
- 2026-02-01: Rimosso bologna_concordato_zones.geojson non usato (14MB → 0)
- 2026-02-01: Implementato piano repo-audit (10 task P1+P2 completati)
- 2026-02-01: API security hardening (CORS whitelist, input validation, IP anonymization)
- 2026-02-01: GeoJSON Bologna ottimizzato (11MB→1.1MB con mapshaper)
- 2026-02-01: design-system.css creato, font preconnect aggiunto
- 2026-02-01: Blog error handling, DEBUG flag in tracking.js
- 2026-02-01: Repo audit completo con 34 findings (9 P1, 12 P2, 13 P3)
- 2026-01-31: Fix mappa Bologna con zone concordato ufficiali (Open Data Città Metropolitana)
- 2026-01-31: Aggiunta disclaimer su mappe Torino, Firenze, Napoli (zone OMI != zone concordato)
- 2026-01-30: Mappa interattiva zone OMI Napoli (67 zone, Accordo 2025, 5 tipologie)
- 2026-01-30: Articolo SEO mappa canone concordato Napoli
- 2026-01-30: Mappa interattiva zone OMI Firenze (34 zone, Accordo 25/06/2020, 5 tipologie)
- 2026-01-30: Articolo SEO mappa canone concordato Firenze
- 2026-01-30: Mappa interattiva zone OMI Bologna (34 zone, Accordo 27/03/2024, 5 aree)
- 2026-01-30: Articolo SEO mappa canone concordato Bologna
- 2026-01-30: Mappa interattiva zone OMI Torino (47 zone, Accordo 15/04/2024, 4 aree)
- 2026-01-30: Articolo SEO mappa canone concordato Torino
- 2026-01-30: Mappa Milano con layer hinterland (7 zone omogenee Città Metropolitana, 130 comuni)
- 2026-01-30: Mappa interattiva Milano (5 zone concordato + GeoJSON da GIS Portal Comune Milano)
- 2026-01-30: Articolo SEO mappa canone concordato Milano
- 2026-01-30: CSS condivisi: blog-article.css e mappa.css (refactoring per riusabilità)
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
**Last Update:** 2026-02-01
**Version:** 2.6.0
