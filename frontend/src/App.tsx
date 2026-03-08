import { Routes, Route, Link, Navigate } from "react-router-dom";
import UserSetup from "./Pages/user-setup";
import ProfilePage from "./Pages/profile_page";
import CompanyOverviewPage from "./Pages/company_overview";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="p-6 space-y-4">
      <div className="space-x-2">
        <Link to="/setup">
          <Button>User Setup</Button>
        </Link>
        <Link to="/profile">
          <Button>Profile</Button>
        </Link>
        <Link to="/company/1">
          <Button>Company Overview</Button>
        </Link>
      </div>

      <Routes>
        <Route path="*" element={<Navigate to="/setup" />} />
        <Route path="/setup" element={<UserSetup />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/company/:id" element={<CompanyOverviewPage />} />
      </Routes>
    </div>
  );
}