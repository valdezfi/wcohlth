"use client";

import React from "react";
import Pricing from "@/components/billing/Pricing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <main className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-center text-gray-800 dark:text-white">
        Loading session...
      </main>
    );
  }

  if (status === "unauthenticated") {
    router.push("/signin"); // Or your custom login page
    return null;
  }

  const email = session?.user?.email;

  return (
    <main className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      {email ? (
        <Pricing email={email} />
      ) : (
        <div className="text-center text-gray-800 dark:text-white">Email not found in session.</div>
      )}
    </main>
  );
}
