# Autobedrijf De Heems — website

Statische website (HTML/CSS/JS, geen build-stap) voor Autobedrijf De Heems,
Lijndenweg 6-A, 1951 NC Velsen-Noord.

## Structuur

| Bestand | Pagina |
|---|---|
| `index.html` | Home — hero, diensten, uitgelichte occasions, werkwijze, keurmerken, reviews, afspraakformulier, FAQ |
| `occasions.html` | Voorraad met filter op brandstof/transmissie + zoekopdrachtformulier |
| `diensten.html` | APK, onderhoud, reparatie, banden, airco, schadeherstel, inkoop |
| `over.html` | Over het bedrijf, openingstijden, route |
| `contact.html` | Contactgegevens, openingstijden, route, afspraakformulier, FAQ |
| `privacy.html` | Privacyverklaring (AVG) |
| `404.html` | Foutpagina |
| `style.css` | Volledige stylesheet (design tokens bovenaan) |
| `app.js` | Menu, scroll-reveal, FAQ, occasion-filter, formulierverzending |
| `netlify.toml` | Redirects (schone URL's), security headers, CSP |
| `admin.html` | Losstaand adminpaneel van een ander project — hoort niet bij deze site |

Lokaal bekijken: `python3 -m http.server 8000` in deze map, daarna
`http://localhost:8000`. De schone URL's (`/occasions`) werken alleen via
Netlify; lokaal gebruik je `/occasions.html`.

## Beeldmateriaal

De site bevat geen foto's — auto's worden getoond met een SVG-illustratie
(`<symbol id="car-side">`, bovenaan `index.html` en `occasions.html`).
Een echte foto plaatsen doe je zo:

```html
<div class="occ-thumb">
  <span class="occ-tag">Nieuw binnen</span>
  <img src="/img/polo-2019.jpg" alt="Volkswagen Polo 1.0 TSI 2019" loading="lazy">
</div>
```

Dus: de `<svg class="car">` en de `<span class="occ-photo-note">Foto volgt</span>`
vervangen door één `<img>`. De styling (`object-fit: cover`, hover-zoom) staat al klaar.

## Vóór livegang — checklist

Deze punten staan er nu als voorbeeld of zijn overgenomen uit openbare
bronnen en moeten door het bedrijf worden bevestigd:

- [ ] **Voorraad** — de negen auto's op `/occasions` en de drie op de home zijn
      **voorbeelden** (verzonnen prijzen, kilometerstanden en uitvoeringen).
      Vervangen door de echte voorraad. Verwijder daarna het gele
      `notice`-blok bovenaan `occasions.html`.
- [ ] **Reviews** — de drie citaten op de home zijn plaatshouders. Vervangen
      door echte klantreacties (of de sectie verwijderen).
- [ ] **Telefoonnummer** — `036 750 5404` komt van de huidige website. Dat is
      een Almeers netnummer voor een bedrijf in Velsen-Noord; controleer of dit
      klopt. Elders wordt ook `06-24236868` genoemd. Staat in alle pagina's als
      `tel:+31367505404` en als zichtbare tekst.
- [ ] **Openingstijden** — nu `ma t/m vr 08:00–17:30`, zaterdag op afspraak,
      zondag gesloten. Alleen de tijden 08:00–17:30 zijn teruggevonden;
      de rest is een aanname. Staat in `index.html`, `over.html`, `contact.html`
      (en in de JSON-LD van `index.html` en `contact.html`).
- [ ] **Keurmerken** — BOVAG, ANWB-pechhulp, NAP en RDW-keurstation worden
      genoemd. Controleer of alle vier daadwerkelijk van toepassing zijn en
      haal weg wat niet klopt (`keur-grid` in `index.html` en `over.html`).
- [ ] **KvK- en btw-nummer** — nog niet op de site gezet. Openbare bronnen
      noemen KvK `92883478` en btw `NL866808802B01`; verifiëren en daarna
      opnemen in de footer of privacyverklaring.
- [ ] **Formulier** — `app.js` post naar `https://formspree.io/f/YOUR_ID`.
      Maak een formulier aan op formspree.io met `info@autobedrijfdeheems.nl`
      en zet het echte ID in `EP`. Zolang dat niet gebeurd is, krijgt de
      bezoeker na verzenden het telefoonnummer te zien.
- [ ] **Social** — er staan nu geen links naar Facebook/Instagram in de footer,
      alleen route en e-mail. Toevoegen indien aanwezig.
