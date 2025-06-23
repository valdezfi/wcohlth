"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import CancelConfirmationModal from "../ui/modal/CancelConfirmation"
import { Chatting } from "@/components/Message/Chating";
import { toast } from "sonner";

interface BuyRequest {
  requestId: string;
  cryptoExchange_id: string;
  buyerFullName: string;
  buyerImageUrl: string;
  buyerPositiveCount: number;
  lastActive: string | null;
  paymentMethod: string;
  offerPrice: string;
  currency: string;
  amount: string;
  cryptoType: string;
  country: string;
  status: string;
}

interface BuyRequestFromUserProps {
  cryptoExchange_id: string;
  onApprove?: (requestId: string) => void;
}

export default function BuyRequestFromUser({
  cryptoExchange_id,
  onApprove,
}: BuyRequestFromUserProps) {
  const [buyRequests, setBuyRequests] = useState<BuyRequest[]>([]);
  const [approvedTransactions, setApprovedTransactions] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(true);
const [showCancelModal, setShowCancelModal] = useState(false);
const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);

  const [selectedApprovedRequestId, setSelectedApprovedRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (!cryptoExchange_id) return;

    const fetchBuyRequests = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/crypto/getSellerBuyRequests/${cryptoExchange_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch buy requests");
        const data = await res.json();

        const unapproved = (Array.isArray(data) ? data : []).filter(
          (r) => r.status !== "approve"
        );
        setBuyRequests(unapproved);
      } catch (err) {
        console.error("Buy requests error:", err);
      }
    };

    const fetchApprovedTransactions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/crypto/myapprovedTransactions/${cryptoExchange_id}`
        );
        if (!res.ok) throw new Error("Failed to fetch approved transactions");
        const data = await res.json();

        // Map `request_id` from backend to `requestId` used in frontend
        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          ...item,
          requestId: item.request_id,
        }));

        setApprovedTransactions(mapped);

        if (mapped.length > 0) {
          setSelectedApprovedRequestId(mapped[0].requestId);
        } else {
          setSelectedApprovedRequestId(null);
        }
      } catch (err) {
        console.error("Approved transactions error:", err);
      }
    };

    Promise.all([fetchBuyRequests(), fetchApprovedTransactions()]).finally(() =>
      setLoading(false)
    );
  }, [cryptoExchange_id]);

  const updateStatus = async (
    requestId: string,
    status: "approve" | "deny"
  ) => {
    try {
      const url = `http://localhost:5000/api/crypto/updateBuyRequestStatus/${encodeURIComponent(
        requestId
      )}`;

      const res = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `Failed to update status: ${res.status} ${res.statusText} - ${errorText}`
        );
      }

      if (status === "approve") {
        const approvedReq = buyRequests.find((r) => r.requestId === requestId);
        if (approvedReq) {
          setApprovedTransactions((prev) => [...prev, approvedReq]);
          setBuyRequests((prev) => prev.filter((r) => r.requestId !== requestId));
          onApprove?.(requestId);
          setSelectedApprovedRequestId(requestId);
        }
      } else if (status === "deny") {
        const isInApproved = approvedTransactions.find((r) => r.requestId === requestId);
        if (isInApproved) {
          setApprovedTransactions((prev) => prev.filter((r) => r.requestId !== requestId));
          if (selectedApprovedRequestId === requestId) {
            setSelectedApprovedRequestId(null);
          }
        } else {
          setBuyRequests((prev) => prev.filter((r) => r.requestId !== requestId));
        }
      }
    } catch (err) {
      console.error("Failed to update request status:", err);
    }
  };

  if (loading) return <p>Loading...</p>;

  const selectedApprovedTx = approvedTransactions.find(
    (tx) => tx.requestId === selectedApprovedRequestId
  );

  return (
    <div className="space-y-10">
      {/* Incoming Buy Requests */}
      <div className="rounded-xl border bg-white dark:bg-white/[0.03] p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Incoming Buy Requests</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="px-6 py-3">Buyer</TableCell>
              <TableCell className="px-6 py-3">Offer</TableCell>
              <TableCell className="px-6 py-3 text-center">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buyRequests.length > 0 ? (
              buyRequests.map((req) => (
                <TableRow
                  key={req.requestId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={req.buyerImageUrl}
                        alt={req.buyerFullName}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold">{req.buyerFullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {req.country} | 👍 {req.buyerPositiveCount}%
                        </p>
                        <p className="text-xs text-gray-400">
                          {req.lastActive
                            ? `Seen ${formatDistanceToNow(new Date(req.lastActive), {
                                addSuffix: true,
                              })}`
                            : "Last seen: N/A"}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {req.amount} {req.cryptoType} {req.currency}{" "}
                    <Badge size="sm" color="info" className="ml-2">
                      {req.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center space-x-3">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => updateStatus(req.requestId, "approve")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(req.requestId, "deny")}
                    >
                      Deny
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                  No incoming buy requests.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Approved Transactions */}
      <div className="rounded-xl border bg-white dark:bg-white/[0.03] p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Approved Buyer Orders</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="px-6 py-3">Buyer</TableCell>
              <TableCell className="px-6 py-3">Amount</TableCell>
              <TableCell className="px-6 py-3 text-center">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvedTransactions.length > 0 ? (
              approvedTransactions.map((tx) => (
                <TableRow
                  key={tx.requestId}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer ${
                    selectedApprovedRequestId === tx.requestId
                      ? " "
                      : ""
                  }`}
                  onClick={() => setSelectedApprovedRequestId(tx.requestId)}
                  title="Click to open chat"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={tx.buyerImageUrl}
                        alt={tx.buyerFullName}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-semibold">{tx.buyerFullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {tx.country} | 👍 {tx.buyerPositiveCount}%
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {tx.amount} {tx.cryptoType} for ${tx.offerPrice} {tx.currency}{" "}
                    <Badge size="sm" color="info" className="ml-2">
                      {tx.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                  <Button
  type="button"
  size="sm"
  variant="primary"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setPendingCancelId(tx.requestId);
    setShowCancelModal(true);
  }}
>
  Cancel
</Button>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                  No approved transactions.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
<CancelConfirmationModal
  isOpen={showCancelModal}
  onClose={() => {
    setShowCancelModal(false);
    setPendingCancelId(null);
  }}
  onConfirm={async () => {
    if (pendingCancelId) {
      await updateStatus(pendingCancelId, "deny");
      toast.success("Transaction canceled successfully");
      setPendingCancelId(null);
      setShowCancelModal(false);
    }
  }}
/>

      {selectedApprovedTx && (
        <div className="mt-10 rounded-xl border bg-white dark:bg-white/[0.03] p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6">
            Chatting with {selectedApprovedTx.buyerFullName}
          </h3>
          <Chatting transaction={{ cryptoExchange_id: cryptoExchange_id }} />
        </div>
      )}
    </div>
  );
}
