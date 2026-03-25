import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="!bg-transparent w-full flex items-center justify-between py-3 text-left gap-2"
      >
        <span className="text-sm font-semibold text-black font-[var(--font-spacegrotesk)]">
          {question}
        </span>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
      </button>

      {open && (
        <p className="pb-3 text-sm text-gray-600 font-[var(--font-spacegrotesk)]">
          {answer}
        </p>
      )}
    </div>
  );
}
