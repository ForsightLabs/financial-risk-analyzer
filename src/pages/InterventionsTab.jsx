import React, { useState } from "react";
import { useAppContext } from "../pages/AppContext";
import "../styles/interventions.css";

// ─────────────────────────────────────────────────────────────────
// INTERVENTION RECORDS
// Each record ties to a customer (from context) and captures:
//   • what the AI model scored / recommended
//   • what the analyst actually decided
//   • the justification note they left
// ─────────────────────────────────────────────────────────────────
const INTERVENTIONS = [
  {
    id: "INT-001",
    customerId: "USR-001",
    date: "2025-07-14",
    time: "09:45",
    analyst: "Rahul Sharma",
    // AI block
    aiRiskScore: 94,
    aiConfidence: 91,
    aiRecommendation: "Immediate Payment Holiday",
    aiReason:
      "3 consecutive EMI misses combined with 0% savings buffer. Model predicts 97% default probability within 14 days without intervention.",
    aiSignals: [
      "EMI Miss ×3",
      "Zero Savings",
      "Credit Util 88%",
      "Salary Delayed",
    ],
    // Analyst block
    analystDecision: "Payment Holiday + Restructuring",
    analystOutcome: "Override — Escalated",
    analystNote:
      "Customer called in proactively. Income disruption is temporary (medical emergency). Offered 3-month holiday and restructured remaining EMIs over 24 months. Customer agreed. Risk of default now low if plan holds.",
    analystChanged: true,
    finalStatus: "Intervention Applied",
  },
  {
    id: "INT-002",
    customerId: "USR-002",
    date: "2025-07-14",
    time: "08:55",
    analyst: "Sneha Iyer",
    aiRiskScore: 72,
    aiConfidence: 84,
    aiRecommendation: "Soft Outreach — SMS",
    aiReason:
      "Salary credit delayed by 12 days vs 30-day average. Discretionary spend dropped 40%. Early-stage stress pattern. No missed payments yet.",
    aiSignals: ["Salary Delay 12d", "Spend Drop 40%", "Utility Late"],
    analystDecision: "Soft Outreach — SMS",
    analystOutcome: "Agreed with AI",
    analystNote:
      "Model assessment looks correct. Sent templated SMS offering helpline contact. Will monitor for 7 days before escalating.",
    analystChanged: false,
    finalStatus: "Monitoring",
  },
  {
    id: "INT-003",
    customerId: "USR-004",
    date: "2025-07-13",
    time: "17:40",
    analyst: "Amit Verma",
    aiRiskScore: 68,
    aiConfidence: 79,
    aiRecommendation: "Soft Outreach — Email",
    aiReason:
      "Auto-debit failed twice. Pattern consistent with temporary liquidity crunch. Medium-term risk elevated but not acute.",
    aiSignals: ["Auto-debit Fail ×2", "ATM Withdraw +60%"],
    analystDecision: "No Action — Monitor",
    analystOutcome: "Override — Downgraded",
    analystNote:
      "Spoke with customer. Auto-debit failure was due to bank migration. Account is now settled. No financial distress. Will keep on watch for 30 days.",
    analystChanged: true,
    finalStatus: "Closed — No Risk",
  },
  {
    id: "INT-004",
    customerId: "USR-007",
    date: "2025-07-13",
    time: "14:20",
    analyst: "Sneha Iyer",
    aiRiskScore: 96,
    aiConfidence: 95,
    aiRecommendation: "Immediate Escalation — Call",
    aiReason:
      "Savings depleted 78% in 30 days. Lending app transfers detected. Failed auto-debit. Model confidence very high — acute financial distress.",
    aiSignals: [
      "Savings Down 78%",
      "Lending App TX",
      "Auto-debit Fail",
      "Cash Withdraw +200%",
    ],
    analystDecision: "Immediate Escalation — Call",
    analystOutcome: "Agreed with AI",
    analystNote:
      "Called customer. Confirmed job loss 6 weeks ago. Enrolled in hardship programme. Waived late fees. Referred to financial counselling partner.",
    analystChanged: false,
    finalStatus: "Hardship Programme",
  },
  {
    id: "INT-005",
    customerId: "USR-005",
    date: "2025-07-13",
    time: "11:30",
    analyst: "Rahul Sharma",
    aiRiskScore: 58,
    aiConfidence: 71,
    aiRecommendation: "Soft Outreach — Email",
    aiReason:
      "Credit utilisation above 90% for 14 days. No salary anomaly. Risk moderate. Recommend educational outreach on credit management.",
    aiSignals: ["Credit Util 91%", "No Salary Anomaly"],
    analystDecision: "Credit Limit Review",
    analystOutcome: "Override — Escalated",
    analystNote:
      "Customer has maintained this utilisation for 3 months. Pattern suggests structural over-reliance on credit, not temporary. Initiated limit review and suggested balance transfer product.",
    analystChanged: true,
    finalStatus: "Product Offered",
  },
  {
    id: "INT-006",
    customerId: "USR-010",
    date: "2025-07-12",
    time: "17:05",
    analyst: "Rahul Sharma",
    aiRiskScore: 81,
    aiConfidence: 88,
    aiRecommendation: "Immediate Outreach — Call",
    aiReason:
      "3 distinct lending app transfers in 10 days. Debt stacking behaviour strongly correlated with delinquency within 21 days in historical data.",
    aiSignals: ["Lending App TX ×3", "Savings Down 30%", "Credit Util 74%"],
    analystDecision: "Immediate Outreach — Call",
    analystOutcome: "Agreed with AI",
    analystNote:
      "Called customer. Acknowledged financial pressure due to sibling's medical bills. Discussed debt consolidation options. Customer open to restructuring. Follow-up scheduled.",
    analystChanged: false,
    finalStatus: "Follow-up Scheduled",
  },
  {
    id: "INT-007",
    customerId: "USR-008",
    date: "2025-07-12",
    time: "10:30",
    analyst: "Amit Verma",
    aiRiskScore: 61,
    aiConfidence: 74,
    aiRecommendation: "Soft Outreach — Push Notification",
    aiReason:
      "ATM withdrawals up 220%. Possible cash hoarding. Medium risk. No missed payments or lending app activity detected.",
    aiSignals: ["ATM Surge +220%", "Spend Shift"],
    analystDecision: "No Action",
    analystOutcome: "Override — Downgraded",
    analystNote:
      "Customer is a small business owner. Cash withdrawals are typical for their business cycle (end of quarter). Cross-checked with transaction notes. No distress signal.",
    analystChanged: true,
    finalStatus: "Closed — False Positive",
  },
  {
    id: "INT-008",
    customerId: "USR-012",
    date: "2025-07-11",
    time: "09:10",
    analyst: "Sneha Iyer",
    aiRiskScore: 55,
    aiConfidence: 68,
    aiRecommendation: "Soft Outreach — Email",
    aiReason:
      "Utility bills unpaid 45 days. Spend on discretionary categories reduced 55%. Early-stage stress with no acute signals yet.",
    aiSignals: ["Utility Unpaid 45d", "Discretionary -55%"],
    analystDecision: "Soft Outreach — Email",
    analystOutcome: "Agreed with AI",
    analystNote:
      "Sent personalised email with payment assistance information and helpline link. Awaiting response.",
    analystChanged: false,
    finalStatus: "Awaiting Response",
  },
];

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

