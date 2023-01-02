export default function Album(props) {
  return (
    <div className="album">
      <a href={`#app/album/${props.id}`}>
        <img src={`/api/v1/albums/${props.id}/cover`} alt={props.title} />
        <div className="album-info">{props.title}</div>
      </a>
    </div>
  );
}
