import React from "react";
import Song from "../components/Song";

export default function AlbumPage(props) {
  const [album, setAlbum] = React.useState({});
  const [songs, setSongs] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Fetch album data from API
  React.useEffect(() => {
    const id = props.path.split("/")[1];
    console.log(id);
    fetch(`/api/v1/albums/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setAlbum(data);
        setIsLoaded(true);
        setSongs(data.Songs);
      });
  }, [props.path]);

  // Render album data
  return (
    <div className="albumPage page">
      {isLoaded ? (
        <>
          <div className="albumPageDetails">
            <img
              className="albumPageImg"
              src={`/api/v1/albums/${album.Id}/cover`}
              alt="Album cover"
            />
            <h1>{album.Title}</h1>
            <a href={`#artists/${album.ArtistId}`}>{album.ArtistName}</a>
          </div>

          <div className="songs"></div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
