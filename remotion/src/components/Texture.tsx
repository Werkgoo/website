import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Filmische korrel + vignet over de hele video. */
export const Texture: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(120% 90% at 50% 45%, rgba(0,0,0,0) 45%, rgba(3,14,24,0.42) 100%)',
      }}
    />
    <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: 0.16, mixBlendMode: 'overlay'}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);
