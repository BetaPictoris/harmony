import React from "react";

import Button from "./Button";

import "./styles/Song.scss";

export default function Song(props) {
  const [song, setSong] = React.useState({});
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Fetch song data from API
  React.useEffect(() => {
    fetch(`/api/v1/songs/${props.id}`)
      .then((response) => response.json())
      .then((data) => {
        setSong(data);
        setIsLoaded(true);
      });
  }, [props.id]);

  // Play song
  function play() {
    // Set current song in sessionStorage
    let queue = sessionStorage.getItem("queue");
    sessionStorage.setItem("queue", `${props.id},${queue}`);
  }

  function addToQueue() {
    // Get current queue from sessionStorage
    let queue = sessionStorage.getItem("queue");
    // If queue is empty, set queue to current song
    if (queue === null) {
      queue = `${props.id}`;
    } else {
      // If queue is not empty, add current song to queue
      queue += `,${props.id}`;
    }
    // Set queue in sessionStorage
    sessionStorage.setItem("queue", queue);
  }

  // Render song data
  return (
    <div className="Song">
      {isLoaded ? (
        <>
          <span className="SongBttn">
            <Button onClick={addToQueue}>+</Button>
          </span>

          <span className="SongTitles">{song.Title}</span>

          <span className="SongPlayBttn SongBttn">
            <Button onClick={play}>Play</Button>
          </span>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
