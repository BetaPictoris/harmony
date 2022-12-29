import "./styles/LinkButton.scss";

export default function LinkButton(props) {
  var activeClass = "unactive";
  if (props.active) {
    activeClass = "active";
  }

  console.log(activeClass);

  return (
    <a className="LinkButtonLink" href={`/app#${props.path}`}>
      <div className={`LinkButton  ${activeClass}`}>
        <img
          width={32}
          src={`/app/assets/svg/icons/${props.icon}.svg`}
          alt={props.alt ? props.alt : `${props.text}`}
        />
        <span className="LinkText">{props.text}</span>
      </div>
    </a>
  );
}
