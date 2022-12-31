import Section from "../components/Section";

export default function HomePage() {
  return (
    <div className="home page">
      <h1 className="pageTitle">Welcome back!</h1>
      <div className="homeContent pageContent">
        <Section title="Jump back in...">
          Recently play albums placeholder
        </Section>
      </div>
      <div className="homeFooter pageFooter">
        Made with <span className="heart">❤️</span> by{" "}
        <a href="//github.com/BetaPictoris" target="_blank">
          Beta Pictoris
        </a>
      </div>
    </div>
  );
}
