import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ fullName: "", schoolName: "", position: "teacher", email: "" });
  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("all");
  const [selected, setSelected] = useState([]);
  const [generatedPassword, setGeneratedPassword] = useState("");

  const fetchUsers = () => api.get("/admin/users").then(r => {
    setUsers(r.data.users);
    setFilteredUsers(r.data.users);
  });

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let result = users;
    if (search) {
      result = result.filter(u =>
        u.full_name.toLowerCase().includes(search.toLowerCase()) ||
        u.school_name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterPosition !== "all") result = result.filter(u => u.position === filterPosition);
    setFilteredUsers(result);
    setSelected([]);
  }, [search, filterPosition, users]);

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const toggleAll = () => setSelected(selected.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Delete ${selected.length} selected users?`)) return;
    for (const id of selected) await api.delete(`/admin/users/${id}`);
    setSelected([]);
    fetchUsers();
  };

  const deleteAll = async () => {
    if (!confirm("Delete ALL users? This cannot be undone!")) return;
    for (const u of filteredUsers) await api.delete(`/admin/users/${u.id}`);
    fetchUsers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/admin/users/${editingId}`, form);
      setForm({ fullName: "", schoolName: "", position: "teacher", email: "" });
      setShowForm(false);
      setEditingId(null);
      fetchUsers();
    } else {
      try {
        const res = await api.post("/admin/users", form);
        setGeneratedPassword(res.data.password);
        setForm({ fullName: "", schoolName: "", position: "teacher", email: "" });
        setShowForm(false);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to create user");
      }
    }
  };

  const handleEdit = (user) => {
    setForm({ fullName: user.full_name, schoolName: user.school_name, position: user.position, email: user.email });
    setEditingId(user.id);
    setShowForm(true);
    setGeneratedPassword("");
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this user?")) { await api.delete(`/admin/users/${id}`); fetchUsers(); }
  };

  return (
    <div>
      <div className="admin-header-row">
        <h2 className="admin-section-title">Users</h2>
        <button className="btn-add" onClick={() => { 
          setEditingId(null); 
          setForm({ fullName: "", schoolName: "", position: "teacher", email: "" }); 
          setGeneratedPassword("");
          setShowForm(!showForm); 
        }}>
          {showForm ? "Cancel" : "+ Add User"}
        </button>
      </div>

      <div className="admin-search-row">
        <input className="form-input admin-search-input" placeholder="🔍 Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="form-select admin-filter-select" value={filterPosition} onChange={e => setFilterPosition(e.target.value)}>
          <option value="all">All Positions</option>
          <option value="teacher">Coordinator</option>
          <option value="partnership">Partnership</option>
          <option value="both">Both</option>
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
          <input className="form-input" placeholder="Full Name" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
          <input className="form-input" placeholder="School Name" value={form.schoolName} onChange={e => setForm({...form, schoolName: e.target.value})} required />
          <select className="form-select" value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
            <option value="teacher">Coordinator</option>
            <option value="partnership">Partnership</option>
            <option value="both">Both</option>
          </select>
          <input className="form-input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          {!editingId && (
            <p style={{ fontSize: "13px", color: "#888", margin: "0" }}>
              A password will be generated and sent to this email.
            </p>
          )}
          <button className="btn-submit" type="submit">{editingId ? "Update User" : "Create User"}</button>
        </form>
      )}

      {generatedPassword && (
        <div className="alert alert-success" style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <span>
            ✅ User created! Password: <strong>{generatedPassword}</strong>
            <br />
            <small>The password has been sent to the user's email.</small>
          </span>
          <button 
            style={{ background: "none", border: "none", color: "#ff6b00", cursor: "pointer", fontWeight: 600, fontSize: "13px" }}
            onClick={() => setGeneratedPassword("")}
          >Dismiss</button>
        </div>
      )}

      <div className="table-actions">
        <button className="btn-delete-outline" onClick={deleteAll} disabled={filteredUsers.length === 0}>🗑 Delete All</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th><input type="checkbox" checked={selected.length === filteredUsers.length && filteredUsers.length > 0} onChange={toggleAll} /></th>
            <th>Name</th><th>School</th><th>Position</th><th>Email</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id} className={selected.includes(u.id) ? "selected-row" : ""}>
              <td><input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} /></td>
              <td>{u.full_name}</td><td>{u.school_name}</td><td>{u.position}</td><td>{u.email}</td>
              <td className="actions-cell">
                <button className="btn-edit" onClick={() => handleEdit(u)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {filteredUsers.length === 0 && <tr><td colSpan="6" className="empty-cell">No users found</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;