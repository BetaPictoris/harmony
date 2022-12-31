import React from "react";
import Sidebar from "./components/Sidebar";

import "./styles/App.css";

import HomePage from "./pages/HomePage";
import LibraryPage from "./pages/LibraryPage";
import SearchPage from "./pages/SearchPage";

function App() {
  const [path, setPath] = React.useState(window.location.hash);

  window.onhashchange = () => {
    setPath(window.location.hash);
  };

  return (
    <div className="App">
      <Sidebar path={path} />
      <div className="content">
        {path === "#search" && <SearchPage />}
        {path === "" && <HomePage />}
        {path.startsWith("#library") && <LibraryPage path={path} />}
      </div>
    </div>
  );
}

export default App;
