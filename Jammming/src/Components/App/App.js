import React from 'react';

import './App.css';

import {SearchBar} from '../SearchBar/SearchBar';
import {SearchResults} from '../SearchResults/SearchResults';
import {Playlist} from '../Playlist/Playlist';

export class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {searchResults:[], playlistTracks:[], playlistName:''};

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
}
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

render(){
return  (
<div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar />
    <div className="App-playlist">
      <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack} />
      <Playlist playlistTracks = {this.state.playlistTracks} playlistName = {this.state.playlistName}
        onRemove = {this.removeTrack} onNameChange = {this.updatePlaylistName}/>
    </div>
  </div>
</div>
)
};
}




export default App;
