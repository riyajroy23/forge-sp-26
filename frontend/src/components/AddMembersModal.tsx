import { useState, useEffect, useCallback } from "react";
import { X, UserPlus, Check, Search } from "lucide-react";
import { getToken, getUser } from "@/lib/auth";

const API_URL = "http://localhost:3000/api";

interface AppUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  major?: string;
  area_of_interest?: string | string[];
}

interface AddMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMembers: number[];
  onMembersChange: (members: number[]) => void;
}

export default function AddMembersModal({
  isOpen,
  onClose,
  selectedMembers,
  onMembersChange,
}: AddMembersModalProps) {
  const [search, setSearch] = useState("");
  const [friends, setFriends] = useState<AppUser[]>([]);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingFriend, setAddingFriend] = useState<number | null>(null);
  const [friendIds, setFriendIds] = useState<Set<number>>(new Set());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const [friendsRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/friends`, { headers }),
        fetch(`${API_URL}/users`, { headers }),
      ]);

      if (friendsRes.ok) {
        const data = await friendsRes.json();
        const f: AppUser[] = data.data?.friends ?? [];
        setFriends(f);
        setFriendIds(new Set(f.map((u) => u.id)));
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setAllUsers(data.data?.users ?? []);
      }
    } catch (e) {
      console.error("AddMembersModal fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  const toggleMember = (userId: number) => {
    if (selectedMembers.includes(userId)) {
      onMembersChange(selectedMembers.filter((id) => id !== userId));
    } else {
      onMembersChange([...selectedMembers, userId]);
    }
  };

  const addFriend = async (userId: number) => {
    setAddingFriend(userId);
    try {
      const token = getToken();
      await fetch(`${API_URL}/friends`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_id: userId }),
      });
      await fetchData();
    } finally {
      setAddingFriend(null);
    }
  };

  const currentUser = getUser();
  const q = search.toLowerCase();

  const filteredFriends = friends.filter((u) =>
    `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
  );

  const filteredOthers = allUsers.filter(
    (u) =>
      u.id !== currentUser?.id &&
      !friendIds.has(u.id) &&
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold font-[var(--font-spacegrotesk)]">
            Add Members
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search people..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#b11d1d]/40
                         font-[var(--font-spacegrotesk)]"
            />
          </div>
        </div>

        {/* User lists */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-8 font-[var(--font-spacegrotesk)]">
              Loading...
            </p>
          ) : (
            <>
              {/* Friends section */}
              {filteredFriends.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 font-[var(--font-spacegrotesk)]">
                    Friends
                  </p>
                  <div className="flex flex-col gap-1">
                    {filteredFriends.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        isSelected={selectedMembers.includes(user.id)}
                        onToggle={() => toggleMember(user.id)}
                        isFriend
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All users section */}
              {(filteredOthers.length > 0 || filteredFriends.length === 0) && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 font-[var(--font-spacegrotesk)]">
                    All Users
                  </p>
                  <div className="flex flex-col gap-1">
                    {filteredOthers.length > 0 ? (
                      filteredOthers.map((user) => (
                        <UserRow
                          key={user.id}
                          user={user}
                          isSelected={selectedMembers.includes(user.id)}
                          onToggle={() => toggleMember(user.id)}
                          isFriend={false}
                          onAddFriend={() => addFriend(user.id)}
                          addingFriend={addingFriend === user.id}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 text-center py-4 font-[var(--font-spacegrotesk)]">
                        No users found.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-500 font-[var(--font-spacegrotesk)]">
            {selectedMembers.length} selected
          </span>
          <button
            onClick={onClose}
            className="my-button px-6 py-2 rounded text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── UserRow sub-component ──────────────────────────────────────────────────────

interface UserRowProps {
  user: AppUser;
  isSelected: boolean;
  onToggle: () => void;
  isFriend: boolean;
  onAddFriend?: () => void;
  addingFriend?: boolean;
}

function UserRow({
  user,
  isSelected,
  onToggle,
  isFriend,
  onAddFriend,
  addingFriend,
}: UserRowProps) {
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`;

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition
          ${isSelected ? "bg-[#b11d1d] border-[#b11d1d]" : "border-gray-300 bg-white"}`}
      >
        {isSelected && <Check className="w-3 h-3 text-white" />}
      </button>

      {/* Avatar */}
      <div
        onClick={onToggle}
        className="w-9 h-9 rounded-full bg-[#b11d1d]/10 flex items-center justify-center shrink-0"
      >
        <span className="text-sm font-semibold text-[#b11d1d]">{initials}</span>
      </div>

      {/* Name + major */}
      <div className="flex-1 min-w-0" onClick={onToggle}>
        <p className="text-sm font-semibold text-gray-900 font-[var(--font-spacegrotesk)]">
          {user.first_name} {user.last_name}
        </p>
        {user.major && (
          <p className="text-xs text-gray-400 truncate font-[var(--font-spacegrotesk)]">
            {user.major}
          </p>
        )}
      </div>

      {/* Add Friend button (only for non-friends) */}
      {!isFriend && onAddFriend && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddFriend();
          }}
          disabled={!!addingFriend}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border
                     border-[#b11d1d] text-[#b11d1d] hover:bg-red-50 transition
                     font-[var(--font-spacegrotesk)] shrink-0 disabled:opacity-50"
        >
          <UserPlus className="w-3 h-3" />
          {addingFriend ? "..." : "Add"}
        </button>
      )}

      {/* Friend badge */}
      {isFriend && (
        <span className="text-xs text-[#b11d1d] font-[var(--font-spacegrotesk)] shrink-0">
          Friend
        </span>
      )}
    </div>
  );
}
