import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

//Company Card component
import QuestionCard from "@/components/ui/QuestionCard";
import ReplyCard from "@/components/ui/ReplyCard";

export default function CompanyPost() {
  const { id = "1" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = getMockPost(id);
  const posts = getMockPosts();

  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter((r) => {
    const matchesSearch = r.questionTitle
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesSearch;
  });

  const filteredReplies = post.responses.filter((r) => {
    const matchesSearch = r.user.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  return (
    // Clicking anywhere outside the dropdown closes it,
    <div className="flex flex-col min-h-screen w-screen"
    //   className="flex flex-col min-h-screen w-screen"
    //   onClick={() => setIndustryDropdownOpen(false)}
    >
      <div className="flex flex-1 -m-8">
        <div className="w-32 bg-[#1a1a1a] p-4 flex flex-col shrink-0">
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

          {/* ── Replies ────────────────────────────────────────────────── */}
          <section className="mb-6">
            <h1 className="headers text-3xl mb-3 text-left">Replies</h1>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">
                {/* Major filter dropdown — stopPropagation keeps the outside-click handler from firing inside */}
                <div
                  className="relative w-44"
                  onClick={(e) => e.stopPropagation()}
                />

                {/*  Question Post */}
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
                  {/*  Reply area */}
                  <div>
                    <Textarea
                      placeholder="Join the conversation..."
                      className="mt-1"
                    />
                    {/*  Replies List */}
                  </div>

                  {filteredReplies.length > 0 ? (
                    filteredReplies.map((r) => (
                      <ReplyCard key={r.id} response={r} />
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

interface Post {
  id: number;
  user: string;
  time: string;
  questionTitle: string;
  questionText: string;
  responsesCount: number;
  responses: Response[];
}

export interface Response {
  id: number;
  user: string;
  time: string;
  answer: string;
}

// ─── Mock data — replace getMockPosts with a real API call when backend is ready ──

function getMockPost(_id: string): Post {
  return {
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
        time: "42 min ago",
        answer:
          "Hi I'm an alumni working for Company 1! If you'd like, I can join your group and offer some advice.",
      },

      {
        id: 3,
        user: "Adam C",
        time: "1 hr ago",
        answer:
          "I'm also looking at the SWE interview process for Company 1, do you think I could join your group?",
      },
    ],
  };
}

function getMockPosts(): Post[] {
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
          time: "12:30 pm",
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
  ];
}
