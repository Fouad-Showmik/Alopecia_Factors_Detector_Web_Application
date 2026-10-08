export const state = {
  selected: new Set(),
  statusTimer: null,
  slices: [],
  cards: [],
  reducedMotion: window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches
};
