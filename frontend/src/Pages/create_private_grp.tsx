import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


export default function CreatePrivateGrp() {
  const navigate = useNavigate();
  
  return (
    
    <div
      className="flex flex-col min-h-screen w-screen"
      
    >
      {/* Top black navbar — placeholder, matches profile_page.tsx */}
      <div className="w-full h-20 bg-black shrink-0" />

      <div className="flex flex-1">
        {/* Red sidebar — placeholder, matches profile_page.tsx */}
        <div className="w-32 bg-[#B11D1D] p-4 flex flex-col shrink-0">
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-20 w-full bg-white">
                <CardContent className="p-0" />
              </Card>
            ))}
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-lightgrey)] p-8">
          {/* Back arrow */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(-1);
            }}
            className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-[var(--font-spacegrotesk)]">
              Back
            </span>
          </button>

          {/* ── Private Group Dashboard ────────────────────────────────────────────────── */}
          <section className="mb-6">
            <h1 className="headers text-3xl mb-3 text-left">
              Create New Private Group
            </h1>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">
                {/* Search bar */}
                <h3 className="headers text-xl text-left">
                    Title
                </h3>
                <Textarea
                      placeholder="Enter title..."
                      className="mt-1 md:text-lg"
                    />

                <h3 className="headers text-xl text-left">
                    Description
                </h3>
                <Textarea
                      placeholder="Enter description..."
                      className="mt-2 min-h-80 md:text-lg"
                    />
                <button className="w-40 h-8 rounded outline outline-2 outline-gray-300 shrink-0 flex items-center justify-center gap-2">
          
                    <p className="text-gray-600"> + Add Members</p>
                </button>

                <button className="my-button w-22 h-10 rounded shrink-0 gap-2">
                    
                Create
                </button>

               
              </CardContent>
            </Card>
          </section>

           
        </div>
      </div>
    </div>
  );
}
