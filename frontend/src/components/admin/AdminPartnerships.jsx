import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminPartnerships = () => {
  const [partnerships, setPartnerships] = useState([]);
  const [filteredPartnerships, setFilteredPartnerships] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    partnerName: "",
    institution: "",
    hasPartnership: "Yes",
    hasMou: "Yes",
    csvFilename: "",
    photoLink: "",
  });
  const [search, setSearch] = useState("");
  const [filterPartner, setFilterPartner] = useState("all");
  const [filterMou, setFilterMou] = useState("all");
  const [selected, setSelected] = useState([]);

  const fetchData = () => {
    api.get("/admin/partnerships").then(r => {
      setPartnerships(r.data.partnerships);
      setFilteredPartnerships(r.data.partnerships);
    });
  };
  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    let result = partnerships;
    if (search) {
      result = result.filter(p =>
        (p.partner_name || p.full_name || "")?.toLowerCase().includes(search.toLowerCase()) ||
        (p.institution || "")?.toLowerCase().includes(search.toLowerCase()) ||
        (p.csv_filename || "")?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterPartner !== "all") result = result.filter(p => p.partner === filterPartner);
    if (filterMou !== "all") result = result.filter(p => p.mou === filterMou);
    setFilteredPartnerships(result);
    setSelected([]);
  }, [search, filterPartner, filterMou, partnerships]);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filteredPartnerships.length ? [] : filteredPartnerships.map(p => p.id));

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected?`)) return;
    for (const id of selected) await api.delete(`/admin/partnerships/${id}`);
    setSelected([]);
    fetchData();
  };

  const deleteAll = async () => {
    if (!confirm("Delete ALL partnerships?")) return;
    for (const p of filteredPartnerships) await api.delete(`/admin/partnerships/${p.id}`);
    fetchData();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/admin/partnerships/${editingId}`, {
        partner: form.hasPartnership,
        mou: form.hasMou,
        csvFilename: form.csvFilename,
        photoLink: form.photoLink,
        partnerName: form.partnerName,
        institution: form.institution,
      });
    } else {
      await api.post("/admin/partnerships", {
        userId: 1, // Default admin user
        partner: form.hasPartnership,
        mou: form.hasMou,
        csvFilename: form.csvFilename,
        photoLink: form.photoLink,
        partnerName: form.partnerName,
        institution: form.institution,
      });
    }
    setForm({ partnerName: "", institution: "", hasPartnership: "Yes", hasMou: "Yes", csvFilename: "", photoLink: "" });
    setShowForm(false);
    setEditingId(null);
    fetchData();
  };

  const handleEdit = (p) => {
    setForm({
      partnerName: p.partner_name || "",
      institution: p.institution || "",
      hasPartnership: p.partner,
      hasMou: p.mou,
      csvFilename: p.csv_filename || "",
      photoLink: p.photo_link || "",
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete?")) { await api.delete(`/admin/partnerships/${id}`); fetchData(); }
  };

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-section-title">Partnerships</h2>
        <button className="btn-add" onClick={() => { setEditingId(null); setForm({ partnerName: "", institution: "", hasPartnership: "Yes", hasMou: "Yes", csvFilename: "", photoLink: "" }); setShowForm(!showForm); }}>
          {showForm ? "Cancel" : "+ Add Partnership"}
        </button>
      </div>

      <div className="admin-search-row">
        <input className="form-input admin-search-input" placeholder="🔍 Search by name, institution or file..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-select admin-filter-select" value={filterPartner} onChange={e => setFilterPartner(e.target.value)}>
          <option value="all">All Partners</option>
          <option value="Yes">Has Partnership</option>
          <option value="No">No Partnership</option>
        </select>
        <select className="form-select admin-filter-select" value={filterMou} onChange={e => setFilterMou(e.target.value)}>
          <option value="all">All MOU</option>
          <option value="Yes">Has MOU</option>
          <option value="No">No MOU</option>
        </select>
      </div>

      {selected.length > 0 && (
        <div className="bulk-actions">
          <span>{selected.length} selected</span>
          <button className="btn-delete" onClick={deleteSelected}>Delete Selected</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-label">Partnership Name</label>
            <input
              className="form-input"
              placeholder="e.g., UNICEF Tanzania"
              value={form.partnerName}
              onChange={e => setForm({...form, partnerName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Institution / Organization</label>
            <input
              className="form-input"
              placeholder="e.g., Ministry of Education"
              value={form.institution}
              onChange={e => setForm({...form, institution: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Is this a formal partnership?</label>
            <select className="form-select" value={form.hasPartnership} onChange={e => setForm({...form, hasPartnership: e.target.value})}>
              <option value="Yes">Yes - Formal partnership</option>
              <option value="No">No - Informal collaboration</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Is there an MOU (Memorandum of Understanding)?</label>
            <select className="form-select" value={form.hasMou} onChange={e => setForm({...form, hasMou: e.target.value})}>
              <option value="Yes">Yes - MOU signed</option>
              <option value="No">No - No MOU yet</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">CSV File Name (optional)</label>
            <input
              className="form-input"
              placeholder="e.g., partnership_data.csv"
              value={form.csvFilename}
              onChange={e => setForm({...form, csvFilename: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Photo / Document Link (optional)</label>
            <input
              className="form-input"
              placeholder="https://drive.google.com/your-file"
              value={form.photoLink}
              onChange={e => setForm({...form, photoLink: e.target.value})}
            />
          </div>

          <button className="btn-submit" type="submit">{editingId ? "Update Partnership" : "Add Partnership"}</button>
        </form>
      )}

      <div className="table-actions">
        <button className="btn-delete-outline" onClick={deleteAll} disabled={filteredPartnerships.length === 0}>🗑 Delete All</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th><input type="checkbox" checked={selected.length === filteredPartnerships.length && filteredPartnerships.length > 0} onChange={toggleAll} /></th>
            <th>Name</th>
            <th>Institution</th>
            <th>Partnership</th>
            <th>MOU</th>
            <th>CSV</th>
            <th>Photo</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPartnerships.map(p => (
            <tr key={p.id} className={selected.includes(p.id) ? "selected-row" : ""}>
              <td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
              <td><strong>{p.partner_name || p.full_name || "—"}</strong></td>
              <td>{p.institution || "—"}</td>
              <td><span className={`badge ${p.partner === "Yes" ? "badge-active" : "badge-rejected"}`}>{p.partner}</span></td>
              <td><span className={`badge ${p.mou === "Yes" ? "badge-active" : "badge-rejected"}`}>{p.mou}</span></td>
              <td>{p.csv_filename || "—"}</td>
              <td>{p.photo_link ? <a href={p.photo_link} target="_blank" rel="noopener noreferrer">View</a> : "—"}</td>
              <td className="actions-cell">
                <button className="btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredPartnerships.length === 0 && <tr><td colSpan="8" className="empty-cell">No partnerships found</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPartnerships;