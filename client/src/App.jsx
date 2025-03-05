import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import TeamMemberDashboard from "./pages/TeamMemberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/Login";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  function login(username, password, asAdmin = false) {
    setIsLoggedIn(true);
    setIsAdmin(asAdmin);
  }

  function logout() {
    setIsLoggedIn(false);
    setIsAdmin(false);
  }

  // Authentication check for protected routes
  function AuthRedirect() {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    if (isAdmin) {
      return <Navigate to="/admin-dashboard" />;
    }

    return <Navigate to="/member-dashboard" />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={logout} />
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to={isAdmin ? "/admin-dashboard" : "/member-dashboard"} />
              ) : (
                <LoginPage onLogin={login} />
              )
            }
          />
          <Route path="/member-dashboard" element={isLoggedIn ? <TeamMemberDashboard /> : <Navigate to="/login" />} />
          <Route
            path="/admin-dashboard"
            element={
              isLoggedIn && isAdmin ? <AdminDashboard /> : <Navigate to={isLoggedIn ? "/member-dashboard" : "/login"} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
