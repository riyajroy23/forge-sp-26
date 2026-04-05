import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import UserSetup from "./Pages/user-setup";
import ProfilePage from "./Pages/profile_page";
import CompanyOverviewPage from "./Pages/company_overview";

import LaunchScreen from "./components/LaunchScreen";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const [showLaunch, setShowLaunch] = useState(true);

  // auto-hide launch screen after duration
  useEffect(() => {
    const timer = setTimeout(() => setShowLaunch(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // show launch screen first
  if (showLaunch) {
    return <LaunchScreen onFinish={() => setShowLaunch(false)} duration={2000} />;
  }

  return (
    <Routes>
      {/* public routes -- accessible without being logged in */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />

      {/* protected routes -- redirects to /signin if not logged in */}
      <Route path="/setup" element={<ProtectedRoute><UserSetup /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/company/:id" element={<ProtectedRoute><CompanyOverviewPage /></ProtectedRoute>} />

      {/* default redirect to signup */}
      <Route path="*" element={<Navigate to="/signup" />} />
    </Routes>
  );
}
