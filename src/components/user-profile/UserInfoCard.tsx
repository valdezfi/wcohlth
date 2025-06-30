"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

const countryOptions = [
  "United States",
  "Mexico",
  "Dominican Republic",
  "Argentina",
  "Brazil",
  "Colombia",
  "Chile",
  "Venezuela",
  "Canada",
  "Spain",
  "France",
  "Italy",
];

const industryOptions = [
  "Consumer Tech",
  "Beauty & Personal Care",
  "Fashion & Apparel",
  "Food & Beverage",
  "Health & Wellness",
  "Finance & Fintech",
  "Entertainment & Media",
  "Real Estate",
  "Education",
];

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { data: session } = useSession();
  const user = session?.user;

  const [info, setInfo] = useState({
    email: "",
    niche: "",
    country: "",
    creatorName: "",
  });

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/creator/getgeneralinfoemail/${encodeURIComponent(user.email)}`
        );
        if (!res.ok) throw new Error("Failed to fetch brand info");

        const data = await res.json();
        const brand = data.user || data;

        setInfo({
          email: brand.email || user.email,
          niche: brand.niche || "",
          country: brand.country || "",
          creatorName: brand.creatorName || "",
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    };

    fetchData();
  }, [user?.email]);

  const handleChange = (field: keyof typeof info, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user?.email) return;

    try {
      const res = await fetch(
        `http://localhost:5000/creator/updategeneralinfo/${encodeURIComponent(user.email)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(info),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to update info: ${res.status} ${errText}`);
      }

      closeModal();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Creator Info
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {["email", "niche", "country"].map((field) => (
              <div key={field}>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {field}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {info[field as keyof typeof info] || "—"}
                </p>
              </div>
            ))}

            {info.creatorName && (
              <div className="lg:col-span-2 mt-4">
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                  Public Profile
                </p>
                <a
                  href={`http://localhost:3000/c/${encodeURIComponent(info.creatorName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 underline break-all"
                >
                  📣 http://localhost:3000/c/{info.creatorName}
                </a>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
        >
          Edit
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Brand Info
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update your brand info below.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-2 lg:grid-cols-2">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={info.email}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed dark:bg-gray-700"
                />
              </div>

              <div>
                <Label>Country</Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={info.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                >
                  <option value="">Select Country</option>
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Niche</Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={info.niche}
                  onChange={(e) => handleChange("niche", e.target.value)}
                >
                  <option value="">Select niche</option>
                  {industryOptions.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
