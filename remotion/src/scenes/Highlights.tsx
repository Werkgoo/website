import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, Eyebrow} from '../components/Backdrop';
import {IconFerry, IconLighthouse, IconMountain, IconPalm, IconTajine} from '../components/Icons';
import {FadeUp, Reveal} from '../components/Reveal';
import {COLORS, FONTS} from '../theme';

const CARDS = [
  {
    icon: <IconPalm />,
    title: 'De Corniche',
    text: 'Wandelen langs de lagune, met terrassen, palmen en zonsondergangen boven het water.',
  },
  {
    icon: <IconLighthouse />,
    title: 'Trois Fourches',
    text: 'Kaap ten noorden van de stad: kliffen, verlaten baaien en een vuurtoren uit 1909.',
  },
  {
    icon: <IconMountain />,
    title: 'Gurugu',
    text: 'De berg boven Nador, met uitzicht over de lagune, Melilla en de Middellandse Zee.',
  },
  {
    icon: <IconTajine />,
    title: 'Souk & keuken',
    text: 'Verse vis uit de lagune, tajine, harira en muntthee tussen de marktkramen.',
  },
  {
    icon: <IconFerry />,
    title: 'Beni Ansar',
    text: 'Haven en grenspost: veerboten naar Almería en Motril, en de weg naar Melilla.',
  },
];

export const Highlights: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONTS.display, color: COLORS.cream}}>
    <Backdrop tint={COLORS.rif} />

    <AbsoluteFill style={{padding: '96px 90px', justifyContent: 'center'}}>
      <FadeUp delay={2} distance={22}>
        <Eyebrow>Te zien</Eyebrow>
      </FadeUp>

      <Reveal delay={10} distance={120} style={{marginTop: 22, marginBottom: 56}}>
        <h1 style={{fontSize: 96, fontWeight: 700, margin: 0, letterSpacing: -1}}>
          Vijf keer Nador
        </h1>
      </Reveal>

      <div style={{display: 'flex', gap: 24}}>
        {CARDS.map((card, i) => (
          <FadeUp key={card.title} delay={24 + i * 9} distance={54} style={{flex: 1}}>
            <div
              style={{
                height: 420,
                padding: '40px 32px',
                borderRadius: 26,
                background: 'linear-gradient(180deg, rgba(253,247,236,0.1), rgba(253,247,236,0.04))',
                border: '1px solid rgba(253,247,236,0.16)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{marginBottom: 26}}>{card.icon}</div>
              <div style={{fontSize: 38, fontWeight: 600, lineHeight: 1.1}}>{card.title}</div>
              <div
                style={{
                  fontFamily: FONTS.ui,
                  fontSize: 22,
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: 'rgba(253,247,236,0.72)',
                  marginTop: 18,
                }}
              >
                {card.text}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
