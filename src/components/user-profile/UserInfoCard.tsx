"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

// Country and Industry options
const countryOptions = [
  "United States", "Mexico", "Dominican Republic", "Argentina", "Brazil", "Colombia", "Chile", "Venezuela",
  "Canada", "Spain", "France", "Italy",
];

const industryOptions = [
  "Consumer Tech", "Beauty & Personal Care", "Fashion & Apparel", "Food & Beverage",
  "Health & Wellness", "Finance & Fintech", "Entertainment & Media", "Real Estate", "Education",
];

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { data: session } = useSession();
  const user = session?.user;

  const [info, setInfo] = useState({
    email: "",
    industry: "",
    role: "",
    country: "",
    website: "",
  });

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/brand/getgeneralinfo/${user.email}`);
        const data = await res.json();
        const userData = data.user || data;

        setInfo({
          email: userData.email || user.email,
          industry: userData.industry || "",
          role: userData.role || "",
          country: userData.country || "",
          website: userData.website || "",
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
        `http://localhost:5000/brand/updategeneralinfo/${user.email}`,
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
            Brand Info
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            {["email", "industry", "role", "country", "website"].map((field) => (
              <div key={field}>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {field}
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {info[field as keyof typeof info] || "—"}
                </p>
              </div>
            ))}
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
                  type="text"
                  value={info.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  type="text"
                  value={info.website}
                  onChange={(e) => handleChange("website", e.target.value)}
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
                <Label>Industry</Label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
                  value={info.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                >
                  <option value="">Select Industry</option>
                  {industryOptions.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <Label>Role</Label>
                <Input
                  type="text"
                  value={info.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                />
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
