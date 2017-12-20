import React from 'react';

import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {searchResults:[], playlistTracks:[], playlistName:''};

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
}
/*addTrack(track) {
  let tracks = this.state.playlistTracks;
  if (tracks.find(savedTrack => savedTrack.id === track.id)) {
    return;
  }
}
*/
  addTrack(track){
    let id = track.id;
    let currentTracks = this.state.playlistTracks;
      let duplicate = currentTracks.filter(song => song.id === id);

      if(duplicate.length === 0){
        currentTracks.push(track);
        this.setState({playlistTracks: currentTracks});
      }
}
  removeTrack(track){
    let id = track.id;
    let currentTracks = this.state.playlistTracks;
    let remove = currentTracks.filter(song => song.id !== id)

      this.setState({playlistTracks: remove});
    }
  updatePlaylistName(name){
    this.setState({playlistName: name})
  }
  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    if( trackURIs && this.state.playlistName && trackURIs.length > 0){
      Spotify.savePlaylist(this.playlistName, trackURIs).then(() =>
      {
        this.setState({playlistName: 'New Playlist', playlistTracks: []});
      });
    }
  }
  search(searchTerm){
    Spotify.search(searchTerm).then(tracks =>
    this.setState({searchResults: tracks}));
  }


render(){
return  (
<div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch = {this.search} />
    <div className="App-playlist">
      <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack} />
      <Playlist playlistTracks = {this.state.playlistTracks} playlistName = {this.state.playlistName}
        onRemove = {this.removeTrack} onNameChange = {this.updatePlaylistName} onSave = {this.savePlaylist}/>
    </div>
  </div>
</div>
)
};
}




export default App;
