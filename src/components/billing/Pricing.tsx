"use client";

import React, { useState } from "react";

type Plan = {
  id?: string;
  name: string;
  price: number | "custom";
  interval?: "month" | "year";
  benefits: string[];
  highlighted?: boolean;
};

const PLANS: Record<"monthly" | "yearly", Plan> = {
  monthly: {
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_59,
    name: "Pro Monthly",
    price: 59.99,
    interval: "month",
    benefits: [
   
  "Everything in Free plan",
    "Unlimited AI Creator Manager replies",
    "AI Media Kit Generator (full bio, stats, portfolio & case studies)",
    "AI Legal Suite (contracts, licensing terms, usage rights, invoices)",
    "AI Pitch & Outreach Engine (custom emails + DM templates)",
    "AI Profile Audit (scans your profile + recommends fixes)",
    "Smart Rate Calculator for UGC & influencer deals",
    "Content Strategy Generator (30–90 day plans)",
    "Brand Deal Negotiation Assistant",
    "AI Idea Engine (scripts, hooks, content plans)",
    "Export responses (PDF, TXT) + 1-click Copy",
    "Improve Answer tool (instantly rewrite content)",
    "Auto-Saved AI History",
    "Spanish + English fully supported",
    "Early access to new creator tools",
    "Priority support",
    ],
    highlighted: true,
  },
  yearly: {
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_399,
    name: "Pro Yearly",
    price: 399,
    interval: "year",
    benefits: [
       "Everything in Free plan",
    "Unlimited AI Creator Manager replies",
    "AI Media Kit Generator (full bio, stats, portfolio & case studies)",
    "AI Legal Suite (contracts, licensing terms, usage rights, invoices)",
    "AI Pitch & Outreach Engine (custom emails + DM templates)",
    "AI Profile Audit (scans your profile + recommends fixes)",
    "Smart Rate Calculator for UGC & influencer deals",
    "Content Strategy Generator (30–90 day plans)",
    "Brand Deal Negotiation Assistant",
    "AI Idea Engine (scripts, hooks, content plans)",
    "Export responses (PDF, TXT) + 1-click Copy",
    "Improve Answer tool (instantly rewrite content)",
    "Auto-Saved AI History",
    "Spanish + English fully supported",
    "Early access to new creator tools",
    "Priority support",
    ],
    highlighted: true,
  },
};

const FREE_PLAN: Plan = {
  name: "Free Plan",
  price: 0,
  benefits: [
    "Apply to unlimited campaigns",
    "Basic creator insights",
    "Community access",
    "Light AI career advice",
  ],
};

type PricingProps = {
  email: string;
};

export default function Pricing({ email }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState(false);

  const selectedPlan = PLANS[billingPeriod];

  const handleSubscribe = async (plan: Plan) => {
    if (!email) return alert("Email not found");
    if (!plan.id) return alert("Contact sales for custom plan");

    setLoading(true);
    try {
      const res = await fetch("https://app.cohlth.com/g/api/c/create-subscription-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, priceId: plan.id }),
      });
      const data = await res.json();
      if (data.error) return alert(data.error);

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-12">Choose Your Plan</h1>

      {/* Billing period toggle */}
      <div className="flex justify-center gap-4 mb-8">
        {(["monthly", "yearly"] as const).map((period) => (
          <button
            key={period}
            onClick={() => setBillingPeriod(period)}
            className={`px-4 py-2 rounded ${
              billingPeriod === period
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {period === "monthly" ? "Monthly" : "Yearly"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <div className="flex flex-col p-6 rounded-xl shadow-lg border bg-white">
          <h2 className="text-xl font-semibold text-center mb-4">{FREE_PLAN.name}</h2>
          <p className="text-3xl font-bold text-center mb-6">Free</p>
          <ul className="mb-6 space-y-2 flex-1">
            {FREE_PLAN.benefits.map((b) => (
              <li key={b} className="flex items-center">
                <span className="mr-2 text-green-500">✔</span> {b}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe(selectedPlan)}
            disabled={loading}
            className="w-full py-3 rounded text-white bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400"
          >
            {loading ? "Redirecting..." : "Upgrade to Paid Plan"}
          </button>
        </div>

        {/* Selected Paid Plan */}
        <div
          className={`flex flex-col p-6 rounded-xl shadow-lg border ${
            selectedPlan.highlighted ? "border-blue-500 bg-blue-50" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-semibold text-center mb-4">{selectedPlan.name}</h2>
          <p className="text-3xl font-bold text-center mb-6">
            ${selectedPlan.price}/{selectedPlan.interval === "month" ? "mo" : "yr"}
          </p>
          <ul className="mb-6 space-y-2 flex-1">
            {selectedPlan.benefits.map((b) => (
              <li key={b} className="flex items-center">
                <span className="mr-2 text-green-500">✔</span> {b}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleSubscribe(selectedPlan)}
            disabled={loading}
            className="w-full py-3 rounded text-white bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400"
          >
            {loading ? "Redirecting..." : `Select ${selectedPlan.name}`}
          </button>
        </div>
      </div>
    </div>
  );
}
