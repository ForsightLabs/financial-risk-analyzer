import React, { useState } from "react";
import "../styles/alertstab.css";

// ─────────────────────────────────────────────────────────────────
// DATA
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
    border: "rgba(255,77,77,0.28)",
    stripe: "#ff4d4d",
  },
  High: {
    color: "#ff8c00",
    bg: "rgba(255,140,0,0.1)",
    border: "rgba(255,140,0,0.28)",
    stripe: "#ff8c00",
  },
  Medium: {
    color: "#f5c518",
    bg: "rgba(245,197,24,0.1)",
    border: "rgba(245,197,24,0.28)",
    stripe: "#f5c518",
  },
  Low: {
    color: "#00c97a",
    bg: "rgba(0,201,122,0.1)",
    border: "rgba(0,201,122,0.28)",
    stripe: "#00c97a",
  },
};

const STATUS_CONFIG = {
  Open: { color: "#00aeef", bg: "rgba(0,174,239,0.1)" },
  "In Progress": { color: "#f5c518", bg: "rgba(245,197,24,0.1)" },
  Resolved: { color: "#00c97a", bg: "rgba(0,201,122,0.1)" },
};

const CHANNEL_ICON = { SMS: "💬", Email: "✉️", Push: "🔔", Call: "📞" };

// ─────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────
function AlertsTab() {
  const [alerts, setAlerts] = useState(DUMMY_ALERTS);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;

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

  // ── Filter ──
  const filtered = alerts.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      a.customerName.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.signal.toLowerCase().includes(q);
    const matchSeverity =
      severityFilter === "All" || a.severity === severityFilter;
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / cardsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  );

  // ── Actions ──
  const resolveAlert = (id) =>
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "Resolved", read: true } : a,
      ),
    );

  const toggleExpand = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a)),
    );
    setExpandedAlert((prev) => (prev === id ? null : id));
  };

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
            <div className="hp-stat-bar" style={{ background: s.accent }} />
          </div>
        ))}
      </div>

      {/* ── Feed Container ── */}
      <div className="hp-table-container">
        {/* ── Toolbar ── */}
        <div className="hp-toolbar">
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
              placeholder="Search by name, ID, signal or type…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

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

          <span className="hp-count">{filtered.length} alerts</span>
        </div>

        {/* ── Card Feed ── */}
        <div className="alt-feed">
          {paginated.length === 0 ? (
            <div className="hp-empty">No alerts match your filters.</div>
          ) : (
            paginated.map((alert, idx) => {
              const sev = SEVERITY_CONFIG[alert.severity];
              const stat = STATUS_CONFIG[alert.status];
              const isOpen = expandedAlert === alert.id;

              return (
                <div
                  key={alert.id}
                  className={`alt-card${!alert.read ? " alt-card--unread" : ""}${isOpen ? " alt-card--expanded" : ""}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* coloured left stripe */}
                  <div
                    className="alt-card__stripe"
                    style={{ background: sev?.stripe }}
                  />

                  <div className="alt-card__body">
                    {/* ── Row 1: severity + customer + type | status + time + unread pip ── */}
                    <div className="alt-card__top">
                      <div className="alt-card__top-left">
                        <span
                          className="hp-flag-badge"
                          style={{
                            color: sev?.color,
                            background: sev?.bg,
                            border: `1px solid ${sev?.border}`,
                          }}
                        >
                          {alert.severity === "Critical"
                            ? "⚡"
                            : alert.severity === "High"
                              ? "▲"
                              : "●"}
                          &nbsp;{alert.severity}
                        </span>

                        <div className="alt-card__customer">
                          <span className="hp-name">{alert.customerName}</span>
                          <span className="alt-cust-id">
                            {alert.customerId}
                          </span>
                        </div>

                        <span className="hp-flagtype">{alert.type}</span>
                      </div>

                      <div className="alt-card__top-right">
                        <span
                          className="hp-status-badge"
                          style={{ color: stat?.color, background: stat?.bg }}
                        >
                          <span
                            className="hp-status-dot"
                            style={{ background: stat?.color }}
                          />
                          {alert.status}
                        </span>
                        <span className="alt-time">{alert.triggeredAt}</span>
                        {!alert.read && <span className="alt-unread-dot" />}
                      </div>
                    </div>

                    {/* ── Row 2: message ── */}
                    <p className="alt-card__msg">{alert.message}</p>

                    {/* ── Row 3: chips + actions ── */}
                    <div className="alt-card__footer">
                      <div className="alt-card__chips">
                        <span className="alt-chip">
                          {CHANNEL_ICON[alert.channel]} {alert.channel}
                        </span>
                        <span className="alt-chip">📶 {alert.signal}</span>
                        <span className="alt-chip">👤 {alert.assignedTo}</span>
                        <span className="alt-chip hp-id">{alert.id}</span>
                      </div>
                      <div className="hp-actions">
                        <button
                          className="hp-action-btn hp-view"
                          onClick={() => toggleExpand(alert.id)}
                        >
                          {isOpen ? "▲ Less" : "▼ Details"}
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
                    </div>

                    {/* ── Expanded detail grid ── */}
                    {isOpen && (
                      <div className="alt-expand">
                        <div className="alt-expand__grid">
                          {[
                            {
                              label: "Alert ID",
                              value: <span className="hp-id">{alert.id}</span>,
                            },
                            {
                              label: "Customer ID",
                              value: (
                                <span className="hp-id">
                                  {alert.customerId}
                                </span>
                              ),
                            },
                            {
                              label: "Triggered At",
                              value: (
                                <span
                                  className="alt-time"
                                  style={{ fontSize: 12 }}
                                >
                                  {alert.triggeredAt}
                                </span>
                              ),
                            },
                            {
                              label: "Channel",
                              value: `${CHANNEL_ICON[alert.channel]} ${alert.channel}`,
                            },
                            {
                              label: "Assigned To",
                              value: (
                                <span className="hp-assigned">
                                  {alert.assignedTo}
                                </span>
                              ),
                            },
                            {
                              label: "Signal",
                              value: (
                                <span className="hp-flagtype">
                                  {alert.signal}
                                </span>
                              ),
                            },
                          ].map(({ label, value }) => (
                            <div className="alt-expand__item" key={label}>
                              <span className="alt-expand__label">{label}</span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer / Pagination ── */}
        <div className="hp-footer">
          <span className="hp-count" style={{ marginLeft: 0 }}>
            Showing {paginated.length} of {filtered.length}
          </span>
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
