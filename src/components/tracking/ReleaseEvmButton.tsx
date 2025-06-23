"use client";

import { useState } from "react";
import Button from "@/components/ui/button/Button";

type ReleaseEvmButtonProps = {
  requestId: string;
};

type ReleaseResponse = {
  feeTx: string;
  buyerTx: string;
};

export function ReleaseEvmButton({ requestId }: ReleaseEvmButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReleaseResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRelease = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:5000/api/escrow/evmrelease/${requestId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Something went wrong");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 mb-8 p-6 border rounded-xl bg-white dark:bg-white/[0.03] shadow-sm space-y-4">
      <Button
        variant="primary"
        size="sm"
        onClick={handleRelease}
        disabled={loading}
      >
        {loading ? "Releasing..." : "Release Funds"}
      </Button>

      {result && (
        <div className="text-sm text-green-600 dark:text-green-400 space-y-1">
          <p>✅ Funds released!</p>
          <p>
            Fee Tx:{" "}
            <a
              href={`https://polygonscan.com/tx/${result.feeTx}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {result.feeTx}
            </a>
          </p>
          <p>
            Buyer Tx:{" "}
            <a
              href={`https://polygonscan.com/tx/${result.buyerTx}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {result.buyerTx}
            </a>
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">❌ {error}</p>
      )}
    </div>
  );
}
