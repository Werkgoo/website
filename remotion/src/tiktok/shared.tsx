import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {COLORS, FONTS} from '../theme';

export const HANDLE = '@Nadorspot';
const CUT = 6;

export type Shot = {
  /** Bestand in public/footage. */
  src: string;
  kind?: 'video' | 'photo';
  /** Startpunt in de bronclip, in seconden (alleen video). */
  trim?: number;
  from: number;
  duration: number;
  /** Langzame push-in of push-out over de lengte van het shot. */
  zoom: [number, number];
  pan: [number, number];
  /** CSS-filter; eigen beelden willen meer punch dan al verzadigde clips. */
  grade?: string;
  /** Naam van de maker, als het shot van iemand anders komt. */
  credit?: string;
  /** Horizontale uitsnede bij beeld dat smaller is dan 9:16. */
  focusX?: string;
};

const DEFAULT_GRADE = 'saturate(1.14) contrast(1.06) brightness(1.02)';

/** Pill onder de accountbadge met de credit van de oorspronkelijke maker. */
const CreditChip: React.FC<{credit: string}> = ({credit}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 6, fps, config: {damping: 200}});

  return (
    <div
      style={{
        position: 'absolute',
        top: 168,
        left: 56,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 20px 10px 16px',
        borderRadius: 999,
        background: 'rgba(6,24,38,0.38)',
        border: '1px solid rgba(253,247,236,0.2)',
        fontFamily: FONTS.ui,
        fontSize: 24,
        fontWeight: 500,
        color: 'rgba(253,247,236,0.9)',
        opacity: enter,
        transform: `translateX(${(1 - enter) * -30}px)`,
      }}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2.5" y="6.5" width="14" height="11" rx="2.5" stroke={COLORS.cream} strokeWidth="1.8" />
        <path d="M16.5 11.5 21.5 8.5v7l-5-3z" stroke={COLORS.cream} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
      {credit}
    </div>
  );
};

/**
 * Eén shot: video of foto, met cross-fade, een korte klap op de snede en een
 * trage beweging. Beeld dat smaller is dan 9:16 wordt bijgesneden; `focusX`
 * bepaalt welk deel in beeld blijft.
 */
export const MediaShot: React.FC<{shot: Shot; index: number}> = ({shot, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const opacity = interpolate(frame, [0, CUT, shot.duration - CUT, shot.duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const punch = index === 0 ? 0 : interpolate(frame, [0, 10], [0.03, 0], {extrapolateRight: 'clamp'});
  const progress = frame / shot.duration;
  const scale = interpolate(progress, [0, 1], shot.zoom) + punch;
  const x = interpolate(progress, [0, 1], [0, shot.pan[0]]);
  const y = interpolate(progress, [0, 1], [0, shot.pan[1]]);
  const src = staticFile(shot.src);
  const cover: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: `${shot.focusX ?? '50%'} 50%`,
  };

  return (
    <AbsoluteFill style={{opacity}}>
      {shot.kind === 'photo' ? (
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) translate(${x}px, ${y}px)`,
            filter: shot.grade ?? DEFAULT_GRADE,
          }}
        >
          <Img src={src} style={cover} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill
          style={{
            transform: `scale(${scale}) translate(${x}px, ${y}px)`,
            filter: shot.grade ?? DEFAULT_GRADE,
          }}
        >
          <OffthreadVideo
            src={src}
            trimBefore={Math.round((shot.trim ?? 0) * fps)}
            muted
            style={cover}
          />
        </AbsoluteFill>
      )}

      {shot.credit ? <CreditChip credit={shot.credit} /> : null}
    </AbsoluteFill>
  );
};

/** Woord voor woord inpoppende caption, met contour en een zachte scrim. */
export const Kinetic: React.FC<{
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
                fontFamily: FONTS.ui,
                fontSize: size,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.14,
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

export const TitleCard: React.FC<{
  duration: number;
  lines: [string, string];
  subtitle: string;
}> = ({duration, lines, subtitle}) => {
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
        color: COLORS.cream,
        opacity: out,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 132,
          fontWeight: 900,
          letterSpacing: '-0.03em',
          lineHeight: 0.98,
          transform: `translateY(${(1 - title) * 46}px) scale(${0.93 + title * 0.07})`,
          opacity: title,
          textShadow: '0 12px 44px rgba(3,16,28,0.6)',
        }}
      >
        {lines[0]}
        <br />
        {lines[1]}
      </div>
      <div style={{width: rule * 300, height: 4, background: COLORS.sun, margin: '32px 0 26px'}} />
      <div
        style={{
          fontFamily: FONTS.ui,
          fontSize: 36,
          fontWeight: 500,
          letterSpacing: 11,
          textTransform: 'uppercase',
          opacity: sub,
          transform: `translateY(${(1 - sub) * 22}px)`,
          textShadow: '0 6px 24px rgba(3,16,28,0.65)',
        }}
      >
        {subtitle}
      </div>
    </AbsoluteFill>
  );
};

export const Badge: React.FC = () => (
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

export const EndCard: React.FC<{line: string; credit?: string}> = ({line, credit}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200, mass: 0.8, stiffness: 70}});
  const sub = spring({frame: frame - 12, fps, config: {damping: 200}});
  const rule = spring({frame: frame - 8, fps, config: {damping: 200}});

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
          color: COLORS.cream,
          transform: `translateY(${(1 - enter) * 46}px)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            fontFamily: FONTS.ui,
            fontSize: 86,
            fontWeight: 900,
            letterSpacing: '-0.02em',
            textShadow: '0 8px 34px rgba(3,16,28,0.75)',
          }}
        >
          {HANDLE}
        </div>
        <div style={{width: rule * 260, height: 3, background: COLORS.sun, margin: '26px auto 24px'}} />
        <div
          style={{
            fontFamily: FONTS.ui,
            fontSize: 36,
            fontWeight: 600,
            letterSpacing: 0.2,
            color: 'rgba(253,247,236,0.92)',
            textShadow: '0 4px 20px rgba(3,16,28,0.8)',
            opacity: sub,
          }}
        >
          {line}
        </div>
        {credit ? (
          <div
            style={{
              marginTop: 20,
              fontFamily: FONTS.ui,
              fontSize: 26,
              fontWeight: 500,
              color: 'rgba(253,247,236,0.7)',
              textShadow: '0 4px 20px rgba(3,16,28,0.8)',
              opacity: sub,
            }}
          >
            {credit}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Gradients boven- en onderin, zodat badge en captions altijd leesbaar zijn. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'linear-gradient(180deg, rgba(4,18,30,0.36) 0%, rgba(4,18,30,0) 24%, rgba(4,18,30,0) 58%, rgba(4,18,30,0.46) 100%)',
    }}
  />
);
