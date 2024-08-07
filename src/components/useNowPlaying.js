import { useState } from 'react'

export const useNowPlaying = (initialState) => {
  const [nowPlaying, setNowPlaying] = useState(initialState)

  return [
    nowPlaying,
    (song, startEpoch = +(new Date())) => {
      if (!song) {
        return
      }

      const songChanged = Object.keys(song).some((key) => song[key] !== nowPlaying.song[key])

      if (!songChanged) {
        return
      }

      setNowPlaying({
        song,
        startEpoch
      })
    }
  ]
}
