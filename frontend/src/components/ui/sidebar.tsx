import { Link } from "react-router-dom";
import { Button } from "./button";
import dashboard from "@/assets/dashboard.png";
import groups from "@/assets/group.png";
import chats from "@/assets/chats.png";
import companies from "@/assets/companies.png";

const navItems = [
  { label: "Dashboard", icon: dashboard, path: "/dashboard" },
  { label: "Companies", icon: companies, path: "/companybrowsing" },
  { label: "Groups",    icon: groups,    path: "/private_msg_dash" },
  { label: "Chats",     icon: chats,     path: "/chats" },
];

export default function Sidebar() {
  return (
    <div className="flex min-h-screen bg-[#B11D1D] pt-5 w-32">
      <div className="w-32 p-4 flex flex-col">
        <div className="flex flex-col gap-10 space-y-4">
          {navItems.map(({ label, icon, path }) => (
            <Link to={path} key={label} className="group">
              <Button
                variant="ghost"
                className="
                  !bg-transparent text-white w-full
                  flex flex-col items-center gap-1
                  transition-all duration-200 ease-in-out
                  hover:bg-white/10 hover:scale-105
                "
              >
                <img
                  src={icon}
                  alt={label}
                  className="
                    w-8 h-8 object-contain
                    transition-all duration-200
                    group-hover:scale-110 group-hover:opacity-90
                  "
                />

                <span
                  className="
                    text-sm
                    text-[#ffffff]
                    transition-all duration-200
                    group-hover:text-gray-200
                  "
                >
                  {label}
                </span>
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-white p-8"></div>
    </div>
  );
}