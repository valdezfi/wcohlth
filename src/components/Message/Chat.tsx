"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  campaignId: string;
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
}: {
  campaignId: string;
  senderEmail: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* --------------------------------------------
      FIXED: NO FAST POLLING — now every 6 seconds
  --------------------------------------------- */
  useEffect(() => {
    if (!campaignId) return;

    const load = async () => {
      try {
        const res = await fetch(
          `/g/api/thread/messages?campaignId=${campaignId}`
        );
        const data = await res.json();
        setMessages(data.messages);
      } catch (err) {
        console.error("❌ Load messages failed", err);
      }
    };

    load();
    const interval = setInterval(load, 6000);
    return () => clearInterval(interval);
  }, [campaignId]);

  /* --------------------------------------------
      AUTOSCROLL
  --------------------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* --------------------------------------------
      FIXED SEND — prevents duplicate sends
  --------------------------------------------- */
  const send = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);

    await fetch(`/g/api/thread/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId,
        senderEmail,
        message: text.trim(),
      }),
    });

    setText("");
    setIsSending(false);
  };

  const getDisplayName = (msg: Message) => {
    if (msg.brandName) return msg.brandName;
    if (msg.creatorName) return msg.creatorName;
    return "User";
  };

  const getAvatar = (msg: Message) => {
    return msg.brandImage || msg.creatorImage || "/default-profile.png";
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
      <div className="h-80 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-800 rounded mb-4">
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
              {!isMe && (
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={getAvatar(msg)}
                    className="w-7 h-7 rounded-full object-cover"
                    alt="avatar"
                  />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {getDisplayName(msg)}
                  </span>
                </div>
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

      <textarea
        className="w-full border rounded p-2 mb-3 dark:bg-gray-700 dark:text-white"
        placeholder="Write a message…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={send}
        disabled={isSending}
        className={`w-full p-2 rounded text-white ${
          isSending ? "bg-gray-400" : "bg-blue-600"
        }`}
      >
        {isSending ? "Sending…" : "Send"}
      </button>
    </div>
  );
}
