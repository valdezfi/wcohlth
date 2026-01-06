"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import CampaignAIChat from "@/components/ai/creatorManager";

export default function AiPage() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [trialUsed, setTrialUsed] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAccess = async () => {
      if (!email) return;

      try {
        const subRes = await fetch(`https://app.cohlth.com//g/api/c/subscription?email=${email}`);
        const subData = await subRes.json();
        const isSubscribed = subData.subscription?.status === "active";

        if (isSubscribed) {
          setHasAccess(true);
          return;
        }

        const trialRes = await fetch(`https://app.cohlth.com//g/api/c/ai/trial-status?email=${email}`);
        const trialData = await trialRes.json();

        if (!trialData.used) {
          await fetch("https://app.cohlth.com//g/api/c/ai/trial-used", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          setHasAccess(true);
          setTrialUsed(true);
        } else if (trialData.used && trialData.valid) {
          setHasAccess(true);
          setTrialUsed(true);
        } else {
          setHasAccess(false);
          setTrialUsed(true);
        }
      } catch (err) {
        console.error("Error verifying access:", err);
        setHasAccess(false);
        setError("We encountered a problem verifying your subscription.");
      }
    };

    if (email) {
      checkAccess();
    }
  }, [email]);

  if (status === "loading" || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-gray-700 dark:text-white text-lg">Checking access...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    signIn();
    return null;
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black">
        <p className="text-red-600 dark:text-red-400 text-lg font-medium">
          You must be logged in to access this page.
        </p>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-black text-center px-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Subscription Required
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-md">
          Access to the AI Manager is available to Pro subscribers.
          {trialUsed ? " You have already used your free 1-hour trial." : ""}
        </p>
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}
        <a
          href="/billing"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3 rounded transition"
        >
          Upgrade to Pro
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        AI Marketing Manager
      </h1>
      <h3 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Smart help for pricing, pitching, strategy & content.
          </h3>
      {trialUsed && (
        <div className="mb-6 max-w-xl mx-auto rounded-md bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-3 text-center font-semibold">
          You are currently on your free 2 day trial.
        </div>
      )}

      <CampaignAIChat email={email} />
    </div>
  );
}
