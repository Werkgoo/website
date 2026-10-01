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

De galerij en de hero tonen nu een gestileerde plaatshouder. Zodra er
foto's zijn:

1. Zet het origineel in `img/` als `naam.jpg`.
2. Maak de varianten `naam-480` en `naam-900`, in zowel `.webp` als `.jpg`.
3. Vervang in `index.html` het `<div class="photo-slot">`-blok door een
   `<picture>` met `srcset` en `sizes` — hoe dat eruitziet staat in de
   hoofd-README onder "Afbeeldingen".

Zonder varianten werkt het ook; dan haalt de browser altijd het origineel.

## Aanbevelingen

- Langste zijde 1400–1600 px is ruim voldoende.
- Houd het onder ~300 kB per foto.
- Let op de extensie: een PNG die `.jpg` heet, weigeren sommige browsers.
