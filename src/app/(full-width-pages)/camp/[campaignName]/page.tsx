"use client";

import { useParams } from "next/navigation";

import PublicCampaignView from "@/components/campaign/PublicCampaign";

export default function CampaignPage() {
  const params = useParams();
  const campaignName = params?.campaignName as string | undefined;

  if (!campaignName)
    return <div className="p-4 text-red-500">Invalid campaign identifier.</div>;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 max-w-4xl mx-auto">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7 text-center">
        Campaign Details
      </h3>

      <PublicCampaignView campaignName={campaignName} />
    </div>
  );
}
