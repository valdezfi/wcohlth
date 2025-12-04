"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  campaignId: string;
  message: string;
  createdAt: string;
  senderName: string;
  senderImage: string;
  isMine: boolean;
};

export default function UniversalCampaignChat({
  campaignId,
  myEmail,
  otherEmail,
}: {
  campaignId: string;
  myEmail: string;    // logged-in user email
  otherEmail: string; // the other side of the chat (brand or creator)
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* --------------------------------------------
      Load messages for this specific 1-on-1 thread
  --------------------------------------------- */
  useEffect(() => {
    if (!campaignId || !myEmail || !otherEmail) return;

    const load = async () => {
      try {
        const params = new URLSearchParams({
          campaignId,
          me: myEmail,
          other: otherEmail,
        }).toString();

        const res = await fetch(`/api/thread/messages?${params}`);
        const data = await res.json();

        if (!data.success) {
          console.error("❌ Load messages error:", data.error);
          return;
        }

        setMessages(data.messages);
      } catch (err) {
        console.error("❌ Load messages failed", err);
      }
    };

    load();

    // Light polling
    const interval = setInterval(load, 5000); // 5s
    return () => clearInterval(interval);
  }, [campaignId, myEmail, otherEmail]);

  /* --------------------------------------------
      Auto scroll
  --------------------------------------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* --------------------------------------------
      Send message
  --------------------------------------------- */
  const send = async () => {
    if (!text.trim() || isSending) return;

    setIsSending(true);

    try {
      const res = await fetch(`/api/thread/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId,
          senderEmail: myEmail,
          targetEmail: otherEmail,
          message: text.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error("❌ Send failed:", data.error);
      } else {
        setText("");
      }
    } catch (err) {
      console.error("❌ Send error:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
      <div className="h-80 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-800 rounded mb-4">
        {messages.map((msg) => {
          const isMe = msg.isMine;

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
                    src={msg.senderImage || "/default-profile.png"}
                    className="w-7 h-7 rounded-full object-cover"
                    alt="avatar"
                  />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {msg.senderName || "User"}
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
