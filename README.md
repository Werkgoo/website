# Werkgo open inschrijving

Een kandidaatgerichte website voor cv-aanmeldingen in bouw, techniek, installatie en logistiek. De hoofdroute is een gratis open inschrijving. Geen werkgeversaanbod, vacaturezoeker of vacatures die niet werkelijk beschikbaar zijn.

## Onderzochte opzet

Op 4 november 2026 zijn Mainfield, Maatt en WerkTalent onderzocht via hun gepubliceerde open-inschrijfpagina's en visueel bekeken in de browser.

- Mainfield, https://mainfield.nl/cv-uploaden/ — afzonderlijke cv-pagina, een paginabanner en een centraal sollicitatieformulier met contactgegevens en bestandsupload.
- Maatt, https://www.maatt.nl/open-sollicitatie/ — merkbanner, korte kandidaatgerichte introductie en een formulier voor open sollicitaties. De reactietermijn op die website is geen belofte van Werkgo.
- WerkTalent, https://www.werktalent.com/vacatures/open-sollicitatie — kandidaatgerichte uitleg over een open sollicitatie en contact over werk. Hun vacatures, beoordelingen, accountfunctionaliteit en andere claims zijn niet overgenomen.

Werkgo gebruikt de onderzochte kandidaatroute met eigen tekst, merk, foto's en code. De actuele versie gebruikt een compacte introductie, vier vakgebiedbeelden en een cv-aanmelding in twee stappen. De ontwerpregels en bronnen staan in DESIGN.md. Geen conversiecijfers van concurrenten beschikbaar; dit ontwerp is geen bewezen conversieverbetering.

## Techniek

Statische HTML/CSS/JS. Netlify publiceert de repository-root zonder buildstap. Formulier: naam, e-mailadres, telefoon, woonplaats, cv en toestemming. Geen account nodig. Het cv is verplicht, PDF/DOC/DOCX, niet leeg en maximaal 7 MB. Browsercontrole vervangt geen servercontrole of virusscan. Bij een geweigerde POST blijven de gegevens staan en wordt geen succes gemeld.

Foto's zijn met AI gemaakt en tonen geen echte medewerkers. De actuele pagina gebruikt één Manrope-lettertype en Phosphor SVG-iconen. De assets en bijbehorende licenties staan lokaal. Geen trackers of externe lettertypeverzoeken.

## Nog nodig voor productie en advertenties

Deze repository bedient twee Netlify-projecten en main bevat nog Nutel. Het productiedoel moet bekend zijn voor vervanging van main. Werkgo-specifieke juridische gegevens en het bewaarbeleid moeten in de conceptprivacyverklaring worden ingevuld. Netlify Forms ontvangst, passende beveiligde cv-opslag, notificaties en toegangsrechten moeten worden ingesteld en met dummygegevens getest. Conversiemeting en Google Ads zijn nog niet toegevoegd.

## Interactieve versie

De hoofdpagina heeft een upload in twee stappen. Alle velden blijven in hetzelfde Netlify-formulier. Zonder JavaScript blijven beide stappen zichtbaar. Stapwissels bewaren de gekozen cv en ingevulde gegevens. File drop, bestandscontrole, terugknop, bestandsbevestiging en optionele sectorselectie zijn toegevoegd. De voortgang wordt zichtbaar en via ARIA gemeld. Animaties beperken zich tot de binnenkomst van de hoofdtitel en foto, de stapwisseling, knopfeedback en voortgang. prefers-reduced-motion schakelt beweging uit.

Het grijze vlak in de Netlify-preview was het geïnjecteerde Netlify Drawer iframe. De CSP stond standaard alleen frames van dezelfde herkomst toe. frame-src staat nu uitsluitend de eigen herkomst en https://app.netlify.com toe, volgens https://docs.netlify.com/deploy/review-deploys/netlify-drawer-for-feedback/troubleshoot-the-netlify-drawer/ . De overige CSP-beperkingen blijven behouden.

Getest in de lokale browser: verdergaan zonder bestand toont een fout; een dummy-pdf opent stap 2; teruggaan en opnieuw verdergaan bewaart bestand en ingevulde naam; een geweigerde POST toont een fout zonder gegevens te wissen. Geen horizontale overloop op gecontroleerde 320, 390 en 768 px.

## Toegepaste ontwerpvaardigheden

UI/UX Pro Max en Landing Page Design zijn als persoonlijke skills geïnstalleerd en toegepast. De pagina gebruikt hun typografieschaal, één primaire actie, dezelfde afstandstokens, focus- en foutstates en beweging via transform en opacity. Zie DESIGN.md voor de exacte keuzes.
