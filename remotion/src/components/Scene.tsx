import React from 'react';
import {AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame} from 'remotion';

const CROSSFADE = 15;

const Fade: React.FC<{duration: number; children: React.ReactNode}> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [0, CROSSFADE, duration - CROSSFADE, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)},
  );

  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

/** Een scène die in- en uitfadet en zo overlapt met de buren. */
export const Scene: React.FC<{
  from: number;
  duration: number;
  children: React.ReactNode;
}> = ({from, duration, children}) => (
  <Sequence from={from} durationInFrames={duration} layout="none">
    <Fade duration={duration}>{children}</Fade>
  </Sequence>
);
