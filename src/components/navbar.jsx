import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";

const navTabs = [
  {
    label: "Dashboard",
    path: "/",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M3 9.75L12 3l9 6.75V21a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 22V12h6v10"
        />
      </svg>
    ),
  },
  {
    label: "Customer Profiles",
    path: "/customers",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a4 4 0 00-5-3.87M9 20H4v-2a4 4 0 015-3.87m6-4.13a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
  {
    label: "Reports",
    path: "/report",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 17v-6m3 6v-3m3 3v-9M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
        />
      </svg>
    ),
  },
  {
    label: "Interventions",
    path: "/interventions",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    label: "Risk Alerts",
    path: "/alerts",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    badge: 3,
  },
  {
    label: "Model Insights",
    path: "/model",
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
  },
];

const settingsTabs = [
  {
    label: "Account Settings",
    path: "/settings",
    icon: (
      <svg
        width="15"
        height="15"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    label: "Team & Permissions",
    path: "/team",
    icon: (
      <svg
        width="15"
        height="15"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
];

// ── onCollapse prop: tells App.js the current collapsed state ─────
function Navbar({ onCollapse }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sidebar is "visually open" if not collapsed OR if collapsed but hovered
  const isOpen = !collapsed || hovered;

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  const handleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    setHovered(false);
    // Tell App.js the new collapsed state
    if (onCollapse) onCollapse(next);
  };

  const handleMouseEnter = () => {
    if (collapsed) setHovered(true);
  };

  const handleMouseLeave = () => {
    if (collapsed) setHovered(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {mobileOpen && (
        <div className="navbar__overlay" onClick={() => setMobileOpen(false)} />
      )}

      <button
        className="navbar__hamburger"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <aside
        className={`navbar ${!isOpen ? "navbar--collapsed" : ""} ${hovered ? "navbar--hovered" : ""} ${mobileOpen ? "navbar--mobile-open" : ""}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Logo ── */}
        <div className="navbar__logo">
          <div className="navbar__logo-icon">B</div>
          <div
            className={`navbar__logo-text-wrap ${!isOpen ? "navbar__hidden" : ""}`}
          >
            <span className="navbar__logo-text">BARCLAYS</span>
            <span className="navbar__logo-sub">Risk Monitor</span>
          </div>
          <button
            className="navbar__collapse-btn"
            onClick={handleCollapse}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>

        {/* ── Main Menu ── */}
        <div className="navbar__section">
          <span
            className={`navbar__section-title ${!isOpen ? "navbar__hidden" : ""}`}
          >
            Main Menu
          </span>
          <ul className="navbar__tabs">
            {navTabs.map((tab, i) => {
              const isActive = location.pathname === tab.path;
              return (
                <li key={tab.path} style={{ animationDelay: `${i * 40}ms` }}>
                  <Link
                    to={tab.path}
                    className={`navbar__link ${isActive ? "active" : ""}`}
                    title={!isOpen ? tab.label : ""}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="navbar__link-icon">{tab.icon}</span>
                    <span
                      className={`navbar__link-label ${!isOpen ? "navbar__hidden" : ""}`}
                    >
                      {tab.label}
                    </span>
                    {isOpen && tab.badge && (
                      <span className="navbar__badge">{tab.badge}</span>
                    )}
                    {!isOpen && tab.badge && (
                      <span className="navbar__badge-dot"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="navbar__divider" />

        {/* ── Settings ── */}
        <div className="navbar__section">
          <span
            className={`navbar__section-title ${!isOpen ? "navbar__hidden" : ""}`}
          >
            Settings
          </span>
          <ul className="navbar__tabs">
            {settingsTabs.map((tab, i) => {
              const isActive = location.pathname === tab.path;
              return (
                <li
                  key={tab.path}
                  style={{ animationDelay: `${(navTabs.length + i) * 40}ms` }}
                >
                  <Link
                    to={tab.path}
                    className={`navbar__link ${isActive ? "active" : ""}`}
                    title={!isOpen ? tab.label : ""}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="navbar__link-icon">{tab.icon}</span>
                    <span
                      className={`navbar__link-label ${!isOpen ? "navbar__hidden" : ""}`}
                    >
                      {tab.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── User ── */}
        <div className="navbar__user">
          <div className="navbar__user-avatar">
            {(user.firstName?.[0] || "A").toUpperCase()}
          </div>
          <div
            className={`navbar__user-info ${!isOpen ? "navbar__hidden" : ""}`}
          >
            <span className="navbar__user-name">
              {user.firstName || "Analyst"}
            </span>
            <span className="navbar__user-role">
              {user.role?.replace(/_/g, " ") || "Risk Analyst"}
            </span>
          </div>
          <button
            className={`navbar__logout-btn ${!isOpen ? "navbar__hidden" : ""}`}
            onClick={handleLogout}
            title="Logout"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
