import SpinningViz from "./SpinningViz";
import {useEffect, useMemo, useState} from "react";
import {DEFAULT_NOW_PLAYING, NowPlayingContext} from "./NowPlayingContext";
import {getNowPlaying} from "./api/spotify";

// TODO: Create access token and refresh token providers
export default function App() {
  const accessToken = window.location.hash.match(/access_token=([a-zA-Z0-9_\-]*)/)[1];

  const [nowPlaying, setNowPlaying] = useState(DEFAULT_NOW_PLAYING);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      const response = await getNowPlaying(accessToken)
        .catch((err) => {
          console.error("Fetch error", err);
        })

      const body = await response.json();

      if (!body) {
        console.log('Couldn\'t fetch now playing', res);
        return;
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
      <SpinningViz/>
    </NowPlayingContext.Provider>
  )
}
