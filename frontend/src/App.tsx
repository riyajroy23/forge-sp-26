import { Routes, Route, Link, Navigate } from "react-router-dom";
import UserSetup from "./pages/user-setup";
import ProfilePage from "./pages/profile_page";
// import CompanyBrowsing from ".pages/company_browsing";
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
        {/* <Link to="/companybrowsing">
          <Button>Companies</Button>
        </Link> */}
      </div>

      <Routes>
        <Route path="*" element={<Navigate to="/setup" />} />
        <Route path="/setup" element={<UserSetup />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="/companybrowsing" element={<Companies />} /> */}
      </Routes>
    </div>
  );
}
