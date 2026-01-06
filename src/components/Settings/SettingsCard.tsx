"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

export default function SettingsCard() {
  const { data: session } = useSession();
  const user = session?.user;
  const { isOpen, openModal, closeModal } = useModal();

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequestReset = async () => {
    if (!user?.email) return;

    try {
      setLoading(true);
      // const res = await fetch("http://localhost:5000/creator/api/auth/request-password-reset", {

      const res = await fetch("https://app.cohlth.com/g/creator/api/auth/request-password-reset", {

       
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage("A reset link has been sent to your email.");
      } else {
        setMessage(result.error || "Failed to send reset link.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Reset Your Password
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Click to request a password reset link.
            </p>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              />
            </svg>
            Reset Password
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 flex flex-col items-center justify-center bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="w-full max-w-md text-center">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Reset Password
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              We will send you a link to reset your password to <strong>{user?.email}</strong>.
            </p>

            {message && (
              <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                {message}
              </p>
            )}

            <div className="flex justify-center gap-3">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleRequestReset} disabled={loading}>
                {loading ? "Sending..." : "Send Reset Email"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
