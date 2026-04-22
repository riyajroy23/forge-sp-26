import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "./button";
import { UserPlus, X, Users } from "lucide-react";
import logo from "@/assets/logo2.png";
import friends from "@/assets/friends.png";
import share from "@/assets/share.png";
import settings from "@/assets/settings.png";
import { getToken, getUser } from "@/lib/auth";

const API_URL = "http://localhost:3000/api";

interface AppUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  major?: string;
}

export default function Navbar() {
  const [friendsPanelOpen, setFriendsPanelOpen] = useState(false);
  const [friendsList, setFriendsList] = useState<AppUser[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchFriends = useCallback(async () => {
    setLoadingFriends(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFriendsList(data.data?.friends ?? []);
      }
    } catch (e) {
      console.error("Navbar fetchFriends error:", e);
    } finally {
      setLoadingFriends(false);
    }
  }, []);

  // fetch when panel opens
  useEffect(() => {
    if (friendsPanelOpen) fetchFriends();
  }, [friendsPanelOpen, fetchFriends]);

  // close panel when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setFriendsPanelOpen(false);
      }
    };
    if (friendsPanelOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [friendsPanelOpen]);

  const removeFriend = async (friendId: number) => {
    try {
      const token = getToken();
      await fetch(`${API_URL}/friends/${friendId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setFriendsList((prev) => prev.filter((f) => f.id !== friendId));
    } catch (e) {
      console.error("Remove friend error:", e);
    }
  };

  const currentUser = getUser();
  const firstName = currentUser?.first_name ?? "there";

  const sideLinks = [
    { label: "Share", icon: share, to: "/share" },
    { label: "Settings", icon: settings, to: "/setup" },
  ];

  return (
    <nav
      style={{ backgroundColor: "black" }}
      className="flex justify-between items-center p-6 w-full sticky top-0 z-50"
    >
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/dashboard">
          <img
            src={logo}
            alt="MyApp Logo"
            className="pl-3 h-20 w-auto"
            style={{ imageRendering: "crisp-edges" }}
          />
        </Link>
      </div>

      <div className="flex items-center gap-3 ml-auto h-10">
        {/* Friends button — toggles panel */}
        <div className="relative" ref={panelRef}>
          <Button
            variant="outline"
            onClick={() => setFriendsPanelOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-white/30 bg-[#1a1a1a] hover:bg-gray-800 px-4 py-2 text-sm"
            style={{ color: "white" }}
          >
            <img src={friends} alt="Friends" className="h-4 w-4" />
            Friends
            {friendsList.length > 0 && (
              <span className="ml-1 bg-[#b11d1d] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                {friendsList.length}
              </span>
            )}
          </Button>

          {/* Friends dropdown panel */}
          {friendsPanelOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#b11d1d]" />
                  <span className="font-semibold text-gray-900 font-[var(--font-spacegrotesk)] text-sm">
                    My Friends
                  </span>
                </div>
                <button
                  onClick={() => setFriendsPanelOpen(false)}
                  className="text-gray-400 hover:text-gray-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Friends list */}
              <div className="max-h-72 overflow-y-auto">
                {loadingFriends ? (
                  <p className="text-sm text-gray-400 text-center py-6 font-[var(--font-spacegrotesk)]">
                    Loading...
                  </p>
                ) : friendsList.length === 0 ? (
                  <div className="flex flex-col items-center py-8 gap-2">
                    <UserPlus className="w-8 h-8 text-gray-300" />
                    <p className="text-sm text-gray-400 font-[var(--font-spacegrotesk)]">
                      No friends yet
                    </p>
                    <p className="text-xs text-gray-300 font-[var(--font-spacegrotesk)]">
                      Add friends from any profile or user list
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-50">
                    {friendsList.map((friend) => (
                      <li
                        key={friend.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition"
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-[#b11d1d]/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold text-[#b11d1d]">
                            {friend.first_name?.[0]}
                            {friend.last_name?.[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 font-[var(--font-spacegrotesk)] truncate">
                            {friend.first_name} {friend.last_name}
                          </p>
                          {friend.major && (
                            <p className="text-xs text-gray-400 truncate font-[var(--font-spacegrotesk)]">
                              {friend.major}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFriend(friend.id)}
                          className="text-gray-300 hover:text-red-400 transition shrink-0"
                          title="Remove friend"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Other nav buttons */}
        {sideLinks.map(({ label, icon, to }) => (
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

        {/* User greeting */}
        <Link to="/" className="flex items-center gap-3 px-10">
          <span style={{ color: "white" }} className="text-lg pr-2">
            Hi, {firstName}!
          </span>
          <div className="w-15 h-15 rounded-full bg-gray-500" />
        </Link>
      </div>
    </nav>
  );
}
