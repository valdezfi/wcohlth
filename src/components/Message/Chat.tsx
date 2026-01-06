"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Message {
  id: number;
  userType: "brand" | "creator";
  comment: string;
  createdAt: string;
  brandEmail: string | null;
  creatorEmail: string | null;
}

interface BrandProfile {
  brandname: string;
  imageUrl: string;
  industry: string;
  country: string;
  website: string;
}

interface CreatorProfile {
  creatorName: string;
  imageUrl: string;
  niche: string;
  country: string;
  instagram: string;
  youtube: string;
  tiktokLink: string;
}

export default function CampaignChat({
  campaignId,
  brandEmail,
  creatorEmail
}: {
  campaignId: number;
  brandEmail: string;
  creatorEmail: string;
}) {
  const { data: session } = useSession();
  const loggedEmail = session?.user?.email || "";

  const userType = loggedEmail === brandEmail ? "brand" : "creator";

  const [messages, setMessages] = useState<Message[]>([]);
  const [brand, setBrand] = useState<BrandProfile | null>(null);
  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [message, setMessage] = useState("");

  // Load chat
  const loadChat = async () => {
    const res = await fetch(
      `https://app.cohlth.com/g/api/campaign/chat?campaignId=${campaignId}&brandEmail=${brandEmail}&creatorEmail=${creatorEmail}`
    );
    const data = await res.json();
    if (!data.success) return;

    setMessages(data.messages);
    setBrand(data.brand);
    setCreator(data.creator);
  };

  useEffect(() => {
    loadChat();
    const interval = setInterval(loadChat, 3500);
    return () => clearInterval(interval);
  }, []);

  // Send message
  const sendMessage = async () => {
    if (!message.trim()) return;

    await fetch("https://app.cohlth.com/g/api/campaign/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      
      body: JSON.stringify({
        campaignId,
       brandEmail,
creatorEmail,

        userType,
        comment: message
      }),
    });

    setMessage("");
    loadChat();
  };

  const getAvatar = (msg: Message) => {
    return msg.userType === "brand"
      ? brand?.imageUrl
      : creator?.imageUrl;
  };

  const getName = (msg: Message) => {
    return msg.userType === "brand"
      ? brand?.brandname
      : creator?.creatorName;
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <h2 className="text-xl font-bold mb-4">Campaign Chat</h2>

      {/* CHAT WINDOW */}
      <div className="h-80 overflow-y-auto border p-3 rounded bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 mb-3 ${
              msg.userType === userType ? "justify-end" : "justify-start"
            }`}
          >
            {msg.userType !== userType && (
              <img
                src={getAvatar(msg) || "/default-avatar.png"}
                className="w-8 h-8 rounded-full"
              />
            )}

            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.userType === userType
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              <div className="text-xs font-bold">{getName(msg)}</div>
              <div className="mt-1">{msg.comment}</div>
              <div className="text-[10px] opacity-70 mt-1">
                {msg.createdAt}
              </div>
            </div>

            {msg.userType === userType && (
              <img
                src={getAvatar(msg) || "/default-avatar.png"}
                className="w-8 h-8 rounded-full"
              />
            )}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 border rounded p-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
