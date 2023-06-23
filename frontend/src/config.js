import Ascii from './scenes/ascii/Ascii'
import Spinning from './scenes/spinning/Spinning'
import Monolith from './scenes/monolith/Monolith'

const config = {
  showControls: true,
  changeWithSong: true,
  scenes: [
    Ascii,
    //Spinning,
    Monolith
  ],
  startScene: Monolith.name,
  strategy: 'Spotify'
}

export default config;
