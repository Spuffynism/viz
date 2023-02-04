import express from 'express'
import request from 'request'
import cors from 'cors'
import querystring from 'querystring'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import { generateStateCookie } from './util.js'

config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const AUTH_HEADER = 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

const stateKey = 'spotify_auth_state'

const app = express()
app.use(cors())
   .use(cookieParser())

app.get('/login', (req, res) => {

  const state = generateStateCookie()
  res.cookie(stateKey, state)

  // your application requests authorization
  const scope = 'user-read-currently-playing'
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
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

const PORT = process.env.PORT || 8888
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`)
})
