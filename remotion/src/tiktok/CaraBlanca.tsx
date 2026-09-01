import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Fonts} from '../components/Fonts';
import {COLORS, FONTS} from '../theme';

const HANDLE = '@Nadorspot';
const FADE = 8;

type Shot = {
  src: string;
  /** Startpunt in de bronclip, in seconden. */
  trim: number;
  from: number;
  duration: number;
  zoom: [number, number];
  pan: [number, number];
};

/** De montage: twee clips, om en om, met een trage push-in per shot. */
const SHOTS: Shot[] = [
  {src: 'footage/carablanca-1.mov', trim: 0.15, from: 0, duration: 94, zoom: [1.06, 1.14], pan: [0, -12]},
  {src: 'footage/carablanca-2.mov', trim: 1.5, from: 86, duration: 108, zoom: [1.14, 1.05], pan: [10, 0]},
  {src: 'footage/carablanca-1.mov', trim: 5.1, from: 186, duration: 102, zoom: [1.05, 1.13], pan: [-8, 6]},
  {src: 'footage/carablanca-2.mov', trim: 5.85, from: 280, duration: 93, zoom: [1.12, 1.04], pan: [6, -6]},
];

export const CARA_BLANCA_DURATION = 373;

const Clip: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, FADE, shot.duration - FADE, shot.duration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)},
  );
  const progress = frame / shot.duration;
  const scale = interpolate(progress, [0, 1], shot.zoom);
  const x = interpolate(progress, [0, 1], [0, shot.pan[0]]);
  const y = interpolate(progress, [0, 1], [0, shot.pan[1]]);

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          filter: 'saturate(1.14) contrast(1.06) brightness(1.02)',
        }}
      >
        <OffthreadVideo
          src={staticFile(shot.src)}
          trimBefore={Math.round(shot.trim * fps)}
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Ondertitel-achtige caption onderin, binnen de veilige zone van TikTok. */
const Caption: React.FC<{text: string; accent?: string}> = ({text, accent = COLORS.cream}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200, mass: 0.7, stiffness: 90}});

  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        right: 120,
        bottom: 470,
        transform: `translateY(${(1 - enter) * 40}px)`,
        opacity: enter,
      }}
    >
      <div
        style={{
          display: 'inline-block',
          fontFamily: FONTS.ui,
          fontSize: 62,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1.16,
          whiteSpace: 'pre-line',
          color: accent,
          textShadow: '0 6px 30px rgba(3,16,28,0.6), 0 2px 6px rgba(3,16,28,0.5)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Watermark: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 96,
      left: 56,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '14px 26px 14px 20px',
      borderRadius: 999,
      background: 'rgba(6,24,38,0.42)',
      border: '1px solid rgba(253,247,236,0.25)',
      fontFamily: FONTS.ui,
      color: COLORS.cream,
      fontSize: 29,
      fontWeight: 600,
      letterSpacing: '-0.01em',
    }}
  >
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
        stroke={COLORS.sun}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" fill={COLORS.sun} />
    </svg>
    {HANDLE}
  </div>
);

const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({frame: frame - 6, fps, config: {damping: 200, mass: 0.9, stiffness: 80}});
  const sub = spring({frame: frame - 20, fps, config: {damping: 200}});
  const rule = spring({frame: frame - 16, fps, config: {damping: 200}});
  const out = interpolate(frame, [76, 94], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: COLORS.cream,
        opacity: out,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.impact,
          fontSize: 158,
          letterSpacing: 2,
          lineHeight: 0.92,
          transform: `translateY(${(1 - title) * 60}px) scale(${0.94 + title * 0.06})`,
          opacity: title,
          textShadow: '0 10px 40px rgba(3,16,28,0.55)',
        }}
      >
        CARA
        <br />
        BLANCA
      </div>
      <div
        style={{
          width: rule * 320,
          height: 3,
          background: COLORS.sun,
          margin: '34px 0 28px',
        }}
      />
      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: 10,
          textTransform: 'uppercase',
          opacity: sub,
          transform: `translateY(${(1 - sub) * 26}px)`,
          textShadow: '0 6px 24px rgba(3,16,28,0.6)',
        }}
      >
        Nador · Marokko
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200, mass: 0.8, stiffness: 70}});
  const sub = spring({frame: frame - 14, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 520}}>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,18,30,0) 22%, rgba(4,18,30,0.55) 52%, rgba(4,18,30,0.93) 100%)',
          opacity: enter,
        }}
      />
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          color: COLORS.cream,
          transform: `translateY(${(1 - enter) * 50}px)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.impact,
            fontSize: 104,
            letterSpacing: 1,
            textShadow: '0 8px 34px rgba(3,16,28,0.75)',
          }}
        >
          {HANDLE}
        </div>
        <div
          style={{
            marginTop: 22,
            fontFamily: FONTS.ui,
            fontSize: 34,
            fontWeight: 500,
            letterSpacing: 1,
            color: 'rgba(253,247,236,0.9)',
            textShadow: '0 4px 20px rgba(3,16,28,0.75)',
            opacity: sub,
          }}
        >
          volg voor meer plekken in en rond Nador
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CaraBlanca: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COLORS.night}}>
    <Fonts />

    {SHOTS.map((shot, i) => (
      <Sequence key={i} from={shot.from} durationInFrames={shot.duration} layout="none">
        <Clip shot={shot} />
      </Sequence>
    ))}

    {/* Vignet zodat de tekst altijd leesbaar blijft */}
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(4,18,30,0.34) 0%, rgba(4,18,30,0) 26%, rgba(4,18,30,0) 62%, rgba(4,18,30,0.42) 100%)',
      }}
    />

    <Sequence from={0} durationInFrames={94} layout="none">
      <Hook />
    </Sequence>
    <Sequence from={98} durationInFrames={86} layout="none">
      <Caption text={'water als\neen zwembad'} />
    </Sequence>
    <Sequence from={192} durationInFrames={88} layout="none">
      <Caption text={'witte rotsplateaus\nom op te chillen'} />
    </Sequence>
    <Sequence from={284} durationInFrames={44} layout="none">
      <Caption text={'en dit ligt\ngewoon bij Nador'} />
    </Sequence>
    <Sequence from={313} durationInFrames={60} layout="none">
      <EndCard />
    </Sequence>

    <Watermark />
  </AbsoluteFill>
);
