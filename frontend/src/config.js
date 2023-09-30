import Ascii from './scenes/ascii/Ascii'
import Goop from './scenes/goop/Goop'
import WireframeGoop from './scenes/wireframegoop/WireframeGoop'

const config = {
  showControls: import.meta.env.DEV,
  changeWithSong: import.meta.env.PROD,
  scenes: [
    Goop,
    WireframeGoop,
    Ascii,
  ],
  startScene: Goop.name,
  strategy: 'Spotify'
}

export default config;
