import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import * as React from "react";
import { Calendar as CalendarIcon, Pencil, Upload, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ─── Reusable field row ───────────────────────────────────────────────────────

function FieldRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-xs text-gray-400 font-[var(--font-spacegrotesk)] uppercase tracking-wide mb-0.5">
          {label}
        </p>
        <p className="text-sm font-[var(--font-spacegrotesk)] text-gray-800">{value}</p>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200
                     text-gray-500 text-xs font-[var(--font-spacegrotesk)] hover:border-[#b11d1d]
                     hover:text-[#b11d1d] transition bg-white"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      )}
    </div>
  );
}

// ─── UserSetup ────────────────────────────────────────────────────────────────

export default function UserSetup() {
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="min-h-screen bg-[var(--color-lightgrey)] -m-8 p-8">

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="headers text-2xl">My Profile</h1>
        <p className="text-sm text-gray-500 font-[var(--font-spacegrotesk)] mt-1">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* ── Profile hero card ────────────────────────────────────────────── */}
      <Card className="rounded-xl border-0 shadow-sm bg-white mb-6">
        <CardContent className="p-6 flex items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-9 h-9 text-gray-400" />
            </div>
            <button
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#b11d1d] flex items-center
                         justify-center border-2 border-white hover:bg-[#8e1616] transition"
              aria-label="Change profile picture"
            >
              <Pencil className="w-3 h-3 text-white" />
            </button>
          </div>

          {/* Name / username */}
          <div className="flex-1">
            <p className="text-xl font-[var(--font-spacegrotesk)] font-bold text-gray-900">
              Riya Roy
            </p>
            <p className="text-sm text-gray-500 font-[var(--font-spacegrotesk)]">@riyaroy</p>
            <div className="mt-2 flex gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#b11d1d]/10 text-[#b11d1d] text-xs font-[var(--font-spacegrotesk)]">
                Computer Science
              </span>
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-[var(--font-spacegrotesk)]">
                Class of 2026
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="profile">
        <TabsList className="bg-white border border-gray-200 rounded-xl p-1 mb-4 shadow-sm">
          <TabsTrigger
            value="profile"
            className="rounded-lg font-[var(--font-spacegrotesk)] text-gray-500
                       data-[state=active]:bg-[#b11d1d] data-[state=active]:text-white
                       data-[state=active]:shadow-sm transition"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="rounded-lg font-[var(--font-spacegrotesk)] text-gray-500
                       data-[state=active]:bg-[#b11d1d] data-[state=active]:text-white
                       data-[state=active]:shadow-sm transition"
          >
            Account Info
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="rounded-lg font-[var(--font-spacegrotesk)] text-gray-500
                       data-[state=active]:bg-[#b11d1d] data-[state=active]:text-white
                       data-[state=active]:shadow-sm transition"
          >
            Details
          </TabsTrigger>
        </TabsList>

        {/* ── Profile tab ──────────────────────────────────────────────────── */}
        <TabsContent value="profile">
          <Card className="rounded-xl border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <h2 className="text-base font-[var(--font-spacegrotesk)] font-semibold text-gray-900 mb-4">
                Public Profile
              </h2>

              {/* Display name */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 font-[var(--font-spacegrotesk)] uppercase tracking-wide block mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  defaultValue="Riya Roy"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                             font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                             focus:ring-[#b11d1d]/40 text-gray-800"
                />
              </div>

              {/* Username */}
              <div className="mb-4">
                <label className="text-xs text-gray-400 font-[var(--font-spacegrotesk)] uppercase tracking-wide block mb-1">
                  Username
                </label>
                <input
                  type="text"
                  defaultValue="@riyaroy"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
                             font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                             focus:ring-[#b11d1d]/40 text-gray-800"
                />
              </div>

              {/* Bio */}
              <div className="mb-5">
                <label className="text-xs text-gray-400 font-[var(--font-spacegrotesk)] uppercase tracking-wide block mb-1">
                  Bio
                </label>
                <Textarea
                  placeholder="Tell us a little about yourself..."
                  className="font-[var(--font-spacegrotesk)] text-sm text-gray-800 focus:ring-2
                             focus:ring-[#b11d1d]/40 border-gray-200 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 rounded-lg bg-[#b11d1d] text-white text-sm
                             font-[var(--font-spacegrotesk)] hover:bg-[#8e1616] transition"
                >
                  Save Changes
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Account Info tab ─────────────────────────────────────────────── */}
        <TabsContent value="account">
          <Card className="rounded-xl border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <h2 className="text-base font-[var(--font-spacegrotesk)] font-semibold text-gray-900 mb-2">
                Account Information
              </h2>
              <FieldRow label="Email" value="riya@example.com" onEdit={() => {}} />
              <FieldRow label="Date of Birth" value="January 1, 2002" onEdit={() => {}} />

              {/* Resume */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-[var(--font-spacegrotesk)] uppercase tracking-wide mb-0.5">
                    Resume
                  </p>
                  <p className="text-sm font-[var(--font-spacegrotesk)] text-gray-800">resume.pdf</p>
                </div>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200
                             text-gray-500 text-xs font-[var(--font-spacegrotesk)] hover:border-[#b11d1d]
                             hover:text-[#b11d1d] transition bg-white"
                >
                  <Upload className="w-3 h-3" />
                  Upload new
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Details tab ──────────────────────────────────────────────────── */}
        <TabsContent value="details">
          <Card className="rounded-xl border-0 shadow-sm bg-white">
            <CardContent className="p-6">
              <h2 className="text-base font-[var(--font-spacegrotesk)] font-semibold text-gray-900 mb-2">
                Academic Details
              </h2>

              <FieldRow label="Major" value="Computer Science" onEdit={() => {}} />
              <FieldRow label="Minor(s)" value="Mathematics" onEdit={() => {}} />

              {/* Graduation Year */}
              <div className="py-4">
                <p className="text-xs text-gray-400 font-[var(--font-spacegrotesk)] uppercase tracking-wide mb-2">
                  Graduation Date
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-60 justify-start text-left text-sm font-[var(--font-spacegrotesk)]",
                        "border-gray-200 bg-white hover:border-[#b11d1d] hover:bg-white",
                        "focus:ring-2 focus:ring-[#b11d1d]/40",
                        !date && "text-gray-400"
                      )}
                    >
                      <CalendarIcon className="mr-2 w-4 h-4 text-gray-400" />
                      {date ? format(date, "MMMM yyyy") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-50 w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-xl">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}