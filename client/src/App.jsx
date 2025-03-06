import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { CURRENT_USER } from "./graphql/operations";
import Navbar from "./components/Navbar";
import TeamMemberDashboard from "./pages/TeamMemberDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/Login";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");

  // Check if user is logged in with token
  const { loading, error, data } = useQuery(CURRENT_USER, {
    skip: !localStorage.getItem("token"),
    fetchPolicy: "network-only", // Don't use cache for this query
    onCompleted: (data) => {
      if (data && data.me) {
        setIsLoggedIn(true);
        setIsAdmin(data.me.role === "Admin");
        setUsername(data.me.username);
      }
    },
    onError: () => {
      // If error, token might be invalid
      logout();
    },
  });

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  function login(username, asAdmin = false) {
    setIsLoggedIn(true);
    setIsAdmin(asAdmin);
    setUsername(username);
  }

  function logout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername("");
  }

  // Loading state
  if (loading && localStorage.getItem("token")) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} username={username} onLogout={logout} />
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
