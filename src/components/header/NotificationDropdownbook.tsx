"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface CampaignNotification {
  id: number;
  campaignName: string;
  brandname: string | null;
  brandImageUrl: string | null;
  startDate: string;
  endDate: string;
  compensation: string;
  targetCountry: string;
  imageUrl?: string | null;
}

export default function CampaignNotificationDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CampaignNotification[]>([]);
  const [newNotification, setNewNotification] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchCampaigns = useCallback(async () => {
    if (status !== "authenticated" || !session?.user?.email) return;

    try {
      const res = await fetch(
        `http://localhost:5000/campaign/getcampaigns?email=${encodeURIComponent(session.user.email)}`
      );
      if (!res.ok) {
        setNotifications([]);
        return;
      }
      const data: CampaignNotification[] = await res.json();
      setNotifications(data);
      if (data.length > 0) setNewNotification(true);
    } catch (err) {
      console.error("Failed to fetch campaigns:", err);
      setNotifications([]);
    }
  }, [session?.user?.email, status]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setNewNotification(false); // Clear notification indicator on open
    }
  }, [isOpen]);

  // Fetch campaigns on mount and when session changes
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Campaign Notifications"
        onClick={toggleDropdown}
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      >
        {newNotification && (
          <span className="absolute top-0.5 right-0 h-2 w-2 z-10 rounded-full bg-orange-400">
            <span className="absolute inline-flex w-full h-full rounded-full bg-orange-400 opacity-75 animate-ping" />
          </span>
        )}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[350px] rounded-md shadow-lg bg-white dark:bg-gray-800 z-50 p-3">
          <h4 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white">
            Campaign Notifications
          </h4>
          <ul className="space-y-3 max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((campaign) => (
                <li key={campaign.id} className="flex gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <img
                    src={campaign.brandImageUrl || campaign.imageUrl || "/images/default-campaign.png"}
                    alt={campaign.brandname || campaign.campaignName}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="text-gray-700 dark:text-white text-sm flex flex-col">
                    <span className="font-semibold">{campaign.campaignName}</span>
                    {campaign.brandname && (
                      <span className="text-xs text-gray-400 dark:text-gray-300">{campaign.brandname}</span>
                    )}
                    <span className="text-xs mt-1">
                      {campaign.compensation} • {campaign.targetCountry}
                    </span>
                    <span className="text-xs mt-1 text-gray-400 dark:text-gray-500">
                      {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-center text-gray-400 p-4">No new campaigns</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
