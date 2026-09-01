import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

type Variant = 'dawn' | 'dusk';

const PALETTES: Record<Variant, {sky: string[]; sun: string; water: string[]}> = {
  dawn: {
    sky: ['#0a2a44', '#1d5677', '#f0a05f', '#ffd9a0'],
    sun: '#ffd08a',
    water: ['#0b4a68', '#0d6c86', '#16a6a0'],
  },
  dusk: {
    sky: ['#12203f', '#5b3663', '#d9603f', '#ffb26b'],
    sun: '#ffb057',
    water: ['#122b46', '#194f6c', '#2f8f92'],
  },
};

const HORIZON = 560;

/** Eén golfband: een sinusgolf die langzaam naar links schuift. */
const WaveBand: React.FC<{
  y: number;
  amplitude: number;
  wavelength: number;
  speed: number;
  color: string;
  opacity: number;
  frame: number;
}> = ({y, amplitude, wavelength, speed, color, opacity, frame}) => {
  const phase = (frame * speed) / 30;
  const points: string[] = [];
  for (let x = -80; x <= 2000; x += 40) {
    const wave =
      Math.sin(x / wavelength + phase) * amplitude +
      Math.sin(x / (wavelength * 0.43) + phase * 1.7) * amplitude * 0.35;
    points.push(`${x},${(y + wave).toFixed(2)}`);
  }

  return (
    <path
      d={`M -80,1200 L -80,${y} L ${points.join(' L ')} L 2000,1200 Z`}
      fill={color}
      opacity={opacity}
    />
  );
};


const Bird: React.FC<{x: number; y: number; scale: number; frame: number; speed: number}> = ({
  x,
  y,
  scale,
  frame,
  speed,
}) => {
  const flap = Math.sin(frame * 0.28 + x) * 6;
  const drift = ((frame * speed) % 2200) - 200;
  return (
    <g transform={`translate(${x + drift} ${y + Math.sin(frame * 0.05 + x) * 8}) scale(${scale})`}>
      <path
        d={`M -22 0 Q -11 ${-10 - flap} 0 -1 Q 11 ${-10 - flap} 22 0`}
        fill="none"
        stroke="rgba(9,26,40,0.55)"
        strokeWidth={3.4}
        strokeLinecap="round"
      />
    </g>
  );
};

/**
 * De Middellandse Zee bij Nador: bergsilhouetten van de Gurugu, de lagune
 * en een zon die traag boven de horizon hangt.
 */
