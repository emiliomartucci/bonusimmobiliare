# Bonus Immobiliare

## Config
- Language: HTML/CSS/JS
- Test: no
- Env Vars: yes
- Env File: .env.example
- Billing: no

## Obiettivo
Blog immobiliare italiano focalizzato su articoli informativi riguardo affitto e compravendita. Target: utenti che cercano informazioni pratiche sul mercato immobiliare italiano.

## Status
- Fase: development
- Ultimo lavoro: 2026-01-20

## Stack
- **Frontend:** HTML5 + CSS3 + Vanilla JS
- **Hosting:** Cloudflare Pages (da configurare)
- **Backend:** Cloudflare Workers + D1 (per form contatti e newsletter)
- **Email:** Da configurare (Brevo o altro)
- **Dominio:** bonusimmobiliare.it

## Brand Identity
- **Colori:** Verde (#2D5A3D), Bianco (#FFFFFF), Verde chiaro (#E8F0E8), Grigio (#555555)
- **Font:** Playfair Display (display), Crimson Pro (body)
- **Stile:** Fresco, moderno, affidabile
- **Tono:** Professionale ma accessibile, informativo

## Deploy
- **Hosting:** Cloudflare Pages (pending)
- **Git-connected:** da configurare
- **Project name:** bonusimmobiliare
- **Source dir:** src/
- **URL Prod:** https://bonusimmobiliare.it (pending)
- **URL Preview:** (pending)

## Struttura Cartelle
```
bonusimmobiliare/
├── src/                    # HTML, CSS, JS sorgente
│   ├── blog/               # Articoli blog
│   ├── assets/             # Immagini e risorse
│   ├── js/                 # JavaScript condiviso
│   └── privacy/            # Privacy policy
├── functions/              # Cloudflare Workers
│   └── api/                # API endpoints
├── docs/                   # Documentazione
├── memory/                 # Handoff sessioni
└── context.md              # Questo file
```

## Features
- [x] Homepage con hero e CTA
- [x] Blog index con filtri e ricerca
- [x] Template articolo blog
- [x] Form contatti (lead capture)
- [x] Newsletter signup
- [ ] Privacy policy
- [ ] Cookie consent
- [ ] SEO (sitemap, robots.txt, llms.txt)

## Todo
- [ ] Creare contenuti reali per gli articoli
- [ ] Configurare Cloudflare Pages
- [ ] Setup D1 database per leads
- [ ] Configurare email marketing (Brevo)
- [ ] Setup dominio bonusimmobiliare.it

## Cambiamenti Recenti
- 2026-01-20: Progetto creato, struttura base implementata

## Blockers
- Nessuno

## Note
- Design ispirato a Oltrepocase ma con palette verde/bianco
- Focus su contenuti informativi per affitto e compravendita
- Stile editoriale, non commerciale aggressivo

---
**Last Update:** 2026-01-20
**Version:** 1.0.0
