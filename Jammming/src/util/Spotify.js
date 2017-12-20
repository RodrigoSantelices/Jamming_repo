const clientId= '0ada90ea5d5b4ccf87590e038ba5fcad';
const redirectUri = 'http://localhost:3000/';

let accessToken;
let expiresIn;

const Spotify = {
  //check if it works

  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },
  search(term){
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
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
    return fetch(`/v1/users/{user_id}/playlists`,{
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
