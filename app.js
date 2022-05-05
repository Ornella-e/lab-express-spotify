require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const async = require('hbs/lib/async');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });  

  // Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/artist-search", async (req, res) =>{
  const {q} = req.query;
  spotifyApi
  .searchArtists(q)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render("artist-search-results", {q})
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  const {q} = req.query;
  spotifyApi.getArtistAlbums(q)
  .then(function(data) {
    console.log('Artist albums', data.body);
    res.render("albums", {q})
  }, function(err) {
    console.error(err);
  });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.searchTracks(req.query)
  .then(function(data) {
    console.log('Search by ""', data.body);
  }, function(err) {
    console.error(err);
  });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
