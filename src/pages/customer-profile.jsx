import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/customer-profile.css";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import ALL_USERS_DATA from "../data/usersData"; // Import the data

const CustomerProfile = () => {
  const { customerId } = useParams(); // Get customer ID from URL
  const navigate = useNavigate(); // For navigation
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch customer data based on customerId from URL
    const fetchCustomerData = () => {
      setLoading(true);

      // Simulate a small delay for loading effect (optional)
      setTimeout(() => {
        // Get data from ALL_USERS_DATA object
        const userData = ALL_USERS_DATA[customerId];

        if (userData) {
          setCustomerData(userData);
        } else {
          setCustomerData(null); // Customer not found
        }

        setLoading(false);
      }, 300);
    };

    fetchCustomerData();
  }, [customerId]);

  if (loading) {
    return (
      <div className="customer-profile-container">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading customer profile...</p>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="customer-profile-container">
        <div className="error-container">
          <h2>Customer not found</h2>
          <button onClick={() => navigate("/")}>Go Back to Dashboard</button>
        </div>
      </div>
    );
  }

  const {
    profile,
    financialSummary,
    riskAssessment,
    cashFlowData,
    liquidityData,
    savingsRate,
    spendingCategories,
    debtRepayment,
    creditScoreHistory,
    paymentHistory,
    recentTransactions,
    alerts,
  } = customerData;

  const handleDownloadReport = () => {
    // Generate filename from customer name
    const filename = `${profile.name.replace(/\s+/g, "-").toLowerCase()}-complete-report.pdf`;

    // Create download link
    const link = document.createElement("a");
    link.href = `/reports/${filename}`; // Points to public/reports/
    link.download = filename;
    link.click();
  };

  return (
    <div className="customer-profile-container">
      <main className="customer-profile-main">
        {/* Header */}
        <div className="profile-header">
          <button className="back-button" onClick={() => navigate("/")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="page-title">Customer Profile</h1>
        </div>

        {/* Profile Card and Cash Flow Section */}
        <div className="profile-top-section">
          {/* Customer Profile Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>CUSTOMER PROFILE</h3>
            </div>
            <div className="profile-info">
              <div className="profile-avatar">
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.name} />
                ) : (
                  <div className="avatar-placeholder">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}
              </div>
              <div className="profile-details">
                <h2 className="profile-name">{profile.name}</h2>
                <p className="profile-id">ID No.: {profile.accountNumber}</p>
                <div className="credit-score-section">
                  <span className="credit-label">Credit Score:</span>
                  <span className="credit-score">{profile.creditScore}</span>
                  <span className="credit-status">
                    ({profile.creditScoreStatus})
                  </span>
                </div>
                <button className="more-info-btn">More Information</button>
              </div>
              <div className="profile-status">
                <span
                  className={`status-badge status-${profile.status.toLowerCase()}`}
                >
                  ✓ {profile.status}
                </span>
              </div>
            </div>

            {/* Financial Summary Grid */}
            <div className="financial-summary-grid">
              <div className="summary-item">
                <span className="summary-label">Total Assets</span>
                <span className="summary-value">
                  ₹{(financialSummary.totalAssets / 100000).toFixed(1)}L
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Liabilities</span>
                <span className="summary-value">
                  ₹{(financialSummary.totalLiabilities / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Net Worth</span>
                <span className="summary-value">
                  ₹{(financialSummary.netWorth / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Debt</span>
                <span className="summary-value">
                  ₹{(financialSummary.totalDebt / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Monthly Income</span>
                <span className="summary-value">
                  ₹{(financialSummary.monthlyIncome / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Fax Credits</span>
                <span className="summary-value">
                  ₹{(financialSummary.totalFaxCredits / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </div>

          {/* Cash Flow Stability Chart */}
          <div className="cash-flow-card">
            <div className="card-header">
              <h3>CASH FLOW STABILITY</h3>
              <div className="legend-horizontal">
                <span className="legend-item">
                  <span className="legend-dot income"></span> Income
                </span>
                <span className="legend-item">
                  <span className="legend-dot expenses"></span> Expenses
                </span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={cashFlowData}>
                  <defs>
                    <linearGradient
                      id="colorIncome"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorExpenses"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(value) => `₹${value / 1000}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#00d4aa"
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Middle Section - 3 Cards */}
        <div className="profile-middle-section">
          {/* Liquidity & Buffer Health */}
          <div className="liquidity-card">
            <div className="card-header-icon">
              <div className="icon-wrapper blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 10H3M21 6H3M21 14H3M21 18H3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3>LIQUIDITY & BUFFER HEALTH</h3>
            </div>

            {/* Circular Progress Indicators */}
            <div className="circular-indicators">
              <div className="circular-progress">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="10"
                    strokeDasharray={`${(2 * Math.PI * 50 * savingsRate.emergencyFund) / 100} ${2 * Math.PI * 50}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <text
                    x="60"
                    y="65"
                    textAnchor="middle"
                    fontSize="24"
                    fill="#0ea5e9"
                    fontWeight="bold"
                  >
                    {savingsRate.emergencyFund}%
                  </text>
                </svg>
                <p>Emergency Fund</p>
              </div>
              <div className="circular-progress">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={savingsRate.current >= 0 ? "#00d4aa" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={`${(2 * Math.PI * 50 * Math.max(0, Math.abs(savingsRate.current))) / 100} ${2 * Math.PI * 50}`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <text
                    x="60"
                    y="65"
                    textAnchor="middle"
                    fontSize="24"
                    fill={savingsRate.current >= 0 ? "#00d4aa" : "#ef4444"}
                    fontWeight="bold"
                  >
                    {savingsRate.current}%
                  </text>
                </svg>
                <p>Savings Rate</p>
              </div>
            </div>

            {/* Liquid Assets Bar Chart */}
            <div className="liquid-assets-section">
              <h4>Liquid Assets</h4>
              <p className="assets-amount">
                ₹
                {(
                  liquidityData[liquidityData.length - 1].amount / 1000
                ).toFixed(0)}
                K
              </p>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={liquidityData}>
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Financial Stress Behavior */}
          <div className="stress-behavior-card">
            <div className="card-header-icon">
              <div className="icon-wrapper green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>FINANCIAL STRESS BEHAVIOR</h3>
            </div>

            <div className="stress-level-badge">
              <span className="stress-icon">⚠</span>
              <span className="stress-text">{riskAssessment.stressLevel}</span>
            </div>

            <div className="spending-categories-section">
              <h4>High Risk Categories</h4>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={spendingCategories} layout="horizontal">
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis
                    type="category"
                    dataKey="category"
                    stroke="#64748b"
                    fontSize={11}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `${value}%`}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {spendingCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="debt-repayment-section">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={debtRepayment} layout="horizontal">
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="category"
                    stroke="#64748b"
                    fontSize={10}
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => `${value}%`}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {debtRepayment.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Report */}
          <div className="risk-report-card">
            <div className="card-header-icon">
              <div className="icon-wrapper purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>RISK REPORT</h3>
            </div>

            <div className="risk-summary-section">
              <h4>Summary</h4>
              <div className="risk-score-display">
                <span className="risk-label">Risk Score:</span>
                <span
                  className={`risk-value risk-${riskAssessment.riskScore.toLowerCase()}`}
                >
                  {riskAssessment.riskScore}
                </span>
              </div>
            </div>

            <div className="key-risk-factors">
              <h4>Key Risk Factors</h4>
              <div className="risk-factor-item">
                <div className="risk-factor-label">
                  <span className="factor-dot"></span>
                  <span>Now Behavioral Risk Factors</span>
                </div>
                <span className="risk-factor-value">
                  {riskAssessment.keyFactors.behavioralRiskFactors}%
                </span>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-label">
                  <span className="factor-dot"></span>
                  <span>High Risk Eateries</span>
                </div>
                <span className="risk-factor-value">
                  {riskAssessment.keyFactors.highRiskEateries}%
                </span>
              </div>
              <div className="risk-factor-item">
                <div className="risk-factor-label">
                  <span className="factor-dot"></span>
                  <span>High Risk Repayment</span>
                </div>
                <span className="risk-factor-value">
                  {riskAssessment.keyFactors.highRiskRepayment}
                </span>
              </div>
            </div>

            <button
              className="download-report-btn"
              onClick={handleDownloadReport}
            >
              Download Report
            </button>
          </div>
        </div>

        {/* Additional Analytics Section */}
        <div className="profile-analytics-section">
          {/* Credit Score History */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Credit Score Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={creditScoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment History */}
          <div className="analytics-card">
            <div className="card-header">
              <h3>Payment History</h3>
              <div className="legend-horizontal">
                <span className="legend-item">
                  <span className="legend-dot on-time"></span> On Time
                </span>
                <span className="legend-item">
                  <span className="legend-dot late"></span> Late
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={paymentHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${value}%`}
                />
                <Bar
                  dataKey="onTime"
                  stackId="a"
                  fill="#00d4aa"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="late"
                  stackId="a"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="transactions-section">
          <div className="section-header">
            <h3>Recent Transactions</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td
                      className={
                        transaction.type === "credit"
                          ? "amount-credit"
                          : "amount-debit"
                      }
                    >
                      {transaction.type === "credit" ? "+" : ""}₹
                      {Math.abs(transaction.amount).toLocaleString()}
                    </td>
                    <td>
                      <span className={`type-badge type-${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts Section */}
        {alerts && alerts.length > 0 && (
          <div className="alerts-section">
            <div className="section-header">
              <h3>Recent Alerts</h3>
            </div>
            <div className="alerts-list">
              {alerts.map((alert, index) => (
                <div key={index} className={`alert-item alert-${alert.type}`}>
                  <div className="alert-icon">
                    {alert.type === "success" && "✓"}
                    {alert.type === "warning" && "⚠"}
                    {alert.type === "critical" && "⚠"}
                    {alert.type === "info" && "ℹ"}
                  </div>
                  <div className="alert-content">
                    <p className="alert-message">{alert.message}</p>
                    <span className="alert-date">{alert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerProfile;
