import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  MessageSquare,
  Users,
  Briefcase,
  ChevronRight,
  Heart,
  Clock,
  TrendingUp,
  MessageCircle,
  Star,
  ArrowRight,
} from "lucide-react";

// ─── Mock data (mirrors real pages) ──────────────────────────────────────────

const FEATURED_COMPANIES = [
  {
    id: "1",
    name: "Company 1",
    tagline: "Software · Cloud · Data Analytics",
    alumni: 3,
    openRoles: 4,
    followed: false,
  },
  {
    id: "2",
    name: "Company 2",
    tagline: "Fintech · Product · Design",
    alumni: 2,
    openRoles: 2,
    followed: true,
  },
  {
    id: "3",
    name: "Company 3",
    tagline: "Healthcare · Engineering · Research",
    alumni: 5,
    openRoles: 6,
    followed: false,
  },
];

const RECENT_POSTS = [
  {
    id: 1,
    user: "Sophia A",
    time: "2 hrs ago",
    title: "Alumni from Company 1! Any advice on interviews?",
    replies: 2,
  },
  {
    id: 4,
    user: "Ben C",
    time: "4 hrs ago",
    title: "Does anyone know how I can improve my portfolio?",
    replies: 10,
  },
  {
    id: 7,
    user: "Colin H",
    time: "5 hrs ago",
    title: "Alumni who have done a co-op at Company 1 before working there?",
    replies: 3,
  },
];

const OPEN_ROLES = [
  {
    id: "r1",
    company: "Company 1",
    companyId: "1",
    title: "Software Engineer Co-op",
    salary: "$35/hr",
    deadline: "Apr 15, 2025",
    tags: ["CS", "CE"],
  },
  {
    id: "r2",
    company: "Company 1",
    companyId: "1",
    title: "Data Analyst Co-op",
    salary: "$30/hr",
    deadline: "Apr 15, 2025",
    tags: ["DS", "Math"],
  },
  {
    id: "r3",
    company: "Company 3",
    companyId: "3",
    title: "Product Management Co-op",
    salary: "$32/hr",
    deadline: "May 1, 2025",
    tags: ["Business", "CS"],
  },
];

