"use client";

import { useEffect, useState } from "react";
import Button from "../ui/button/Button";

export default function ApplyToCampaign({
  campaignId,
  creatorEmail,
}: {
  campaignId: string;
  creatorEmail: string;
}) {
  const [message, setMessage] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/campaigncreator/${campaignId}`);
        const data = await res.json();

        if (res.ok && Array.isArray(data.appliedByCreators)) {
          const applied = data.appliedByCreators.includes(creatorEmail);
          if (applied) {
            const message = data.creatorApplicationMessage?.[creatorEmail] || "";
            setSubmittedMessage(message);
          }
        }
      } catch (err) {
        console.error("Error fetching campaign data:", err);
      }
    };

    if (campaignId && creatorEmail) {
      fetchApplicationStatus();
    }
  }, [campaignId, creatorEmail]);

  const handleApply = async () => {
    setSending(true);
    setError("");
    setSuccess(false);

    if (!creatorEmail || !message.trim()) {
      setError("Creator email and application message are required.");
      setSending(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/campaigncreator/${campaignId}/apply`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            creatorId: creatorEmail,
            applicationMessage: message.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to apply.");

      setSuccess(true);
      setSubmittedMessage(message.trim());
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  if (!creatorEmail || !campaignId) {
    return (
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
        Cannot apply — creator or campaign information missing.
      </div>
    );
  }

  if (submittedMessage) {
    return (
      <div className="w-full mt-8 bg-green-50 dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-center mb-4 text-green-800 dark:text-green-400">
          You’ve already applied to this campaign.
        </h3>
        <p className="text-sm text-gray-800 dark:text-gray-200 mb-2 font-medium">📬 Your submitted message:</p>
        <p className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
          {submittedMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Apply to this Campaign
      </h3>

      {success && (
        <p className="text-green-600 text-center font-semibold mb-4">
          ✅ Application sent successfully!
        </p>
      )}

      {error && (
        <p className="text-red-500 font-medium mb-2">{error}</p>
      )}

      <textarea
        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 mb-4 text-sm dark:bg-gray-900 dark:text-white"
        rows={4}
        placeholder="Why are you a good fit for this campaign?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={sending}
      />

      <Button onClick={handleApply} disabled={sending || !message.trim()}>
        {sending ? "Submitting..." : "Apply"}
      </Button>
    </div>
  );
}

