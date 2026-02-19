import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ALL_USERS_DATA, { getAllUserIds } from "../data/usersData";
import "../styles/homepage.css";
import { useAppContext } from "../pages/AppContext";
import "../styles/homepage.assign.css";

// ─────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Critical: { color: "#ff4d4d", bg: "rgba(255,77,77,0.1)", dot: "#ff4d4d" },
  High: { color: "#ff8c00", bg: "rgba(255,140,0,0.1)", dot: "#ff8c00" },
  Medium: { color: "#f5c518", bg: "rgba(245,197,24,0.1)", dot: "#f5c518" },
  Low: { color: "#00c97a", bg: "rgba(0,201,122,0.1)", dot: "#00c97a" },
};

// Helper function to generate reason and flag type based on risk profile
const generateFlagInfo = (userData) => {
  const { status, riskAssessment, alerts } = userData;

  // If user has alerts, use the first alert message
  if (alerts && alerts.length > 0) {
    const alert = alerts[0];
    return {
      flag: true,
      reason: alert.message,
      flagType: determineFlagType(alert.message, riskAssessment),
    };
  }

  // For low-risk users without alerts
  if (status === "Low") {
    return {
      flag: false,
      reason: "—",
      flagType: "—",
    };
  }

  // For other users, generate based on risk factors
  if (riskAssessment.riskPercentage >= 80) {
    return {
      flag: true,
      reason: "Multiple risk indicators detected",
      flagType: "High Risk Behavior",
    };
  } else if (riskAssessment.riskPercentage >= 65) {
    return {
      flag: true,
      reason: "Payment performance declining",
      flagType: "Payment Issues",
    };
  } else if (riskAssessment.riskPercentage >= 40) {
    return {
      flag: true,
      reason: "Financial stress indicators present",
      flagType: "Risk Monitoring",
    };
  }

  return {
    flag: false,
    reason: "—",
    flagType: "—",
  };
};

// Helper to determine flag type from alert message
const determineFlagType = (message, riskAssessment) => {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("missed") || lowerMessage.includes("emi")) {
    return "Payment Default";
  } else if (
    lowerMessage.includes("salary") ||
    lowerMessage.includes("income")
  ) {
    return "Income Irregularity";
  } else if (
    lowerMessage.includes("auto-debit") ||
    lowerMessage.includes("autodebit")
  ) {
    return "Auto-debit Failure";
  } else if (
    lowerMessage.includes("credit") &&
    lowerMessage.includes("utilisation")
  ) {
    return "Credit Overuse";
  } else if (
    lowerMessage.includes("savings") ||
    lowerMessage.includes("depleted")
  ) {
    return "Savings Depletion";
  } else if (
    lowerMessage.includes("withdrawal") ||
    lowerMessage.includes("cash")
  ) {
    return "Behavioural Anomaly";
  } else if (
    lowerMessage.includes("lending") ||
    lowerMessage.includes("loan app")
  ) {
    return "Debt Stacking";
  } else if (
    lowerMessage.includes("utility") ||
    lowerMessage.includes("bill")
  ) {
    return "Bill Default";
  } else if (riskAssessment.highRiskEateries > 50) {
    return "High Risk Spending";
  } else {
    return "Risk Monitoring";
  }
};

// Helper to assign analyst based on user ID or status
const assignAnalyst = (userId, status) => {
  // Distribute users among analysts
  const analysts = ["Rahul Sharma", "Sneha Iyer", "Amit Verma", "Priya Desai"];

  if (status === "Low") {
    return "Unassigned";
  }

  // Simple distribution based on user ID number
  const userNumber = parseInt(userId.split("-")[1]);
  return analysts[userNumber % analysts.length];
};

