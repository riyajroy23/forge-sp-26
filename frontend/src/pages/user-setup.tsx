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
 

export default function UserSetup() {
  const [date, setDate] = React.useState<Date>()
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
                  <p className="text-left font-semibold">username</p>
                  <p className="text-left font-normal">name</p>
                </div>

              </div>

              {/* BIO */}
              <div>
                <label className="text-left font-normal">Bio</label>
                <Textarea
                  placeholder="Tell us a little about yourself..."
                  className="mt-1"
                />
              </div>

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
                    <p className="text-sm text-gray-600">user@email.com</p>
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
                  <div className="text-left">
                    <p className="text-sm font-semibold">Major</p>
                    <p className="text-sm text-gray-600">major here</p>
                  </div>

                  <button className="text-sm text-gray-200 bg-gray-100 hover:bg-gray-700">
                    Edit
                  </button>
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

              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}