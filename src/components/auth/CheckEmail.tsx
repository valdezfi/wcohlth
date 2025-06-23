"use client";

import Link from "next/link";

export default function CheckEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Check your email
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We’ve sent a link to your email to reset your password.
          <br />
          Please check your inbox and follow the instructions.
        </p>

        <Link
          href="/signin"
          className="inline-block mt-4 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
