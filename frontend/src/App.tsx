import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import UserSetup from "./Pages/user-setup";
import ProfilePage from "./Pages/profile_page";
import CompanyOverviewPage from "./Pages/company_overview";
import PrivateGroupDash from "./Pages/private_group_dash";
import CreatePrivateGrp from "./Pages/create_private_grp";

import LaunchScreen from "./components/LaunchScreen";
import SignupPage from "./components/SignupPage";
import SigninPage from "./components/SigninPage";

import { Button } from "@/components/ui/button";

export default function App() {
  const [showLaunch, setShowLaunch] = useState(true);

  // auto-hide launch screen after duration
  useEffect(() => {
    const timer = setTimeout(() => setShowLaunch(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // show launch screen first
  if (showLaunch) {
    return (
      <LaunchScreen onFinish={() => setShowLaunch(false)} duration={2000} />
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Navigation (you can remove later) */}
      <div className="space-x-2">
        <Link to="/setup">
          <Button>User Setup</Button>
        </Link>
        <Link to="/profile">
          <Button>Profile</Button>
        </Link>
        <Link to="/company/1">
          <Button>Company</Button>
        </Link>
        <Link to="/signup">
          <Button>Signup</Button>
        </Link>
        <Link to="/signin">
          <Button>Signin</Button>
        </Link>
        <Link to="/private_msg_dash">
          <Button>Private Messages Dasboard</Button>
        </Link>
        <Link to="/createprivate_grp">
          <Button>Private Messages Dasboard</Button>
        </Link>
      </div>

      <Routes>
        {/* Auth routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />

        {/* Main app routes */}
        <Route path="/setup" element={<UserSetup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/company/:id" element={<CompanyOverviewPage />} />
        <Route path="/private_msg_dash" element={<PrivateGroupDash />} />
        <Route path="/createprivate_grp" element={<CreatePrivateGrp />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/signup" />} />
      </Routes>
    </div>
  );
}
