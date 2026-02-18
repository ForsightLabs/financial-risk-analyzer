import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reports.css";

// ─────────────────────────────────────────────────────────────────
// DUMMY REPORTS DATA
// ─────────────────────────────────────────────────────────────────
const DUMMY_REPORTS = [
  {
    id: "RPT-001",
    title: "Monthly Risk Assessment - January 2026",
    type: "Monthly Report",
    generatedBy: "System Auto-Generate",
    date: "2026-01-31",
    status: "Completed",
    customers: 487,
    riskLevel: "Medium",
    size: "2.4 MB",
  },
  {
    id: "RPT-002",
    title: "Critical Customers - Week 6",
    type: "Weekly Alert",
    generatedBy: "Rahul Sharma",
    date: "2026-02-10",
    status: "Completed",
    customers: 23,
    riskLevel: "Critical",
    size: "890 KB",
  },
  {
    id: "RPT-003",
    title: "Delinquency Trend Analysis Q1",
    type: "Quarterly Report",
    generatedBy: "System Auto-Generate",
    date: "2026-02-01",
    status: "Completed",
    customers: 1250,
    riskLevel: "High",
    size: "5.1 MB",
  },
  {
    id: "RPT-004",
    title: "Intervention Success Rate - February",
    type: "Performance Report",
    generatedBy: "Sneha Iyer",
    date: "2026-02-15",
    status: "In Progress",
    customers: 156,
    riskLevel: "Medium",
    size: "1.2 MB",
  },
  {
    id: "RPT-005",
    title: "ML Model Accuracy Report",
    type: "Technical Report",
    generatedBy: "System Auto-Generate",
    date: "2026-02-12",
    status: "Completed",
    customers: 10000,
    riskLevel: "Low",
    size: "3.8 MB",
  },
  {
    id: "RPT-006",
    title: "Customer Segmentation Analysis",
    type: "Analytical Report",
    generatedBy: "Amit Verma",
    date: "2026-02-08",
    status: "Completed",
    customers: 8750,
    riskLevel: "Low",
    size: "4.2 MB",
  },
  {
    id: "RPT-007",
    title: "Payment Default Predictions - Week 7",
    type: "Weekly Alert",
    generatedBy: "System Auto-Generate",
    date: "2026-02-17",
    status: "Completed",
    customers: 34,
    riskLevel: "Critical",
    size: "1.1 MB",
  },
  {
    id: "RPT-008",
    title: "Recovery Rate Analysis - January",
    type: "Performance Report",
    generatedBy: "Rahul Sharma",
    date: "2026-02-05",
    status: "Completed",
    customers: 567,
    riskLevel: "Medium",
    size: "2.7 MB",
  },
];

// ─────────────────────────────────────────────────────────────────
// STATUS & RISK CONFIG
// ─────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Completed: { color: "#00c97a", bg: "rgba(0,201,122,0.1)", dot: "#00c97a" },
  "In Progress": {
    color: "#f5c518",
    bg: "rgba(245,197,24,0.1)",
    dot: "#f5c518",
  },
  Failed: { color: "#ff4d4d", bg: "rgba(255,77,77,0.1)", dot: "#ff4d4d" },
};

const RISK_CONFIG = {
  Critical: { color: "#ff4d4d", bg: "rgba(255,77,77,0.1)" },
  High: { color: "#ff8c00", bg: "rgba(255,140,0,0.1)" },
  Medium: { color: "#f5c518", bg: "rgba(245,197,24,0.1)" },
  Low: { color: "#00c97a", bg: "rgba(0,201,122,0.1)" },
};

