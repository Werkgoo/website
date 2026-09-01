import React from 'react';
import {Composition} from 'remotion';
import {NadorVideo} from './NadorVideo';
import {CARA_BLANCA_DURATION, CaraBlanca} from './tiktok/CaraBlanca';
import {FPS, TOTAL_FRAMES} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NadorVideo"
        component={NadorVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="CaraBlancaTikTok"
        component={CaraBlanca}
        durationInFrames={CARA_BLANCA_DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
