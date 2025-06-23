"use client";

import React, { useEffect, useState } from "react";

interface SellerOrderData {
  id: string;
  cryptoType: string;
  amount: string;
  price: string;
  paymentMethod: string;
  country: string;
  currency: string;
}

interface Props {
  sellorder: string;
}


const PAYMENT_METHOD_OPTIONS = ["Bank Transfer", "PayPal", "Cash", "Credit Card", "Other"];
const COUNTRY_OPTIONS = ["LATAM", "India", "UAE"];
const CURRENCY_OPTIONS = ["USD", "INR", "AED", "EUR", "GBP"];

export default function ListingForm({ sellorder }: Props) {
  const [data, setData] = useState<SellerOrderData | null>(null);
  const [form, setForm] = useState<Partial<SellerOrderData>>({});
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!sellorder) return;
    setLoading(true);
    setError(null);

    fetch(`http://localhost:5000/api/crypto/getsellerorder/${sellorder}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text() || "Failed to fetch order");
        return res.json();
      })
      .then((result: SellerOrderData) => {
        setData(result);
        setForm(result);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load seller order.");
      })
      .finally(() => setLoading(false));
  }, [sellorder]);

  const handleChange = (field: keyof SellerOrderData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);
    try {
      const formToSend = {
        cryptoForSale: "USDT",
        amount: form.amount ?? "",
        price: form.price ?? "",
        paymentPreference: form.paymentMethod ?? "",
        sellerCountry: form.country ?? "",
        sellByDate: null,
        currency: form.currency ?? "",
      };

      const res = await fetch(`http://localhost:5000/api/crypto/updateorder/${sellorder}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToSend),
      });

      if (!res.ok) throw new Error(await res.text() || "Failed to update order");

      const updated = await res.json(); // should be full updated record
      setData(updated);
      setForm(updated);
      setEditMode(false);
      setSuccess("Changes saved successfully.");
    } catch (err) {
      console.error(err);
      setError(`Failed to save changes: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  };

  if (loading) return <p>Loading seller order...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return <p>No seller order found.</p>;

  const fields: Array<[string, keyof SellerOrderData]> = [
    ["Crypto Type", "cryptoType"],
    ["Amount", "amount"],
    ["Price", "price"],
    ["Payment Method", "paymentMethod"],
    ["Country", "country"],
    ["Currency", "currency"],
  ];

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Details</h2>

      {fields.map(([label, key]) => (
        <div key={key} className="mb-3">
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {label}
          </label>

          {editMode ? (
            key === "cryptoType" ? (
              <select
                value="USDT"
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-200 cursor-not-allowed dark:bg-gray-700 dark:text-gray-300"
              >
                <option value="USDT">USDT</option>
              </select>
            ) : key === "paymentMethod" ? (
              <select
                value={form.paymentMethod ?? ""}
                onChange={(e) => handleChange("paymentMethod", e.target.value)}
                className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>Select Payment Method</option>
                {PAYMENT_METHOD_OPTIONS.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            ) : key === "country" ? (
              <select
                value={form.country ?? ""}
                onChange={(e) => handleChange("country", e.target.value)}
                className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>Select Country</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : key === "currency" ? (
              <select
                value={form.currency ?? ""}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              >
                <option value="" disabled>Select Currency</option>
                {CURRENCY_OPTIONS.map((cur) => (
                  <option key={cur} value={cur}>{cur}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              />
            )
          ) : (
            <p className="text-gray-800 dark:text-gray-200">{data[key] || "—"}</p>
          )}
        </div>
      ))}

      {success && <p className="text-green-600 mt-4">{success}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}

      <div className="mt-6 flex justify-end space-x-3">
        {editMode ? (
          <>
            <button
              onClick={() => {
                setEditMode(false);
                setForm(data ?? {});
              }}
              className="px-4 py-2 border rounded text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              setEditMode(true);
              setSuccess(null);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
