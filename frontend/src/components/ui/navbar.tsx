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
    { label: "Settings",icon: settings, to: "/setup" },
  ];


  return (
    <nav style={{backgroundColor: "black"}} className="flex justify-between items-center p-6 w-full sticky top-0 z-50">

      <div className="flex items-center">
        <Link to="/profile">
          <img src={logo} alt="MyApp Logo" className="h-11 w-auto" style={{imageRendering: "crisp-edges"}} />
        </Link>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {navButtons.map(({ label, icon, to }) => (
          <Link key={label} to={to}>
            <Button
              variant="outline"
            className="flex items-center gap-2 rounded-full border border-white/30 bg-transparent hover:bg-gray-800 px-4 py-2 text-sm"
              style={{ color: "white" }}
            >
              <img src={icon} alt={label} className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      

        <Link to="/" className="flex items-center gap-3">
        <span style={{color: "white"}} className="text-sm font-medium">Hi, Becky!</span>
        <div className="w-10 h-10 rounded-full bg-gray-500" />  </Link>
      </div>
    </nav>
   
  );
}