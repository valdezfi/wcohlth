"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

import CampaignMetaCard from "@/components/campaign/CampaignMetaCard";


export default function CampaignPage() {
  const { data: session, status } = useSession();
  const user = session?.user;
  const params = useParams();
  const campaignName = params?.campaignName as string | undefined;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: `/campaign/${campaignName || ""}` });
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, campaignName]);

  if (status === "loading" || loading) return <div className="p-4">Loading...</div>;

  if (!user) return <div className="p-4 text-red-500">You must be logged in.</div>;

  if (!campaignName) return <div className="p-4 text-red-500">Invalid campaign identifier.</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Campaign Details
      </h3>

      <CampaignMetaCard campaignName={campaignName} />
    </div>
  );
}
