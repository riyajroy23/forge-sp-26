import { Routes, Route, Link, Navigate } from "react-router-dom";
import UserSetup from "./Pages/user-setup";
import ProfilePage from "./Pages/profile_page";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/ui/navbar";
import Sidebar from "@/components/ui/sidebar";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
            <div className="flex">  
      <Sidebar />
      <main className="ml-[0px] mt-[0px] p-8">
        <Routes>
          <Route path="*" element={<Navigate to="/setup" />} />
          <Route path="/setup" element={<UserSetup />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
    </div>
  );
}
