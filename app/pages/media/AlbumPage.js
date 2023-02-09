import React from "react";
import Button from "../../components/Button";
import Song from "../../components/Song";

import "./styles/AlbumPage.scss";

export default function AlbumPage(props) {
  const [album, setAlbum] = React.useState({});
  const [songs, setSongs] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Fetch album data from API
  React.useEffect(() => {
    const id = props.path.split("/")[1];

    fetch(`/api/v1/albums/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setAlbum(data);
        setIsLoaded(true);
        setSongs(data.SongIDs);
      });
  }, [props.path]);

  // Play album
  function play() {
    var songIDs = songs.join(",");
    var queue = sessionStorage.getItem("queue");
    sessionStorage.setItem("queue", `${songIDs},${queue}`);
  }

  // Render album data
  return (
    isLoaded && (
      <div className="albumPage page">
        <div className="albumPageDetails">
          <img
            className="albumPageImg"
            src={`/api/v1/albums/${album.Id}/cover`}
            alt="Album cover"
          />
          <div className="albumPageInfo">
            <h1 className="albumPageHeader">{album.Title}</h1>
            <a className="albumPageLink" href={`#artists/${album.ArtistID}`}>
              {album.ArtistName}
            </a>
            <Button onClick={play} className="albumPageButton">
              Play
            </Button>
          </div>
        </div>

        <div className="songs">
          {songs.map((song) => {
            return (
              <div className="SongCont">
                <Song key={song} id={song} />
              </div>
            );
          })}
        </div>
      </div>
    )
  );
}
