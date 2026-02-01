# Repo Audit Report - bonusimmobiliare

**Data:** 2026-02-01
**Auditor:** Marvis + Claude Opus 4.5
**Metodo:** /repo-audit con plugin stack (Repomix, Compound Review Agents)

---

## Repository Summary

| Campo | Valore |
|-------|--------|
| **Nome** | bonusimmobiliare |
| **Tech Stack** | HTML5, CSS3, Vanilla JS, Cloudflare Pages/Workers, D1 |
| **Files** | 126 |
| **Lines** | ~68,000 (include GeoJSON data) |
| **Test Coverage** | No |
| **Last Activity** | 2026-01-31 |

---

## Findings Summary

| Severity | Count | Addressed in Plan |
|----------|-------|-------------------|
| **P1 Critical** | 9 | 9 |
| **P2 High** | 12 | 12 |
| **P3 Medium** | 13 | 0 (fuori scope) |
| **Total** | 34 | 21 |

---

## P1 - Critical Findings

| ID | Area | Issue | File |
|----|------|-------|------|
| P1.1 | Code | CSS duplicato (38 file, ~25K LOC) | src/*.html |
| P1.2 | Code | JS inline duplicato (35 file) | src/*.html |
| P1.3 | Code | GA ID hardcodato | src/js/head-common.js:47 |
| P1.4 | Code | Error handling mancante blog.js | src/js/blog.js:32-34 |
| P1.5 | Security | CORS wildcard su API | functions/api/dokicasa-click.js:15 |
| P1.6 | Security | No rate limiting API | functions/api/dokicasa-click.js |
| P1.7 | Security | Input validation insufficiente | functions/api/dokicasa-click.js:24-30 |
| P1.8 | Performance | GeoJSON enormi (36MB, 11MB) | src/data/*.geojson |
| P1.9 | Data | Manca NOT NULL su timestamp | src/scripts/schema.sql:10 |

---

## P2 - High Priority Findings

| ID | Area | Issue |
|----|------|-------|
| P2.1 | Code | console.log in produzione |
| P2.2 | Code | alert() invece di toast |
| P2.3 | Code | Error handling inconsistente mappe |
| P2.4 | Code | Magic numbers nel codice |
| P2.5 | Code | Weak input validation API |
| P2.6 | Code | Naming CSS inconsistente |
| P2.7 | Security | Error messages leakano dettagli |
| P2.8 | Security | IP tracking senza consenso GDPR |
| P2.9 | Performance | Font render-blocking |
| P2.10 | Performance | GeoJSON duplicati (5MB wasted) |
| P2.11 | Data | No transaction boundaries API |
| P2.12 | Data | Missing article directory |

---

## Agents Utilizzati

| Agent | Focus | Findings |
|-------|-------|----------|
| pattern-recognition-specialist | Anti-patterns, code smells | 18 |
| security-sentinel | OWASP, GDPR, secrets | 6 |
| performance-oracle | Load time, bundle size | 9 |
| code-simplicity-reviewer | Over-engineering, duplication | 6 |
| data-integrity-guardian | Schema, validation, consistency | 8 |

---

## Artifacts Creati

| Tipo | Path |
|------|------|
| **Piano** | `docs/plans/2026-02-01-repo-audit-plan.md` |
| **Solution: CORS** | `docs/solutions/security-issues/cors-wildcard-api.md` |
| **Solution: GeoJSON** | `docs/solutions/performance-issues/geojson-file-size.md` |
| **Solution: CSS** | `docs/solutions/code-quality/css-duplication.md` |

---

## Recommended Actions

### Immediate (questa settimana)
1. Fix CORS wildcard (10 min)
2. Remove error details from response (5 min)
3. Add input validation (30 min)

### Short-term (prossima settimana)
4. Simplify GeoJSON con mapshaper (2h)
5. Add font preconnect (10 min)
6. Anonymize IP addresses (20 min)

### Medium-term (questo mese)
7. Create design-system.css (1h)
8. Migrate inline CSS incrementalmente (ongoing)
9. Add error UI to blog loader (30 min)

---

## Metriche Attese Post-Fix

| Metrica | Prima | Dopo |
|---------|-------|------|
| Map page load (mobile 4G) | 57s | <5s |
| GeoJSON total size | 50MB+ | <5MB |
| CSS lines duplicated | 25,000 | 0 |
| Security OWASP score | 40% | 80%+ |

---

## Next Steps

1. **Implementa piano:** `/workflows:work docs/plans/2026-02-01-repo-audit-plan.md`
2. **Review dopo implementazione:** `/workflows:review`
3. **Documenta learnings:** `/workflows:compound`

---

**Version:** 1.0.0
