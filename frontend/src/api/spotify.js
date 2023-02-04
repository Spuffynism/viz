import { useAccessToken } from '../useAccessToken'

export const getNowPlaying = async () => {
  const accessToken = useAccessToken()

  if (!accessToken) {
    window.location.href = 'http://localhost:8888/login'
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
    window.location.href = 'http://localhost:8888/login'
  }

  return response
}
