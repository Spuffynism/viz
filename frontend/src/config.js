import Ascii from './scenes/ascii/Ascii'
import Goop from './scenes/goop/Goop'
import WireframeGoop from './scenes/wireframegoop/WireframeGoop'

const env = 'dev';

const config = {
  showControls: env === 'dev',
  changeWithSong: env === 'prod',
  scenes: [
    Goop,
    WireframeGoop,
    Ascii,
  ],
  startScene: Goop.name,
  strategy: 'Spotify'
}

export default config;
