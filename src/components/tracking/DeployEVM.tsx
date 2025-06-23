"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";

interface CreateEVMEscrowProps {
  depositAmount: string;
  request_id: string;
  buyerEmail: string;
  sellerEmail: string;
}

export function CreateEVMEscrow({
  depositAmount,
  request_id,
  buyerEmail,
  sellerEmail,
}: CreateEVMEscrowProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 👇 Log all props to confirm what's being received
  useEffect(() => {
    console.log("CreateEVMEscrow props received:", {
      depositAmount,
      request_id,
      buyerEmail,
      sellerEmail,
    });
  }, [depositAmount, request_id, buyerEmail, sellerEmail]);

  const handleCreateEscrow = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const checkRes = await fetch(
        `http://localhost:5000/api/escrow/evmstatus/${request_id}`
      );

      if (checkRes.ok) {
        const escrow = await checkRes.json();
        setStatus(`⚠️ Escrow already exists at: ${escrow.escrowAddress}`);
        setLoading(false);
        return;
      }

      if (checkRes.status !== 404) {
        const errText = await checkRes.text();
        throw new Error(`Unexpected error checking escrow status: ${errText}`);
      }

      // 👇 Log the request body before sending
      console.log("Creating escrow with:", {
        depositAmount,
        request_id,
        buyerEmail,
        sellerEmail,
      });

      const res = await fetch("http://localhost:5000/api/escrow/evmcreate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ depositAmount, request_id, buyerEmail, sellerEmail }),
      });

      const text = await res.text();
      let data: { escrowAddress?: string; error?: string };
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON: " + text);
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to create escrow");
      }

      setStatus(`✅ Escrow created at: ${data.escrowAddress}`);
    } catch (err: any) {
      setStatus(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <Button variant="primary" disabled={loading} onClick={handleCreateEscrow}>
        {loading ? "Creating Escrow..." : "Create Escrow Wallet"}
      </Button>
      {status && <p className="mt-3 text-sm text-gray-700">{status}</p>}
    </div>
  );
}

export default CreateEVMEscrow;
