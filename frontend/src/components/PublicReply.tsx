import { useState } from "react";
import { BarChart2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { type PublicResponse } from "@/Pages/view_post";

export default function ReplyCard({ response }: { response: PublicResponse }) {
  const [followed, setFollowed] = useState(false);

  return (
    <Card className="flex flex-row items-start gap-3 px-10 py-11 rounded-lg border border-gray-200 shadow-none">
      <div className="w-6 h-6 rounded bg-gray-300 shrink-0 flex items-center justify-center">
        <BarChart2 className="w-4 h-4 text-gray-500 shrink-0 flex items-start justify-start" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="container">
          <p className="font-semibold text-lg text-black font-spacegrotesk truncate">
            {response.user}
          </p>
          <p className="text-sm text-gray-500 font-spacegrotesk">
            {response.time}
          </p>
        </div>

        <div className="text-base text-black font-spacegrotesk">
          <p style={{ marginBottom: "20px" }}>{response.answer}</p>
        </div>
      </div>
    </Card>
  );
}
