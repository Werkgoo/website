export const COLORS = {
  night: '#04182b',
  deepSea: '#062b45',
  sea: '#0d5f86',
  seaLight: '#1b87ad',
  lagoon: '#17a6a0',
  lagoonLight: '#5fd8c7',
  sand: '#f0d9a8',
  sandDeep: '#d9b476',
  sun: '#ffc464',
  sunset: '#f4763a',
  terracotta: '#c0492c',
  cream: '#fdf7ec',
  ink: '#07202f',
  rif: '#2f5d4a',
  rifDark: '#1d3f34',
} as const;

export const FONTS = {
  display: '"Outfit", "DejaVu Sans", sans-serif',
  serif: '"Instrument Serif", "FreeSerif", Georgia, serif',
  /** Inter: rustig en scherp op klein formaat, voor captions en labels. */
  ui: '"Inter", "Outfit", "DejaVu Sans", sans-serif',
} as const;

export const FPS = 30;

/** Scenes: [startFrame, duration] — ze overlappen 15 frames voor de cross-fade. */
export const SCENES = {
  intro: { from: 0, duration: 165 },
  ligging: { from: 150, duration: 165 },
  marChica: { from: 300, duration: 180 },
  cijfers: { from: 465, duration: 165 },
  highlights: { from: 615, duration: 195 },
  outro: { from: 795, duration: 165 },
} as const;

export const TOTAL_FRAMES = 945;
