import React, { useState, useEffect } from "react";
import ALL_USERS_DATA, { getAllUserIds } from "../data/usersData";
import "../styles/alertstab.css";

// ─────────────────────────────────────────────────────────────────
// SAME HELPERS AS homepage.jsx  (copied verbatim so data is consistent)
// ─────────────────────────────────────────────────────────────────
const determineFlagType = (message, riskAssessment) => {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("missed") || lowerMessage.includes("emi"))
    return "Payment Default";
  if (lowerMessage.includes("salary") || lowerMessage.includes("income"))
    return "Income Irregularity";
  if (lowerMessage.includes("auto-debit") || lowerMessage.includes("autodebit"))
    return "Auto-debit Failure";
  if (lowerMessage.includes("credit") && lowerMessage.includes("utilisation"))
    return "Credit Overuse";
  if (lowerMessage.includes("savings") || lowerMessage.includes("depleted"))
    return "Savings Depletion";
  if (lowerMessage.includes("withdrawal") || lowerMessage.includes("cash"))
    return "Behavioural Anomaly";
  if (lowerMessage.includes("lending") || lowerMessage.includes("loan app"))
    return "Debt Stacking";
  if (lowerMessage.includes("utility") || lowerMessage.includes("bill"))
    return "Bill Default";
  if (riskAssessment?.highRiskEateries > 50) return "High Risk Spending";
  return "Risk Monitoring";
};

const assignAnalyst = (userId, status) => {
  const analysts = ["Rahul Sharma", "Sneha Iyer", "Amit Verma", "Priya Desai"];
  if (status === "Low") return "Unassigned";
  const userNumber = parseInt(userId.split("-")[1]);
  return analysts[userNumber % analysts.length];
};

// Map alert type → outreach channel
const channelFromType = (alertType) => {
  if (alertType === "critical") return "Call";
  if (alertType === "warning") return "SMS";
  return "Email";
};

// Derive alert status from risk percentage
const alertStatus = (riskPct) => {
  if (riskPct >= 80) return "Open";
  if (riskPct >= 60) return "In Progress";
  return "Open";
};

// Build flat alert records from ALL_USERS_DATA
const buildAlerts = () => {
  const records = [];
  const allIds = getAllUserIds();

  allIds.forEach((userId) => {
    const userData = ALL_USERS_DATA[userId];
    const { profile, riskAssessment, alerts } = userData;

    // Only surface flagged users (Critical / High / Medium with alerts)
    if (!alerts || alerts.length === 0) return;
    if (profile.status === "Low") return;

    alerts.forEach((alert, i) => {
      const flagType = determineFlagType(
        alert.message,
        riskAssessment?.keyFactors || {},
      );
      const channel = channelFromType(alert.type);
      const analyst = assignAnalyst(userId, profile.status);
      const status = alertStatus(riskAssessment?.riskPercentage || 50);

      // Generate a deterministic date string from userId + index
      const userNum = parseInt(userId.split("-")[1]);
      const dayOffset = (userNum + i) % 14;
      const d = new Date("2026-02-19");
      d.setDate(d.getDate() - dayOffset);
      const dateStr = d.toISOString().slice(0, 10);
      const hour = 8 + ((userNum * 3 + i * 7) % 12);
      const min = ((userNum * 7 + i * 13) % 60).toString().padStart(2, "0");
      const timeStr = `${dateStr} ${hour}:${min}`;

      records.push({
        id: `ALT-${userId.split("-")[1]}-${i + 1}`,
        customerId: userId,
        customerName: profile.name,
        type: flagType,
        severity: profile.status, // Critical / High / Medium
        message: alert.message,
        signal: flagType.split(" ")[0], // first word as short signal
        triggeredAt: timeStr,
        assignedTo: analyst,
        status: status,
        channel: channel,
        read: i > 0, // first alert unread by default
      });
    });
  });

  // Sort: unread first, then by severity weight, then by date desc
  const sevWeight = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  records.sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    if (sevWeight[a.severity] !== sevWeight[b.severity])
      return sevWeight[a.severity] - sevWeight[b.severity];
    return b.triggeredAt.localeCompare(a.triggeredAt);
  });

  return records;
};

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
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expandedAlert, setExpandedAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 5;

  // Build alert records once on mount
  useEffect(() => {
    setLoading(true);
    // simulate brief load so spinner shows
    setTimeout(() => {
      setAlerts(buildAlerts());
      setLoading(false);
    }, 400);
  }, []);

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
      a.signal.toLowerCase().includes(q) ||
      a.assignedTo.toLowerCase().includes(q);
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

        {/* ── Loading ── */}
        {loading ? (
          <div className="hp-loading">
            <div className="hp-spinner" />
            <span>Loading alerts…</span>
          </div>
        ) : (
          <>
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
                        {/* ── Top row ── */}
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
                              <span className="hp-name">
                                {alert.customerName}
                              </span>
                              <span className="alt-cust-id">
                                {alert.customerId}
                              </span>
                            </div>

                            <span className="hp-flagtype">{alert.type}</span>
                          </div>

                          <div className="alt-card__top-right">
                            <span
                              className="hp-status-badge"
                              style={{
                                color: stat?.color,
                                background: stat?.bg,
                              }}
                            >
                              <span
                                className="hp-status-dot"
                                style={{ background: stat?.color }}
                              />
                              {alert.status}
                            </span>
                            <span className="alt-time">
                              {alert.triggeredAt}
                            </span>
                            {!alert.read && <span className="alt-unread-dot" />}
                          </div>
                        </div>

                        {/* ── Message ── */}
                        <p className="alt-card__msg">{alert.message}</p>

                        {/* ── Meta chips + actions ── */}
                        <div className="alt-card__footer">
                          <div className="alt-card__chips">
                            <span className="alt-chip">
                              {CHANNEL_ICON[alert.channel]} {alert.channel}
                            </span>
                            <span className="alt-chip">📶 {alert.signal}</span>
                            <span className="alt-chip">
                              👤 {alert.assignedTo}
                            </span>
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
                                  value: (
                                    <span className="hp-id">{alert.id}</span>
                                  ),
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
                                  <span className="alt-expand__label">
                                    {label}
                                  </span>
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      className={`hp-page-btn ${currentPage === p ? "active" : ""}`}
                      onClick={() => setCurrentPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  className="hp-page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AlertsTab;
