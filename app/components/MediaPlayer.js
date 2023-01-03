import React from "react";

import "./styles/MediaPlayer.scss";

export default function MediaPlayer(props) {
  const [playing, setPlaying] = React.useState(false);
  const [currentPlaying, setCurrentPlaying] = React.useState("");
  const [song, setSong] = React.useState({});

  // Check for updates in sessionStorage for currentSong
  React.useEffect(() => {
    // Create timer
    const timer = setInterval(() => {
      // Check if currentSong has changed
      if (sessionStorage.getItem("currentSong") !== currentPlaying) {
        // Update currentPlaying
        setCurrentPlaying(sessionStorage.getItem("currentSong"));
        document.querySelector("audio").play(); // Start playing

        // Fetch song data from API
        fetch(`/api/v1/songs/${sessionStorage.getItem("currentSong")}`)
          .then((response) => response.json())
          .then((data) => setSong(data));
      }
    }, 1000);
    // Clear timer on unmount
    return () => clearInterval(timer);
  }, [currentPlaying]);

  // Toggle playing state
  function togglePlaying() {
    setPlaying(!playing);

    if (playing) {
      // Pause
      document.querySelector("audio").pause();
    } else {
      // Play
      document.querySelector("audio").play();
    }
  }

  return (
    <div className="mediaPlayer">
      <audio autoPlay={playing} src={`/api/v1/songs/${currentPlaying}/audio`} />

      <span className="mediaPlayerInfo">
        <img
          className="mediaPlayerInfoImg"
          src={`/api/v1/songs/${song.Id}/cover`}
          alt="Album Art"
        />
        <span className="mediaPlayerInfoTitle">
          {song.Title ? song.Title : "Not playing..."}
        </span>
      </span>

      <span className="mediaPlayerControls">
        <button onClick={togglePlaying}> {playing ? "Pause" : "Play"} </button>
      </span>
    </div>
  );
}
