import { Link } from "react-router-dom";
import { Button } from "./button";
import dashboard from "@/assets/dashboard.png";
import groups from "@/assets/group.png";
import chats from "@/assets/chats.png";
import companies from "@/assets/companies.png";

const navItems = [
  { label: "Dashboard", icon: dashboard, path: "/dashboard" },
  { label: "Companies", icon: companies, path: "/company/1" },
  { label: "Groups",    icon: groups,    path: "/groups" },
  { label: "Chats",     icon: chats,     path: "/chats" },
];

export default function Sidebar() {
  return (
    <div className="flex min-h-screen bg-[#B11D1D] pt-5 w-32">
      <div className="w-32 p-4 flex flex-col">
        <div className="flex flex-col gap-10 space-y-4">
          {navItems.map(({ label, icon, path }) => (
            <Link to={path} key={label}>
              <Button
                variant="ghost"
                style={{ color: "white" }}
                className="!bg-transparent hover:bg-gray-800 flex flex-col items-center gap-1 w-full"
              >
                <img src={icon} alt={label} className="w-8 h-8 object-contain" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white p-8"></div>
    </div>
  );
}