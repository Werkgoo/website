import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts} from './components/Fonts';
import {Scene} from './components/Scene';
import {Texture} from './components/Texture';
import {Cijfers} from './scenes/Cijfers';
import {Highlights} from './scenes/Highlights';
import {Intro} from './scenes/Intro';
import {Ligging} from './scenes/Ligging';
import {MarChica} from './scenes/MarChica';
import {Outro} from './scenes/Outro';
import {COLORS, SCENES} from './theme';

export const NadorVideo: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COLORS.night}}>
    <Fonts />

    <Scene {...SCENES.intro}>
      <Intro />
    </Scene>
    <Scene {...SCENES.ligging}>
      <Ligging />
    </Scene>
    <Scene {...SCENES.marChica}>
      <MarChica />
    </Scene>
    <Scene {...SCENES.cijfers}>
      <Cijfers />
    </Scene>
    <Scene {...SCENES.highlights}>
      <Highlights />
    </Scene>
    <Scene {...SCENES.outro}>
      <Outro />
    </Scene>

    <Texture />
  </AbsoluteFill>
);
