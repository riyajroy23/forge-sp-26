import { useState } from "react";
import { Heart, BarChart2, Calendar, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Role } from "@/Pages/company_overview";

export default function RoleCard({ role }: { role: Role }) {
  const [liked, setLiked] = useState(false);

  return (
    <Card
      className="
        flex flex-row items-center gap-4 p-6 mb-3 rounded-lg bg-gray-200 border border-gray-200 shadow-none
        hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300
      "
    >
      <div
        className="
          w-25 mr-3 flex items-center justify-center
        "
      >
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
            line-clamp-1
          ">
            {role.description}
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
    </Card>
  );
}