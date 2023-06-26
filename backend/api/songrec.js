import { spawn } from 'child_process'

const nothingPlaying = {
  title: 'Nothing from SongRec!',
  artist: 'Nothing',
  album: 'Nothingness',
  durationMs: 2.5 * 60 * 1000
}

let previouslyPlaying = nothingPlaying
let nowPlaying = nothingPlaying

const setNowPlaying = ({ title, artist, album }) => {
  console.log('Now playing', { title, artist, album })
  previouslyPlaying = nowPlaying
  nowPlaying = { title, artist, album }
}

export function detectNowPlaying() {
  const command = spawn('songrec', ['listen', '--json', '--disable-mpris']);

  let buffer = ''

  command.stdout.on('data', (data) => {
    let json;
    try {
      buffer += data.toString()
      json = JSON.parse(buffer);
    } catch (e) {
      if (e instanceof SyntaxError) {
        return;
      }

      console.log(e)
    }
    buffer = ''
    const song = {
      title: json.track.title,
      artist: json.track.subtitle,
      album: 'Unknown'
    }
    const songSection = json.track.sections.find(({type}) => type === 'SONG')
    if (songSection) {
      const album = songSection.metadata.find(({title}) => title === 'Album')
      if (album) {
        song.album = album.text
      }
    }
    setNowPlaying(song)
  });
  command.stderr.on('data', function(data) {
    console.log('stderr data', data.toString());
  });

  command.on('close', (code) => {
    console.log('close', code)
  });

  command.on('error', (error) => {
    console.log('error', error.message)
  });

  return command
}

export const getNowPlaying = () => nowPlaying