// ─────────────────────────────────────────────────────────────────
// REPORTS COMPONENT
// ─────────────────────────────────────────────────────────────────
function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // ── Fetch reports ──
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        // ── BACKEND INTEGRATION POINT ──────────────────────────
        // const token = localStorage.getItem("token");
        // const response = await fetch("http://localhost:8080/api/reports", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        // const data = await response.json();
        // setReports(data);
        // ── END INTEGRATION POINT ──────────────────────────────

        await new Promise((res) => setTimeout(res, 600));
        setReports(DUMMY_REPORTS);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // ── Filtering ──
  const filtered = reports.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || r.type === typeFilter;
    const matchRisk = riskFilter === "All" || r.riskLevel === riskFilter;
    return matchSearch && matchType && matchRisk;
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
    else setSelectedRows(paginated.map((r) => r.id));
  };

  // ── Stats ──
  const stats = [
    {
      label: "Total Reports",
      value: reports.length,
      accent: "#00aeef",
    },
    {
      label: "This Month",
      value: reports.filter((r) => r.date.includes("2026-02")).length,
      accent: "#00c97a",
    },
    {
      label: "Critical Alerts",
      value: reports.filter((r) => r.riskLevel === "Critical").length,
      accent: "#ff4d4d",
    },
    {
      label: "In Progress",
      value: reports.filter((r) => r.status === "In Progress").length,
      accent: "#f5c518",
    },
  ];

  // ── Report types for filter ──
  const reportTypes = ["All", ...new Set(reports.map((r) => r.type))];

  // ── Handle download ──
  const handleDownload = (reportId) => {
    console.log(`Downloading report: ${reportId}`);
    // Implement actual download logic
    alert(`Downloading report ${reportId}...`);
  };

  // ── Handle generate new report ──
  const handleGenerateReport = () => {
    alert("Generate new report - functionality to be implemented");
  };

  return (
    <div className="rp-page">
      {/* ── Header ── */}
      <div className="rp-header">
        <div>
          <h1 className="rp-title">
            Risk <span className="rp-title-accent">Reports</span>
          </h1>
          <p className="rp-subtitle">
            Generated reports, analytics, and performance insights
          </p>
        </div>
        <div className="rp-header-right">
          <button className="rp-generate-btn" onClick={handleGenerateReport}>
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
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Generate Report
          </button>
          <span className="rp-date">
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
      <div className="rp-stats">
        {stats.map((s) => (
          <div className="rp-stat-card" key={s.label}>
            <span className="rp-stat-value" style={{ color: s.accent }}>
              {s.value}
            </span>
            <span className="rp-stat-label">{s.label}</span>
            <div className="rp-stat-bar" style={{ background: s.accent }}></div>
          </div>
        ))}
      </div>

      {/* ── Table Container ── */}
      <div className="rp-table-container">
        {/* ── Toolbar ── */}
        <div className="rp-toolbar">
          <div className="rp-search-wrap">
            <svg
              className="rp-search-icon"
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
              className="rp-search"
              placeholder="Search reports by title, ID or type..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="rp-filters">
            <select
              className="rp-filter-select"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type}
                </option>
              ))}
            </select>

            <select
              className="rp-filter-select"
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <span className="rp-count">
            Showing {paginated.length} of {filtered.length}
          </span>
        </div>

        {/* ── Table ── */}
        {loading ? (
          <div className="rp-loading">
            <div className="rp-spinner"></div>
            <span>Loading reports...</span>
          </div>
        ) : (
          <table className="rp-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="rp-checkbox"
                    checked={
                      selectedRows.length === paginated.length &&
                      paginated.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th>Report ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Generated By</th>
                <th>Date</th>
                <th>Customers</th>
                <th>Risk Level</th>
                <th>Status</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={11} className="rp-empty">
                    No reports match your search.
                  </td>
                </tr>
              ) : (
                paginated.map((report, idx) => (
                  <tr
                    key={report.id}
                    className={`rp-row ${selectedRows.includes(report.id) ? "selected" : ""}`}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        className="rp-checkbox"
                        checked={selectedRows.includes(report.id)}
                        onChange={() => toggleRow(report.id)}
                      />
                    </td>

                    <td className="rp-id">{report.id}</td>

                    <td className="rp-title">{report.title}</td>

                    <td>
                      <span className="rp-type">{report.type}</span>
                    </td>

                    <td className="rp-generated-by">{report.generatedBy}</td>

                    <td className="rp-date">
                      {new Date(report.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="rp-customers">
                      {report.customers.toLocaleString()}
                    </td>

                    <td>
                      <span
                        className="rp-risk-badge"
                        style={{
                          color: RISK_CONFIG[report.riskLevel]?.color,
                          background: RISK_CONFIG[report.riskLevel]?.bg,
                        }}
                      >
                        {report.riskLevel}
                      </span>
                    </td>

                    <td>
                      <span
                        className="rp-status-badge"
                        style={{
                          color: STATUS_CONFIG[report.status]?.color,
                          background: STATUS_CONFIG[report.status]?.bg,
                        }}
                      >
                        <span
                          className="rp-status-dot"
                          style={{
                            background: STATUS_CONFIG[report.status]?.dot,
                          }}
                        ></span>
                        {report.status}
                      </span>
                    </td>

                    <td className="rp-size">{report.size}</td>

                    <td>
                      <div className="rp-actions">
                        <button
                          className="rp-action-btn rp-download"
                          title="Download Report"
                          onClick={() => handleDownload(report.id)}
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
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </button>
                        <button
                          className="rp-action-btn rp-view"
                          title="View Report"
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
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* ── Footer / Pagination ── */}
        <div className="rp-footer">
          {selectedRows.length > 0 && (
            <div className="rp-bulk-actions">
              <span>{selectedRows.length} selected</span>
              <button className="rp-bulk-btn">Download Selected</button>
              <button className="rp-bulk-btn danger">Delete Selected</button>
            </div>
          )}
          <div className="rp-pagination">
            <button
              className="rp-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`rp-page-btn ${currentPage === p ? "active" : ""}`}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="rp-page-btn"
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

export default Reports;
