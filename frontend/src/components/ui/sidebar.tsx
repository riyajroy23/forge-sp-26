import { Link } from "react-router-dom";
import { Button } from "./button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import dashboard from "@/assets/dashboard.png";
import groups    from "@/assets/group.png";
import chats    from "@/assets/chats.png";
import companies from "@/assets/companies.png";

const navItems = [
  { label: "Dashboard", icon: dashboard },
  { label: "Groups",    icon: groups },
  { label: "Chats",     icon: chats},
  { label: "Companies", icon: companies },
];



export default function Sidebar() {
  return (
    <div className="flex min-h-screen">
      <div className="w-32 bg-[#B11D1D] p-4 flex flex-col">
        <div className="flex flex-col gap-10">
          {navItems.map(({ label, icon }) => (
            <Button
              key={label}
              variant="ghost"
              style={{ color: "white" }}
              className="hover:bg-gray-800 flex flex-col items-center gap-1"
            >
              <img src={icon} alt={label} className="w-8 h-8 object-contain" />
              {label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-white p-8"></div>
    </div>
  );
}