import request from "request";

const AUTH_HEADER = 'Basic ' + new Buffer(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');

export const refreshToken = (refreshToken) => {

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': AUTH_HEADER
    },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
}
