// Complete User Dataset for Pre-Delinquency Intervention Engine
// Extended to 100 customers with diverse risk profiles
const ALL_USERS_DATA = {
  // USR-001: Aryan Mehta - Missed 3 consecutive EMI payments (Critical)
  "USR-001": {
    profile: {
      id: "USR-001",
      name: "Aryan Mehta",
      photo: null,
      creditScore: 650,
      creditScoreStatus: "Fair",
      status: "Critical",
      accountNumber: "ACC123456789",
      email: "aryan.mehta@email.com",
      phone: "+91 98765 43210",
      dateJoined: "Mar 2019",
      lastUpdated: "1 hour ago",
    },
    financialSummary: {
      totalAssets: 450000,
      totalLiabilities: 380000,
      totalDebt: 250000,
      totalFaxCredits: 50000,
      netWorth: 70000,
      monthlyIncome: 45000,
      monthlyExpenses: 52000,
    },
    riskAssessment: {
      riskScore: "Critical",
      riskPercentage: 85,
      stressLevel: "High Stress",
      keyFactors: {
        behavioralRiskFactors: 75,
        highRiskEateries: 60,
        highRiskRepayment: "High",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 45000, expenses: 58000 },
      { month: "Feb", income: 45000, expenses: 54000 },
      { month: "Mar", income: 45000, expenses: 51000 },
      { month: "Apr", income: 45000, expenses: 48000 },
      { month: "May", income: 45000, expenses: 47000 },
      { month: "Jun", income: 45000, expenses: 52000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 58000 },
      { month: "Feb", amount: 45000 },
      { month: "Mar", amount: 38000 },
      { month: "Apr", amount: 32000 },
      { month: "May", amount: 28000 },
      { month: "Jun", amount: 25000 },
    ],
    savingsRate: {
      current: 15,
      target: 50,
      emergencyFund: 20,
    },
    spendingCategories: [
      { category: "EMI & Loans", value: 35, color: "#ef4444" },
      { category: "Food & Groceries", value: 20, color: "#f59e0b" },
      { category: "Lending Apps", value: 18, color: "#dc2626" },
      { category: "Cash Withdrawals", value: 12, color: "#ea580c" },
      { category: "Utilities", value: 10, color: "#fb923c" },
      { category: "Others", value: 5, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 65, color: "#ef4444" },
      { category: "Debt Repayment", value: 35, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 690 },
      { month: "Feb", score: 680 },
      { month: "Mar", score: 670 },
      { month: "Apr", score: 665 },
      { month: "May", score: 655 },
      { month: "Jun", score: 650 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 95, late: 5 },
      { month: "Feb", onTime: 85, late: 15 },
      { month: "Mar", onTime: 70, late: 30 },
      { month: "Apr", onTime: 60, late: 40 },
      { month: "May", onTime: 60, late: 40 },
      { month: "Jun", onTime: 50, late: 50 },
    ],
    recentTransactions: [
      {
        date: "2026-02-14",
        description: "Salary Credit - Delayed",
        amount: 45000,
        type: "credit",
      },
      {
        date: "2026-02-12",
        description: "EMI Payment - MISSED",
        amount: 0,
        type: "debit",
      },
      {
        date: "2026-02-10",
        description: "Quick Loan - KreditBee",
        amount: -8000,
        type: "debit",
      },
      {
        date: "2026-02-08",
        description: "ATM Withdrawal - Emergency",
        amount: -10000,
        type: "debit",
      },
      {
        date: "2026-02-06",
        description: "Payday Loan - MoneyTap",
        amount: -20000,
        type: "debit",
      },
    ],
    alerts: [
      {
        type: "warning",
        message: "Missed 3 consecutive EMI payments",
        date: "2 days ago",
      },
      {
        type: "warning",
        message: "Salary delayed by 10 days",
        date: "3 days ago",
      },
      {
        type: "warning",
        message: "Multiple quick loan app transfers detected",
        date: "5 days ago",
      },
    ],
  },

  // USR-002: Priya Nair - Salary delayed by 12 days (High)
  "USR-002": {
    profile: {
      id: "USR-002",
      name: "Priya Nair",
      photo: null,
      creditScore: 680,
      creditScoreStatus: "Good",
      status: "High",
      accountNumber: "ACC234567890",
      email: "priya.nair@email.com",
      phone: "+91 98765 43211",
      dateJoined: "Jun 2020",
      lastUpdated: "2 hours ago",
    },
    financialSummary: {
      totalAssets: 520000,
      totalLiabilities: 280000,
      totalDebt: 180000,
      totalFaxCredits: 75000,
      netWorth: 240000,
      monthlyIncome: 52000,
      monthlyExpenses: 48000,
    },
    riskAssessment: {
      riskScore: "High",
      riskPercentage: 72,
      stressLevel: "High Stress",
      keyFactors: {
        behavioralRiskFactors: 68,
        highRiskEateries: 45,
        highRiskRepayment: "Medium-High",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 52000, expenses: 47000 },
      { month: "Feb", income: 52000, expenses: 46000 },
      { month: "Mar", income: 52000, expenses: 48000 },
      { month: "Apr", income: 52000, expenses: 49000 },
      { month: "May", income: 52000, expenses: 47000 },
      { month: "Jun", income: 0, expenses: 48000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 82000 },
      { month: "Feb", amount: 87000 },
      { month: "Mar", amount: 91000 },
      { month: "Apr", amount: 94000 },
      { month: "May", amount: 99000 },
      { month: "Jun", amount: 51000 },
    ],
    savingsRate: {
      current: 8,
      target: 50,
      emergencyFund: 35,
    },
    spendingCategories: [
      { category: "EMI & Loans", value: 28, color: "#ef4444" },
      { category: "Food & Groceries", value: 22, color: "#f59e0b" },
      { category: "Utilities", value: 15, color: "#fb923c" },
      { category: "Cash Withdrawals", value: 18, color: "#ea580c" },
      { category: "Transportation", value: 10, color: "#0ea5e9" },
      { category: "Others", value: 7, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 48, color: "#ef4444" },
      { category: "Debt Repayment", value: 52, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 695 },
      { month: "Feb", score: 692 },
      { month: "Mar", score: 690 },
      { month: "Apr", score: 688 },
      { month: "May", score: 685 },
      { month: "Jun", score: 680 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 100, late: 0 },
      { month: "Feb", onTime: 100, late: 0 },
      { month: "Mar", onTime: 95, late: 5 },
      { month: "Apr", onTime: 90, late: 10 },
      { month: "May", onTime: 85, late: 15 },
      { month: "Jun", onTime: 70, late: 30 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "ATM Withdrawal",
        amount: -15000,
        type: "debit",
      },
      {
        date: "2026-02-13",
        description: "Credit Card Bill - Partial Payment",
        amount: -8000,
        type: "debit",
      },
      {
        date: "2026-02-10",
        description: "Utility Bill - Late Payment",
        amount: -3500,
        type: "debit",
      },
      {
        date: "2026-02-08",
        description: "ATM Withdrawal",
        amount: -12000,
        type: "debit",
      },
      {
        date: "2026-02-04",
        description: "Grocery Shopping",
        amount: -6000,
        type: "debit",
      },
    ],
    alerts: [
      {
        type: "critical",
        message: "Salary delayed by 12 days",
        date: "1 day ago",
      },
      {
        type: "warning",
        message: "Increased ATM withdrawals detected",
        date: "3 days ago",
      },
      {
        type: "warning",
        message: "Savings account balance declining rapidly",
        date: "5 days ago",
      },
    ],
  },

  // USR-003: Karan Patel - No flags (Low)
  "USR-003": {
    profile: {
      id: "USR-003",
      name: "Karan Patel",
      photo: null,
      creditScore: 750,
      creditScoreStatus: "Excellent",
      status: "Low",
      accountNumber: "ACC345678901",
      email: "karan.patel@email.com",
      phone: "+91 98765 43212",
      dateJoined: "Jan 2018",
      lastUpdated: "30 minutes ago",
    },
    financialSummary: {
      totalAssets: 850000,
      totalLiabilities: 180000,
      totalDebt: 120000,
      totalFaxCredits: 150000,
      netWorth: 670000,
      monthlyIncome: 75000,
      monthlyExpenses: 48000,
    },
    riskAssessment: {
      riskScore: "Low",
      riskPercentage: 15,
      stressLevel: "Low Stress",
      keyFactors: {
        behavioralRiskFactors: 12,
        highRiskEateries: 10,
        highRiskRepayment: "Low",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 75000, expenses: 46000 },
      { month: "Feb", income: 75000, expenses: 47000 },
      { month: "Mar", income: 75000, expenses: 48000 },
      { month: "Apr", income: 75000, expenses: 49000 },
      { month: "May", income: 75000, expenses: 47000 },
      { month: "Jun", income: 75000, expenses: 48000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 145000 },
      { month: "Feb", amount: 173000 },
      { month: "Mar", amount: 200000 },
      { month: "Apr", amount: 226000 },
      { month: "May", amount: 254000 },
      { month: "Jun", amount: 281000 },
    ],
    savingsRate: {
      current: 36,
      target: 50,
      emergencyFund: 80,
    },
    spendingCategories: [
      { category: "EMI & Loans", value: 20, color: "#0ea5e9" },
      { category: "Food & Groceries", value: 18, color: "#f59e0b" },
      { category: "Investments", value: 25, color: "#10b981" },
      { category: "Utilities", value: 12, color: "#fb923c" },
      { category: "Entertainment", value: 15, color: "#8b5cf6" },
      { category: "Others", value: 10, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 10, color: "#10b981" },
      { category: "Debt Repayment", value: 90, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 745 },
      { month: "Feb", score: 746 },
      { month: "Mar", score: 748 },
      { month: "Apr", score: 749 },
      { month: "May", score: 750 },
      { month: "Jun", score: 750 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 100, late: 0 },
      { month: "Feb", onTime: 100, late: 0 },
      { month: "Mar", onTime: 100, late: 0 },
      { month: "Apr", onTime: 100, late: 0 },
      { month: "May", onTime: 100, late: 0 },
      { month: "Jun", onTime: 100, late: 0 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "Salary Credit",
        amount: 75000,
        type: "credit",
      },
      {
        date: "2026-02-14",
        description: "EMI Payment - Auto Debit Success",
        amount: -15000,
        type: "debit",
      },
      {
        date: "2026-02-12",
        description: "Mutual Fund SIP",
        amount: -10000,
        type: "debit",
      },
      {
        date: "2026-02-10",
        description: "Credit Card Bill - Full Payment",
        amount: -12000,
        type: "debit",
      },
      {
        date: "2026-02-08",
        description: "Restaurant - Weekend Dining",
        amount: -3500,
        type: "debit",
      },
    ],
    alerts: [],
  },

  // USR-004: Divya Krishnan - Auto-debit failed 2 times (High)
  "USR-004": {
    profile: {
      id: "USR-004",
      name: "Divya Krishnan",
      photo: null,
      creditScore: 665,
      creditScoreStatus: "Fair",
      status: "High",
      accountNumber: "ACC456789012",
      email: "divya.krishnan@email.com",
      phone: "+91 98765 43213",
      dateJoined: "Sep 2019",
      lastUpdated: "1 hour ago",
    },
    financialSummary: {
      totalAssets: 380000,
      totalLiabilities: 290000,
      totalDebt: 220000,
      totalFaxCredits: 45000,
      netWorth: 90000,
      monthlyIncome: 48000,
      monthlyExpenses: 49000,
    },
    riskAssessment: {
      riskScore: "High",
      riskPercentage: 70,
      stressLevel: "High Stress",
      keyFactors: {
        behavioralRiskFactors: 65,
        highRiskEateries: 50,
        highRiskRepayment: "High",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 48000, expenses: 47000 },
      { month: "Feb", income: 48000, expenses: 48000 },
      { month: "Mar", income: 48000, expenses: 48500 },
      { month: "Apr", income: 48000, expenses: 49000 },
      { month: "May", income: 48000, expenses: 49500 },
      { month: "Jun", income: 48000, expenses: 49000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 52000 },
      { month: "Feb", amount: 53000 },
      { month: "Mar", amount: 52500 },
      { month: "Apr", amount: 51500 },
      { month: "May", amount: 50000 },
      { month: "Jun", amount: 49000 },
    ],
    savingsRate: {
      current: 2,
      target: 50,
      emergencyFund: 25,
    },
    spendingCategories: [
      { category: "EMI & Loans", value: 32, color: "#ef4444" },
      { category: "Food & Groceries", value: 20, color: "#f59e0b" },
      { category: "Utilities", value: 14, color: "#fb923c" },
      { category: "Transportation", value: 12, color: "#0ea5e9" },
      { category: "Cash Withdrawals", value: 15, color: "#ea580c" },
      { category: "Others", value: 7, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 55, color: "#ef4444" },
      { category: "Debt Repayment", value: 45, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 685 },
      { month: "Feb", score: 680 },
      { month: "Mar", score: 675 },
      { month: "Apr", score: 672 },
      { month: "May", score: 668 },
      { month: "Jun", score: 665 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 100, late: 0 },
      { month: "Feb", onTime: 95, late: 5 },
      { month: "Mar", onTime: 90, late: 10 },
      { month: "Apr", onTime: 85, late: 15 },
      { month: "May", onTime: 80, late: 20 },
      { month: "Jun", onTime: 75, late: 25 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "Auto-debit Failed - Insufficient Balance",
        amount: 0,
        type: "debit",
      },
      {
        date: "2026-02-13",
        description: "ATM Withdrawal",
        amount: -8000,
        type: "debit",
      },
      {
        date: "2026-02-10",
        description: "Auto-debit Failed - Insufficient Balance",
        amount: 0,
        type: "debit",
      },
      {
        date: "2026-02-08",
        description: "Utility Bill - Manual Payment",
        amount: -4500,
        type: "debit",
      },
      {
        date: "2026-02-05",
        description: "Salary Credit",
        amount: 48000,
        type: "credit",
      },
    ],
    alerts: [
      {
        type: "critical",
        message: "Auto-debit failed 2 times this month",
        date: "1 day ago",
      },
      {
        type: "warning",
        message: "Account balance frequently below minimum",
        date: "4 days ago",
      },
      {
        type: "warning",
        message: "Credit score declining steadily",
        date: "1 week ago",
      },
    ],
  },

  // USR-005: Rohit Singh - Credit utilisation above 90% (Medium)
  "USR-005": {
    profile: {
      id: "USR-005",
      name: "Rohit Singh",
      photo: null,
      creditScore: 640,
      creditScoreStatus: "Fair",
      status: "Medium",
      accountNumber: "ACC567890123",
      email: "rohit.singh@email.com",
      phone: "+91 98765 43214",
      dateJoined: "Apr 2020",
      lastUpdated: "3 hours ago",
    },
    financialSummary: {
      totalAssets: 420000,
      totalLiabilities: 340000,
      totalDebt: 280000,
      totalFaxCredits: 30000,
      netWorth: 80000,
      monthlyIncome: 55000,
      monthlyExpenses: 53000,
    },
    riskAssessment: {
      riskScore: "Medium",
      riskPercentage: 58,
      stressLevel: "Medium Stress",
      keyFactors: {
        behavioralRiskFactors: 55,
        highRiskEateries: 48,
        highRiskRepayment: "Medium",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 55000, expenses: 50000 },
      { month: "Feb", income: 55000, expenses: 51000 },
      { month: "Mar", income: 55000, expenses: 52000 },
      { month: "Apr", income: 55000, expenses: 52500 },
      { month: "May", income: 55000, expenses: 53000 },
      { month: "Jun", income: 55000, expenses: 53000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 48000 },
      { month: "Feb", amount: 52000 },
      { month: "Mar", amount: 55000 },
      { month: "Apr", amount: 57500 },
      { month: "May", amount: 59500 },
      { month: "Jun", amount: 61500 },
    ],
    savingsRate: {
      current: 4,
      target: 50,
      emergencyFund: 22,
    },
    spendingCategories: [
      { category: "Credit Card Payments", value: 38, color: "#ef4444" },
      { category: "EMI & Loans", value: 22, color: "#f59e0b" },
      { category: "Food & Groceries", value: 15, color: "#fb923c" },
      { category: "Online Shopping", value: 12, color: "#ea580c" },
      { category: "Entertainment", value: 8, color: "#8b5cf6" },
      { category: "Others", value: 5, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 62, color: "#ef4444" },
      { category: "Debt Repayment", value: 38, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 670 },
      { month: "Feb", score: 665 },
      { month: "Mar", score: 658 },
      { month: "Apr", score: 652 },
      { month: "May", score: 645 },
      { month: "Jun", score: 640 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 100, late: 0 },
      { month: "Feb", onTime: 95, late: 5 },
      { month: "Mar", onTime: 90, late: 10 },
      { month: "Apr", onTime: 85, late: 15 },
      { month: "May", onTime: 80, late: 20 },
      { month: "Jun", onTime: 78, late: 22 },
    ],
    recentTransactions: [
      {
        date: "2026-02-14",
        description: "Credit Card Payment - Minimum Due",
        amount: -5000,
        type: "debit",
      },
      {
        date: "2026-02-12",
        description: "Online Shopping - Electronics",
        amount: -18000,
        type: "debit",
      },
      {
        date: "2026-02-10",
        description: "Credit Card Payment - Minimum Due",
        amount: -4500,
        type: "debit",
      },
      {
        date: "2026-02-08",
        description: "Restaurant & Entertainment",
        amount: -6500,
        type: "debit",
      },
      {
        date: "2026-02-05",
        description: "Salary Credit",
        amount: 55000,
        type: "credit",
      },
    ],
    alerts: [
      {
        type: "warning",
        message: "Credit utilisation above 90%",
        date: "2 days ago",
      },
      {
        type: "warning",
        message: "Only minimum credit card payments detected",
        date: "5 days ago",
      },
      {
        type: "info",
        message: "High spending on discretionary categories",
        date: "1 week ago",
      },
    ],
  },

  // Continue with remaining users...
  // I'll create users 6-100 with varied profiles

  // USR-006 through USR-012 remain as in your original data...

  "USR-006": {
    profile: {
      id: "USR-006",
      name: "Ananya Das",
      photo: null,
      creditScore: 765,
      creditScoreStatus: "Excellent",
      status: "Low",
      accountNumber: "ACC678901234",
      email: "ananya.das@email.com",
      phone: "+91 98765 43215",
      dateJoined: "Feb 2019",
      lastUpdated: "45 minutes ago",
    },
    financialSummary: {
      totalAssets: 920000,
      totalLiabilities: 150000,
      totalDebt: 95000,
      totalFaxCredits: 180000,
      netWorth: 770000,
      monthlyIncome: 82000,
      monthlyExpenses: 52000,
    },
    riskAssessment: {
      riskScore: "Low",
      riskPercentage: 12,
      stressLevel: "Low Stress",
      keyFactors: {
        behavioralRiskFactors: 8,
        highRiskEateries: 5,
        highRiskRepayment: "Low",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 82000, expenses: 50000 },
      { month: "Feb", income: 82000, expenses: 51000 },
      { month: "Mar", income: 82000, expenses: 52000 },
      { month: "Apr", income: 82000, expenses: 51500 },
      { month: "May", income: 82000, expenses: 52500 },
      { month: "Jun", income: 82000, expenses: 52000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 195000 },
      { month: "Feb", amount: 226000 },
      { month: "Mar", amount: 256000 },
      { month: "Apr", amount: 286500 },
      { month: "May", amount: 316000 },
      { month: "Jun", amount: 346000 },
    ],
    savingsRate: {
      current: 37,
      target: 50,
      emergencyFund: 85,
    },
    spendingCategories: [
      { category: "Investments", value: 30, color: "#10b981" },
      { category: "EMI & Loans", value: 15, color: "#0ea5e9" },
      { category: "Food & Groceries", value: 18, color: "#f59e0b" },
      { category: "Healthcare", value: 12, color: "#8b5cf6" },
      { category: "Entertainment", value: 15, color: "#fb923c" },
      { category: "Others", value: 10, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 8, color: "#10b981" },
      { category: "Debt Repayment", value: 92, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 760 },
      { month: "Feb", score: 761 },
      { month: "Mar", score: 762 },
      { month: "Apr", score: 763 },
      { month: "May", score: 764 },
      { month: "Jun", score: 765 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 100, late: 0 },
      { month: "Feb", onTime: 100, late: 0 },
      { month: "Mar", onTime: 100, late: 0 },
      { month: "Apr", onTime: 100, late: 0 },
      { month: "May", onTime: 100, late: 0 },
      { month: "Jun", onTime: 100, late: 0 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "Salary Credit",
        amount: 82000,
        type: "credit",
      },
      {
        date: "2026-02-14",
        description: "Mutual Fund SIP",
        amount: -15000,
        type: "debit",
      },
      {
        date: "2026-02-13",
        description: "EMI Payment - Auto Debit Success",
        amount: -12000,
        type: "debit",
      },
      {
        date: "2026-02-11",
        description: "Credit Card Bill - Full Payment",
        amount: -18000,
        type: "debit",
      },
      {
        date: "2026-02-09",
        description: "Healthcare - Insurance Premium",
        amount: -8000,
        type: "debit",
      },
    ],
    alerts: [],
  },

  "USR-007": {
    profile: {
      id: "USR-007",
      name: "Vikram Joshi",
      photo: null,
      creditScore: 655,
      creditScoreStatus: "Fair",
      status: "Critical",
      accountNumber: "ACC789012345",
      email: "vikram.joshi@email.com",
      phone: "+91 98765 43216",
      dateJoined: "Jul 2018",
      lastUpdated: "2 hours ago",
    },
    financialSummary: {
      totalAssets: 280000,
      totalLiabilities: 320000,
      totalDebt: 260000,
      totalFaxCredits: 25000,
      netWorth: -40000,
      monthlyIncome: 42000,
      monthlyExpenses: 54000,
    },
    riskAssessment: {
      riskScore: "Critical",
      riskPercentage: 88,
      stressLevel: "Critical Stress",
      keyFactors: {
        behavioralRiskFactors: 82,
        highRiskEateries: 70,
        highRiskRepayment: "Critical",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 42000, expenses: 50000 },
      { month: "Feb", income: 42000, expenses: 52000 },
      { month: "Mar", income: 42000, expenses: 53000 },
      { month: "Apr", income: 42000, expenses: 54000 },
      { month: "May", income: 42000, expenses: 55000 },
      { month: "Jun", income: 42000, expenses: 54000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 68000 },
      { month: "Feb", amount: 58000 },
      { month: "Mar", amount: 47000 },
      { month: "Apr", amount: 35000 },
      { month: "May", amount: 22000 },
      { month: "Jun", amount: 10000 },
    ],
    savingsRate: {
      current: -28,
      target: 50,
      emergencyFund: 5,
    },
    spendingCategories: [
      { category: "EMI & Loans", value: 40, color: "#ef4444" },
      { category: "Lending Apps", value: 22, color: "#dc2626" },
      { category: "Cash Withdrawals", value: 15, color: "#ea580c" },
      { category: "Food & Groceries", value: 12, color: "#f59e0b" },
      { category: "Utilities", value: 8, color: "#fb923c" },
      { category: "Others", value: 3, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 75, color: "#ef4444" },
      { category: "Debt Repayment", value: 25, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 685 },
      { month: "Feb", score: 678 },
      { month: "Mar", score: 670 },
      { month: "Apr", score: 665 },
      { month: "May", score: 660 },
      { month: "Jun", score: 655 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 90, late: 10 },
      { month: "Feb", onTime: 80, late: 20 },
      { month: "Mar", onTime: 70, late: 30 },
      { month: "Apr", onTime: 65, late: 35 },
      { month: "May", onTime: 55, late: 45 },
      { month: "Jun", onTime: 45, late: 55 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "Emergency Loan - PaySense",
        amount: -25000,
        type: "debit",
      },
      {
        date: "2026-02-13",
        description: "ATM Withdrawal - Multiple",
        amount: -15000,
        type: "debit",
      },
      {
        date: "2026-02-11",
        description: "Quick Loan - CASHe",
        amount: -10000,
        type: "debit",
      },
      {
        date: "2026-02-09",
        description: "EMI Payment - Partial",
        amount: -8000,
        type: "debit",
      },
      {
        date: "2026-02-05",
        description: "Salary Credit",
        amount: 42000,
        type: "credit",
      },
    ],
    alerts: [
      {
        type: "critical",
        message: "Savings depleted below threshold",
        date: "1 day ago",
      },
      {
        type: "critical",
        message: "Net worth turned negative",
        date: "3 days ago",
      },
      {
        type: "warning",
        message: "Multiple lending app transfers detected",
        date: "5 days ago",
      },
    ],
  },

  "USR-008": {
    profile: {
      id: "USR-008",
      name: "Meera Pillai",
      photo: null,
      creditScore: 670,
      creditScoreStatus: "Fair",
      status: "Medium",
      accountNumber: "ACC890123456",
      email: "meera.pillai@email.com",
      phone: "+91 98765 43217",
      dateJoined: "Nov 2019",
      lastUpdated: "4 hours ago",
    },
    financialSummary: {
      totalAssets: 480000,
      totalLiabilities: 240000,
      totalDebt: 165000,
      totalFaxCredits: 85000,
      netWorth: 240000,
      monthlyIncome: 58000,
      monthlyExpenses: 52000,
    },
    riskAssessment: {
      riskScore: "Medium",
      riskPercentage: 52,
      stressLevel: "Medium Stress",
      keyFactors: {
        behavioralRiskFactors: 58,
        highRiskEateries: 35,
        highRiskRepayment: "Medium",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 58000, expenses: 48000 },
      { month: "Feb", income: 58000, expenses: 49000 },
      { month: "Mar", income: 58000, expenses: 50000 },
      { month: "Apr", income: 58000, expenses: 51000 },
      { month: "May", income: 58000, expenses: 52000 },
      { month: "Jun", income: 58000, expenses: 52000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 95000 },
      { month: "Feb", amount: 104000 },
      { month: "Mar", amount: 112000 },
      { month: "Apr", amount: 119000 },
      { month: "May", amount: 125000 },
      { month: "Jun", amount: 131000 },
    ],
    savingsRate: {
      current: 10,
      target: 50,
      emergencyFund: 45,
    },
    spendingCategories: [
      { category: "Cash Withdrawals", value: 28, color: "#ea580c" },
      { category: "EMI & Loans", value: 22, color: "#ef4444" },
      { category: "Food & Groceries", value: 20, color: "#f59e0b" },
      { category: "Utilities", value: 12, color: "#fb923c" },
      { category: "Transportation", value: 10, color: "#0ea5e9" },
      { category: "Others", value: 8, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 42, color: "#ef4444" },
      { category: "Debt Repayment", value: 58, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 690 },
      { month: "Feb", score: 686 },
      { month: "Mar", score: 682 },
      { month: "Apr", score: 678 },
      { month: "May", score: 674 },
      { month: "Jun", score: 670 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 100, late: 0 },
      { month: "Feb", onTime: 95, late: 5 },
      { month: "Mar", onTime: 90, late: 10 },
      { month: "Apr", onTime: 88, late: 12 },
      { month: "May", onTime: 85, late: 15 },
      { month: "Jun", onTime: 82, late: 18 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "ATM Withdrawal",
        amount: -12000,
        type: "debit",
      },
      {
        date: "2026-02-13",
        description: "ATM Withdrawal",
        amount: -10000,
        type: "debit",
      },
      {
        date: "2026-02-11",
        description: "ATM Withdrawal",
        amount: -8000,
        type: "debit",
      },
      {
        date: "2026-02-09",
        description: "EMI Payment",
        amount: -15000,
        type: "debit",
      },
      {
        date: "2026-02-05",
        description: "Salary Credit",
        amount: 58000,
        type: "credit",
      },
    ],
    alerts: [
      {
        type: "warning",
        message: "Increased cash withdrawals detected",
        date: "1 day ago",
      },
      {
        type: "info",
        message: "Cash hoarding behavior pattern identified",
        date: "4 days ago",
      },
      {
        type: "info",
        message: "Credit score declining gradually",
        date: "1 week ago",
      },
    ],
  },

  "USR-009": {
    profile: {
      id: "USR-009",
      name: "Suresh Reddy",
      photo: null,
      creditScore: 735,
      creditScoreStatus: "Good",
      status: "Low",
      accountNumber: "ACC901234567",
      email: "suresh.reddy@email.com",
      phone: "+91 98765 43218",
      dateJoined: "May 2018",
      lastUpdated: "1 hour ago",
    },
    financialSummary: {
      totalAssets: 720000,
      totalLiabilities: 210000,
      totalDebt: 140000,
      totalFaxCredits: 120000,
      netWorth: 510000,
      monthlyIncome: 68000,
      monthlyExpenses: 46000,
    },
    riskAssessment: {
      riskScore: "Low",
      riskPercentage: 18,
      stressLevel: "Low Stress",
      keyFactors: {
        behavioralRiskFactors: 15,
        highRiskEateries: 12,
        highRiskRepayment: "Low",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 68000, expenses: 44000 },
      { month: "Feb", income: 68000, expenses: 45000 },
      { month: "Mar", income: 68000, expenses: 46000 },
      { month: "Apr", income: 68000, expenses: 45500 },
      { month: "May", income: 68000, expenses: 46500 },
      { month: "Jun", income: 68000, expenses: 46000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 128000 },
      { month: "Feb", amount: 151000 },
      { month: "Mar", amount: 173000 },
      { month: "Apr", amount: 195500 },
      { month: "May", amount: 217000 },
      { month: "Jun", amount: 239000 },
    ],
    savingsRate: {
      current: 32,
      target: 50,
      emergencyFund: 75,
    },
    spendingCategories: [
      { category: "Investments", value: 28, color: "#10b981" },
      { category: "EMI & Loans", value: 18, color: "#0ea5e9" },
      { category: "Food & Groceries", value: 20, color: "#f59e0b" },
      { category: "Utilities", value: 14, color: "#fb923c" },
      { category: "Entertainment", value: 12, color: "#8b5cf6" },
      { category: "Others", value: 8, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 12, color: "#10b981" },
      { category: "Debt Repayment", value: 88, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 730 },
      { month: "Feb", score: 731 },
      { month: "Mar", score: 732 },
      { month: "Apr", score: 733 },
      { month: "May", score: 734 },
      { month: "Jun", score: 735 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 100, late: 0 },
      { month: "Feb", onTime: 100, late: 0 },
      { month: "Mar", onTime: 100, late: 0 },
      { month: "Apr", onTime: 100, late: 0 },
      { month: "May", onTime: 100, late: 0 },
      { month: "Jun", onTime: 100, late: 0 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "Salary Credit",
        amount: 68000,
        type: "credit",
      },
      {
        date: "2026-02-14",
        description: "PPF Investment",
        amount: -12000,
        type: "debit",
      },
      {
        date: "2026-02-13",
        description: "EMI Payment - Auto Debit Success",
        amount: -13000,
        type: "debit",
      },
      {
        date: "2026-02-11",
        description: "Credit Card Bill - Full Payment",
        amount: -14000,
        type: "debit",
      },
      {
        date: "2026-02-09",
        description: "Grocery Shopping",
        amount: -5500,
        type: "debit",
      },
    ],
    alerts: [],
  },

  "USR-010": {
    profile: {
      id: "USR-010",
      name: "Kavita Sharma",
      photo: null,
      creditScore: 635,
      creditScoreStatus: "Fair",
      status: "High",
      accountNumber: "ACC012345678",
      email: "kavita.sharma@email.com",
      phone: "+91 98765 43219",
      dateJoined: "Aug 2020",
      lastUpdated: "2 hours ago",
    },
    financialSummary: {
      totalAssets: 350000,
      totalLiabilities: 410000,
      totalDebt: 320000,
      totalFaxCredits: 35000,
      netWorth: -60000,
      monthlyIncome: 44000,
      monthlyExpenses: 56000,
    },
    riskAssessment: {
      riskScore: "High",
      riskPercentage: 78,
      stressLevel: "High Stress",
      keyFactors: {
        behavioralRiskFactors: 80,
        highRiskEateries: 65,
        highRiskRepayment: "High",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 44000, expenses: 52000 },
      { month: "Feb", income: 44000, expenses: 54000 },
      { month: "Mar", income: 44000, expenses: 55000 },
      { month: "Apr", income: 44000, expenses: 56000 },
      { month: "May", income: 44000, expenses: 57000 },
      { month: "Jun", income: 44000, expenses: 56000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 42000 },
      { month: "Feb", amount: 34000 },
      { month: "Mar", amount: 23000 },
      { month: "Apr", amount: 11000 },
      { month: "May", amount: -2000 },
      { month: "Jun", amount: -14000 },
    ],
    savingsRate: {
      current: -27,
      target: 50,
      emergencyFund: 8,
    },
    spendingCategories: [
      { category: "Lending Apps", value: 32, color: "#dc2626" },
      { category: "EMI & Loans", value: 28, color: "#ef4444" },
      { category: "Food & Groceries", value: 16, color: "#f59e0b" },
      { category: "Cash Withdrawals", value: 12, color: "#ea580c" },
      { category: "Utilities", value: 8, color: "#fb923c" },
      { category: "Others", value: 4, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 70, color: "#ef4444" },
      { category: "Debt Repayment", value: 30, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 665 },
      { month: "Feb", score: 658 },
      { month: "Mar", score: 650 },
      { month: "Apr", score: 645 },
      { month: "May", score: 640 },
      { month: "Jun", score: 635 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 85, late: 15 },
      { month: "Feb", onTime: 75, late: 25 },
      { month: "Mar", onTime: 70, late: 30 },
      { month: "Apr", onTime: 65, late: 35 },
      { month: "May", onTime: 60, late: 40 },
      { month: "Jun", onTime: 55, late: 45 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "Instant Loan - MoneyView",
        amount: -15000,
        type: "debit",
      },
      {
        date: "2026-02-14",
        description: "Quick Cash - KreditBee",
        amount: -12000,
        type: "debit",
      },
      {
        date: "2026-02-12",
        description: "PaySense Transfer",
        amount: -10000,
        type: "debit",
      },
      {
        date: "2026-02-10",
        description: "CASHe Loan App",
        amount: -8000,
        type: "debit",
      },
      {
        date: "2026-02-05",
        description: "Salary Credit",
        amount: 44000,
        type: "credit",
      },
    ],
    alerts: [
      {
        type: "critical",
        message: "Multiple lending app transfers found",
        date: "1 day ago",
      },
      {
        type: "warning",
        message: "Debt stacking pattern detected",
        date: "3 days ago",
      },
      {
        type: "warning",
        message: "Account balance turned negative",
        date: "5 days ago",
      },
    ],
  },

  "USR-011": {
    profile: {
      id: "USR-011",
      name: "Aditya Kumar",
      photo: null,
      creditScore: 745,
      creditScoreStatus: "Excellent",
      status: "Low",
      accountNumber: "ACC123450987",
      email: "aditya.kumar@email.com",
      phone: "+91 98765 43220",
      dateJoined: "Dec 2019",
      lastUpdated: "30 minutes ago",
    },
    financialSummary: {
      totalAssets: 680000,
      totalLiabilities: 195000,
      totalDebt: 125000,
      totalFaxCredits: 140000,
      netWorth: 485000,
      monthlyIncome: 72000,
      monthlyExpenses: 50000,
    },
    riskAssessment: {
      riskScore: "Low",
      riskPercentage: 14,
      stressLevel: "Low Stress",
      keyFactors: {
        behavioralRiskFactors: 10,
        highRiskEateries: 8,
        highRiskRepayment: "Low",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 72000, expenses: 48000 },
      { month: "Feb", income: 72000, expenses: 49000 },
      { month: "Mar", income: 72000, expenses: 50000 },
      { month: "Apr", income: 72000, expenses: 49500 },
      { month: "May", income: 72000, expenses: 50500 },
      { month: "Jun", income: 72000, expenses: 50000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 152000 },
      { month: "Feb", amount: 175000 },
      { month: "Mar", amount: 197000 },
      { month: "Apr", amount: 219500 },
      { month: "May", amount: 241000 },
      { month: "Jun", amount: 263000 },
    ],
    savingsRate: {
      current: 31,
      target: 50,
      emergencyFund: 78,
    },
    spendingCategories: [
      { category: "Investments", value: 26, color: "#10b981" },
      { category: "EMI & Loans", value: 17, color: "#0ea5e9" },
      { category: "Food & Groceries", value: 19, color: "#f59e0b" },
      { category: "Utilities", value: 13, color: "#fb923c" },
      { category: "Entertainment", value: 16, color: "#8b5cf6" },
      { category: "Others", value: 9, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 9, color: "#10b981" },
      { category: "Debt Repayment", value: 91, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 740 },
      { month: "Feb", score: 741 },
      { month: "Mar", score: 742 },
      { month: "Apr", score: 743 },
      { month: "May", score: 744 },
      { month: "Jun", score: 745 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 100, late: 0 },
      { month: "Feb", onTime: 100, late: 0 },
      { month: "Mar", onTime: 100, late: 0 },
      { month: "Apr", onTime: 100, late: 0 },
      { month: "May", onTime: 100, late: 0 },
      { month: "Jun", onTime: 100, late: 0 },
    ],
    recentTransactions: [
      {
        date: "2026-02-15",
        description: "Salary Credit",
        amount: 72000,
        type: "credit",
      },
      {
        date: "2026-02-14",
        description: "SIP - Mutual Funds",
        amount: -12000,
        type: "debit",
      },
      {
        date: "2026-02-13",
        description: "EMI Payment - Auto Debit Success",
        amount: -14000,
        type: "debit",
      },
      {
        date: "2026-02-11",
        description: "Credit Card Bill - Full Payment",
        amount: -16000,
        type: "debit",
      },
      {
        date: "2026-02-09",
        description: "Weekend Entertainment",
        amount: -4500,
        type: "debit",
      },
    ],
    alerts: [],
  },

  "USR-012": {
    profile: {
      id: "USR-012",
      name: "Neha Gupta",
      photo: null,
      creditScore: 660,
      creditScoreStatus: "Fair",
      status: "Medium",
      accountNumber: "ACC234561098",
      email: "neha.gupta@email.com",
      phone: "+91 98765 43221",
      dateJoined: "Oct 2019",
      lastUpdated: "3 hours ago",
    },
    financialSummary: {
      totalAssets: 390000,
      totalLiabilities: 270000,
      totalDebt: 200000,
      totalFaxCredits: 55000,
      netWorth: 120000,
      monthlyIncome: 49000,
      monthlyExpenses: 50000,
    },
    riskAssessment: {
      riskScore: "Medium",
      riskPercentage: 55,
      stressLevel: "Medium Stress",
      keyFactors: {
        behavioralRiskFactors: 52,
        highRiskEateries: 42,
        highRiskRepayment: "Medium",
      },
    },
    cashFlowData: [
      { month: "Jan", income: 49000, expenses: 48000 },
      { month: "Feb", income: 49000, expenses: 49000 },
      { month: "Mar", income: 49000, expenses: 50000 },
      { month: "Apr", income: 49000, expenses: 50500 },
      { month: "May", income: 49000, expenses: 51000 },
      { month: "Jun", income: 49000, expenses: 50000 },
    ],
    liquidityData: [
      { month: "Jan", amount: 62000 },
      { month: "Feb", amount: 63000 },
      { month: "Mar", amount: 62000 },
      { month: "Apr", amount: 60500 },
      { month: "May", amount: 58500 },
      { month: "Jun", amount: 57500 },
    ],
    savingsRate: {
      current: -2,
      target: 50,
      emergencyFund: 28,
    },
    spendingCategories: [
      { category: "EMI & Loans", value: 30, color: "#ef4444" },
      { category: "Food & Groceries", value: 22, color: "#f59e0b" },
      { category: "Utilities - UNPAID", value: 16, color: "#dc2626" },
      { category: "Transportation", value: 14, color: "#0ea5e9" },
      { category: "Healthcare", value: 10, color: "#8b5cf6" },
      { category: "Others", value: 8, color: "#64748b" },
    ],
    debtRepayment: [
      { category: "High Risk Categories", value: 50, color: "#ef4444" },
      { category: "Debt Repayment", value: 50, color: "#0ea5e9" },
    ],
    creditScoreHistory: [
      { month: "Jan", score: 685 },
      { month: "Feb", score: 680 },
      { month: "Mar", score: 675 },
      { month: "Apr", score: 670 },
      { month: "May", score: 665 },
      { month: "Jun", score: 660 },
    ],
    paymentHistory: [
      { month: "Jan", onTime: 95, late: 5 },
      { month: "Feb", onTime: 90, late: 10 },
      { month: "Mar", onTime: 85, late: 15 },
      { month: "Apr", onTime: 80, late: 20 },
      { month: "May", onTime: 75, late: 25 },
      { month: "Jun", onTime: 72, late: 28 },
    ],
    recentTransactions: [
      {
        date: "2026-02-14",
        description: "EMI Payment",
        amount: -16000,
        type: "debit",
      },
      {
        date: "2026-02-12",
        description: "Healthcare - Medical Bills",
        amount: -8500,
        type: "debit",
      },
      {
        date: "2026-02-10",
        description: "Grocery Shopping",
        amount: -5000,
        type: "debit",
      },
      {
        date: "2026-02-08",
        description: "Transportation - Fuel",
        amount: -4000,
        type: "debit",
      },
      {
        date: "2026-02-05",
        description: "Salary Credit",
        amount: 49000,
        type: "credit",
      },
    ],
    alerts: [
      {
        type: "warning",
        message: "Utility bills unpaid for 45 days",
        date: "2 days ago",
      },
      {
        type: "warning",
        message: "Late payment fee added to utility account",
        date: "5 days ago",
      },
      {
        type: "info",
        message: "Credit score declining trend detected",
        date: "1 week ago",
      },
    ],
  },

  // NEW USERS 13-100
  // I'll create 88 more users with varied profiles...
};

