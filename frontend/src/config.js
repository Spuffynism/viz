import Ascii from './scenes/ascii/Ascii'
import Monolith from './scenes/monolith/Monolith'
import Sparkling from './scenes/sparkling/Sparkling'
import Goop from './scenes/goop/Goop'
import Spinning from './scenes/spinning/Spinning'
import WireframeGoop from './scenes/wireframegoop/WireframeGoop'
import FullWireframe from './scenes/fullwireframe/FullWireframe'

const env = 'prod';

const config = {
  showControls: env === 'dev',
  changeWithSong: env === 'prod',
  scenes: [
    //FullWireframe,
    Goop,
    WireframeGoop,
    Ascii,
    //Spinning,
    Monolith,
    //Dispersion,
    //Refraction,
    //Sparkling
  ],
  startScene: Goop.name,
  strategy: 'Spotify'
}

export default config;
