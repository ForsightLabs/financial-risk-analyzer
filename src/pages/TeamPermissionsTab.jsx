import React, { useState } from "react";
import { useAppContext } from "../pages/AppContext";
import "../styles/teampermissions.css";

// ─────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────
const SUBTABS = ["All Employees", "Teams", "Performance", "Work Queue"];
const ROLES = ["Junior Analyst", "Analyst", "Senior Analyst"];
const PERMS = ["View Only", "Analyst", "Senior Analyst", "Admin"];
const STATUS_CONFIG = {
  Critical: { color: "#ff4d4d", bg: "rgba(255,77,77,0.1)" },
  High: { color: "#ff8c00", bg: "rgba(255,140,0,0.1)" },
  Medium: { color: "#f5c518", bg: "rgba(245,197,24,0.1)" },
  Low: { color: "#00c97a", bg: "rgba(0,201,122,0.1)" },
};

// initials avatar
function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1) * 17) % 360;
  return (
    <span
      className="tp-avatar"
      style={{
        background: `hsl(${hue},45%,28%)`,
        borderColor: `hsl(${hue},45%,40%)`,
      }}
    >
      {initials}
    </span>
  );
}

// workload bar colour
function workloadColor(open, max) {
  const pct = open / max;
  if (pct >= 0.85) return "#ff4d4d";
  if (pct >= 0.6) return "#ff8c00";
  return "#00c97a";
}