// Due to character limits, I need to continue this in multiple parts.
// Let me create a comprehensive function to generate the remaining users programmatically.

// Helper function to generate random user data
const generateUserData = (id, name, status, baseIncome, riskPercentage) => {
  const statusMap = {
    Critical: {
      creditScore: 630 + Math.random() * 40,
      expenseMultiplier: 1.15 + Math.random() * 0.15,
    },
    High: {
      creditScore: 660 + Math.random() * 40,
      expenseMultiplier: 1.05 + Math.random() * 0.1,
    },
    Medium: {
      creditScore: 640 + Math.random() * 60,
      expenseMultiplier: 0.95 + Math.random() * 0.1,
    },
    Low: {
      creditScore: 720 + Math.random() * 50,
      expenseMultiplier: 0.6 + Math.random() * 0.15,
    },
  };

  const config = statusMap[status];
  const creditScore = Math.round(config.creditScore);
  const monthlyExpenses = Math.round(baseIncome * config.expenseMultiplier);
  const assets = Math.round(baseIncome * (6 + Math.random() * 6)); // 6-12 months of income
  const debt = Math.round(baseIncome * (2 + Math.random() * 4)); // 2-6 months of income

  return {
    profile: {
      id,
      name,
      photo: null,
      creditScore,
      creditScoreStatus:
        creditScore >= 750 ? "Excellent" : creditScore >= 700 ? "Good" : "Fair",
      status,
      accountNumber: `ACC${Math.random().toString().slice(2, 14)}`,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      phone: `+91 ${98000 + Math.floor(Math.random() * 10000)} ${43000 + Math.floor(Math.random() * 1000)}`,
      dateJoined: ["Jan 2018", "Feb 2019", "Mar 2020", "Apr 2021"][
        Math.floor(Math.random() * 4)
      ],
      lastUpdated: [
        "30 minutes ago",
        "1 hour ago",
        "2 hours ago",
        "3 hours ago",
      ][Math.floor(Math.random() * 4)],
    },
    financialSummary: {
      totalAssets: Math.round(assets),
      totalLiabilities: Math.round(debt * 1.2),
      totalDebt: Math.round(debt),
      totalFaxCredits: Math.round(baseIncome * 1.2),
      netWorth: Math.round(assets - debt * 1.2),
      monthlyIncome: baseIncome,
      monthlyExpenses,
    },
    riskAssessment: {
      riskScore: status,
      riskPercentage,
      stressLevel:
        riskPercentage > 70
          ? "High Stress"
          : riskPercentage > 40
            ? "Medium Stress"
            : "Low Stress",
      keyFactors: {
        behavioralRiskFactors: Math.round(riskPercentage * 0.9),
        highRiskEateries: Math.round(riskPercentage * 0.7),
        highRiskRepayment:
          riskPercentage > 70 ? "High" : riskPercentage > 40 ? "Medium" : "Low",
      },
    },
    cashFlowData: [
      { month: "Jan", income: baseIncome, expenses: monthlyExpenses - 2000 },
      { month: "Feb", income: baseIncome, expenses: monthlyExpenses - 1000 },
      { month: "Mar", income: baseIncome, expenses: monthlyExpenses },
      { month: "Apr", income: baseIncome, expenses: monthlyExpenses + 500 },
      { month: "May", income: baseIncome, expenses: monthlyExpenses + 1000 },
      { month: "Jun", income: baseIncome, expenses: monthlyExpenses },
    ],
    liquidityData:
      status === "Low"
        ? [
            { month: "Jan", amount: Math.round(baseIncome * 1.5) },
            { month: "Feb", amount: Math.round(baseIncome * 1.8) },
            { month: "Mar", amount: Math.round(baseIncome * 2.1) },
            { month: "Apr", amount: Math.round(baseIncome * 2.4) },
            { month: "May", amount: Math.round(baseIncome * 2.7) },
            { month: "Jun", amount: Math.round(baseIncome * 3.0) },
          ]
        : [
            { month: "Jan", amount: Math.round(baseIncome * 1.0) },
            { month: "Feb", amount: Math.round(baseIncome * 0.9) },
            { month: "Mar", amount: Math.round(baseIncome * 0.8) },
            { month: "Apr", amount: Math.round(baseIncome * 0.7) },
            { month: "May", amount: Math.round(baseIncome * 0.5) },
            { month: "Jun", amount: Math.round(baseIncome * 0.4) },
          ],
    savingsRate: {
      current: Math.round(
        status === "Low"
          ? 30 + Math.random() * 10
          : status === "Medium"
            ? 5 + Math.random() * 10
            : -5 + Math.random() * 10,
      ),
      target: 50,
      emergencyFund: Math.round(
        status === "Low"
          ? 70 + Math.random() * 20
          : status === "Medium"
            ? 30 + Math.random() * 20
            : 10 + Math.random() * 15,
      ),
    },
    spendingCategories:
      status === "Critical" || status === "High"
        ? [
            {
              category: "EMI & Loans",
              value: 30 + Math.random() * 10,
              color: "#ef4444",
            },
            {
              category: "Lending Apps",
              value: 15 + Math.random() * 10,
              color: "#dc2626",
            },
            {
              category: "Food & Groceries",
              value: 18 + Math.random() * 5,
              color: "#f59e0b",
            },
            {
              category: "Cash Withdrawals",
              value: 10 + Math.random() * 8,
              color: "#ea580c",
            },
            {
              category: "Utilities",
              value: 10 + Math.random() * 5,
              color: "#fb923c",
            },
            {
              category: "Others",
              value: 5 + Math.random() * 5,
              color: "#64748b",
            },
          ]
        : [
            {
              category: "Investments",
              value: 25 + Math.random() * 10,
              color: "#10b981",
            },
            {
              category: "EMI & Loans",
              value: 15 + Math.random() * 8,
              color: "#0ea5e9",
            },
            {
              category: "Food & Groceries",
              value: 18 + Math.random() * 5,
              color: "#f59e0b",
            },
            {
              category: "Utilities",
              value: 12 + Math.random() * 5,
              color: "#fb923c",
            },
            {
              category: "Entertainment",
              value: 12 + Math.random() * 8,
              color: "#8b5cf6",
            },
            {
              category: "Others",
              value: 8 + Math.random() * 5,
              color: "#64748b",
            },
          ],
    debtRepayment: [
      {
        category: "High Risk Categories",
        value: riskPercentage * 0.8,
        color: riskPercentage > 50 ? "#ef4444" : "#10b981",
      },
      {
        category: "Debt Repayment",
        value: 100 - riskPercentage * 0.8,
        color: "#0ea5e9",
      },
    ],
    creditScoreHistory: [
      { month: "Jan", score: creditScore + 10 },
      { month: "Feb", score: creditScore + 8 },
      { month: "Mar", score: creditScore + 5 },
      { month: "Apr", score: creditScore + 3 },
      { month: "May", score: creditScore + 1 },
      { month: "Jun", score: creditScore },
    ],
    paymentHistory:
      status === "Low"
        ? [
            { month: "Jan", onTime: 100, late: 0 },
            { month: "Feb", onTime: 100, late: 0 },
            { month: "Mar", onTime: 100, late: 0 },
            { month: "Apr", onTime: 100, late: 0 },
            { month: "May", onTime: 100, late: 0 },
            { month: "Jun", onTime: 100, late: 0 },
          ]
        : [
            {
              month: "Jan",
              onTime: 95 - riskPercentage / 5,
              late: 5 + riskPercentage / 5,
            },
            {
              month: "Feb",
              onTime: 90 - riskPercentage / 4,
              late: 10 + riskPercentage / 4,
            },
            {
              month: "Mar",
              onTime: 85 - riskPercentage / 3,
              late: 15 + riskPercentage / 3,
            },
            {
              month: "Apr",
              onTime: 80 - riskPercentage / 3,
              late: 20 + riskPercentage / 3,
            },
            {
              month: "May",
              onTime: 75 - riskPercentage / 3,
              late: 25 + riskPercentage / 3,
            },
            {
              month: "Jun",
              onTime: 70 - riskPercentage / 3,
              late: 30 + riskPercentage / 3,
            },
          ],
    recentTransactions:
      status === "Critical" || status === "High"
        ? [
            {
              date: "2026-02-15",
              description: "Quick Loan App Transfer",
              amount: -Math.round(baseIncome * 0.3),
              type: "debit",
            },
            {
              date: "2026-02-13",
              description: "ATM Withdrawal",
              amount: -Math.round(baseIncome * 0.2),
              type: "debit",
            },
            {
              date: "2026-02-11",
              description: "EMI Payment - Partial",
              amount: -Math.round(baseIncome * 0.25),
              type: "debit",
            },
            {
              date: "2026-02-09",
              description: "Utility Bill - Late Fee",
              amount: -Math.round(baseIncome * 0.08),
              type: "debit",
            },
            {
              date: "2026-02-05",
              description: "Salary Credit",
              amount: baseIncome,
              type: "credit",
            },
          ]
        : [
            {
              date: "2026-02-15",
              description: "Salary Credit",
              amount: baseIncome,
              type: "credit",
            },
            {
              date: "2026-02-14",
              description: "Investment - SIP",
              amount: -Math.round(baseIncome * 0.15),
              type: "debit",
            },
            {
              date: "2026-02-13",
              description: "EMI Payment - Auto Debit Success",
              amount: -Math.round(baseIncome * 0.2),
              type: "debit",
            },
            {
              date: "2026-02-11",
              description: "Credit Card Bill - Full Payment",
              amount: -Math.round(baseIncome * 0.22),
              type: "debit",
            },
            {
              date: "2026-02-09",
              description: "Grocery Shopping",
              amount: -Math.round(baseIncome * 0.08),
              type: "debit",
            },
          ],
    alerts:
      status === "Critical"
        ? [
            {
              type: "critical",
              message: "High risk of default detected",
              date: "1 day ago",
            },
            {
              type: "warning",
              message: "Multiple missed payments",
              date: "3 days ago",
            },
            {
              type: "warning",
              message: "Lending app usage detected",
              date: "5 days ago",
            },
          ]
        : status === "High"
          ? [
              {
                type: "warning",
                message: "Payment delays detected",
                date: "2 days ago",
              },
              {
                type: "warning",
                message: "Credit utilization high",
                date: "5 days ago",
              },
            ]
          : status === "Medium"
            ? [
                {
                  type: "info",
                  message: "Minor payment delays",
                  date: "1 week ago",
                },
              ]
            : [],
  };
};

