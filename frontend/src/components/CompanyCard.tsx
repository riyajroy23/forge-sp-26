import { Heart, BarChart2, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Company } from "@/Pages/company_browsing";

interface CompanyCardProps {
  company: Company;
  followed: boolean;
  onToggle: (id: string) => void;
}

export default function CompanyCard({ company, followed, onToggle }: CompanyCardProps) {
  const navigate = useNavigate();

  const truncatedOverview = company.overview.length > 120
    ? company.overview.slice(0, 120).trimEnd() + "…"
    : company.overview;

  return (
    <Card
      className="flex flex-row items-center gap-4 px-8 py-6 rounded-lg border border-gray-200 shadow-none cursor-pointer hover:border-[#b11d1d]/30 hover:bg-red-50/20 transition"
      onClick={() => navigate(company.navigate)}
    >
      <div className="w-15 h-15 rounded bg-gray-300 shrink-0 flex items-center justify-center">
        <BarChart2 className="w-8 h-8 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-lg text-black font-[var(--font-spacegrotesk)] truncate">
          {company.name}
        </p>
        <p className="text-sm text-gray-500 font-[var(--font-spacegrotesk)] mt-0.5 line-clamp-2">
          {truncatedOverview}
        </p>
        {company.headquarters_location && (
          <div className="flex items-center gap-1 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs text-gray-400 font-[var(--font-spacegrotesk)] truncate">
              {company.headquarters_location}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onToggle(company.id); }}
        aria-label={followed ? "Unsave company" : "Save company"}
        className="shrink-0 p-1 rounded-full hover:bg-gray-100 transition"
      >
        <Heart
          className={cn(
            "w-10 h-10 transition",
            followed
              ? "fill-[var(--color-darkred)] text-[var(--color-darkred)]"
              : "text-gray-400",
          )}
        />
      </button>
    </Card>
  );
}
