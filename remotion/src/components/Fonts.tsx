import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {FONT_CSS} from '../fontCss';

const localCss = FONT_CSS.replace(
  /url\(fonts\/([^)]+)\)/g,
  (_match, file: string) => `url(${staticFile(`fonts/${file}`)})`,
);

/** Laadt de lokaal meegeleverde fonts en houdt de render tegen tot ze klaar zijn. */
export const Fonts: React.FC = () => {
  const [handle] = useState(() => delayRender('Fonts laden'));

  useEffect(() => {
    Promise.all([
      document.fonts.load('800 100px "Outfit"'),
      document.fonts.load('600 100px "Outfit"'),
      document.fonts.load('400 100px "Outfit"'),
      document.fonts.load('300 100px "Outfit"'),
      document.fonts.load('italic 400 100px "Instrument Serif"'),
      document.fonts.load('400 100px "Instrument Serif"'),
    ])
      .catch(() => null)
      .then(() => continueRender(handle));
  }, [handle]);

  return <style>{localCss}</style>;
};
