import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Backdrop, Eyebrow} from '../components/Backdrop';
import {LagoonPanel} from '../components/LagoonPanel';
import {FadeUp, Reveal} from '../components/Reveal';
import {COLORS, FONTS} from '../theme';

const POINTS = [
  ['± 115 km²', 'een van de grootste lagunes van de Middellandse Zee'],
  ['Ramsar-gebied', 'beschermd vogelgebied sinds 2005 — flamingo’s overwinteren er'],
  ['De Bocana', 'één opening in de zandbank verbindt de lagune met zee'],
];

export const MarChica: React.FC = () => (
  <AbsoluteFill style={{fontFamily: FONTS.display, color: COLORS.cream}}>
    <Backdrop tint={COLORS.lagoon} />

    <AbsoluteFill style={{flexDirection: 'row', alignItems: 'center', padding: '0 80px', gap: 60}}>
      <div style={{flex: 1}}>
        <FadeUp delay={4} distance={24}>
          <Eyebrow color={COLORS.lagoonLight}>Mar Chica</Eyebrow>
        </FadeUp>

        <Reveal delay={12} distance={130} style={{marginTop: 24}}>
          <h1 style={{fontSize: 92, fontWeight: 700, lineHeight: 1.02, margin: 0, letterSpacing: -1}}>
            De lagune die
            <br />
            de stad maakt
          </h1>
        </Reveal>

        <FadeUp delay={30} distance={28}>
          <p
            style={{
              fontFamily: FONTS.ui,
              fontSize: 28,
              lineHeight: 1.55,
              fontWeight: 400,
              color: 'rgba(253,247,236,0.8)',
              margin: '30px 0 44px',
            }}
          >
            Nador ligt aan de Mar Chica, in het Tarifit ook wel Bahr Amezyan genoemd:
            een ondiepe lagune die van de zee gescheiden wordt door een lange zandbank.
            Langs de oevers loopt de Corniche, de wandelboulevard van de stad.
          </p>
        </FadeUp>

        {POINTS.map(([title, text], i) => (
          <FadeUp key={title} delay={52 + i * 12} distance={24}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 24,
                padding: '18px 0',
                borderTop: '1px solid rgba(253,247,236,0.18)',
              }}
            >
              <span
                style={{
                  minWidth: 260,
                  fontSize: 34,
                  fontWeight: 600,
                  color: COLORS.lagoonLight,
                }}
              >
                {title}
              </span>
              <span
                style={{
                  fontFamily: FONTS.ui,
                  fontSize: 23,
                  fontWeight: 400,
                  color: 'rgba(253,247,236,0.75)',
                }}
              >
                {text}
              </span>
            </div>
          </FadeUp>
        ))}
      </div>

      <FadeUp delay={16} distance={50} style={{width: 830, height: 740}}>
        <LagoonPanel />
      </FadeUp>
    </AbsoluteFill>
  </AbsoluteFill>
);
