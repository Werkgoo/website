# Fahrschule u. Berufskraftfahrerschule Grafweg — Website

Complete rebuild van [fahrschule-grafweg.de](https://www.fahrschule-grafweg.de/) als moderne, statische website — klaar voor deployment op Netlify.

## Pagina's

| Bestand | Inhoud |
| --- | --- |
| `index.html` | Startpagina met hero, aanbod, USP's en stappenplan |
| `klassen.html` | Alle rijbewijsklassen (motor, auto, LKW, bus, trekkers) |
| `bkf.html` | Berufskraftfahrer: Grundqualifikation + 5 nascholingsmodules |
| `ueber-uns.html` | Over de rijschool |
| `kontakt.html` | Contactgegevens, openingstijden en Netlify-contactformulier |
| `danke.html` | Bedankpagina na formulierverzending |
| `impressum.html` / `datenschutz.html` | Juridische pagina's (placeholders aanvullen!) |
| `404.html` | Foutpagina |

## Huisstijl & afbeeldingen

- Logo (`img/logo.svg` + witte variant) is een SVG-reconstructie van het originele Grafweg-logo, incl. slogan *"Vom Mofa bis zum Bus – wir bilden Sie aus!"*.
- Alle illustraties in `img/` zijn zelfgemaakte SVG's in de huisstijl (navy `#0e2a47` / amber `#ffb400`) — geen externe afhankelijkheden of licentiekwesties. Vervang ze desgewenst door echte foto's (zelfde bestandsnamen aanhouden).

## Techniek

- Puur statisch: HTML + CSS + een klein beetje JavaScript (mobiel menu). Geen build-stap.
- Contactformulier via [Netlify Forms](https://docs.netlify.com/forms/setup/) (`data-netlify="true"`).
- `netlify.toml` bevat de publish-configuratie en security headers.

## Deployen op Netlify

1. Log in op [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Kies GitHub en selecteer dit repository (`werkgoo/website`).
3. Branch: `main` (na merge) of deze feature branch voor een preview. Build command leeg laten, publish directory: `.` (staat al in `netlify.toml`).
4. Na de eerste deploy: **Forms** inschakelen/controleren zodat inzendingen van het contactformulier binnenkomen (stel e-mailnotificaties in onder *Forms → Notifications*).
5. Eigen domein koppelen onder *Domain management* zodra gewenst.

## Nog aanvullen vóór livegang

- Impressum: toezichthoudende instantie en (indien aanwezig) BTW-nummer.
- Datenschutzerklärung juridisch laten controleren.
- Openingstijden verifiëren (nu: ma–vr 17:00–19:00, bron: online vermeldingen).
- Eventueel echte foto's van team en voertuigen toevoegen.
