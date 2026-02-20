import { Routes, Route, Link } from "react-router-dom";
import UserSetup from "./pages/user-setup";
import ProfilePage from "./Pages/profile_page";
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
      </div>

      <Routes>
        <Route path="/setup" element={<UserSetup />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}