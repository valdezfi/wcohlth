"use client";

import React, { useEffect, useState } from "react";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";

type Deal = {
  id?: number;
  dealDescription: string;
  price: string | number;
};

export default function CreatorDealsOnly({ creatorEmail }: { creatorEmail: string }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);

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

  const handleDealChange = <K extends keyof Deal>(
    index: number,
    field: K,
    value: Deal[K]
  ) => {
    const updated = [...deals];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setDeals(updated);
  };

  const handleAddDeal = () => {
    setDeals([...deals, { dealDescription: "", price: "" }]);
  };

  const handleRemoveDeal = async (index: number) => {
    const dealToRemove = deals[index];

    if (dealToRemove.id) {
      try {
        setRemovingId(dealToRemove.id);
        const res = await fetch(
          `https://app.grandeapp.com/g/d/deal/${encodeURIComponent(
            creatorEmail
          )}/${dealToRemove.id}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error("Failed to remove deal");
        setDeals((prev) => prev.filter((_, i) => i !== index));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setRemovingId(null);
      }
    } else {
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
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
    <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
  Your Offers for Collaboration — Stay in Control, Set Your Own Price.
  <br />
  <small className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">
    Please list your offers below clearly so potential collaborators know what you provide and at what price.
  </small>
</h2>


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
            className="text-red-500 text-sm hover:underline disabled:opacity-50"
            type="button"
            aria-label="Remove deal"
            disabled={removingId === deal.id}
          >
            {removingId === deal.id ? "Removing..." : "Remove"}
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
