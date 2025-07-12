"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  sender: "user" | "ai";
  text: string;
};

const SUGGESTED_PROMPTS = [
  "How can I position myself as a premium creator and start landing paid brand deals?",
  "I’m a UGC creator with under 5K followers — what are the best ways to get brands to pay me?",
  "What should be in my media kit to attract top brands?",
  "How much should I charge for a UGC video, story, and rights usage?",
  "How do I professionally respond to a brand that says 'we don’t have budget'?",
  "Help me create a weekly content and outreach plan to get paid collabs faster.",
  "What should I include in my pitch DM or email to brands?",
  "As a podcaster, how can I grow my audience and start attracting sponsors?",
  "What kind of brands are a good fit for my niche, and how should I approach them?",
  "How can I balance brand deals, content creation, and personal growth without burning out?",
  "I want to scale from micro-influencer to full-time — what’s my 90-day game plan?",
  "What are the red flags to watch out for in brand contracts and influencer deals?",
  "Can you help me write a rate card for UGC and sponsored posts?",
  "How can I turn one-time collabs into long-term brand partnerships?",
  "Help me negotiate better rates and usage rights without sounding difficult.",
  "As a beauty creator, what should my next 5 content ideas be to attract sponsors?",
  "I'm growing fast on TikTok — how can I start monetizing without selling out?",
  "Give me a smart way to respond to a brand offering affiliate-only deals.",
  "What’s the best way to build a personal brand as a creator beyond just posting?",
  "Help me craft a smart response to a brand asking for a video revision I wasn’t paid for."
];

export default function CampaignAIChat({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! I'm your AI Manager. How can I assist you today? I speak english and espanol." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  const fetchAIResponse = async (text: string) => {
    setLoading(true);
    try {
      // const res = await fetch("http://localhost:5000/api/ai/creatormanager", {
      const res = await fetch("https://app.grandeapp.com/g/api/ai/creatormanager", {



        
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      // FIX HERE: Use 'reply' because backend sends 'reply' now
      return data.reply as string;
   } catch (e: unknown) {
  const err = e as Error;
  console.error("AI fetch error:", err);
  return `Error: ${err.message}`;
}
finally {
      setLoading(false);
    }
  };

  const handleSend = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim() || loading) return;

    const userMsg: Message = { sender: "user", text: messageToSend };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    const aiText = await fetchAIResponse(messageToSend);
    setMessages((m) => [...m, { sender: "ai", text: aiText }]);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="max-w-2xl mx-auto mt-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg flex flex-col"
      style={{ height: "80vh" }}
    >
      {/* Chat messages area */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{ whiteSpace: "pre-wrap" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-xs break-words ${
              msg.sender === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
            }`}
          >
            <ReactMarkdown
              skipHtml={true}
              components={{
                a: ({  ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-blue-600 dark:text-blue-400"
                  />
                ),
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div className="mr-auto p-3 rounded-lg max-w-xs bg-gray-200 dark:bg-gray-800 text-gray-500 italic">
            AI is typing...
          </div>
        )}
      </div>

      {/* Toggle & prompt bar */}
      <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2">
        <button
          onClick={() => setShowPrompts(!showPrompts)}
          className="text-sm text-blue-600 dark:text-blue-400 mb-2"
        >
          {showPrompts ? "Hide Suggestions ▲" : "Show Suggestions ▼"}
        </button>

        {showPrompts && (
          <div className="overflow-x-auto flex gap-2 pb-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-sm whitespace-nowrap px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="p-4 border-t dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900 sticky bottom-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          disabled={loading}
          placeholder="Ask about your campaigns or influencers..."
          className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          autoFocus
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
