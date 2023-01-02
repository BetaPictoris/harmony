import "./styles/Album.scss";

export default function Album(props) {
  return (
    <div className="album">
      <a href={`#app/album/${props.id}`}>
        <img
          class="albumImg"
          src={`/api/v1/albums/${props.id}/cover`}
          alt={props.title}
        />
        <div className="albumInfo">{props.title}</div>
      </a>
    </div>
  );
}
