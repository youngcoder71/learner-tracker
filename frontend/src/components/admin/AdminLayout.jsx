import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useDarkMode from "../../hooks/userDarkMode";
import AdminDashboard from "./AdminDashboard";
import AdminEvents from "./AdminEvents";
import AdminUsers from "./AdminUsers";
import AdminLearners from "./AdminLearners";
import AdminPartnerships from "./AdminPartnerships";
import UserPreview from "./UserPreview";
import AdminTrash from "./AdminTrash";
import "../../styles/admin.css";

const AdminLayout = () => {
  const { logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeMenu, setActiveMenu] = useState("overview");
  const [previewMode, setPreviewMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggle = () => {
    setIsAnimating(true);
    toggleDarkMode();
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (previewMode) {
    return <UserPreview onBack={() => setPreviewMode(false)} />;
  }

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "events", label: "Events", icon: "📅" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "learners", label: "Learners", icon: "🎓" },
    { id: "partnerships", label: "Partners", icon: "🤝" },
    { id: "trash", label: "Trash", icon: "🗑" },
  ];

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Admin Header */}
<header className="admin-header">
  <h1 className="admin-header-title">Learner Tracking System</h1>
  <button
    className={`darkmode-toggle ${isAnimating ? "animating" : ""}`}
    onClick={handleToggle}
    aria-label="Toggle dark mode"
  >
    <span className={`darkmode-icon sun ${!isDark ? "active" : ""}`}>☀️</span>
    <span className={`darkmode-icon moon ${isDark ? "active" : ""}`}>🌙</span>
  </button>
</header>

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar desktop-sidebar">
        <h2 className="admin-logo">Admin Panel</h2>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="admin-nav-divider"></div>
          <button
            className="admin-nav-item preview"
            onClick={() => setPreviewMode(true)}
          >
            <span className="admin-nav-icon">👁</span>
            Preview Site
          </button>
          <button className="admin-nav-item logout" onClick={logout}>
            <span className="admin-nav-icon">🚪</span>
            Logout
          </button>
        </nav>
      </aside>

      {/* Hamburger Button - Right side, below top */}
      {!sidebarOpen && (
  <button
    className="admin-hamburger"
    onClick={() => setSidebarOpen(true)}
    aria-label="Open menu"
  >
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
    <span className="hamburger-line"></span>
  </button>
)}

      {/* Mobile Sidebar Overlay */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Mobile Sidebar - Slides from right */}
      <aside className={`admin-sidebar mobile-sidebar ${sidebarOpen ? "open" : ""}`}>
        <button
          className="sidebar-close-btn"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <span className="sidebar-close-icon">✕</span>
        </button>
        <h2 className="admin-logo">Admin Panel</h2>
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeMenu === item.id ? "active" : ""}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="admin-nav-divider"></div>
          <button
            className="admin-nav-item preview"
            onClick={() => { setPreviewMode(true); setSidebarOpen(false); }}
          >
            <span className="admin-nav-icon">👁</span>
            Preview Site
          </button>
          <button className="admin-nav-item logout" onClick={logout}>
            <span className="admin-nav-icon">🚪</span>
            Logout
          </button>
        </nav>
      </aside>

      <main className="admin-content">
        {activeMenu === "overview" && <AdminDashboard />}
        {activeMenu === "events" && <AdminEvents />}
        {activeMenu === "users" && <AdminUsers />}
        {activeMenu === "learners" && <AdminLearners />}
        {activeMenu === "partnerships" && <AdminPartnerships />}
        {activeMenu === "trash" && <AdminTrash />}
      </main>
    </div>
  );
};

export default AdminLayout;