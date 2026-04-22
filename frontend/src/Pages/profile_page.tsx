import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "../lib/api";
import BadgeIcon from "@/components/ui/BadgeIcon";

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
