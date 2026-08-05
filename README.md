# Barber Achie — website

Statische website voor **Barber Achie**, barbershop aan de G. Rietveldweg 4 in
Heerhugowaard. Geen build-stap, geen dependencies: HTML, één stylesheet en één
JavaScript-bestand.

## Structuur

| Bestand | Pagina |
| --- | --- |
| `index.html` | Home — hero, prijskaart, diensten, openingstijden, afspraakformulier, FAQ |
| `diensten.html` | Diensten in detail |
| `prijzen.html` | Volledige prijskaart en openingstijden |
| `over.html` | Over de zaak |
| `contact.html` | Contactgegevens en afspraakformulier |
| `privacy.html` | Privacyverklaring |
| `404.html` | Foutpagina |
| `style.css` | Volledig ontwerpsysteem |
| `app.js` | Navigatie, animaties, live openingsstatus, formulier |

## Openingstijden

De openingstijden staan op **twee** plekken en moeten samen worden bijgewerkt:

1. `app.js` — de constante `OPENING` (index 0 = zondag, `null` = gesloten).
   Deze stuurt de live "Nu open / Gesloten"-badge en de markering van vandaag.
2. De `.hours`-blokken in `index.html`, `prijzen.html` en `contact.html`, plus
   de `openingHoursSpecification` in de JSON-LD van `index.html`.

Huidige tijden: ma t/m wo 11:00–21:00, do 11:00–22:00, vr en za 10:00–22:00,
zondag gesloten.

## Nog in te vullen

- **Formulier** — `app.js` verstuurt naar `https://formspree.io/f/YOUR_ID`.
  Maak een formulier aan op formspree.io en vervang `YOUR_ID`. Tot dat gebeurd
  is, toont het formulier een foutmelding met het telefoonnummer.
- **Foto's** — er zijn nog geen foto's van de zaak. Op de plekken waar die
  horen staat een `.photo-slot`-blok met een HTML-commentaar erboven; vervang
  dat blok door `<img src="/img/naam.jpg" alt="...">`. Zet de bestanden in een
  map `img/`. De CSP in `netlify.toml` staat eigen afbeeldingen al toe.
- **Reviews** — de sectie "Onze belofte" op de homepage gebruikt de opmaak van
  reviewkaarten. Zodra er echte Google-reviews zijn, kunnen die de kaarten
  vervangen; het commentaar in `index.html` wijst de plek aan.
- **Social media** — Instagram en TikTok zijn nog niet gelinkt omdat de
  gebruikersnamen ontbreken. Voeg ze toe aan de footerkolom "Contact".

## Te controleren

Deze gegevens komen uit openbare vermeldingen, niet uit de huidige website
(die was tijdens het bouwen niet bereikbaar). Even nalopen voor livegang:

- Zondag als sluitingsdag.
- Of het nummer 06 85422395 ook op WhatsApp bereikbaar is — de knoppen
  `wa.me/31685422395` gaan daarvan uit.
- Of pinnen inderdaad mogelijk is (staat in de FAQ en op de prijskaart).

## Publiceren

De site is bedoeld voor Netlify: `netlify.toml` regelt de security headers en
de nette URL's zonder `.html`. Bij een andere host moeten die redirects daar
worden ingesteld. Lokaal bekijken kan met een willekeurige statische server,
bijvoorbeeld `python3 -m http.server`.
