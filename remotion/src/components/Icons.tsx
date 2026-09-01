import React from 'react';
import {COLORS} from '../theme';

const S = {
  fill: 'none',
  stroke: COLORS.sun,
  strokeWidth: 3.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const IconPalm: React.FC = () => (
  <svg viewBox="0 0 100 100" width={92} height={92}>
    <path d="M50 88 C 48 62 46 48 42 34" {...S} />
    <path d="M42 32 C 28 22 16 26 10 36 C 24 32 34 34 42 40" {...S} />
    <path d="M42 32 C 56 20 72 24 80 36 C 66 30 54 34 44 40" {...S} />
    <path d="M42 32 C 40 18 48 8 60 6 C 54 16 50 24 48 34" {...S} />
    <path d="M18 88 H 86" {...S} />
    <path d="M62 88 V 70 H 82 V 88" {...S} />
  </svg>
);

export const IconLighthouse: React.FC = () => (
  <svg viewBox="0 0 100 100" width={92} height={92}>
    <path d="M36 88 L 42 40 H 60 L 66 88 Z" {...S} />
    <path d="M40 56 H 62 M 38 70 H 64" {...S} />
    <path d="M42 40 H 60 V 28 H 42 Z" {...S} />
    <path d="M46 28 L 51 16 L 56 28" {...S} />
    <path d="M28 22 L 14 14 M 74 22 L 88 14 M 24 34 L 10 34 M 78 34 L 92 34" {...S} opacity={0.65} />
    <path d="M20 88 H 82" {...S} />
  </svg>
);

export const IconMountain: React.FC = () => (
  <svg viewBox="0 0 100 100" width={92} height={92}>
    <path d="M8 80 L 36 34 L 54 60 L 66 44 L 92 80 Z" {...S} />
    <path d="M28 48 L 36 42 L 44 50" {...S} />
    <circle cx={74} cy={22} r={9} {...S} />
  </svg>
);

export const IconTajine: React.FC = () => (
  <svg viewBox="0 0 100 100" width={92} height={92}>
    {/* schaal */}
    <path d="M12 74 H 88" {...S} />
    <path d="M18 62 C 18 72 30 78 50 78 C 70 78 82 72 82 62 Z" {...S} />
    <path d="M18 62 H 82" {...S} />
    {/* kegelvormig deksel */}
    <path d="M24 62 C 26 40 36 24 50 24 C 64 24 74 40 76 62" {...S} />
    <path d="M50 24 V 14" {...S} />
    <circle cx={50} cy={11} r={4} {...S} />
  </svg>
);

export const IconFerry: React.FC = () => (
  <svg viewBox="0 0 100 100" width={92} height={92}>
    <path d="M14 68 H 86 L 76 84 H 24 Z" {...S} />
    <path d="M28 68 V 50 H 72 V 68" {...S} />
    <path d="M38 50 V 40 H 62 V 50" {...S} />
    <path d="M46 40 V 30 H 56" {...S} />
    <path d="M10 90 C 20 84 28 96 38 90 C 48 84 56 96 66 90 C 76 84 82 94 92 90" {...S} opacity={0.6} />
  </svg>
);
