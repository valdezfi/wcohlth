// app/chat/page.tsx (for App Router) or pages/chat.tsx (for Pages Router)
'use client';

import ChatList from '@/components/Message/CreatorChatList';
import { useSession } from 'next-auth/react';

export default function ChatPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div style={{ padding: 20 }}>Loading session...</div>;
  }

  if (!session) {
    return <div style={{ padding: 20 }}>You must be signed in to access chat.</div>;
  }

  return <ChatList />;
}
