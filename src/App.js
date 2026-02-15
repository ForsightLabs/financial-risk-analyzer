import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage";
import Navbar from "./components/navbar";
import Login from "./pages/login";
import Signup from "./pages/signup";
import CustomerProfile from "./pages/customer-profile"; // This is your customer profile page

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - no navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes - with navbar and sidebar */}
        <Route
          path="/*"
          element={
            <div
              style={{
                display: "flex",
                minHeight: "100vh",
                background: "#0d0f14",
              }}
            >
              <Navbar onCollapse={setSidebarCollapsed} />
              <div
                style={{
                  marginLeft: sidebarCollapsed ? "64px" : "240px",
                  flex: 1,
                  minWidth: 0,
                  transition: "margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <Routes>
                  {/* Dashboard/Homepage - shows customer list */}
                  <Route path="/" element={<Homepage />} />

                  {/* Customer Profile - shows individual customer details */}
                  <Route
                    path="/customer/:customerId"
                    element={<CustomerProfile />}
                  />

                  {/* Other routes */}
                  <Route
                    path="/customers"
                    element={
                      <div style={{ color: "white", padding: "40px" }}>
                        Customers
                      </div>
                    }
                  />
                  <Route
                    path="/report"
                    element={
                      <div style={{ color: "white", padding: "40px" }}>
                        Reports
                      </div>
                    }
                  />
                  <Route
                    path="/interventions"
                    element={
                      <div style={{ color: "white", padding: "40px" }}>
                        Interventions
                      </div>
                    }
                  />
                  <Route
                    path="/alerts"
                    element={
                      <div style={{ color: "white", padding: "40px" }}>
                        Alerts
                      </div>
                    }
                  />
                  <Route
                    path="/model"
                    element={
                      <div style={{ color: "white", padding: "40px" }}>
                        Model Insights
                      </div>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <div style={{ color: "white", padding: "40px" }}>
                        Settings
                      </div>
                    }
                  />
                  <Route
                    path="/team"
                    element={
                      <div style={{ color: "white", padding: "40px" }}>
                        Team
                      </div>
                    }
                  />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
