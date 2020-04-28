import React from "react";
import "./Player.css";

const Player = props => {
  const backgroundStyles = {
    backgroundImage: `url(${props.item.album.images[0].url})`,
  };
  
  const progressBarStyles = {
    width: (props.progress_ms * 100 / props.item.duration_ms) + '%'
  };
  
  return (
    <div className="player">
      <div className="main-wrapper">
        <div className="now-playing__img" style={backgroundStyles}>
        </div>
        <div className="now-playing__name">
          {props.item.name}
        </div>
        <div className="now-playing__artist">
          {props.item.artists[0].name}
        </div>
        {(props.selectedItem === 'current') ? (
          <>
            <div className="now-playing__status">
              now playing
            </div>
            <div className="progress">
              <div className="progress__bar"
              style={progressBarStyles}>
              </div>
            </div>
          </>
        ) :
        (
          <div className="now-playing__status">
            recently played
          </div>
        )
        }  
      </div>
    </div>
  );
}
export default Player;