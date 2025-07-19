"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "../ui/button/Button";
import Link from "next/link";
import ApplyToCampaign from "@/components/campaign/Apply";
import { Modal } from "@/components/ui/modal";
import ChattingWithCampaign from "@/components/Message/Chat";

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

type CreatorInfo = {
  email: string;
};

export default function CampaignMetaCard({
  campaignName,
}: {
  campaignName: string;
}) {
  const { data: session, status } = useSession();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [creatorStatus, setCreatorStatus] = useState<string | null>(null);
  const [chatCreator, setChatCreator] = useState<CreatorInfo | null>(null);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  // Removed loadingStatus since it's unused
  const [errorCampaign, setErrorCampaign] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const emailuser = session?.user?.email;

  // Fetch campaign details
  useEffect(() => {
    if (!campaignName) return;

    async function fetchCampaign() {
      setLoadingCampaign(true);
      setErrorCampaign(null);
      try {
        const res = await fetch(
          `/g/campaign/getcampaigns?campaignName=${encodeURIComponent(
            campaignName
          )}`
        );
        if (!res.ok) throw new Error(`Failed to fetch campaign: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setCampaign(data[0]);
        else setErrorCampaign("No campaign found");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorCampaign(error.message);
          console.error(error);
        } else {
          setErrorCampaign("Unknown error fetching campaign");
          console.error(error);
        }
      } finally {
        setLoadingCampaign(false);
      }
    }
    fetchCampaign();
  }, [campaignName]);

  // Fetch creator status
  useEffect(() => {
    if (!campaignName || !emailuser) {
      setCreatorStatus(null);
      // No loadingStatus state anymore
      return;
    }

    async function fetchStatus() {
      setErrorStatus(null);
      try {
        const res = await fetch(
          `/g/campaigns/${encodeURIComponent(campaignName)}/creators/status`
        );
        if (!res.ok) throw new Error(`Failed to fetch status: ${res.status}`);
        const data = await res.json();

        if (typeof emailuser === "string" && emailuser in data) {
          setCreatorStatus(data[emailuser]);
        } else {
          setCreatorStatus("not applied");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorStatus(error.message);
          console.error(error);
        } else {
          setErrorStatus("Unknown error fetching status");
          console.error(error);
        }
        setCreatorStatus("not applied");
      }
    }

    fetchStatus();
  }, [campaignName, emailuser]);

  if (loadingCampaign)
    return <div className="p-4 text-gray-500">Loading campaign...</div>;

  if (errorCampaign)
    return (
      <div className="p-4 text-red-500">
        Error loading campaign: {errorCampaign}
      </div>
    );

  if (status === "loading")
    return <div className="p-4 text-gray-500">Checking authentication...</div>;

  if (!session?.user?.email)
    return (
      <div className="p-4 text-red-500">
        You must be logged in to apply to this campaign.
      </div>
    );

  if (!campaign)
    return (
      <div className="p-4 text-gray-500">
        Campaign not found or unavailable.
      </div>
    );

  return (
    <div className="p-8 border border-gray-300 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900 max-w-4xl mx-auto shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {campaign.campaignName}
      </h2>

      {campaign.imageUrl && (
        <div className="flex justify-center mb-8">
          {/* 
            Next.js recommends using next/image for optimization, 
            but if you want to keep <img>, you can disable the lint warning
          */}
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
          <span className="font-semibold">Do not:</span> {campaign.doNot || "N/A"}
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

      {(creatorStatus || errorStatus) && (
        <p className="mt-4 text-center font-semibold text-blue-600">
          Your status: {creatorStatus ?? "not applied"}
          {errorStatus && ` (Error fetching status: ${errorStatus})`}
        </p>
      )}

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

        {creatorStatus === "approved" && (
          <>
            <Button onClick={() => setChatCreator({ email: campaign.email })}>
              Chat with Brand
            </Button>

            <Modal
              isOpen={!!chatCreator}
              onClose={() => setChatCreator(null)}
              className="max-w-2xl"
            >
              {chatCreator && campaign.id && (
                <ChattingWithCampaign
                  creatorEmail={chatCreator.email}
                  campaignId={campaign.id.toString()}
                />
              )}
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}
