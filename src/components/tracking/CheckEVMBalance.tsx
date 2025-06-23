"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";

type CheckEvmBalanceProps = {
  requestId: string;
  cryptouserEmail: string;
};

type BalanceInfo = {
  escrowAddress: string;
  balance: number;
  required: number;
  escrowStatus: string;
  exchangeStatus: string;
  pol?: boolean;
};

const statusMap: Record<string, string> = {
  released: "✅ Released",
  pending_release: "💰 Pending Release",
  processing_release: "💰 Processing Release",
  funded: "💰 Funded",
  waiting_deposit: "❌ Not Funded",
};

const statusColor: Record<string, "success" | "warning" | "info" | "destructive" | "default"> = {
  released: "success",
  pending_release: "warning",
  processing_release: "warning",
  funded: "info",
  waiting_deposit: "destructive",
};

export function CheckEvmBalance({ requestId, cryptouserEmail }: CheckEvmBalanceProps) {
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const backendURL = "http://localhost:5000"; // Replace for prod

  useEffect(() => {
    async function fetchBalance() {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${backendURL}/api/escrow/check-funded`, {
          params: { request_id: requestId },
        });

        const data = res.data;
        const finalStatuses = ["processing_release", "pending_release", "released"];

        if (data.pol && finalStatuses.includes(data.escrowStatus)) return;
        setBalanceInfo(data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    }

    if (requestId) fetchBalance();
  }, [requestId]);

  async function sendVote(vote: "up" | "down") {
    try {
      await axios.post(`${backendURL}/api/escrow/cryptouser/vote`, {
        email: cryptouserEmail,
        vote,
      });
      setVoteStatus("Thanks for voting 👍");
    } catch {
      setVoteStatus("Failed to vote ❌");
    }
  }

  if (loading) return <p className="text-sm text-gray-500 dark:text-gray-400">Checking Tether balance...</p>;
  if (error) return <p className="text-sm text-red-500 dark:text-red-400">{error}</p>;
  if (!balanceInfo) return <p className="text-sm text-gray-500 dark:text-gray-400">No balance info available.</p>;

  const { escrowAddress, balance, required, escrowStatus, exchangeStatus } = balanceInfo;
  const statusLabel = statusMap[escrowStatus] || "❓ Unknown";
  const badgeColor = statusColor[escrowStatus] || "default";

  return (
    <div className="rounded-xl border bg-white dark:bg-white/[0.03] p-6 shadow-sm space-y-4">
      <h4 className="text-lg font-semibold">Escrow Wallet Tether Status</h4>

      <div className="text-sm space-y-1">
        <p><strong>Address:</strong> {escrowAddress}</p>
        <p><strong>Balance:</strong> {balance} USDT</p>
        <p><strong>Required:</strong> {required} USDT</p>
        <p className="flex items-center gap-2">
          <strong>Status:</strong>
          <Badge size="sm" color={badgeColor}>{statusLabel}</Badge>
        </p>
        <p><strong>Exchange Status:</strong> {exchangeStatus}</p>
      </div>

      {escrowStatus === "released" && (
        <div className="pt-4 space-y-2">
          <h4 className="text-base font-medium">Was this transaction successful?</h4>
          <div className="flex gap-3">
            <Button size="sm" variant="primary" onClick={() => sendVote("up")}>
              👍 Yes
            </Button>
            <Button size="sm" variant="destructive" onClick={() => sendVote("down")}>
              👎 No
            </Button>
          </div>
          {voteStatus && <p className="text-sm text-gray-500">{voteStatus}</p>}
        </div>
      )}
    </div>
  );
}
