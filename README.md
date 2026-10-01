# Ghere Hairstyling — website

> ## ⚠ Eerst lezen — overgezet van een andere zaak
>
> Deze site is gemaakt voor Barber Achie in Heerhugowaard en daarna
> omgezet naar Ghere Hairstyling. Naam, adres en telefoonnummer zijn
> overal aangepast en alle foto's van de oude zaak zijn verwijderd.
>
> **Nog te controleren voordat de site live gaat:**
>
> 1. **De openingstijden.** Van Ghere Hairstyling zijn geen tijden
>    openbaar vindbaar. Wat er nu staat (ma t/m wo 11:00–21:00, do tot
>    22:00, vr en za 10:00–22:00, zo 11:00–20:00) zijn de tijden van de
>    oude zaak. Die sturen ook de live "Nu open"-badge aan, dus zolang ze
>    niet kloppen klopt die badge ook niet.
> 2. **De prijzen.** Knippen staat op € 25,00 — dat bedrag is doorgegeven.
>    De rest is daar in verhouding mee opgehoogd (knippen + baard € 35,00,
>    baard € 15,00, kinderen € 20,00, wassen & stylen € 12,50,
>    wenkbrauwen en harsen € 7,50). Die zes bedragen zijn een schatting
>    en nog niet bevestigd.
>
> Waar ze staan, staat hieronder onder "Prijzen wijzigen" en
> "Openingstijden wijzigen". Let op: een prijs staat op twee plekken —
> in de lijst én in de JSON-LD bovenin, en knippen ook nog in de
> pluspunten onder de hero.
>
> Verder ontbreken nog: een e-mailadres, Instagram/TikTok en het echte
> domein (`gherehairstyling.nl` is een aanname en staat in de canonical,
> og-tags, sitemap en robots.txt).


Website voor **Ghere Hairstyling**, herenkapper aan de Laat 19 in Alkmaar. Eén pagina, geen build-stap, geen dependencies: HTML, één
stylesheet en één JavaScript-bestand.

## Opzet

De site is bewust **één pagina**. Elk blok bestaat maar één keer, zodat een
prijswijziging of een ander openingstijdenrooster op precies één plek
aangepast hoeft te worden.

| Bestand | Wat |
| --- | --- |
| `index.html` | De hele site: hero, diensten & prijzen, stijlen, praktisch, afspraakformulier |
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

De prijslijst staat in `index.html` in de `<ul class="menu">`. Een bedrag
dat u daar wijzigt, moet ook mee in de `hasOfferCatalog` van de JSON-LD
bovenin diezelfde pagina — dat is wat Google uitleest. De prijs van
knippen staat daarnaast nog in de pluspunten onder de hero
(`<ul class="hero-usps">`).

De keuzelijst in het afspraakformulier noemt alleen de behandelingen,
zonder bedragen, zodat die niet uiteen kan lopen met de lijst.

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
zonder de 0 van 06 — `06 87961062` wordt dus `31687961062`.

Er zijn drie ingangen: de groene knop in de hero, de regel in de
contactkaart, en een zwevende knop rechtsonder die verschijnt zodra de
bezoeker voorbij de hero scrollt. Alle drie openen WhatsApp in een nieuw
tabblad met het bericht alvast ingevuld.

De links in `index.html` bevatten het nummer ook rechtstreeks, zodat ze
blijven werken als JavaScript uitstaat; `app.js` voegt daar het bericht
aan toe. Wijzigt het nummer, pas het dan op beide plekken aan.

## Nog in te vullen

- **Formulier** — staat nu tijdelijk op WhatsApp, zie hieronder. Zodra u
  het per e-mail wilt ontvangen: maak een formulier aan op formspree.io,
  zet het form-ID in het `action`-attribuut van het formulier in
  `index.html` (nu `https://formspree.io/f/YOUR_ID`) en zet
  `FORMULIER_VIA_WHATSAPP` in `app.js` op `false`.
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

## Formulier gaat tijdelijk via WhatsApp

`FORMULIER_VIA_WHATSAPP` staat bovenaan het formulierblok in `app.js` op
`true`. Het formulier verstuurt dan niets zelf: bij verzenden opent
WhatsApp met de ingevulde gegevens als kant-en-klaar bericht, dat de
klant zelf nog verstuurt. De verzendknop wordt daarop groen met het
WhatsApp-icoon en het bijschrift vertelt wat er gebeurt — dat gebeurt
allemaal vanuit die ene schakelaar, dus terugzetten is één regel.

De verplichte velden blijven gewoon gelden: een leeg formulier opent geen
WhatsApp. Wordt de pop-up geblokkeerd, dan opent WhatsApp in hetzelfde
tabblad in plaats van dat er niets gebeurt.

Let op: dit werkt via JavaScript. Staat dat uit, dan valt het formulier
terug op de POST naar Formspree uit het `action`-attribuut — die moet dan
wel ingesteld zijn.

## Animaties

De animatielaag zit onderaan `style.css` en onderaan `app.js`, allebei in
een blok met het kopje ANIMATIES. Wat er gebeurt:

- De koppen worden door JavaScript in losse woorden geknipt, die elk
  achter een masker vandaan omhoog komen. De opmaak eromheen blijft heel,
  dus het goudverloop op het accentwoord overleeft het opknippen.
- Het lijnwerk in de hero en achter de stijlkaarten schuift traag op. Het
  patroon zelf staat stil; alleen de laag eronder beweegt, en precies één
  periode, zodat het naadloos rondloopt. Het sierwerk in de hero schuift
  bij het scrollen bovendien langzamer mee dan de rest.
- Prijsregels komen na elkaar binnen, stijlkaarten worden van boven naar
  beneden opengeveegd.
