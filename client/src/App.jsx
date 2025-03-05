import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TeamMemberDashboard from "./components/TeamMemberDashboard";
import LoginPage from "./pages/Login";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<div className="text-center py-10">Welcome to TeamSync</div>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<TeamMemberDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
