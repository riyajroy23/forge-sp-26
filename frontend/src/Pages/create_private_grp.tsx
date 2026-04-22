import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getToken, getUser } from "@/lib/auth";
import AddMembersModal from "@/components/AddMembersModal";

const API_URL = 'http://localhost:3000/api';

export default function CreatePrivateGrp() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);

  const handleCreate = async () => {
    setError('');

    // validate required fields
    if (!title.trim() || !description.trim()) {
      setError('Title and description are required.');
      return;
    }

    setLoading(true);

    try {
      const token = getToken();
      const user = getUser();

      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: title,
          description,
          owner_id: user?.id
        })
      });

      if (!response.ok) {
        setError('Failed to create group. Please try again.');
        return;
      }

      // navigate back to private group dashboard on success
      navigate('/private_msg_dash');

    } catch (err) {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen">
      {/* Top black navbar — placeholder */}
      <div className="w-full h-20 bg-black shrink-0" />
      <div className="flex flex-1">
        {/* Red sidebar — placeholder */}
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
          <button
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            className="flex items-center gap-1 text-gray-600 hover:text-black mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-[var(--font-spacegrotesk)]">Back</span>
          </button>

          <section className="mb-6">
            <h1 className="headers text-3xl mb-3 text-left">Create New Private Group</h1>
            <Card className="rounded-xl border-0 shadow-sm bg-white">
              <CardContent className="p-6 flex flex-col gap-3">

                <h3 className="headers text-xl text-left">Title</h3>
                <Textarea
                  placeholder="Enter title..."
                  className="mt-1 md:text-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />

                <h3 className="headers text-xl text-left">Description</h3>
                <Textarea
                  placeholder="Enter description..."
                  className="mt-2 min-h-80 md:text-lg"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* display error if creation fails */}
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  onClick={() => setMembersModalOpen(true)}
                  className="w-44 h-8 rounded outline outline-2 outline-gray-300 shrink-0 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
                >
                  <p className="text-gray-600">
                    + Add Members{selectedMembers.length > 0 ? ` (${selectedMembers.length})` : ""}
                  </p>
                </button>

                <button
                  className="my-button w-22 h-10 rounded shrink-0 gap-2"
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create'}
                </button>

              </CardContent>
            </Card>
          </section>
        </div>
      </div>

      <AddMembersModal
        isOpen={membersModalOpen}
        onClose={() => setMembersModalOpen(false)}
        selectedMembers={selectedMembers}
        onMembersChange={setSelectedMembers}
      />
    </div>
  );
}