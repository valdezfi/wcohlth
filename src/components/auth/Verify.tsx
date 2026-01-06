"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        // const res = await fetch(`http://localhost:5000/c/api/auth/verify?token=${token}`);

      const res = await fetch(`https://app.cohlth.com/g/c/api/auth/verify?token=${token}`);

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "Email verified successfully!");
          setTimeout(() => {
            window.location.href = "/signin";
          }, 3000);
        } else {
          if (
            data.error?.includes("expired") ||
            data.error?.includes("Invalid") ||
            data.error?.includes("not found")
          ) {
            setStatus("success");
            setMessage("Your email has already been verified.");
            setTimeout(() => {
              window.location.href = "/signin";
            }, 3000);
          } else {
            setStatus("error");
            setMessage(data.error || "Verification failed.");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-md w-full space-y-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white">
          Email Verification
        </h2>

        {status === "loading" && (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Verifying your email...
          </p>
        )}

        {status === "success" && (
          <div className="text-center space-y-2">
            <p className="text-green-600 font-medium">{message}</p>
            <a
              href="/signin"
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
            >
              Go to Sign In
            </a>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to sign in...
            </p>
          </div>
        )}

        {status === "error" && (
          <p className="text-center text-red-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