export const Seascape: React.FC<{variant?: Variant}> = ({variant = 'dawn'}) => {
  const frame = useCurrentFrame();
  const palette = PALETTES[variant];
  const sunY = interpolate(frame, [0, 165], variant === 'dawn' ? [470, 400] : [400, 455], {
    extrapolateRight: 'clamp',
  });
  const shimmer = Math.sin(frame * 0.11) * 10;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${palette.sky[0]} 0%, ${palette.sky[1]} 34%, ${palette.sky[2]} 76%, ${palette.sky[3]} 100%)`,
        }}
      />
      <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor={palette.sun} stopOpacity={0.95} />
            <stop offset="45%" stopColor={palette.sun} stopOpacity={0.28} />
            <stop offset="100%" stopColor={palette.sun} stopOpacity={0} />
          </radialGradient>
          <linearGradient id="seaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.water[1]} />
            <stop offset="55%" stopColor={palette.water[0]} />
            <stop offset="100%" stopColor={COLORS.night} />
          </linearGradient>
          <clipPath id="seaClip">
            <rect x="0" y={HORIZON} width="1920" height={1080 - HORIZON} />
          </clipPath>
        </defs>

        {/* Zon en gloed */}
        <circle cx={1290} cy={sunY} r={330} fill="url(#sunGlow)" />
        <circle cx={1290} cy={sunY} r={86} fill={palette.sun} opacity={0.95} />

        {/* Bergen van het Rif: de Gurugu domineert de skyline van Nador */}
        <path
          d={`M -40 ${HORIZON} L 210 402 L 372 470 L 560 372 L 742 468 L 980 430 L 1180 496 L 1420 452 L 1700 508 L 1960 470 L 1960 ${HORIZON} Z`}
          fill={variant === 'dawn' ? '#123a4f' : '#1a2740'}
          opacity={0.9}
        />
        <path
          d={`M -40 ${HORIZON} L 260 486 L 520 452 L 820 512 L 1120 478 L 1460 522 L 1960 492 L 1960 ${HORIZON} Z`}
          fill={variant === 'dawn' ? '#0d2c40' : '#141d33'}
        />

        {/* Water */}
        <rect x="0" y={HORIZON} width="1920" height={1080 - HORIZON} fill="url(#seaFill)" />
        <g clipPath="url(#seaClip)">
          {/* Zonnepad op het water */}
          <g opacity={0.6}>
            {new Array(16).fill(true).map((_, i) => {
              const y = HORIZON + 14 + i * 30;
              const w = 34 + i * 22 + Math.sin(frame * 0.14 + i) * 16;
              return (
                <ellipse
                  key={i}
                  cx={1290 + Math.sin(frame * 0.07 + i * 0.9) * (6 + i * 1.6) + shimmer * 0.2}
                  cy={y}
                  rx={w}
                  ry={4 + i * 0.5}
                  fill={palette.sun}
                  opacity={0.34 - i * 0.017}
                />
              );
            })}
          </g>
          <WaveBand y={HORIZON + 58} amplitude={5} wavelength={210} speed={0.9} color={palette.water[0]} opacity={0.75} frame={frame} />
          <WaveBand y={HORIZON + 146} amplitude={8} wavelength={260} speed={1.3} color={COLORS.deepSea} opacity={0.85} frame={frame} />
          <WaveBand y={HORIZON + 262} amplitude={12} wavelength={320} speed={1.8} color="#05233a" opacity={0.92} frame={frame} />
          <WaveBand y={HORIZON + 392} amplitude={17} wavelength={380} speed={2.4} color="#041a2c" opacity={0.96} frame={frame} />
          {/* schuimlijnen die met de golven meelopen */}
          {new Array(5).fill(true).map((_, i) => {
            const y = HORIZON + 96 + i * 96;
            return (
              <path
                key={i}
                d={`M -60 ${y} C 380 ${y - 12 + Math.sin(frame * 0.06 + i) * 6} 1180 ${y + 14} 1980 ${y - 6}`}
                stroke={palette.water[2]}
                strokeWidth={2.2}
                fill="none"
                opacity={0.22}
              />
            );
          })}
        </g>

        {/* Vissersboten op de rede */}
        <g opacity={0.75} fill="#04182b">
          <g transform={`translate(${430 + Math.sin(frame * 0.03) * 6} ${HORIZON + 34 + Math.sin(frame * 0.09) * 2})`}>
            <path d="M -30 0 L 30 0 L 22 12 L -22 12 Z" />
            <rect x={-3} y={-26} width={4} height={26} />
            <path d="M 2 -26 L 22 -4 L 2 -4 Z" />
          </g>
          <g transform={`translate(${1620 + Math.cos(frame * 0.025) * 5} ${HORIZON + 66 + Math.cos(frame * 0.08) * 2})`} opacity={0.6}>
            <path d="M -22 0 L 22 0 L 16 9 L -16 9 Z" />
            <rect x={-2} y={-20} width={3} height={20} />
            <path d="M 1 -20 L 16 -3 L 1 -3 Z" />
          </g>
        </g>

        {/* Voorgrond: donkere oever in de schaduw */}
        <g fill="#03101d">
          <path
            d={`M -60 1120 L -60 ${1024 + Math.sin(frame * 0.03) * 3} C 340 996 780 1038 1180 1016 C 1500 998 1760 1032 1980 1010 L 1980 1120 Z`}
            opacity={0.96}
          />
        </g>

        {/* Meeuwen boven de lagune */}
        <Bird x={120} y={250} scale={1} frame={frame} speed={1.4} />
        <Bird x={330} y={190} scale={0.7} frame={frame} speed={1.1} />
        <Bird x={520} y={296} scale={0.5} frame={frame} speed={0.8} />
      </svg>
    </AbsoluteFill>
  );
};
