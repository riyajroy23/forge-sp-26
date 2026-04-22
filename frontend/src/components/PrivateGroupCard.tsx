import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { type Group } from "@/Pages/private_group_dash";
import { getToken, getUser } from "@/lib/auth";
import './PrivateGroupStyle.css';

const API_URL = 'http://localhost:3000/api';

interface PrivateGroupCardProps {
    group: Group;
    onLeave?: (groupId: number) => void;
}

export default function PrivateGroupCard({ group, onLeave }: PrivateGroupCardProps) {

    const handleLeave = async () => {
        try {
            const token = getToken();
            const user = getUser();

            const response = await fetch(`${API_URL}/groups/${group.id}/members/${user?.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to leave group.');
                return;
            }

            // notify parent to remove this card from the list
            if (onLeave) {
                onLeave(group.id);
            }

        } catch (err) {
            console.error('Leave group error:', err);
        }
    };

    return (
        <Card className="flex overflow-hidden gap-3 rounded-lg shadow-md py-0">
            {/* Top Half / Red Header Section */}
            <CardHeader className="bg-red-800 text-white p-6 m-0">
                <div className="group-container">
                    <h2 className="text-2xl font-bold">{group.title}</h2>
                    <p className="text-sm">●</p>
                    <p className="text-sm">{group.date_created}</p>
                    <p className="text-sm">●</p>
                    <p className="text-sm">{group.members}</p>
                </div>
            </CardHeader>
            {/* Bottom Half / White Content Section */}
            <CardContent className="p-5 bg-white">
                <p>{group.description}</p>
            </CardContent>
            <div className="content-container">
                <p className="text-sm font-bold text-gray-400">{group.date_joined}</p>
                <button
                    className="my-button w-22 h-10 rounded shrink-0 gap-2"
                    onClick={handleLeave}
                >
                    Leave
                </button>
            </div>
        </Card>
    );
}