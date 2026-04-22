import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PrivateGroupCard from "@/components/PrivateGroupCard";
import PrivateDM from "@/components/PrivateDM";
import { getToken } from "@/lib/auth";

const API_URL = 'http://localhost:3000/api';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Group {
  id: number;
  title: string;
  date_created: string;
  members: string;
  description: string;
  date_joined: string;
}

export interface DM {
  id: number;
  username: string;
  last_msg: string;
}

export default function PrivateGroupDash() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // fetch all groups the current user is a member of
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${API_URL}/groups`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          setError('Failed to load groups.');
          return;
        }

        const data = await response.json();
        setGroups(data);

      } catch (err) {
        setError('Unable to connect to server.');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // remove group from list when user leaves it
  const handleLeave = (groupId: number) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  const filteredGroups = groups.filter((g) =>
    g.title?.toLowerCase().includes(search.toLowerCase())
  );

  // DMs are still mock data -- replace once DM endpoints are built
  const DMs: DM[] = [
    { id: 4, username: "Alanna W", last_msg: "I just shared the link to position at Company 4 I was ...." },
    { id: 5, username: "Alex H", last_msg: "Hey can you help me out with this one question....." },
    { id: 6, username: "Stacy M", last_msg: "I just shared the link to position at Company 4 I was ...." },
  ];

  const filteredDMs = DMs.filter((d) =>
    d.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top black navbar — placeholder */}
      <div className="flex flex-1">

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-lightgrey)] p-8">
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-[var(--font-spacegrotesk)]">Back</span>
          </button>

          <section className="mb-6">
            <h1 className="headers text-3xl mb-3 text-left">My Private Groups</h1>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">
                <div className="container">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-320 pl-9 pr-3 py-2 mr-10 text-sm border border-gray-200 rounded-md
                              font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                              focus:ring-[var(--color-darkred)]/40"
                    />
                    <button
                      onClick={() => navigate('/createprivate_grp')}
                      className="my-button w-25 h-10 rounded shrink-0 gap-2"
                    >
                      + Create
                    </button>
                  </div>
                </div>

                {/* error state */}
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                {/* loading state */}
                {loading ? (
                  <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                    Loading groups...
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredGroups.length > 0 ? (
                      filteredGroups.map((r) => (
                        <PrivateGroupCard key={r.id} group={r} onLeave={handleLeave} />
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                        No groups found.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          <h1 className="headers text-3xl mt-10 mb-10 text-left">Messages</h1>
          <div className="flex flex-col gap-3">
            {filteredDMs.length > 0 ? (
              filteredDMs.map((r) => <PrivateDM key={r.id} dm={r} />)
            ) : (
              <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                No users match your search.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}