"use client";

import { useEffect, useState, useRef } from "react";

interface CommentItem {
  id: number;
  comment: string;
  userType: "brand" | "creator";
  createdAt: string;
}

interface CampaignCommentsProps {
  campaignId: string;
  brandEmail: string;
  creatorEmail: string;
  userType: "brand" | "creator";
}

export default function CampaignComments({
  campaignId,
  brandEmail,
  creatorEmail,
  userType,
}: CampaignCommentsProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const load = async () => {
    const params = new URLSearchParams({
      campaignId,
      brandEmail,
      creatorEmail,
    }).toString();

    const res = await fetch(`https://app.grandeapp.com/g/api/campaign/comments?${params}`);
    const data = await res.json();
    if (data.success) setComments(data.comments);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const submit = async () => {
    if (!text.trim()) return;

    await fetch(`https://app.grandeapp.com/g/api/campaign/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignId,
        brandEmail,
        creatorEmail,
        userType,
        comment: text.trim(),
      }),
    });

    setText("");
    load();
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded border">
      <div className="h-80 overflow-y-auto p-3 bg-gray-100 dark:bg-gray-800 mb-4 rounded">
        {comments.map((msg) => (
          <div
            key={msg.id}
            className={`mb-3 p-2 rounded max-w-[80%] ${
              msg.userType === userType
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-white dark:bg-gray-700 border"
            }`}
          >
            <div>{msg.comment}</div>
            <div className="text-[10px] opacity-60">
              {new Date(msg.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border rounded p-2 mb-3"
        placeholder="Write a private comment..."
      />

      <button
        onClick={submit}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Post Comment
      </button>
    </div>
  );
}
