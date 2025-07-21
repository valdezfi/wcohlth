"use client";

import React, { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

type Deal = {
  id?: number; // Assuming your backend returns deal IDs
  dealDescription: string;
  price: string | number;
};

export default function CreatorDealsOnly({ creatorEmail }: { creatorEmail: string }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!creatorEmail) return;

    const fetchDeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `https://app.grandeapp.com/g/d/getdeal/${encodeURIComponent(creatorEmail)}`
        );
        if (!res.ok) throw new Error("Failed to fetch deals");
        const data = await res.json();
        if (data?.deals && Array.isArray(data.deals)) {
          setDeals(data.deals.length > 0 ? data.deals : [{ dealDescription: "", price: "" }]);
        } else {
          setDeals([{ dealDescription: "", price: "" }]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [creatorEmail]);

  const handleDealChange = (index: number, field: keyof Deal, value: string) => {
    const updated = [...deals];
    updated[index][field] = value;
    setDeals(updated);
  };

  const handleAddDeal = () => {
    setDeals([...deals, { dealDescription: "", price: "" }]);
  };

  // New: Remove deal API call + update UI
  const handleRemoveDeal = async (index: number) => {
    const dealToRemove = deals[index];

    if (dealToRemove.id) {
      // If deal has an ID, remove from backend
      try {
        setLoading(true);
        const res = await fetch(
          `https://app.grandeapp.com/g/d/deal/${encodeURIComponent(creatorEmail)}/${dealToRemove.id}`,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) throw new Error("Failed to remove deal");
        // Remove from state after successful delete
        setDeals((prev) => prev.filter((_, i) => i !== index));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    } else {
      // If no id (new unsaved deal), just remove locally
      setDeals((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateDeals = () =>
    deals.every(
      (d) =>
        typeof d.dealDescription === "string" &&
        d.dealDescription.trim() !== "" &&
        (typeof d.price === "string" || typeof d.price === "number") &&
        String(d.price).trim() !== "" &&
        !isNaN(Number(d.price))
    );

  const handleSaveDeals = async () => {
    if (!validateDeals()) {
      alert("Please fill all deals correctly with valid prices.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(
        `https://app.grandeapp.com/g/d/deal/${encodeURIComponent(creatorEmail)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deals }),
        }
      );
      if (!res.ok) throw new Error("Failed to save deals");
      alert("Deals saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Add Your Deals</h2>

      {error && <p className="mb-4 text-red-600">{error}</p>}
      {loading && <p className="mb-4 text-gray-600 dark:text-gray-400">Loading...</p>}

      {deals.map((deal, index) => (
        <div key={deal.id ?? index} className="flex items-center gap-3 mb-4">
          <Input
            placeholder="e.g. 2 Reels"
            value={deal.dealDescription}
            onChange={(e) => handleDealChange(index, "dealDescription", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="$100"
            value={String(deal.price)}
            onChange={(e) => handleDealChange(index, "price", e.target.value)}
            className="w-24"
          />
          <button
            onClick={() => handleRemoveDeal(index)}
            className="text-red-500 text-sm hover:underline"
            type="button"
            aria-label="Remove deal"
          >
            Remove
          </button>
        </div>
      ))}

      <Button
        type="button"
        onClick={handleAddDeal}
        className="w-full mb-4"
        aria-label="Add another deal"
      >
        + Add Another Deal
      </Button>

      <Button onClick={handleSaveDeals} disabled={loading || !validateDeals()} className="w-full">
        Save Deals
      </Button>
    </div>
  );
}
