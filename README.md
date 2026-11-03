# Werkgo redesign en cv-aanmeldingen

Deze branch vervangt de oude Nutel-pagina door een recruitmentwebsite gericht op bouw, techniek en logistiek. De vorige content blijft op main totdat de pull request wordt gemerged.

## Voor je live gaat

1. Controleer dat deze GitHub-repository echt gekoppeld is aan het bedoelde Werkgo-project in Netlify. De huidige main bevatte namelijk Nutel-content.
2. In Netlify > Forms zet je **Enable form detection** aan. Deploy daarna de nieuwe versie.
3. Controleer de formulieren `werkgo-sollicitaties`, `werkgo-werkgevers` en `werkgo-privacyverzoek` in Netlify > Forms. Stel notificaties in.
4. CV's bevatten persoonsgegevens. Netlify raadt aanvullende beveiliging met Very Good Security aan voor uploads met PII. Richt die in of kies een AVG-geschikte, beveiligde kandidaatopslag voordat je kandidaten uitnodigt hun cv te uploaden.
5. Werk de privacyverklaring bij met de juridische naam, adres, grondslag, bewaartermijn, contactpersoon en verwerkers. Controleer verwerkersafspraken, bewaarbeleid en toegangsrechten.
6. Verstuur een testaanmelding met een klein dummy-pdf-bestand. Verifieer ontvangst, bestandstoegang en de bedankpagina. Upload geen echte cv tijdens het testen.
7. Netlify heeft een limiet van 8 MB voor de hele aanvraag en maximaal één bestand per uploadveld. De site valideert 7 MB per cv, zodat er ruimte is voor formulierdata.

De website gebruikt statische HTML/CSS/JS, geen geheimen of API-tokens in de client en geen claims over bestaande vacatures of gegarandeerde plaatsingen.
