import { DEFAULT_NOW_PLAYING, NowPlayingContext } from './NowPlayingContext'
import SceneSwitcher from './main/SceneSwitcher'
import useInterval from './main/useInterval'
import config from './config'
import { useControls } from 'leva'
import { useEventSource } from 'react-use-websocket'
import { useNowPlaying } from './useNowPlaying'
import { useGetNowPlaying } from './api/useGetNowPlaying'

export default function App() {
  const [nowPlaying, setNowPlaying] = useNowPlaying(DEFAULT_NOW_PLAYING)

  const { strategy } = useControls({
    strategy: { options: ['Spotify', 'SongRec'], value: config.strategy }
  })

  // TODO(nico): make this only available in dev
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

  useContinuouslyRefreshSong(nowPlaying.song, setNowPlaying, null, strategy === 'Spotify')

  return (
    <NowPlayingContext.Provider value={nowPlaying}>
      <SceneSwitcher scenes={config.scenes} startScene={config.startScene} changeWithSong={config.changeWithSong} />
    </NowPlayingContext.Provider>
  )
}

const useContinuouslyRefreshSong = (oldSong, setNowPlaying, setProgressMs, active) => {
  const useRefreshSong = async () => {
    const nowPlaying = await useGetNowPlaying()

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

  return useInterval(useRefreshSong, { delay: 1_000, executeImmediately: true, active })
}
