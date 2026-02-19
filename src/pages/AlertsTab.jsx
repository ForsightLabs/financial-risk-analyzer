import React, { useState } from "react";
import "../styles/alertstab.css";

// ─────────────────────────────────────────────────────────────────
// DUMMY ALERTS DATA
// ─────────────────────────────────────────────────────────────────
const DUMMY_ALERTS = [
  {
    id: "ALT-001",
    customerId: "USR-001",
    customerName: "Aryan Mehta",
    type: "Payment Default",
    severity: "Critical",
    message:
      "Missed 3 consecutive EMI payments. Immediate intervention required.",
    signal: "EMI Miss",
    triggeredAt: "2025-07-14 09:12",
    assignedTo: "Rahul Sharma",
    status: "Open",
    channel: "SMS",
    read: false,
  },
  {
    id: "ALT-002",
    customerId: "USR-002",
    customerName: "Priya Nair",
    type: "Income Irregularity",
    severity: "High",
    message: "Salary delayed by 12 days. Cash-flow stress pattern detected.",
    signal: "Salary Delay",
    triggeredAt: "2025-07-14 08:45",
    assignedTo: "Sneha Iyer",
    status: "In Progress",
    channel: "Email",
    read: false,
  },
  {
    id: "ALT-003",
    customerId: "USR-004",
    customerName: "Divya Krishnan",
    type: "Auto-debit Failure",
    severity: "High",
    message: "Auto-debit failed 2 times this month. Customer notified.",
    signal: "Auto-debit",
    triggeredAt: "2025-07-13 17:30",
    assignedTo: "Amit Verma",
    status: "Open",
    channel: "Push",
    read: true,
  },
  {
    id: "ALT-004",
    customerId: "USR-007",
    customerName: "Vikram Joshi",
    type: "Savings Depletion",
    severity: "Critical",
    message:
      "Savings account balance dropped 78% in 30 days. Threshold breached.",
    signal: "Savings Drop",
    triggeredAt: "2025-07-13 14:05",
    assignedTo: "Sneha Iyer",
    status: "Resolved",
    channel: "Call",
    read: true,
  },
  {
    id: "ALT-005",
    customerId: "USR-005",
    customerName: "Rohit Singh",
    type: "Credit Overuse",
    severity: "Medium",
    message: "Credit utilisation above 90% for 14 consecutive days.",
    signal: "Credit Util.",
    triggeredAt: "2025-07-13 11:20",
    assignedTo: "Rahul Sharma",
    status: "In Progress",
    channel: "Email",
    read: false,
  },
  {
    id: "ALT-006",
    customerId: "USR-010",
    customerName: "Kavita Sharma",
    type: "Debt Stacking",
    severity: "High",
    message: "Multiple lending app transfers detected. Possible debt spiral.",
    signal: "Lending Apps",
    triggeredAt: "2025-07-12 16:55",
    assignedTo: "Rahul Sharma",
    status: "Open",
    channel: "SMS",
    read: false,
  },
  {
    id: "ALT-007",
    customerId: "USR-008",
    customerName: "Meera Pillai",
    type: "Behavioural Anomaly",
    severity: "Medium",
    message: "ATM withdrawals up 220% vs last month. Cash hoarding pattern.",
    signal: "ATM Surge",
    triggeredAt: "2025-07-12 10:15",
    assignedTo: "Amit Verma",
    status: "Resolved",
    channel: "Push",
    read: true,
  },
  {
    id: "ALT-008",
    customerId: "USR-012",
    customerName: "Neha Gupta",
    type: "Bill Default",
    severity: "Medium",
    message: "Utility bills unpaid for 45 days. Escalation recommended.",
    signal: "Utility Bills",
    triggeredAt: "2025-07-11 09:00",
    assignedTo: "Sneha Iyer",
    status: "Open",
    channel: "Email",
    read: true,
  },
];

