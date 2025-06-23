"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import RequestToBuyModal from "@/components/tables/SendBuyRequest";
import BuyRequestFromUser from "@/components/tables/BuyRequestFromUser";
import ListingForm from "@/components/listing/Listing";
import { Chatting } from "@/components/Message/Chating";

interface ListingData {
  id: string; // from cryptoExchange table
  sellerEmail: string;
  cryptoType: string;
  price: string;
  transactionType: string;
}

export default function ListingPage() {
  const params = useParams();
  const sellerorder = params?.sellerorder as string;

  const { data: session, status } = useSession();
  const user = session?.user;

  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvedRequestId, setApprovedRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (!sellerorder) return;

    const fetchListing = async () => {
      try {
        const res = await fetch(`http://localhost:5000/listings/${sellerorder}`);
        if (!res.ok) throw new Error("Failed to fetch listing");
        const data = await res.json();
        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [sellerorder]);

  if (status === "loading" || loading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4 text-red-500">You must be logged in.</div>;
  if (!listing) return <div className="p-4 text-red-500">Listing not found.</div>;

  const isOwner = user.email === listing.sellerEmail;

  // Callback to receive approved request id from BuyRequestFromUser
  const handleApprove = (requestId: string) => {
    setApprovedRequestId(requestId);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Listing Details
      </h3>

      <ListingForm sellorder={sellerorder} />

      <div className="space-y-6 mt-6">
        {!isOwner && (
          <RequestToBuyModal
            cryptoExchange_id={listing.id}
            buyerEmail={user.email}
            sellerEmail={listing.sellerEmail}
            cryptoType={listing.cryptoType}
            offerPrice={listing.price}
            transactionType={listing.transactionType}
          />
        )}

        {isOwner && (
          <BuyRequestFromUser
            cryptoExchange_id={listing.id}
            onApprove={handleApprove}
          />
        )}

        {/* Show chat ONLY if approvedRequestId exists */}
        {approvedRequestId && (
          <Chatting transaction={{ cryptoExchange_id: listing.id }} />
        )}
      </div>
    </div>
  );
}
