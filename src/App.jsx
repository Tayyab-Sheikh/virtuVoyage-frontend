import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tours from "./pages/Tours";
import Dashboard from "./pages/Dashboard";
import GuideDashboard from "./pages/GuideDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MyRequests from "./pages/MyRequests";
import GuideRequests from "./pages/GuideRequests";
import Checkout from "./pages/Checkout";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tours" element={<Tours />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="tourist">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide-dashboard"
          element={
            <ProtectedRoute role="guide">
              <GuideDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute role="tourist">
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/guide-requests"
          element={
            <ProtectedRoute role="guide">
              <GuideRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="tourist">
              <Checkout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
