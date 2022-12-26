export default function LinkButton(props) {
  return (
    <a className="LinkButton" href={`/app#${props.path}`}>
      <img
        width={32}
        src={`/app/assets/svg/icons/${props.icon}.svg`}
        alt={props.alt ? props.alt : `${props.text}`}
      />
      {props.text}
    </a>
  );
}
