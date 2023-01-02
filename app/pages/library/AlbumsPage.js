import React from "react";

import Album from "../../components/Album";

export default function AlbumsPage() {
  const [albums, setAlbums] = React.useState([]);
  const [albumsLoaded, setAlbumsLoaded] = React.useState(false);

  // Fetch albums from API
  React.useEffect(() => {
    fetch("/api/v1/albums")
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data);
        setAlbumsLoaded(true);
        console.log(data);
      });
  }, []);

  return (
    <div className="albums librarypage">
      {albumsLoaded
        ? albums.map((album) => (
            <Album key={album.Id} id={album.Id} title={album.Title} />
          ))
        : "Loading..."}
    </div>
  );
}
