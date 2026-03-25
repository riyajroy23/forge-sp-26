import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import UserSetup from "./Pages/user-setup";
import Dashboard from "./Pages/dashboard";
import CompanyOverviewPage from "./Pages/company_overview";

import LaunchScreen from "./components/LaunchScreen";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";

import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function App() {
  const [showLaunch, setShowLaunch] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLaunch(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 Launch screen first
  if (showLaunch) {
    return <LaunchScreen onFinish={() => setShowLaunch(false)} duration={2000} />;
  }

  return (
    <Routes>
      {/* ================= AUTH ================= */}
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />

      {/* ================= APP LAYOUT ================= */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-8">
                <Routes>
                  <Route path="/setup" element={<UserSetup />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/company/:id" element={<CompanyOverviewPage />} />
                  <Route path="*" element={<Navigate to="/setup" />} />
                </Routes>
              </main>
            </div>
          </div>
        }
      />

      {/* default fallback */}
      <Route path="*" element={<Navigate to="/signup" />} />
    </Routes>
  );
}