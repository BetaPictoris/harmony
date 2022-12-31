import "./styles/TabBar.scss";

export default function TabBar(props) {
  return (
    <div className="tabBar">
      {props.tabs.map((tab, index) => {
        var isActive = props.path === tab.path;
        return (
          <span>
            <button
              className={
                "tabBarButton" + (isActive ? " activeTabBarButton" : "")
              }
              key={index}
              onClick={() => {
                window.location.hash = tab.path;
              }}
            >
              {tab.name}
            </button>
          </span>
        );
      })}
    </div>
  );
}
