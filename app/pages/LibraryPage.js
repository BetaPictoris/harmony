import TabBar from "../components/TabBar";

import AlbumsPage from "./library/AlbumsPage";
import ArtistsPage from "./library/ArtistsPage";
import PlaylistsPage from "./library/PlaylistsPage";

import "./styles/LibraryPage.scss";

const tabs = [
  { name: "Albums", path: "#library/albums" },
  { name: "Artists", path: "#library/artists" },
  { name: "Playlists", path: "#library/playlists" },
];

export default function LibraryPage(props) {
  if (props.path === "#library") {
    window.location.hash = "#library/albums";
  }

  return (
    <div className="library page">
      <h1 className="pageTitle">Library</h1>
      <div className="libraryTabsbar">
        <TabBar tabs={tabs} path={props.path} />
      </div>
      <div className="librarySubpage">
        {props.path === "#library/albums" && <AlbumsPage />}
        {props.path === "#library/artists" && <ArtistsPage />}
        {props.path === "#library/playlists" && <PlaylistsPage />}
      </div>
    </div>
  );
}