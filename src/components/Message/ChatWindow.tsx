import React, { useEffect, useState } from 'react';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
  LoadingIndicator,
} from 'stream-chat-react';
import { StreamChat, Channel as StreamChannel } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';

interface ChatWindowProps {
  channelId: string;
  token: string;
  userEmail: string;
  onClose: () => void;
}

function safeId(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9_\-!]/gi, '_');
}

export default function ChatWindow({ channelId, token, userEmail, onClose }: ChatWindowProps) {
  const [client] = useState(() => new StreamChat('6ujdvzws3yau'));
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function connect() {
      try {
        await client.connectUser(
          {
            id: safeId(userEmail),
            name: userEmail.split('@')[0],
            image: 'https://placehold.co/40x40',
          },
          token
        );

        const userChannel = client.channel('messaging', channelId);
        await userChannel.watch();

        if (isMounted) setChannel(userChannel);
      } catch (error) {
        console.error('Failed to connect to chat:', error);
        alert(`Chat connection error: ${error instanceof Error ? error.message : error}`);
        onClose();
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    connect();

    return () => {
      isMounted = false;
      client.disconnectUser().catch(() => {});
      setChannel(null);
    };
  }, [channelId, token, userEmail, client, onClose]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md text-center shadow-md max-w-sm">
          <p className="mb-4 text-gray-600">Connecting to chat...</p>
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  if (!channel) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-xl font-bold">Chat</h2>
          <button
            onClick={onClose}
            className="text-red-600 text-2xl font-bold hover:text-red-800"
            aria-label="Close chat modal"
          >
            ×
          </button>
        </div>
        <div className="flex-1">
          <Chat client={client} theme="light">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>
    </div>
  );
}
