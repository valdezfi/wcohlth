'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CreatorGeneralPublicProfileCard() {
  const params = useParams();
  const email = decodeURIComponent(params?.email as string);

  const [creator, setCreator] = useState({
    creatorName: "",
    agency: "",
    email: "",
    twitchLink: "",
    instagram: "",
    youtube: "",
    website: "",
    imageUrl: "",
    phone: "",
    tiktokLink: "",
    niche: "",
    country: "",
    address: "",
    addressTwo: "",
    zipcode: "",
    about: "",
    appliedCampaigns: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!email) return;

    const fetchCreator = async () => {
      try {
        // const res = await fetch(`http://localhost:5000/creator/getgeneralinfo/${email}`);

        const res = await fetch(`https://app.cohlth.com/g/creator/getgeneralinfo/${email}`);







        if (!res.ok) throw new Error("Failed to fetch creator info");

        const data = await res.json();
        setCreator(data);
      } catch (error) {
        console.error("Error loading creator info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [email]);

  if (loading) return <p className="p-4">Loading creator info...</p>;

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/[0.03] max-w-4xl mx-auto">
      <div className="flex items-center gap-5 mb-6">
        <img
          src={
            creator.imageUrl !== "Not Provided"
              ? creator.imageUrl
              : `https://ui-avatars.com/api/?name=${creator.creatorName}&background=gray&color=fff`
          }
          alt={creator.creatorName}
          className="w-20 h-20 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {creator.creatorName}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{creator.agency}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <Info label="Email" value={creator.email} />
        <Info label="Phone" value={creator.phone} />
        <Info label="Country" value={creator.country} />
        <Info label="Niche" value={creator.niche} />
        <Info label="Address" value={creator.address} />
        <Info label="Address Line 2" value={creator.addressTwo} />
        <Info label="Zip Code" value={creator.zipcode} />
        <Info label="About" value={creator.about} />
        <Info label="Instagram" value={creator.instagram} />
        <Info label="TikTok" value={creator.tiktokLink} />
        <Info label="YouTube" value={creator.youtube} />
        <Info label="Twitch" value={creator.twitchLink} />
        <Info label="Website" value={creator.website} />
      </div>
    </div>
  );
}

// Reusable info item
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-gray-800 dark:text-white/90">{value !== "Not Provided" ? value : "—"}</p>
    </div>
  );
}
