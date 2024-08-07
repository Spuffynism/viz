import { createContext, useContext } from 'react'

export const DEFAULT_NOW_PLAYING = {
  song: {
    title: 'Nothing at all <3',
    artist: 'Nothing',
    album: 'Nothingness',
    durationMs: 2.5 * 60 * 1000
  },
  startEpoch: +(new Date())
}

export const NowPlayingContext = createContext(DEFAULT_NOW_PLAYING);

export const useSong = () => {
  const { song } = useContext(NowPlayingContext)
  return song
}
