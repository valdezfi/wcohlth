"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Props {
  campaignId: string;
  targetEmail: string; // the person you're chatting with
}

type Msg = {
  id: number;
  senderEmail: string;
  message: string;
  createdAt: string;
};

export default function UniversalCampaignChat({ campaignId, targetEmail }: Props) {
  const { data: session } = useSession();
  const myEmail = session?.user?.email || "";

  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  // Load messages
  useEffect(() => {
    if (!campaignId) return;

    const load = async () => {
      const res = await fetch(`/api/thread/messages?campaignId=${campaignId}`);
      const data = await res.json();
      setMessages(data);
    };

    load();
    const interval = setInterval(load, 2500);
    return () => clearInterval(interval);
  }, [campaignId]);

  // Send a message
  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("/api/thread/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId,
        senderEmail: myEmail,
        message: text,
        targetEmail, // for email notifications
      }),
    });

    setText("");
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border max-w-xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">
        Chat with {targetEmail}
      </h3>

      <div className="h-80 overflow-y-auto border p-3 rounded mb-3 bg-gray-50 dark:bg-gray-800">
        {messages.length === 0 && (
          <p className="text-gray-500">No messages yet.</p>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-3 p-2 rounded-lg ${
              m.senderEmail === myEmail
                ? "bg-blue-600 text-white ml-auto max-w-[80%]"
                : "bg-gray-300 dark:bg-gray-700 max-w-[80%]"
            }`}
          >
            <div className="text-sm font-bold">{m.senderEmail}</div>
            <div>{m.message}</div>
            <div className="text-xs text-gray-200 dark:text-gray-400 mt-1">
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <textarea
        rows={3}
        value={text}
        className="w-full border rounded p-2 mb-3"
        onChange={(e) => setText(e.target.value)}
        placeholder="Write a message..."
      />

      <button
        onClick={sendMessage}
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Send Message
      </button>
    </div>
  );
}

