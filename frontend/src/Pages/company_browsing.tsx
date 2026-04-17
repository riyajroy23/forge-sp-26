import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getToken } from "@/lib/auth";
import CompanyCard from "@/components/CompanyCard";

const API_URL = "http://localhost:3000/api";

export default function CompanyBrowsing() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [search, setSearch] = useState("");
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);

  // ── Fetch all companies from backend ────────────────────────────────────────
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_URL}/companies`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });

        if (!res.ok) throw new Error("Failed to fetch companies");

        const data = await res.json();

        // browseCompanyEndpoints returns a plain array (no .data wrapper)
        const raw: BackendCompany[] = Array.isArray(data) ? data : data.data ?? [];

        setCompanies(raw.map(mapCompany));
      } catch (err) {
        console.error(err);
        setError("Could not load companies. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // ── Derive unique industry list from loaded data ─────────────────────────────
  const industries = [
    "All Industries",
    ...Array.from(new Set(companies.map((c) => c.industry).filter(Boolean))),
  ];

  // ── Filter ───────────────────────────────────────────────────────────────────
  const filteredCompanies = companies.filter((c) => {
    const matchesIndustry =
      industryFilter === "All Industries" || c.industry === industryFilter;
    const matchesSearch = c.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesIndustry && matchesSearch;
  });

  return (
    <div
      className="flex flex-col min-h-screen"
      onClick={() => setIndustryDropdownOpen(false)}
    >
      <div className="flex flex-1">
        <div className="flex-1 overflow-y-auto bg-[var(--color-lightgrey)] p-8 -m-8">

          {/* Back arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-[var(--font-spacegrotesk)]">Back</span>
          </button>

          {/* ── Company Search ──────────────────────────────────────────────── */}
          <section className="mb-6">
            <h1 className="headers text-4xl mb-3 text-center">Company Search</h1>
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

                {/* Industry filter dropdown */}
                <div className="relative w-44" onClick={(e) => e.stopPropagation()}>
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
                        industryDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {industryDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-56 z-50
                                    bg-white border border-gray-200 rounded-md
                                    shadow-xl max-h-60 overflow-y-auto">
                      {industries.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => { setIndustryFilter(ind); setIndustryDropdownOpen(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-[var(--font-spacegrotesk)]",
                            "hover:bg-gray-50 transition",
                            ind === industryFilter && "font-semibold text-[var(--color-darkred)]"
                          )}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* States */}
                {loading && (
                  <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                    Loading companies...
                  </p>
                )}
                {error && (
                  <p className="text-sm text-red-500 py-4 text-center font-[var(--font-spacegrotesk)]">
                    {error}
                  </p>
                )}

                {/* Company list */}
                {!loading && !error && (
                  <div className="flex flex-col gap-3">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map((c) => (
                        <CompanyCard key={c.id} company={c} />
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                        No companies match your filters.
                      </p>
                    )}
                  </div>
                )}

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
  industry: string;
  overview: string;
  roles: Role[];
  faqs: FAQ[];
  alumni: Alumni[];
}

// ─── Backend response shape (browseCompanyEndpoints.js) ──────────────────────

interface BackendRole {
  role_id: number;
  title: string;
  area: string;
  relevant_majors: string[];
}

interface BackendCompany {
  company_id: number;
  name: string;
  industry: string;
  description: string;
  careers_page_url: string;
  logo_url: string | null;
  headquarters_location: string;
  roles: BackendRole[];
}

// ─── Map backend shape → frontend Company type ───────────────────────────────

function mapCompany(c: BackendCompany): Company {
  return {
    id: c.company_id,
    name: c.name,
    industry: c.industry ?? "",
    overview: c.description ?? "",
    roles: (c.roles ?? []).map((r) => ({
      id: String(r.role_id),
      title: r.title,
      description: r.area ?? "",
      startDate: "",
      endDate: "",
      salary: "",
      industries: r.relevant_majors ?? [],
    })),
    faqs: [],
    alumni: [],
  };
}
