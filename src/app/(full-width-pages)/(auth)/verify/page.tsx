import React, { Suspense } from "react";
import VerifyEmailPage from "@/components/auth/Verify";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grande",
  description: "Boost Your ADs With Influencers, UGC Creators, & Podcast Creators",
};

export default function SignIn() {
  return (
    <Suspense fallback={<div>Verifying email...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
}
