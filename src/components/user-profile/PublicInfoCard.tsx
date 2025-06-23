'use client';

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicUserInfoCard() {
  const params = useParams();
  const fullname = decodeURIComponent(params?.fullname as string);

  const [info, setInfo] = useState({
    fullname: "",
    email: "",
    country: "",
    imageUrl: "",
    buyerPositiveCount: 0,
    buyerNegativeCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fullname) return;

    const fetchPublicInfo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/crypto/publicprofile/${fullname}`);
        if (!res.ok) throw new Error("Failed to fetch public profile");

        const data = await res.json();

        setInfo({
          fullname: data.fullname || "",
          email: data.email || "",
          country: data.country || "",
          imageUrl: data.imageUrl || "https://ui-avatars.com/api/?name=User",
          buyerPositiveCount: data.buyerPositiveCount || 0,
          buyerNegativeCount: data.buyerNegativeCount || 0,
        });
      } catch (error) {
        console.error("Error fetching public user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicInfo();
  }, [fullname]);

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-white/[0.03] max-w-4xl mx-auto">
      <div className="flex items-center gap-5 mb-6">
        <img
          src={info.imageUrl}
          alt={info.fullname}
          className="w-20 h-20 rounded-full object-cover border border-gray-300"
        />
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{info.fullname}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            👍 {info.buyerPositiveCount} | 👎 {info.buyerNegativeCount}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{info.email || "—"}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Country</p>
          <p className="text-sm font-medium text-gray-800 dark:text-white/90">{info.country || "—"}</p>
        </div>
      </div>
    </div>
  );
}
