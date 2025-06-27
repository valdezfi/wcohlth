"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  sender: "user" | "ai";
  text: string;
};

const SUGGESTED_PROMPTS = [
  "How can I improve my current influencer campaigns combined with TikTok and Facebook ads based n may latest campaign in app?", "Improve my last influencer campaign.",
  "What type of creators should I partner with to maximize ROI on a low budget using IG ads and influencer posts?",
  "Give me ideas to increase conversions from influencer marketing mixed with paid ads on TikTok and Instagram.",
  "Which platform (TikTok, Facebook, IG) should I prioritize for better campaign ROI?",
  "What kind of micro-influencers work best for beauty brands alongside paid ads?",
  "How can I optimize my TikTok influencer campaigns with targeted Facebook and Instagram ads?",
  "What is the best way to integrate influencer content with paid social ads for small businesses?",
  "How can I balance spending between influencer marketing and paid ads for maximum growth?",
  "Suggest cost-effective strategies mixing influencer marketing and paid ads for local brand awareness.",
  "What metrics should I track to measure success when combining influencer campaigns with Facebook and TikTok ads?"
];


export default function CampaignAIChat({ email }: { email: string }) {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! I'm your AI Campaign Manager. How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  const fetchAIResponse = async (text: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/ai/marketing-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message: text }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      return data.reply as string;
    } catch (e: any) {
      console.error("AI fetch error:", e);
      return `Error: ${e.message}`;
    } finally {
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
                a: ({ node, ...props }) => (
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
