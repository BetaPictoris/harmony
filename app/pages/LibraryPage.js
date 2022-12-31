import AlbumsPage from "./library/AlbumsPage";
import ArtistsPage from "./library/ArtistsPage";
import PlaylistsPage from "./library/PlaylistsPage";

export default function LibraryPage(props) {
  if (props.path === "#library") {
    window.location.hash = "#library/albums";
  }

  return (
    <div className="library page">
      <h1>Library</h1>
      <div className="librarySubpage">
        {props.path === "#library/albums" && <AlbumsPage />}
        {props.path === "#library/artists" && <ArtistsPage />}
        {props.path === "#library/playlists" && <PlaylistsPage />}
      </div>
    </div>
  );
}
