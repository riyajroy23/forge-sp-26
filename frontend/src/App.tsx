import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import UserSetup from "./Pages/user-setup";
import Dashboard from "./Pages/dashboard";
import CompanyOverviewPage from "./Pages/company_overview";
import PrivateGroupDash from "./Pages/private_group_dash";
import CreatePrivateGrp from "./Pages/create_private_grp";
import CompanyMsgBoard from "./Pages/company_msg_board";
import CompanyPost from "./Pages/company_post";

import LaunchScreen from "./components/LaunchScreen";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function App() {
  const [showLaunch, setShowLaunch] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLaunch(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showLaunch) {
    return (
      <LaunchScreen onFinish={() => setShowLaunch(false)} duration={2000} />
    );
  }

  return (
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />

      <Route
        path="/*"
        element={
          <div className="min-h-screen">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 p-8">
                <Routes>
                  <Route path="/setup" element={<ProtectedRoute><UserSetup /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/company/:id" element={<ProtectedRoute><CompanyOverviewPage /></ProtectedRoute>} />
                  <Route path="/company_msgboard" element={<ProtectedRoute><CompanyMsgBoard /></ProtectedRoute>} />
                  <Route path="/companypost" element={<ProtectedRoute><CompanyPost /></ProtectedRoute>} />
                  {/* <Route path="/private_msg_dash" element={<ProtectedRoute><PrivateGroupDash /></ProtectedRoute>} />
                  <Route path="/createprivate_grp" element={<ProtectedRoute><CreatePrivateGrp /></ProtectedRoute>} /> */}
                  <Route path="/private_msg_dash" element={<PrivateGroupDash />} />
                  <Route path="/createprivate_grp" element={<CreatePrivateGrp />} />
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
