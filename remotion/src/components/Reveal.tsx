import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/** Tekst die van onder een masker omhoog schuift. */
export const Reveal: React.FC<{
  delay?: number;
  distance?: number;
  damping?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({delay = 0, distance = 90, damping = 200, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({frame: frame - delay, fps, config: {damping, mass: 0.8, stiffness: 90}});

  return (
    <span style={{display: 'block', overflow: 'hidden', ...style}}>
      <span
        style={{
          display: 'block',
          transform: `translateY(${(1 - progress) * distance}px)`,
          opacity: interpolate(progress, [0, 0.35], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        {children}
      </span>
    </span>
  );
};

/** Zachte fade + lichte verschuiving, voor losse elementen. */
export const FadeUp: React.FC<{
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({delay = 0, distance = 40, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, mass: 0.7, stiffness: 80},
  });

  return (
    <div
      style={{
        transform: `translateY(${(1 - progress) * distance}px)`,
        opacity: progress,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
