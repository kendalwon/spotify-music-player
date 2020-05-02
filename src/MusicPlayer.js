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
      currentlyPlaying: null,
      recentlyPlayed: null,
      selectedItem: null,
      progress_ms: 0
    }
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

  componentDidUpdate(_prevProps, prevState) {
    if (this.state.currentlyPlaying !== prevState.currentlyPlaying && this.state.currentlyPlaying === 'nothing') {
      this.getRecentlyPlayed(this.state.token)
    }
  }

  getCurrentlyPlaying = (token) => {
    console.log('getting currently playing');
    const url = 'https://api.spotify.com/v1/me/player/currently-playing';
    fetch(url, {
      headers: {'Authorization': 'Bearer ' + token}
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        this.setState({
          currentlyPlaying: 'nothing'
        });
        return Promise.reject('nothing is playing');
      }
    })
    .then(response => {
      console.log(response);
      return response;
    })
    .then(response => {
      this.setState({
        currentlyPlaying: response.item,
        selectedItem: 'current',
        progress_ms: response.progress_ms
      });
    })
    .catch(error => console.log(error));
  }

  getRecentlyPlayed = (token) => {
    console.log('getting recently played');
    const url = 'https://api.spotify.com/v1/me/player/recently-played';
    fetch(url, {
      headers: {'Authorization': 'Bearer ' + token}
    })
    .then(response => response.json())
    .then(response => {
      console.log(response);
      return response;
    })
    .then(response => {
      const images = response.items[0].track.album.images;
      const name = response.items[0].track.album.name;
      const artists = response.items[0].track.album.artists[0].name;
      this.setState({
        recentlyPlayed: {
          album: {
            images: images
          },
          name: name,
          artists: artists
        },
          selectedItem: 'recent'
        });
    })
    .catch(error => console.log(error));
  }

  render() {
    console.log(this.state);
    const spotifyQueryString = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token&show_dialog=true`;
    return (
      <div className="musicPlayer">
        <header className="header">
          <img src={logo} className="logo" alt="logo" />
        {!this.state.token && (
          <a
            className="btn btn--login App-link"
            href={spotifyQueryString}
          >
            Login to Spotify
          </a>
        )}
        </header>
        {this.state.selectedItem && (
          <Player
            item={(this.state.selectedItem === 'current') ? this.state.currentlyPlaying : this.state.recentlyPlayed}
            selectedItem={this.state.selectedItem}
            progress_ms={(this.state.selectedItem === 'current') ? this.state.progress_ms : null}
          />
        )}
        
      </div>
    );
  }
}

export default MusicPlayer;
