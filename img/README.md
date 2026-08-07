# Afbeeldingen

Zet de bestanden hier neer met **exact** deze namen. De site pakt ze dan
automatisch op — er hoeft niets in de HTML aangepast te worden.

| Bestandsnaam | Wat | Waar op de site |
| --- | --- | --- |
| `logo.png` | Het logo met transparante achtergrond | Header en mobiel menu — **ontbreekt nog** |
| `interieur.jpg` | Het interieur van de zaak | Achtergrond van de hero |
| `kapsel-1.jpg` | Blonde coupe met fade | Galerij "Ons werk" |
| `kapsel-2.jpg` | Getextureerde taper fade | Galerij "Ons werk" |
| `barber-aan-het-werk.jpg` | De kapper die een klant knipt | Galerij "Ons werk" |

Ontbreekt een bestand, dan haalt een `onerror`-handler de afbeelding weg —
de pagina raakt dus nooit stuk. Bij het logo verschijnt dan het tekstlogo.

## Aanbevelingen

- **Formaat**: echte JPG voor foto's, PNG voor het logo (transparantie).
  Let op de extensie: een PNG die `.jpg` heet, weigeren sommige browsers.
- **Afmeting**: langste zijde 1400–1600 px is ruim voldoende.
- **Bestandsgrootte**: houd het onder ~300 kB per foto. De huidige foto's
  zijn daarop teruggebracht (van ~2,5 MB naar ~250 kB per stuk).
- Het logo werkt op de donkere achtergrond van de site het best in de
  **lichte/transparante** variant, niet de versie met donkere achtergrond.
