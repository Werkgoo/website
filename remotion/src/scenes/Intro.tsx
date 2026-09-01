import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Seascape} from '../components/Seascape';
import {FadeUp, Reveal} from '../components/Reveal';
import {COLORS, FONTS} from '../theme';

const TITLE = 'NADOR';

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = interpolate(frame, [0, 165], [1.04, 1.12]);
  const ruleWidth = spring({frame: frame - 52, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.night}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Seascape variant="dawn" />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,20,34,0.5) 0%, rgba(4,20,34,0.05) 42%, rgba(4,20,34,0.55) 100%)',
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(46% 40% at 50% 46%, rgba(3,16,28,0.45) 0%, rgba(3,16,28,0) 72%)',
        }}
      />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONTS.display,
          color: COLORS.cream,
          textAlign: 'center',
        }}
      >
        <FadeUp delay={6} distance={20}>
          <div
            style={{
              fontFamily: FONTS.ui,
              fontSize: 24,
              letterSpacing: 12,
              textTransform: 'uppercase',
              fontWeight: 500,
              color: COLORS.sand,
              marginBottom: 26,
            }}
          >
            Noordoost-Marokko · Rifkust
          </div>
        </FadeUp>

        <div style={{display: 'flex', gap: 6}}>
          {TITLE.split('').map((letter, i) => (
            <Reveal key={i} delay={12 + i * 4} distance={200} style={{lineHeight: 0.94}}>
              <span
                style={{
                  fontSize: 250,
                  fontWeight: 800,
                  letterSpacing: 4,
                }}
              >
                {letter}
              </span>
            </Reveal>
          ))}
        </div>

        <div
          style={{
            width: ruleWidth * 560,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${COLORS.sand}, transparent)`,
            margin: '28px 0 26px',
          }}
        />

        <FadeUp delay={62} distance={26}>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontSize: 62,
              color: COLORS.cream,
              opacity: 0.94,
              direction: 'rtl',
            }}
          >
            الناظور
          </div>
        </FadeUp>

        <FadeUp delay={78} distance={26}>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONTS.ui,
              fontSize: 30,
              fontWeight: 400,
              letterSpacing: 1,
              color: 'rgba(253,247,236,0.86)',
            }}
          >
            Waar het Rifgebergte de Middellandse Zee raakt
          </div>
        </FadeUp>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
