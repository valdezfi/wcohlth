import { Suspense } from "react";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Grande",
  description: "Boost Your ADs With Influencers, UGC Creators, & Podcast Creators",
};

export default function NewPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordForm />
    </Suspense>
  );
}
