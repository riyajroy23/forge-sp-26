import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, Upload, User, Calendar as CalendarIcon } from "lucide-react";
import { api } from "../lib/api";
import recoopLogo from "../assets/images/recoop-logo2.png";
import * as React from "react";
import {
  Calendar as CalendarIcon,
  Pencil,
  Upload,
  User,
  Check,
  X,
  Camera,
  FileText,
  GraduationCap,
  BookOpen,
  Mail,
  Cake,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function EditableField({
  label,
  value,
  icon,
  type = "text",
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  type?: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  const [editing, setEditing] = React.useState(false);
  const [current, setCurrent] = React.useState(value);
  const [draft, setDraft] = React.useState(value);

  const save = () => {
    setCurrent(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(current);
    setEditing(false);
  };

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {icon && <span className="text-[#b11d1d]">{icon}</span>}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-[var(--font-spacegrotesk)]">
              {label}
            </p>
          </div>

          {editing ? (
            <div className="flex flex-col gap-2">
              {multiline ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={placeholder}
                  rows={3}
                  autoFocus
                  className="w-full px-3 py-2 text-base border border-[#b11d1d]/40 rounded-lg
                             font-[var(--font-spacegrotesk)] text-gray-800 focus:outline-none
                             focus:ring-2 focus:ring-[#b11d1d]/30 resize-none bg-red-50/30"
                />
              ) : (
                <input
                  type={type}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={placeholder}
                  autoFocus
                  className="w-full px-3 py-2 text-base border border-[#b11d1d]/40 rounded-lg
                             font-[var(--font-spacegrotesk)] text-gray-800 focus:outline-none
                             focus:ring-2 focus:ring-[#b11d1d]/30 bg-red-50/30"
                />
              )}
              <div className="flex gap-2">
                <button
                  onClick={save}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b11d1d]
                             text-[#ffffff] text-sm font-[var(--font-spacegrotesk)] hover:bg-[#8e1616] transition"
                >
                  <Check className="w-3.5 h-3.5" /> Save
                </button>
                <button
                  onClick={cancel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200
                             text-gray-500 text-sm font-[var(--font-spacegrotesk)] hover:bg-gray-50 transition"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-lg font-[var(--font-spacegrotesk)] text-gray-800">
              {current || <span className="text-gray-400 italic">{placeholder ?? "Not set"}</span>}
            </p>
          )}
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200
                       text-gray-500 text-sm font-[var(--font-spacegrotesk)] hover:border-[#b11d1d]
                       hover:text-[#b11d1d] transition bg-[#ffffff] shrink-0 mt-1"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
}


function FileUploadField({
  label,
  icon,
  accept,
  fileName,
}: {
  label: string;
  icon?: React.ReactNode;
  accept: string;
  fileName: string;
}) {
  const [currentFile, setCurrentFile] = React.useState(fileName);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCurrentFile(file.name);
  };

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {icon && <span className="text-[#b11d1d]">{icon}</span>}
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest font-[var(--font-spacegrotesk)]">
              {label}
            </p>
          </div>
          <p className="text-xl font-[var(--font-spacegrotesk)] text-gray-800 truncate">
            {currentFile}
          </p>
        </div>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleChange} />
        <button
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200
                     text-gray-500 text-md font-[var(--font-spacegrotesk)] hover:border-[#b11d1d]
                     hover:text-[#b11d1d] transition bg-[#ffffff] shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload new
        </button>
      </div>
    </div>
  );
}

// ─── Date picker field ────────────────────────────────────────────────────────

function DatePickerField({ label, icon }: { label: string; icon?: React.ReactNode }) {
  const [date, setDate] = React.useState<Date>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = React.useState<any>(null);
  const [bio, setBio] = React.useState('');
  const [major, setMajor] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState('');

  const handleSave = async () => {
    if (!user) return;
    setMessage('');
    try {
      const res = await api.updateProfile(user.user_id, { bio, major });
      if (res.success) {
        setMessage('Profile updated successfully!');
        setUser(res.data.user);
      } else {
        setMessage(res.error || 'Failed to update profile');
      }
    } catch {
      setMessage('An error occurred while saving.');
    }
  };

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.getMe();
        if (res.success && res.data && res.data.user) {
          const currentUser = res.data.user;
          setUser(currentUser);
          setBio(currentUser.bio || '');
          setMajor(currentUser.major || '');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <div className="min-h-screen bg-[var(--color-lightgrey)] p-10 flex items-center justify-center">Loading...</div>;

  return (
    <div className="py-5 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            {icon && <span className="text-[#b11d1d]">{icon}</span>}
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest font-[var(--font-spacegrotesk)]">
              {label}
            </p>
          </div>
          <p className="text-xl font-[var(--font-spacegrotesk)] text-gray-800">
            {date ? format(date, "MMMM d, yyyy") : <span className="text-gray-400 italic">Not set</span>}
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 h-auto",
                "text-gray-500 text-md font-[var(--font-spacegrotesk)] hover:border-[#b11d1d]",
                "hover:text-[#b11d1d] transition bg-[#ffffff] shrink-0"
              )}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              {date ? "Change" : "Set date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="z-50 w-auto p-0 bg-[#ffffff] border border-gray-200 shadow-lg rounded-xl">
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}


export default function UserSetup() {
  const [bio, setBio] = React.useState("");
  const [displayName, setDisplayName] = React.useState("Riya Roy");
  const [username, setUsername] = React.useState("@riyaroy");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-lightgrey)] -m-8">
      <div className="bg-[#911616] px-10 pt-10 pb-25">
        <div className="flex items-end gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 rounded-full bg-[#ffffff]/20 border-4 border-[#ffffff]/30 flex items-center justify-center overflow-hidden shadow-xl">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-14 h-14 text-[#ffffff]/60" />
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#ffffff] flex items-center
                         justify-center shadow-md hover:bg-gray-100 transition"
              aria-label="Change profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name block */}
          <div className="pb-1 mt-3">
            <h1 className="text-3xl font-spacegrotesk text-[#ffffff] font-semibold leading-tight">
              {displayName}
            </h1>
            <p className="text-[#ffffff]/70 text-xl mt-1">{username}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-[#ffffff]/20 text-[#ffffff] text-md">
                Computer Science
              </span>
              <span className="px-3 py-1 rounded-full bg-[#ffffff]/10 text-[#ffffff]/80 text-md">
                Class of 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="-mt-15 pl-10 px-8 pb-10">
        <Tabs defaultValue="profile">
          <TabsList className="bg-[#ffffff] border border-gray-200 rounded-xl p-1 mb-5 shadow-md w-fit">
            {["profile", "account", "details"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-lg px-5 py-2 text-base font-[var(--font-spacegrotesk)] text-gray-500
                           data-[state=active]:bg-[#b11d1d] data-[state=active]:text-[#ffffff]
                           data-[state=active]:shadow-sm transition capitalize"
              >
                {tab === "account" ? "Account Info" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Profile tab  */}
          <TabsContent value="profile">
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2">
                <Card className="rounded-2xl border-0 shadow-sm bg-[#ffffff]">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-semibold font-[var(--font-spacegrotesk)] text-gray-900 mb-6">
                      Public Profile
                    </h2>

                    {/* Display name */}
                    <div className="mb-5">
                      <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest font-[var(--font-spacegrotesk)] block mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full px-4 py-3 text-xl border border-gray-200 rounded-xl
                                   font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                                   focus:ring-[#b11d1d]/30 text-gray-800 bg-gray-50"
                      />
                    </div>

                    {/* Username */}
                    <div className="mb-5">
                      <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest font-[var(--font-spacegrotesk)] block mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 text-xl border border-gray-200 rounded-xl
                                   font-[var(--font-spacegrotesk)] focus:outline-none focus:ring-2
                                   focus:ring-[#b11d1d]/30 text-gray-800 bg-gray-50"
                      />
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest font-[var(--font-spacegrotesk)] block mb-2">
                        Bio
                      </label>
                      <Textarea
                        placeholder="Tell us a little about yourself..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="font-[var(--font-spacegrotesk)] text-xl text-gray-800 focus:ring-2
                                   focus:ring-[#b11d1d]/30 border-gray-200 resize-none bg-gray-50 rounded-xl px-4 py-3"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="px-6 py-2.5 rounded-xl bg-[#b11d1d] text-[#ffffff] text-base
                                   font-[var(--font-spacegrotesk)] font-semibold hover:bg-[#8e1616] transition shadow-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Side stats card */}
              <div className="col-span-1 flex flex-col gap-4">
                <Card className="rounded-2xl border-0 shadow-sm bg-gray-300 px-5">
                  <CardContent className="p-6 flex flex-col gap-4">
                    <p className="text-2xl font-semibold text-[#000000] font-[var(--font-spacegrotesk)]">
                      Activity
                    </p>
                    {[
                      { label: "Groups Joined", value: "3" },
                      { label: "Companies Saved", value: "4" },
                      { label: "Friends", value: "7" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <p className="text-base text-gray-800 font-[var(--font-spacegrotesk)]">{label}</p>
                        <p className="text-3xl font-fredoka font-bold text-[#b11d1d]">{value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ── Account Info tab ──────────────────────────────────────────── */}
          <TabsContent value="account">
            <Card className="rounded-2xl border-0 shadow-sm bg-[#ffffff]">
              <CardContent className="px-8 py-6">
                <h2 className="text-2xl font-semibold font-[var(--font-spacegrotesk)] text-gray-900 mb-2">
                  Account Information
                </h2>
                <p className="text-base text-gray-400 font-[var(--font-spacegrotesk)] mb-4">
                  Manage your login and personal details.
                </p>

                <EditableField
                  label="Email"
                  value="riya@northeastern.edu"
                  icon={<Mail className="w-4 h-4" />}
                  type="email"
                  placeholder="your@northeastern.edu"
                />
                <DatePickerField
                  label="Date of Birth"
                  icon={<Cake className="w-4 h-4" />}
                />
                <FileUploadField
                  label="Resume"
                  icon={<FileText className="w-4 h-4" />}
                  accept=".pdf,.doc,.docx"
                  fileName="resume.pdf"
                />
                <EditableField
                  label="LinkedIn"
                  value=""
                  icon={<User className="w-4 h-4" />}
                  type="url"
                  placeholder="https://linkedin.com/in/yourname"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details tab */}
          <TabsContent value="details">
            <Card className="rounded-2xl border-0 shadow-sm bg-[#ffffff]">
              <CardContent className="px-8 py-6">
                <h2 className="text-2xl font-semibold font-[var(--font-spacegrotesk)] text-gray-900 mb-2">
                  Academic & Career Details
                </h2>
                <p className="text-base text-gray-400 font-[var(--font-spacegrotesk)] mb-4">
                  Help others find and connect with you.
                </p>

                <EditableField
                  label="Major"
                  value="Computer Science"
                  icon={<GraduationCap className="w-4 h-4" />}
                  placeholder="e.g. Computer Science"
                />
                <EditableField
                  label="Minor(s)"
                  value="Mathematics"
                  icon={<BookOpen className="w-4 h-4" />}
                  placeholder="e.g. Mathematics"
                />
                <EditableField
                  label="Career Interests"
                  value="Software Engineering, Product"
                  icon={<User className="w-4 h-4" />}
                  placeholder="e.g. Software Engineering, Design"
                />
                <EditableField
                  label="Current Company / Co-op"
                  value=""
                  icon={<User className="w-4 h-4" />}
                  placeholder="e.g. Google"
                />
                <EditableField
                  label="Previous Experience"
                  value=""
                  icon={<User className="w-4 h-4" />}
                  multiline
                  placeholder="Describe past co-ops or internships..."
                />
                <DatePickerField
                  label="Graduation Date"
                  icon={<CalendarIcon className="w-4 h-4" />}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
