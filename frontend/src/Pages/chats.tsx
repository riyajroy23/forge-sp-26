import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatComponent from "@/components/Chat";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CURRENT_USER = { id: 1, display_name: "Alex Kim" };

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  initials: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "2",
    name: "Jordan Lee",
    lastMessage: "Hey, did you hear back from Company 1 yet?",
    time: "2m ago",
    unread: 2,
    initials: "JL",
  },
  {
    id: "3",
    name: "Sam Rivera",
    lastMessage: "Thanks for the portfolio tips!",
    time: "1h ago",
    unread: 0,
    initials: "SR",
  },
  {
    id: "4",
    name: "Taylor Chen",
    lastMessage: "Are you going to the info session on Thursday?",
    time: "3h ago",
    unread: 1,
    initials: "TC",
  },
  {
    id: "5",
    name: "Morgan Patel",
    lastMessage: "I just submitted my application!",
    time: "Yesterday",
    unread: 0,
    initials: "MP",
  },
  {
    id: "6",
    name: "Chris Johnson",
    lastMessage: "Let me know if you want to study together.",
    time: "Yesterday",
    unread: 0,
    initials: "CJ",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChatsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(
    MOCK_CONVERSATIONS[0].id
  );
  const [search, setSearch] = useState("");

  const filtered = MOCK_CONVERSATIONS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const selected = MOCK_CONVERSATIONS.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8 overflow-hidden">
      {/* ── Left panel: conversation list ── */}
      <div className="w-80 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-4 pt-5 pb-3">
          <h2 className="headers text-2xl mb-3">Chats</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg
                         font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                         focus:ring-[var(--color-darkred)]/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {filtered.length > 0 ? (
            filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition",
                  selectedId === conv.id && "bg-[var(--color-darkred)]/5 border-l-2 border-[var(--color-darkred)]"
                )}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[var(--color-darkred)]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-[var(--color-darkred)] font-[var(--font-spacegrotesk)]">
                    {conv.initials}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-900 font-[var(--font-spacegrotesk)] truncate">
                      {conv.name}
                    </p>
                    <span className="text-xs text-gray-400 font-[var(--font-spacegrotesk)] shrink-0 ml-2">
                      {conv.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 font-[var(--font-spacegrotesk)] truncate">
                      {conv.lastMessage}
                    </p>
                    {conv.unread > 0 && (
                      <span className="ml-2 shrink-0 w-5 h-5 rounded-full bg-[var(--color-darkred)] text-white text-xs flex items-center justify-center font-semibold">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-8 font-[var(--font-spacegrotesk)]">
              No conversations found.
            </p>
          )}
        </div>
      </div>

      {/* ── Right panel: chat window ── */}
      <div className="flex-1 flex flex-col bg-[var(--color-lightgrey)]">
        {selected ? (
          <ChatComponent
            user={MOCK_CURRENT_USER}
            type="dm"
            otherUserId={selected.id}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 font-[var(--font-spacegrotesk)]">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}
