import { generateStateCookie } from '../../../backend/util'
import querystring from 'querystring'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const stateKey = 'spotify_auth_state'

export async function GET() {
  const state = generateStateCookie()
  const cookieStore = cookies()
  cookieStore.set(stateKey, state)

  const scope = 'user-read-currently-playing'
  redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFY_CLIENT_ID,
      scope,
      redirect_uri: process.env.REDIRECT_URI,
      state
    }))
}