import React from 'react';
import {Composition} from 'remotion';
import {NadorVideo} from './NadorVideo';
import {FPS, TOTAL_FRAMES} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NadorVideo"
      component={NadorVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={1920}
      height={1080}
    />
  );
};
