const TABS = [
  { id: "match", label: "Match" },
  { id: "general", label: "Classement Général" },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav className="tab-nav">
      <div className="tab-nav-scroll">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={"tab-btn" + (active === t.id ? " active" : "")}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
