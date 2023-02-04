export const getNowPlaying = async (accessToken) => {
  return fetch("https://api.spotify.com/v1/me/player/currently-playing",
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
}
