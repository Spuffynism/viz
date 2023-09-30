import { useAccessToken } from '../useAccessToken'

const refreshToken = () => {
  window.location.href = 'http://localhost:8888/login'
}

export const getNowPlaying = async () => {
  const accessToken = useAccessToken()

  if (!accessToken) {
    refreshToken()
  }

  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

  if (response.status === 401) {
    refreshToken()
  }

  let body
  try {
    body = await response.json()
  } catch (e) {
    return
  }

  if (!body) {
    throw new Error('Couldn\'t fetch now playing' + response)
  }

  return body
}

export const getAudioAnalysis = async (trackId) => {
  const accessToken = useAccessToken()

  if (!accessToken) {
    refreshToken()
  }

  const response = await fetch(`https://api.spotify.com/v1/audio-analysis/${trackId}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

  return response.json()
}
