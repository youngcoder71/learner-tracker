import { useState, useEffect } from "react";
import api from "../../services/api";
import useLocationSearch from "../../hooks/useLocationSearch";

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", areaType: "Rural", location: "", event_date: "", theme: "" });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const { searchTerm, setSearchTerm, suggestions, isLoading: locationLoading, isOpen, selectLocation, clearSearch } = useLocationSearch();

  const fetchEvents = () => api.get("/admin/events").then(r => setEvents(r.data.events));
  useEffect(() => { fetchEvents(); }, []);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" }) : "";
  const formatTime = (d) => d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";

  const filteredEvents = events.filter(e => {
    const m = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.location.toLowerCase().includes(search.toLowerCase()) || e.submitted_by_name?.toLowerCase().includes(search.toLowerCase());
    return m && (filterStatus === "all" || e.status === filterStatus);
  });

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filteredEvents.length ? [] : filteredEvents.map(e => e.id));
  const handleApprove = async (id) => { await api.put(`/admin/events/${id}`, { status: "active" }); fetchEvents(); };
  const handleReject = async (id) => { await api.put(`/admin/events/${id}`, { status: "rejected" }); fetchEvents(); };
  const handleDelete = async (id) => { if (confirm("Delete?")) { await api.delete(`/admin/events/${id}`); fetchEvents(); } };
  const handleDeleteSelected = async () => { if (!selected.length) return; if (!confirm(`Delete ${selected.length}?`)) return; for (const id of selected) await api.delete(`/admin/events/${id}`); setSelected([]); fetchEvents(); };
  const handleDeleteAll = async () => { if (!confirm("Delete ALL?")) return; for (const e of filteredEvents) await api.delete(`/admin/events/${e.id}`); fetchEvents(); };

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post("/admin/events", form);
    setForm({ name: "", areaType: "Rural", location: "", event_date: "", theme: "" });
    setShowForm(false); clearSearch(); fetchEvents();
  };

  return (
    <div>
      <div className="admin-header-row"><h2 className="admin-section-title">Events</h2><button className="btn-add" onClick={() => { clearSearch(); setShowForm(!showForm); }}>{showForm ? "Cancel" : "+ Add Event"}</button></div>
      <div className="admin-search-row">
        <input className="form-input admin-search-input" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-select admin-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}><option value="all">All</option><option value="pending">Pending</option><option value="active">Active</option><option value="rejected">Rejected</option></select>
      </div>
      {selected.length > 0 && (<div className="bulk-actions"><span>{selected.length} selected</span><button className="btn-delete" onClick={handleDeleteSelected}>Delete Selected</button></div>)}
      {showForm && (
        <form onSubmit={handleCreate} className="admin-form">
          <input className="form-input" placeholder="Event Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "12px" }}>Area Type</label>
              <select className="form-select" value={form.areaType} onChange={e => setForm({...form, areaType: e.target.value})}><option value="Rural">Rural</option><option value="Urban">Urban</option></select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: "12px" }}>Location</label>
              <div className="autocomplete-wrapper">
                <input className="form-input" placeholder="Type to search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setForm({...form, location: e.target.value}); }} autoComplete="off" required />
                {locationLoading && <span className="autocomplete-spinner">⟳</span>}
                {searchTerm && !locationLoading && <button type="button" className="autocomplete-clear" onClick={clearSearch}>✕</button>}
                {isOpen && suggestions.length > 0 && <ul className="autocomplete-dropdown">{suggestions.map((loc, i) => <li key={i} className="autocomplete-item" onClick={() => { selectLocation(loc); setForm({...form, location: loc}); }}>{loc}</li>)}</ul>}
                {isOpen && !locationLoading && suggestions.length === 0 && <ul className="autocomplete-dropdown"><li className="autocomplete-item no-results">No locations found</li></ul>}
              </div>
            </div>
          </div>
          <input className="form-input" type="datetime-local" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} required />
          <textarea className="form-textarea" placeholder="Theme" value={form.theme} onChange={e => setForm({...form, theme: e.target.value})} required />
          <button className="btn-submit" type="submit">Create Event</button>
        </form>
      )}
      <div className="table-actions"><button className="btn-delete-outline" onClick={handleDeleteAll} disabled={filteredEvents.length === 0}>🗑 Delete All</button></div>
      <div className="admin-table-wrapper">
        <table className="admin-table">
        <thead><tr><th><input type="checkbox" checked={selected.length === filteredEvents.length && filteredEvents.length > 0} onChange={toggleAll} /></th><th>Name</th><th>Date</th><th>Area</th><th>Location</th><th>Status</th><th>By</th><th>Actions</th></tr></thead>
        <tbody>
          {filteredEvents.map(e => (
            <tr key={e.id} className={selected.includes(e.id) ? "selected-row" : ""}>
              <td><input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggleSelect(e.id)} /></td>
              <td><span className="clickable-name" onClick={() => setSelectedEvent(e)} style={{ cursor:"pointer", color:"#2196f3", fontWeight:600 }}>{e.name}</span></td>
              <td>{new Date(e.event_date).toLocaleDateString()}</td><td>{e.area_type || "—"}</td><td>{e.location}</td>
              <td><span className={`badge badge-${e.status}`}>{e.status}</span></td><td>{e.submitted_by_name}</td>
              <td className="actions-cell">
                {e.status === "pending" && <><button className="btn-approve" onClick={() => handleApprove(e.id)}>Approve</button><button className="btn-reject" onClick={() => handleReject(e.id)}>Reject</button></>}
                <button className="btn-delete" onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredEvents.length === 0 && <tr><td colSpan="8" className="empty-cell">No events</td></tr>}
        </tbody>
      </table>
      
      </div>
      
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-modal" onClick={e => e.stopPropagation()}>
            <button className="event-modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            <div className="event-modal-badge">{selectedEvent.status}</div>
            <h2 className="event-modal-title">{selectedEvent.name}</h2>
            <div className="event-modal-details">
              <div className="event-modal-detail-row"><span>📅</span><div><strong>Date</strong><p>{formatDate(selectedEvent.event_date)} at {formatTime(selectedEvent.event_date)}</p></div></div>
              <div className="event-modal-detail-row"><span>📍</span><div><strong>Location</strong><p>{selectedEvent.location} ({selectedEvent.area_type})</p></div></div>
              <div className="event-modal-detail-row"><span>📝</span><div><strong>Theme</strong><p>{selectedEvent.theme}</p></div></div>
              <div className="event-modal-detail-row"><span>👤</span><div><strong>By</strong><p>{selectedEvent.submitted_by_name}</p></div></div>
            </div>
            {selectedEvent.status === "pending" && (
              <div style={{display:"flex",gap:"10px",marginTop:"20px"}}>
                <button className="btn-approve" style={{flex:1,padding:"12px"}} onClick={()=>{handleApprove(selectedEvent.id);setSelectedEvent(null);}}>✅ Approve</button>
                <button className="btn-reject" style={{flex:1,padding:"12px"}} onClick={()=>{handleReject(selectedEvent.id);setSelectedEvent(null);}}>❌ Reject</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;