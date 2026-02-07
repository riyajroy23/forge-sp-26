import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


export default function UserSetup() {
  return (
    <Tabs defaultValue="profile" className="w-[400px]">
      <TabsList className="bg-gray-700 text-white">
        <TabsTrigger
          value="profile"
          className="text-white data-[state=active]:bg-gray-900 data-[state=active]:bg-gray-900
        data-[state=active]:text-white"

        >
          Profile

        </TabsTrigger>

        <TabsTrigger
          value="account"
          className="text-white data-[state=active]:bg-gray-900 data-[state=active]:bg-gray-900
        data-[state=active]:text-white"
        >
          Account Info
        </TabsTrigger>
      </TabsList>


      <TabsContent value="profile">
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-md">
            <CardTitle>My Profile </CardTitle>
            <CardContent className="p-6">


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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Card className="w-full max-w-md">
            <CardTitle>My Account</CardTitle>
            <CardContent className="p-6">

              <div className="space-y-3">

                {/* Email */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Email</p>
                    <p className="text-sm text-gray-600">user@email.com</p>
                  </div>

                  <button className="text-sm text-blue-600 hover:underline">
                    Edit
                  </button>
                </div>

                {/* DOB */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Date of Birth</p>
                    <p className="text-sm text-gray-600">01 / 01 / 2002</p>
                  </div>

                  <button className="text-sm text-blue-600 hover:underline">
                    Edit
                  </button>
                </div>

                {/* Resume */}
                <div className="flex items-center justify-between">
                  <div>
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
    </Tabs>
  );
}