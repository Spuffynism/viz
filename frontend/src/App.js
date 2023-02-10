import { useEffect, useState } from 'react'
import { DEFAULT_NOW_PLAYING, NowPlayingContext } from './NowPlayingContext'
import { getNowPlaying } from './api/spotify'
import Spinning from './scenes/spinning/Spinning'
import Dispersion from './scenes/dispersion/Dispersion'
import Refraction from './scenes/refraction/Refraction'
import Monolith from './scenes/monolith/Monolith'
import SceneSwitcher from './main/SceneSwitcher'
import useInterval from './main/useInterval'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState(DEFAULT_NOW_PLAYING)

  continuouslyRefreshSong(nowPlaying, setNowPlaying)

  const scenes = {
    spinning: <Spinning />,
    dispersion: <Dispersion />,
    refraction: <Refraction />,
    monolith: <Monolith />
  }

  return (
    <NowPlayingContext.Provider value={nowPlaying}>
      <SceneSwitcher scenes={scenes} activeScene={'monolith'} />
    </NowPlayingContext.Provider>
  )
}

const continuouslyRefreshSong = (nowPlaying, setNowPlaying) => {
  const refreshSong = async () => {
    const { item } = await getNowPlaying()

    const newNowPlaying = {
      album: item.album.name,
      artist: item.artists[0].name,
      title: item.name
      //durationMs: body.item.duration_ms,
      //progressMs: body.progress_ms
    }

    const songChanged = Object.keys(newNowPlaying).some((key) => newNowPlaying[key] !== nowPlaying[key])
    if (songChanged) {
      setNowPlaying(newNowPlaying)
    }
  }

  useInterval(refreshSong, { delay: 2_000, executeImmediately: true })
}
