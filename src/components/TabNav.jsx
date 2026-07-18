const TABS = [
  { id: "match", label: "Match", tone: "match" },
  { id: "mois", label: "Mois", tone: "mois" },
  { id: "saison", label: "Saison", tone: "saison" },
  { id: "defis", label: "Défis", tone: "defis" },
];

export default function TabNav({ active, onChange }) {
  return (
    <nav className="tab-nav">
      <div className="tab-nav-scroll">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn tab-${t.tone}` + (active === t.id ? " active" : "")}
            onClick={() => onChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
