// "use client";

// import React, { useState } from "react";

// const PLANS = {
//   monthly: {
//     id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_59,
//     name: "Pro Monthly",
//     price: 59.99,
//     interval: "month",
//     benefits: [
//       "All Free plan benefits",
//       "Priority support",
//       "Exclusive early feature access",
//       "Influencer briefs",
//       "Smart Contract Builder",
//       "AI Ads Planner",
//       "Podcast AI Assistant",
//       "Income Strategy Generator",
//       "Monetization playbooks",
//       "AI Idea Engine",
//       "Pitch decks & SOPs",
//       "Personalized AI career roadmap",
//       "AI-backed brand partnership advice",
//       "Help building digital products",
//       "Advanced creator analytics",
//       "Priority campaign access",
//     ],
//   },
//   yearly: {
//     id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_399,
//     name: "Pro Yearly",
//     price: 399,
//     interval: "year",
//     benefits: [
//       "All Free plan benefits",
//       "Priority support",
//       "Exclusive early feature access",
//       "Save over $300/year",
//       "Influencer briefs",
//       "Smart Contract Builder",
//       "AI Ads Planner",
//       "Podcast AI Assistant",
//       "Income Strategy Generator",
//       "Monetization playbooks",
//       "AI Idea Engine",
//       "Priority support",
//     ],
//   },
// };

// const FREE_PLAN = {
//   name: "Free Plan",
//   price: 0,
//   benefits: [
//     "Apply to unlimited campaigns",
//     "Basic creator insights",
//     "Community access",
//     "Light AI career advice",
//   ],
// };

// export default function Pricing({ email }) {
//   const [billingPeriod, setBillingPeriod] = useState("monthly");
//   const [loading, setLoading] = useState(false);

//   const selectedPlan = PLANS[billingPeriod];

//   const handleSubscribe = async (plan) => {
//     if (!email) return alert("Email not found");

//     setLoading(true);
//     try {
//       const res = await fetch("/api/create-checkout-session", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, priceId: plan.id }),
//       });

//       const data = await res.json();
//       if (data.error) return alert(data.error);

//       window.location.href = data.url;
//     } catch (err) {
//       console.error(err);
//       alert("Failed to create checkout session");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
//       <h1 className="text-4xl font-extrabold text-center mb-12">Choose Your Plan</h1>

//       <div className="flex justify-center gap-4 mb-8">
//         {["monthly", "yearly"].map((period) => (
//           <button
//             key={period}
//             onClick={() => setBillingPeriod(period)}
//             className={`px-4 py-2 rounded ${
//               billingPeriod === period
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-200 text-gray-700"
//             }`}
//           >
//             {period === "monthly" ? "Monthly" : "Yearly"}
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Free Plan */}
//         <div className="flex flex-col p-6 rounded-xl shadow-lg border bg-white">
//           <h2 className="text-xl font-semibold text-center mb-4">{FREE_PLAN.name}</h2>
//           <p className="text-3xl font-bold text-center mb-6">Free</p>
//           <ul className="mb-6 space-y-2 flex-1">
//             {FREE_PLAN.benefits.map((b) => (
//               <li key={b} className="flex items-center">
//                 <span className="mr-2 text-green-500">✔</span> {b}
//               </li>
//             ))}
//           </ul>
//           <button
//             onClick={() => handleSubscribe(selectedPlan)}
//             disabled={loading}
//             className="w-full py-3 rounded text-white bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400"
//           >
//             {loading ? "Redirecting..." : "Upgrade to Paid Plan"}
//           </button>
//         </div>

//         {/* Selected Paid Plan */}
//         <div className="flex flex-col p-6 rounded-xl shadow-lg border border-blue-500 bg-blue-50">
//           <h2 className="text-xl font-semibold text-center mb-4">{selectedPlan.name}</h2>
//           <p className="text-3xl font-bold text-center mb-6">
//             ${selectedPlan.price}/{selectedPlan.interval === "month" ? "mo" : "yr"}
//           </p>
//           <ul className="mb-6 space-y-2 flex-1">
//             {selectedPlan.benefits.map((b) => (
//               <li key={b} className="flex items-center">
//                 <span className="mr-2 text-green-500">✔</span> {b}
//               </li>
//             ))}
//           </ul>
//           <button
//             onClick={() => handleSubscribe(selectedPlan)}
//             disabled={loading}
//             className="w-full py-3 rounded text-white bg-blue-600 hover:bg-blue-500 disabled:bg-gray-400"
//           >
//             {loading ? "Redirecting..." : `Select ${selectedPlan.name}`}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";

type Subscription = {
  status: string;
  current_period_end?: number;
  plan: string;
  customerId?: string;
};

export default function ManageSubscription({ email }: { email: string }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch subscription details
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch(`https://app.grandeapp.com//g/api/c/bill/${email}`);
        if (!res.ok) throw new Error("No subscription found");
        const data = await res.json();
        setSubscription(data);
      } catch (err) {
        console.warn("No subscription found", err);
        setSubscription(null);
      }
    };
    fetchSubscription();
  }, [email]);

  // Redirect to Stripe customer portal
  const handleManage = async () => {
    if (!subscription?.customerId) return alert("No subscription found");

    setLoading(true);
    try {
      const res = await fetch("https://app.grandeapp.com//g/api/c/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stripeCustomerId: subscription.customerId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Failed to open portal");
    } catch (err) {
      console.error("Portal error", err);
      alert("Failed to open portal");
    } finally {
      setLoading(false);
    }
  };

  // Redirect to pricing page to upgrade
  const handleUpgrade = () => {
    window.location.href = "/pricing";
  };

  if (!subscription) {
    return (
      <div className="max-w-md mx-auto bg-white border rounded-xl shadow p-6 text-center">
        <h2 className="text-xl font-bold mb-4">You have a Free plan now.
</h2>
        <p className="mb-6">Start your plan now to unlock all features.</p>
        <button
          onClick={handleUpgrade}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          Upgrade Now
        </button>
      </div>
    );
  }

  const isFreePlan = subscription.plan.toLowerCase() === "free";

  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl shadow p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Your Subscription</h2>

      <p className="mb-2">
        <strong>Plan:</strong> {subscription.plan}
      </p>
      <p className="mb-2">
        <strong>Status:</strong> {subscription.status}
      </p>
      {subscription.current_period_end && (
        <p className="mb-6">
          <strong>Next Billing:</strong>{" "}
          {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
        </p>
      )}

      {isFreePlan ? (
        <button
          onClick={handleUpgrade}
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-500"
        >
          Upgrade to Paid Plan
        </button>
      ) : (
        <button
          onClick={handleManage}
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-400"
        >
          {loading ? "Redirecting..." : "Manage Subscription"}
        </button>
      )}
    </div>
  );
}
