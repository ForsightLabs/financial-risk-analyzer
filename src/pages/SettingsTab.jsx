import React, { useState } from "react";
import "../styles/settingstab.css";

// ─────────────────────────────────────────────────────────────────
// SETTINGS TAB COMPONENT
// ─────────────────────────────────────────────────────────────────

const TABS = ["Thresholds", "Notifications", "Model Config", "Team & Access", "Audit Log"];

const ANALYSTS = [
  { name: "Rahul Sharma",  role: "Senior Analyst", cases: 14, status: "Active" },
  { name: "Sneha Iyer",    role: "Analyst",         cases: 11, status: "Active" },
  { name: "Amit Verma",    role: "Analyst",         cases: 8,  status: "Active" },
  { name: "Divya Rao",     role: "Junior Analyst",  cases: 3,  status: "Inactive" },
];

const AUDIT_LOG = [
  { time: "2025-07-14 10:22", user: "Rahul Sharma",  action: "Resolved alert ALT-004" },
  { time: "2025-07-14 09:45", user: "Sneha Iyer",    action: "Updated salary delay threshold to 10 days" },
  { time: "2025-07-14 08:30", user: "System",        action: "Model retrained — Accuracy: 91.4%" },
  { time: "2025-07-13 17:10", user: "Amit Verma",    action: "Assigned USR-008 to self" },
  { time: "2025-07-13 14:05", user: "System",        action: "Alert ALT-004 triggered for Vikram Joshi" },
  { time: "2025-07-13 11:00", user: "Rahul Sharma",  action: "Enabled Push notifications for Critical alerts" },
  { time: "2025-07-12 16:20", user: "Admin",         action: "Added analyst: Divya Rao" },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      className={`st-toggle ${checked ? "on" : "off"}`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <span className="st-toggle-thumb" />
    </button>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="st-card">
      <div className="st-card-header">
        <div className="st-card-title">{title}</div>
        {subtitle && <div className="st-card-subtitle">{subtitle}</div>}
      </div>
      <div className="st-card-body">{children}</div>
    </div>
  );
}

