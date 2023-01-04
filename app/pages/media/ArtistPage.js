import React from "react"

import Section from "../../components/Section"
import Album from "../../components/Album";

export default function ArtistPage(props) {
  const [artist, setArtist] = React.useState({});
  const [albums, setAlbums] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Fetch artist data from the API
  React.useEffect(() => {
    const id = props.path.split("/")[1];

    fetch(`/api/v1/artists/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setArtist(data);
        setIsLoaded(true);
        updateAlbums();
      });
    

  })

  function updateAlbums() { 
    artist.AlbumIDs.forEach(function (aID, i) {
      fetch(`/api/v1/albums/${aID}`)
        .then((response) => response.json())
        .then((data) => {
          setAlbums([...albums, data]);
        });
      })
  }

  return (
    <div className="artistPage page">
      <div className="artistDetails">
        <h1 className="artistDetailsName">{artist.Name}</h1>
      </div>
      <div className="artistAlbums">
        <Section title="Albums">
          <div className="artistAlbumsGrid">
            {albums.map(album => (
              <Album key={album.Id} id={album.Id} title={album.Title} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}