import Ascii from './scenes/ascii/Ascii'
import Goop from './scenes/goop/Goop'
import WireframeGoop from './scenes/wireframegoop/WireframeGoop'
import FullWireframe from './scenes/fullwireframe/FullWireframe'
import Sparkling from './scenes/sparkling/Sparkling'
import Spinning from './scenes/spinning/Spinning'
import Torus from './scenes/glitch/Torus'
import Star from './scenes/glitch/Star'

const config = {
  showControls: import.meta.env.DEV,
  changeWithSong: import.meta.env.PROD,
  scenes: [
    Torus,
    Star,
    Goop,
    WireframeGoop,
    Ascii,
    FullWireframe,
    Sparkling,
    Spinning,
  ],
  startScene: Torus.name,
  strategy: 'Spotify'
}

export default config;
