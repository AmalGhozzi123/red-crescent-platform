import React, { useState, useEffect } from "react";
import {
  FaChartBar,
  FaUserFriends,
  FaCalendarAlt,
  FaComments,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [active, setActive] = useState(location.pathname);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ✅ popup logout

  useEffect(() => {
    setActive(location.pathname);
    setOpen(false);
  }, [location.pathname]);

  const menuItems = [
    { id: "/dashboard", label: "Dashboard", icon: <FaChartBar /> },
    { id: "/volunteers", label: "Volunteer Management", icon: <FaUserFriends /> },
    { id: "/missions", label: "Mission Calendar", icon: <FaCalendarAlt /> },
    { id: "/messages", label: "Messaging", icon: <FaComments /> },
  ];

  // ✅ Fonction de déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_id");
    sessionStorage.clear();
    navigate("/");
    window.location.replace("/");
  };

  return (
    <>
      {/* Bouton hamburger (mobile) */}
      <button
        className="sidebar-toggle-btn"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((s) => !s)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      {/* Bouton collapse */}
      <button
        className={`sidebar-collapse-btn ${collapsed ? "rotated" : ""}`}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((c) => !c)}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Overlay mobile */}
      <div
        className={`sidebar-overlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      <nav className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-logo">
          <img src="/images/logo.png" alt="Logo" className="logo" />
          <h3>Red Crescent</h3>
        </div>

        {/* MENU */}
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.id}
              onClick={() => {
                setActive(item.id);
                setOpen(false);
              }}
              className={`menu-item ${active === item.id ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* ✅ Bouton Logout pro */}
        <div className="sidebar-logout" onClick={() => setShowLogoutModal(true)}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </div>

        <div className="sidebar-footer">
          <small>© 2025 Red Crescent</small>
        </div>
      </nav>

      {/* ✅ POPUP DE CONFIRMATION DE DÉCONNEXION */}
      {showLogoutModal && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out of your session?</p>
            <div className="logout-actions">
              <button className="cancel-btn" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
