"use client";

import { useSession } from "next-auth/react";
import CampaignAIChat from "@/components/ai/MarketingManager";

export default function AiPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-gray-700 dark:text-white">Loading...</p>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-red-600 dark:text-red-400">
          No email found. Please log in to access the AI Campaign Manager.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">
     Marketing Manager
      </h1>
      <CampaignAIChat email={session.user.email} />
    </div>
  );
}
