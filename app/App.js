import React from "react";

import Sidebar from "./components/Sidebar";
import MediaPlayer from "./components/MediaPlayer";

import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";

import AlbumPage from "./pages/AlbumPage";

import "./styles/App.scss";
import "./styles/Pages.scss";

export default function App() {
  const [path, setPath] = React.useState(window.location.hash);

  window.onhashchange = () => {
    setPath(window.location.hash);
  };

  return (
    <div className="App">
      <Sidebar path={path} />
      <div className="content">
        {/* Router using URL hash */}
        {path === "" && <HomePage />}

        {path === "#search" && <SearchPage />}
        {path.startsWith("#library") && <LibraryPage path={path} />}
        {path === "#settings" && <SettingsPage />}

        {path.startsWith("#album") && <AlbumPage path={path} />}
      </div>
      <div className="Controls">
        <MediaPlayer />
      </div>
    </div>
  );
}
