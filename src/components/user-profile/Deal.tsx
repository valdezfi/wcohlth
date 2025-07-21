"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type CreatorDeal = {
  id: number;
  paymentId: number;
  creatorEmail: string;
  dealDescription: string;
  price: number;
  dealType?: "UGC" | "Reels" | "Podcast" | "Other";
  createdAt?: string;
};

export default function CreatorDealsPage({ email }: { email: string }) {
  const [deals, setDeals] = useState<CreatorDeal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email) {
      fetchDeals();
    }
  }, [email]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/creator-deals/${email}`);
      setDeals(res.data || []);
    } catch (err) {
      console.error("Error fetching deals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = <K extends keyof CreatorDeal>(
    index: number,
    field: K,
    value: CreatorDeal[K]
  ) => {
    const updated = [...deals];
    updated[index] = { ...updated[index], [field]: value };
    setDeals(updated);
  };

  const handleSave = async (deal: CreatorDeal) => {
    try {
      await axios.put(`/api/creator-deals/${deal.creatorEmail}/${deal.id}`, deal);
      alert("Deal updated!");
    } catch (err) {
      console.error("Error updating deal:", err);
      alert("Error updating deal");
    }
  };

  const handleDelete = async (creatorEmail: string, id: number) => {
    try {
      await axios.delete(`/api/creator-deals/deal/${creatorEmail}/${id}`);
      setDeals((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Error deleting deal:", err);
      alert("Error deleting deal");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-xl font-bold">Creator Deals</h2>
      {deals.length === 0 && <p>No deals found.</p>}

      {deals.map((deal, index) => (
        <div
          key={deal.id}
          className="border rounded-xl p-4 shadow-md bg-white space-y-2"
        >
          <div>
            <label className="block text-sm font-semibold">Deal Description:</label>
            <input
              type="text"
              className="border rounded p-2 w-full"
              value={deal.dealDescription}
              onChange={(e) =>
                handleChange(index, "dealDescription", e.target.value)
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Price (USD):</label>
            <input
              type="number"
              className="border rounded p-2 w-full"
              value={deal.price}
              onChange={(e) => handleChange(index, "price", Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Deal Type:</label>
            <select
              className="border rounded p-2 w-full"
              value={deal.dealType || ""}
              onChange={(e) =>
                handleChange(index, "dealType", e.target.value as CreatorDeal["dealType"])
              }
            >
              <option value="">Select Deal Type</option>
              <option value="UGC">UGC</option>
              <option value="Reels">Reels</option>
              <option value="Podcast">Podcast</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={() => handleSave(deal)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => handleDelete(deal.creatorEmail, deal.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
