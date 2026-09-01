import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Seascape} from '../components/Seascape';
import {FadeUp} from '../components/Reveal';
import {COLORS, FONTS} from '../theme';

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = interpolate(frame, [0, 165], [1.12, 1.02]);
  const rule = spring({frame: frame - 34, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.night}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Seascape variant="dusk" />
      </AbsoluteFill>

      <AbsoluteFill
        style={{background: 'linear-gradient(180deg, rgba(4,16,30,0.5), rgba(4,16,30,0.15) 50%, rgba(4,16,30,0.62))'}}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: FONTS.display,
          color: COLORS.cream,
        }}
      >
        <FadeUp delay={6} distance={30}>
          <div style={{fontSize: 118, fontWeight: 700, letterSpacing: 10}}>NADOR</div>
        </FadeUp>

        <div
          style={{
            width: rule * 420,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.sand}, transparent)`,
            margin: '24px 0 28px',
          }}
        />

        <FadeUp delay={40} distance={26}>
          <div style={{fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 66, opacity: 0.95}}>
            parel aan de Rifkust
          </div>
        </FadeUp>

        <FadeUp delay={62} distance={22}>
          <div
            style={{
              marginTop: 40,
              fontFamily: FONTS.ui,
              fontSize: 23,
              fontWeight: 500,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: 'rgba(253,247,236,0.75)',
            }}
          >
            Mar Chica · Gurugu · Middellandse Zee
          </div>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
