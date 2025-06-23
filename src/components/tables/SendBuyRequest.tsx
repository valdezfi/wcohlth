"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { useSession } from "next-auth/react";

const apiSendBuyRequestEmail = "http://localhost:5000/sendBuyRequestEmail";
const apiCancelBuyRequest = "http://localhost:5000/buyrequest/cancel";
const apiCheckRequestExists = "http://localhost:5000/buyrequest/exists";

interface RequestToBuyModalProps {
  cryptoExchange_id: string;
  buyerEmail: string;
  sellerEmail: string;
  cryptoType?: string;
  offerPrice?: string;
  transactionType?: string;
  onClose?: () => void;
}

export default function RequestToBuyModal({
  cryptoExchange_id,
  buyerEmail,
  sellerEmail,
  cryptoType,
  offerPrice,
  transactionType,
  onClose,
}: RequestToBuyModalProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  // 1. Check if request already exists
  useEffect(() => {
    const checkRequestExists = async () => {
      try {
        const res = await fetch(
          `${apiCheckRequestExists}?cryptoExchange_Id=${cryptoExchange_id}&buyerEmail=${buyerEmail}`
        );
        const data = await res.json();
        if (data.exists) {
          setSent(true);
        }
      } catch (err) {
        console.error("Failed to check request existence", err);
      }
    };

    if (buyerEmail && cryptoExchange_id) {
      checkRequestExists();
    }
  }, [buyerEmail, cryptoExchange_id]);

  const handleBuyRequest = async () => {
    setLoading(true);
    setError("");

    try {
      const requestData = {
        cryptoExchange_Id: cryptoExchange_id,
        buyerEmail,
        sellerEmail,
        cryptoType,
        offerPrice,
        transactionType,
        requestDate: new Date().toISOString(),
        status: "pending",
      };

      const res = await fetch(apiSendBuyRequestEmail, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send buy request.");
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(apiCancelBuyRequest, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cryptoExchange_Id: cryptoExchange_id,
          buyerEmail,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to cancel buy request.");
      }

      setSent(false); // Reset state
    } catch (err: any) {
      setError(err.message || "An error occurred while canceling.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 border rounded shadow w-full max-w-xl mx-auto">
      {sent ? (
        <div className="text-green-600 font-semibold text-center space-y-4">
          <div>✅ Buy request sent successfully!</div>
          <div className="flex justify-center gap-3">
         <Button
  onClick={handleCancelRequest}
  disabled={loading}
  variant="primary"
>
  {loading ? "Canceling..." : "Cancel Buy Request"}
</Button>

          </div>
        </div>
      ) : (
        <>
          <p className="mb-3 text-gray-700 dark:text-gray-300">
            Do you want to send a buy request for this crypto offer?
          </p>

          {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={handleBuyRequest}
              disabled={loading}
              variant="primary"
            >
              {loading ? "Sending..." : "Send Request"}
            </Button>

            {onClose && (
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
