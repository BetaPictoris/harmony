import React from "react";

import Section from "../components/Section";
import Album from "../components/Album";

import "./styles/HomePage.scss";

function randomEmoji() {
  const emojis = ["❤️", "✨", "🌈"];
  return emojis[Math.floor(Math.random() * emojis.length)];
}

export default function HomePage() {
  const [recentlyPlayed, setRecentlyPlayed] = React.useState([]);
  const [loadedRecentlyPlayed, setRecentlyPlayedLoaded] = React.useState(false);

  React.useEffect(() => {
    // TODO: Use the API to get recently played tracks, this needs to be done
    // on the server side first.
    fetch("/api/v1/albums")
      .then((res) => res.json())
      .then((data) => {
        setRecentlyPlayed(data);
        setRecentlyPlayedLoaded(true);
      });
  }, []);

  return (
    <div className="home page">
      <h1 className="pageTitle">Welcome back!</h1>
      <div className="homeContent pageContent">
        <Section title="Jump back in...">
          <div className="recentlyPlayed">
            {loadedRecentlyPlayed ? (
              recentlyPlayed.map((album) => (
                <Album key={album.Id} id={album.Id} title={album.Title} />
              ))
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </Section>
      </div>
      <div className="homeFooter pageFooter">
        Made with <span className="heart">{randomEmoji()}</span> by{" "}
        <a href="//www.ozx.me?ref=harmony" target="_blank" rel="noreferrer">
          Beta Pictoris
        </a>
      </div>
    </div>
  );
}
