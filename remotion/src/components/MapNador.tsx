import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../theme';

const LAND = `M -40 300
  C 90 292 180 324 260 314
  C 330 306 384 332 420 322
  C 428 268 448 214 476 186
  C 500 162 546 158 566 192
  C 588 232 584 286 596 314
  C 636 322 664 306 700 300
  C 780 288 860 308 1040 296
  L 1040 820 L -40 820 Z`;

const LAGOON =
  'M 646 376 C 682 348 762 348 802 374 C 836 396 830 442 800 462 C 756 490 676 488 646 460 C 618 436 618 396 646 376 Z';

type Marker = {
  x: number;
  y: number;
  label: string;
  sub?: string;
  anchor: 'start' | 'end';
  dy: number;
};

const MARKERS: Marker[] = [
  {x: 600, y: 482, label: 'NADOR', anchor: 'end', dy: 12},
  {x: 672, y: 298, label: 'Beni Ansar', sub: 'haven & grens', anchor: 'start', dy: -34},
  {x: 606, y: 306, label: 'Melilla', sub: 'Spanje', anchor: 'end', dy: -22},
  {x: 524, y: 168, label: 'Cap des Trois Fourches', anchor: 'start', dy: -12},
  {x: 706, y: 580, label: 'El Aroui', sub: 'luchthaven', anchor: 'start', dy: 8},
  {x: 152, y: 318, label: 'Al Hoceima', anchor: 'start', dy: 38},
  {x: 906, y: 640, label: 'Oujda', anchor: 'end', dy: 8},
];

