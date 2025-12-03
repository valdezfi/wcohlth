"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
  LoadingIndicator,
} from "stream-chat-react";

import { StreamChat, Channel as StreamChannel } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = "3pyarxmb7yss";

interface ChatProps {
  creatorEmail: string;
  brandEmail: string;   // required now
  campaignId: string;
}

export default function ChattingWithCampaign({
  creatorEmail,
  brandEmail,
  campaignId,
}: ChatProps) {
  const { data: session, status } = useSession();

  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  const userEmail = session?.user?.email || null;

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!campaignId || !creatorEmail || !brandEmail || !userEmail) return;

    let mounted = true;
    let chatClient: StreamChat | null = null;

    const load = async () => {
      const qs = new URLSearchParams({
        campaignId,
        creatorEmail,
        brandEmail,
        currentEmail: userEmail,
      });

      const res = await fetch("/api/chat/campaign-session?" + qs.toString());
      const data = await res.json();

      if (!data.success) return;

      // Connect StreamChat user
      chatClient = StreamChat.getInstance(apiKey);
      await chatClient.connectUser(
        {
          id: data.currentUser.id,
          name: data.currentUser.name,
          image: data.currentUser.image,
        },
        data.token
      );

      if (!mounted) return;

      const ch = chatClient.channel("messaging", data.channelId, {
        members: [data.currentUser.id, data.otherUser.id],
      });

      await ch.watch();

      if (mounted) {
        setClient(chatClient);
        setChannel(ch);
      }
    };

    load();

    return () => {
      mounted = false;
      chatClient?.disconnectUser();
    };
  }, [status, userEmail, creatorEmail, brandEmail, campaignId]);

  if (!client || !channel) return <LoadingIndicator />;

  return (
    <Chat client={client} theme="str-chat__theme-dark">
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
