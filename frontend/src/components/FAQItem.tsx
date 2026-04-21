import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}
export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white transition-all duration-200">
      {/* Question */}
      <button
        onClick={() => setOpen(o => !o)}
        className="
          w-full flex items-center justify-between gap-4
          px-5 py-4 text-left !bg-transparent
          hover:bg-gray-50 transition-colors
        "
      >
        <span
          className="
            font-medium text-black text-lg
            font-[var(--font-spacegrotesk)]
            transition-colors duration-200
          "
        >
          {question}
        </span>

        <ChevronDown
          className={`
            w-5 h-5 text-gray-500 shrink-0
            transition-transform duration-300
            ${open ? "rotate-180 text-[#B11D1D]" : ""}
          `}
        />
      </button>

      {/* Answer */}
      <div
        className={`
          grid transition-all duration-300 ease-in-out
          ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
        `}
      >
        <div className="overflow-hidden">
          <p
            className="
              px-5 pb-4 pt-0
              text-md text-gray-600
              font-[var(--font-spacegrotesk)]
              leading-relaxed
            "
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}