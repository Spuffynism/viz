import { useState } from 'react'
import { DEFAULT_NOW_PLAYING, NowPlayingContext } from './NowPlayingContext'
import { getAudioAnalysis, getNowPlaying } from './api/spotify'
import SceneSwitcher from './main/SceneSwitcher'
import useInterval from './main/useInterval'
import config from './config'
import { useControls } from 'leva'
import { ReadyState, useEventSource } from 'react-use-websocket'

const useNowPlaying = (initialState) => {
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

      console.log(song);
      setNowPlaying({
        song,
        startEpoch
      })
    }
  ]
}

export default function App() {
  const [nowPlaying, setNowPlaying] = useNowPlaying(DEFAULT_NOW_PLAYING)

  //const audioAnalysis = getAudioAnalysis("0aRPJ7iHzvO7ZSMSlTC2ZH")

  const { strategy } = useControls({
    strategy: { options: ['Spotify', 'SongRec'], value: config.strategy }
  })

  useEventSource(
    strategy === 'SongRec' ? 'http://localhost:8888/now-playing' : null,
    {
      events: {
        message: (messageEvent) => {
          const newSong = JSON.parse(messageEvent.data)

          setNowPlaying(newSong)
        }
      },
    },
    strategy === 'SongRec'
  );

  continuouslyRefreshSong(nowPlaying.song, setNowPlaying, null, strategy === 'Spotify')

  return (
    <NowPlayingContext.Provider value={nowPlaying}>
      <SceneSwitcher scenes={config.scenes} startScene={config.startScene} changeWithSong={config.changeWithSong} />
    </NowPlayingContext.Provider>
  )
}

const continuouslyRefreshSong = (oldSong, setNowPlaying, setProgressMs, active) => {
  const refreshSong = async () => {
    const nowPlaying = await getNowPlaying()

    if (!nowPlaying) {
      return
    }

    const newSong = {
      album: nowPlaying.item.album.name,
      artist: nowPlaying.item.artists[0].name,
      title: nowPlaying.item.name,
      //durationMs: nowPlaying.item.duration_ms,
    }

    setNowPlaying(newSong)
  }

  useInterval(refreshSong, { delay: 1_000, executeImmediately: true, active })
}
