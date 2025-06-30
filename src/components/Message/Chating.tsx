'use client';

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
import { useSession } from 'next-auth/react';
import { StreamChat, Channel as StreamChannel } from 'stream-chat';
import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = '6ujdvzws3yau'; // Your Stream API key

interface ChattingWithCreatorProps {
  creatorEmail: string;
}

// Sanitize for StreamChat IDs
const safeId = (email: string) =>
  email.toLowerCase().replace(/[^a-z0-9_\-!]/gi, '_');

export function ChattingWithCreator({ creatorEmail }: ChattingWithCreatorProps) {
  const { data: session, status } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    if (!session?.user?.email || status !== 'authenticated' || !creatorEmail) return;

    let client: StreamChat;
    let isMounted = true;

    const currentEmail = session.user.email;
    const userId = safeId(currentEmail);
    const targetId = safeId(creatorEmail);

    const setupChat = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/chat/direct/${creatorEmail}?currentEmail=${currentEmail}`
        );
        const data = await res.json();

        if (!data.success) return;

        client = StreamChat.getInstance(apiKey);

        await client.connectUser(
          {
            id: userId,
            name: data.currentUser.name || 'User',
            image: data.currentUser.image,
          },
          data.token
        );

        if (!isMounted) return;

        const userChannel = client.channel('messaging', data.channelId, {
          members: [userId, targetId],
        });

        await userChannel.watch();

        if (isMounted) {
          setChatClient(client);
          setChannel(userChannel);
        }
      } catch (error) {
        console.error('Error setting up direct chat:', error);
      }
    };

    setupChat();

    return () => {
      isMounted = false;
      if (client) client.disconnectUser();
    };
  }, [session?.user?.email, status, creatorEmail]);

  if (!chatClient || !channel) return <LoadingIndicator />;

  return (
    <Chat client={chatClient} theme="str-chat__theme-dark">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
