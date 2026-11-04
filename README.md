# Werkgo open inschrijving

Een kandidaatgerichte website voor cv-aanmeldingen in bouw, techniek, installatie en logistiek. De hoofdroute is een gratis open inschrijving. Geen werkgeversaanbod, vacaturezoeker of vacatures die niet werkelijk beschikbaar zijn.

## Onderzochte opzet

Op 4 november 2026 zijn Mainfield, Maatt en WerkTalent onderzocht via hun gepubliceerde open-inschrijfpagina's en visueel bekeken in de browser.

- Mainfield, https://mainfield.nl/cv-uploaden/ — afzonderlijke cv-pagina, een paginabanner en een centraal sollicitatieformulier met contactgegevens en bestandsupload.
- Maatt, https://www.maatt.nl/open-sollicitatie/ — merkbanner, korte kandidaatgerichte introductie en een formulier voor open sollicitaties. De reactietermijn op die website is geen belofte van Werkgo.
- WerkTalent, https://www.werktalent.com/vacatures/open-sollicitatie — kandidaatgerichte uitleg over een open sollicitatie en contact over werk. Hun vacatures, beoordelingen, accountfunctionaliteit en andere claims zijn niet overgenomen.

Werkgo past het algemene concept toe met eigen tekst, merk, foto's en code: fotobanner met primaire inschrijfknop, beknopte voordelen, contactvelden vóór de cv-upload en een uitleg van de opvolging naast het formulier. Geen conversiecijfers van concurrenten beschikbaar; dit ontwerp is geen bewezen conversieverbetering.

## Techniek

Statische HTML/CSS/JS. Netlify publiceert de repository-root zonder buildstap. Formulier: naam, e-mailadres, telefoon, woonplaats, cv en toestemming. Geen account nodig. Het cv is verplicht, PDF/DOC/DOCX, niet leeg en maximaal 7 MB. Browsercontrole vervangt geen servercontrole of virusscan. Bij een geweigerde POST blijven de gegevens staan en wordt geen succes gemeld.

Foto's zijn met AI gemaakt en tonen geen echte medewerkers. Manrope, DM Sans en SVG-iconen staan lokaal; OFL-licenties zijn inbegrepen. Geen trackers of externe lettertypeverzoeken.

## Nog nodig voor productie en advertenties

Deze repository bedient twee Netlify-projecten en main bevat nog Nutel. Het productiedoel moet bekend zijn voor vervanging van main. Werkgo-specifieke juridische gegevens en het bewaarbeleid moeten in de conceptprivacyverklaring worden ingevuld. Netlify Forms ontvangst, passende beveiligde cv-opslag, notificaties en toegangsrechten moeten worden ingesteld en met dummygegevens getest. Conversiemeting en Google Ads zijn nog niet toegevoegd.
