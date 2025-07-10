"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

type BillingDetails = {
  name: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
};

export default function CheckoutForm({
  onCompleteBilling,
}: {
  onCompleteBilling: (details: BillingDetails) => Promise<void>;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [address, setAddress] = useState<BillingDetails["address"]>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setErrorMessage("");

  if (!stripe || !elements) {
    setErrorMessage("Stripe is not loaded yet.");
    return;
  }

  if (
    !name.trim() ||
    !address.line1 ||
    !address.city ||
    !address.postal_code ||
    !address.country
  ) {
    setErrorMessage("Please complete all required billing fields.");
    return;
  }

  setLoading(true);
  try {
    await onCompleteBilling({ name, address });
  } catch (err) {
    const error = err instanceof Error ? err.message : "Failed to process billing details.";
    setErrorMessage(error);
  } finally {
    setLoading(false);
  }  // <-- THIS CLOSES try/catch/finally block

};  // <-- THIS CLOSES handleSubmit function

return (
  <form onSubmit={handleSubmit} className="space-y-6">
    {/* ...rest of your JSX... */}
  </form>
);


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Address Line 1 */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Address Line 1 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={address.line1}
          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Address Line 2 (optional) */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Address Line 2
        </label>
        <input
          type="text"
          value={address.line2}
          onChange={(e) => setAddress({ ...address, line2: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* City */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          City <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* State */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          State / Province
        </label>
        <input
          type="text"
          value={address.state}
          onChange={(e) => setAddress({ ...address, state: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Postal Code */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Postal Code <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={address.postal_code}
          onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
      </div>

      {/* Country */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Country <span className="text-red-500">*</span>
        </label>
        <select
          value={address.country}
          onChange={(e) => setAddress({ ...address, country: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select a country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="MX">Mexico</option>
          <option value="GB">United Kingdom</option>
          <option value="IN">India</option>
          {/* Add more as needed */}
        </select>
      </div>

      {/* Card Element */}
      <div>
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
          Card Details
        </label>
        <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-600">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#1a202c",
                  "::placeholder": { color: "#a0aec0" },
                },
                invalid: { color: "#e53e3e" },
              },
            }}
          />
        </div>
      </div>

      {errorMessage && (
        <div className="text-sm text-red-600 text-center">{errorMessage}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
