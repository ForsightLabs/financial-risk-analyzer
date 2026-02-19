import React, { useState, useEffect } from "react";
import ALL_USERS_DATA, { getAllUserIds } from "../data/usersData";
import "../styles/interventions.css";

// ─────────────────────────────────────────────────────────────────
// SAME HELPERS AS homepage.jsx (kept identical for data consistency)
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

// ─────────────────────────────────────────────────────────────────
// AI RECOMMENDATION LOGIC
// Mirrors what the model would suggest given risk percentage
// ─────────────────────────────────────────────────────────────────
const aiRecommendationFromScore = (riskPct) => {
  if (riskPct >= 85) return "Immediate Escalation — Call";
  if (riskPct >= 70) return "Immediate Outreach — Call";
  if (riskPct >= 55) return "Soft Outreach — SMS";
  return "Soft Outreach — Email";
};

const aiReasonFromData = (userData) => {
  const { riskAssessment, alerts } = userData;
  const pct = riskAssessment?.riskPercentage || 50;
  const stress = riskAssessment?.stressLevel || "Moderate Stress";
  const topAlert = alerts?.[0]?.message || "Financial stress signals detected.";
  return `${topAlert} Risk score at ${Math.round(pct)}% — ${stress}. Model confidence based on cash-flow pattern, payment history and behavioural signals over 90-day window.`;
};

const aiSignalsFromAlerts = (alerts, riskAssessment) => {
  const signals = (alerts || []).map((a) => {
    const ft = determineFlagType(a.message, riskAssessment?.keyFactors || {});
    return ft;
  });
  // Add behavioural factor if present
  if ((riskAssessment?.keyFactors?.behavioralRiskFactors || 0) > 60)
    signals.push("High Behavioural Risk");
  return [...new Set(signals)].slice(0, 5);
};

// Deterministic analyst decision — sometimes agrees, sometimes overrides
const analystDecisionFromData = (userId, aiRec, riskPct) => {
  const userNum = parseInt(userId.split("-")[1]);
  // ~40% of cases the analyst overrides the AI
  const overrides = userNum % 5 === 0 || userNum % 7 === 0;

  if (!overrides) {
    return {
      analystDecision: aiRec,
      analystOutcome: "Agreed with AI",
      analystChanged: false,
      analystNote:
        "Model assessment aligns with field observations. Proceeding with recommended action. Will monitor for 7 days and escalate if no improvement.",
    };
  }

  // Override — escalate or downgrade based on user number
  if (userNum % 7 === 0) {
    return {
      analystDecision:
        riskPct >= 70
          ? "Payment Holiday + Restructuring"
          : "Credit Limit Review",
      analystOutcome: "Override — Escalated",
      analystChanged: true,
      analystNote:
        "Spoke with customer directly. Underlying cause identified — temporary income disruption. Offered structured relief plan instead of standard outreach. Customer cooperative.",
    };
  }
  return {
    analystDecision: "No Action — Monitor",
    analystOutcome: "Override — Downgraded",
    analystChanged: true,
    analystNote:
      "Customer contacted proactively. Signals attributed to one-off event (account migration / business cycle). No acute distress confirmed. Placed on 30-day watch list.",
  };
};

const finalStatusFromOutcome = (outcome, riskPct) => {
  if (outcome === "Agreed with AI") {
    if (riskPct >= 80) return "Intervention Applied";
    if (riskPct >= 65) return "Follow-up Scheduled";
    return "Monitoring";
  }
  if (outcome === "Override — Escalated") {
    return riskPct >= 80 ? "Hardship Programme" : "Product Offered";
  }
  return "Closed — No Risk";
};

