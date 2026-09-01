# Nador — Remotion-video's

Twee composities in één Remotion-project:

| Compositie | Formaat | Duur | Bestand |
|---|---|---|---|
| `NadorVideo` | 1920×1080 | 31,5 s | `out/nador.mp4` |
| `CaraBlancaTikTok` | 1080×1920 | 12,4 s | `out/nadorspot-carablanca.mp4` |
| `CaraBlancaTikTokEN` | 1080×1920 | 12,0 s | `out/nadorspot-carablanca-en.mp4` |
| `CaraBlancaTikTokPro` | 1080×1920 | 21,1 s | `out/nadorspot-carablanca-pro.mp4` |

## 1. NadorVideo — de stadsvideo

Volledig in code gemaakt: geen externe beelden, alle scènes zijn getekend met
SVG en CSS, dus de render werkt ook offline.

![1920×1080 · 30 fps · 945 frames](https://img.shields.io/badge/1920%C3%971080-30fps-blue)

## Scènes

| # | Scène | Frames | Inhoud |
|---|-------|--------|--------|
| 1 | Intro | 0–165 | Zonsopkomst boven de baai, titel `NADOR` / الناظور |
| 2 | Ligging | 150–315 | Schematische kaart van de Rifkust met Mar Chica, Melilla en Beni Ansar |
| 3 | Mar Chica | 300–480 | De lagune, de zandbank met de Bocana en de flamingo's |
| 4 | In cijfers | 465–630 | Vier tellers: inwoners, oppervlakte lagune, hoogte Gurugu, afstand tot Melilla |
| 5 | Te zien | 615–810 | Vijf hoogtepunten: Corniche, Trois Fourches, Gurugu, souk, Beni Ansar |
| 6 | Outro | 795–960 | Zonsondergang met afsluitende claim |

De scènes overlappen 15 frames; `src/components/Scene.tsx` regelt de cross-fade.
Alle timings staan in `src/theme.ts`.

## 2. CaraBlancaTikTok — verticale video voor @Nadorspot

Montage van de twee eigen clips uit `public/footage/` (Cara Blanca, Nador),
gesneden in vier shots met cross-fades, trage push-in per shot en een lichte
kleurcorrectie. Overlays: openingstitel, drie captions, een vaste
`@Nadorspot`-badge en een eindkaart. Teksten staan binnen de veilige zone van
TikTok (niets onder de onderste 470 px of achter de knoppen rechts).

De montage staat in `SHOTS` bovenin `src/tiktok/CaraBlanca.tsx`: per shot een
bronclip, een startpunt in seconden, een lengte in frames en een zoom/pan.
De captions zijn de `<Caption>`-regels onderin datzelfde bestand.

Het originele geluid van de clips blijft staan; zet er in TikTok gerust een
trending track overheen.

## 3. CaraBlancaTikTokEN — Engelse versie

Dezelfde beelden, strakker gemonteerd voor TikTok: zes kortere shots met een
punch-in op elke snede, Engelse kinetische captions (woord voor woord, met
contour en een zachte scrim zodat ze ook op licht gesteente leesbaar zijn), een
titelkaart en een eindkaart met de handle.

Het geluid is hier één doorlopende omgevingstrack (`public/footage/ambience.mp3`,
de audio van beide clips achter elkaar), zodat je de snedes niet hoort. De
beeldsporen staan op `muted`.

Teksten in beeld:

1. "This is not the Caribbean."
2. `CARA BLANCA` · Nador · Morocco
3. "Water this clear."
4. "White rock terraces to swim off."
5. "On Morocco's Mediterranean coast."
6. `@Nadorspot` — follow for more spots around Nador

## 4. CaraBlancaTikTokPro — de lange versie met extra beeld

Negen shots: een foto van de paddenstoelrots als opener, twee clips van
[@maroci108](https://www.tiktok.com/@maroci108) (met toestemming gebruikt) en de
eigen clips uit `public/footage/`. De shots met geleend beeld tonen een
creditpill onder de accountbadge; de eindkaart herhaalt de credit.

De montage staat in `SHOTS` bovenin `src/tiktok/CaraBlancaPro.tsx`. Per shot:
bronbestand, `kind` (`video` of `photo`), startpunt in seconden, lengte in
frames, zoom, pan, kleurcorrectie, `focusX` (welk deel in beeld blijft bij beeld
dat smaller is dan 9:16) en een optionele `credit`.

De overlays (captions, titelkaart, badge, creditpill, eindkaart) staan in
`src/tiktok/shared.tsx` en worden door zowel de Engelse als deze versie gebruikt.
Geluid is opnieuw de eigen omgevingstrack (`ambience-long.mp3`), niet de audio
van de geleende clips.

### Credits

Beeld dat niet van het account zelf is, hoort met naam in beeld. Pas `CREDIT`
bovenin `src/tiktok/CaraBlancaPro.tsx` aan of zet per shot een eigen `credit`.

## Gebruik

```bash
npm install
npm start          # Remotion Studio, live preview op http://localhost:3000
npm run build      # rendert out/nador.mp4
npm run build:tiktok      # rendert out/nadorspot-carablanca.mp4
npm run build:tiktok-en   # rendert out/nadorspot-carablanca-en.mp4
npm run build:tiktok-pro  # rendert out/nadorspot-carablanca-pro.mp4
```

Rendert de CLI in een container zonder eigen Chrome, geef dan een browser mee:

```bash
npx remotion render NadorVideo out/nador.mp4 \
  --browser-executable=/pad/naar/chrome-headless-shell
```

## Fonts

Vier families, alle als `.woff2` in `public/fonts/` (alleen de latin-subsets):

| Token | Familie | Waarvoor |
|---|---|---|
| `FONTS.impact` | Anton | titels en de handle in de TikTok-video's |
| `FONTS.ui` | Inter | captions, labels, kaartteksten, bodytekst |
| `FONTS.display` | Outfit | koppen in de landscape-video |
| `FONTS.serif` | Instrument Serif | de cursieve regel in de outro |

De `@font-face`-regels zitten in `src/fontCss.ts` en worden door
`src/components/Fonts.tsx` ingeladen — er gaat tijdens het renderen dus geen
verkeer naar Google Fonts. Wil je een familie vervangen: haal de CSS bij Google
Fonts op, zet de `.woff2`-bestanden in `public/fonts/`, werk `src/fontCss.ts`
bij en pas het token in `src/theme.ts` aan.

## Muziek toevoegen

Zet een audiobestand in `public/` en voeg in `src/NadorVideo.tsx` toe:

```tsx
import {Audio, staticFile} from 'remotion';

<Audio src={staticFile('muziek.mp3')} volume={0.6} />
```

## Cijfers in de video

- Inwoners stad Nador: 161.726 (volkstelling 2014)
- Mar Chica / Marchica: ± 115 km², Ramsar-gebied sinds 2005
- Gurugu (Gourougou): ± 890 m
- Nador — grensovergang Beni Ansar/Melilla: ± 13 km

De kaart is schematisch en niet op schaal; dat staat ook in beeld.
