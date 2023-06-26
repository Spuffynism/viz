import Ascii from './scenes/ascii/Ascii'
import Monolith from './scenes/monolith/Monolith'
import Sparkling from './scenes/sparkling/Sparkling'
import Goop from './scenes/goop/Goop'

const config = {
  showControls: true,
  changeWithSong: false,
  scenes: [
    Ascii,
    //Spinning,
    Monolith,
    //Dispersion,
    //Refraction,
    Sparkling,
    Goop
  ],
  startScene: Goop.name,
  strategy: 'Spotify'
}

export default config;
