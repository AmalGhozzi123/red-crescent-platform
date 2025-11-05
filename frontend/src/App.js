import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./components/dashboard/dashboard";
import Volunteers from "./components/volunteers/volunteers";
import Missions from "./components/missions/missions";
import Messages from "./components/messages/messages";
import Sidebar from "./components/sidebar/sidebar";

/* ✅ Composant qui protège les routes privées */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    // redirection vers login si pas connecté
    return <Navigate to="/" replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/"; // cache sidebar sur login

  return (
    <div style={{ display: "flex" }}>
      {!hideSidebar && <Sidebar />}
      <div style={{ marginLeft: hideSidebar ? "0" : "260px", flex: 1, padding: "40px" }}>
        <Routes>
          {/* ✅ Login accessible à tous */}
          <Route path="/" element={<Login />} />

          {/* ✅ Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/volunteers"
            element={
              <PrivateRoute>
                <Volunteers />
              </PrivateRoute>
            }
          />
          <Route
            path="/missions"
            element={
              <PrivateRoute>
                <Missions />
              </PrivateRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
