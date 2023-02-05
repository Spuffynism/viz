import Spinning from "./vizzes/spinning/Spinning";
import {useEffect, useState, Suspense} from "react";
import {DEFAULT_NOW_PLAYING, NowPlayingContext} from "./NowPlayingContext";
import {getNowPlaying} from "./api/spotify";
import Dispersion from './vizzes/dispersion/Dispersion'
import Refraction from './vizzes/refraction/Refraction'
import { Leva, useControls } from 'leva'
import Monolith from './vizzes/monolith/Monolith'

export default function App() {
  const [nowPlaying, setNowPlaying] = useState(DEFAULT_NOW_PLAYING);

  const scenes = [
    <Spinning/>,
    <Dispersion/>,
    <Refraction />,
    <Monolith />
  ]

  const { scene } = useControls({
    scene: { value: 3, min: 0, max: scenes.length - 1, step: 1 },
  })

  useEffect(() => {
    const fetchNowPlaying = async () => {
      const response = await getNowPlaying()
        .catch((err) => {
          console.error("Fetch error", err);
        })

      let body
      try {
        body = await response.json()
      } catch (e) {
        console.log('Nothing playing!')
        return
      }

      if (!body) {
        console.log('Couldn\'t fetch now playing', response);
        return
      }

      console.log('tick ok');

      const newNowPlaying = {
        album: body.item.album.name,
        artist: body.item.artists[0].name,
        title: body.item.name,
        //durationMs: body.item.duration_ms,
        //progressMs: body.progress_ms
      }

      const songChanged = JSON.stringify(nowPlaying).localeCompare(JSON.stringify(newNowPlaying)) !== 0
      if (songChanged) {
        console.log('song changed from', nowPlaying.title, 'to', newNowPlaying.title)
        setNowPlaying(newNowPlaying)
      }
    };

    fetchNowPlaying()
    const id = setInterval(fetchNowPlaying, 1_000)
    return () => clearInterval(id);
  }, []);

  return (
    <NowPlayingContext.Provider value={nowPlaying}>
      <FadingControls/>
      {scenes[scene]}
    </NowPlayingContext.Provider>
  )
}

const FadingControls = () => {
  const [hidden, setIsHidden] = useState(true)

  const style = hidden ? {visibility: 'hidden'} : {}

  return (
    <div>
      <Leva titleBar={false} style={style} onMouseEnter={() => {
        setIsHidden(false)
        console.log('mouse enter')
      }}
            onMouseLeave={() => {
              setIsHidden(true)
              console.log('mouse leave!')
            }} />
    </div>
  )
}
