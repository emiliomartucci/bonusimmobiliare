# Handoff 2026-01-30 (Session 2)

## Summary
Completata creazione articolo SEO per mappa canone concordato Roma. Creati template riutilizzabili per articoli e mappe delle altre città. Fix navbar duplicata. Dati GeoJSON e PDF accordi territoriali già presenti per tutte le città.

## Cosa è cambiato
- `src/blog/mappa-canone-concordato-roma/index.html`: Nuovo articolo SEO (keywords: mappa canone concordato roma, mappa zone omi roma)
- `src/blog/_templates/mappa-canone-concordato-citta.html`: Template articolo per altre città
- `src/blog/_templates/_template.html`: Spostato da src/blog/
- `src/mappe/_template.html`: Template mappa già esistente
- `context.md`: Aggiornato con nuova struttura e todo v3
- `~/.claude/commands/new-article.md`: Aggiornato per leggere path template da context.md

## Decisioni Prese
- **Navbar:** Rimosso link duplicato "Servizi", sostituito con "Mappa Roma" contestuale all'articolo
- **Info box:** Rimosso dettaglio tecnico su Nominatim, utente non interessato
- **Templates in _templates/:** Consolidati tutti i template in una sottocartella per pulizia
- **Skill /new-article:** Aggiornato per leggere path template da context.md invece di hardcodare `src/blog/_template.html`

## Dati Disponibili per Altre Città
I file per creare le mappe delle altre città sono già nel repo:

| Città | GeoJSON | Accordo Territoriale |
|-------|---------|---------------------|
| Bologna | Bologna/bologna-omi/bologna_omi_zones.geojson | Accordo_Territoriale_Bologna_2024.pdf |
| Firenze | Firenze/firenze-omi/firenze_omi_zones.geojson | Accordo_Territoriale_Firenze_2020.pdf |
| Milano | Milano/milano-omi/milano_omi_zones.geojson | Accordo_locale_Milano_2023.pdf |
| Napoli | Napoli/napoli-omi/napoli_omi_zones.geojson | Accordo_Territoriale_Napoli_2025.pdf |
| Torino | Torino/torino-omi/torino_omi_zones.geojson | Accordo_territoriale_Torino_2024.pdf |

## Prossimi Step per Altre Città
Per ogni città (Torino, Milano, Napoli, Firenze, Bologna):
1. Estrarre valori canone da PDF accordo → creare `{città}-zone-omi.json`
2. Ottimizzare GeoJSON (rimuovere campi inutili, ridurre precisione)
3. Copiare `src/mappe/_template.html` → `src/mappe/{città}/index.html`
4. Copiare `src/blog/_templates/mappa-canone-concordato-citta.html` → `src/blog/mappa-canone-concordato-{città}/index.html`
5. Sostituire placeholder e aggiornare tabella esempi con zone reali
6. Aggiungere a articles.json

## Full Review Articolo Roma
| Area | Status |
|------|--------|
| Ortografia | PASS |
| SEO Base | PASS |
| Schema.org | PASS |
| Navbar | PASS (fixato duplicato) |
| Internal Links | 4 link interni |
| Google Tags | WARN (no GA4, solo cookie tecnici) |

## Come Testare
1. Aprire https://bonusimmobiliare.it/blog/mappa-canone-concordato-roma/
2. Verificare 3 CTA verso /mappe/roma/ funzionanti
3. Verificare navbar con link "Mappa Roma"
4. Verificare FAQ accordion funzionante
5. Verificare responsive mobile