// ── Thresholds Panel ────────────────────────────────────────────
function ThresholdsPanel() {
  const [vals, setVals] = useState({
    salaryDelayDays: 10,
    savingsDropPct: 60,
    creditUtilPct: 85,
    autoDebitFailCount: 2,
    atmSurgePct: 150,
    lendingAppTxCount: 3,
    predictionWindowDays: 14,
    scoreThresholdCritical: 80,
    scoreThresholdHigh: 60,
    scoreThresholdMedium: 40,
  });

  const update = (k, v) => setVals((prev) => ({ ...prev, [k]: v }));
  const saved = () => alert("Thresholds saved (stub).");

  const fields = [
    { key: "salaryDelayDays",        label: "Salary Delay Threshold",       unit: "days",  min: 1,   max: 30 },
    { key: "savingsDropPct",         label: "Savings Drop Threshold",        unit: "%",     min: 10,  max: 100 },
    { key: "creditUtilPct",          label: "Credit Utilisation Threshold",  unit: "%",     min: 50,  max: 100 },
    { key: "autoDebitFailCount",     label: "Auto-debit Failure Count",      unit: "times", min: 1,   max: 10 },
    { key: "atmSurgePct",            label: "ATM Withdrawal Surge",          unit: "%",     min: 50,  max: 500 },
    { key: "lendingAppTxCount",      label: "Lending App TX Count",          unit: "txns",  min: 1,   max: 20 },
    { key: "predictionWindowDays",   label: "Prediction Lookahead Window",   unit: "days",  min: 7,   max: 28 },
    { key: "scoreThresholdCritical", label: "Risk Score → Critical",         unit: "/100",  min: 70,  max: 99 },
    { key: "scoreThresholdHigh",     label: "Risk Score → High",             unit: "/100",  min: 50,  max: 79 },
    { key: "scoreThresholdMedium",   label: "Risk Score → Medium",           unit: "/100",  min: 20,  max: 59 },
  ];

  return (
    <SectionCard title="Signal Thresholds" subtitle="Adjust the trigger values for each early-warning signal">
      <div className="st-threshold-grid">
        {fields.map((f) => (
          <div className="st-field" key={f.key}>
            <div className="st-field-top">
              <label className="st-label">{f.label}</label>
              <span className="st-field-value" style={{ color: "var(--accent)" }}>
                {vals[f.key]} <span style={{ color: "var(--text-muted)", fontSize: 11 }}>{f.unit}</span>
              </span>
            </div>
            <input
              type="range"
              className="st-slider"
              min={f.min}
              max={f.max}
              value={vals[f.key]}
              onChange={(e) => update(f.key, Number(e.target.value))}
            />
            <div className="st-slider-meta">
              <span>{f.min}</span>
              <span>{f.max}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="st-save-row">
        <button className="st-save-btn" onClick={saved}>Save Thresholds</button>
      </div>
    </SectionCard>
  );
}

// ── Notifications Panel ─────────────────────────────────────────
function NotificationsPanel() {
  const [cfg, setCfg] = useState({
    emailCritical: true,
    emailHigh: true,
    emailMedium: false,
    smsCritical: true,
    smsHigh: false,
    smsMedium: false,
    pushCritical: true,
    pushHigh: true,
    pushMedium: true,
    callCritical: false,
    digestEnabled: true,
    digestTime: "08:00",
    escalateAfterHrs: 4,
  });

  const toggle = (k) => setCfg((prev) => ({ ...prev, [k]: !prev[k] }));

  const channels = [
    { key: "email", label: "Email", icon: "✉️" },
    { key: "sms",   label: "SMS",   icon: "💬" },
    { key: "push",  label: "Push",  icon: "🔔" },
    { key: "call",  label: "Call",  icon: "📞" },
  ];

  const severities = ["Critical", "High", "Medium"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionCard title="Channel × Severity Matrix" subtitle="Enable outreach channels per alert severity">
        <div className="st-matrix">
          <div className="st-matrix-head">
            <div />
            {severities.map((s) => (
              <div key={s} className="st-matrix-col-label">{s}</div>
            ))}
          </div>
          {channels.map((ch) => (
            <div className="st-matrix-row" key={ch.key}>
              <div className="st-matrix-row-label">{ch.icon} {ch.label}</div>
              {severities.map((sv) => {
                const k = `${ch.key}${sv}`;
                return (
                  <div key={k} className="st-matrix-cell">
                    <Toggle checked={!!cfg[k]} onChange={() => toggle(k)} />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Digest & Escalation" subtitle="Configure daily summaries and auto-escalation">
        <div className="st-notif-extras">
          <div className="st-notif-row">
            <div>
              <div className="st-label">Daily Digest Email</div>
              <div className="st-sublabel">Send a daily summary of open alerts</div>
            </div>
            <Toggle checked={cfg.digestEnabled} onChange={() => toggle("digestEnabled")} />
          </div>
          {cfg.digestEnabled && (
            <div className="st-notif-row">
              <label className="st-label">Digest Time</label>
              <input
                type="time"
                className="st-input"
                value={cfg.digestTime}
                onChange={(e) => setCfg((p) => ({ ...p, digestTime: e.target.value }))}
              />
            </div>
          )}
          <div className="st-notif-row">
            <div>
              <div className="st-label">Auto-Escalate After</div>
              <div className="st-sublabel">Escalate unresolved Critical alerts after N hours</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                className="st-input st-input-sm"
                value={cfg.escalateAfterHrs}
                min={1}
                max={48}
                onChange={(e) => setCfg((p) => ({ ...p, escalateAfterHrs: Number(e.target.value) }))}
              />
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>hrs</span>
            </div>
          </div>
        </div>
        <div className="st-save-row">
          <button className="st-save-btn">Save Notification Settings</button>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Model Config Panel ──────────────────────────────────────────
function ModelConfigPanel() {
  const [cfg, setCfg] = useState({
    activeModel: "XGBoost v2.1",
    retrainFreq: "Weekly",
    featureWindow: 30,
    minSampleSize: 500,
    explainability: true,
    fairnessCheck: true,
    driftMonitor: true,
  });

  const models = ["XGBoost v2.1", "LightGBM v1.4", "LSTM Seq v3.0", "Ensemble Blend"];
  const freqs  = ["Daily", "Weekly", "Bi-weekly", "Monthly"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <SectionCard title="Active Model" subtitle="Select the ML model driving risk scores">
        <div className="st-model-grid">
          {models.map((m) => (
            <button
              key={m}
              className={`st-model-card ${cfg.activeModel === m ? "active" : ""}`}
              onClick={() => setCfg((p) => ({ ...p, activeModel: m }))}
            >
              <span className="st-model-icon">⚙️</span>
              <span className="st-model-name">{m}</span>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Training Parameters" subtitle="Control retraining schedule and data windows">
        <div className="st-notif-extras">
          <div className="st-notif-row">
            <label className="st-label">Retrain Frequency</label>
            <select
              className="st-input"
              value={cfg.retrainFreq}
              onChange={(e) => setCfg((p) => ({ ...p, retrainFreq: e.target.value }))}
            >
              {freqs.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="st-notif-row">
            <div>
              <div className="st-label">Feature Lookback Window</div>
              <div className="st-sublabel">Days of transaction history used per prediction</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                className="st-input st-input-sm"
                value={cfg.featureWindow}
                min={7}
                max={90}
                onChange={(e) => setCfg((p) => ({ ...p, featureWindow: Number(e.target.value) }))}
              />
              <span style={{ color: "var(--text-muted)", fontSize: 12 }}>days</span>
            </div>
          </div>
          <div className="st-notif-row">
            <div>
              <div className="st-label">Min Sample Size</div>
              <div className="st-sublabel">Minimum transactions required to score a customer</div>
            </div>
            <input
              type="number"
              className="st-input st-input-sm"
              value={cfg.minSampleSize}
              min={100}
              max={5000}
              step={100}
              onChange={(e) => setCfg((p) => ({ ...p, minSampleSize: Number(e.target.value) }))}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Governance Controls" subtitle="Explainability, fairness, and drift monitoring">
        <div className="st-notif-extras">
          {[
            { key: "explainability", label: "SHAP Explainability", sub: "Generate SHAP values for every prediction" },
            { key: "fairnessCheck",  label: "Fairness Auditing",    sub: "Run demographic parity checks on outputs" },
            { key: "driftMonitor",   label: "Data Drift Monitor",   sub: "Alert when input distribution shifts" },
          ].map((item) => (
            <div className="st-notif-row" key={item.key}>
              <div>
                <div className="st-label">{item.label}</div>
                <div className="st-sublabel">{item.sub}</div>
              </div>
              <Toggle
                checked={cfg[item.key]}
                onChange={(v) => setCfg((p) => ({ ...p, [item.key]: v }))}
              />
            </div>
          ))}
        </div>
        <div className="st-save-row">
          <button className="st-save-btn">Save Model Config</button>
        </div>
      </SectionCard>
    </div>
  );
}

// ── Team & Access Panel ─────────────────────────────────────────
function TeamPanel() {
  const [analysts, setAnalysts] = useState(ANALYSTS);

  const toggleStatus = (name) =>
    setAnalysts((prev) =>
      prev.map((a) =>
        a.name === name ? { ...a, status: a.status === "Active" ? "Inactive" : "Active" } : a
      )
    );

  return (
    <SectionCard title="Analyst Team" subtitle="Manage your intervention team and access levels">
      <table className="hp-table" style={{ marginTop: 0 }}>
        <thead>
          <tr>
            <th>Analyst</th>
            <th>Role</th>
            <th>Open Cases</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {analysts.map((a, idx) => (
            <tr key={a.name} className="hp-row" style={{ animationDelay: `${idx * 40}ms` }}>
              <td className="hp-name">{a.name}</td>
              <td>
                <span className="hp-flagtype">{a.role}</span>
              </td>
              <td>
                <span style={{ color: "var(--accent)", fontWeight: 600 }}>{a.cases}</span>
              </td>
              <td>
                <span
                  className="hp-status-badge"
                  style={{
                    color: a.status === "Active" ? "#00c97a" : "var(--text-muted)",
                    background: a.status === "Active" ? "rgba(0,201,122,0.1)" : "rgba(255,255,255,0.03)",
                  }}
                >
                  <span
                    className="hp-status-dot"
                    style={{ background: a.status === "Active" ? "#00c97a" : "var(--text-muted)" }}
                  />
                  {a.status}
                </span>
              </td>
              <td>
                <div className="hp-actions">
                  <button
                    className={`hp-action-btn ${a.status === "Active" ? "" : "hp-assign-btn"}`}
                    onClick={() => toggleStatus(a.name)}
                  >
                    {a.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button className="hp-action-btn hp-view">Edit</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="st-save-row" style={{ marginTop: 16 }}>
        <button className="st-save-btn">+ Add Analyst</button>
      </div>
    </SectionCard>
  );
}

// ── Audit Log Panel ─────────────────────────────────────────────
function AuditLogPanel() {
  return (
    <SectionCard title="Audit Log" subtitle="A record of all configuration and resolution actions">
      <div className="st-audit-list">
        {AUDIT_LOG.map((entry, idx) => (
          <div className="st-audit-row" key={idx}>
            <div className="st-audit-time">{entry.time}</div>
            <div className="st-audit-user">
              <span className="hp-flagtype" style={{ fontSize: 11 }}>{entry.user}</span>
            </div>
            <div className="st-audit-action">{entry.action}</div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN SETTINGS COMPONENT
// ─────────────────────────────────────────────────────────────────
function SettingsTab() {
  const [activeTab, setActiveTab] = useState("Thresholds");

  const renderPanel = () => {
    switch (activeTab) {
      case "Thresholds":   return <ThresholdsPanel />;
      case "Notifications": return <NotificationsPanel />;
      case "Model Config": return <ModelConfigPanel />;
      case "Team & Access": return <TeamPanel />;
      case "Audit Log":    return <AuditLogPanel />;
      default:             return null;
    }
  };

  return (
    <div className="hp-page">
      {/* ── Header ── */}
      <div className="hp-header">
        <div>
          <h1 className="hp-title">
            System <span className="hp-title-accent">Settings</span>
          </h1>
          <p className="hp-subtitle">
            Configure thresholds, models, notifications and team access
          </p>
        </div>
        <div className="hp-header-right">
          <span className="hp-date">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* ── Settings Nav Tabs ── */}
      <div className="st-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`st-tab-btn ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Panel ── */}
      <div className="st-panel">{renderPanel()}</div>
    </div>
  );
}

export default SettingsTab;
