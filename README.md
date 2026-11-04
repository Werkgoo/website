# Werkgo recruitmentwebsite

Website met donkergroene en oranje huisstijl, een SVG-logo, vijf lokale foto's, sectorselectie, kandidaat- en werkgeversformulier, FAQ, privacy- en bedankpagina en 404-pagina.

## Implementatie

Statische HTML, CSS en JavaScript. Netlify publiceert de repository-root zonder buildstap. Foto's zijn met AI gemaakt op basis van het goedgekeurde Werkgo ontwerpblad en tonen geen echte medewerkers. De WebP-afbeeldingen zijn geoptimaliseerd; de vijf gebruikte WebP-bestanden zijn samen circa 432 kB. Het logo en favicon zijn SVG. Geen externe lettertypes, trackers of scripts.

Kandidaten kunnen zich met of zonder cv aanmelden. PDF, DOC en DOCX worden aan de voorkant gecontroleerd op extensie, lege inhoud en de limiet van 7 MB. Deze controle is geen servercontrole of virusscan. Extra werkvoorkeuren zijn inklapbaar. Bij een fout tijdens versturen blijven gegevens in het formulier staan. Alleen een geaccepteerde POST leidt naar de bedankpagina. Bestanden en persoonsgegevens komen niet in GitHub terecht.

## Nog nodig voor productie

1. Bevestig welk Netlify-project het productiedoel is. Deze repository heeft previews voor zowel `werkgoo` als `spectacular-starlight-7d24aa`. Main bevat nog Nutel; deze branch is de Werkgo versie.
2. Vul de Werkgo-specifieke juridische naam, adres, privacycontact, grondslag, verwerkers en het bewaarbeleid in de privacyverklaring in. De bestaande verklaring blijft herkenbaar als concept.
3. Activeer Netlify form detection en controleer de formulieren `werkgo-sollicitaties`, `werkgo-werkgevers` en `werkgo-privacyverzoek`. Controleer toegangsrechten, notificaties en geschikte beveiligde verwerking van cv's voordat je echte kandidaten werft.
4. Test ontvangst met dummygegevens en een klein dummy-pdf, zowel met als zonder bijlage. Controleer ook afwijzing en foutmeldingen. Alleen de bedankpagina bereiken bewijst niet dat ontvangst en opslag goed zijn ingericht.

## Controle

HTML-structuur en lokale links, JavaScript-syntaxis, weergave op desktop en smalle schermen, sectorkeuze en mobiele navigatie worden gecontroleerd. De tijdelijke lokale previewbestanden worden niet meegeleverd.
