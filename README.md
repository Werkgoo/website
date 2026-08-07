# Barber Achie — website

Website voor **Barber Achie**, barbershop aan de G. Rietveldweg 4 in
Heerhugowaard. Eén pagina, geen build-stap, geen dependencies: HTML, één
stylesheet en één JavaScript-bestand.

## Opzet

De site is bewust **één pagina**. Elk blok bestaat maar één keer, zodat een
prijswijziging of een ander openingstijdenrooster op precies één plek
aangepast hoeft te worden.

| Bestand | Wat |
| --- | --- |
| `index.html` | De hele site: hero, diensten & prijzen, ons werk, praktisch, afspraakformulier |
| `privacy.html` | Privacyverklaring |
| `404.html` | Foutpagina |
| `style.css` | Ontwerpsysteem |
| `app.js` | Navigatie, animaties, live openingsstatus, formulier |
| `img/` | Logo en foto's — zie `img/README.md` |

De oude losse pagina's (`/diensten`, `/prijzen`, `/over`, `/contact`) zijn
opgegaan in de homepage. `netlify.toml` stuurt die URL's met een 301 door
naar het bijbehorende anker, zodat bestaande links en zoekresultaten blijven
werken.

## Prijzen wijzigen

De prijslijst staat in `index.html` in de `<ul class="menu">`, en nergens
anders. De keuzelijst in het afspraakformulier noemt alleen de
behandelingen, zonder bedragen, zodat de prijzen niet uiteen kunnen lopen.

## Openingstijden wijzigen

De tijden staan op **twee** plekken en moeten samen worden bijgewerkt:

1. `app.js` — de constante `OPENING` (index 0 = zondag, `null` = gesloten).
   Deze stuurt de live "Nu open / Gesloten"-badge en de markering van vandaag.
2. Het `.hours`-blok in `index.html`, plus de `openingHoursSpecification`
   in de JSON-LD bovenaan diezelfde pagina.

Huidige tijden: ma t/m wo 11:00–21:00, do 11:00–22:00, vr en za 10:00–22:00,
zo 11:00–20:00. De zaak is dus zeven dagen per week open.

## WhatsApp

Nummer en standaardbericht staan op één plek: bovenin `app.js`, in
`WA_NUMBER` en `WA_TEXT`. Het nummer is internationaal, zonder `+` en
zonder de 0 van 06 — `06 85422395` wordt dus `31685422395`.

Er zijn drie ingangen: de groene knop in de hero, de regel in de
contactkaart, en een zwevende knop rechtsonder die verschijnt zodra de
bezoeker voorbij de hero scrollt. Alle drie openen WhatsApp in een nieuw
tabblad met het bericht alvast ingevuld.

De links in `index.html` bevatten het nummer ook rechtstreeks, zodat ze
blijven werken als JavaScript uitstaat; `app.js` voegt daar het bericht
aan toe. Wijzigt het nummer, pas het dan op beide plekken aan.

## Nog in te vullen

- **Formulier** — het endpoint staat in het `action`-attribuut van het
  formulier in `index.html`: `https://formspree.io/f/YOUR_ID`. Maak een
  formulier aan op formspree.io en vervang `YOUR_ID` daar. Tot dat gebeurd
  is, meldt het formulier dat het nog niet gekoppeld is en noemt het het
  telefoonnummer. Doordat het endpoint in de HTML staat, werkt het
  formulier ook als JavaScript uitstaat.
- **Logo** — `img/logo.png` ontbreekt nog. Zolang dat zo is, valt de header
  terug op het tekstlogo. Zet het logo met transparante achtergrond neer
  onder die naam, dan verschijnt het vanzelf.

## Kaart

De kaart onder "Praktisch" laadt niet vanzelf. Standaard staat er een eigen
paneel met de adrespin; pas na een klik op "Kaart laden" wordt de Google
Maps-iframe geplaatst. Zo doet de site geen enkel verzoek aan Google
zolang de bezoeker daar niet om vraagt, wat een cookiemelding voor de
kaart overbodig maakt.

Het frame is toegestaan via `frame-src https://www.google.com` in de CSP
in `netlify.toml`. Haalt u de kaart weg, haal die regel er dan ook uit.

## Social media

Instagram (`@achie.sbarbershop`) en TikTok (`@achietheb`) staan in de
contactkaart en in de `sameAs` van de structured data, zodat Google ze aan
de zaak kan koppelen.

## Te controleren

Deze gegevens komen uit openbare vermeldingen, niet uit de oude website.
Even nalopen voor livegang:

- **Of 06 85422395 op WhatsApp geregistreerd staat.** De knoppen gaan
  daarvan uit. Is het nummer niet bekend bij WhatsApp, dan opent er wel
  een venster maar meldt WhatsApp dat het nummer ongeldig is. Even zelf
  testen door op de knop te klikken.
- Of pinnen inderdaad mogelijk is (staat bij de prijzen).

## Publiceren

Bedoeld voor Netlify: `netlify.toml` regelt de security headers, de nette
URL zonder `.html` voor de privacypagina en de omleidingen hierboven. Lokaal
bekijken kan met `python3 -m http.server`.
