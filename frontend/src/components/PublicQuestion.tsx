import { useState } from "react";
import { BarChart2, MessageSquareText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { type PublicPost } from "@/Pages/my_posts";
import { useNavigate } from "react-router-dom";

export default function QuestionCard({ post }: { post: PublicPost }) {
  const [followed, setFollowed] = useState(false);

  return (
    <Card className="flex flex-row items-start gap-3 px-10 py-11 rounded-lg border border-gray-200 shadow-none">
      <div className="w-6 h-6 rounded bg-gray-300 shrink-0 flex items-center justify-center">
        <BarChart2 className="w-4 h-4 text-gray-500 shrink-0 flex items-start justify-start" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="container">
          <p className="font-semibold text-lg text-black font-spacegrotesk truncate">
            {post.user}
          </p>
          <p className="text-sm text-gray-500 font-spacegrotesk">{post.time}</p>
        </div>

        <div className="font-semibold text-2xl text-black font-spacegrotesk">
          <p style={{ marginBottom: "20px" }}>{post.questionTitle}</p>
        </div>
        <div className="text-base text-black font-spacegrotesk">
          <p style={{ marginBottom: "20px" }}>{post.questionText}</p>
        </div>

        <button className="w-13 h-8 rounded outline outline-2 outline-gray-300 shrink-0 flex items-center justify-center gap-2">
          <MessageSquareText className="w-4 h-4 text-gray-500 shrink-0 flex items-start justify-start" />
          <p className="text-gray-600 font-spacegrotesk">
            {post.responsesCount}
          </p>
        </button>
      </div>
    </Card>
  );
}
