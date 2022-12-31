export default function Section(props) {
  return (
    <div className="section">
      <div className="sectionHeader">
        <h2>{props.title}</h2>
      </div>
      <div className="sectionContent">{props.children}</div>
    </div>
  );
}
