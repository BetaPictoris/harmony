import React from "react";

export default function Album(props) {
  const [album, setAlbum] = React.useState({});

  // Fetch album data from API
  React.useEffect(() => {
    fetch(`/api/v1/albums/${props.match.params.id}`)
      .then((response) => response.json())
      .then((data) => setAlbum(data));
  }, [props.match.params.id]);

  return (
    <div className="album">
      <a href={`#app/album/${album.id}`}>
        <img src={`/api/v1/albums/${album.id}/cover`} alt={album.title} />
        <div className="album-info">{album.title}</div>
      </a>
    </div>
  );
}
