import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminTrash = () => {
  const [trash, setTrash] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState([]);

  const fetchTrash = () => api.get("/admin/trash").then(r => setTrash(r.data.trash));

  useEffect(() => { fetchTrash(); }, []);

  const filtered = filter === "all" ? trash : trash.filter(t => t.item_type === filter);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(t => t.id));

  const handleRestore = async (id) => {
    await api.post(`/admin/trash/${id}/restore`);
    setSelected(prev => prev.filter(x => x !== id));
    fetchTrash();
  };

  const handleRestoreSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Restore ${selected.length} selected items?`)) return;
    for (const id of selected) {
      await api.post(`/admin/trash/${id}/restore`);
    }
    setSelected([]);
    fetchTrash();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete permanently? This cannot be undone!")) return;
    await api.delete(`/admin/trash/${id}`);
    setSelected(prev => prev.filter(x => x !== id));
    fetchTrash();
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Permanently delete ${selected.length} selected items?`)) return;
    for (const id of selected) {
      await api.delete(`/admin/trash/${id}`);
    }
    setSelected([]);
    fetchTrash();
  };

  const handleEmpty = async () => {
    if (!confirm("Empty entire trash? This cannot be undone!")) return;
    await api.delete("/admin/trash/empty/all");
    fetchTrash();
  };

  const formatDate = (d) => new Date(d).toLocaleDateString();
  const daysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-section-title">Trash</h2>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn-delete-outline" onClick={handleEmpty} disabled={trash.length === 0}>
            🗑 Empty All
          </button>
        </div>
      </div>

      <div className="admin-search-row">
        <select className="form-select admin-filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="user">Users</option>
          <option value="learner">Learners</option>
          <option value="partnership">Partnerships</option>
          <option value="event">Events</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bulk-actions">
          <span>{selected.length} selected</span>
          <button className="btn-approve" onClick={handleRestoreSelected}>↩ Restore Selected</button>
          <button className="btn-delete" onClick={handleDeleteSelected}>🗑 Delete Selected</button>
        </div>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></th>
            <th>Type</th><th>Name/Details</th><th>Deleted</th><th>Expires In</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(item => {
            const data = item.item_data;
            const name = data.full_name || data.learner_name || data.name || "—";
            const detail = item.item_type === "user" ? data.email :
                          item.item_type === "learner" ? `${data.institution_name} • ${data.education_level}` :
                          item.item_type === "event" ? data.location : "";
            return (
              <tr key={item.id} className={selected.includes(item.id) ? "selected-row" : ""}>
                <td><input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggleSelect(item.id)} /></td>
                <td><span className={`badge badge-${item.item_type}`}>{item.item_type}</span></td>
                <td>
                  <strong>{name}</strong>
                  {detail && <div style={{ fontSize: "12px", color: "#888" }}>{detail}</div>}
                </td>
                <td>{formatDate(item.deleted_at)}</td>
                <td>{daysLeft(item.expires_at)} days</td>
                <td className="actions-cell">
                  <button className="btn-approve" onClick={() => handleRestore(item.id)}>Restore</button>
                  <button className="btn-delete" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
          {filtered.length === 0 && <tr><td colSpan="6" className="empty-cell">Trash is empty</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTrash;