import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

//Company Card component
import QuestionCard from "@/components/ui/QuestionCard";

export default function CompanyMsgBoard() {
  const navigate = useNavigate();
  const posts = getMockPost();

  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter((r) => {
    const matchesSearch = r.questionTitle
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesSearch;
  });

  return (
    // Clicking anywhere outside the dropdown closes it
    <div
    //   className="flex flex-col min-h-screen w-screen"
    //   onClick={() => setIndustryDropdownOpen(false)}
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

          {/* ── Post Browsing ────────────────────────────────────────────────── */}
          <section className="mb-6">
            <h1 className="headers text-3xl mb-3 text-left">
              Company Message Board
            </h1>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md
                            font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                            focus:ring-[var(--color-darkred)]/40"
                  />
                </div>

                {/* Major filter dropdown — stopPropagation keeps the outside-click handler from firing inside */}
                <div
                  className="relative w-44"
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Post list */}
                <div className="flex flex-col gap-3">
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((r) => (
                      <QuestionCard key={r.id} post={r} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                      No posts match your search.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Post {
  id: number;
  user: string;
  time: string;
  questionTitle: string;
  questionText: string;
  responsesCount: number;
  responses: Responses[];
}

interface Responses {
  id: number;
  user: string;
  time: string;
  answer: string;
}

// ─── Mock data — replace getMockCompany with a real API call when backend is ready ──

function getMockPost(): Post[] {
  return [
    {
      id: 1,
      user: "Sophia A",
      time: "2 hrs ago",
      questionTitle: "Alumni from Company 1! Any advice on interviews?",
      questionText:
        "Any alumni who work for Company 1, what is the SWE interview process like? I'm trying to set up a group with some other students who are looking to apply for the next co-op cycle. I keep hearing the technical interviews are really difficult, so any advice on how to approach it would be really helpful!",
      responsesCount: 2,
      responses: [
        {
          id: 2,
          user: "Alyssa B",
          time: "10:30 am",
          answer:
            "Hi I'm an alumni working for Company 1! If you'd like, I can join your group and offer some advice.",
        },

        {
          id: 3,
          user: "Adam C",
          time: "10:30 am",
          answer:
            "I'm also looking at the SWE interview process for Company 1, do you think I could join your group?",
        },
      ],
    },

    {
      id: 4,
      user: "Ben C",
      time: "4 hrs ago",
      questionTitle: "Does anyone know how I can improve my portfolio?",
      questionText:
        "I'm trying to figure out which projects should be highlighted in my portfolio, if any alumni are willing to take a look at it I can send a copy over private messages.",
      responsesCount: 10,
      responses: [
        {
          id: 5,
          user: "Alyssa B",
          time: "10:30 am",
          answer:
            "Hi I'm an alumni working for Company 1! If you'd like, I can join your group and offer some advice.",
        },
        {
          id: 6,
          user: "Adam C",
          time: "10:30 am",
          answer:
            "Hi I'm an alumni working for Company 1! If you'd like, I can join your group and offer some advice.",
        },
      ],
    },

    {
      id: 7,
      user: "Colin H",
      time: "5 hrs ago",
      questionTitle:
        "Alumni who have done a co-op at Company 1 before working there, what was your experience like?",
      questionText:
        "I've heard that Company 1 has a high return rate for co-ops, so I was wondering what the experiences of anyone who had a co-op there before working there.",
      responsesCount: 3,
      responses: [
        {
          id: 8,
          user: "Alyssa B",
          time: "10:30 am",
          answer:
            "Hi I'm an alumni working for Company 1! If you'd like, I can join your group and offer some advice.",
        },
        {
          id: 9,
          user: "Adam C",
          time: "10:30 am",
          answer:
            "Hi I'm an alumni working for Company 1! If you'd like, I can join your group and offer some advice.",
        },
      ],
    },
  ];
}
