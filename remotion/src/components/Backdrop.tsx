import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

/** Rustige donkerblauwe achtergrond met traag drijvende lichtvlekken. */
export const Backdrop: React.FC<{tint?: string}> = ({tint = COLORS.lagoon}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.night}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(140deg, ${COLORS.night} 0%, ${COLORS.deepSea} 55%, #08364a 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 45% at ${28 + Math.sin(frame * 0.012) * 6}% ${34 + Math.cos(frame * 0.01) * 8}%, ${tint}44 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 38% at ${76 + Math.cos(frame * 0.009) * 5}% ${72 + Math.sin(frame * 0.013) * 6}%, ${COLORS.sunset}2e 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Klein label met streepje, gebruikt boven elke sectiekop. */
export const Eyebrow: React.FC<{children: React.ReactNode; color?: string}> = ({
  children,
  color = COLORS.sun,
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 16, color}}>
    <div style={{width: 54, height: 2, background: color}} />
    <span style={{fontSize: 22, letterSpacing: 8, textTransform: 'uppercase', fontWeight: 400}}>
      {children}
    </span>
  </div>
);
