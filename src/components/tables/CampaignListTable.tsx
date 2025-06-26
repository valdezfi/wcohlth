"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

type Campaign = {
  campaignName: string;
  platform: string;
  imageUrl: string;
};

export default function CampaignListTable() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    if (!email) return;

    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`http://localhost:5000/campaign/getallcampaigns/${email}`);
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setCampaigns(data);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };

    fetchCampaigns();
  }, [email]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[600px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Image
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Campaign Title
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Platform
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {campaigns.map((campaign, idx) => (
                <TableRow
                  key={idx}
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.05]"
                  onClick={() =>
                    window.location.href = `/campaign/${encodeURIComponent(campaign.campaignName)}`
                  }
                >
                  <TableCell className="px-5 py-4 text-start">
                    <div className="w-14 h-14 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <img
                        src={campaign.imageUrl}
                        alt={campaign.campaignName}
                        width={56}
                        height={56}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-gray-800 dark:text-white text-sm font-medium">
                    {campaign.campaignName}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-gray-600 dark:text-gray-300 text-sm">
                    {campaign.platform}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

