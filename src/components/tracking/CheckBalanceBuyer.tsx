"use client";

import React, { useEffect, useState } from "react";
import { Chatting } from "@/components/Message/Chating";
import CheckBalance from "@/components/tracking/CheckEVMBalance";

interface BuyRequest {
  requestId: string;
  cryptoExchange_id: string;
  buyerFullName: string;
}

interface Props {
  cryptoExchange_id: string;
}

export default function CheckBalanceBuyer({ cryptoExchange_id }: Props) {
  const [approvedTransactions, setApprovedTransactions] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedTransactions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/crypto/myapprovedTransactions/${cryptoExchange_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch approved transactions");
        const data = await res.json();
        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          requestId: item.request_id,
          cryptoExchange_id: item.cryptoExchange_id,
          buyerFullName: item.buyerFullName,
        }));
        setApprovedTransactions(mapped);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedTransactions();
  }, [cryptoExchange_id]);

  if (loading) return <p>Loading...</p>;

  if (approvedTransactions.length === 0) return null;

  const firstTx = approvedTransactions[0];

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm dark:bg-white/[0.03] space-y-8">
      <div>
        <h4 className="text-lg font-semibold mb-4">
          Chatting with {firstTx.buyerFullName}
        </h4>
        <Chatting transaction={{ cryptoExchange_id }} />
      </div>

      <CheckBalance requestId={firstTx.requestId} />
    </div>
  );
}
