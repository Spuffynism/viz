# 💥 viz

viz is a music visualiser. It works with Spotify, or though a microphone with [SongRec](https://github.com/marin-m/SongRec).

<p>
  <img width="30%" src="screenshots/wireframe.png" alt="Wireframe visualization"/>
  <img width="30%" src="screenshots/ascii.png" alt="Ascii visualization"/>
</p>

## Usage

viz needs both a client and a server. The server is needed for:
- Authenticating with Spotify, and emit song changes from Spotify to the client
- Or, if [SongRec](https://github.com/marin-m/SongRec) is used, to listen to the microphone and emit song changes to the client

The client is built with [r3f](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) and runs the visualization code.

## Setup

To run viz with Spotify, you need to set up a few things:
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/), and create a new app. 
2. Add `http://localhost:8888/callback` as a redirect URI.
3. Create a `.env` file in the `backend` folder with environment variables from the Spotify app.
    ```shell
    cp backend/.env.example backend/.env
    ```

### Build

```shell
make bootstrap
```

### Run

To start both the server and the client, run:

```shell
make start
```

For the full list of commands, see [Makefile](./Makefile).
