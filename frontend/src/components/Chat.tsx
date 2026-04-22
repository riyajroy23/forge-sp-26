import { useEffect, useState } from 'react';
import { StreamChat, Channel as StreamChannel } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageList, Window, MessageComposer } from 'stream-chat-react';
import 'stream-chat-react/dist/css/index.css';

const API_URL = 'http://localhost:3000/api';
const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

interface ChatComponentProps {
    user: {
        id: number;
        display_name: string;
    };
    type: 'group' | 'dm';
    groupId?: number;
    groupName?: string;
    memberIds?: string[];
    otherUserId?: string;
}

const ChatComponent = ({ user, type, groupId, groupName, memberIds, otherUserId }: ChatComponentProps) => {
    const [channel, setChannel] = useState<StreamChannel | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initChat = async () => {
            try {
                // fetch stream token from backend
                const res = await fetch(`${API_URL}/chat/token`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: String(user.id) })
                });

                const { token } = await res.json();

                // connect user to stream
                await client.connectUser(
                    { id: String(user.id), name: user.display_name },
                    token
                );

                let activeChannel: StreamChannel;

                if (type === 'group' && groupId) {
                    // create or retrieve the group channel by groupId
                    activeChannel = client.channel('messaging', `group-${groupId}`, {
                        name: groupName || `Group ${groupId}`,
                        members: memberIds || [String(user.id)]
                    } as any);
                } else if (type === 'dm' && otherUserId) {
                    // create or retrieve a DM channel between two users
                    activeChannel = client.channel('messaging', {
                        members: [String(user.id), otherUserId]
                    });
                } else {
                    return;
                }

                // watch the channel to start receiving messages
                await activeChannel.watch();
                setChannel(activeChannel);

            } catch (err) {
                console.error('Chat initialization error:', err);
            } finally {
                setLoading(false);
            }
        };

        initChat();

        // disconnect user when component unmounts
        return () => {
            client.disconnectUser();
        };
    }, [user, type, groupId, otherUserId]);

    if (loading) return <div>Loading chat...</div>;
    if (!channel) return <div>Could not load chat.</div>;

    return (
        <Chat client={client}>
            <Channel channel={channel}>
                <Window>
                    <ChannelHeader />
                    <MessageList />
                    <MessageComposer />
                </Window>
            </Channel>
        </Chat>
    );
};

export default ChatComponent;