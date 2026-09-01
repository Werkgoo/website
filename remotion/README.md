# Nador — Remotion-video's

Twee composities in één Remotion-project:

| Compositie | Formaat | Duur | Bestand |
|---|---|---|---|
| `NadorVideo` | 1920×1080 | 31,5 s | `out/nador.mp4` |
| `CaraBlancaTikTok` | 1080×1920 | 12,4 s | `out/nadorspot-carablanca.mp4` |

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

## Gebruik

```bash
npm install
npm start          # Remotion Studio, live preview op http://localhost:3000
npm run build      # rendert out/nador.mp4
npm run build:tiktok   # rendert out/nadorspot-carablanca.mp4
```

Rendert de CLI in een container zonder eigen Chrome, geef dan een browser mee:

```bash
npx remotion render NadorVideo out/nador.mp4 \
  --browser-executable=/pad/naar/chrome-headless-shell
```

## Fonts

Outfit en Instrument Serif staan als `.woff2` in `public/fonts/`. De
`@font-face`-regels zitten in `src/fontCss.ts` en worden door
`src/components/Fonts.tsx` ingeladen — er gaat tijdens het renderen dus geen
verkeer naar Google Fonts.

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