// Score ring (SVG)
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
// INTERVENTION DETAIL PANEL
// ─────────────────────────────────────────────────────────────────
function InterventionDetail({ record, customer, onClose }) {
  const risk = RISK_COLOR(record.aiRiskScore);
  const outcome =
    OUTCOME_CONFIG[record.analystOutcome] || OUTCOME_CONFIG["Agreed with AI"];
  const dotColor = STATUS_DOT[record.finalStatus] || "var(--text-muted)";

  return (
    <div className="iv-detail">
      {/* ── Detail header ── */}
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

      {/* ── Customer strip ── */}
      <div className="iv-customer-strip">
        <div>
          <span className="iv-strip-label">Customer</span>
          <span className="iv-strip-value">{customer?.name}</span>
        </div>
        <div>
          <span className="iv-strip-label">ID</span>
          <span className="hp-id">{customer?.id}</span>
        </div>
        <div>
          <span className="iv-strip-label">Flag Type</span>
          <span className="hp-flagtype">{customer?.flagType}</span>
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

      {/* ── Two-column comparison ── */}
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
  const { customers } = useAppContext();

  const [search, setSearch] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState("All");
  const [analystFilter, setAnalystFilter] = useState("All");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // derive unique analysts from records
  const allAnalysts = [...new Set(INTERVENTIONS.map((r) => r.analyst))];

  // ── Stats ──
  const stats = [
    {
      label: "Total Interventions",
      value: INTERVENTIONS.length,
      accent: "#00aeef",
    },
    {
      label: "Agreed with AI",
      value: INTERVENTIONS.filter((r) => !r.analystChanged).length,
      accent: "#00c97a",
    },
    {
      label: "Analyst Overrides",
      value: INTERVENTIONS.filter((r) => r.analystChanged).length,
      accent: "#ff8c00",
    },
    {
      label: "Avg AI Confidence",
      value:
        Math.round(
          INTERVENTIONS.reduce((s, r) => s + r.aiConfidence, 0) /
            INTERVENTIONS.length,
        ) + "%",
      accent: "#f5c518",
    },
  ];

  // ── Filter ──
  const filtered = INTERVENTIONS.filter((r) => {
    const customer = customers.find((c) => c.id === r.customerId);
    const q = search.toLowerCase();
    const matchSearch =
      r.id.toLowerCase().includes(q) ||
      r.analyst.toLowerCase().includes(q) ||
      (customer?.name || "").toLowerCase().includes(q) ||
      r.customerId.toLowerCase().includes(q) ||
      r.aiRecommendation.toLowerCase().includes(q) ||
      r.analystDecision.toLowerCase().includes(q);
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

  // selected record & customer
  const detailCustomer = selectedRecord
    ? customers.find((c) => c.id === selectedRecord.customerId)
    : null;

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

      {/* ── Detail panel (shown above table when a record is selected) ── */}
      {selectedRecord && (
        <div className="hp-table-container" style={{ marginBottom: 20 }}>
          <InterventionDetail
            record={selectedRecord}
            customer={detailCustomer}
            onClose={() => setSelectedRecord(null)}
          />
        </div>
      )}

      {/* ── Table container ── */}
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
              placeholder="Search by customer, analyst, ID or action…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
                setSelectedRecord(null);
              }}
            />
          </div>

          {/* Outcome filter */}
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

          {/* Analyst filter */}
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

        {/* ── Table ── */}
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
                const customer = customers.find(
                  (c) => c.id === record.customerId,
                );
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
                    {/* ID */}
                    <td className="hp-id">{record.id}</td>

                    {/* Date & Time */}
                    <td>
                      <div className="iv-datetime">
                        <span>{record.date}</span>
                        <span className="iv-time">{record.time}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="hp-name">
                        {customer?.name || record.customerId}
                      </div>
                      <div className="hp-id" style={{ marginTop: 2 }}>
                        {record.customerId}
                      </div>
                    </td>

                    {/* AI Risk Score */}
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

                    {/* AI Recommendation */}
                    <td className="hp-reason">{record.aiRecommendation}</td>

                    {/* Analyst Decision */}
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

                    {/* Outcome */}
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

                    {/* Final Status */}
                    <td>
                      <span
                        className="hp-status-badge"
                        style={{ color: dotColor, background: `${dotColor}18` }}
                      >
                        <span
                          className="hp-status-dot"
                          style={{ background: dotColor }}
                        />
                        {record.finalStatus}
                      </span>
                    </td>

                    {/* Analyst */}
                    <td className="hp-assigned" style={{ fontSize: 13 }}>
                      {record.analyst}
                    </td>

                    {/* Action */}
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

export default InterventionsTab;
