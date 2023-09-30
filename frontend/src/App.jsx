import { DEFAULT_NOW_PLAYING, NowPlayingContext } from './NowPlayingContext'
import { getNowPlaying } from './api/spotify'
import SceneSwitcher from './main/SceneSwitcher'
import useInterval from './main/useInterval'
import config from './config'
import { useControls } from 'leva'
import { useEventSource } from 'react-use-websocket'
import { useNowPlaying } from './useNowPlaying'

export default function App() {
  const [nowPlaying, setNowPlaying] = useNowPlaying(DEFAULT_NOW_PLAYING)

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
