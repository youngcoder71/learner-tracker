import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/dashboard").then(r => setStats(r.data)).catch(console.error);
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: "Total Learners", value: stats.totalLearners, color: "#ff6b00", icon: "🎓" },
{ label: "Total Coordinators", value: stats.totalTeachers, color: "#2196f3", icon: "👨‍🏫" },    { label: "Total Partners", value: stats.totalPartners, color: "#4caf50", icon: "🤝" },
    { label: "Total Events", value: stats.totalEvents, color: "#9c27b0", icon: "📅" },
    { label: "Pending Events", value: stats.pendingEvents, color: "#e91e63", icon: "⏳" },
  ];

  return (
    <div>
      <h2 className="admin-section-title">Overview</h2>
      <div className="admin-cards">
        {cards.map((card, i) => (
          <div key={i} className="admin-card" style={{ borderTopColor: card.color }}>
            <span className="admin-card-icon">{card.icon}</span>
            <span className="admin-card-value" style={{ color: card.color }}>{card.value}</span>
            <span className="admin-card-label">{card.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;