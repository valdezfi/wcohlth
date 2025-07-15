// components/ProfileReminderBanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfileReminderBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Always show on mount after login
    setShowBanner(true);
  }, []);

  if (!showBanner) return null;

  return (
    <div className="bg-blue-100 text-blue-900 px-4 py-2 text-center text-sm font-medium relative dark:bg-blue-900 dark:text-blue-200">
      👤 Please make sure your profile is complete and up to date. This helps us connect you with the best campaigns and opportunities.
      <Link href="/profile" className="underline font-semibold ml-2">
        Update Now
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