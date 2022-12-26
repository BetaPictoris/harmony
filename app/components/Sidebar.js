import LinkButton from "./LinkButton";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <img className="headerImg" src="/assets/svg/Ico.svg" alt="Harmony" />
      </div>

      <div className="sidebarLinks">
        <LinkButton path="search" icon="search" text="Search" />
        <LinkButton path="" icon="home" text="Home" />
        <LinkButton path="library" icon="library" text="Library" />
      </div>
    </div>
  );
}
