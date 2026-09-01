import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, Eyebrow} from '../components/Backdrop';
import {MapNador} from '../components/MapNador';
import {FadeUp, Reveal} from '../components/Reveal';
import {COLORS, FONTS} from '../theme';

const CHIPS = ['Provincie Nador', 'Regio Oriental', 'Rifgebergte', 'Tarifit & Arabisch'];

export const Ligging: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONTS.display, color: COLORS.cream}}>
    <Backdrop />

    <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 96px'}}>
      <div style={{width: 700, paddingRight: 60}}>
        <FadeUp delay={4} distance={24}>
          <Eyebrow>Ligging</Eyebrow>
        </FadeUp>

        <Reveal delay={12} distance={120} style={{marginTop: 26}}>
          <h1 style={{fontSize: 96, fontWeight: 700, lineHeight: 1, margin: 0, letterSpacing: -1}}>
            Waar ligt
            <br />
            Nador?
          </h1>
        </Reveal>

        <FadeUp delay={34} distance={30}>
          <p
            style={{
              fontFamily: FONTS.ui,
              fontSize: 30,
              lineHeight: 1.55,
              fontWeight: 400,
              color: 'rgba(253,247,236,0.82)',
              marginTop: 34,
            }}
          >
            In het uiterste noordoosten van Marokko, geklemd tussen de bergen van het Rif
            en de Middellandse Zee. De havenwijk Beni Ansar grenst aan de Spaanse
            enclave Melilla — de stad kijkt daardoor letterlijk uit op Europa.
          </p>
        </FadeUp>

        <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 40}}>
          {CHIPS.map((chip, i) => (
            <FadeUp key={chip} delay={56 + i * 6} distance={18}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '12px 22px',
                  borderRadius: 999,
                  border: '1px solid rgba(253,247,236,0.28)',
                  background: 'rgba(253,247,236,0.06)',
                  fontFamily: FONTS.ui,
                  fontSize: 21,
                  fontWeight: 500,
                  letterSpacing: 0.2,
                }}
              >
                {chip}
              </span>
            </FadeUp>
          ))}
        </div>
      </div>

      <div style={{flex: 1, height: 900, marginTop: 20}}>
        <MapNador />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
