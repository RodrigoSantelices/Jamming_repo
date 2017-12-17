import React from 'react';

import './Track.css';

export class Track extends React.Component {
// FIX renderAction
  renderAction() {
      if (this.props.isRemoval) {
          return <a className="Track-action" onClick={this.removeTrack}>-</a>
        }
          return <a className="Track-action" onClick={this.addTrack}>+</a>;
                  }
  render(){
    return(
      <div className = 'Track' >
        <div className = 'Track-information'>
          <h3> {this.props.track.name}</h3>
          <p> {this.props.track.artist}| {this.props.track.album} </p>
        </div>
          <a className="Track-action">+</a>
      </div>
    )
  }
}
