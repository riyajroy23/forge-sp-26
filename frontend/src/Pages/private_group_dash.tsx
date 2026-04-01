import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

//Private Group Card component & Private DM component
import PrivateGroupCard from "@/components/PrivateGroupCard";
import PrivateDM from "@/components/PrivateDM";

export default function PrivateGroupDash() {
  const navigate = useNavigate();
  const groups = getMockGroup();
  const DMs = getMockDM();

  const [search, setSearch] = useState("");

  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.title.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const filteredDMs = DMs.filter((d) => {
    const matchesSearch = d.username
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesSearch;
  });

   const createNavigate = () => {
    
    // Navigate to a new route (e.g., '/home')
    navigate('./Pages/create_private_grp'); 
  };

  return (
    
    <div
      className="flex flex-col min-h-screen w-screen"
      
    >
      {/* Top black navbar — placeholder, matches profile_page.tsx */}
      <div className="w-full h-20 bg-black shrink-0" />

      <div className="flex flex-1">
        {/* Red sidebar — placeholder, matches profile_page.tsx */}
        <div className="w-32 bg-[#B11D1D] p-4 flex flex-col shrink-0">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-20 w-full bg-white">
                <CardContent className="p-0" />
              </Card>
            ))}
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-lightgrey)] p-8">
          {/* Back arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-[var(--font-spacegrotesk)]">
              Back
            </span>
          </button>

          {/* ── Private Group Dashboard ────────────────────────────────────────────────── */}
          <section className="mb-6">
            <h1 className="headers text-3xl mb-3 text-left">
              My Private Groups
            </h1>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">
                {/* Search bar */}
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
                   <button onClick={createNavigate} className="my-button w-25 h-10 rounded shrink-0 gap-2">
                      + Create
                    </button>
                    </div>
                </div>

                

                {/* Post list */}
                <div className="flex flex-col gap-3">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((r) => (
                      <PrivateGroupCard key={r.id} group={r} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                      No groups match your search.
                    </p>
                  )}
                </div>

               
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

// ─── Mock data — replace with a real API call when backend is ready ──

function getMockGroup(): Group[] {
  return [
    {
      id: 1,
      title: "Company 2 Chat w/ Alexa",
      date_created: "Created Feb 12th, 2026",
      members: "3 members",
      description: "Interview advice groupchat w/ Alumni Alexa from Company B!",
      date_joined: "You joined this group on May 12th, 2026",
    },

    {
      id: 2,
      title: "Mock Interview Group",
      date_created: "Created Mar 15th, 2026",
      members: "3 members",
      description: "Mock interview practice w/ Sam & Sarah.",
      date_joined: "You joined this group on Mar 15th, 2026",
    },

    {
      id: 3,
      title: "Company 3 SWE Interview Practice",
      date_created: "Created Dec 11th, 2025",
      members: "5 members",
      description:
        "Interview advice groupchat w/ other students applying for Company 3 SWE co-op.",
      date_joined: "You joined this group on Jan 24th, 2026",
    },
  ];
}

function getMockDM(): DM[] {
  return [
    {
      id: 4,
      username: "Alanna W",
      last_msg: "I just shared the link to position at Company 4 I was ....",
    },
    {
      id: 5,
      username: "Alex H",
      last_msg: "Hey can you help me out with this one question.....",
    },
    {
      id: 6,
      username: "Stacy M",
      last_msg: "I just shared the link to position at Company 4 I was ....",
    },
  ];
}
