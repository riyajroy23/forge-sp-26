import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Search, ChevronDown, ArrowLeft, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {ButtonGroup,} from "@/components/ui/button-group";
import {Table} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import RoleCard from "@/components/RoleCard";
import FAQItem from "@/components/FAQItem";
import { Button } from "@/components/ui/button";

export default function CompanyOverviewPage() {
  const { id = "1" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = getMockCompany(id);

  const [followed, setFollowed] = useState(false);
  const [majorFilter, setMajorFilter] = useState("All Majors");
  const [search, setSearch] = useState("");
  const [majorDropdownOpen, setMajorDropdownOpen] = useState(false);
  const [peopleDropdownOpen, setPeopleDropdownOpen] = useState(false);
  const [peopleFilter, setPeopleFilter] = useState("Alumni");
  const [activeTab, setActiveTab] = useState<"main" | "people" | "interviews">("main");

  const filteredRoles = company.roles.filter(r => {
    const matchesMajor = majorFilter === "All Majors" || r.majors.includes(majorFilter);
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchesMajor && matchesSearch;
  });
  const filteredPeople = company.companyPeople.filter(p => {
    const matchesStatus = peopleFilter === "All" || p.status === peopleFilter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  }
);

  return (
    // Clicking anywhere outside the dropdown closes it
    <div
      className="flex flex-col min-h-screen w-screen"
      onClick={() => {setMajorDropdownOpen(false);setPeopleDropdownOpen(false);
      }}
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
        onClick={e => { e.stopPropagation(); navigate(-1); }}
        className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-[var(--font-spacegrotesk)]">Back</span>
      </button>

      {/* ── Company header card ───────────────────────────────────────────── */}
      <Card className="mb-6 rounded-xl border-0 shadow-sm bg-white">
        <CardContent className="p-6 flex gap-6 items-start">
          <div className="w-40 h-40 rounded-lg bg-[var(--color-medgrey)] shrink-0 flex items-center justify-center">
            <BarChart2 className="w-14 h-14 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="headers text-2xl">{company.name}</h1>
              <button
                onClick={e => { e.stopPropagation(); setFollowed(f => !f); }}
                aria-label={followed ? "Unfollow company" : "Follow company"}
                className="p-1 rounded-full hover:bg-gray-100 transition"
              >
                <Heart className={cn(
                  "w-5 h-5 transition",
                  followed ? "fill-[var(--color-darkred)] text-[var(--color-darkred)]" : "text-gray-400"
                )} />
              </button>
            </div>

            {/* Alumni strip */}
            <div className="mt-3 inline-flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1.5">
              <div className="flex -space-x-2">
                {company.alumni.map(a => (
                  <div key={a.id} title={a.name}
                    className="w-7 h-7 rounded-full bg-gray-400 border-2 border-white shrink-0" />
                ))}
              </div>
              <span className="text-xs text-blue-800 font-semibold font-[var(--font-spacegrotesk)]">
                Alumni who work here
              </span>
            </div>

            {/* Main + People + Interview Button Bar*/}
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonGroup>
                  <Button
                    onClick={() => setActiveTab("main")}
                    variant={activeTab === "main" ? "default" : "outline"}
                  >
                    Main
                  </Button>
                  <Button
                    onClick={() => setActiveTab("people")}
                    variant={activeTab === "people" ? "default" : "outline"}
                  >
                    People
                  </Button>
                  <Button
                    onClick={() => setActiveTab("interviews")}
                    variant={activeTab === "interviews" ? "default" : "outline"}
                  >
                    Interviews
                  </Button>
              </ButtonGroup>
          </div>
          </div>
        </CardContent>
      </Card>

      {activeTab === "main" && (
        <>
          {/* ── Overview ─────────────────────────────────────────────────────── */}
          <section className="mb-6">
            <h2 className="headers text-xl mb-3">Overview</h2>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6">
                <p className="text-sm text-gray-700 leading-relaxed font-[var(--font-spacegrotesk)]">
                  {company.overview}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* ── Roles offered ────────────────────────────────────────────────── */}
          <section className="mb-6">
            <h2 className="headers text-xl mb-3">Roles offered</h2>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md
                               font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                               focus:ring-[var(--color-darkred)]/40"
                  />
                </div>

                {/* Major filter dropdown */}
                <div className="relative w-44" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setMajorDropdownOpen(o => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200
                               rounded-md bg-white font-[var(--font-spacegrotesk)] hover:bg-gray-50
                               transition w-full justify-between"
                  >
                    <span className="truncate">{majorFilter}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform",
                        majorDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {majorDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-56 z-50
                                    bg-white border border-gray-200 rounded-md
                                    shadow-xl max-h-60 overflow-y-auto">
                      {ALL_MAJORS.map(m => (
                        <button
                          key={m}
                          onClick={() => {
                            setMajorFilter(m);
                            setMajorDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-[var(--font-spacegrotesk)]",
                            "hover:bg-gray-50 transition",
                            m === majorFilter && "font-semibold text-[var(--color-darkred)]"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Role list */}
                <div className="flex flex-col gap-3">
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map(r => <RoleCard key={r.id} role={r} />)
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                      No roles match your filters.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* ── FAQs ─────────────────────────────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="headers text-xl mb-3">FAQs</h2>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="px-6 py-2">
                {company.faqs.map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} />
                ))}
              </CardContent>
            </Card>
          </section>
        </>
      )}

      {activeTab === "people" && (
        <>
          {/* ── People ────────────────────────────────────────────────── */}
          <section className="mb-6">
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for person..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md
                               font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                               focus:ring-[var(--color-darkred)]/40"
                  />
                </div>

                {/* Status filter dropdown */}
                <div className="relative w-44" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setPeopleDropdownOpen(o => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200
                               rounded-md bg-white font-[var(--font-spacegrotesk)] hover:bg-gray-50
                               transition w-full justify-between"
                  >
                    <span className="truncate">{peopleFilter}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-white shrink-0 transition-transform",
                        peopleDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {peopleDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-56 z-50
                                    bg-white border border-gray-200 rounded-md
                                    shadow-xl max-h-60 overflow-y-auto">
                      {People_Filter.map(m => (
                        <button
                          key={m}
                          onClick={() => {
                            setPeopleFilter(m);
                            setPeopleDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-[var(--font-spacegrotesk)]",
                            "hover:bg-gray-50 transition",
                            m === peopleFilter && "font-semibold text-[var(--color-darkred)]"
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Role list */}
                <div className="flex flex-col gap-3">
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map(p => 
                      <div key={p.id} className="rounded-lg border p-4">
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-gray-600">{p.role.join(", ")}</p>
                        <p className="text-sm text-gray-500">{p.status}</p>
                      </div>
                    )
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                      No roles match your filters.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}

      {activeTab === "interviews" && (
        <><h2 className="headers text-xl mb-3">Interview Questions</h2><Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="px-6 py-2">
                {company.interviewQuestions.map((q, i) => (
                  <FAQItem key={i} question={q.question} answer={q.answer} />
                ))}
              </CardContent>
            </Card></>
      )}

      </div>
    </div>
  </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CompanyPeople {
  name: string;
  status: string;
  role: string[];
  id : string;
}


export interface Role {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  salary: string;
  majors: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface InterviewQuestion {
  id : string;
  question : string;
  answer : string;
  role : int;
  difficulty : string
  type : string
}

interface Alumni {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
  overview: string;
  roles: Role[];
  faqs: FAQ[];
  alumni: Alumni[];
  companyPeople : CompanyPeople[];
  interviewQuestions : InterviewQuestion[];
}

// ─── Mock data — replace getMockCompany with a real API call when backend is ready ──

const ALL_MAJORS = [
  "All Majors",
  "Computer Science",
  "Computer Engineering",
  "Data Science",
  "Mathematics",
  "Interaction Design",
  "Graphic Design",
  "Business",
  "Engineering",
];

function getMockCompany(_id: string): Company {
  return {
    id: _id,
    name: "Company 1",
    overview:
      "Company 1 is a leading technology firm specializing in software development, cloud infrastructure, and data analytics. Founded in 2005, we have grown to over 5,000 employees worldwide. Our co-op program is designed to give students hands-on experience working alongside seasoned engineers on real products that reach millions of users. We value curiosity, collaboration, and a growth mindset above all else.",
    roles: [
      {
        id: "r1",
        title: "Software Engineer Co-op",
        description: "Work on full-stack features for our core product.",
        startDate: "01/06/2025",
        endDate: "31/08/2025",
        salary: "$35/hr",
        majors: ["Computer Science", "Computer Engineering"],
      },
      {
        id: "r2",
        title: "Data Analyst Co-op",
        description: "Analyze product metrics and build internal dashboards.",
        startDate: "01/06/2025",
        endDate: "31/08/2025",
        salary: "$30/hr",
        majors: ["Data Science", "Mathematics", "Computer Science"],
      },
      {
        id: "r3",
        title: "UX Design Co-op",
        description: "Design and prototype new user-facing features.",
        startDate: "01/06/2025",
        endDate: "31/08/2025",
        salary: "$28/hr",
        majors: ["Interaction Design", "Graphic Design"],
      },
      {
        id: "r4",
        title: "Product Management Co-op",
        description: "Support PMs in roadmap planning and stakeholder comms.",
        startDate: "01/09/2025",
        endDate: "31/12/2025",
        salary: "$32/hr",
        majors: ["Business", "Computer Science", "Engineering"],
      },
    ],
    faqs: [
      {
        question: "What does the interview process look like?",
        answer:
          "The process typically consists of a recruiter screen, one technical round (LeetCode medium), and a final behavioral interview with the hiring manager. The whole process usually takes 2–3 weeks.",
      },
      {
        question: "Is the co-op remote, hybrid, or in-person?",
        answer:
          "Most co-op roles are hybrid with 2–3 days per week in the office. Fully remote options exist for certain teams.",
      },
      {
        question: "Can I return for a full-time role after my co-op?",
        answer:
          "Yes — a significant portion of our full-time new grad hires are returning co-ops. Strong performers are typically extended return offers before their co-op ends.",
      },
      {
        question: "What tech stack does the engineering team use?",
        answer:
          "Our primary stack is TypeScript/React on the frontend, Go and Python on the backend, and AWS for infrastructure. Teams vary, so ask your recruiter about the specific team's stack.",
      },
    ],
    interviewQuestions: [
      {
        id: "i1",
        question: "Tell me about yourself.",
        answer:
          "Focus on your background, relevant experiences, and what led you to apply for this role. Keep it concise and tailored to the company.",
        role: "Software Engineer Co-op",
        type: "Behavioral",
        difficulty: "Easy",
      },
      {
        id: "i2",
        question: "Describe a time you worked on a team project.",
        answer:
          "Talk about your role, how you collaborated, challenges faced, and the outcome. Highlight communication and problem-solving.",
        role: "Data Analyst Co-op",
        type: "Behavioral",
        difficulty: "Easy",
      },
      {
        id: "i3",
        question: "Explain how a hash table works.",
        answer:
          "A hash table uses a hash function to map keys to indices in an array. Collisions are handled via chaining or open addressing.",
        role: "Software Engineer",
        type: "Technical",
        difficulty: "Medium",
      },
      {
        id: "i4",
        question: "Reverse a linked list.",
        answer:
          "Iterate through the list, reversing the next pointers one by one while keeping track of previous and current nodes.",
        role: "Software Engineer",
        type: "Technical",
        difficulty: "Medium",
      },
      {
        id: "i5",
        question: "Why do you want to work at this company?",
        answer:
          "Show you’ve researched the company and connect their mission, products, or culture to your interests and goals.",
        role: "General",
        type: "Behavioral",
        difficulty: "Easy",
      },
      {
        id: "i6",
        question: "Describe a challenging bug you fixed.",
        answer:
          "Explain the problem, how you debugged it, tools you used, and what you learned from the experience.",
        role: "Software Engineer",
        type: "Behavioral",
        difficulty: "Medium",
      },
      {
        id: "i7",
        question: "What is the difference between a stack and a queue?",
        answer:
          "A stack is LIFO (last in, first out), while a queue is FIFO (first in, first out).",
        role: "Software Engineer Co-op",
        type: "Technical",
        difficulty: "Easy",
      },
      {
        id: "i8",
        question: "How would you design a URL shortener?",
        answer:
          "Discuss generating unique IDs, mapping them to URLs, handling collisions, and scaling with databases and caching.",
        role: "Software Engineer",
        type: "System Design",
        difficulty: "Hard",
      }
    ],
    alumni: [
      { id: "a1", name: "Alex Kim" },
      { id: "a2", name: "Jordan Lee" },
      { id: "a3", name: "Sam Rivera" },
    ],
    companyPeople : [
      {
      id: "2934873",
      name: "Alex Kim",
      role: ["Software Engineer", "Senior Software Engineer"],
      status: "Full-Time Employees",
      },
      {
        id: "234325",
        name: "Jordan Lee",
        role: ["Data Analyst Co-op"],
        status: "Current Co-op Students",
      },
      {
        id: "9456743",
        name: "Sam Rivera",
        role: ["Product Manager", "Software Engineer Co-op"],
        status: "Alumni",
      },
      {
        id: "234634",
        name: "Taylor Chen",
        role: ["UX Designer Co-op"],
        status: "Previous Co-op Students",
      },
      {
        id: "111995",
        name: "Morgan Patel",
        role: ["QA Engineer", "QA Intern"],
        status: "Part-Time Employees",
      },
      {
        id: "p6",
        name: "Chris Johnson",
        role: ["Backend Engineer", "Systems Engineer"],
        status: "Full-Time Employees",
      },
      {
        id: "p7",
        name: "Priya Singh",
        role: ["Frontend Developer", "UI Engineer"],
        status: "Full-Time Employees",
      },
      {
        id: "p8",
        name: "Daniel Garcia",
        role: ["Marketing Co-op"],
        status: "Current Co-op Students",
      },
    ]
  };
}

const People_Filter =[
  "All",
  "Alumni",
  "Current Co-op Students",
  "Previous Co-op Students",
  "Full-Time Employees",
  "Part-Time Employees"
];
