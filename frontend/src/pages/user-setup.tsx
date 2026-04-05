import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {Tabs,TabsContent, TabsList, TabsTrigger,} from "@/components/ui/tabs"
import { format } from "date-fns"
import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "../lib/api"
 

export default function UserSetup() {
  const [date, setDate] = React.useState<Date>()
  const [user, setUser] = React.useState<any>(null);
  const [bio, setBio] = React.useState('');
  const [major, setMajor] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getMe();
        if (res.success) {
            setUser(res.data.user);
            setBio(res.data.user.bio || '');
            setMajor(res.data.user.major || '');
        }
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setMessage('');
    try {
        const res = await api.updateProfile(user.user_id, {
            bio,
            major
        });
        if (res.success) {
            setMessage('Profile updated successfully!');
            setUser(res.data.user);
        } else {
            setMessage(res.error || 'Failed to update profile');
        }
    } catch (err) {
        setMessage('An error occurred while saving.');
    }
  };

  if (loading) return <div className="text-white bg-red-900 min-h-screen p-10 flex items-center justify-center">Loading...</div>;

  return ( 
    <Tabs defaultValue="profile" className="w-[400px]">
      <TabsList className="bg-red-900 text-white">
        <TabsTrigger
          value="profile"
          className="text-white data-[state=active]:bg-gray-500 data-[state=active]:bg-gray-900
        data-[state=active]:text-white"

        > Profile
        </TabsTrigger>

        <TabsTrigger
          value="account"
          className="text-white data-[state=active]:bg-gray-500 data-[state=active]:bg-gray-900
        data-[state=active]:text-white"
        >
          Account Info
        </TabsTrigger>

        <TabsTrigger
          value="details"
          className="text-white data-[state=active]:bg-gray-500 data-[state=active]:bg-gray-900
        data-[state=active]:text-white"
        >
          Details
        </TabsTrigger>
      </TabsList>


      <TabsContent value="profile">
        <div className="min-h-screen flex items-center justify-center bg-red-900">
          <Card className="w-full max-w-md">
            <CardTitle>My Profile </CardTitle>
            <CardContent className="p-6">

              {/* Username */}
              <div className="flex items-center gap-4">
                <button
                  className="w-16 h-16 rounded-full bg-gray-300 hover:bg-gray-400 transition"
                  aria-label="Edit profile picture"
                />

                <div>
                  <p className="text-left font-semibold">{user?.username || 'username'}</p>
                  <p className="text-left font-normal">{user?.first_name || 'Name'} {user?.last_name || ''}</p>
                </div>

              </div>

              {/* BIO */}
              <div>
                <label className="text-left font-normal">Bio</label>
                <Textarea
                  placeholder="Tell us a little about yourself..."
                  className="mt-1"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>

              {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
              <Button onClick={handleSave} className="mt-4 w-full">Save Changes</Button>

            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="account">
        <div className="min-h-screen flex items-center justify-center bg-red-900">
          <Card className="w-full max-w-md">
            <CardTitle>My Account</CardTitle>
            <CardContent className="p-6">

              <div className="space-y-3">

                {/* Email */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold">Email</p>
                    <p className="text-sm text-gray-600">{user?.email || 'user@email.com'}</p>
                  </div>

                  <button className="text-sm text-gray-200 bg-gray-100 hover:bg-gray-700">
                    Edit
                  </button>
                </div>

                {/* DOB */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold">Date of Birth</p>
                    <p className="text-sm text-gray-600">01 / 01 / 2002</p>
                  </div>

                  <button className="text-sm text-gray-200 bg-gray-100 hover:bg-gray-700">
                    Edit
                  </button>
                </div>

                {/* Resume */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold">Resume</p>
                    <p className="text-sm text-gray-600">resume.pdf</p>
                  </div>

                  {/* Dropdown will go here */}
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="details">
        <div className="min-h-screen flex items-center justify-center bg-red-900">
          <Card className="w-full max-w-md">
            <CardTitle>Details</CardTitle>
            <CardContent className="p-6">

              <div className="space-y-3">

                {/* Major */}
                <div className="flex items-center justify-between">
                  <div className="text-left w-full mr-4">
                    <p className="text-sm font-semibold">Major</p>
                    <input 
                      type="text" 
                      className="text-sm text-gray-600 border p-1 rounded mt-1 w-full" 
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>

                {/* Minor */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold">Minor(s)</p>
                    <p className="text-sm text-gray-600">minor(s) here</p>
                  </div>

                  <button className="text-sm text-gray-200 bg-gray-100 hover:bg-gray-700">
                    Edit
                  </button>
                </div>

                {/* Graduation Year */}
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-semibold">Graduation year</p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          data-empty={!date}
                          className="w-[280px] justify-start text-left font-normal
                                    bg-gray-100 text-gray-100
                                    hover:bg-gray-200
                                    data-[empty=true]:text-muted-foreground"
                        >
                          <CalendarIcon />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="z-50 w-auto p-0 bg-red-800 text-white border-gray-700">
                        <Calendar className="text-white
                                            [&_button]:text-white
                                            [&_button:hover]:bg-gray-700
                                            [&_[aria-selected=true]]:bg-gray-600
                                            "mode="single" selected={date} onSelect={setDate} />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Dropdown will go here */}
                </div>
                
                {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
                <Button onClick={handleSave} className="mt-4 w-full">Save Details</Button>

              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}