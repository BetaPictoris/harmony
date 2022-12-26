import "./styles/LinkButton.scss";

export default function LinkButton(props) {
  var activeClass = "unactive";
  if (props.active) {
    activeClass = "active";
  }

  return (
    <a className={`LinkButton ${activeClass}`} href={`/app#${props.path}`}>
      <img
        width={32}
        src={`/app/assets/svg/icons/${props.icon}.svg`}
        alt={props.alt ? props.alt : `${props.text}`}
      />
      <span className="LinkText">{props.text}</span>
    </a>
  );
}
