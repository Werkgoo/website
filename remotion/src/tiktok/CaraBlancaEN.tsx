import React from 'react';
import {
  AbsoluteFill,
  Audio,
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
const CLIP_A = 'footage/carablanca-1.mov';
const CLIP_B = 'footage/carablanca-2.mov';

type Shot = {
  src: string;
  /** Startpunt in de bronclip, in seconden. */
  trim: number;
  from: number;
  duration: number;
  zoom: [number, number];
  pan: [number, number];
};

/**
 * Snelle montage: zes shots, om en om uit beide clips, met een korte
 * cross-fade en een punch-in op elke snede.
 */
const SHOTS: Shot[] = [
  {src: CLIP_A, trim: 0.2, from: 0, duration: 62, zoom: [1.04, 1.12], pan: [0, -10]},
  {src: CLIP_B, trim: 1.5, from: 56, duration: 68, zoom: [1.13, 1.04], pan: [8, 0]},
  {src: CLIP_A, trim: 2.7, from: 118, duration: 62, zoom: [1.05, 1.13], pan: [-6, 4]},
  {src: CLIP_B, trim: 5.9, from: 174, duration: 62, zoom: [1.12, 1.04], pan: [6, -4]},
  {src: CLIP_A, trim: 4.9, from: 230, duration: 74, zoom: [1.02, 1.09], pan: [-6, 4]},
  {src: CLIP_B, trim: 7.3, from: 298, duration: 62, zoom: [1.11, 1.03], pan: [4, -4]},
];

export const CARA_BLANCA_EN_DURATION = 360;

const CUT = 6;

const Clip: React.FC<{shot: Shot; index: number}> = ({shot, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, CUT, shot.duration - CUT, shot.duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  /** Korte klap op de snede: het beeld zet net iets groter in. */
  const punch = index === 0 ? 0 : interpolate(frame, [0, 10], [0.03, 0], {extrapolateRight: 'clamp'});
  const progress = frame / shot.duration;
  const scale = interpolate(progress, [0, 1], shot.zoom) + punch;
  const x = interpolate(progress, [0, 1], [0, shot.pan[0]]);
  const y = interpolate(progress, [0, 1], [0, shot.pan[1]]);

  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          filter: 'saturate(1.2) contrast(1.09) brightness(1.03)',
        }}
      >
        <OffthreadVideo
          src={staticFile(shot.src)}
          trimBefore={Math.round(shot.trim * fps)}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Woord voor woord inpoppende caption, met contour zodat het altijd leest. */
const Kinetic: React.FC<{
  text: string;
  duration: number;
  size?: number;
  accentWords?: string[];
  align?: 'center' | 'left';
  bottom?: number;
}> = ({text, duration, size = 72, accentWords = [], align = 'left', bottom = 560}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const out = interpolate(frame, [duration - 8, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* Zachte scrim zodat witte tekst ook op licht gesteente leest */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: bottom - 190,
          height: 440,
          background:
            'linear-gradient(180deg, rgba(4,18,30,0) 0%, rgba(4,18,30,0.62) 42%, rgba(4,18,30,0.62) 72%, rgba(4,18,30,0) 100%)',
          opacity: out,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 68,
          right: 150,
          bottom,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0 18px',
          justifyContent: align === 'center' ? 'center' : 'flex-start',
          opacity: out,
        }}
      >
        {words.map((word, i) => {
          const enter = spring({
            frame: frame - i * 3,
            fps,
            config: {damping: 14, mass: 0.55, stiffness: 150},
          });
          const accent = accentWords.includes(word.replace(/[^A-Za-z']/g, ''));
          return (
            <span
              key={`${word}-${i}`}
              style={{
                fontFamily: FONTS.display,
                fontSize: size,
                fontWeight: 800,
                lineHeight: 1.16,
                color: accent ? COLORS.sun : COLORS.cream,
                transform: `translateY(${(1 - enter) * 34}px) scale(${0.86 + Math.min(enter, 1) * 0.14})`,
                opacity: Math.min(1, enter * 1.4),
                WebkitTextStroke: '3px rgba(4,18,30,0.5)',
                textShadow: '0 8px 30px rgba(3,16,28,0.75)',
                display: 'inline-block',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </>
  );
};

const TitleCard: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({frame, fps, config: {damping: 200, mass: 0.9, stiffness: 85}});
  const rule = spring({frame: frame - 10, fps, config: {damping: 200}});
  const sub = spring({frame: frame - 16, fps, config: {damping: 200}});
  const out = interpolate(frame, [duration - 12, duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: FONTS.display,
        color: COLORS.cream,
        opacity: out,
      }}
    >
      <div
        style={{
          fontSize: 136,
          fontWeight: 800,
          letterSpacing: 1,
          lineHeight: 0.98,
          transform: `translateY(${(1 - title) * 46}px) scale(${0.93 + title * 0.07})`,
          opacity: title,
          textShadow: '0 12px 44px rgba(3,16,28,0.6)',
        }}
      >
        CARA
        <br />
        BLANCA
      </div>
      <div style={{width: rule * 300, height: 4, background: COLORS.sun, margin: '32px 0 26px'}} />
      <div
        style={{
          fontSize: 42,
          fontWeight: 300,
          letterSpacing: 9,
          textTransform: 'uppercase',
          opacity: sub,
          transform: `translateY(${(1 - sub) * 22}px)`,
          textShadow: '0 6px 24px rgba(3,16,28,0.65)',
        }}
      >
        Nador · Morocco
      </div>
    </AbsoluteFill>
  );
};

const Badge: React.FC = () => (
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
      fontFamily: FONTS.display,
      color: COLORS.cream,
      fontSize: 30,
      fontWeight: 500,
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

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200, mass: 0.8, stiffness: 70}});
  const sub = spring({frame: frame - 12, fps, config: {damping: 200}});
  const line = spring({frame: frame - 8, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 540}}>
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,18,30,0) 20%, rgba(4,18,30,0.55) 50%, rgba(4,18,30,0.94) 100%)',
          opacity: enter,
        }}
      />
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          fontFamily: FONTS.display,
          color: COLORS.cream,
          transform: `translateY(${(1 - enter) * 46}px)`,
          opacity: enter,
        }}
      >
        <div style={{fontSize: 92, fontWeight: 800, textShadow: '0 8px 34px rgba(3,16,28,0.75)'}}>
          {HANDLE}
        </div>
        <div
          style={{
            width: line * 260,
            height: 3,
            background: COLORS.sun,
            margin: '26px auto 24px',
          }}
        />
        <div
          style={{
            fontSize: 38,
            fontWeight: 300,
            letterSpacing: 1,
            color: 'rgba(253,247,236,0.92)',
            textShadow: '0 4px 20px rgba(3,16,28,0.8)',
            opacity: sub,
          }}
        >
          follow for more spots around Nador
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CaraBlancaEN: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.night}}>
      <Fonts />

      {/* Doorlopend omgevingsgeluid, zodat de snedes niet hoorbaar zijn */}
      <Audio
        src={staticFile('footage/ambience.mp3')}
        volume={(f) =>
          interpolate(
            f,
            [0, 15, CARA_BLANCA_EN_DURATION - 30, CARA_BLANCA_EN_DURATION],
            [0, 0.85, 0.85, 0],
            {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
          )
        }
      />

      {SHOTS.map((shot, i) => (
        <Sequence key={i} from={shot.from} durationInFrames={shot.duration} layout="none">
          <Clip shot={shot} index={i} />
        </Sequence>
      ))}

      {/* Vignet en gradients houden de tekst leesbaar */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(4,18,30,0.36) 0%, rgba(4,18,30,0) 24%, rgba(4,18,30,0) 58%, rgba(4,18,30,0.46) 100%)',
        }}
      />

      <Sequence from={4} durationInFrames={54} layout="none">
        <Kinetic
          text="This is not the Caribbean."
          duration={54}
          size={84}
          accentWords={['Caribbean']}
          bottom={900}
        />
      </Sequence>
      <Sequence from={60} durationInFrames={62} layout="none">
        <TitleCard duration={62} />
      </Sequence>
      <Sequence from={124} durationInFrames={56} layout="none">
        <Kinetic text="Water this clear." duration={56} size={78} accentWords={['clear.']} />
      </Sequence>
      <Sequence from={180} durationInFrames={56} layout="none">
        <Kinetic text="White rock terraces to swim off." duration={56} accentWords={['White', 'rock']} />
      </Sequence>
      <Sequence from={238} durationInFrames={58} layout="none">
        <Kinetic
          text="On Morocco's Mediterranean coast."
          duration={58}
          accentWords={['Mediterranean']}
        />
      </Sequence>
      <Sequence from={fps * 10} durationInFrames={CARA_BLANCA_EN_DURATION - fps * 10} layout="none">
        <EndCard />
      </Sequence>

      <Badge />
    </AbsoluteFill>
  );
};
