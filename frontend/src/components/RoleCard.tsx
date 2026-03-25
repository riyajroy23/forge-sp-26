import { useState } from "react";
import { Heart, BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Role } from "@/Pages/company_overview";

export default function RoleCard({ role }: { role: Role }) {
  const [liked, setLiked] = useState(false);

  return (
    <Card className="flex flex-row items-center gap-4 px-4 py-3 rounded-lg border border-gray-200 shadow-none">
      <div className="w-10 h-10 rounded bg-gray-300 shrink-0 flex items-center justify-center">
        <BarChart2 className="w-5 h-5 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-black font-[var(--font-spacegrotesk)] truncate">
          {role.title}
        </p>
        <p className="text-xs text-gray-500 font-[var(--font-spacegrotesk)]">
          {role.description}&nbsp;·&nbsp;{role.startDate} – {role.endDate}&nbsp;·&nbsp;{role.salary}
        </p>
      </div>

      <button
        onClick={() => setLiked(l => !l)}
        aria-label={liked ? "Unlike role" : "Like role"}
        className="shrink-0 p-1 rounded-full hover:bg-gray-100 transition"
      >
        <Heart
          className={cn(
            "w-5 h-5 transition",
            liked
              ? "fill-[var(--color-darkred)] text-[var(--color-darkred)]"
              : "text-gray-400"
          )}
        />
      </button>
    </Card>
  );
}
