import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown, ArrowLeft, Heart, BarChart2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CompanyCard from "@/components/CompanyCard";

const API_URL = "http://localhost:3000/api";
const ITEMS_PER_PAGE = 10;

export default function CompanyBrowsing() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [search, setSearch] = useState("");
  const [industryDropdownOpen, setIndustryDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch(`${API_URL}/companies`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || "Failed to load companies");
        const mapped: Company[] = json.data.map((c: any) => ({
          id: String(c.id),
          name: c.name,
          industry: c.industry ?? "",
          overview: c.overview ?? "",
          headquarters_location: c.headquarters_location ?? "",
          navigate: `/company/${c.id}`,
        }));
        setCompanies(mapped);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const savedCompanies = companies.filter((c) => savedIds.has(c.id));

  const filteredCompanies = companies.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry =
      industryFilter === "All Industries" || r.industry === industryFilter;
    return matchesSearch && matchesIndustry;
  });

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const pagedCompanies = filteredCompanies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); };
  const handleIndustryFilter = (val: string) => { setIndustryFilter(val); setCurrentPage(1); };

  return (
    <div
      className="flex flex-col min-h-screen"
      onClick={() => setIndustryDropdownOpen(false)}
    >
      <div className="flex flex-1">
        <div className="flex-1 overflow-y-auto bg-[var(--color-lightgrey)] p-8">

          {/* Back arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="flex items-center gap-1 text-gray-600 hover:text-black mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-[var(--font-spacegrotesk)]">Back</span>
          </button>

          {error && (
            <p className="text-sm text-red-500 mb-4 font-[var(--font-spacegrotesk)]">
              Failed to load companies: {error}
            </p>
          )}

          {loading && (
            <p className="text-sm text-gray-400 mb-4 font-[var(--font-spacegrotesk)]">
              Loading companies...
            </p>
          )}

          {/* ── Saved Companies ──────────────────────────────────────────────── */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-5 h-5 fill-[#b11d1d] text-[#b11d1d]" />
              <h2 className="text-2xl font-semibold font-[var(--font-spacegrotesk)] text-gray-900">
                Saved Companies
              </h2>
              {savedCompanies.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#b11d1d] text-white text-sm font-semibold font-[var(--font-spacegrotesk)]">
                  {savedCompanies.length}
                </span>
              )}
            </div>

            {savedCompanies.length === 0 ? (
              <Card className="rounded-xl border-0 shadow-sm bg-white">
                <CardContent className="py-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Heart className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-base text-gray-400 font-[var(--font-spacegrotesk)]">
                    No saved companies yet — hit the heart on any company below.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {savedCompanies.map((company) => (
                  <Card
                    key={company.id}
                    onClick={() => navigate(company.navigate)}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl border-0 shadow-sm bg-white
                               cursor-pointer hover:shadow-md hover:bg-red-50/30 transition group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#b11d1d]/10 flex items-center justify-center shrink-0">
                      <BarChart2 className="w-6 h-6 text-[#b11d1d]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 font-[var(--font-spacegrotesk)] truncate">
                        {company.name}
                      </p>
                      <p className="text-sm text-gray-400 font-[var(--font-spacegrotesk)] truncate">
                        {company.headquarters_location || "Location unknown"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleSaved(company.id); }}
                      className="shrink-0 p-1 rounded-full hover:bg-red-100 transition opacity-0 group-hover:opacity-100"
                      aria-label="Remove from saved"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-[#b11d1d]" />
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* ── Company Search ────────────────────────────────────────────────── */}
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-gray-500" />
              <h2 className="text-2xl font-semibold font-[var(--font-spacegrotesk)] text-gray-900">
                Browse All
              </h2>
            </div>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">
                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
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
                    <div className="absolute left-0 top-full mt-1 w-56 z-50 bg-white border border-gray-200
                                    rounded-md shadow-xl max-h-60 overflow-y-auto">
                      {ALL_INDUSTRIES.map((m) => (
                        <button
                          key={m}
                          onClick={() => { handleIndustryFilter(m); setIndustryDropdownOpen(false); }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-[var(--font-spacegrotesk)]",
                            "hover:bg-gray-50 transition",
                            m === industryFilter && "font-semibold text-[var(--color-darkred)]"
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
                  {pagedCompanies.length > 0 ? (
                    pagedCompanies.map((r) => (
                      <CompanyCard
                        key={r.id}
                        company={r}
                        followed={savedIds.has(r.id)}
                        onToggle={toggleSaved}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 py-4 text-center font-[var(--font-spacegrotesk)]">
                      No companies match your search.
                    </p>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-200
                                 font-[var(--font-spacegrotesk)] hover:bg-gray-50 disabled:opacity-40
                                 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>
                    <span className="text-sm text-gray-500 font-[var(--font-spacegrotesk)]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md border border-gray-200
                                 font-[var(--font-spacegrotesk)] hover:bg-gray-50 disabled:opacity-40
                                 disabled:cursor-not-allowed transition"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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

export interface Company {
  id: string;
  name: string;
  industry: string;
  overview: string;
  headquarters_location: string;
  navigate: string;
}

const ALL_INDUSTRIES = [
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
