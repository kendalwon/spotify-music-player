import React from 'react';
import logo from './logo.svg';
import hash from './hash';
import './MusicPlayer.css';
import Player from './Player';
import {authEndpoint, clientId, redirectUri, scopes} from './configs/config';

class MusicPlayer extends React.Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }]
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms:0,
      },
      is_playing: "Paused",
      progress_ms: 0
    };
    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  componentDidMount() {
    let _token = hash.access_token;
    if (_token) {
      this.setState({
        token: _token
      });
    this.getCurrentlyPlaying(_token);
    }
  }

  getCurrentlyPlaying(token) {
    console.log('getting currently playing');
    const url = 'https://api.spotify.com/v1/me/player/currently-playing';
    fetch(url, {
      headers: {'Authorization': 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      return response;
    })
    .then(response => {
      this.setState({
        item: response.item,
        is_playing: response.is_playing,
        progress_ms: response.progress_ms
      });
    })
    .catch(error => console.log(error));
  }

  render() {
    console.log(this.state);
    const spotifyQueryString = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
    return (
      <div className="musicPlayer">
        <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {!this.state.token && (
          <a
            className="btn btn--login App-link"
            href={spotifyQueryString}
          >
            Login to Spotify
          </a>
        )}
        {this.state.token && (
          <Player
            item={this.state.item}
            is_playing={this.state.is_playing}
            progress_ms={this.progress_ms}
          />
        )}
        </header>
      </div>
    );
  }
}

export default MusicPlayer;
