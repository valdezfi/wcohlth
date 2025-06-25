"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

interface CheckEvmBalanceProps {
  requestId: string;
  cryptouserEmail: string;
}

interface BalanceInfo {
  escrowAddress: string;
  balance: number;
  required: number;
  escrowStatus: string;
  exchangeStatus: string;
  pol?: boolean;
}

const statusMap: Record<string, string> = {
  released: "✅ Released",
  pending_release: "💰 Pending Release",
  processing_release: "💰 Processing Release",
  funded: "💰 Funded",
  waiting_deposit: "❌ Not Funded",
};

const statusColor: Record<string, "success" | "warning" | "info" | "error"> = {
  released: "success",
  pending_release: "warning",
  processing_release: "warning",
  funded: "info",
  waiting_deposit: "error",
};

export default function CheckBalance({ requestId, cryptouserEmail }: CheckEvmBalanceProps) {
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const backendURL = "http://localhost:5000";

  useEffect(() => {
    if (!requestId) return;

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${backendURL}/api/escrow/check-funded`, {
          params: { request_id: requestId },
        });

        const data = res.data;
        const finalStatuses = ["processing_release", "pending_release", "released"];
        if (!(data.pol && finalStatuses.includes(data.escrowStatus))) {
          setBalanceInfo(data);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch balance");
        setBalanceInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [requestId]);

  const sendVote = async (vote: "up" | "down") => {
    try {
      await axios.post(`${backendURL}/api/escrow/cryptouser/vote`, {
        email: cryptouserEmail,
        vote,
      });
      setVoteStatus("Thanks for voting 👍");
    } catch {
      setVoteStatus("Failed to vote ❌");
    }
  };

  return (
    <div className="mt-8 mb-8 p-6 border rounded-xl bg-white dark:bg-white/[0.03] shadow-sm space-y-4">
      <h3 className="text-lg font-bold">Escrow Wallet Tether Status</h3>

      {loading && <p>🔄 Checking Tether balance...</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">❌ {error}</p>}
      {!loading && !error && !balanceInfo && <p>No balance info available.</p>}

      {balanceInfo && (
        <>
          <p><strong>Address:</strong> {balanceInfo.escrowAddress}</p>
          <p><strong>Balance:</strong> {balanceInfo.balance} USDT</p>
          <p><strong>Required:</strong> {balanceInfo.required} USDT</p>
          <p className="flex items-center gap-2">
            <strong>Status:</strong>
            <Badge size="sm" color={statusColor[balanceInfo.escrowStatus]}>
              {statusMap[balanceInfo.escrowStatus] || "❓ Unknown"}
            </Badge>
          </p>
          <p><strong>Exchange Status:</strong> {balanceInfo.exchangeStatus}</p>

          {balanceInfo.escrowStatus === "released" && (
            <div className="space-y-2">
              <h4>Was this transaction successful?</h4>
              <div className="flex gap-3">
                <Button onClick={() => sendVote("up")} size="sm" variant="success">👍 Yes</Button>
                <Button onClick={() => sendVote("down")} size="sm" variant="destructive">👎 No</Button>
              </div>
              {voteStatus && <p>{voteStatus}</p>}
            </div>
          )}
        </>
      )}
    </div>
  );
}
