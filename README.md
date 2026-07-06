# Motions Occasions — Website

Website voor autobedrijf **Motions Occasions**, Kamerlingh Onnesstraat 10, 1821 BP Alkmaar.

## Pagina's

| Pagina | Bestand | Doel |
|---|---|---|
| Home | `index.html` | Overzicht: aanbod, diensten, reviews |
| Occasions | `occasions.html` | Volledig aanbod met filters (merk, prijs, brandstof, transmissie) |
| Occasion-detail | `occasion.html?id=…` | Foto's, specificaties, opties, contact-CTA's |
| Diensten | `diensten.html` | Onderhoud, diagnose, banden, airco, inkoop |
| APK | `apk.html` | APK-landingspagina met tarieven en FAQ |
| Over ons | `over.html` | Bedrijfsverhaal |
| Contact | `contact.html` | Formulier, kaart, openingstijden |
| Beheer | `admin.html` | Voorraadbeheer (niet geïndexeerd) |

## Beheerscherm (`/admin.html`)

- **Standaard wachtwoord: `motions2026`** — wijzig dit direct via het tabblad *Instellingen*.
- **RDW-kentekencheck**: vul een kenteken in en alle voertuiggegevens (merk, model, bouwjaar, kleur, brandstof, vermogen, APK-datum, deuren, zitplaatsen) worden automatisch ingevuld via de gratis open data van de RDW. Geen API-sleutel nodig.
- **AI-kenteken lezen**: upload een foto van de auto — het kenteken wordt in de browser herkend (Tesseract OCR) en daarna via de RDW aangevuld.
- **Automatische omschrijving**: knop "✨ Automatisch schrijven" genereert een verkooptekst op basis van de ingevulde gegevens.
- **Foto's**: slepen/uploaden, worden automatisch verkleind; max. 8 per auto.
- **Back-up**: exporteer/importeer de voorraad als JSON via *Instellingen*.

### Let op: opslag

De voorraad staat in `localStorage` van de browser (de site is 100% statisch, zonder server of database). Dat betekent:

- Wijzigingen in het beheerscherm zijn zichtbaar **in dezelfde browser**. Bezoekers zien standaard de demo-voorraad, tenzij je een backend koppelt.
- Wil je dat élke bezoeker de door jou beheerde voorraad ziet, dan is een klein backend/database-koppelstuk nodig (bijv. Netlify Functions + een database, of een headless CMS). De datalaag (`data.js`) is daarop voorbereid: alleen `moLoadCars`/`moSaveCars` hoeven dan te wijzigen.
- Gebruik ondertussen *Exporteren/Importeren* om de voorraad tussen apparaten over te zetten.

## Nog invullen (placeholders)

- Telefoonnummer: overal `072 - 123 45 67` / `+31721234567` — zoek-en-vervang naar het echte nummer.
- WhatsApp: `https://wa.me/31612345678` — vervang door het echte 06-nummer.
- E-mail: `info@motionsoccasions.nl`.
- Domein: alle SEO-tags gaan uit van `https://www.motionsoccasions.nl` — pas aan als het domein anders wordt.
- `og-image.png`: social share-afbeelding (1200×630) in de root.

## SEO

- Unieke titels/meta-descriptions per pagina, canonicals, Open Graph en Twitter cards.
- JSON-LD: `AutoDealer`+`AutoRepair` (home), `Service`+`FAQPage` (APK), `BreadcrumbList`, en per occasion dynamisch `Car`+`Offer`.
- `sitemap.xml`, `robots.txt` (admin uitgesloten), 404-pagina, semantische HTML en alt-teksten.
- Lokale SEO: NAP-gegevens (naam/adres/telefoon) consistent in footer + structured data, geo-metatags en Google Maps-embed.

## Deploy

Statische site — werkt op Netlify (config in `netlify.toml`, met nette URL's zonder `.html`), GitHub Pages of elke andere statische host.
