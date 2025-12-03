"use client";

import { useEffect, useRef, useState } from "react";

export default function UniversalCampaignChat({
  campaignId,
  senderEmail,
  targetEmail,
}: {
  campaignId: string;
  senderEmail: string;
  targetEmail: string;
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load messages
  useEffect(() => {
    if (!campaignId) return;

    const load = async () => {
      const res = await fetch(`/api/thread/messages?campaignId=${campaignId}`);
      const data = await res.json();
      setMessages(data);
    };

    load();

    const interval = setInterval(load, 1500);
    return () => clearInterval(interval);
  }, [campaignId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const send = async () => {
    if (!text.trim()) return;

    await fetch("/api/thread/send", {
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
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">

      {/* 🔥 MESSAGE AREA — message list removed */}
      <div className="h-80 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-800 rounded mb-4">
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <textarea
        className="w-full border rounded p-2 mb-3"
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