// ─────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  Critical: {
    color: "#ff4d4d",
    bg: "rgba(255,77,77,0.1)",
    border: "rgba(255,77,77,0.25)",
  },
  High: {
    color: "#ff8c00",
    bg: "rgba(255,140,0,0.1)",
    border: "rgba(255,140,0,0.25)",
  },
  Medium: {
    color: "#f5c518",
    bg: "rgba(245,197,24,0.1)",
    border: "rgba(245,197,24,0.25)",
  },
  Low: {
    color: "#00c97a",
    bg: "rgba(0,201,122,0.1)",
    border: "rgba(0,201,122,0.25)",
  },
};

const STATUS_CONFIG = {
  Open: { color: "#00aeef", bg: "rgba(0,174,239,0.1)" },
  "In Progress": { color: "#f5c518", bg: "rgba(245,197,24,0.1)" },
  Resolved: { color: "#00c97a", bg: "rgba(0,201,122,0.1)" },
};

const CHANNEL_ICON = {
  SMS: "💬",
  Email: "✉️",
  Push: "🔔",
  Call: "📞",
};

// ─────────────────────────────────────────────────────────────────
// ALERTS TAB COMPONENT
// ─────────────────────────────────────────────────────────────────
function AlertsTab() {
  const [alerts, setAlerts] = useState(DUMMY_ALERTS);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAlert, setExpandedAlert] = useState(null);
  const rowsPerPage = 8;

  // ── Stats ──
  const stats = [
    { label: "Total Alerts", value: alerts.length, accent: "#00aeef" },
    {
      label: "Critical",
      value: alerts.filter((a) => a.severity === "Critical").length,
      accent: "#ff4d4d",
    },
    {
      label: "Open",
      value: alerts.filter((a) => a.status === "Open").length,
      accent: "#ff8c00",
    },
    {
      label: "Unread",
      value: alerts.filter((a) => !a.read).length,
      accent: "#f5c518",
    },
  ];

  // ── Filtering ──
  const filtered = alerts.filter((a) => {
    const matchSearch =
      a.customerName.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase()) ||
      a.signal.toLowerCase().includes(search.toLowerCase());
    const matchSeverity =
      severityFilter === "All" || a.severity === severityFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // ── Row selection ──
  const toggleRow = (id) =>
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  const toggleAll = () =>
    selectedRows.length === paginated.length
      ? setSelectedRows([])
      : setSelectedRows(paginated.map((a) => a.id));

  // ── Actions ──
  const markRead = (id) =>
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a)),
    );

  const resolveAlert = (id) =>
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "Resolved", read: true } : a,
      ),
    );

  const markAllRead = () =>
    setAlerts((prev) =>
      prev.map((a) => (selectedRows.includes(a.id) ? { ...a, read: true } : a)),
    );

  const resolveSelected = () =>
    setAlerts((prev) =>
      prev.map((a) =>
        selectedRows.includes(a.id)
          ? { ...a, status: "Resolved", read: true }
          : a,
      ),
    );

  return (
    <div className="hp-page">
      {/* ── Header ── */}
      <div className="hp-header">
        <div>
          <h1 className="hp-title">
            Alert <span className="hp-title-accent">Centre</span>
          </h1>
          <p className="hp-subtitle">
            Real-time financial stress signals and intervention triggers
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
          {/* Search */}
          <div className="hp-search-wrap">
            <svg
              className="hp-search-icon"
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
                d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"
              />
            </svg>
            <input
              className="hp-search"
              placeholder="Search alerts by name, ID, type..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Severity filters */}
          <div className="hp-filters">
            {["All", "Critical", "High", "Medium"].map((s) => (
              <button
                key={s}
                className={`hp-filter-btn ${severityFilter === s ? "active" : ""}`}
                onClick={() => {
                  setSeverityFilter(s);
                  setCurrentPage(1);
                }}
                style={
                  severityFilter === s && s !== "All"
                    ? {
                        background: SEVERITY_CONFIG[s]?.bg,
                        color: SEVERITY_CONFIG[s]?.color,
                        borderColor: SEVERITY_CONFIG[s]?.color,
                      }
                    : {}
                }
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status filters */}
          <div className="hp-filters">
            {["All", "Open", "In Progress", "Resolved"].map((s) => (
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
              <th>Alert ID</th>
              <th>Customer</th>
              <th>Severity</th>
              <th>Signal</th>
              <th>Alert Type</th>
              <th>Channel</th>
              <th>Triggered</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={11} className="hp-empty">
                  No alerts match your filters.
                </td>
              </tr>
            ) : (
              paginated.map((alert, idx) => (
                <React.Fragment key={alert.id}>
                  <tr
                    className={`hp-row ${selectedRows.includes(alert.id) ? "selected" : ""} ${!alert.read ? "alt-unread" : ""}`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="hp-checkbox"
                        checked={selectedRows.includes(alert.id)}
                        onChange={() => toggleRow(alert.id)}
                      />
                    </td>

                    <td>
                      <span className="hp-id">{alert.id}</span>
                      {!alert.read && <span className="alt-unread-dot"></span>}
                    </td>

                    <td>
                      <span className="hp-name">{alert.customerName}</span>
                      <div className="alt-cust-id">{alert.customerId}</div>
                    </td>

                    <td>
                      <span
                        className="hp-flag-badge"
                        style={{
                          color: SEVERITY_CONFIG[alert.severity]?.color,
                          background: SEVERITY_CONFIG[alert.severity]?.bg,
                          border: `1px solid ${SEVERITY_CONFIG[alert.severity]?.border}`,
                        }}
                      >
                        {alert.severity === "Critical"
                          ? "⚡"
                          : alert.severity === "High"
                            ? "▲"
                            : "●"}{" "}
                        {alert.severity}
                      </span>
                    </td>

                    <td>
                      <span className="hp-flagtype">{alert.signal}</span>
                    </td>

                    <td className="hp-reason" style={{ maxWidth: 180 }}>
                      {alert.type}
                    </td>

                    <td>
                      <span className="alt-channel">
                        {CHANNEL_ICON[alert.channel]} {alert.channel}
                      </span>
                    </td>

                    <td className="alt-time">{alert.triggeredAt}</td>

                    <td className="hp-assign">
                      <span className="hp-assigned">{alert.assignedTo}</span>
                    </td>

                    <td>
                      <span
                        className="hp-status-badge"
                        style={{
                          color: STATUS_CONFIG[alert.status]?.color,
                          background: STATUS_CONFIG[alert.status]?.bg,
                        }}
                      >
                        <span
                          className="hp-status-dot"
                          style={{
                            background: STATUS_CONFIG[alert.status]?.color,
                          }}
                        ></span>
                        {alert.status}
                      </span>
                    </td>

                    <td>
                      <div className="hp-actions">
                        <button
                          className="hp-action-btn hp-view"
                          onClick={() => {
                            markRead(alert.id);
                            setExpandedAlert(
                              expandedAlert === alert.id ? null : alert.id,
                            );
                          }}
                        >
                          {expandedAlert === alert.id ? "▲ Hide" : "▼ Detail"}
                        </button>
                        {alert.status !== "Resolved" && (
                          <button
                            className="hp-action-btn hp-assign-btn"
                            onClick={() => resolveAlert(alert.id)}
                          >
                            ✓ Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* ── Expanded Detail Row ── */}
                  {expandedAlert === alert.id && (
                    <tr className="alt-detail-row">
                      <td colSpan={11}>
                        <div className="alt-detail-panel">
                          <div className="alt-detail-label">
                            Full Alert Message
                          </div>
                          <p className="alt-detail-msg">{alert.message}</p>
                          <div className="alt-detail-meta">
                            <span>🕐 Triggered: {alert.triggeredAt}</span>
                            <span>👤 Analyst: {alert.assignedTo}</span>
                            <span>📡 Channel: {alert.channel}</span>
                            <span>🆔 Customer: {alert.customerId}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* ── Footer / Pagination ── */}
        <div className="hp-footer">
          {selectedRows.length > 0 && (
            <div className="hp-bulk-actions">
              <span>{selectedRows.length} selected</span>
              <button className="hp-bulk-btn" onClick={markAllRead}>
                Mark Read
              </button>
              <button className="hp-bulk-btn" onClick={resolveSelected}>
                Resolve All
              </button>
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

export default AlertsTab;
