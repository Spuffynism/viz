import { currentToken, getToken, redirectToSpotifyAuthorize, refreshToken } from './spotify'

// https://github.com/spotify/web-api-examples/blob/master/authorization/authorization_code_pkce/public/app.js
export const useGetNowPlaying = async () => {
  // On page load, try to fetch auth code from current browser search URL
  const args = new URLSearchParams(window.location.search);
  const code = args.get('code');

  // If we find a code, we're in a callback, do a token exchange
  if (code) {
    const token = await getToken(code);
    currentToken.save(token);

    // Remove code from URL so we can refresh correctly.
    const url = new URL(window.location.href);
    url.searchParams.delete("code");

    const updatedUrl = url.search ? url.href : url.href.replace('?', '');
    window.history.replaceState({}, document.title, updatedUrl);
  }

  if (!currentToken.accessToken) {
    await redirectToSpotifyAuthorize();
    return
  }

  const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: {
        'Authorization': `Bearer ${currentToken.accessToken}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

  if (response.status === 401) {
    currentToken.save(await refreshToken());
    return
  }

  if (response.status === 204 || response.status === 429) {
    return
  }

  return response.json()
}
