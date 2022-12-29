import React from "react";
import Sidebar from "./components/Sidebar";

import "./styles/App.css";

function App() {
  const [path, setPath] = React.useState(window.location.hash);

  window.onhashchange = () => {
    setPath(window.location.hash);
  };

  return (
    <div className="App">
      <Sidebar path={path} />
    </div>
  );
}

export default App;
