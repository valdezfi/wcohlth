"use client";

import React, { useEffect, useState } from "react";
import Input from "../form/input/InputField";
// import Label from "../form/Label";
import Button from "../ui/button/Button";

type Deal = {
  title: string;
  price: string;
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
        const res = await fetch(`https://app.grandeapp.com/g/deal/c/${creatorEmail}/deals`);
        if (!res.ok) throw new Error("Failed to fetch deals");
        const data = await res.json();
        if (data?.deals && Array.isArray(data.deals)) {
          setDeals(data.deals.length > 0 ? data.deals : [{ title: "", price: "" }]);
        } else {
          setDeals([{ title: "", price: "" }]);
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
    setDeals([...deals, { title: "", price: "" }]);
  };

  const handleRemoveDeal = (index: number) => {
    setDeals(deals.filter((_, i) => i !== index));
  };

  const validateDeals = () =>
    deals.every((d) => d.title.trim() !== "" && d.price.trim() !== "" && !isNaN(Number(d.price)));

  const handleSaveDeals = async () => {
    if (!validateDeals()) {
      alert("Please fill all deals correctly with valid prices.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`https://app.grandeapp.com/g/deal/c/${creatorEmail}/deals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deals }),
      });
      if (!res.ok) throw new Error("Failed to save deals");
      alert("Deals saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Add Your Deals</h2>

      {error && <p className="mb-2 text-red-600">{error}</p>}
      {loading && <p className="mb-2 text-gray-600">Loading...</p>}

      {deals.map((deal, index) => (
        <div key={index} className="flex items-center gap-3 mb-2">
          <Input
            placeholder="e.g. 2 Reels"
            value={deal.title}
            onChange={(e) => handleDealChange(index, "title", e.target.value)}
          />
          <Input
            placeholder="$100"
            value={deal.price}
            onChange={(e) => handleDealChange(index, "price", e.target.value)}
          />
          <button
            onClick={() => handleRemoveDeal(index)}
            className="text-red-500 text-sm"
            type="button"
          >
            Remove
          </button>
        </div>
      ))}

      <Button type="button" onClick={handleAddDeal} className="mt-2">
        + Add Another Deal
      </Button>

      <div className="mt-4">
        <Button onClick={handleSaveDeals} disabled={loading || !validateDeals()}>
          Save Deals
        </Button>
      </div>
    </div>
  );
}
