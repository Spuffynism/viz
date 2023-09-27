import express from 'express'
import request from 'request'
import cors from 'cors'
import querystring from 'querystring'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import { generateStateCookie } from './util.js'
import { detectNowPlaying, getNowPlaying } from './api/songrec.js'

config()

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const AUTH_HEADER = 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')

const stateKey = 'spotify_auth_state'

const app = express()
app.use(cors())
   .use(cookieParser())

app.get('/login', (req, res) => {

  const state = generateStateCookie()
  res.cookie(stateKey, state)

  const scope = 'user-read-currently-playing'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
    }))
})

app.get('/callback', (req, res) => {
  const code = req.query.code
  const state = req.query.state
  const storedState = req.cookies ? req.cookies[stateKey] : null

  if (!state || state !== storedState) {
    res.redirect('http://localhost:3000/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }))
  } else {
    res.clearCookie(stateKey)
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': AUTH_HEADER
      },
      json: true
    }

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            access_token: body.access_token,
            refresh_token: body.refresh_token
          }))
      } else {
        res.redirect('http://localhost:3000/#' +
          querystring.stringify({
            error: 'invalid_token'
          }))
      }
    })
  }
})

app.get('/refresh_token', (req, res) => {

  // requesting access token from refresh token
  const refreshToken = req.query.refresh_token
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': AUTH_HEADER },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    json: true
  }

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token
      res.send({
        'access_token': access_token
      })
    }
  })
})

app.get('/now-playing', async (req, res) => {
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  // Tell client to retry every 10 seconds if connection is lost
  res.write('retry: 10000\n\n');

  const command = detectNowPlaying()
  setInterval(() => {
    const nowPlaying = getNowPlaying()

    res.write(`data: ${JSON.stringify(nowPlaying)}\n\n`)
  }, 1_000)

  req.on('close', () => {
    command.kill()
  });
})

const PORT = process.env.PORT || 8888
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})
