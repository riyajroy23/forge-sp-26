import { useState } from "react";
import { Heart, BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Company } from "@/Pages/company_browsing";

export default function CompanyCard({ company }: { company: Company }) {
  const [followed, setFollowed] = useState(false);

  return (
    <Card className="flex flex-row items-center gap-4 px-8 py-10 rounded-lg border border-gray-200 shadow-none">
      <div className="w-15 h-15 rounded bg-gray-300 shrink-0 flex items-center justify-center">
        <BarChart2 className="w-8 h-8 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-lg text-black font-[var(--font-spacegrotesk)] truncate">
          {company.name}
        </p>
        <div className="text-base text-gray-500 font-[var(--font-spacegrotesk)]">
          Offering roles for:
          {company.roles.map((item, index) => (
            <div key={index}>{item.title}</div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setFollowed((l) => !l)}
        aria-label={followed ? "Unfollow company" : "Follow company"}
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
