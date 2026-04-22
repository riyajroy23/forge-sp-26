import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

//Company Card component
import CompanyCard from "@/components/CompanyCard";

export default function CompanyBrowsing() {
  // const { id = "1" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [companies] = useState(() => getMockCompany());

  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [search, setSearch] = useState("");
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);

  const filteredCompanies = companies.filter((r) => {
    // const matchesMajor = majorFilter === "All Majors" || r.majors.includes(majorFilter);
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    // return matchesMajor && matchesSearch;
    return matchesSearch;
  });

  return (
    // Clicking anywhere outside the dropdown closes it
    <div
      className="flex flex-col min-h-screen"
      onClick={() => setIndustryDropdownOpen(false)}
    >
      <div className="flex flex-1">
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

          {/* ── Company Search ────────────────────────────────────────────────── */}
          <section className="mb-6">
            <h1 className="headers text-4xl mb-3 text-center">
              Company Search
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
                >
                  <button
                    onClick={() => setIndustryDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200
                            rounded-md bg-white font-[var(--font-spacegrotesk)] hover:bg-gray-50
                            transition w-full justify-between"
                  >
                    <span className="truncate">{industryFilter}</span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform",
                        industryDropdownOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {industryDropdownOpen && (
                    <div
                      className="absolute left-0 top-full mt-1 w-56 z-50
                                bg-white border border-gray-200 rounded-md
                                shadow-xl max-h-60 overflow-y-auto"
                    >
                      {ALL_MAJORS.map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            setIndustryFilter(m);
                            setIndustryDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-[var(--font-spacegrotesk)]",
                            "hover:bg-gray-50 transition",
                            m === industryFilter &&
                              "font-semibold text-[var(--color-darkred)]",
                          )}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Company list */}
                <div className="flex flex-col gap-3">
                  {filteredCompanies.length > 0 ? (
                    filteredCompanies.map((r) => (
                      <CompanyCard key={r.id} company={r} />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                      No companies match your filters.
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

export interface Role {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  salary: string;
  industries: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface Alumni {
  id: string;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  overview: string;
  roles: Role[];
  faqs: FAQ[];
  alumni: Alumni[];
  navigate: string;
}

// ─── Mock data — replace getMockCompany with a real API call when backend is ready ──

const ALL_MAJORS = [
  "All Industries",
  "Computer Science",
  "Computer Engineering",
  "Data Science",
  "Mathematics",
  "Interaction Design",
  "Graphic Design",
  "Business",
  "Engineering",
];

function getMockCompany(): Company[] {
  return [
    {
      id: 1,
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
          industries: ["Computer Science", "Computer Engineering"],
        },
      ],
      faqs: [
        {
          question: "What does the interview process look like?",
          answer:
            "The process typically consists of a recruiter screen, one technical round (LeetCode medium), and a final behavioral interview with the hiring manager. The whole process usually takes 2–3 weeks.",
        },
      ],
      alumni: [
        { id: "a1", name: "Alex Kim" },
        { id: "a2", name: "Jordan Lee" },
        { id: "a3", name: "Sam Rivera" },
      ],
      navigate: "/company/1",
    },

    {
      id: 2,
      name: "Company 2",
      overview:
        "Company 2 is a leading technology firm specializing in UI/UX, cloud infrastructure, and data analytics. Founded in 2005, we have grown to over 5,000 employees worldwide. Our co-op program is designed to give students hands-on experience working alongside seasoned engineers on real products that reach millions of users. We value curiosity, collaboration, and a growth mindset above all else.",
      roles: [
        {
          id: "r1",
          title: "Data Analyst",
          description: "Work on full-stack features for our core product.",
          startDate: "01/06/2025",
          endDate: "31/08/2025",
          salary: "$35/hr",
          industries: ["Computer Science", "Product Management"],
        },
      ],
      faqs: [
        {
          question: "What does the interview process look like?",
          answer:
            "The process typically consists of a recruiter screen, one technical round (LeetCode medium), and a final behavioral interview with the hiring manager. The whole process usually takes 2–3 weeks.",
        },
      ],
      alumni: [
        { id: "a1", name: "Alex Kim" },
        { id: "a2", name: "Jordan Lee" },
        { id: "a3", name: "Sam Rivera" },
      ],
      navigate: "/company/2",
    },

    {
      id: 3,
      name: "Company 3",
      overview:
        "Company 2 is a leading technology firm specializing in UI/UX, cloud infrastructure, and data analytics. Founded in 2005, we have grown to over 5,000 employees worldwide. Our co-op program is designed to give students hands-on experience working alongside seasoned engineers on real products that reach millions of users. We value curiosity, collaboration, and a growth mindset above all else.",
      roles: [
        {
          id: "r1",
          title: "Data Analyst",
          description: "Work on full-stack features for our core product.",
          startDate: "01/06/2025",
          endDate: "31/08/2025",
          salary: "$35/hr",
          industries: ["Computer Science", "Product Management"],
        },
      ],
      faqs: [
        {
          question: "What does the interview process look like?",
          answer:
            "The process typically consists of a recruiter screen, one technical round (LeetCode medium), and a final behavioral interview with the hiring manager. The whole process usually takes 2–3 weeks.",
        },
      ],
      alumni: [
        { id: "a1", name: "Alex Kim" },
        { id: "a2", name: "Jordan Lee" },
        { id: "a3", name: "Sam Rivera" },
      ],
    },

    {
      id: 4,
      name: "Company 4",
      overview:
        "Company 2 is a leading technology firm specializing in UI/UX, cloud infrastructure, and data analytics. Founded in 2005, we have grown to over 5,000 employees worldwide. Our co-op program is designed to give students hands-on experience working alongside seasoned engineers on real products that reach millions of users. We value curiosity, collaboration, and a growth mindset above all else.",
      roles: [
        {
          id: "r1",
          title: "Data Analyst",
          description: "Work on full-stack features for our core product.",
          startDate: "01/06/2025",
          endDate: "31/08/2025",
          salary: "$35/hr",
          industries: ["Computer Science", "Product Management"],
        },
      ],
      faqs: [
        {
          question: "What does the interview process look like?",
          answer:
            "The process typically consists of a recruiter screen, one technical round (LeetCode medium), and a final behavioral interview with the hiring manager. The whole process usually takes 2–3 weeks.",
        },
      ],
      alumni: [
        { id: "a1", name: "Alex Kim" },
        { id: "a2", name: "Jordan Lee" },
        { id: "a3", name: "Sam Rivera" },
      ],
    },

    {
      id: 5,
      name: "Company 5",
      overview:
        "Company 2 is a leading technology firm specializing in UI/UX, cloud infrastructure, and data analytics. Founded in 2005, we have grown to over 5,000 employees worldwide. Our co-op program is designed to give students hands-on experience working alongside seasoned engineers on real products that reach millions of users. We value curiosity, collaboration, and a growth mindset above all else.",
      roles: [
        {
          id: "r1",
          title: "Data Analyst",
          description: "Work on full-stack features for our core product.",
          startDate: "01/06/2025",
          endDate: "31/08/2025",
          salary: "$35/hr",
          industries: ["Computer Science", "Product Management"],
        },
      ],
      faqs: [
        {
          question: "What does the interview process look like?",
          answer:
            "The process typically consists of a recruiter screen, one technical round (LeetCode medium), and a final behavioral interview with the hiring manager. The whole process usually takes 2–3 weeks.",
        },
      ],
      alumni: [
        { id: "a1", name: "Alex Kim" },
        { id: "a2", name: "Jordan Lee" },
        { id: "a3", name: "Sam Rivera" },
      ],
    },
  ];
}
