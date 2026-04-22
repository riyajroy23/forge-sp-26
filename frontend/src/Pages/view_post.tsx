import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft, BookText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import '@/components/PrivateGroupStyle.css';
import noresult from '@/assets/noresult.svg';

//Company Card component
import PublicQuestion from "@/components/PublicQuestion";
import PublicReply from "@/components/PublicReply";
import SmallPost from "@/components/SmallPost";

export default function ViewPost() {
  const { id = "1" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = getMockPublicPost(id);
  const posts = getMockPosts();
  const moreposts = getMockMorePosts();

  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter((r) => {
    const matchesSearch = r.questionTitle
      .toLowerCase()
      .includes(search.toLowerCase());


      
    return matchesSearch;
  })
  
  const filteredMorePosts = moreposts.filter((r) => {
    const matchesSearch = r.questionTitle
      .toLowerCase()
      .includes(search.toLowerCase());


      
    return matchesSearch;
  })

  ;

  const filteredReplies = post.responses.filter((r) => {
    const matchesSearch = r.user.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });
  return (
    // Clicking anywhere outside the dropdown closes it
    <div className="flex flex-col min-h-screen w-full">
      <div className=" flex-1 -m-8">
        <div className="font-spacegrotesk font-bold text-lg h-17 w-391 bg-gray-300 p-4 flex flex-col shrink-0 sticky top-32">
          <div className="flex flex-row gap-40">
             <div className="py-1">Re-Coop Public Forum</div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-210 pl-9 pr-3 py-2 text-sm border rounded-md
                            font-spacegrotesk focus:outline-none focus:ring-2
                            focus:ring-[var(--color-darkred)]/40"
                style={{ backgroundColor: "white" }}
              />
            </div>
            <button
              style={{ backgroundColor: "#B11D1D", color: "white" }}
              className=" bg-primary w-40 h-9 rounded shrink-0 flex items-center justify-center gap-3"
            >
              <BookText className="w-4 h-4 text-black shrink-0 flex items-start justify-start" />
              <p className="text-black font-spacegrotesk">My Posts</p>
            </button>
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
            <span className="text-sm font-spacegrotesk">Back</span>
          </button>

          {/* ── Post Browsing ────────────────────────────────────────────────── */}
          

          <div className="flex flex-col min-h-screen w-380">
            <div className="flex-1 overflow-y-auto bg-[var(--color-lightgrey)] p-8">
              
              

              {/* ── Replies ────────────────────────────────────────────────── */}
              <div className= "group-container gap-3">
               <div className= "group-container-sm gap-3">
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
                          <PublicQuestion key={r.id} post={r} />
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 py-4 text-center font-spacegrotesk">
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

                      <h1 className="py-6 headers text-3xl mt-2 text-left">Replies</h1>

                      {filteredReplies.length > 0 ? (
                        filteredReplies.map((r) => (
                          <PublicReply key={r.id} response={r} />
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 py-4 text-center font-spacegrotesk">
                          No posts match your search.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                </div>
              
            {/* ── Side bar post browsing ────────────────────────────────────────────────── */}
                      
                      
                        <Card className="rounded-xl border-0 shadow-sm bg-white w-280">
                          <CardContent className="p-6 flex flex-col gap-3">
                            {/* Search bar */}
            
                            {/* Major filter dropdown — stopPropagation keeps the outside-click handler from firing inside */}
                            <div
                              className="relative w-44"
                              onClick={(e) => e.stopPropagation()}
                            />
            
                            {/* Post list */}
                            <div className="flex flex-col gap-3">
                              {filteredMorePosts.length > 0 ? (
                                filteredMorePosts.map((r) => (
                                  <SmallPost key={r.id} post={r} />
                                ))
                              ) : (
                                <p className="text-sm text-gray-400 py-4 text-center font-spacegrotesk">
                                  No posts match your search.
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      
                      </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PublicPost {
  id: number;
  user: string;
  time: string;
  questionTitle: string;
  questionText: string;
  responsesCount: number;
  responses: PublicResponse[];
}



export interface PublicResponse {
  id: number;
  user: string;
  time: string;
  answer: string;
}

// ─── Mock data — replace getMockPosts with a real API call when backend is ready ──

function getMockPublicPost(_id: string): PublicPost {
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

function getMockPosts(): PublicPost[] {
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

function getMockMorePosts(): PublicPost[] {
  return [
    {
      id: 1,
      user: "Alexandra B",
      time: "2 hrs ago",
      questionTitle: "Does anyone want to form a group to practice behavioral interview questions?",
      questionText:
        "Any alumni who work for Company 1, what is the SWE interview process like? I'm trying to set up a group with some other students who are looking to apply for the next co-op cycle. I keep hearing the technical interviews are really difficult, so any advice on how to approach it would be really helpful!",
      responsesCount: 2,
      responses: [
        {
          id: 10,
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
