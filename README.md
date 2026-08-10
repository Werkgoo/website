# Autobedrijf De Heems — website

Statische website (HTML/CSS/JS, geen build-stap) voor Autobedrijf De Heems,
Lijndenweg 6-A, 1951 NC Velsen-Noord.

## Structuur

| Bestand | Pagina |
|---|---|
| `index.html` | Home — hero, diensten, uitgelichte occasions, werkwijze, keurmerken, reviews, afspraakformulier, FAQ |
| `occasions.html` | Voorraad met filter op brandstof/transmissie + zoekopdrachtformulier |
| `occasion.html` | Detailpagina van één auto (`/occasion?id=…`) |
| `beheer.html` | **Beheerpaneel** voor de voorraad (`/beheer`) |
| `diensten.html` | APK, onderhoud, reparatie, banden, airco, schadeherstel, inkoop |
| `over.html` | Over het bedrijf, openingstijden, route |
| `contact.html` | Contactgegevens, openingstijden, route, afspraakformulier, FAQ |
| `privacy.html`, `404.html` | Privacyverklaring en foutpagina |
| `occasions.json` | De voorraad (wordt gebruikt zolang er geen database is) |
| `config.js` | **Alle instellingen**: database, Formspree, telefoonnummer |
| `data.js` | Laadt de voorraad en bouwt de auto-kaartjes |
| `app.js` | Menu, scroll-reveal, FAQ, filter, formulierverzending |
| `style.css` | Stylesheet van de website (design tokens bovenaan) |
| `supabase-schema.sql` | Databasetabel + rechten, voor als je het beheer live wilt zetten |
| `netlify.toml` | Redirects (schone URL's), security headers, CSP |
| `admin.html` | Adminpaneel van een **ander** project (WerkGo/Supabase) — hoort niet bij deze site en kan weg |

Lokaal bekijken: `python3 -m http.server 8000` in deze map. De schone URL's
(`/occasions`, `/beheer`) werken alleen via Netlify; lokaal gebruik je
`/occasions.html` en `/beheer.html`.

## Het beheerpaneel

Te vinden op **`/beheer`**. Daar voeg je auto's toe, pas je ze aan, zet je ze
op *gereserveerd* of *verkocht* en verwijder je ze. Wat je opslaat, verschijnt
op de home (de drie uitgelichte auto's), op `/occasions` en op de
detailpagina van de auto zelf.

Er zijn twee manieren om het te gebruiken.

### 1. Lokale modus (nu actief)

Zonder database werkt het beheer meteen, maar wijzigingen blijven in je eigen
browser staan. Om ze live te zetten: klik op **JSON exporteren** en vervang
`occasions.json` in de website door het gedownloade bestand.

Let op: in deze modus is `/beheer` niet met een wachtwoord beveiligd. Iedereen
die het adres kent, kan de pagina openen — wijzigen kan alleen in de eigen
browser, maar zet er een database achter zodra de site live gaat.

### 2. Met database (aanbevolen als de site live staat)

1. Maak een gratis project aan op [supabase.com](https://supabase.com).
2. Plak `supabase-schema.sql` in de SQL Editor en voer het uit.
3. Maak onder *Authentication → Users* een gebruiker aan; dat worden de
   inloggegevens voor `/beheer`.
4. Zet de Project URL en de publishable (anon) key in `config.js`.

Daarna is `/beheer` afgeschermd met een login, sla je wijzigingen direct op en
kun je foto's rechtstreeks uploaden. De publishable key mag publiek zijn: die
geeft alleen leesrechten, wijzigen kan uitsluitend na inloggen.

## Foto's

Zonder foto's toont de site een SVG-illustratie van een auto met het label
"Foto volgt". Zodra je bij een auto foto-adressen invult (in het beheer, één
per regel), gebruikt de site die overal automatisch. Twee manieren:

- **Zonder database:** zet de bestanden in een map `img/` in de website en vul
  bijvoorbeeld `/img/polo-2019-1.jpg` in.
- **Met database:** gebruik de uploadknop in het beheerformulier.

De eerste foto is de hoofdfoto op het kaartje; op de detailpagina worden alle
foto's als galerij getoond.

## Vóór livegang — checklist

Deze punten staan er nu als voorbeeld of zijn overgenomen uit openbare
bronnen en moeten door het bedrijf worden bevestigd:

- [ ] **Voorraad** — de negen auto's in `occasions.json` zijn **voorbeelden**
      (verzonnen prijzen, kilometerstanden en uitvoeringen). Vervang ze via
      `/beheer` door de echte voorraad. Verwijder daarna het gele
      `notice`-blok bovenaan `occasions.html`.
- [ ] **Reviews** — de drie citaten op de home zijn plaatshouders. Vervangen
      door echte klantreacties (of de sectie verwijderen).
- [ ] **Telefoonnummer** — `036 750 5404` komt van de huidige website. Dat is
      een Almeers netnummer voor een bedrijf in Velsen-Noord; controleer of dit
      klopt. Elders wordt ook `06-24236868` genoemd.
- [ ] **Openingstijden** — nu `ma t/m vr 08:00–17:30`, zaterdag op afspraak,
      zondag gesloten. Alleen de tijden 08:00–17:30 zijn teruggevonden;
      de rest is een aanname.
- [ ] **Keurmerken** — BOVAG, ANWB-pechhulp, NAP en RDW-keurstation worden
      genoemd. Controleer of alle vier daadwerkelijk van toepassing zijn.
- [ ] **KvK- en btw-nummer** — nog niet op de site gezet. Openbare bronnen
      noemen KvK `92883478` en btw `NL866808802B01`; verifiëren en daarna
      opnemen in de footer of privacyverklaring.
- [ ] **Formulier** — zet het Formspree-form-ID in `config.js`. Zolang dat niet
      gebeurd is, krijgt de bezoeker na verzenden het telefoonnummer te zien.
- [ ] **Beheer beveiligen** — koppel Supabase, anders staat `/beheer` open.
- [ ] **`admin.html`** — restant van een ander project. Verwijderen zodra
      zeker is dat het elders bewaard is.
