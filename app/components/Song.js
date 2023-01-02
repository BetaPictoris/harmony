import React from "react";

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

  // Render song data
  return (
    <div className="Song">
      {isLoaded ? (
        <>
          <button className="SongPlayBttn">Play</button>
          <span className="SongTitles">{song.Title}</span>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
