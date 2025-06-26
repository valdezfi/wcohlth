"use client";

import { useEffect, useState } from "react";

type CampaignDetails = {
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

export default function PublicCampaignView({ campaignName }: { campaignName: string }) {
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      const res = await fetch(`http://localhost:5000/campaign/getcampaigns?campaignName=${campaignName}`);
      if (!res.ok) {
        console.error("Failed to fetch campaign");
        return;
      }
      const data = await res.json();
      if (data?.length > 0) setCampaign(data[0]);
    };
    fetchCampaign();
  }, [campaignName]);

  if (!campaign) return <div className="p-4 text-gray-500 text-center">Loading campaign...</div>;

  const handleApply = () => {
  // Replace the URL below with your actual application page or external link
  const applyUrl = `/apply?campaign=${encodeURIComponent(campaign.campaignName)}`;

  window.location.href = applyUrl;
};


  return (
    <div className="p-8 border border-gray-300 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900 max-w-4xl mx-auto shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">{campaign.campaignName}</h2>

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
        <div><p><span className="font-semibold">Industry:</span> {campaign.industry || "N/A"}</p></div>
        <div><p><span className="font-semibold">Platform:</span> {campaign.platform || "N/A"}</p></div>
        <div><p><span className="font-semibold">Start Date:</span> {campaign.startDate || "N/A"}</p></div>
        <div><p><span className="font-semibold">End Date:</span> {campaign.endDate || "N/A"}</p></div>
        <div className="sm:col-span-2"><p><span className="font-semibold">Deliverables:</span> {campaign.deliverables || "N/A"}</p></div>
        <div className="sm:col-span-2"><p><span className="font-semibold">Product Details:</span> {campaign.productDetails || "N/A"}</p></div>
        <div><p><span className="font-semibold">Optional Product Details 1:</span> {campaign.optionalProductDetails1 || "N/A"}</p></div>
        <div><p><span className="font-semibold">Optional Product Details 2:</span> {campaign.optionalProductDetails2 || "N/A"}</p></div>
        <div><p><span className="font-semibold">Compensation:</span> {campaign.compensation || "N/A"}</p></div>
        <div className="sm:col-span-2"><p><span className="font-semibold">Why We Want This Content:</span> {campaign.whyWeWantThisContent || "N/A"}</p></div>
        <div className="sm:col-span-2"><p><span className="font-semibold">Dos:</span> {campaign.dos || "N/A"}</p></div>
        <div className="sm:col-span-2"><p><span className="font-semibold">Don'ts:</span> {campaign.doNot || "N/A"}</p></div>
        <div><p><span className="font-semibold">Ready to Post:</span> {campaign.readyToPost || "N/A"}</p></div>
        <div><p><span className="font-semibold">Target Country:</span> {campaign.targetCountry || "N/A"}</p></div>
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleApply}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition"
          type="button"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
