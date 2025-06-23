"use client";

import { useState } from "react";
import Image from "next/image";
import { useBuyRequestNotifications } from "@/components/notification/BuyRequestWatcher";

// Make sure these are real components, or replace with div/li equivalents
import { Dropdown, DropdownItem } from "@/components/ui/dropdown"; // ← update the path as needed

interface Props {
  cryptoExchange_id: string;
}

export default function NotificationDropdown({ cryptoExchange_id }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, newNotification, clearNotification } =
    useBuyRequestNotifications(cryptoExchange_id);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    clearNotification();
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
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
            Buy Requests
          </h4>
          <ul className="space-y-3 max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((req) => (
                <li key={req.requestId}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-3 w-full text-left"
                  >
                    <Image
                      width={40}
                      height={40}
                      src={req.buyerImageUrl || "/images/default-user.png"}
                      alt={req.buyerFullName}
                      className="rounded-full"
                    />
                    <div className="text-sm text-gray-700 dark:text-white">
                      <span className="font-medium">{req.buyerFullName}</span> wants to buy{" "}
                      <strong>
                        {req.amount} {req.cryptoType}
                      </strong>
                      <div className="text-xs text-gray-400 mt-1">
                        {req.paymentMethod} • {req.country}
                      </div>
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li className="text-sm text-center text-gray-400 p-4">
                No new buy requests
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
