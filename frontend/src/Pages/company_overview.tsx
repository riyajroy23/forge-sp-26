import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Search, ChevronDown, ArrowLeft, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/auth";
import RoleCard from "@/components/RoleCard";
import FAQItem from "@/components/FAQItem";

const API_URL = "http://localhost:3000/api";

export default function CompanyOverviewPage() {
  const { id = "1" } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [followed, setFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [majorFilter, setMajorFilter] = useState("All Majors");
  const [search, setSearch] = useState("");
  const [majorDropdownOpen, setMajorDropdownOpen] = useState(false);

  // ── Fetch company overview from backend ─────────────────────────────────────
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await fetch(`${API_URL}/companies/${id}/overview`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (!res.ok) throw new Error("Company not found");

        const json = await res.json();
        const raw: BackendCompany = json.data ?? json;

        setCompany(mapCompany(raw));
      } catch (err) {
        console.error(err);
        setError("Could not load company. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [id]);

  // ── Toggle follow / unfollow ─────────────────────────────────────────────────
  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (followLoading) return;
    setFollowLoading(true);

    try {
      if (!followed) {
        // POST /companies/:id/follow
        const res = await fetch(`${API_URL}/companies/${id}/follow`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok || res.status === 409) setFollowed(true); // 409 = already following
      } else {
        // DELETE /companies/:id/unfollow
        const res = await fetch(`${API_URL}/companies/${id}/unfollow`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.ok) setFollowed(false);
      }
    } catch (err) {
      console.error("Follow toggle error:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  // ── Derive major list from loaded roles ──────────────────────────────────────
  const allMajors = company
    ? ["All Majors", ...Array.from(new Set(company.roles.flatMap((r) => r.majors)))]
    : ["All Majors"];

  // ── Filter roles ─────────────────────────────────────────────────────────────
  const filteredRoles = (company?.roles ?? []).filter((r) => {
    const matchesMajor = majorFilter === "All Majors" || r.majors.includes(majorFilter);
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    return matchesMajor && matchesSearch;
  });

  // ── Loading / error states ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-lightgrey)] p-8 -m-8 flex items-center justify-center">
        <p className="text-gray-500 font-[var(--font-spacegrotesk)]">Loading...</p>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-[var(--color-lightgrey)] p-8 -m-8 flex flex-col items-center justify-center gap-3">
        <p className="text-red-500 font-[var(--font-spacegrotesk)]">{error ?? "Company not found."}</p>
        <button onClick={() => navigate(-1)} className="text-sm text-gray-500 underline font-[var(--font-spacegrotesk)]">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[var(--color-lightgrey)] p-8 -m-8"
      onClick={() => setMajorDropdownOpen(false)}
    >

      {/* Back arrow */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate(-1); }}
        className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-[var(--font-spacegrotesk)]">Back</span>
      </button>

      {/* ── Company header card ───────────────────────────────────────────── */}
      <Card className="mb-6 rounded-xl border-0 shadow-sm bg-white">
        <CardContent className="p-6 flex gap-6 items-start">

          {/* Logo */}
          <div className="w-40 h-40 rounded-lg bg-[var(--color-medgrey)] shrink-0 flex items-center justify-center overflow-hidden">
            {company.logo_url
              ? <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
              : <BarChart2 className="w-14 h-14 text-white" />}
          </div>

          <div className="flex-1 min-w-0">

            {/* Name + follow */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="headers text-2xl">{company.name}</h1>
              <button
                onClick={handleFollowToggle}
                disabled={followLoading}
                aria-label={followed ? "Unfollow company" : "Follow company"}
                className="p-1 rounded-full hover:bg-gray-100 transition disabled:opacity-50"
              >
                <Heart className={cn(
                  "w-5 h-5 transition",
                  followed ? "fill-[#b11d1d] text-[#b11d1d]" : "text-gray-400"
                )} />
              </button>
            </div>

            {/* Alumni strip */}
            {company.alumni.length > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 bg-blue-100 rounded-full px-3 py-1.5">
                <div className="flex -space-x-2">
                  {company.alumni.map((a) => (
                    <div key={a.id} title={a.name}
                      className="w-7 h-7 rounded-full bg-gray-400 border-2 border-white shrink-0" />
                  ))}
                </div>
                <span className="text-xs text-blue-800 font-semibold font-[var(--font-spacegrotesk)]">
                  Alumni who work here
                </span>
              </div>
            )}

            {/* Quick nav buttons */}
            <div className="mt-3 flex gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/company_msgboard"); }}
                className="px-3 py-1.5 text-sm rounded-md bg-[#b11d1d] text-white hover:opacity-90 transition font-[var(--font-spacegrotesk)]"
              >
                Message Board
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); navigate("/companypost"); }}
                className="px-3 py-1.5 text-sm rounded-md bg-[#b11d1d] text-white hover:opacity-90 transition font-[var(--font-spacegrotesk)]"
              >
                Create Post
              </button>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="headers text-xl mb-3">Overview</h2>
        <Card className="rounded-xl border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-700 leading-relaxed font-[var(--font-spacegrotesk)]">
              {company.overview || company.description || "No overview available."}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Roles offered ────────────────────────────────────────────────── */}
      <section className="mb-6">
        <h2 className="headers text-xl mb-3">Roles offered</h2>
        <Card className="rounded-xl border-0 shadow-sm bg-white">
          <CardContent className="p-6 flex flex-col gap-3">

            {/* Search */}
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

            {/* Major filter dropdown */}
            <div className="relative w-44" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setMajorDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200
                           rounded-md bg-white font-[var(--font-spacegrotesk)] hover:bg-gray-50
                           transition w-full justify-between"
              >
                <span className="truncate">{majorFilter}</span>
                <ChevronDown className={cn(
                  "w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform",
                  majorDropdownOpen && "rotate-180"
                )} />
              </button>

              {majorDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-56 z-50
                                bg-white border border-gray-200 rounded-md
                                shadow-xl max-h-60 overflow-y-auto">
                  {allMajors.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMajorFilter(m); setMajorDropdownOpen(false); }}
                      className={cn(
                        "!bg-white w-full text-left px-4 py-2 text-sm font-[var(--font-spacegrotesk)]",
                        "hover:!bg-gray-50 outline-none",
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
              {filteredRoles.length > 0
                ? filteredRoles.map((r) => <RoleCard key={r.id} role={r} />)
                : <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                    No roles match your filters.
                  </p>
              }
            </div>

          </CardContent>
        </Card>
      </section>

      {/* ── FAQs ─────────────────────────────────────────────────────────── */}
      {company.faqs.length > 0 && (
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
      )}

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
  majors: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface Alumni {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  overview: string;
  logo_url: string | null;
  careers_page_url: string;
  headquarters_location: string;
  roles: Role[];
  faqs: FAQ[];
  alumni: Alumni[];
}

// ─── Backend response shape (joinCompany.js /overview endpoint) ──────────────

interface BackendRole {
  id: string;
  title: string;
  description: string;
  area: string;
  relevant_majors: string[];
  start_date: string;
  end_date: string;
  salary: string;
}

interface BackendFAQ {
  id: string;
  question: string;
  answer: string;
}

interface BackendCompany {
  id: string;
  name: string;
  industry: string;
  description: string;
  overview: string;
  logo_url: string | null;
  careers_page_url: string;
  headquarters_location: string;
  website_url: string;
  roles: BackendRole[];
  faqs: BackendFAQ[];
}

// ─── Map backend shape → frontend Company type ───────────────────────────────

function mapCompany(c: BackendCompany): Company {
  return {
    id: String(c.id),
    name: c.name,
    industry: c.industry ?? "",
    description: c.description ?? "",
    overview: c.overview ?? c.description ?? "",
    logo_url: c.logo_url ?? null,
    careers_page_url: c.careers_page_url ?? "",
    headquarters_location: c.headquarters_location ?? "",
    roles: (c.roles ?? []).map((r) => ({
      id: String(r.id),
      title: r.title,
      description: r.description ?? r.area ?? "",
      startDate: r.start_date ?? "",
      endDate: r.end_date ?? "",
      salary: r.salary ?? "",
      majors: r.relevant_majors ?? [],
    })),
    faqs: (c.faqs ?? []).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    // alumni come from CompanyFollow — not returned by /overview yet,
    // leave empty for now and wire up when the followers endpoint is connected
    alumni: [],
  };
}
