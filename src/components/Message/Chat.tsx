// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";

// import {
//   Chat,
//   Channel,
//   ChannelHeader,
//   MessageList,
//   MessageInput,
//   Thread,
//   Window,
//   LoadingIndicator,
// } from "stream-chat-react";

// import { StreamChat, Channel as StreamChannel } from "stream-chat";
// import "stream-chat-react/dist/css/v2/index.css";

// const apiKey = "3pyarxmb7yss";

// interface ChattingWithCampaignProps {
//   creatorEmail: string;  // The creator's email from DB
//   campaignId: string;
// }

// const safeId = (email: string) =>
//   email.toLowerCase().replace(/[^a-z0-9_\-!]/gi, "_");

// export default function ChattingWithCampaign({
//   creatorEmail,
//   campaignId,
// }: ChattingWithCampaignProps) {
//   const { data: session, status } = useSession();

//   const [chatClient, setChatClient] = useState<StreamChat | null>(null);
//   const [channel, setChannel] = useState<StreamChannel | null>(null);
//   const [ready, setReady] = useState(false);

//   const userEmail = session?.user?.email || null;

//   useEffect(() => {
//     if (status === "loading") return;
//     if (status === "unauthenticated") {
//       setReady(true);
//       return;
//     }
//     if (!userEmail || !creatorEmail || !campaignId) {
//       setReady(true);
//       return;
//     }

//     let mounted = true;
//     let client: StreamChat | null = null;

//     const initChat = async () => {
//       try {
//         const url = `https://app.grandeapp.com/g/api/chat/campaign/${campaignId}/creator/${creatorEmail}?currentEmail=${userEmail}`;
//         const res = await fetch(url);
//         const data = await res.json();

//         if (!data.success) {
//           console.error("Chat API failed:", data.message);
//           setReady(true);
//           return;
//         }

//         // ------------------------------------------------
//         // 1️⃣ Determine ROLE (Brand or Creator?)
//         // ------------------------------------------------
//         const loggedInIsCreator = userEmail.toLowerCase() === creatorEmail.toLowerCase();

//         // ------------------------------------------------
//         // 2️⃣ Assign Correct User IDs
//         // Backend creates:
//         //   sender = currentEmail
//         //   target = creatorEmail
//         // ------------------------------------------------
//         const me = safeId(userEmail);                     // logged-in user
//         const other = safeId(
//           loggedInIsCreator
//             ? data.currentUser?.email      // brand email
//             : creatorEmail                 // creator email
//         );

//         // ------------------------------------------------
//         // 3️⃣ StreamChat connect
//         // ------------------------------------------------
//         client = StreamChat.getInstance(apiKey);

//         await client.connectUser(
//           {
//             id: me,
//             name: loggedInIsCreator
//               ? data.targetUser?.name    // creator name
//               : data.currentUser?.name,  // brand name
//             image: loggedInIsCreator
//               ? data.targetUser?.image
//               : data.currentUser?.image,
//           },
//           data.token
//         );

//         if (!mounted) return;

//         // ------------------------------------------------
//         // 4️⃣ Join channel
//         // ------------------------------------------------
//         const ch = client.channel("messaging", data.channelId, {
//           members: [me, other],
//         });

//         await ch.watch();

//         if (mounted) {
//           setChatClient(client);
//           setChannel(ch);
//           setReady(true);
//         }
//       } catch (err) {
//         console.error("Chat setup error:", err);
//         setReady(true);
//       }
//     };

//     initChat();

//     return () => {
//       mounted = false;
//       client?.disconnectUser();
//     };
//   }, [status, userEmail, creatorEmail, campaignId]);

//   // UI rendering AFTER hooks only
//   if (status === "loading") return <LoadingIndicator />;

//   if (status === "unauthenticated")
//     return <div className="p-4 text-center">Please log in.</div>;

//   if (!ready || !chatClient || !channel) return <LoadingIndicator />;

//   return (
//     <Chat client={chatClient} theme="str-chat__theme-dark">
//       <Channel channel={channel}>
//         <Window>
//           <ChannelHeader />
//           <MessageList />
//           <MessageInput />
//         </Window>
//         <Thread />
//       </Channel>
//     </Chat>
//   );
// }


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

const apiKey = "3pyarxmb7yss";

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