const STATS = [
  { label: "Companies Saved", value: "4", icon: Building2, color: "bg-red-100 text-[#b11d1d]" },
  { label: "New Messages", value: "12", icon: MessageSquare, color: "bg-red-100 text-[#b11d1d]" },
  { label: "Active Groups", value: "3", icon: Users, color: "bg-red-100 text-[#b11d1d]" },
];

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-lightgrey)] -m-8 p-8">

      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#b11d1d] to-[#7a1212] p-10 text-white shadow-md flex items-center justify-between">
        <div>
          <p className="text-white/90 text-md font-spacegrotesk mb-1">
            Wednesday, March 25 {/* Replace with current date */}
          </p>
          <h1 className="text-3xl font-fredoka font-semibold py-5">
            Welcome back, Riya!
          </h1>
        </div>
        <div className="flex gap-6">
          <button
            onClick={() => navigate("/company/1")}
            className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-spacegrotesk transition border border-white/30"
          >
            Browse Co-ops
          </button>
          <button
            onClick={() => navigate("/setup")}
            className="px-4 py-2 rounded-full bg-white text-[#b11d1d] text-sm font-spacegrotesk font-semibold hover:bg-white/90 transition"
          >
            My Profile
          </button>
        </div>
      </div>

      {/* ── Stat chips ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="rounded-xl border-0 shadow-sm bg-black">
            <CardContent className="py-4 px-10 flex items-center gap-4">
              <div className={`w-15 h-15 rounded-full flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-10 h-10" />
              </div>
              <div>
                <p className="text-3xl font-fredoka font-bold text-[#b11d1d] leading-none">
                  {value}
                </p>
                <p className="text-md text-white font-spacegrotesk mt-1">
                  {label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-6">

        {/* ── Featured Companies (2/3 width) ─────────────────────────────── */}
        <div className="col-span-2 flex flex-col gap-6">

          {/* Companies widget */}
          <Card className="rounded-xl border-0 shadow-sm bg-gray-300">
            <CardContent className="py-4 px-7">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 pl-2 pb-2">
                  <Building2 className="w-10 h-10 text-[#b11d1d] mr-3" />
                  <h2 className="text-2xl font-spacegrotesk font-semibold text-gray-900">
                    Featured Companies
                  </h2>
                </div>
                <Link
                  to="/company/1"
                  className="text-md text-[#b11d1d] font-spacegrotesk flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex flex-col gap-3 ">
                {FEATURED_COMPANIES.map((co) => (
                  <div
                    key={co.id}
                    className="flex items-center bg-white gap-4 p-3 pl-5 rounded-xl border border-gray-100 hover:border-[#b11d1d]/30 hover:bg-red-50/30 transition cursor-pointer group"
                    onClick={() => navigate(`/company/${co.id}`)}
                  >
                    {/* Company logo placeholder */}
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Building2 className="w-7 h-7 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0 pl-2">
                      <p className="font-spacegrotesk font-semibold text-gray-900 text-lg">
                        {co.name}
                      </p>
                      <p className="text-md text-gray-500 font-spacegrotesk truncate">
                        {co.tagline}
                      </p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-md text-gray-400 font-spacegrotesk flex items-center gap-1">
                          <Star className="w-3 h-3" /> {co.alumni} alumni
                        </span>
                        <span className="text-md text-gray-400 font-spacegrotesk flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {co.openRoles} roles
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {co.followed && (
                        <Heart className="w-4 h-4 fill-[#b11d1d] text-[#b11d1d]" />
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#b11d1d] transition" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Open Roles widget */}
          <Card className="rounded-xl border-0 shadow-sm bg-gray-300">
            <CardContent className="py-4 px-7">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 pl-2 pb-2">
                  <TrendingUp className="w-10 h-10 text-[#b11d1d] mr-3" />
                  <h2 className="text-2xl font-spacegrotesk font-semibold text-gray-900">
                    Open Roles For You
                  </h2>
                </div>
                <Link
                  to="/company/1"
                  className="text-md text-[#b11d1d] font-spacegrotesk flex items-center gap-1 hover:underline"
                >
                  Browse all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {OPEN_ROLES.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center bg-white gap-4 p-3 pl-5 py-5 rounded-xl border border-gray-100 hover:border-[#b11d1d]/30 hover:bg-red-50/30 transition cursor-pointer group"
                    onClick={() => navigate(`/company/${role.companyId}`)}
                  >
                    <div className="w-14 h-14 rounded-lg bg-[#b11d1d]/10 flex items-center justify-center shrink-0">
                      <Briefcase className="w-7 h-7 text-[#b11d1d]" />
                    </div>
                    <div className="flex-1 min-w-0 pl-2">
                      <p className="font-spacegrotesk font-semibold text-gray-900 text-lg">
                        {role.title}
                      </p>
                      <p className="text-md text-gray-500 font-spacegrotesk">
                        {role.company} · {role.salary}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-md text-gray-400 font-spacegrotesk flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {role.deadline}
                      </p>
                      <div className="flex gap-1 mt-1 justify-end">
                        {role.tags.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-500 font-spacegrotesk"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ── Right column (1/3 width) ────────────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Message Board widget */}
          <Card className="rounded-xl border-0 shadow-sm bg-gray-300">
            <CardContent className="py-4 px-7">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 pl-2 pb-2 ">
                  <MessageCircle className="w-10 h-10 text-[#b11d1d] mr-3" />
                  <h2 className="text-2xl font-spacegrotesk font-semibold text-gray-900">
                    Message Board
                  </h2>
                </div>
                <Link
                  to="/company_msgboard"
                  className="text-md text-[#b11d1d] font-spacegrotesk flex items-center gap-1 hover:underline"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {RECENT_POSTS.map((post) => (
                  <div
                    key={post.id}
                    className="p-3 pl-5 bg-white rounded-xl border border-gray-100 hover:border-[#b11d1d]/30 hover:bg-red-50/30 transition cursor-pointer"
                    onClick={() => navigate("/companypost")}
                  >
                    <p className="text-md font-spacegrotesk font-semibold text-gray-900 line-clamp-2 leading-snug">
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-md text-gray-400 font-spacegrotesk">
                        {post.user} · {post.time}
                      </span>
                      <span className="text-md text-gray-400 font-spacegrotesk flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {post.replies}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate("/companypost")}
                className="mt-3 w-full py-2 rounded-xl border border-dashed border-[#b11d1d]/40 text-[#b11d1d] text-xs font-spacegrotesk hover:bg-red-50 transition"
              >
                + Create a post
              </button>
            </CardContent>
          </Card>

          {/* Groups & Chats quick-links */}
          <Card className="rounded-xl border-0 shadow-sm bg-gray-300">
            <CardContent className="py-4 px-7">
              <h2 className="text-2xl pb-3 font-spacegrotesk font-semibold text-gray-900 mb-3">
                Quick Links
              </h2>
              <div className="flex flex-col gap-2">
                <Link to="/groups">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50 hover:bg-green-100 transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-md font-spacegrotesk font-semibold text-gray-800">
                        Groups
                      </p>
                      <p className="text-sm text-gray-500 font-spacegrotesk">
                        3 active groups
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                <Link to="/chats">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-md font-spacegrotesk font-semibold text-gray-800">
                        Chats
                      </p>
                      <p className="text-sm text-gray-500 font-spacegrotesk">
                        12 unread messages
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
                <Link to="/company/1">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 hover:bg-red-100 transition cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#b11d1d]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-md font-spacegrotesk font-semibold text-gray-800">
                        Companies
                      </p>
                      <p className="text-sm text-gray-500 font-spacegrotesk">
                        4 saved companies
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}