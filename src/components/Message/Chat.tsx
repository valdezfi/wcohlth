"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  campaignId: number;
  senderEmail: string;
  message: string;
  createdAt: string;

  brandName?: string | null;
  brandImage?: string | null;

  creatorName?: string | null;
  creatorImage?: string | null;
};

export default function UniversalCampaignChat({
  campaignId,
  senderEmail,
  targetEmail,
}: {
  campaignId: string;
  senderEmail: string;
  targetEmail: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [shouldScroll, setShouldScroll] = useState(true);

  const listRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Track whether user is at bottom
  const checkIfAtBottom = () => {
    if (!listRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 20;

    setShouldScroll(atBottom);
  };

  // Load messages every 1.5s
  useEffect(() => {
    if (!campaignId) return;

    const load = async () => {
      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/api/thread/messages?campaignId=${campaignId}`
        );

        const data = await res.json();

        setMessages(data.messages as Message[]);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    };

    load();
    const interval = setInterval(load, 1500);

    return () => clearInterval(interval);
  }, [campaignId]);

  // Scroll when new messages come in
  useEffect(() => {
    if (shouldScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, shouldScroll]);

  // Send message
  const send = async () => {
    if (!text.trim()) return;

    try {
      await fetch("https://app.grandeapp.com/g/api/thread/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          senderEmail,
          targetEmail,
          message: text,
        }),
      });

      setText("");
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  // Helper: Display name
  const getDisplayName = (msg: Message) => {
    return msg.brandName || msg.creatorName || msg.senderEmail || "Unknown";
  };

  // Helper: Display avatar
  const getAvatar = (msg: Message) => {
    return (
      msg.brandImage ||
      msg.creatorImage ||
      "/default-profile.png"
    );
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">

      {/* MESSAGE LIST */}
      <div
        ref={listRef}
        onScroll={checkIfAtBottom}
        className="h-80 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-800 rounded mb-4"
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">No messages yet.</div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderEmail === senderEmail;

          return (
            <div
              key={msg.id}
              className={`mb-3 p-2 rounded max-w-[80%] ${
                isMe
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-white dark:bg-gray-700 border"
              }`}
            >
              {/* Avatar + Name */}
              {!isMe && (
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={getAvatar(msg)}
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {getDisplayName(msg)}
                  </span>
                </div>
              )}

              {/* Message */}
              <div className="text-sm whitespace-pre-wrap break-words">
                {msg.message}
              </div>

              {/* Timestamp */}
              <div className="text-[10px] opacity-60 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* TEXT INPUT */}
      <textarea
        className="w-full border rounded px-3 py-2 mb-3 dark:bg-gray-700 dark:text-white"
        placeholder="Write a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={send}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
      >
        Send
      </button>
    </div>
  );
}
