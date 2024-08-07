import querystring from 'querystring'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const stateKey = 'spotify_auth_state'
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const AUTH_HEADER = 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const cookieStore = cookies()
  const storedState = cookieStore.get(stateKey).value

  if (!state || state !== storedState) {
    redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  } else {
    cookieStore.delete(stateKey);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: new URLSearchParams({
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': AUTH_HEADER
      },
    });

    const body = await response.json();

    if (response.ok && response.status === 200) {
      redirect('/#' +
        querystring.stringify({
          access_token: body.access_token,
          refresh_token: body.refresh_token
        }))
    } else {
      redirect('/#' +
        querystring.stringify({
          error: 'invalid_token'
        }))
    }
  }
}