- De kaarten hebben een lichtvlek die de muis volgt, de hoofdknoppen een
  glansveeg, en de knoppen in de hero trekken licht naar de cursor toe.
- De marquee loopt vanuit JavaScript, zodat scrollen hem een zetje geeft.

Twee dingen om te weten bij het aanpassen:

1. **Alles is versiering.** Valt JavaScript uit, dan blijft de pagina
   gewoon leesbaar; er zit een vangnet dat na 8 seconden alles zichtbaar
   maakt, ook als een waarnemer niet afgaat.
2. **De animatielus slaapt** zodra de hero en de marquee allebei buiten
   beeld zijn, en zodra het tabblad naar de achtergrond gaat. Dat scheelt
   accu op de telefoon.

Wie in zijn systeeminstellingen aangeeft beweging te willen beperken
(`prefers-reduced-motion`), krijgt hier niets van te zien: de koppen
worden dan niet eens opgeknipt en alles staat meteen stil en zichtbaar.

## Social media

Nog geen accounts gekoppeld. De Instagram- en TikTok-knoppen van de vorige
zaak zijn verwijderd, net als de `sameAs` in de structured data. Zijn er
accounts, dan horen ze in de contactkaart en in die `sameAs`.

## Mobiele actiebalk

Onderaan `index.html`, `privacy.html` en `404.html` staat `.actionbar`:
twee knoppen (bellen en WhatsApp) die op schermen tot 720px vast onderin
blijven staan zodra de bezoeker voorbij de hero is. De zwevende
WhatsApp-knop wordt daar verborgen, anders zou hij dubbelop zijn. Op
desktop is het omgekeerde het geval.

`body` krijgt op mobiel `padding-bottom` zodat de balk de footer niet
afdekt, en de balk houdt rekening met `env(safe-area-inset-bottom)` voor
telefoons met een streep onderaan.

## Afbeeldingen

Er staan op dit moment geen foto's in de site; zie `img/README.md`. Komen
ze er wel, dan is dit de bedoelde opzet.

Zet elke foto er in drie maten neer (480, 900 en de volle breedte) en in
twee formaten (WebP en JPEG), gekoppeld via `<picture>` met `srcset` en
`sizes`. De browser kiest dan zelf wat bij het scherm past.

Laat de `sizes`-waarden de echte kolombreekpunten van de stijlkaarten
volgen (1 kolom t/m 720px, 2 t/m 1024px, daarna 4). **Wijzigt u die
breekpunten in `style.css`, pas dan ook `sizes` in `index.html` aan** —
anders haalt de browser een te kleine foto op en wordt hij wazig.

Nieuwe foto's toevoegen: zet het origineel als `naam.jpg` in `img/` en
maak de varianten `naam-480`, `naam-900` in beide formaten. Zonder
varianten werkt het ook, dan valt de browser terug op het origineel.

`og.jpg` is de deelkaart voor WhatsApp en social (1200x630). Verandert de
hero-tekst, dan is die kaart ook gedateerd.

## Opbouw van de secties

Twee patronen, bewust verschillend:

- **Prijzen** gebruikt `.ss`: een meelopende zijkolom met de titel, intro
  en belknop, met de prijslijst ernaast in één kolom. De zijkolom blijft
  onder de header staan zolang de lijst langsscrollt en schuift daarna mee
  weg. Dat is hoe `position:sticky` hoort te werken — hij loopt mee over
  het verschil in hoogte tussen de kolommen, hier zo'n 525 van de 815px.
- **Stijlen** en **Praktisch** gebruiken `.sec-head--rij`: label boven de
  titel, over de volle breedte. Die secties hebben brede blokken (vier
  stijlkaarten, twee kaarten naast elkaar) en verliezen te veel als er een
  zijkolom van af gaat.

De oude `.sec-head` met de titel rechts en een zwevend label links liet op
brede schermen een groot gat vallen; die vorm wordt nergens meer gebruikt.

Onderweg geprobeerd en teruggedraaid: Praktisch als bento met de kaart over
twee rijen. Dat rekte het kaartpaneel naar 1300px met de pin in het niets.
De twee tekstkaarten naast elkaar met de kaart eronder leest beter.

## Wat de concurrentie wel heeft en wij niet

Uit de herenkappers in Alkmaar (Barber Hasan, Zidan Barber, Barber
Tangerino, Barber Shamo, De KapperIng):

1. **Online boeken met tijdslots.** Vrijwel iedereen zit op Fresha of
   Knipklok, waar de klant zelf een tijd kiest. Wij hebben alleen bellen,
   WhatsApp en het formulier. Dit is het grootste gat en het enige punt
   dat echt klanten kan schelen — buiten openingstijden kan niemand nu
   iets vastleggen.
2. **Zichtbare beoordelingen.** Barber Hasan toont 4,6 uit 5 over 178
   reviews. Wij tonen geen enkel cijfer. Zodra er Google-reviews zijn, is
   dat het sterkste vertrouwenssignaal dat er is.
3. **De barbiers bij naam.** Meerdere concurrenten stellen hun team voor.

## Te controleren

Deze gegevens komen uit openbare vermeldingen, niet uit de oude website.
Even nalopen voor livegang:

- **Of 06 87961062 op WhatsApp geregistreerd staat.** De knoppen gaan
  daarvan uit. Is het nummer niet bekend bij WhatsApp, dan opent er wel
  een venster maar meldt WhatsApp dat het nummer ongeldig is. Even zelf
  testen door op de knop te klikken.
- Of pinnen inderdaad mogelijk is (staat bij de prijzen).

## Publiceren

Bedoeld voor Netlify: `netlify.toml` regelt de security headers, de nette
URL zonder `.html` voor de privacypagina en de omleidingen hierboven. Lokaal
bekijken kan met `python3 -m http.server`.
