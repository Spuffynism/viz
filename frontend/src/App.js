import { useState } from 'react'
import { DEFAULT_NOW_PLAYING, NowPlayingContext } from './NowPlayingContext'
import { getNowPlaying } from './api/spotify'
import Spinning from './scenes/spinning/Spinning'
import Dispersion from './scenes/dispersion/Dispersion'
import Refraction from './scenes/refraction/Refraction'
import Monolith from './scenes/monolith/Monolith'
import SceneSwitcher from './main/SceneSwitcher'
import useInterval from './main/useInterval'
import Ascii from './scenes/ascii/Ascii'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState(DEFAULT_NOW_PLAYING)

  continuouslyRefreshSong(nowPlaying.song, setNowPlaying)

  const scenes = [
    Ascii,
    Spinning,
    Refraction,
    Monolith
  ]

  return (
    <NowPlayingContext.Provider value={nowPlaying}>
      <SceneSwitcher scenes={scenes} />
    </NowPlayingContext.Provider>
  )
}

const continuouslyRefreshSong = (oldSong, setNowPlaying, setProgressMs) => {
  const refreshSong = async () => {
    const nowPlaying = await getNowPlaying()

    if (!nowPlaying) {
      return
    }

    const newSong = {
      album: nowPlaying.item.album.name,
      artist: nowPlaying.item.artists[0].name,
      title: nowPlaying.item.name,
      durationMs: nowPlaying.item.duration_ms,
    }

    const songChanged = Object.keys(newSong).some((key) => newSong[key] !== oldSong[key])
    if (songChanged) {
      setNowPlaying({
        song: newSong,
        startEpoch: nowPlaying.timestamp
      })
    }
  }

  useInterval(refreshSong, { delay: 1_000, executeImmediately: true })
}
