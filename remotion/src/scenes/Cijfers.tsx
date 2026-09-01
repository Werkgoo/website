import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Backdrop, Eyebrow} from '../components/Backdrop';
import {FadeUp, Reveal} from '../components/Reveal';
import {COLORS, FONTS} from '../theme';

type Stat = {value: number; suffix?: string; prefix?: string; label: string; note: string; decimals?: number};

const STATS: Stat[] = [
  {value: 161726, label: 'inwoners', note: 'stad Nador, volkstelling 2014'},
  {value: 115, suffix: ' km²', label: 'Mar Chica', note: 'oppervlakte van de lagune'},
  {value: 890, suffix: ' m', label: 'Gurugu', note: 'de berg boven de baai'},
  {value: 13, suffix: ' km', label: 'tot Melilla', note: 'grensovergang Beni Ansar'},
];

const Counter: React.FC<{stat: Stat; delay: number; index: number}> = ({stat, delay, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({frame: frame - delay, fps, config: {damping: 200, mass: 1.1, stiffness: 60}});
  const value = interpolate(progress, [0, 1], [0, stat.value]);
  const shown = Math.round(value).toLocaleString('nl-NL');

  return (
    <FadeUp delay={delay} distance={44} style={{flex: 1}}>
      <div
        style={{
          padding: '44px 38px 40px',
          borderRadius: 26,
          background: 'rgba(253,247,236,0.07)',
          border: '1px solid rgba(253,247,236,0.16)',
          height: 420,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          backdropFilter: 'blur(2px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 20,
            letterSpacing: 4,
            color: 'rgba(253,247,236,0.45)',
            marginBottom: 'auto',
          }}
        >
          {String(index + 1).padStart(2, '0')}
          <span style={{flex: 1, height: 1, background: 'rgba(253,247,236,0.22)'}} />
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 700,
            color: COLORS.sun,
            letterSpacing: -2,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {stat.prefix ?? ''}
          {shown}
          {stat.suffix ?? ''}
        </div>
        <div style={{fontSize: 34, fontWeight: 500, marginTop: 18}}>{stat.label}</div>
        <div style={{fontSize: 21, fontWeight: 300, color: 'rgba(253,247,236,0.62)', marginTop: 10}}>
          {stat.note}
        </div>
      </div>
    </FadeUp>
  );
};

export const Cijfers: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONTS.display, color: COLORS.cream}}>
    <Backdrop tint={COLORS.sunset} />

    <AbsoluteFill style={{padding: '96px 96px', justifyContent: 'center'}}>
      <FadeUp delay={2} distance={22}>
        <Eyebrow>In cijfers</Eyebrow>
      </FadeUp>

      <Reveal delay={10} distance={120} style={{marginTop: 22, marginBottom: 66}}>
        <h1 style={{fontSize: 96, fontWeight: 700, margin: 0, letterSpacing: -1}}>
          Nador in vier getallen
        </h1>
      </Reveal>

      <div style={{display: 'flex', gap: 28}}>
        {STATS.map((stat, i) => (
          <Counter key={stat.label} stat={stat} delay={26 + i * 10} index={i} />
        ))}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
