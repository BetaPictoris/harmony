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
      let queue = sessionStorage.getItem("queue").split(",");

      // Check if currentSong has changed
      if (queue[0] !== currentPlaying) {
        // Update currentPlaying
        setCurrentPlaying(queue[0]);
        document.querySelector("audio").play(); // Start playing
        setPlaying(true); // Set playing to true

        // Fetch song data from API
        fetch(`/api/v1/songs/${queue[0]}`)
          .then((response) => response.json())
          .then((data) => setSong(data));

        // Update media session
        if ("mediaSession" in navigator) {
          // Set metadata
          navigator.mediaSession.metadata = new MediaMetadata({
            title: song.Title,
            artist: song.Artist,
            artwork: [
              {
                src: `/api/v1/songs/${song.Id}/cover`,
                sizes: "512x512",
                type: "image/jpeg",
              },
            ],
          });

          // Set actions
          navigator.mediaSession.setActionHandler("play", () => {
            setPlaying(true);
            document.querySelector("audio").play();
          });
          navigator.mediaSession.setActionHandler("pause", () => {
            setPlaying(false);
            document.querySelector("audio").pause();
          });
        }
      }

      // Check if song has ended
      if (document.querySelector("audio").ended) {
        // Remove current song from queue
        queue.shift();
        // Set queue in sessionStorage
        sessionStorage.setItem("queue", queue.join(","));
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
        <button onClick={togglePlaying} className="mediaPlayerControlsPlayBttn">
          <img
            src={
              playing
                ? "/app/assets/svg/player/pause.svg"
                : "/app/assets/svg/player/play.svg"
            }
            alt="Play/Pause"
          />
        </button>
      </span>
    </div>
  );
}
