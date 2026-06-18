import { useState } from "react";
import useDarkMode from "../../hooks/userDarkMode";
import { useAuth } from "../../context/AuthContext";
import "../../styles/common.css";

const Header = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const handleToggle = () => {
    setIsAnimating(true);
    toggleDarkMode();
    setTimeout(() => setIsAnimating(false), 500);
  };

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const getUserNavLinks = () => {
    if (!user) return [];
    const links = [
      { href: "#dashboard", label: "Dashboard" },
    ];
    if (user.position === "teacher" || user.position === "both") {
      links.push({ href: "#enrollment", label: "Upload" });
    }
    links.push({ href: "#events", label: "Events" });
    if (user.position === "partnership" || user.position === "both") {
      links.push({ href: "#partnership", label: "Partnership" });
    }
    links.push({ href: "#contact", label: "Contact" });
    return links;
  };

  const navLinks = getUserNavLinks();

  return (
    <>
      <header className="header">
        {/* Row 1: Logout + Dark Mode Toggle */}
        <div className="header-row-top">
          {isAuthenticated && (
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          )}
          <button
            className={`darkmode-toggle ${isAnimating ? "animating" : ""}`}
            onClick={handleToggle}
            aria-label="Toggle dark mode"
          >
            <span className={`darkmode-icon sun ${!isDark ? "active" : ""}`}>☀️</span>
            <span className={`darkmode-icon moon ${isDark ? "active" : ""}`}>🌙</span>
          </button>
        </div>

        {/* Row 2: Title (always) + Nav Links (only when authenticated) */}
        <div className="header-row-bottom">
          <div className="header-left">
            <h1 className={`project-name ${!isAuthenticated ? "project-name-large" : ""}`}>
               Learner Tracking System
            </h1>
          </div>
          {isAuthenticated && (
            <nav className="header-right desktop-nav">
              <ul className="nav-links">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </header>

      {/* Hamburger - only when authenticated */}
      {isAuthenticated && !menuOpen && (
        <button className="hamburger-btn" onClick={openMenu} aria-label="Open menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      )}

      {/* Sidebar Overlay */}
      <div
        className={`sidebar-overlay ${menuOpen ? "visible" : ""}`}
        onClick={closeMenu}
      ></div>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="sidebar-close-btn" onClick={closeMenu} aria-label="Close menu">
          <span className="sidebar-close-icon">✕</span>
        </button>
        <nav className="sidebar-nav">
          <ul className="sidebar-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={closeMenu}>{link.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;