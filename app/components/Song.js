import React from "react";

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
    <div>
      {isLoaded ? (
        <div>
          <div>
            <h1>{song.Title}</h1>
            <button>Play</button>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