// ─────────────────────────────────────────────────────────────────
// SUB-TAB 1 — ALL EMPLOYEES
// ─────────────────────────────────────────────────────────────────
function EmployeesPanel() {
  const { employees, teams, openCasesByAnalyst, updateEmployee } =
    useAppContext();
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [search, setSearch] = useState("");

  const startEdit = (emp) => {
    setEditId(emp.id);
    setEditData({
      role: emp.role,
      permission: emp.permission,
      teamId: emp.teamId,
    });
  };
  const saveEdit = (id) => {
    updateEmployee(id, editData);
    setEditId(null);
  };

  const visible = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="tp-panel">
      {/* toolbar */}
      <div
        className="hp-toolbar"
        style={{ borderRadius: "var(--radius) var(--radius) 0 0" }}
      >
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
            placeholder="Search employees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="hp-count">{visible.length} employees</span>
      </div>

      <table className="hp-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Role</th>
            <th>Permission</th>
            <th>Team</th>
            <th>Open Cases</th>
            <th>Workload</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((emp, idx) => {
            const openCount = openCasesByAnalyst[emp.name] || 0;
            const team = teams.find((t) => t.id === emp.teamId);
            const isEditing = editId === emp.id;
            const wColor = workloadColor(openCount, emp.maxCases);

            return (
              <tr
                key={emp.id}
                className="hp-row"
                style={{ animationDelay: `${idx * 35}ms` }}
              >
                {/* Employee */}
                <td>
                  <div className="tp-emp-cell">
                    <Avatar name={emp.name} />
                    <div>
                      <div className="hp-name">{emp.name}</div>
                      <div className="hp-id" style={{ marginTop: 2 }}>
                        {emp.id}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td>
                  {isEditing ? (
                    <select
                      className="tp-select"
                      value={editData.role}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, role: e.target.value }))
                      }
                    >
                      {ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="hp-flagtype">{emp.role}</span>
                  )}
                </td>

                {/* Permission */}
                <td>
                  {isEditing ? (
                    <select
                      className="tp-select"
                      value={editData.permission}
                      onChange={(e) =>
                        setEditData((p) => ({
                          ...p,
                          permission: e.target.value,
                        }))
                      }
                    >
                      {PERMS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="tp-perm-badge" data-perm={emp.permission}>
                      {emp.permission}
                    </span>
                  )}
                </td>

                {/* Team */}
                <td>
                  {isEditing ? (
                    <select
                      className="tp-select"
                      value={editData.teamId}
                      onChange={(e) =>
                        setEditData((p) => ({ ...p, teamId: e.target.value }))
                      }
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="tp-team-tag">{team?.name || "—"}</span>
                  )}
                </td>

                {/* Open cases */}
                <td>
                  <span
                    style={{ color: wColor, fontWeight: 600, fontSize: 14 }}
                  >
                    {openCount}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: 11 }}>
                    {" "}
                    / {emp.maxCases}
                  </span>
                </td>

                {/* Workload bar */}
                <td style={{ minWidth: 100 }}>
                  <div className="tp-workload-track">
                    <div
                      className="tp-workload-fill"
                      style={{
                        width: `${Math.min((openCount / emp.maxCases) * 100, 100)}%`,
                        background: wColor,
                      }}
                    />
                  </div>
                </td>

                {/* Status */}
                <td>
                  <span
                    className="hp-status-badge"
                    style={{
                      color: emp.onLeave
                        ? "var(--text-muted)"
                        : emp.status === "Active"
                          ? "#00c97a"
                          : "#ff6b6b",
                      background: emp.onLeave
                        ? "rgba(255,255,255,0.04)"
                        : emp.status === "Active"
                          ? "rgba(0,201,122,0.1)"
                          : "rgba(255,77,77,0.1)",
                    }}
                  >
                    <span
                      className="hp-status-dot"
                      style={{
                        background: emp.onLeave
                          ? "var(--text-muted)"
                          : emp.status === "Active"
                            ? "#00c97a"
                            : "#ff6b6b",
                      }}
                    />
                    {emp.onLeave ? "On Leave" : emp.status}
                  </span>
                </td>

                {/* Actions */}
                <td>
                  <div className="hp-actions">
                    {isEditing ? (
                      <>
                        <button
                          className="hp-action-btn hp-assign-btn"
                          onClick={() => saveEdit(emp.id)}
                        >
                          ✓ Save
                        </button>
                        <button
                          className="hp-action-btn"
                          onClick={() => setEditId(null)}
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="hp-action-btn hp-view"
                          onClick={() => startEdit(emp)}
                        >
                          Edit
                        </button>
                        <button
                          className="hp-action-btn"
                          onClick={() =>
                            updateEmployee(emp.id, { onLeave: !emp.onLeave })
                          }
                        >
                          {emp.onLeave ? "Return" : "Leave"}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-TAB 2 — TEAMS
// ─────────────────────────────────────────────────────────────────
function TeamsPanel() {
  const {
    employees,
    teams,
    openCasesByAnalyst,
    createTeam,
    updateTeam,
    moveEmployeeToTeam,
  } = useAppContext();

  const [showCreate, setShowCreate] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: "", leadId: "", note: "" });
  const [editNote, setEditNote] = useState(null); // teamId being edited

  const handleCreate = () => {
    if (!newTeam.name.trim()) return;
    createTeam({
      id: `TEAM-${Date.now()}`,
      name: newTeam.name.trim(),
      leadId: newTeam.leadId || employees[0]?.id,
      note: newTeam.note.trim(),
    });
    setNewTeam({ name: "", leadId: "", note: "" });
    setShowCreate(false);
  };

  return (
    <div className="tp-panel">
      {/* Create team button */}
      <div className="tp-teams-toolbar">
        <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          {teams.length} team{teams.length !== 1 ? "s" : ""}
        </span>
        <button
          className="tp-create-btn"
          onClick={() => setShowCreate((p) => !p)}
        >
          {showCreate ? "✕ Cancel" : "+ Create Team"}
        </button>
      </div>

      {/* Create team form */}
      {showCreate && (
        <div className="tp-create-form">
          <div className="tp-create-form__title">New Team</div>
          <div className="tp-create-form__row">
            <div className="tp-field">
              <label className="tp-label">Team Name</label>
              <input
                className="tp-input"
                placeholder="e.g. Delta Squad"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="tp-field">
              <label className="tp-label">Team Lead</label>
              <select
                className="tp-select tp-input"
                value={newTeam.leadId}
                onChange={(e) =>
                  setNewTeam((p) => ({ ...p, leadId: e.target.value }))
                }
              >
                <option value="">— Select lead —</option>
                {employees
                  .filter((e) => e.status === "Active")
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="tp-field" style={{ marginTop: 10 }}>
            <label className="tp-label">Team Note (optional)</label>
            <input
              className="tp-input"
              placeholder="Focus area or description"
              value={newTeam.note}
              onChange={(e) =>
                setNewTeam((p) => ({ ...p, note: e.target.value }))
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 14,
            }}
          >
            <button className="tp-create-btn" onClick={handleCreate}>
              Create Team
            </button>
          </div>
        </div>
      )}

      {/* Team cards grid */}
      <div className="tp-teams-grid">
        {teams.map((team) => {
          const members = employees.filter((e) => e.teamId === team.id);
          const lead = employees.find((e) => e.id === team.leadId);
          const openLoad = members.reduce(
            (sum, m) => sum + (openCasesByAnalyst[m.name] || 0),
            0,
          );

          return (
            <div className="tp-team-card" key={team.id}>
              {/* Header */}
              <div className="tp-team-card__header">
                <div>
                  <div className="tp-team-card__name">{team.name}</div>
                  <div className="tp-team-card__lead">
                    Lead:{" "}
                    <span style={{ color: "var(--accent)" }}>
                      {lead?.name || "—"}
                    </span>
                  </div>
                </div>
                <div className="tp-team-card__badge">
                  <span
                    style={{ color: "#ff8c00", fontWeight: 700, fontSize: 15 }}
                  >
                    {openLoad}
                  </span>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: 11,
                      marginLeft: 3,
                    }}
                  >
                    open
                  </span>
                </div>
              </div>

              {/* Note */}
              {editNote === team.id ? (
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  <input
                    className="tp-input"
                    style={{ flex: 1, fontSize: 12 }}
                    defaultValue={team.note}
                    onBlur={(e) => {
                      updateTeam(team.id, { note: e.target.value });
                      setEditNote(null);
                    }}
                    autoFocus
                  />
                </div>
              ) : (
                <p
                  className="tp-team-card__note"
                  onClick={() => setEditNote(team.id)}
                >
                  {team.note || (
                    <span style={{ color: "var(--text-muted)" }}>
                      Click to add a note…
                    </span>
                  )}
                </p>
              )}

              {/* Members */}
              <div className="tp-team-card__members-label">
                Members ({members.length})
              </div>
              <div className="tp-team-card__members">
                {members.map((m) => (
                  <div key={m.id} className="tp-member-chip">
                    <Avatar name={m.name} />
                    <span className="tp-member-chip__name">{m.name}</span>
                    {/* Move to another team */}
                    <select
                      className="tp-member-chip__move"
                      value={m.teamId}
                      onChange={(e) => moveEmployeeToTeam(m.id, e.target.value)}
                      title="Move to team"
                    >
                      {teams.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
                {members.length === 0 && (
                  <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    No members yet
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-TAB 3 — PERFORMANCE
// ─────────────────────────────────────────────────────────────────
function PerformancePanel() {
  const { employees, teams, openCasesByAnalyst } = useAppContext();

  // Team-level rollup
  const teamStats = teams.map((team) => {
    const members = employees.filter((e) => e.teamId === team.id);
    const openLoad = members.reduce(
      (sum, m) => sum + (openCasesByAnalyst[m.name] || 0),
      0,
    );
    const resolved = members.reduce((sum, m) => sum + m.resolved, 0);
    const avgHrs = members.length
      ? (
          members.reduce((sum, m) => sum + m.avgResolutionHrs, 0) /
          members.length
        ).toFixed(1)
      : "—";
    return { team, members: members.length, openLoad, resolved, avgHrs };
  });

  // Individual leaderboard — sorted by resolved desc
  const leaderboard = [...employees]
    .sort((a, b) => b.resolved - a.resolved)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const perfStats = [
    {
      label: "Total Resolved",
      value: employees.reduce((s, e) => s + e.resolved, 0),
      accent: "#00c97a",
    },
    {
      label: "Avg Resolution",
      value:
        (
          employees.reduce((s, e) => s + e.avgResolutionHrs, 0) /
          employees.length
        ).toFixed(1) + "h",
      accent: "#00aeef",
    },
    {
      label: "Top Performer",
      value: leaderboard[0]?.name.split(" ")[0] || "—",
      accent: "#f5c518",
    },
    {
      label: "Total Open",
      value: Object.values(openCasesByAnalyst).reduce((s, v) => s + v, 0),
      accent: "#ff8c00",
    },
  ];

  return (
    <div className="tp-panel">
      {/* Stat cards */}
      <div className="hp-stats">
        {perfStats.map((s) => (
          <div className="hp-stat-card" key={s.label}>
            <span
              className="hp-stat-value"
              style={{ color: s.accent, fontSize: 26 }}
            >
              {s.value}
            </span>
            <span className="hp-stat-label">{s.label}</span>
            <div className="hp-stat-bar" style={{ background: s.accent }} />
          </div>
        ))}
      </div>

      {/* Team breakdown table */}
      <div className="hp-table-container" style={{ marginBottom: 20 }}>
        <div
          className="hp-toolbar"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Team Breakdown
          </span>
        </div>
        <table className="hp-table">
          <thead>
            <tr>
              <th>Team</th>
              <th>Members</th>
              <th>Open Cases</th>
              <th>Resolved (Month)</th>
              <th>Avg Resolution</th>
              <th>Load</th>
            </tr>
          </thead>
          <tbody>
            {teamStats.map(
              ({ team, members, openLoad, resolved, avgHrs }, idx) => {
                const maxResolved = Math.max(
                  ...teamStats.map((t) => t.resolved),
                  1,
                );
                return (
                  <tr
                    key={team.id}
                    className="hp-row"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <td className="hp-name">{team.name}</td>
                    <td style={{ color: "var(--accent)", fontWeight: 600 }}>
                      {members}
                    </td>
                    <td>
                      <span style={{ color: "#ff8c00", fontWeight: 600 }}>
                        {openLoad}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "#00c97a", fontWeight: 600 }}>
                        {resolved}
                      </span>
                    </td>
                    <td className="hp-reason">{avgHrs}h</td>
                    <td style={{ minWidth: 120 }}>
                      <div className="tp-workload-track">
                        <div
                          className="tp-workload-fill"
                          style={{
                            width: `${(resolved / maxResolved) * 100}%`,
                            background: "var(--accent)",
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>

      {/* Individual leaderboard */}
      <div className="hp-table-container">
        <div
          className="hp-toolbar"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Individual Leaderboard
          </span>
          <span className="hp-count">This month</span>
        </div>
        <table className="hp-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Analyst</th>
              <th>Team</th>
              <th>Open Cases</th>
              <th>Resolved</th>
              <th>Avg Resolution</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((emp, idx) => {
              const team = teams.find((t) => t.id === emp.teamId);
              const openCount = openCasesByAnalyst[emp.name] || 0;
              return (
                <tr
                  key={emp.id}
                  className={`hp-row${emp.rank === 1 ? " tp-rank-gold" : ""}`}
                  style={{ animationDelay: `${idx * 35}ms` }}
                >
                  <td>
                    <span className={`tp-rank-badge tp-rank-${emp.rank}`}>
                      {emp.rank === 1
                        ? "🥇"
                        : emp.rank === 2
                          ? "🥈"
                          : emp.rank === 3
                            ? "🥉"
                            : `#${emp.rank}`}
                    </span>
                  </td>
                  <td>
                    <div className="tp-emp-cell">
                      <Avatar name={emp.name} />
                      <div>
                        <div className="hp-name">{emp.name}</div>
                        <div
                          style={{ fontSize: 11, color: "var(--text-muted)" }}
                        >
                          {emp.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="tp-team-tag">{team?.name || "—"}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        color: workloadColor(openCount, emp.maxCases),
                        fontWeight: 600,
                      }}
                    >
                      {openCount}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "#00c97a", fontWeight: 700 }}>
                      {emp.resolved}
                    </span>
                  </td>
                  <td className="hp-reason">{emp.avgResolutionHrs}h</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-TAB 4 — WORK QUEUE
// ─────────────────────────────────────────────────────────────────
function WorkQueuePanel() {
  const { customers, employees, assignCustomer, openCasesByAnalyst } =
    useAppContext();
  const [filter, setFilter] = useState("Unassigned");

  const activeAnalysts = employees.filter(
    (e) => e.status === "Active" && !e.onLeave,
  );

  const visible = customers.filter((c) => {
    if (filter === "Unassigned") return c.assignTo === "Unassigned";
    if (filter === "Assigned") return c.assignTo !== "Unassigned";
    return true;
  });

  return (
    <div className="tp-panel">
      <div className="hp-table-container">
        <div className="hp-toolbar">
          <div className="hp-filters">
            {["All", "Unassigned", "Assigned"].map((f) => (
              <button
                key={f}
                className={`hp-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="hp-count">{visible.length} customers</span>
        </div>

        <table className="hp-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Flag Type</th>
              <th>Status</th>
              <th>Currently Assigned</th>
              <th>Reassign To</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="hp-empty">
                  No customers in this view.
                </td>
              </tr>
            ) : (
              visible.map((c, idx) => (
                <tr
                  key={c.id}
                  className="hp-row"
                  style={{ animationDelay: `${idx * 35}ms` }}
                >
                  <td>
                    <div className="hp-name">{c.name}</div>
                    <div className="hp-id" style={{ marginTop: 2 }}>
                      {c.id}
                    </div>
                  </td>
                  <td>
                    {c.flagType !== "—" ? (
                      <span className="hp-flagtype">{c.flagType}</span>
                    ) : (
                      <span className="hp-dash">—</span>
                    )}
                  </td>
                  <td>
                    <span
                      className="hp-status-badge"
                      style={{
                        color: STATUS_CONFIG[c.status]?.color,
                        background: STATUS_CONFIG[c.status]?.bg,
                      }}
                    >
                      <span
                        className="hp-status-dot"
                        style={{ background: STATUS_CONFIG[c.status]?.color }}
                      />
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        c.assignTo === "Unassigned"
                          ? "hp-unassigned"
                          : "hp-assigned"
                      }
                    >
                      {c.assignTo}
                    </span>
                  </td>
                  <td>
                    <div className="tp-wq-assign">
                      <select
                        className="tp-select"
                        value={c.assignTo}
                        onChange={(e) => assignCustomer(c.id, e.target.value)}
                      >
                        <option value="Unassigned">— Unassigned —</option>
                        {activeAnalysts.map((e) => (
                          <option key={e.id} value={e.name}>
                            {e.name} ({openCasesByAnalyst[e.name] || 0}/
                            {e.maxCases})
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
function TeamPermissionsTab() {
  const [activeTab, setActiveTab] = useState("All Employees");

  const renderPanel = () => {
    switch (activeTab) {
      case "All Employees":
        return <EmployeesPanel />;
      case "Teams":
        return <TeamsPanel />;
      case "Performance":
        return <PerformancePanel />;
      case "Work Queue":
        return <WorkQueuePanel />;
      default:
        return null;
    }
  };

  // quick stats for header cards
  const { employees, customers, openCasesByAnalyst } = useAppContext();
  const headerStats = [
    { label: "Total Employees", value: employees.length, accent: "#00aeef" },
    {
      label: "Active",
      value: employees.filter((e) => e.status === "Active").length,
      accent: "#00c97a",
    },
    {
      label: "Unassigned Cases",
      value: customers.filter((c) => c.assignTo === "Unassigned").length,
      accent: "#ff8c00",
    },
    {
      label: "On Leave",
      value: employees.filter((e) => e.onLeave).length,
      accent: "#f5c518",
    },
  ];

  return (
    <div className="hp-page">
      {/* ── Header ── */}
      <div className="hp-header">
        <div>
          <h1 className="hp-title">
            Team &amp; <span className="hp-title-accent">Permissions</span>
          </h1>
          <p className="hp-subtitle">
            Manage analysts, form teams, assign work and track performance
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
        {headerStats.map((s) => (
          <div className="hp-stat-card" key={s.label}>
            <span className="hp-stat-value" style={{ color: s.accent }}>
              {s.value}
            </span>
            <span className="hp-stat-label">{s.label}</span>
            <div className="hp-stat-bar" style={{ background: s.accent }} />
          </div>
        ))}
      </div>

      {/* ── Sub-tab nav ── */}
      <div className="tp-tabs">
        {SUBTABS.map((t) => (
          <button
            key={t}
            className={`tp-tab-btn ${activeTab === t ? "active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Active panel ── */}
      {renderPanel()}
    </div>
  );
}

export default TeamPermissionsTab;
