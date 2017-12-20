const clientID= '0ada90ea5d5b4ccf87590e038ba5fcad';
const redirectURI = 'http://JammmingWithRod.surge.sh';

let accessToken;
let expiresIn;

const Spotify = {
  //check if it works
  getAccessToken(){
    // check if token is there
    if(accessToken){
      return accessToken;
    }
    //check url to see if token has just been obtained
    let url = window.location.href;
    let accessTokenInUrl = /access_token=([^&]*)/;
    let expiresInUrl = /expires_in=([^&]*)/;
    accessToken = url.match(accessTokenInUrl);
    expiresIn = url.match(expiresInUrl);
      if(accessToken){
    window.setTimeout(() => accessToken = '', expiresIn * 1000);
    window.history.pushState('Access Token', null, '/');
    console.log('access token received');
    return accessToken
          }
  else{
      window.location.href = 'https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}'
    }
  },
  search(searchTerm){
    return fetch('https://api.spotify.com/v1/search?type=track&q=${searchTerm}',
    {headers: this.headerFill()
    }).then(
      response => response.json()).then(jsonResponse =>{
        if(jsonResponse.tracks){
          return jsonResponse.tracks.items.map(function(track){
            return {
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }}
          )}
          else {
            return [];
          }
      });
    },
// writes the custom playlist in jammming to their spotify account
  savePlaylist(name, trackURIs){
    return fetch('https://api.spotify.com/v1/me',
      {headers: this.headerFill()}).then(
        response => response.json()).then(
          jsonResponse => {
            let userID = jsonResponse.id;
            return this.saveTracksToPlaylist(userID, name, trackURIs);
          });
        },
//creates a new playlist in user account and returns a playlistID
  createPlaylist(userID, playlistName, playlistTracks){
    return fetch('/v1/users/{user_id}/playlists',{
      headers:this.headerFill(),
      method: 'POST',
      body: JSON.stringify({name: playlistName, public:false})
    }).then(response =>{
      if(response.ok){
        return response.json()
      }
      throw new Error('Request Failed');
    },
      networkError => console.log(networkError.message)).then(jsonResponse => {
        console.log('Playlist Created');
        let playlistID = jsonResponse.id;
        return this.saveTracksToPlaylist(userID, playlistID, playlistTracks);
      })},

  headerFill() {
  let accessToken = this.getAccessToken();
  return {Authorization: 'Bearer ${accessToken}'}},

  saveTracksToPlaylist(userID, playlistID, playlistTracks){
    return fetch('/v1/users/{user_id}/playlists/{playlist_id}/tracks',{
      headers: this.headerFill(),
      method: 'POST',
      body: JSON.stringify(playlistTracks)
    }).then(response =>{
      if(response.ok){
        return response.json()
      }
      throw new Error('Request Failed');
    },
      networkError => console.log(networkError.message)).then(jsonResponse => {
        console.log('Tracks Saved');
        return jsonResponse.snapshot_id;
      });
    }
  }



export default Spotify;