// Generate remaining users 13-100
const indianNames = [
  "Rajesh Venkat",
  "Lakshmi Iyer",
  "Sanjay Desai",
  "Pooja Chatterjee",
  "Amit Malhotra",
  "Deepa Nambiar",
  "Ravi Kulkarni",
  "Anjali Bose",
  "Manoj Saxena",
  "Shreya Kapoor",
  "Venkat Raman",
  "Nisha Agarwal",
  "Prakash Shetty",
  "Ramya Nair",
  "Harish Rao",
  "Swati Jain",
  "Krishna Murthy",
  "Priyanka Das",
  "Arun Pillai",
  "Megha Reddy",
  "Varun Chopra",
  "Kavya Menon",
  "Raj Kumar Singh",
  "Sneha Mishra",
  "Nikhil Varma",
  "Tanvi Bhatt",
  "Gopal Krishnan",
  "Preeti Shah",
  "Sunil Pandey",
  "Anu radha",
  "Vijay Bhat",
  "Ritu Arora",
  "Ashok Yadav",
  "Madhuri Naik",
  "Sanjiv Negi",
  "Pallavi Dutta",
  "Mohan Lal",
  "Shilpa Bansal",
  "Ajay Thakur",
  "Vidya Hegde",
  "Hemant Joshi",
  "Smitha Rao",
  "Ashish Patel",
  "Radhika Srinivas",
  "Pankaj Tiwari",
  "Archana Kaur",
  "Dinesh Pillai",
  "Neelam Choudhary",
  "Vivek Mehta",
  "Sarika Dubey",
  "Gaurav Singh",
  "Madhavi Nair",
  "Ramesh Gupta",
  "Aparna Menon",
  "Manish Verma",
  "Rekha Pillai",
  "Vinod Kumar",
  "Shalini Reddy",
  "Naveen Sharma",
  "Divya Nair",
  "Mukesh Agarwal",
  "Preethi Shenoy",
  "Sudhir Patil",
  "Bharti Jha",
  "Girish Murthy",
  "Sudha Rao",
  "Bala Krishna",
  "Nandini Patel",
  "Anil Deshmukh",
  "Geeta Iyer",
  "Ramesh Babu",
  "Shobha Nair",
  "Kishore Reddy",
  "Usha Menon",
  "Ranjan Kumar",
  "Lata Sharma",
  "Balaji Raman",
  "Padma Lakshmi",
  "Santosh Pillai",
  "Vani Reddy",
  "Murali Krishnan",
  "Savita Nair",
  "Praveen Shetty",
  "Jaya Lakshmi",
  "Naresh Rao",
  "Sumitra Iyer",
  "Venkatesan Pillai",
  "Pushpa Nair",
];

// Add remaining 88 users
let userIndex = 13;
for (let i = 0; i < 88; i++) {
  const userId = `USR-${String(userIndex).padStart(3, "0")}`;
  const name =
    indianNames[i % indianNames.length] +
    (i >= indianNames.length
      ? ` ${Math.floor(i / indianNames.length) + 1}`
      : "");

  // Distribute risk levels: 20% Critical, 25% High, 30% Medium, 25% Low
  let status, riskPercentage, baseIncome;
  const rand = Math.random();

  if (rand < 0.2) {
    status = "Critical";
    riskPercentage = 80 + Math.random() * 15;
    baseIncome = 35000 + Math.random() * 20000;
  } else if (rand < 0.45) {
    status = "High";
    riskPercentage = 65 + Math.random() * 15;
    baseIncome = 40000 + Math.random() * 25000;
  } else if (rand < 0.75) {
    status = "Medium";
    riskPercentage = 45 + Math.random() * 20;
    baseIncome = 45000 + Math.random() * 30000;
  } else {
    status = "Low";
    riskPercentage = 10 + Math.random() * 20;
    baseIncome = 60000 + Math.random() * 40000;
  }

  ALL_USERS_DATA[userId] = generateUserData(
    userId,
    name,
    status,
    Math.round(baseIncome),
    Math.round(riskPercentage),
  );
  userIndex++;
}

// Export for use in applications
export default ALL_USERS_DATA;

// Helper function to get user data by ID
export const getUserData = (userId) => {
  return ALL_USERS_DATA[userId] || null;
};

// Helper function to get all user IDs
export const getAllUserIds = () => {
  return Object.keys(ALL_USERS_DATA);
};

// Helper function to get users by status
export const getUsersByStatus = (status) => {
  return Object.entries(ALL_USERS_DATA)
    .filter(([_, data]) => data.profile.status === status)
    .map(([id, data]) => ({ id, ...data }));
};
