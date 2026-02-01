---
title: GeoJSON Files Troppo Grandi
category: performance-issues
date: 2026-02-01
tags: [bonusimmobiliare, geojson, leaflet, performance, maps]
severity: P1
---

## Problem

File GeoJSON per mappe interattive troppo grandi:
- `bologna_concordato_zones.geojson`: 11MB
- `italy_comuni.geojson`: 36MB

Causa tempi di caricamento inaccettabili su mobile (57s su 4G).

## Impact

- Mobile users abbandonano prima che mappa carichi
- Lighthouse Performance score basso
- Bandwidth costs elevati
- Possibile timeout su connessioni lente

## Root Cause

GeoJSON generati da shapefile/KML senza ottimizzazione. Poligoni con troppi punti per la precisione necessaria.

## Solution

### 1. Simplify con Mapshaper

```bash
npm install -g mapshaper

mapshaper input.geojson \
  -simplify 10% keep-shapes \
  -o output.geojson force
```

Riduzione tipica: 90% (11MB -> 1.1MB)

### 2. Move source files out of deploy

```bash
mv Milano Bologna Napoli Roma Torino Firenze raw_data/
echo "raw_data/" >> .gitignore
```

Solo `src/data/` contiene file production-ready.

### 3. Long-term: Vector Tiles

Per scale maggiori, convertire a PMTiles:

```bash
tippecanoe -o zones.pmtiles input.geojson
```

Carica solo tile visibili, non intero dataset.

## Prevention

- Max 2MB per file GeoJSON in `src/data/`
- CI check per file size limits
- Documentare processo simplify per nuove citta
