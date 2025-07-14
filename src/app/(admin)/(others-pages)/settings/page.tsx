// import UserAddressCard from "@/components/user-profile/UserAddressCard";
import SettingsCard from "@/components/Settings/SettingsCard";
import { Metadata } from "next";
import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Grande",
  description: "Boost Your ADs With Influencers, UGC Creators, & Podcast Creators",
};

export default async function Settings () {

 const session = await getServerSession();

  if (!session) {
    redirect("/signin");
  }


  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <SettingsCard />
   

          {/* <UserAddressCard /> */}
        </div>
      </div>
    </div>
  );
}
