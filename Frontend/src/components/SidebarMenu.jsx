import React from "react";
import "./SidebarMenu.css";

export default function SidebarMenu({ open, onClose }) {
  return (
    <>
      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose}></div>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="profile-info">
            <img src="/src/assets/avatar.jpg" alt="Profile" className="profile-avatar" />
            <div>
              <h3>Krish Raj</h3>
              <p>View profile</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <nav className="sidebar-menu">
          <a href="#profile">👤 Profile</a>
          <a href="#settings">⚙️ Settings</a>
          <a href="#help">❓ Help</a>
          <a href="#report">🚩 Report</a>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onClose}>⎋ Logout</button>
          <p className="version">Version 1.0 • Made with ❤️</p>
        </div>
      </aside>
    </>
  );
}
