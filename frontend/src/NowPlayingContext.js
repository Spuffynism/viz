import { createContext } from 'react';

export const DEFAULT_NOW_PLAYING = {
  title: 'Nothing at all <3',
  artist: 'Nothing',
  album: 'Nothingness'
}

export const NowPlayingContext = createContext(DEFAULT_NOW_PLAYING);
