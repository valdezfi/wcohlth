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

import {
  StreamChat,
  Channel as StreamChannel,
} from "stream-chat";

import "stream-chat-react/dist/css/v2/index.css";

const apiKey = "3pyarxmb7yss";

interface ChattingWithCampaignProps {
  creatorEmail: string;
  campaignId: string;
}

const safeId = (email: string) =>
  email.toLowerCase().replace(/[^a-z0-9_\-!]/gi, "_");

export default function ChattingWithCampaign({
  creatorEmail,
  campaignId,
}: ChattingWithCampaignProps) {
  const { data: session, status } = useSession();

  // Strict typing — no any
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  const [ready, setReady] = useState(false);

  const userEmail = session?.user?.email || null;

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      setReady(true);
      return;
    }
    if (!userEmail) {
      setReady(true);
      return;
    }
    if (!creatorEmail || !campaignId) {
      setReady(true);
      return;
    }

    let mounted = true;
    let client: StreamChat | null = null;

    const initChat = async () => {
      try {
        const url = `https://app.grandeapp.com/g/api/chat/campaign/${campaignId}/creator/${creatorEmail}?currentEmail=${userEmail}`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.success) {
          console.error("Chat API failed:", data.message);
          setReady(true);
          return;
        }

        const me = safeId(userEmail);
        const other = safeId(creatorEmail);

        client = StreamChat.getInstance(apiKey);

        await client.connectUser(
          {
            id: me,
            name: data.currentUser?.name || "User",
            image: data.currentUser?.image,
          },
          data.token
        );

        if (!mounted) return;

        const ch = client.channel("messaging", data.channelId, {
          members: [me, other],
        });

        await ch.watch();

        if (mounted) {
          setChatClient(client);
          setChannel(ch);
          setReady(true);
        }
      } catch (err) {
        console.error("Chat setup error:", err);
        setReady(true);
      }
    };

    initChat();

    return () => {
      mounted = false;
      client?.disconnectUser();
    };
  }, [status, userEmail, creatorEmail, campaignId]);

  // UI rendering AFTER hooks only
  if (status === "loading") return <LoadingIndicator />;

  if (status === "unauthenticated")
    return <div className="p-4 text-center">Please log in.</div>;

  if (!ready || !chatClient || !channel) return <LoadingIndicator />;

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
