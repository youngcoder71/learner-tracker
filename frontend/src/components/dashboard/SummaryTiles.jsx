import "../../styles/dashboard.css";

const SummaryTiles = ({ cards }) => {
  const tileData = [
    {
      label: "Total Learners",
      value: cards.totalLearners,
      color: "#ff6b00",
      icon: "👥",
    },
    {
      label: "Female Learners",
      value: cards.femaleLearners,
      color: "#e91e63",
      icon: "👧",
    },
    {
      label: "Male Learners",
      value: cards.maleLearners,
      color: "#2196f3",
      icon: url('https://www.flaticon.com/free-icons/teacher'),
    },
    {
      label: "Learners with Disabilities",
      value: cards.disabledLearners,
      color: "#9c27b0",
      icon: "♿",
    },
    {
      label: "Institutions",
      value: cards.totalInstitutions,
      color: "#4caf50",
      icon: "🏫",
    },
  ];

  return (
    <div className="section-container">
      <h2 className="section-title">Dashboard Overview</h2>
      <div className="tiles-container">
        {tileData.map((tile, index) => (
          <div
            className="tile-card"
            key={index}
            style={{ borderTopColor: tile.color }}
          >
            <span className="tile-icon">{tile.icon}</span>
            <span className="tile-value" style={{ color: tile.color }}>
              {tile.value.toLocaleString()}
            </span>
            <span className="tile-label">{tile.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryTiles;