import { useState } from 'react'
import { DEFAULT_NOW_PLAYING, NowPlayingContext } from './NowPlayingContext'
import { getAudioAnalysis, getNowPlaying } from './api/spotify'
import SceneSwitcher from './main/SceneSwitcher'
import useInterval from './main/useInterval'
import config from './config'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState(DEFAULT_NOW_PLAYING)

  const audioAnalysis = getAudioAnalysis("0aRPJ7iHzvO7ZSMSlTC2ZH")

  continuouslyRefreshSong(nowPlaying.song, setNowPlaying)

  return (
    <NowPlayingContext.Provider value={nowPlaying}>
      <SceneSwitcher scenes={config.scenes} startScene={config.startScene} changeWithSong={config.changeWithSong} />
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
