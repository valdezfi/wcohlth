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

const apiKey = '6ujdvzws3yau'; // Your Stream key

interface ChattingNowProps {
  transaction: {
    cryptoExchange_id: string;
  };
}

export function Chatting({ transaction }: ChattingNowProps) {
  const { data: session, status } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  useEffect(() => {
    if (!session?.user?.email || status !== 'authenticated' || !transaction?.cryptoExchange_id) return;

    let client: StreamChat;
    let isMounted = true;

    const userId = session.user.email.replace(/\./g, '_');

    const setupChat = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/crypto/approvedEscrowChats/${session.user.email}`);
        const data = await res.json();

        console.log('API response:', data);

        if (!data.success || !data.createdChats.length) return;

        const chatData = data.createdChats.find(
          (chat: any) => String(chat.transactionId) === String(transaction.cryptoExchange_id)
        );

        console.log('Found chatData:', chatData);

        if (!chatData) return;

        client = StreamChat.getInstance(apiKey);

        await client.connectUser(
          {
            id: userId,
            name: data.name || 'Anonymous',
            image: data.image || 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1/default-avatar.png',
          },
          data.token
        );

        if (!isMounted) return;

        const userChannel = client.channel('messaging', chatData.channelId, {
          members: chatData.participants.map((p: any) => p.id),
        });

        await userChannel.watch();

        if (isMounted) {
          setChatClient(client);
          setChannel(userChannel);
        }
      } catch (error) {
        console.error('Error setting up chat:', error);
      }
    };

    setupChat();

    return () => {
      isMounted = false;
      if (client) client.disconnectUser();
    };
  }, [session?.user?.email, status, transaction?.cryptoExchange_id]);

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
