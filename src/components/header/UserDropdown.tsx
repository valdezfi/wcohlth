"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

const DEFAULT_IMAGE = "/images/user/placeholder.svg";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function UserDropdown() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("User");
  const [profileImage, setProfileImage] = useState(DEFAULT_IMAGE);
  const [error, setError] = useState<string | null>(null);

  const toggleDropdown = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setIsOpen((prev) => !prev);
    },
    []
  );

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.email) return;

    let cancelled = false;

    async function fetchUserInfo() {
      try {
        setError(null);
        const [infoRes, imageRes] = await Promise.all([
          fetch(`${API_BASE}/creator/getgeneralinfoemail/${session.user.email}`),
          fetch(`${API_BASE}/creator/getprofileimage/${session.user.email}`),
        ]);

        if (!infoRes.ok) throw new Error("Failed to fetch user info");
        if (!imageRes.ok) throw new Error("Failed to fetch profile image");

        const infoData = await infoRes.json();
        const imageData = await imageRes.json();

        if (!cancelled) {
          setFullName(infoData?.fullName || "User");
          setProfileImage(imageData?.imageUrl || DEFAULT_IMAGE);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Error loading user info");
          console.error(err);
          // fallback to defaults is already set
        }
      }
    }

    fetchUserInfo();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.email, status]);

  const shortName = fullName?.split(" ")[0] || "User";

  return (
    <div className="relative" aria-label="User menu">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="user-dropdown"
      >
        <span className="mr-3 h-11 w-11 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <img
            src={profileImage}
            alt={shortName}
            width={44}
            height={44}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
            }}
          />
        </span>
        <span className="block mr-1 font-medium text-theme-sm">{shortName}</span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        id="user-dropdown"
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] w-[260px] rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {fullName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400 truncate">
            {session?.user?.email}
          </span>
          {error && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem tag="a" href="/profile" onItemClick={closeDropdown}>
              Edit Profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem tag="a" href="/settings" onItemClick={closeDropdown}>
              Account Settings
            </DropdownItem>
          </li>
          <li>
            <DropdownItem tag="a" href="mailto:support@numerobook.com" onItemClick={closeDropdown}>
              support@numerobook.com
            </DropdownItem>
          </li>
        </ul>

        {session?.user ? (
          <div
            onClick={() => {
              closeDropdown();
              signOut();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && signOut()}
            className="cursor-pointer mt-3 flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            aria-label="Sign out"
          >
            <svg
              className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.1 19.25c-.41 0-.75-.34-.75-.75v-4.25h-1.5v4.25c0 1.24 1.01 2.25 2.25 2.25h3.4c1.24 0 2.25-1.01 2.25-2.25V5.5c0-1.24-1.01-2.25-2.25-2.25h-3.4C13.86 3.25 12.85 4.26 12.85 5.5v4.25h1.5V5.5c0-.41.34-.75.75-.75h3.4c.41 0 .75.34.75.75v13c0 .41-.34.75-.75.75h-3.4ZM3.25 12c0 .22.09.41.24.55l4.61 4.61c.29.29.77.29 1.06 0s.29-.77 0-1.06L5.81 12.75h10.19c.41 0 .75-.34.75-.75s-.34-.75-.75-.75H5.81l3.35-3.35a.75.75 0 0 0-1.06-1.06L3.49 11.45a.75.75 0 0 0-.24.55Z"
                fill="currentColor"
              />
            </svg>
            Sign out
          </div>
        ) : (
          <Link
            href="/signin"
            onClick={closeDropdown}
            className="mt-3 flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
          >
            Sign in
          </Link>
        )}
      </Dropdown>
    </div>
  );
}
