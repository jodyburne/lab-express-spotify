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
  Promise.all([
    spotifyApi
    .getArtistAlbums(artist),
    spotifyApi
    .getArtist(artist)
  ])
    .then(([albums, artist]) => {
let resultsArr = albums.body.items
let albumsArr = []
for (let i = 0; i < resultsArr.length; i++){
  if (resultsArr[i].album_group === 'album' && resultsArr[i].available_markets.includes('GB') ) {

    albumsArr.push(resultsArr[i])
  }
}

res.render('albums', {
    artist: artist.body.name,
    albums: albumsArr
})
   })
   .catch(err => {
     console.log('error issssss: ', err)
   })
})

app.get('/tracks/:id', (req, res, next) => {
  let album = req.params.id
  Promise.all([
  spotifyApi
  .getAlbumTracks(album),
  spotifyApi
  .getAlbum(album)
  ])
  .then(([tracks, album]) => {
    console.log('DEBUGGING IS FUN ', album.body.artists[0].name)
   
    res.render('tracks', 
    {
      tracks: tracks.body.items,
      pic: album.body.images[1].url,
      album: album.body.name,
      artists: album.body.artists,
      year: album.body.release_date,
      label: album.body.label,

    }
    )
  })
  .catch(err => {
    console.log('error alert guys: ', err)
  })
})

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
