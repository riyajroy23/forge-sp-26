import { useState } from "react";
<<<<<<< Updated upstream
import { Heart, BarChart2 } from "lucide-react";
=======
import { Heart, BarChart2, Calendar, DollarSign, MapPin } from "lucide-react";
>>>>>>> Stashed changes
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Role } from "@/Pages/company_overview";

export default function RoleCard({ role }: { role: Role }) {
  const [liked, setLiked] = useState(false);

  const words = role.description ? role.description.trim().split(/\s+/) : [];
  const displayDescription = words.length > 100 
    ? words.slice(0, 100).join(" ") + "..." 
    : role.description;

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
<<<<<<< Updated upstream
        <Heart
          className={cn(
            "w-5 h-5 transition",
            liked
              ? "fill-[var(--color-darkred)] text-[var(--color-darkred)]"
              : "text-gray-400"
          )}
        />
      </button>
=======
        <div
          className="
            w-22 h-22 rounded-lg bg-gray-100
            flex items-center justify-center
            transition-all duration-200
            group-hover:bg-[#B11D1D]/10
          "
        >
          <BarChart2 className="w-10 h-10 text-gray-500 group-hover:text-[#B11D1D]" />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <p
            className="
              font-semibold text-xl text-black
              font-[var(--font-spacegrotesk)] truncate
              transition-colors duration-200
              group-hover:text-[#B11D1D]
            "
          >
            {role.title}
          </p>

          <p className="
            text-lg text-gray-500 mt-1
            font-[var(--font-spacegrotesk)]
            whitespace-pre-wrap
          ">
            {displayDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <div className="
            flex items-center gap-1.5 px-2.5 py-1
            rounded-md bg-gray-100 text-gray-600 text-md
            transition-all duration-200
            group-hover:bg-gray-200
          ">
            <Calendar className="w-3.5 h-3.5" />
            <span>{role.startDate} – {role.endDate}</span>
          </div>

          <div className="
            flex items-center gap-1.5 px-2.5 py-1
            rounded-md bg-[#B11D1D]/10 text-[#B11D1D] text-md
            transition-all duration-200
            group-hover:bg-[#B11D1D]/20
          ">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{role.salary}</span>
          </div>

          {role.location && (
            <div className="
              flex items-center gap-1.5 px-2.5 py-1
              rounded-md bg-blue-100 text-blue-700 text-md
              transition-all duration-200
              group-hover:bg-blue-200
            ">
              <MapPin className="w-3.5 h-3.5" />
              <span>{role.location}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start">
        <button
          onClick={() => setLiked(l => !l)}
          aria-label={liked ? "Unlike role" : "Like role"}
          className="
            p-2 rounded-full !bg-transparent
            transition-all duration-200
            hover:bg-gray-100 active:scale-90
          "
        >
          <Heart
            className={cn(
              "w-5 h-5 transition-all duration-200",
              liked
                ? "fill-[#B11D1D] text-[#B11D1D] scale-110"
                : "text-gray-400 group-hover:text-gray-600"
            )}
          />
        </button>
      </div>
>>>>>>> Stashed changes
    </Card>
  );
}
