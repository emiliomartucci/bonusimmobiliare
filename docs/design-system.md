# Design System - Bonus Immobiliare

## Palette Colori

### Primari (Olive Family)
| Nome | Hex | CSS Variable | Uso |
|------|-----|--------------|-----|
| Olive | `#5C6B4A` | `--olive` | Brand principale, CTA secondarie |
| Olive Deep | `#3D4832` | `--olive-deep` | Hero background, titoli |
| Olive Dark | `#2A3223` | `--olive-dark` | Footer, elementi scuri |
| Olive Light | `#7A8A68` | `--olive-light` | Hover states |
| Sage | `#8A9A78` | `--sage` | Elementi decorativi |
| Sage Pale | `#D4DEC9` | `--sage-pale` | Card backgrounds |
| Sage Mist | `#E8EEE0` | `--sage-mist` | Icon backgrounds |

### Neutri Caldi
| Nome | Hex | CSS Variable | Uso |
|------|-----|--------------|-----|
| Cream | `#FAF7F2` | `--cream` | Background principale |
| Cream Dark | `#F2EDE4` | `--cream-dark` | Input backgrounds |
| Parchment | `#EDE7DB` | `--parchment` | Sezioni alternate |
| Stone | `#DAD7CD` | `--stone` | Bordi, dividers |
| Earth | `#8B8178` | `--earth` | Testo secondario |
| Bark | `#4A3F35` | `--bark` | Testo principale |

### Accenti
| Nome | Hex | CSS Variable | Uso |
|------|-----|--------------|-----|
| Terracotta | `#F06543` | `--terracotta` | CTA primaria, link hover |
| Terracotta Light | `#F4846A` | `--terracotta-light` | Hover terracotta |
| Terracotta Pale | `#F5E6DF` | `--terracotta-pale` | Badge background |
| Gold | `#BFA67A` | `--gold` | Category tags, dettagli |
| Gold Light | `#D4C4A0` | `--gold-light` | Hover gold |
| Gold Pale | `#F5F0E5` | `--gold-pale` | Highlight background |

---

## Typography

### Font Families
| Ruolo | Font | Fallback | CSS Variable |
|-------|------|----------|--------------|
| Display | Fraunces | Georgia, serif | `--font-display` |
| Body | Source Serif 4 | Georgia, serif | `--font-body` |

### Font Sizes
| Nome | Size | Line Height | Uso |
|------|------|-------------|-----|
| Hero Title | clamp(2.5rem, 6vw, 4.5rem) | 1.1 | Titolo hero |
| Section Title | clamp(2rem, 4vw, 3rem) | 1.2 | Titoli sezione |
| Card Title | 1.25rem - 1.75rem | 1.3 | Titoli card |
| Body | 1.125rem | 1.7 | Testo principale |
| Small | 0.95rem | 1.6 | Excerpt, meta |
| Label | 0.75rem - 0.8rem | 1.4 | Tag, badge |

### Font Weights
- 400: Regular (body text)
- 500: Medium (titoli)
- 600: Semibold (CTA, labels)
- 700: Bold (accenti)

---

## Spacing

| Variable | Value | Uso |
|----------|-------|-----|
| `--space-xs` | 0.25rem | Micro gap |
| `--space-sm` | 0.5rem | Small gap |
| `--space-md` | 1rem | Default gap |
| `--space-lg` | 1.5rem | Section padding |
| `--space-xl` | 2rem | Large gap |
| `--space-2xl` | 3rem | Section gap |
| `--space-3xl` | 4rem | Large section |
| `--space-4xl` | 6rem | Hero padding |
| `--space-5xl` | 8rem | Major sections |

---

## Border Radius

| Variable | Value | Uso |
|----------|-------|-----|
| `--radius-sm` | 0.5rem | Input, small elements |
| `--radius-md` | 1rem | Cards |
| `--radius-lg` | 1.5rem | Large cards |
| `--radius-xl` | 2rem | Hero elements |
| `--radius-full` | 9999px | Pills, buttons |

---

## Shadows

| Variable | Value | Uso |
|----------|-------|-----|
| `--shadow-soft` | `0 2px 20px rgba(74, 63, 53, 0.06)` | Subtle elevation |
| `--shadow-medium` | `0 4px 30px rgba(74, 63, 53, 0.1)` | Cards |
| `--shadow-lifted` | `0 12px 40px rgba(74, 63, 53, 0.12)` | Hover, modals |

---

## Transitions

| Variable | Value | Uso |
|----------|-------|-----|
| `--transition-fast` | 0.15s ease | Micro interactions |
| `--transition-base` | 0.3s ease | Default |
| `--transition-slow` | 0.5s ease | Page transitions |

---

## Components

### Buttons
```css
.btn-primary {
    background: var(--terracotta);
    color: var(--cream);
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--radius-full);
    font-weight: 600;
}

.btn-secondary {
    background: transparent;
    border: 2px solid currentColor;
    padding: var(--space-md) var(--space-xl);
    border-radius: var(--radius-full);
}
```

### Cards
```css
.card {
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-soft);
    transition: var(--transition-base);
}

.card:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lifted);
}
```

### Category Tags
```css
.category-tag {
    background: var(--gold);
    color: var(--olive-dark);
    padding: var(--space-xs) var(--space-md);
    border-radius: var(--radius-full);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
}
```

---

## Texture

Paper texture overlay su body:
```css
body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.03;
    z-index: 10000;
    background-image: url("data:image/svg+xml,...noise-filter...");
}
```

---

**Last Update:** 2026-01-20
**Version:** 1.1.0
