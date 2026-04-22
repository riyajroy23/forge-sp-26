import { Link } from "react-router-dom";
import { Button } from "./button";
import logo from "@/assets/logo2.png";
import friends from "@/assets/friends.png";
import share from "@/assets/share.png";
import settings from "@/assets/settings.png";

export default function Navbar() {
  const navButtons = [
    { label: "Friends", icon: friends, to: "/friends" },
    { label: "Share",   icon: share,   to: "/share" },
    { label: "Settings", icon: settings, to: "/setup" },
  ];

  return (
    <nav style={{ backgroundColor: "black" }} className="flex justify-between items-center p-6 w-full sticky top-0 z-50">
      <div className="flex items-center">
        <Link to="/dashboard">
          <img src={logo} alt="MyApp Logo" className="pl-3 h-20 w-auto" style={{ imageRendering: "crisp-edges" }} />
        </Link>
      </div>

      <div className="flex items-center gap-3 ml-auto h-10">
        {navButtons.map(({ label, icon, to }) => (
          <Link key={label} to={to}>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-full border border-white/30 bg-[#1a1a1a] hover:bg-gray-800 px-4 py-2 text-sm"
              style={{ color: "white" }}
            >
              <img src={icon} alt={label} className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}

        <Link to="/profile" className="flex items-center gap-2 px-10">
          <span style={{ color: "white" }} className="text-lg pr-2">
            Hi there, Riya!
          </span>
          <div className="w-8 h-8 rounded-full bg-gray-500" />
        </Link>
      </div>
    </nav>
  );
}
