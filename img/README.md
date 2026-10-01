# Afbeeldingen

Hier staat nu alleen het app-icoon. **Alle foto's zijn verwijderd** — die
waren van Barber Achie (hun interieur en hun klanten) en konden niet mee
naar een andere zaak.

## Wat de site verwacht

| Bestandsnaam | Waar het komt |
| --- | --- |
| `logo.png` | Header en mobiel menu. Ontbreekt nog; zolang dat zo is toont de header het tekstlogo. |
| `og.jpg` | Deelkaart voor WhatsApp en social (1200×630). **Staat er al**, gemaakt zonder foto. |
| `apple-touch-icon.png` | Icoon voor het iOS-beginscherm. **Staat er al.** |

## Eigen foto's toevoegen

De galerij is vervangen door de stijlkaarten (`.st-card` in `index.html`):
vier kaarten met een icoon en bewegend lijnwerk in plaats van een
plaatshouder die om een foto vraagt. De site is daarmee af zónder foto's.

Komen er toch eigen foto's, dan is dat een uitbreiding, geen reparatie:

1. Zet het origineel in `img/` als `naam.jpg`.
2. Maak de varianten `naam-480` en `naam-900`, in zowel `.webp` als `.jpg`.
3. Zet in de stijlkaart een `<picture>` met `srcset` en `sizes` achter de
   tekst, op de plek van `<span class="st-art">` — hoe zo'n `<picture>`
   eruitziet staat in de hoofd-README onder "Afbeeldingen". De donkere
   voet onder de tekst (`.st-card::before`) houdt de regels leesbaar.

Zonder varianten werkt het ook; dan haalt de browser altijd het origineel.

## Aanbevelingen

- Langste zijde 1400–1600 px is ruim voldoende.
- Houd het onder ~300 kB per foto.
- Let op de extensie: een PNG die `.jpg` heet, weigeren sommige browsers.
