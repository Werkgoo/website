import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

const Flamingo: React.FC<{phase: number; frame: number}> = ({phase, frame}) => {
  const neck = Math.sin(frame * 0.045 + phase) * 6;

  return (
    <g>
      <path d="M -6 0 L -9 52 M 12 0 L 17 52" stroke="#e0788f" strokeWidth={4} strokeLinecap="round" fill="none" />
      <ellipse cx={0} cy={-12} rx={38} ry={23} fill="#f6a3b3" />
      <path d="M 24 -22 Q 52 -26 60 -8 Q 40 -4 24 -10 Z" fill="#f7dfe3" />
      <path
        d={`M -20 -24 C ${-38 + neck} -54 ${-18 + neck} -86 ${-46 + neck} -98`}
        stroke="#f6a3b3"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={-46 + neck} cy={-100} r={9.5} fill="#f6a3b3" />
      <path d={`M ${-53 + neck} -98 L ${-72 + neck} -86 L ${-51 + neck} -91 Z`} fill="#22303c" />
    </g>
  );
};

const StandingFlamingo: React.FC<{x: number; y: number; scale: number; phase: number; frame: number}> = ({
  x,
  y,
  scale,
  phase,
  frame,
}) => {
  const bob = Math.sin(frame * 0.06 + phase) * 4;

  return (
    <g transform={`translate(${x} ${y + bob}) scale(${scale})`}>
      <ellipse cx={4} cy={54} rx={52} ry={9} fill="#0a6b7f" opacity={0.45} />
      <Flamingo phase={phase} frame={frame} />
    </g>
  );
};

/** Illustratie van de Mar Chica: skyline, zandbank, lagune en flamingo's. */
export const LagoonPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 45], [50, 0], {extrapolateRight: 'clamp'});

  return (
    <svg viewBox="0 0 900 760" width="100%" height="100%">
      <defs>
        <linearGradient id="skyPanel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f3a5c" />
          <stop offset="55%" stopColor="#4a6f8a" />
          <stop offset="100%" stopColor="#f0b479" />
        </linearGradient>
        <linearGradient id="lagoonWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6fdfcd" />
          <stop offset="45%" stopColor={COLORS.lagoon} />
          <stop offset="100%" stopColor="#0a6b7f" />
        </linearGradient>
        <radialGradient id="panelSun">
          <stop offset="0%" stopColor="#ffd79a" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#ffd79a" stopOpacity={0} />
        </radialGradient>
        <clipPath id="panelClip">
          <rect x="0" y="0" width="900" height="760" rx="30" />
        </clipPath>
      </defs>

      <g clipPath="url(#panelClip)">
        <rect x="0" y="0" width="900" height="760" fill="url(#skyPanel)" />
        <circle cx={648} cy={214} r={150} fill="url(#panelSun)" />
        <circle cx={648} cy={214} r={46} fill="#ffdca8" opacity={0.95} />

        {/* Gurugu en het Rif op de achtergrond */}
        <path
          d="M -20 306 L 92 196 L 190 252 L 286 168 L 404 246 L 500 208 L 620 268 L 760 232 L 920 296 L 920 320 L -20 320 Z"
          fill="#22536b"
          opacity={0.9}
        />

        {/* Skyline van de Corniche op de verre oever */}
        <g fill="#123f57">
          <rect x={40} y={272} width={26} height={34} />
          <rect x={72} y={282} width={18} height={24} />
          <rect x={96} y={264} width={30} height={42} />
          <rect x={132} y={286} width={22} height={20} />
          <rect x={162} y={276} width={16} height={30} />
          <rect x={186} y={252} width={9} height={54} />
          <path d="M 186 252 L 190.5 238 L 195 252 Z" />
          <rect x={206} y={284} width={28} height={22} />
          <rect x={242} y={274} width={18} height={32} />
        </g>

        {/* open zee achter de zandbank */}
        <rect x="0" y="306" width="900" height="52" fill="#15697f" />
        {new Array(3).fill(true).map((_, i) => (
          <path
            key={i}
            d={`M -20 ${320 + i * 14} C 220 ${314 + i * 14 + Math.sin(frame * 0.05 + i) * 4} 560 ${326 + i * 14} 920 ${318 + i * 14}`}
            stroke="#a6dfeb"
            strokeWidth={1.5}
            fill="none"
            opacity={0.3}
          />
        ))}

        {/* zandbank met de Bocana */}
        <path d="M -20 358 L 392 352 L 438 358 L 920 348 L 920 392 L -20 400 Z" fill={COLORS.sand} />
        <path d="M -20 358 L 392 352 L 438 358 L 920 348" stroke="#e5c48c" strokeWidth={3} fill="none" />
        <path d="M 402 350 L 428 400" stroke="#15697f" strokeWidth={20} />
        <text x={452} y={338} fill="#0b3a4a" fontFamily="Outfit, sans-serif" fontSize={22} fontWeight={600}>
          Bocana
        </text>
        <path d="M 440 344 L 424 360" stroke="#0b3a4a" strokeWidth={2} fill="none" opacity={0.7} />

        {/* de lagune zelf */}
        <rect x="-20" y="392" width="940" height="380" fill="url(#lagoonWater)" />
        {new Array(10).fill(true).map((_, i) => {
          const y = 414 + i * 36;
          return (
            <path
              key={i}
              d={`M -20 ${y} C 180 ${y - 9 + Math.sin(frame * 0.07 + i) * 5} 560 ${y + 11} 920 ${y - 5}`}
              stroke="#ffffff"
              strokeWidth={2.2}
              fill="none"
              opacity={0.17}
            />
          );
        })}

        {/* ondiepe oever op de voorgrond */}
        <path d="M -20 690 C 220 668 520 706 940 682 L 940 780 L -20 780 Z" fill="#0e7f8b" opacity={0.55} />

        {/* flamingo's in de ondiepe oever */}
        <g transform={`translate(0 ${rise})`}>
          <StandingFlamingo x={218} y={584} scale={0.95} phase={0} frame={frame} />
          <StandingFlamingo x={706} y={606} scale={1.08} phase={3.1} frame={frame} />
          <StandingFlamingo x={412} y={672} scale={1.38} phase={1.7} frame={frame} />
        </g>

        {/* rietpollen langs de oever */}
        <g stroke="#14606b" strokeWidth={3} strokeLinecap="round" opacity={0.75}>
          <path d="M 70 760 C 66 720 58 700 46 684 M 84 760 C 82 722 78 702 70 688 M 100 760 C 100 726 100 706 96 690" fill="none" />
          <path d="M 848 760 C 844 726 838 706 828 692 M 862 760 C 860 728 856 708 850 694" fill="none" />
        </g>
      </g>

      <rect x="1" y="1" width="898" height="758" rx="30" fill="none" stroke="rgba(253,247,236,0.35)" strokeWidth={2} />
    </svg>
  );
};
