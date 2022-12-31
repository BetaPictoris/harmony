import LinkButton from "./LinkButton";
import "./styles/Sidebar.scss";

const pages = ["search", "home", "library"];

function isPage(page, currentPage) {
  if (page === "home" && currentPage === "") {
    return true;
  }

  if (page === "library" && currentPage.startsWith("library")) {
    return true;
  }

  return page === currentPage;
}

export default function Sidebar(props) {
  let p = props.path.replace("#", "");

  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <img
          className="headerImg"
          src="/app/assets/svg/Ico.svg"
          alt="Harmony"
          width="64px"
        />
      </div>

      <div className="sidebarLinks">
        {pages.map((page) => (
          <span className="sidebarLink">
            <LinkButton
              path={page === "home" ? "" : page}
              icon={page}
              text={page.charAt(0).toUpperCase() + page.slice(1)}
              active={isPage(page, p)}
            />
          </span>
        ))}
      </div>

      <div className="sidebarFooter">
        <div className="footerText">
          <span className="sidebarLink">
            <LinkButton
              path="settings"
              icon="settings"
              text="Settings"
              active={isPage("settings", p)}
            />
          </span>
        </div>
      </div>
    </div>
  );
}
