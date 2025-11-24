// components/ProfileReminderBanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfileReminderBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setShowBanner(true);
  }, []);

  if (!showBanner) return null;

  return (
    <div className="bg-blue-100 text-blue-900 px-4 py-2 text-center text-sm font-medium relative dark:bg-blue-900 dark:text-blue-200">
      👤 Brands use our AI system to select creators. 
      Please keep your profile consistently updated — including your category, offers, 
      and full social media links (not usernames). 
      A complete and fresh profile increases your chances of being chosen for campaigns.

      <Link href="/profile" className="underline font-semibold ml-2">
        Update Profile
      </Link>

      <button
        onClick={() => setShowBanner(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-900 hover:text-red-500 dark:text-blue-200"
      >
        ✕
      </button>
    </div>
  );
}
