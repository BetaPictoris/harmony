import LinkButton from "./LinkButton";
import "./styles/Sidebar.scss";

const pages = ["search", "home", "library"];

function isPage(page, currentPage) {
  if (page === "home" && currentPage === "") {
    return true;
  }

  return page === currentPage;
}

export default function Sidebar(props) {
  let p = props.path.replace("#", "");

  return (
    <div className="sidebar">
      <div className="sidebarHeader">
        <img className="headerImg" src="/assets/svg/Ico.svg" alt="Harmony" />
      </div>

      <div className="sidebarLinks">
        {pages.map((page) => (
          <LinkButton
            path={page === "home" ? "" : page}
            icon={page}
            text={page.charAt(0).toUpperCase() + page.slice(1)}
            active={isPage(page, p)}
          />
        ))}
      </div>
    </div>
  );
}
