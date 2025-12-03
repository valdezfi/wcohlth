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
  campaignId: string;
  /** 
   * The email of the other person (only required for brand)
   * Creators DO NOT pass this 
   */
  targetEmail?: string;
}

export default function UniversalCampaignChat({
  campaignId,
  targetEmail,
}: ChatProps) {
  const { data: session, status } = useSession();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);

  const currentEmail = session?.user?.email || null;

  useEffect(() => {
    if (status !== "authenticated") return;
    if (!currentEmail || !campaignId) return;

    let mounted = true;
    let stream: StreamChat | null = null;

    const load = async () => {
      const qs = new URLSearchParams({
        campaignId,
        currentEmail,
      });

      // targetEmail only sent on brand side
      if (targetEmail) qs.append("targetEmail", targetEmail);

      const res = await fetch(`https://app.grandeapp.com/g/api/chat/campaign-session?` + qs.toString());
      const data = await res.json();

      if (!data.success) {
        console.error("Chat API failed:", data.message);
        return;
      }

      // connect StreamChat user
      stream = StreamChat.getInstance(apiKey);

      await stream.connectUser(
        {
          id: data.currentUser.id,
          name: data.currentUser.name,
          image: data.currentUser.image,
        },
        data.token
      );

      if (!mounted) return;

      const ch = stream.channel("messaging", data.channelId);

      await ch.watch();

      if (mounted) {
        setClient(stream);
        setChannel(ch);
      }
    };

    load();

    return () => {
      mounted = false;
      stream?.disconnectUser();
    };
  }, [status, currentEmail, campaignId, targetEmail]);

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