// ─────────────────────────────────────────────────────────────────
// HOMEPAGE COMPONENT
// ─────────────────────────────────────────────────────────────────
function Homepage() {
  const { customers, employees, assignCustomer } = useAppContext();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // ── Fetch users from usersData.js ──
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // ── BACKEND INTEGRATION POINT ──────────────────────────
        // Replace with real API call when backend is ready:
        //
        // const token = localStorage.getItem("token");
        // const response = await fetch("http://localhost:8080/api/customers", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // if (!response.ok) throw new Error("Failed to fetch");
        // const data = await response.json();
        // setUsers(data);
        //
        // ── END INTEGRATION POINT ──────────────────────────────

        // Simulate network delay
        await new Promise((res) => setTimeout(res, 600));

        // Transform data from usersData.js to match homepage table format
        const allUserIds = getAllUserIds();
        const transformedUsers = allUserIds.map((userId) => {
          const userData = ALL_USERS_DATA[userId];
          const flagInfo = generateFlagInfo(userData);

          return {
            id: userData.profile.id,
            name: userData.profile.name,
            flag: flagInfo.flag,
            reason: flagInfo.reason,
            flagType: flagInfo.flagType,
            assignTo: assignAnalyst(
              userData.profile.id,
              userData.profile.status,
            ),
            status: userData.profile.status,
          };
        });

        setUsers(transformedUsers);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  // Keep local users in sync when context customers change
  // eslint-disable-line react-hooks/exhaustive-deps

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  useEffect(() => {
    if (!loading) setUsers(customers);
  }, [customers]);

  const handleViewCustomer = (customerId) => {
    navigate(`/customer/${customerId}`);
  };
  const handleAssign = (userId, analystName) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, assignTo: analystName } : user,
      ),
    );

    setOpenDropdown(null);
  };
  const activeAnalysts = employees.filter(
    (e) => e.status === "Active" && !e.onLeave,
  );

  // ── Filtering ──
  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.flagType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // ── Row selection ──
  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedRows.length === paginated.length) setSelectedRows([]);
    else setSelectedRows(paginated.map((u) => u.id));
  };

  // ── Stats ──
  const stats = [
    { label: "Total Monitored", value: users.length, accent: "#00aeef" },
    {
      label: "Critical Risk",
      value: users.filter((u) => u.status === "Critical").length,
      accent: "#ff4d4d",
    },
    {
      label: "High Risk",
      value: users.filter((u) => u.status === "High").length,
      accent: "#ff8c00",
    },
    {
      label: "Flagged Today",
      value: users.filter((u) => u.flag).length,
      accent: "#f5c518",
    },
  ];

  return (
    <div className="hp-page">
      {/* ── Header ── */}
      <div className="hp-header">
        <div>
          <h1 className="hp-title">
            Risk Monitor <span className="hp-title-accent">Dashboard</span>
          </h1>
          <p className="hp-subtitle">
            Real-time customer delinquency tracking and early intervention
          </p>
        </div>
        <div className="hp-header-right">
          <span className="hp-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="hp-stats">
        {stats.map((s) => (
          <div className="hp-stat-card" key={s.label}>
            <span className="hp-stat-value" style={{ color: s.accent }}>
              {s.value}
            </span>
            <span className="hp-stat-label">{s.label}</span>
            <div className="hp-stat-bar" style={{ background: s.accent }}></div>
          </div>
        ))}
      </div>

      {/* ── Table Container ── */}
      <div className="hp-table-container">
        {/* ── Toolbar ── */}
        <div className="hp-toolbar">
          <div className="hp-search-wrap">
            <svg
              className="hp-search-icon"
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
              />
            </svg>
            <input
              className="hp-search"
              placeholder="Search by name, ID or flag type..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="hp-filters">
            {["All", "Critical", "High", "Medium", "Low"].map((s) => (
              <button
                key={s}
                className={`hp-filter-btn ${statusFilter === s ? "active" : ""}`}
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                style={
                  statusFilter === s && s !== "All"
                    ? {
                        background: STATUS_CONFIG[s]?.bg,
                        color: STATUS_CONFIG[s]?.color,
                        borderColor: STATUS_CONFIG[s]?.color,
                      }
                    : {}
                }
              >
                {s}
              </button>
            ))}
          </div>

          <span className="hp-count">
            Showing {paginated.length} of {filtered.length}
          </span>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="hp-loading">
            <div className="hp-spinner"></div>
            <span>Loading customers...</span>
          </div>
        ) : (
          <table className="hp-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="hp-checkbox"
                    checked={
                      selectedRows.length === paginated.length &&
                      paginated.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Flag</th>
                <th>Reason</th>
                <th>Flag Type</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="hp-empty">
                    No customers match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((user, idx) => (
                  <tr
                    key={user.id}
                    className={`hp-row ${selectedRows.includes(user.id) ? "selected" : ""}`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="hp-checkbox"
                        checked={selectedRows.includes(user.id)}
                        onChange={() => toggleRow(user.id)}
                      />
                    </td>

                    <td className="hp-id">{user.id}</td>

                    <td className="hp-name">{user.name}</td>

                    <td>
                      <span
                        className={`hp-flag-badge ${user.flag ? "flagged" : "clean"}`}
                      >
                        {user.flag ? "⚑ Flagged" : "✓ Clean"}
                      </span>
                    </td>

                    <td className="hp-reason">{user.reason}</td>

                    <td>
                      {user.flagType !== "—" ? (
                        <span className="hp-flagtype">{user.flagType}</span>
                      ) : (
                        <span className="hp-dash">—</span>
                      )}
                    </td>

                    <td className="hp-assign">
                      <span
                        className={
                          user.assignTo === "Unassigned"
                            ? "hp-unassigned"
                            : "hp-assigned"
                        }
                      >
                        {user.assignTo}
                      </span>
                    </td>

                    <td>
                      <span
                        className="hp-status-badge"
                        style={{
                          color: STATUS_CONFIG[user.status]?.color,
                          background: STATUS_CONFIG[user.status]?.bg,
                        }}
                      >
                        <span
                          className="hp-status-dot"
                          style={{
                            background: STATUS_CONFIG[user.status]?.dot,
                          }}
                        ></span>
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <div className="hp-actions">
                        <button
                          className="hp-action-btn hp-view"
                          title="View Profile"
                          onClick={() => handleViewCustomer(user.id)}
                        >
                          <svg
                            width="13"
                            height="13"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                        {/* ── Assign button — now connected ── */}
                        <div
                          className="hp-assign-wrap"
                          ref={openDropdown === user.id ? dropdownRef : null}
                        >
                          <button
                            className="hp-action-btn hp-assign-btn"
                            title="Assign Analyst"
                            onClick={() =>
                              setOpenDropdown((prev) =>
                                prev === user.id ? null : user.id,
                              )
                            }
                          >
                            <svg
                              width="13"
                              height="13"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Assign
                          </button>

                          {/* Dropdown — only shown for this row */}
                          {openDropdown === user.id && (
                            <div className="hp-assign-dropdown">
                              <div className="hp-assign-dropdown__label">
                                Assign to analyst
                              </div>
                              {activeAnalysts.map((emp) => (
                                <button
                                  key={emp.id}
                                  className={`hp-assign-dropdown__item ${user.assignTo === emp.name ? "active" : ""}`}
                                  onClick={() =>
                                    handleAssign(user.id, emp.name)
                                  }
                                >
                                  <span className="hp-assign-dropdown__name">
                                    {emp.name}
                                  </span>
                                  <span className="hp-assign-dropdown__role">
                                    {emp.role}
                                  </span>
                                </button>
                              ))}
                              {user.assignTo !== "Unassigned" && (
                                <button
                                  className="hp-assign-dropdown__item hp-assign-dropdown__unassign"
                                  onClick={() =>
                                    handleAssign(user.id, "Unassigned")
                                  }
                                >
                                  <span className="hp-assign-dropdown__name">
                                    Unassign
                                  </span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* ── Footer / Pagination ── */}
        <div className="hp-footer">
          {selectedRows.length > 0 && (
            <div className="hp-bulk-actions">
              <span>{selectedRows.length} selected</span>
              <button className="hp-bulk-btn">Bulk Assign</button>
              <button className="hp-bulk-btn danger">Flag Selected</button>
            </div>
          )}
          <div className="hp-pagination">
            <button
              className="hp-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`hp-page-btn ${currentPage === p ? "active" : ""}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="hp-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
