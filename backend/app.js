import express from 'express'
import cors from 'cors'
import { config } from 'dotenv'
import { detectNowPlaying, getNowPlaying } from './api/songrec.js'

config()

const app = express()
app.use(cors())

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
