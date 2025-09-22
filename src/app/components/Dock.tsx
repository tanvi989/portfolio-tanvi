export default function Dock() {
  return (
    <div className="mac-dock">
      {[
        "fa-home",
        "fa-folder",
        "fa-code",
        "fa-envelope",
        "fa-github",
        "fa-linkedin",
        "fa-cog",
      ].map((i) => (
        <div key={i} className="dock-item">
          <i className={`fas ${i}`} />
        </div>
      ))}
    </div>
  );
}
