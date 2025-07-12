"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type SubscriptionData = {
  id: string;
  status: string;
  cancel_at_period_end: boolean;
  current_period_end: number;
  priceId: string;
  priceAmount: number;
  interval: "month" | "year";
  productName: string;
};

const FREE_PLAN = {
  name: "Free Plan",
  price: 0,
  benefits: [  "Apply to unlimited campaigns",
      "Basic creator insights",
      "Community access",
      "Light AI career advice",],
};

const PLANS = {
  monthly: {
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_59!,
    name: "Pro Monthly",
    price: 59.99,
    interval: "month" as const,
    benefits: [
      "All Free plan benefits",
      "Priority support",
      "Exclusive early feature access",
       "Influencer briefs",
      "Smart Contract Builder",
      "AI Ads Planner",
      "Podcast AI Assistant",
      "Income Strategy Generator",
      "Monetization playbooks",
      "AI Idea Engine",
      "Pitch decks & SOPs",
      "Personalized AI career roadmap",
      "AI-backed brand partnership advice",
      "Help building digital products",
      "Advanced creator analytics",
      "Priority campaign access",
      "Priority Support"  ],
  },
  yearly: {
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_399!,
    name: "Pro Yearly",
    price: 399,
    interval: "year" as const,
    benefits: [
      "All Free plan benefits",
      "Priority support",
      "Exclusive early feature access",
      "Save over $300/year",
       "Influencer briefs",
      "Smart Contract Builder",
      "AI Ads Planner",
      "Podcast AI Assistant",
      "Income Strategy Generator",
      "Monetization playbooks",
      "AI Idea Engine",
      "Pitch decks & SOPs",
      "Priority support",
    ],
  },
};

function formatPrice(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
}

export default function Billing({ email }: { email: string }) {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [checkoutStarted, setCheckoutStarted] = useState(false);

  const selectedPlan = PLANS[billingPeriod];
  const savings = PLANS.monthly.price * 12 - PLANS.yearly.price;

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/c/subscription?email=${email}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Subscription not found.");
        setSubscription({
          id: data.subscription.id,
          status: data.subscription.status,
          cancel_at_period_end: data.subscription.cancel_at_period_end,
          current_period_end: data.subscription.current_period_end,
          priceId: data.subscription.items.data[0].price.id,
          priceAmount: data.subscription.items.data[0].price.unit_amount,
          interval: data.subscription.items.data[0].price.recurring.interval,
          productName: data.subscription.items.data[0].price.nickname,
        });
        setError("");
      } catch (e: unknown) {
        const err = e as Error;
        console.error("Fetch subscription error:", err);
        setError(err.message);
      }
    };

    fetchSubscription();
  }, [email]);

  const cancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/c/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel subscription");
      window.location.reload();
    } catch (e: unknown) {
      const err = e as Error;
      console.error("Cancel subscription error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (clientSecret && checkoutStarted) {
    return (
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 border rounded-xl shadow text-gray-900 dark:text-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Complete Payment</h1>
        <button
          onClick={() => {
            setCheckoutStarted(false);
            setClientSecret("");
          }}
          className="text-sm underline text-blue-600 hover:text-blue-500 mb-4"
        >
          ← Back to Plans
        </button>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            onCompleteBilling={async (billingDetails) => {
              try {
                setLoading(true);
                const res = await fetch("http://localhost:5000/api/c/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    priceId: selectedPlan.id,
                    billingDetails,
                  }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to create subscription");

                setCheckoutStarted(false);
                setClientSecret("");
                window.location.reload();
              } catch (e: unknown) {
                const err = e as Error;
                console.error("Subscription error:", err);
                alert(err.message);
              } finally {
                setLoading(false);
              }
            }}
          />
        </Elements>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 border rounded-xl shadow text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {subscription ? "Your Subscription" : "You're on the Free Plan"}
      </h1>

      {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}

      {!subscription && (
        <ul className="list-disc text-left mt-2 ml-6 text-lg text-gray-600 dark:text-gray-300 mb-6">
          {FREE_PLAN.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}

      {subscription && (
        <>
          <p>
            <strong>Plan:</strong> {subscription.productName}
          </p>
          <p>
            <strong>Status:</strong> {subscription.status}
          </p>
          <p>
            <strong>Price:</strong> {formatPrice(subscription.priceAmount)} / {subscription.interval}
          </p>
          <p>
            <strong>Renews On:</strong>{" "}
            {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
          </p>
          {subscription.cancel_at_period_end && (
            <p className="text-yellow-600 mt-2">Cancels at end of billing period</p>
          )}
          <button
            onClick={cancelSubscription}
            className="w-full mt-6 bg-red-600 text-white py-2 rounded hover:bg-red-500"
            disabled={loading}
          >
            {loading ? "Cancelling..." : "Cancel Subscription"}
          </button>
          <hr className="my-6 border-gray-300 dark:border-gray-700" />
        </>
      )}

      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={() => setBillingPeriod("monthly")}
          className={`px-4 py-2 rounded ${
            billingPeriod === "monthly" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingPeriod("yearly")}
          className={`px-4 py-2 rounded ${
            billingPeriod === "yearly" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          Yearly (Save {formatPrice(savings * 100)})
        </button>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">{selectedPlan.name}</h3>
        <p className="text-3xl font-bold">
          {formatPrice(selectedPlan.price * 100)} / {selectedPlan.interval === "month" ? "mo" : "yr"}
        </p>
        <ul className="list-disc text-left mt-2 ml-6 text-lg text-gray-600 dark:text-gray-300">
          {selectedPlan.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setCheckoutStarted(true)}
        disabled={loading || subscription?.priceId === selectedPlan.id}
        className={`w-full py-3 rounded text-white ${
          billingPeriod === "yearly" ? "bg-green-600 hover:bg-green-500" : "bg-blue-600 hover:bg-blue-500"
        } disabled:opacity-50`}
      >
        {loading
          ? "Processing..."
          : subscription?.priceId === selectedPlan.id
          ? "Current Plan"
          : `Continue with ${selectedPlan.name}`}
      </button>
    </div>
  );
}
