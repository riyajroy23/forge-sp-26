import { useEffect, useState } from 'react';
import { StreamChat, Channel as StreamChannel } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window } from 'stream-chat-react';

const client = StreamChat.getInstance("x7t82agtugjc");

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

  useEffect(() => {
    const initChat = async () => {
      const res = await fetch('/api/chat/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: String(user.id) })
      });
      const { token } = await res.json();

      await client.connectUser(
        { id: String(user.id), name: user.display_name },
        token
      );
    };

    initChat();
    return () => { client.disconnectUser(); };
  }, [user]);

  if (!channel) return <div>Loading chat...</div>;

  return (
    <Chat client={client}>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

export default ChatComponent;
