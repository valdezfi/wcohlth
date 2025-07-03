'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import ChatWindow from '@/components/Message/ChatWindow';
import { ClipLoader } from 'react-spinners';

interface ChannelMember {
  user_id: string;
  name?: string;
  image?: string;
}

interface ChannelType {
  id: string;
  members: Record<string, ChannelMember>;
  lastMessage?: {
    text?: string;
    created_at?: string;
  };
}

function Spinner() {
  return <ClipLoader size={24} color="#2563EB" />;
}

export default function CreatorChatList() {
  const { data: session, status } = useSession();
  const creatorEmail = session?.user?.email || '';

  const [channels, setChannels] = useState<ChannelType[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<{ channelId: string; token: string } | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const tokenCache = useRef<Record<string, string>>({});

  useEffect(() => {
    if (status !== 'authenticated' || !creatorEmail) return;

    const fetchChannels = async () => {
      setLoadingChannels(true);
      setError(null);
      try {
        const res = await fetch(`/api/chat/channels?userEmail=${encodeURIComponent(creatorEmail)}`);
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to fetch channels');
        setChannels(data.channels);
      } catch (err) {
        setError((err as Error).message || 'Error loading chats');
      } finally {
        setLoadingChannels(false);
      }
    };

    fetchChannels();
  }, [status, creatorEmail]);

  const openChat = async (channelId: string) => {
    if (tokenCache.current[channelId]) {
      setActiveChat({ channelId, token: tokenCache.current[channelId] });
      return;
    }

    setLoadingChat(true);
    setError(null);

    try {
      const res = await fetch(`/api/chat/connect/${encodeURIComponent(channelId)}?userEmail=${encodeURIComponent(creatorEmail)}`);
      const data = await res.json();
      if (!res.ok || !data.success || !data.token) throw new Error(data.message || 'Token missing');
      tokenCache.current[channelId] = data.token;
      setActiveChat({ channelId, token: data.token });
    } catch (err) {
      setError((err as Error).message || 'Error connecting to chat');
    } finally {
      setLoadingChat(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-8 text-center">Loading session...</div>;
  }

  if (status === 'unauthenticated') {
    return <div className="p-8 text-center text-red-600">Please log in to access chat.</div>;
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Chats</h1>

        {loadingChannels && (
          <div className="mb-6 text-center flex items-center justify-center gap-2 text-gray-500">
            Fetching chats... <Spinner />
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 p-3 rounded text-center">
            {error}
          </div>
        )}

        {!loadingChannels && channels.length === 0 && (
          <div className="text-center text-gray-600">You have no chats yet.</div>
        )}

        <ul className="grid gap-6 sm:grid-cols-2">
          {channels.map(channel => {
            const otherMembers = Object.values(channel.members).filter(m => m.user_id !== creatorEmail);
            const names = otherMembers.map(m => m.name || 'User').join(', ');

            return (
              <li key={channel.id}>
                <button
                  onClick={() => openChat(channel.id)}
                  disabled={loadingChat}
                  className="w-full flex items-center gap-4 p-4 rounded-lg bg-white shadow hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex -space-x-3">
                    {otherMembers.map(m => (
                      <img
                        key={m.user_id}
                        src={m.image || 'https://placehold.co/48x48?text=?'}
                        alt={m.name || 'User'}
                        className="w-12 h-12 rounded-full border-2 border-white shadow"
                        loading="lazy"
                      />
                    ))}
                  </div>
                  <div className="flex-grow text-left">
                    <div className="font-semibold truncate text-lg">{names}</div>
                    <div className="text-gray-500 text-sm truncate">{channel.lastMessage?.text || 'No messages yet'}</div>
                  </div>
                  {loadingChat && <Spinner />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {activeChat && (
        <ChatWindow
          channelId={activeChat.channelId}
          token={activeChat.token}
          userEmail={creatorEmail}
          onClose={() => setActiveChat(null)}
        />
      )}
    </>
  );
}