/** Schematische kaart van de Rifkust rond Nador. */
export const MapNador: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const coast = spring({frame: frame - 8, fps, config: {damping: 200, mass: 1.4}});
  const lagoonIn = spring({frame: frame - 34, fps, config: {damping: 200}});
  const route = spring({frame: frame - 82, fps, config: {damping: 200, mass: 1.2}});
  const pulse = (frame % 45) / 45;

  return (
    <svg viewBox="0 0 1000 760" width="100%" height="100%">
      <defs>
        <linearGradient id="landFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a5a4f" />
          <stop offset="100%" stopColor="#0a2b33" />
        </linearGradient>
        <linearGradient id="seaFillMap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a3450" />
          <stop offset="100%" stopColor="#0d4b66" />
        </linearGradient>
        <linearGradient id="lagoonFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COLORS.lagoonLight} />
          <stop offset="100%" stopColor={COLORS.lagoon} />
        </linearGradient>
        <clipPath id="mapClip">
          <rect x="2" y="2" width="996" height="756" rx="30" />
        </clipPath>
      </defs>

      <g clipPath="url(#mapClip)">
        <rect x="0" y="0" width="1000" height="760" fill="url(#seaFillMap)" />

        {/* Middellandse Zee */}
        <g opacity={0.55}>
          {new Array(6).fill(true).map((_, i) => {
            const y = 54 + i * 40;
            const shift = Math.sin(frame * 0.03 + i) * 14;
            return (
              <path
                key={i}
                d={`M ${-40 + shift} ${y} C 260 ${y - 18} 640 ${y + 20} 1060 ${y - 8}`}
                stroke={COLORS.seaLight}
                strokeWidth={1.6}
                fill="none"
                opacity={0.3}
                strokeDasharray="28 24"
              />
            );
          })}
        </g>

        {/* Land */}
        <g opacity={interpolate(coast, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'})}>
          <path d={LAND} fill="url(#landFill)" />
          <text
            x={132}
            y={584}
            fill="rgba(253,247,236,0.14)"
            fontFamily={FONTS.ui}
            fontSize={46}
            fontWeight={600}
            letterSpacing={14}
          >
            MAROKKO
          </text>
          {/* hoogtelijnen van het Rif */}
          <g stroke="rgba(253,247,236,0.09)" strokeWidth={1.6} fill="none">
            <path d="M -20 386 C 160 356 330 412 470 384 C 600 358 760 404 1020 372" />
            <path d="M -20 458 C 180 430 320 486 480 456 C 640 426 800 470 1020 444" />
            <path d="M -20 534 C 200 508 340 560 500 530 C 660 500 820 542 1020 518" />
          </g>
          {/* de Gurugu, pal boven de baai */}
          <g opacity={0.8}>
            <path d="M 470 366 L 502 322 L 534 366 Z" fill="rgba(253,247,236,0.28)" />
            <text
              x={502}
              y={392}
              textAnchor="middle"
              fill="rgba(253,247,236,0.6)"
              fontFamily={FONTS.ui}
              fontSize={18}
              fontWeight={300}
            >
              Gurugu
            </text>
          </g>
        </g>
        <path
          d={LAND}
          fill="none"
          stroke={COLORS.sand}
          strokeWidth={2.4}
          strokeDasharray={3400}
          strokeDashoffset={(1 - coast) * 3400}
          opacity={0.85}
        />

        {/* Mar Chica */}
        <g style={{transformOrigin: '724px 418px', transform: `scale(${0.62 + lagoonIn * 0.38})`, opacity: lagoonIn}}>
          <path d={LAGOON} fill="url(#lagoonFill)" opacity={0.94} />
          <path d={LAGOON} fill="none" stroke={COLORS.cream} strokeWidth={1.6} opacity={0.45} />
          {/* Bocana: de enige opening naar zee */}
          <path d="M 790 362 L 812 306" stroke={COLORS.lagoonLight} strokeWidth={8} strokeLinecap="round" />
          <text
            x={724}
            y={426}
            textAnchor="middle"
            fill="#05302e"
            fontFamily={FONTS.ui}
            fontSize={22}
            fontWeight={600}
            letterSpacing={1.5}
          >
            MAR CHICA
          </text>
        </g>

        {/* Route Nador — Melilla */}
        <g opacity={route}>
          <path
            d="M 600 482 C 588 424 596 362 606 310"
            stroke={COLORS.sun}
            strokeWidth={2.6}
            fill="none"
            strokeDasharray="10 10"
            strokeDashoffset={-frame * 0.9}
          />
          <text
            x={578}
            y={410}
            textAnchor="end"
            fill={COLORS.sun}
            fontFamily={FONTS.ui}
            fontSize={19}
            fontWeight={500}
          >
            ± 13 km
          </text>
        </g>

        {/* Plaatsen */}
        {MARKERS.map((m, i) => {
          const appear = spring({frame: frame - 46 - i * 5, fps, config: {damping: 14, stiffness: 120}});
          const isNador = m.label === 'NADOR';
          const tx = m.x + (m.anchor === 'end' ? -20 : 20);
          return (
            <g key={m.label} opacity={Math.min(1, appear * 1.2)}>
              {isNador ? (
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={12 + pulse * 36}
                  fill="none"
                  stroke={COLORS.sun}
                  strokeWidth={2}
                  opacity={(1 - pulse) * 0.7}
                />
              ) : null}
              <circle
                cx={m.x}
                cy={m.y}
                r={(isNador ? 11 : 6) * Math.min(1.2, appear)}
                fill={isNador ? COLORS.sun : COLORS.cream}
                stroke={isNador ? '#7a3a12' : 'none'}
                strokeWidth={2}
              />
              <text
                x={tx}
                y={m.y + m.dy}
                textAnchor={m.anchor}
                fill={isNador ? COLORS.sun : COLORS.cream}
                fontFamily={FONTS.ui}
                fontSize={isNador ? 36 : 21}
                fontWeight={isNador ? 700 : 400}
                letterSpacing={isNador ? 3 : 0.5}
              >
                {m.label}
              </text>
              {m.sub ? (
                <text
                  x={tx}
                  y={m.y + m.dy + 24}
                  textAnchor={m.anchor}
                  fill="rgba(253,247,236,0.62)"
                  fontFamily={FONTS.ui}
                  fontSize={17}
                  fontWeight={300}
                >
                  {m.sub}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Kompas */}
        <g opacity={0.5} transform="translate(940 100)">
          <path d="M 0 -30 L 9 8 L 0 0 L -9 8 Z" fill={COLORS.cream} />
          <text
            x={0}
            y={32}
            textAnchor="middle"
            fill={COLORS.cream}
            fontFamily={FONTS.ui}
            fontSize={17}
            letterSpacing={1}
          >
            N
          </text>
        </g>

        <text x={44} y={122} fill="rgba(253,247,236,0.55)" fontFamily={FONTS.ui} fontSize={19} letterSpacing={6}>
          MIDDELLANDSE ZEE
        </text>
        <text x={44} y={712} fill="rgba(253,247,236,0.35)" fontFamily={FONTS.ui} fontSize={15} letterSpacing={2}>
          schematische kaart
        </text>
      </g>

      <rect x="2" y="2" width="996" height="756" rx="30" fill="none" stroke="rgba(253,247,236,0.22)" strokeWidth={2} />
    </svg>
  );
};
