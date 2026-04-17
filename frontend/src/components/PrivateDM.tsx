import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { type DM } from "@/Pages/private_group_dash";
import './PrivateGroupStyle.css';

export default function PrivateDM({ dm }: { dm: DM }) {
  
  return (
    <Card className="flex flex-row items-center gap-4 px-10 py-5 rounded-lg border border-gray-200 shadow-none">
      <div className="w-15 h-15 rounded-full bg-gray-300 shrink-0 flex items-center justify-center">
        <User className="w-10 h-10 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="container">
            <p className="font-semibold text-xl text-black font-[var(--font-spacegrotesk)] truncate">
            {dm.username}
            </p>
            <p className="text-base text-gray-500 font-[var(--font-spacegrotesk)]">
            {dm.last_msg}
            </p>
        </div>
      </div>

     
    </Card>
  );
}
