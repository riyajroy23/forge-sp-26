import { useNavigate } from "react-router-dom";
import { BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { type Company } from "@/Pages/company_browsing";

export default function CompanyCard({ company }: { company: Company }) {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/company/${company.id}`)}
      className="flex flex-row items-center gap-4 px-8 py-10 rounded-lg border border-gray-200 shadow-none cursor-pointer hover:border-[#b11d1d]/40 hover:bg-red-50/20 transition"
    >
      <div className="w-15 h-15 rounded bg-gray-300 shrink-0 flex items-center justify-center">
        <BarChart2 className="w-8 h-8 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-lg text-black font-[var(--font-spacegrotesk)] truncate">
          {company.name}
        </p>
        <p className="text-sm text-gray-400 font-[var(--font-spacegrotesk)]">
          {company.industry}
        </p>
        <div className="text-base text-gray-500 font-[var(--font-spacegrotesk)] mt-1">
          Offering roles for:
          {company.roles.map((item, index) => (
            <div key={index}>{item.title}</div>
          ))}
        </div>
      </div>
    </Card>
  );
}
