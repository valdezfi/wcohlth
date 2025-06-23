"use client";

import React, { useEffect, useState } from "react"; // explicitly import React
import axios from "axios";

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

const statusColor: Record<string, string> = {
  released: "green",
  pending_release: "orange",
  processing_release: "orange",
  funded: "blue",
  waiting_deposit: "red",
};

export default function CheckBalance({ requestId, cryptouserEmail }: CheckEvmBalanceProps) {
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [voteStatus, setVoteStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const backendURL = "http://localhost:5000"; // Change this to your production backend

  useEffect(() => {
    if (!requestId) return;

    const fetchBalance = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${backendURL}/api/escrow/check-funded`, {
          params: { request_id: requestId },
        });

        const data = res.data as BalanceInfo;
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

  if (loading) return <p>Checking Tether balance...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!balanceInfo) return <p>No balance info available.</p>;

  const { escrowAddress, balance, required, escrowStatus, exchangeStatus } = balanceInfo;
  const statusLabel = statusMap[escrowStatus] || "❓ Unknown";
  const statusTextColor = statusColor[escrowStatus] || "gray";

  return (
    <div style={{ border: "1px solid #ddd", padding: 20, borderRadius: 8, maxWidth: 400 }}>
      <h3>Escrow Wallet Tether Status</h3>
      <p><strong>Address:</strong> {escrowAddress}</p>
      <p><strong>Balance:</strong> {balance} USDT</p>
      <p><strong>Required:</strong> {required} USDT</p>
      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color: statusTextColor, fontWeight: "bold" }}>
          {statusLabel}
        </span>
      </p>
      <p><strong>Exchange Status:</strong> {exchangeStatus}</p>

      {escrowStatus === "released" && (
        <>
          <h4>Was this transaction successful?</h4>
          <button onClick={() => sendVote("up")} style={{ marginRight: 10 }}>
            👍 Yes
          </button>
          <button onClick={() => sendVote("down")}>👎 No</button>
          {voteStatus && <p>{voteStatus}</p>}
        </>
      )}
    </div>
  );
}
