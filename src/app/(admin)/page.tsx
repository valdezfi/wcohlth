import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CampaignListTable from "@/components/tables/CampaignListTable";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Grande",
  description: "Boost Your ADs With Influencers, UGC Creators, & Podcast Creators",
};

export default async function BasicTables() {
  const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="All Your Campaigns " />
      <div className="space-y-6">
        <ComponentCard title="Campaigns">
          <CampaignListTable />
        </ComponentCard>
      </div>
    </div>
  );
}
