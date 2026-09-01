import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {Fonts} from '../components/Fonts';
import {COLORS} from '../theme';
import {Badge, EndCard, Kinetic, MediaShot, Shot, TitleCard, Vignette} from './shared';

const OWN_A = 'footage/carablanca-1.mov';
const OWN_B = 'footage/carablanca-2.mov';
const COVE = 'footage/cove-maroci108.mp4';
const CLIFFS = 'footage/cliffs-clip2.mp4';
const PHOTO = 'footage/rock-pillar.jpg';

const CREDIT = '@maroci108';
/** Eigen beelden zijn wat waziger dan de geleende clips en willen meer punch. */
const OWN_GRADE = 'saturate(1.2) contrast(1.09) brightness(1.03)';
const BORROWED_GRADE = 'saturate(1.06) contrast(1.03)';

const SHOTS: Shot[] = [
  {src: PHOTO, kind: 'photo', from: 0, duration: 68, zoom: [1.02, 1.12], pan: [0, -8], grade: 'saturate(1.08) contrast(1.04)', focusX: '40%'},
  {src: CLIFFS, trim: 3.4, from: 62, duration: 78, zoom: [1.1, 1.02], pan: [6, 0], grade: BORROWED_GRADE},
  {src: COVE, trim: 2.2, from: 134, duration: 72, zoom: [1.02, 1.1], pan: [-6, 4], grade: BORROWED_GRADE, credit: CREDIT, focusX: '42%'},
  {src: CLIFFS, trim: 9.0, from: 200, duration: 72, zoom: [1.09, 1.02], pan: [4, -4], grade: BORROWED_GRADE},
  {src: OWN_A, trim: 2.6, from: 266, duration: 72, zoom: [1.03, 1.11], pan: [-6, 4], grade: OWN_GRADE},
  {src: CLIFFS, trim: 17.2, from: 332, duration: 78, zoom: [1.02, 1.1], pan: [6, -4], grade: BORROWED_GRADE},
  {src: COVE, trim: 8.2, from: 404, duration: 66, zoom: [1.1, 1.02], pan: [-4, 4], grade: BORROWED_GRADE, credit: CREDIT, focusX: '58%'},
  {src: OWN_B, trim: 5.6, from: 464, duration: 100, zoom: [1.1, 1.02], pan: [4, -4], grade: OWN_GRADE},
  {src: OWN_A, trim: 5.0, from: 558, duration: 72, zoom: [1.02, 1.08], pan: [-4, 2], grade: OWN_GRADE},
];

export const CARA_BLANCA_PRO_DURATION = 630;

export const CaraBlancaPro: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COLORS.night}}>
    <Fonts />

    {/* Doorlopend omgevingsgeluid uit de eigen clips */}
    <Audio
      src={staticFile('footage/ambience-long.mp3')}
      volume={(f) =>
        interpolate(
          f,
          [0, 15, CARA_BLANCA_PRO_DURATION - 34, CARA_BLANCA_PRO_DURATION],
          [0, 0.85, 0.85, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        )
      }
    />

    {SHOTS.map((shot, i) => (
      <Sequence key={i} from={shot.from} durationInFrames={shot.duration} layout="none">
        <MediaShot shot={shot} index={i} />
      </Sequence>
    ))}

    <Vignette />

    <Sequence from={5} durationInFrames={58} layout="none">
      <Kinetic text="This rock is in Morocco." duration={58} size={80} accentWords={['Morocco']} bottom={620} />
    </Sequence>
    <Sequence from={68} durationInFrames={70} layout="none">
      <TitleCard duration={70} lines={['CARA', 'BLANCA']} subtitle="Nador · Morocco" />
    </Sequence>
    <Sequence from={142} durationInFrames={60} layout="none">
      <Kinetic text="Water like glass." duration={60} size={78} accentWords={['glass']} />
    </Sequence>
    <Sequence from={208} durationInFrames={58} layout="none">
      <Kinetic text="Cliffs that fall straight into it." duration={58} accentWords={['Cliffs']} />
    </Sequence>
    <Sequence from={274} durationInFrames={58} layout="none">
      <Kinetic text="And people just swim off them." duration={58} accentWords={['swim']} />
    </Sequence>
    <Sequence from={340} durationInFrames={64} layout="none">
      <Kinetic text="Golden cliffs, clear water." duration={64} accentWords={['Golden']} />
    </Sequence>
    <Sequence from={470} durationInFrames={62} layout="none">
      <Kinetic text="All of it on Morocco's Mediterranean coast." duration={62} size={68} accentWords={['Mediterranean']} />
    </Sequence>
    <Sequence from={556} durationInFrames={74} layout="none">
      <EndCard line="follow for more spots around Nador" credit={`clips: ${CREDIT}`} />
    </Sequence>

    <Badge />
  </AbsoluteFill>
);
