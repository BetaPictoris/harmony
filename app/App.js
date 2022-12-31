import React from "react";
import Sidebar from "./components/Sidebar";

import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";

import "./styles/App.scss";
import "./styles/Pages.scss";

function App() {
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
      </div>
    </div>
  );
}

export default App;