// ─────────────────────────────────────────────────────────────────
// BUILD INTERVENTION RECORDS FROM ALL_USERS_DATA
// One record per flagged user (Critical / High / Medium with alerts)
// ─────────────────────────────────────────────────────────────────
const buildInterventions = () => {
  const records = [];
  const allIds = getAllUserIds();

  allIds.forEach((userId) => {
    const userData = ALL_USERS_DATA[userId];
    const { profile, riskAssessment, alerts } = userData;

    // Skip low-risk / no-alert users
    if (profile.status === "Low") return;
    if (!alerts || alerts.length === 0) return;

    const riskPct = riskAssessment?.riskPercentage || 50;
    const aiScore = Math.min(99, Math.round(riskPct + (Math.random() * 6 - 3)));
    const aiConf = Math.min(99, Math.round(riskPct - 5 + Math.random() * 10));
    const aiRec = aiRecommendationFromData(riskPct);
    const { analystDecision, analystOutcome, analystChanged, analystNote } =
      analystDecisionFromData(userId, aiRec, riskPct);

    // Deterministic date
    const userNum = parseInt(userId.split("-")[1]);
    const dayOff = userNum % 30;
    const d = new Date("2026-02-19");
    d.setDate(d.getDate() - dayOff);
    const dateStr = d.toISOString().slice(0, 10);
    const hour = 8 + (userNum % 10);
    const min = ((userNum * 7) % 60).toString().padStart(2, "0");

    records.push({
      id: `INT-${userId.split("-")[1]}`,
      customerId: userId,
      customerName: profile.name,
      flagType: determineFlagType(
        alerts[0].message,
        riskAssessment?.keyFactors || {},
      ),
      date: dateStr,
      time: `${hour}:${min}`,
      analyst: assignAnalyst(userId, profile.status),
      customerStatus: profile.status,
      // AI
      aiRiskScore: aiScore,
      aiConfidence: aiConf,
      aiRecommendation: aiRec,
      aiReason: aiReasonFromData(userData),
      aiSignals: aiSignalsFromAlerts(alerts, riskAssessment),
      // Analyst
      analystDecision,
      analystOutcome,
      analystChanged,
      analystNote,
      finalStatus: finalStatusFromOutcome(analystOutcome, riskPct),
    });
  });

  // Sort: Critical first, then by date desc
  const sevWeight = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  records.sort((a, b) => {
    if (sevWeight[a.customerStatus] !== sevWeight[b.customerStatus])
      return sevWeight[a.customerStatus] - sevWeight[b.customerStatus];
    return b.date.localeCompare(a.date);
  });

  return records;
};

// Keep this outside component so it's stable
function aiRecommendationFromData(riskPct) {
  return aiRecommendationFromScore(riskPct);
}

// ─────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────
const RISK_COLOR = (score) => {
  if (score >= 85)
    return { color: "#ff4d4d", bg: "rgba(255,77,77,0.1)", label: "Critical" };
  if (score >= 65)
    return { color: "#ff8c00", bg: "rgba(255,140,0,0.1)", label: "High" };
  if (score >= 45)
    return { color: "#f5c518", bg: "rgba(245,197,24,0.1)", label: "Medium" };
  return { color: "#00c97a", bg: "rgba(0,201,122,0.1)", label: "Low" };
};

const OUTCOME_CONFIG = {
  "Agreed with AI": { color: "#00c97a", bg: "rgba(0,201,122,0.1)", icon: "✓" },
  "Override — Escalated": {
    color: "#ff8c00",
    bg: "rgba(255,140,0,0.1)",
    icon: "▲",
  },
  "Override — Downgraded": {
    color: "#00aeef",
    bg: "rgba(0,174,239,0.1)",
    icon: "▼",
  },
};

const STATUS_DOT = {
  "Intervention Applied": "#00c97a",
  Monitoring: "#00aeef",
  "Closed — No Risk": "#545870",
  "Hardship Programme": "#ff4d4d",
  "Product Offered": "#f5c518",
  "Follow-up Scheduled": "#ff8c00",
  "Closed — False Positive": "#545870",
  "Awaiting Response": "#f5c518",
};

