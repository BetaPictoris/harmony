import "./styles/Album.scss";

export default function Album(props) {
  return (
    <div className="album">
      <a className="albumLink" href={`#album/${props.id}`}>
        <img
          className="albumImg"
          src={`/api/v1/albums/${props.id}/cover`}
          alt={props.title}
        />
        <div className="albumInfo">{props.title}</div>
      </a>
    </div>
  );
}
