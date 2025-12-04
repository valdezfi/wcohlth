"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  campaignId: number;
  senderEmail: string;
  message: string;
  createdAt: string;
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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load messages regularly (polling)
  useEffect(() => {
    if (!campaignId) return;

    const load = async () => {
      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/api/thread/messages?campaignId=${campaignId}`,
          { cache: "no-store" }
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

  // Auto scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
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

      // Refresh messages
      const res = await fetch(
        `https://app.grandeapp.com/g/api/thread/messages?campaignId=${campaignId}`
      );
      const data = await res.json();
      setMessages(data.messages as Message[]);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">

      {/* MESSAGE LIST */}
      <div className="h-80 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-800 rounded mb-4">

        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            No messages yet.
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderEmail === senderEmail;

          return (
            <div
              key={msg.id}
              className={`mb-2 p-2 rounded max-w-[80%] ${
                isMe
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-white dark:bg-gray-700 border"
              }`}
            >
              {!isMe && (
                <div className="text-xs text-gray-500 mb-1">{msg.senderEmail}</div>
              )}

              <div className="text-sm whitespace-pre-wrap break-words">
                {msg.message}
              </div>

              <div className="text-[10px] opacity-60 mt-1">
                {new Date(msg.createdAt).toLocaleString()}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <textarea
        className="w-full border rounded p-2 mb-3 dark:bg-gray-700 dark:text-white"
        placeholder="Write a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={send}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
