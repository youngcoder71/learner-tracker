import { useState, useEffect } from "react";
import api from "../../services/api";
import useLocationSearch from "../../hooks/useLocationSearch";

const AdminLearners = () => {
  const [learners, setLearners] = useState([]);
  const [filteredLearners, setFilteredLearners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    learnerName: "", institutionName: "", gender: "Male", disability: false,
    educationLevel: "Primary", areaType: "Rural", location: "",
  });
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [selected, setSelected] = useState([]);

  const { searchTerm, setSearchTerm, suggestions, isLoading: locationLoading, isOpen, selectLocation, clearSearch } = useLocationSearch();

  const fetchLearners = () => api.get("/admin/learners").then(r => {
    setLearners(r.data.learners);
    setFilteredLearners(r.data.learners);
  });
  useEffect(() => { fetchLearners(); }, []);

  useEffect(() => {
    let result = learners;
    if (search) result = result.filter(l => l.learner_name.toLowerCase().includes(search.toLowerCase()) || l.institution_name.toLowerCase().includes(search.toLowerCase()) || l.location.toLowerCase().includes(search.toLowerCase()) || l.teacher_name?.toLowerCase().includes(search.toLowerCase()));
    if (filterLevel !== "all") result = result.filter(l => l.education_level === filterLevel);
    if (filterGender !== "all") result = result.filter(l => l.gender === filterGender);
    setFilteredLearners(result);
    setSelected([]);
  }, [search, filterLevel, filterGender, learners]);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filteredLearners.length ? [] : filteredLearners.map(l => l.id));
  const deleteSelected = async () => { if (selected.length === 0) return; if (!confirm(`Delete ${selected.length}?`)) return; for (const id of selected) await api.delete(`/admin/learners/${id}`); setSelected([]); fetchLearners(); };
  const deleteAll = async () => { if (!confirm("Delete ALL?")) return; for (const l of filteredLearners) await api.delete(`/admin/learners/${l.id}`); fetchLearners(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) { await api.put(`/admin/learners/${editingId}`, form); }
    else { await api.post("/admin/learners", form); }
    setForm({ learnerName: "", institutionName: "", gender: "Male", disability: false, educationLevel: "Primary", areaType: "Rural", location: "" });
    setShowForm(false); setEditingId(null); clearSearch(); fetchLearners();
  };

  const handleEdit = (l) => {
    setForm({ learnerName: l.learner_name, institutionName: l.institution_name, gender: l.gender, disability: l.disability, educationLevel: l.education_level, areaType: l.area_type || "Rural", location: l.location });
    setSearchTerm(l.location); setEditingId(l.id); setShowForm(true);
  };

  const handleDelete = async (id) => { if (confirm("Delete?")) { await api.delete(`/admin/learners/${id}`); fetchLearners(); } };

  const levels = ["Early Education", "Primary", "Secondary", "Tertiary", "Professional"];

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-section-title">Learners</h2>
        <button className="btn-add" onClick={() => { setEditingId(null); setForm({ learnerName: "", institutionName: "", gender: "Male", disability: false, educationLevel: "Primary", areaType: "Rural", location: "" }); clearSearch(); setShowForm(!showForm); }}>{showForm ? "Cancel" : "+ Add Learner"}</button>
      </div>
      <div className="admin-search-row">
        <input className="form-input admin-search-input" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-select admin-filter-select" value={filterLevel} onChange={e => setFilterLevel(e.target.value)}><option value="all">All Levels</option>{levels.map(l => <option key={l} value={l}>{l}</option>)}</select>
        <select className="form-select admin-filter-select" value={filterGender} onChange={e => setFilterGender(e.target.value)}><option value="all">All Genders</option><option value="Male">Male</option><option value="Female">Female</option></select>
      </div>
      {selected.length > 0 && (<div className="bulk-actions"><span>{selected.length} selected</span><button className="btn-delete" onClick={deleteSelected}>Delete Selected</button></div>)}
      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <input className="form-input" placeholder="Learner Name" value={form.learnerName} onChange={e => setForm({...form, learnerName: e.target.value})} required />
          <input className="form-input" placeholder="Institution" value={form.institutionName} onChange={e => setForm({...form, institutionName: e.target.value})} required />
          <select className="form-select" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}><option value="Male">Male</option><option value="Female">Female</option></select>
          <select className="form-select" value={form.educationLevel} onChange={e => setForm({...form, educationLevel: e.target.value})}>{levels.map(l => <option key={l} value={l}>{l}</option>)}</select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "12px" }}>Area Type</label>
              <select className="form-select" value={form.areaType} onChange={e => setForm({...form, areaType: e.target.value})}><option value="Rural">Rural</option><option value="Urban">Urban</option></select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "12px" }}>Location (Search city, town, or region)</label>
              <div className="autocomplete-wrapper">
                <input className="form-input" placeholder="Type to search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setForm({...form, location: e.target.value}); }} autoComplete="off" required />
                {locationLoading && <span className="autocomplete-spinner">⟳</span>}
                {searchTerm && !locationLoading && <button type="button" className="autocomplete-clear" onClick={clearSearch}>✕</button>}
                {isOpen && suggestions.length > 0 && <ul className="autocomplete-dropdown">{suggestions.map((loc, i) => <li key={i} className="autocomplete-item" onClick={() => { selectLocation(loc); setForm({...form, location: loc}); }}>{loc}</li>)}</ul>}
                {isOpen && !locationLoading && suggestions.length === 0 && <ul className="autocomplete-dropdown"><li className="autocomplete-item no-results">No locations found</li></ul>}
              </div>
            </div>
          </div>
          <label className="checkbox-label"><input type="checkbox" checked={form.disability} onChange={e => setForm({...form, disability: e.target.checked})} /> Disability</label>
          <button className="btn-submit" type="submit">{editingId ? "Update Learner" : "Add Learner"}</button>
        </form>
      )}
      <div className="table-actions"><button className="btn-delete-outline" onClick={deleteAll} disabled={filteredLearners.length === 0}>🗑 Delete All</button></div>
      <table className="admin-table">
        <thead><tr><th><input type="checkbox" checked={selected.length === filteredLearners.length && filteredLearners.length > 0} onChange={toggleAll} /></th><th>Name</th><th>Institution</th><th>Gender</th><th>Level</th><th>Area</th><th>Location</th><th>Coordinator</th><th>Actions</th></tr></thead>
        <tbody>
          {filteredLearners.map(l => (
            <tr key={l.id} className={selected.includes(l.id) ? "selected-row" : ""}>
              <td><input type="checkbox" checked={selected.includes(l.id)} onChange={() => toggleSelect(l.id)} /></td>
              <td>{l.learner_name}</td><td>{l.institution_name}</td><td>{l.gender}</td><td>{l.education_level}</td><td>{l.area_type || "—"}</td><td>{l.location}</td><td>{l.teacher_name}</td>
              <td className="actions-cell"><button className="btn-edit" onClick={() => handleEdit(l)}>Edit</button><button className="btn-delete" onClick={() => handleDelete(l.id)}>Delete</button></td>
            </tr>
          ))}
          {filteredLearners.length === 0 && <tr><td colSpan="9" className="empty-cell">No learners found</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLearners;