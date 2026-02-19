import React, { createContext, useContext, useState } from "react";

// ─────────────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────────────

export const INITIAL_EMPLOYEES = [
  {
    id: "EMP-001",
    name: "Rahul Sharma",
    role: "Senior Analyst",
    permission: "Admin",
    status: "Active",
    teamId: "TEAM-001",
    maxCases: 20,
    resolved: 34,
    avgResolutionHrs: 3.2,
    onLeave: false,
  },
  {
    id: "EMP-002",
    name: "Sneha Iyer",
    role: "Analyst",
    permission: "Analyst",
    status: "Active",
    teamId: "TEAM-001",
    maxCases: 15,
    resolved: 28,
    avgResolutionHrs: 4.1,
    onLeave: false,
  },
  {
    id: "EMP-003",
    name: "Amit Verma",
    role: "Analyst",
    permission: "Analyst",
    status: "Active",
    teamId: "TEAM-002",
    maxCases: 15,
    resolved: 21,
    avgResolutionHrs: 5.0,
    onLeave: false,
  },
  {
    id: "EMP-004",
    name: "Divya Rao",
    role: "Junior Analyst",
    permission: "View Only",
    status: "Active",
    teamId: "TEAM-002",
    maxCases: 10,
    resolved: 9,
    avgResolutionHrs: 7.3,
    onLeave: false,
  },
  {
    id: "EMP-005",
    name: "Karan Bose",
    role: "Senior Analyst",
    permission: "Senior Analyst",
    status: "Active",
    teamId: "TEAM-003",
    maxCases: 20,
    resolved: 40,
    avgResolutionHrs: 2.8,
    onLeave: false,
  },
  {
    id: "EMP-006",
    name: "Meena Pillai",
    role: "Analyst",
    permission: "Analyst",
    status: "Inactive",
    teamId: "TEAM-003",
    maxCases: 15,
    resolved: 15,
    avgResolutionHrs: 5.5,
    onLeave: true,
  },
];

export const INITIAL_TEAMS = [
  {
    id: "TEAM-001",
    name: "Alpha Squad",
    leadId: "EMP-001",
    note: "Handles Critical and High risk cases in North zone.",
  },
  {
    id: "TEAM-002",
    name: "Beta Unit",
    leadId: "EMP-003",
    note: "Focuses on Medium risk and auto-debit failure patterns.",
  },
  {
    id: "TEAM-003",
    name: "Gamma Force",
    leadId: "EMP-005",
    note: "Specialises in debt stacking and behavioural anomaly cases.",
  },
];

export const INITIAL_CUSTOMERS = [
  { id: "USR-001", name: "Aryan Mehta",    flag: true,  reason: "Missed 3 consecutive EMI payments",      flagType: "Payment Default",     assignTo: "Rahul Sharma", status: "Critical" },
  { id: "USR-002", name: "Priya Nair",     flag: true,  reason: "Salary delayed by 12 days",              flagType: "Income Irregularity", assignTo: "Sneha Iyer",   status: "High"     },
  { id: "USR-003", name: "Karan Patel",    flag: false, reason: "—",                                      flagType: "—",                   assignTo: "Unassigned",   status: "Low"      },
  { id: "USR-004", name: "Divya Krishnan", flag: true,  reason: "Auto-debit failed 2 times this month",   flagType: "Auto-debit Failure",  assignTo: "Amit Verma",   status: "High"     },
  { id: "USR-005", name: "Rohit Singh",    flag: true,  reason: "Credit utilisation above 90%",           flagType: "Credit Overuse",      assignTo: "Rahul Sharma", status: "Medium"   },
  { id: "USR-006", name: "Ananya Das",     flag: false, reason: "—",                                      flagType: "—",                   assignTo: "Unassigned",   status: "Low"      },
  { id: "USR-007", name: "Vikram Joshi",   flag: true,  reason: "Savings depleted below threshold",       flagType: "Savings Depletion",   assignTo: "Sneha Iyer",   status: "Critical" },
  { id: "USR-008", name: "Meera Pillai",   flag: true,  reason: "Increased cash withdrawals detected",    flagType: "Behavioural Anomaly", assignTo: "Amit Verma",   status: "Medium"   },
  { id: "USR-009", name: "Suresh Reddy",   flag: false, reason: "—",                                      flagType: "—",                   assignTo: "Unassigned",   status: "Low"      },
  { id: "USR-010", name: "Kavita Sharma",  flag: true,  reason: "Multiple lending app transfers found",   flagType: "Debt Stacking",       assignTo: "Rahul Sharma", status: "High"     },
  { id: "USR-011", name: "Aditya Kumar",   flag: false, reason: "—",                                      flagType: "—",                   assignTo: "Unassigned",   status: "Low"      },
  { id: "USR-012", name: "Neha Gupta",     flag: true,  reason: "Utility bills unpaid for 45 days",       flagType: "Bill Default",        assignTo: "Sneha Iyer",   status: "Medium"   },
];

// ─────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [customers,  setCustomers]  = useState(INITIAL_CUSTOMERS);
  const [employees,  setEmployees]  = useState(INITIAL_EMPLOYEES);
  const [teams,      setTeams]      = useState(INITIAL_TEAMS);

  // ── Assign a customer to an analyst ──────────────────────────
  const assignCustomer = (customerId, analystName) => {
    setCustomers((prev) =>
      prev.map((c) => c.id === customerId ? { ...c, assignTo: analystName } : c)
    );
  };

  // ── Update an employee field ─────────────────────────────────
  const updateEmployee = (empId, changes) => {
    setEmployees((prev) =>
      prev.map((e) => e.id === empId ? { ...e, ...changes } : e)
    );
  };

  // ── Add a brand-new employee ─────────────────────────────────
  const addEmployee = (emp) => {
    setEmployees((prev) => [...prev, emp]);
  };

  // ── Create a new team ────────────────────────────────────────
  const createTeam = (team) => {
    setTeams((prev) => [...prev, team]);
  };

  // ── Update team (name, lead, note) ──────────────────────────
  const updateTeam = (teamId, changes) => {
    setTeams((prev) =>
      prev.map((t) => t.id === teamId ? { ...t, ...changes } : t)
    );
  };

  // ── Move employee to a different team ───────────────────────
  const moveEmployeeToTeam = (empId, teamId) => {
    setEmployees((prev) =>
      prev.map((e) => e.id === empId ? { ...e, teamId } : e)
    );
  };

  // ── Derived: open case count per analyst name ────────────────
  const openCasesByAnalyst = customers.reduce((acc, c) => {
    if (c.assignTo && c.assignTo !== "Unassigned") {
      acc[c.assignTo] = (acc[c.assignTo] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <AppContext.Provider value={{
      customers,
      employees,
      teams,
      openCasesByAnalyst,
      assignCustomer,
      updateEmployee,
      addEmployee,
      createTeam,
      updateTeam,
      moveEmployeeToTeam,
    }}>
      {children}
    </AppContext.Provider>
  );
}

// ── Hook ────────────────────────────────────────────────────────
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used inside <AppProvider>");
  return ctx;
}
