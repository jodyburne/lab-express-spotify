const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
// Remember to insert your credentials here
const clientId = "6f8f6f2669a5421c96c3c231c1314f67", clientSecret = "3c645d20df9d4f44ad9bf6df06f84a10";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

// the routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
    userInput = req.query.search
  console.log("debug" + userInput);
  ;

  spotifyApi
    .searchArtists(userInput)
    .then(data => {
      console.log("The received data from the API: ",data.body.artists.items[0]);
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
      res.render("artists", {
          userInput: userInput,
          artists: data.body.artists.items,
      });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get('/albums/:id', (req, res, next) => {
  let artist = req.params.id
    spotifyApi
    .getArtistAlbums(artist)
    .then(data => {
console.log('ALBUMS', data.body.items) 
res.render('albums', {
    artist: data.body.items[0].artists[0].name,
    albums: data.body.items
})
   })
   .catch(err => {
     console.log('error issssss: ', err)
   })
})


app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
