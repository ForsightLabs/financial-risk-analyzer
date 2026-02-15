import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ADD THIS IMPORT
import "../styles/homepage.css";

// ─────────────────────────────────────────────────────────────────
// DUMMY DATA — replace with API call when backend is ready
// Shape matches what your Spring Boot endpoint will return
// ─────────────────────────────────────────────────────────────────
const DUMMY_USERS = [
  {
    id: "USR-001",
    name: "Alex Johnson",
    flag: true,
    reason: "Missed 3 consecutive EMI payments",
    flagType: "Payment Default",
    assignTo: "Rahul Sharma",
    status: "Critical",
  },
  {
    id: "USR-002",
    name: "Priya Nair",
    flag: true,
    reason: "Salary delayed by 12 days",
    flagType: "Income Irregularity",
    assignTo: "Sneha Iyer",
    status: "High",
  },
  {
    id: "USR-003",
    name: "Karan Patel",
    flag: false,
    reason: "—",
    flagType: "—",
    assignTo: "Unassigned",
    status: "Low",
  },
  {
    id: "USR-004",
    name: "Divya Krishnan",
    flag: true,
    reason: "Auto-debit failed 2 times this month",
    flagType: "Auto-debit Failure",
    assignTo: "Amit Verma",
    status: "High",
  },
  {
    id: "USR-005",
    name: "Rohit Singh",
    flag: true,
    reason: "Credit utilisation above 90%",
    flagType: "Credit Overuse",
    assignTo: "Rahul Sharma",
    status: "Medium",
  },
  {
    id: "USR-006",
    name: "Ananya Das",
    flag: false,
    reason: "—",
    flagType: "—",
    assignTo: "Unassigned",
    status: "Low",
  },
  {
    id: "USR-007",
    name: "Vikram Joshi",
    flag: true,
    reason: "Savings depleted below threshold",
    flagType: "Savings Depletion",
    assignTo: "Sneha Iyer",
    status: "Critical",
  },
  {
    id: "USR-008",
    name: "Meera Pillai",
    flag: true,
    reason: "Increased cash withdrawals detected",
    flagType: "Behavioural Anomaly",
    assignTo: "Amit Verma",
    status: "Medium",
  },
  {
    id: "USR-009",
    name: "Suresh Reddy",
    flag: false,
    reason: "—",
    flagType: "—",
    assignTo: "Unassigned",
    status: "Low",
  },
  {
    id: "USR-010",
    name: "Kavita Sharma",
    flag: true,
    reason: "Multiple lending app transfers found",
    flagType: "Debt Stacking",
    assignTo: "Rahul Sharma",
    status: "High",
  },
  {
    id: "USR-011",
    name: "Aditya Kumar",
    flag: false,
    reason: "—",
    flagType: "—",
    assignTo: "Unassigned",
    status: "Low",
  },
  {
    id: "USR-012",
    name: "Neha Gupta",
    flag: true,
    reason: "Utility bills unpaid for 45 days",
    flagType: "Bill Default",
    assignTo: "Sneha Iyer",
    status: "Medium",
  },
];

// ─────────────────────────────────────────────────────────────────
// STATUS CONFIG
// ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Critical: { color: "#ff4d4d", bg: "rgba(255,77,77,0.1)", dot: "#ff4d4d" },
  High: { color: "#ff8c00", bg: "rgba(255,140,0,0.1)", dot: "#ff8c00" },
  Medium: { color: "#f5c518", bg: "rgba(245,197,24,0.1)", dot: "#f5c518" },
  Low: { color: "#00c97a", bg: "rgba(0,201,122,0.1)", dot: "#00c97a" },
};

// ─────────────────────────────────────────────────────────────────
// HOMEPAGE COMPONENT
// ─────────────────────────────────────────────────────────────────
function Homepage() {
  const navigate = useNavigate(); // ADD THIS HOOK
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // ── Fetch users (swap dummy data with API call when ready) ──
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // ── BACKEND INTEGRATION POINT ──────────────────────────
        // Replace dummy data with real API call:
        //
        // const token = localStorage.getItem("token");
        // const response = await fetch("http://localhost:8080/api/users", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // if (!response.ok) throw new Error("Failed to fetch");
        // const data = await response.json();
        // setUsers(data);
        //
        // ── END INTEGRATION POINT ──────────────────────────────

        // Simulate network delay
        await new Promise((res) => setTimeout(res, 600));
        setUsers(DUMMY_USERS);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ── ADD THIS FUNCTION: Navigate to customer profile ──
  const handleViewCustomer = (customerId) => {
    navigate(`/customer/${customerId}`);
  };

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
                        {/* ── UPDATED: Add onClick handler to navigate ── */}
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
                        <button
                          className="hp-action-btn hp-assign-btn"
                          title="Assign Analyst"
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
