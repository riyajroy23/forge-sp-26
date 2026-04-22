import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Check } from "lucide-react";
import { getToken } from "@/lib/auth";

const API_URL = "http://localhost:3000/api";

// Profile page shows another user's profile.
// profileUserId would come from route params once this page is wired to real data.
const MOCK_PROFILE = {
  id: 99,
  first_name: "Sophia",
  last_name: "A",
  major: "Computer Science",
};

const ProfilePage = () => {
  const [user, setUser] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getMe();
        if (res.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const topBoxes = Array.from({ length: 6 });
  const [isFriend, setIsFriend] = useState(false);
  const [loading, setLoading] = useState(false);

  const addFriend = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/friends`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friend_id: MOCK_PROFILE.id }),
      });
      if (res.ok || res.status === 409) {
        setIsFriend(true);
      }
    } catch (e) {
      console.error("Add friend error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen">
      <div className="w-full h-20 bg-black"></div>

      <div className="flex flex-1">
        <div className="w-32 bg-[#B11D1D] p-4 flex flex-col">
          <div className="flex flex-col gap-4">
            {topBoxes.map((_, idx) => (
              <Card key={idx} className="h-20 w-full bg-white">
                <CardContent className="p-0" />
              </Card>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white p-8">
          <div className="flex items-center gap-4">
            <div className="w-36 h-36 rounded-full bg-gray-400" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-black">
                  {loading ? 'Loading...' : `${user?.first_name || 'Guest'} ${user?.last_name || ''}`}
                </h1>
                <BadgeIcon role={user?.role as string || user?.user_role as string} size={22} />
              </div>
              {user?.username && (
                <p className="text-sm text-gray-500 mt-0.5">@{user.username as string}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-36 h-36 rounded-full bg-gray-400" />

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold text-black font-[var(--font-spacegrotesk)]">
                Hello, {MOCK_PROFILE.first_name}
              </h1>
              {MOCK_PROFILE.major && (
                <p className="text-gray-500 font-[var(--font-spacegrotesk)]">{MOCK_PROFILE.major}</p>
              )}

              {/* Add Friend button */}
              <button
                onClick={() => !isFriend && addFriend()}
                disabled={loading || isFriend}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition font-[var(--font-spacegrotesk)] w-fit
                  ${isFriend
                    ? "border-green-400 text-green-600 bg-green-50 cursor-default"
                    : "border-[#b11d1d] text-[#b11d1d] hover:bg-red-50 disabled:opacity-50"
                  }`}
              >
                {isFriend ? (
                  <><Check className="w-4 h-4" /> Friends</>
                ) : (
                  <><UserPlus className="w-4 h-4" /> {loading ? "Adding..." : "Add Friend"}</>
                )}
              </button>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-6 w-[520px]">
            <div className="h-60 bg-gray-300"></div>
            <div className="h-60 bg-gray-300"></div>
            <div className="h-60 bg-gray-300"></div>
            <div className="h-60 bg-gray-300"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