// ─────────────────────────────────────────────────────────────────
// SCORE RING
// ─────────────────────────────────────────────────────────────────
function ScoreRing({ score, color }) {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <svg width="68" height="68" className="iv-ring">
      <circle
        cx="34"
        cy="34"
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="5"
      />
      <circle
        cx="34"
        cy="34"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 34 34)"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x="34"
        y="38"
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fill={color}
        fontFamily="var(--font-display)"
      >
        {score}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// DETAIL PANEL
// ─────────────────────────────────────────────────────────────────
function InterventionDetail({ record, onClose }) {
  const risk = RISK_COLOR(record.aiRiskScore);
  const outcome =
    OUTCOME_CONFIG[record.analystOutcome] || OUTCOME_CONFIG["Agreed with AI"];
  const dotColor = STATUS_DOT[record.finalStatus] || "var(--text-muted)";

  return (
    <div className="iv-detail">
      {/* Header */}
      <div className="iv-detail__header">
        <div className="iv-detail__header-left">
          <div className="iv-detail__id">{record.id}</div>
          <div className="iv-detail__meta">
            <span>
              {record.date} · {record.time}
            </span>
            <span className="iv-dot">·</span>
            <span>
              Analyst:{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                {record.analyst}
              </strong>
            </span>
            <span className="iv-dot">·</span>
            <span
              className="hp-status-badge"
              style={{
                padding: "2px 10px",
                color: dotColor,
                background: `${dotColor}18`,
              }}
            >
              <span
                className="hp-status-dot"
                style={{ background: dotColor }}
              />
              {record.finalStatus}
            </span>
          </div>
        </div>
        <button className="iv-close-btn" onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {/* Customer strip */}
      <div className="iv-customer-strip">
        <div>
          <span className="iv-strip-label">Customer</span>
          <span className="iv-strip-value">{record.customerName}</span>
        </div>
        <div>
          <span className="iv-strip-label">ID</span>
          <span className="hp-id">{record.customerId}</span>
        </div>
        <div>
          <span className="iv-strip-label">Flag Type</span>
          <span className="hp-flagtype">{record.flagType}</span>
        </div>
        <div>
          <span className="iv-strip-label">Risk Level</span>
          <span
            className="hp-flag-badge"
            style={{
              color: risk.color,
              background: risk.bg,
              border: `1px solid ${risk.color}30`,
            }}
          >
            {risk.label}
          </span>
        </div>
      </div>

      {/* Two-column comparison */}
      <div className="iv-compare">
        {/* AI column */}
        <div className="iv-col iv-col--ai">
          <div className="iv-col__label">
            <span className="iv-col__icon iv-col__icon--ai">AI</span>
            Model Recommendation
          </div>

          <div className="iv-col__score-row">
            <ScoreRing score={record.aiRiskScore} color={risk.color} />
            <div className="iv-col__score-meta">
              <div className="iv-score-line">
                <span className="iv-score-label">Risk Score</span>
                <span className="iv-score-val" style={{ color: risk.color }}>
                  {record.aiRiskScore}/100
                </span>
              </div>
              <div className="iv-score-line">
                <span className="iv-score-label">Confidence</span>
                <span
                  className="iv-score-val"
                  style={{ color: "var(--accent)" }}
                >
                  {record.aiConfidence}%
                </span>
              </div>
            </div>
          </div>

          <div className="iv-col__rec">
            <span className="iv-col__rec-label">Recommended Action</span>
            <span className="iv-col__rec-value">{record.aiRecommendation}</span>
          </div>

          <div className="iv-col__reason-label">Model Reasoning</div>
          <p className="iv-col__reason">{record.aiReason}</p>

          <div className="iv-signals-label">Triggered Signals</div>
          <div className="iv-signals">
            {record.aiSignals.map((s) => (
              <span key={s} className="iv-signal-chip">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="iv-divider">
          <div className="iv-divider__line" />
          <span
            className="iv-divider__badge"
            style={{
              color: outcome.color,
              background: outcome.bg,
              borderColor: `${outcome.color}40`,
            }}
          >
            {outcome.icon} {record.analystOutcome}
          </span>
          <div className="iv-divider__line" />
        </div>

        {/* Analyst column */}
        <div className="iv-col iv-col--analyst">
          <div className="iv-col__label">
            <span className="iv-col__icon iv-col__icon--analyst">👤</span>
            Analyst Decision
          </div>

          <div className="iv-col__rec" style={{ marginTop: 8 }}>
            <span className="iv-col__rec-label">Final Action Taken</span>
            <span
              className="iv-col__rec-value"
              style={{ color: record.analystChanged ? "#ff8c00" : "#00c97a" }}
            >
              {record.analystDecision}
            </span>
          </div>

          {record.analystChanged && (
            <div className="iv-override-notice">
              <span className="iv-override-icon">⚠</span>
              Analyst overrode AI recommendation
            </div>
          )}

          <div className="iv-col__reason-label">Analyst Notes</div>
          <p className="iv-col__reason">{record.analystNote}</p>

          <div className="iv-outcome-row">
            <div>
              <div className="iv-signals-label">Outcome</div>
              <span
                className="hp-status-badge"
                style={{
                  marginTop: 4,
                  display: "inline-flex",
                  color: dotColor,
                  background: `${dotColor}18`,
                }}
              >
                <span
                  className="hp-status-dot"
                  style={{ background: dotColor }}
                />
                {record.finalStatus}
              </span>
            </div>
            <div>
              <div className="iv-signals-label">Analyst</div>
              <span className="hp-assigned" style={{ fontSize: 13 }}>
                {record.analyst}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
function InterventionsTab() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [analystFilter, setAnalystFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setRecords(buildInterventions());
      setLoading(false);
    }, 400);
  }, []);

  const allAnalysts = [...new Set(records.map((r) => r.analyst))];

  // ── Stats ──
  const stats = [
    { label: "Total Interventions", value: records.length, accent: "#00aeef" },
    {
      label: "Agreed with AI",
      value: records.filter((r) => !r.analystChanged).length,
      accent: "#00c97a",
    },
    {
      label: "Analyst Overrides",
      value: records.filter((r) => r.analystChanged).length,
      accent: "#ff8c00",
    },
    {
      label: "Avg AI Confidence",
      value: records.length
        ? Math.round(
            records.reduce((s, r) => s + r.aiConfidence, 0) / records.length,
          ) + "%"
        : "—",
      accent: "#f5c518",
    },
  ];

  // ── Filter ──
  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.id.toLowerCase().includes(q) ||
      r.analyst.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerId.toLowerCase().includes(q) ||
      r.aiRecommendation.toLowerCase().includes(q) ||
      r.analystDecision.toLowerCase().includes(q) ||
      r.flagType.toLowerCase().includes(q);
    const matchOutcome =
      outcomeFilter === "All" || r.analystOutcome === outcomeFilter;
    const matchAnalyst = analystFilter === "All" || r.analyst === analystFilter;
    return matchSearch && matchOutcome && matchAnalyst;
  });

  // ── Pagination ──
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  return (
    <div className="hp-page">
      {/* ── Header ── */}
      <div className="hp-header">
        <div>
          <h1 className="hp-title">
            Intervention <span className="hp-title-accent">Log</span>
          </h1>
          <p className="hp-subtitle">
            AI model recommendations vs analyst decisions — full audit trail
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

      {/* ── Detail panel ── */}
      {selectedRecord && (
        <div className="hp-table-container" style={{ marginBottom: 20 }}>
          <InterventionDetail
            record={selectedRecord}
            onClose={() => setSelectedRecord(null)}
          />
        </div>
      )}

      {/* ── Table container ── */}
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
              placeholder="Search by customer, analyst, ID, flag type or action…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
                setSelectedRecord(null);
              }}
            />
          </div>

          <div className="hp-filters">
            {[
              "All",
              "Agreed with AI",
              "Override — Escalated",
              "Override — Downgraded",
            ].map((o) => {
              const cfg = OUTCOME_CONFIG[o];
              return (
                <button
                  key={o}
                  className={`hp-filter-btn ${outcomeFilter === o ? "active" : ""}`}
                  onClick={() => {
                    setOutcomeFilter(o);
                    setCurrentPage(1);
                  }}
                  style={
                    outcomeFilter === o && o !== "All"
                      ? {
                          background: cfg?.bg,
                          color: cfg?.color,
                          borderColor: cfg?.color,
                        }
                      : {}
                  }
                >
                  {o}
                </button>
              );
            })}
          </div>

          <select
            className="iv-analyst-select"
            value={analystFilter}
            onChange={(e) => {
              setAnalystFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Analysts</option>
            {allAnalysts.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <span className="hp-count">{filtered.length} records</span>
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="hp-loading">
            <div className="hp-spinner" />
            <span>Loading interventions…</span>
          </div>
        ) : (
          <>
            <table className="hp-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>AI Score</th>
                  <th>AI Recommendation</th>
                  <th>Analyst Decision</th>
                  <th>Outcome</th>
                  <th>Status</th>
                  <th>Analyst</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="hp-empty">
                      No intervention records match your search.
                    </td>
                  </tr>
                ) : (
                  paginated.map((record, idx) => {
                    const risk = RISK_COLOR(record.aiRiskScore);
                    const outcome = OUTCOME_CONFIG[record.analystOutcome] || {};
                    const dotColor =
                      STATUS_DOT[record.finalStatus] || "var(--text-muted)";
                    const isActive = selectedRecord?.id === record.id;

                    return (
                      <tr
                        key={record.id}
                        className={`hp-row${isActive ? " selected" : ""}`}
                        style={{ animationDelay: `${idx * 35}ms` }}
                      >
                        <td className="hp-id">{record.id}</td>

                        <td>
                          <div className="iv-datetime">
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--text-secondary)",
                              }}
                            >
                              {record.date}
                            </span>
                            <span className="iv-time">{record.time}</span>
                          </div>
                        </td>

                        <td>
                          <div className="hp-name">{record.customerName}</div>
                          <div className="hp-id" style={{ marginTop: 2 }}>
                            {record.customerId}
                          </div>
                        </td>

                        <td>
                          <div className="iv-score-cell">
                            <span
                              className="iv-score-pill"
                              style={{
                                color: risk.color,
                                background: risk.bg,
                                borderColor: `${risk.color}30`,
                              }}
                            >
                              {record.aiRiskScore}
                            </span>
                            <span className="iv-conf">
                              {record.aiConfidence}% conf.
                            </span>
                          </div>
                        </td>

                        <td className="hp-reason">{record.aiRecommendation}</td>

                        <td>
                          <span
                            className="hp-reason"
                            style={{
                              color: record.analystChanged
                                ? "#ff8c00"
                                : "var(--text-secondary)",
                            }}
                          >
                            {record.analystDecision}
                          </span>
                        </td>

                        <td>
                          <span
                            className="hp-flag-badge"
                            style={{
                              color: outcome.color,
                              background: outcome.bg,
                              border: `1px solid ${outcome.color}35`,
                              fontSize: 11,
                            }}
                          >
                            {outcome.icon} {record.analystOutcome}
                          </span>
                        </td>

                        <td>
                          <span
                            className="hp-status-badge"
                            style={{
                              color: dotColor,
                              background: `${dotColor}18`,
                            }}
                          >
                            <span
                              className="hp-status-dot"
                              style={{ background: dotColor }}
                            />
                            {record.finalStatus}
                          </span>
                        </td>

                        <td className="hp-assigned" style={{ fontSize: 13 }}>
                          {record.analyst}
                        </td>

                        <td>
                          <button
                            className="hp-action-btn hp-view"
                            onClick={() =>
                              setSelectedRecord(isActive ? null : record)
                            }
                          >
                            {isActive ? "▲ Hide" : "▼ Review"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

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

export default InterventionsTab;
