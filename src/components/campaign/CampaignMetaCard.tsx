"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // import useSession
import Button from "../ui/button/Button";
import Link from "next/link";
import ApplyToCampaign from "@/components/campaign/Apply";

type CampaignDetails = {
  id: string | number;
  campaignName: string;
  industry: string;
  startDate: string;
  endDate: string;
  deliverables: string;
  platform: string;
  productDetails: string;
  optionalProductDetails1: string;
  optionalProductDetails2: string;
  compensation: string;
  whyWeWantThisContent: string;
  dos: string;
  doNot: string;
  readyToPost: string;
  targetCountry: string;
  imageUrl?: string;
  email: string;
};

export default function CampaignMetaCard({
  campaignName,
}: {
  campaignName: string;
}) {
  const { data: session, status } = useSession();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      const res = await fetch(
        `http://localhost:5000/campaign/getcampaigns?campaignName=${encodeURIComponent(
          campaignName
        )}`
      );
      if (!res.ok) {
        console.error("Failed to fetch campaign");
        return;
      }
      const data = await res.json();
      if (data?.length > 0) setCampaign(data[0]);
    };

    fetchCampaign();
  }, [campaignName]);

  if (!campaign)
    return <div className="p-4 text-gray-500">Loading campaign...</div>;

  // While session is loading, you might want to render a loader or nothing
  if (status === "loading") {
    return <div className="p-4 text-gray-500">Checking authentication...</div>;
  }

  // If not logged in, you could display a message or hide the apply section
  if (!session?.user?.email) {
    return (
      <div className="p-4 text-red-500">
        You must be logged in to apply to this campaign.
      </div>
    );
  }

  return (
    <div className="p-8 border border-gray-300 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900 max-w-4xl mx-auto shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {campaign.campaignName}
      </h2>

      {campaign.imageUrl && (
        <div className="flex justify-center mb-8">
          <img
            src={campaign.imageUrl}
            alt={`${campaign.campaignName} image`}
            className="rounded-lg object-contain max-w-full max-h-[300px] shadow-md"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-800 dark:text-gray-300 text-lg leading-relaxed">
        <p>
          <span className="font-semibold">Industry:</span>{" "}
          {campaign.industry || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Platform:</span>{" "}
          {campaign.platform || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Start Date:</span>{" "}
          {campaign.startDate || "N/A"}
        </p>
        <p>
          <span className="font-semibold">End Date:</span>{" "}
          {campaign.endDate || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Deliverables:</span>{" "}
          {campaign.deliverables || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Product Details:</span>{" "}
          {campaign.productDetails || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Optional Product Details 1:</span>{" "}
          {campaign.optionalProductDetails1 || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Optional Product Details 2:</span>{" "}
          {campaign.optionalProductDetails2 || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Compensation:</span>{" "}
          {campaign.compensation || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Why We Want This Content:</span>{" "}
          {campaign.whyWeWantThisContent || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Dos:</span> {campaign.dos || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Don'ts:</span> {campaign.doNot || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Ready to Post:</span>{" "}
          {campaign.readyToPost || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Target Country:</span>{" "}
          {campaign.targetCountry || "N/A"}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <Link
          href={`/camp/${encodeURIComponent(campaign.campaignName)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="md">
            Public Campaign To Share
          </Button>
        </Link>

        <ApplyToCampaign
          campaignId={campaign.id.toString()}
          creatorEmail={session.user.email}
        />
      </div>
    </div>
  );
}
