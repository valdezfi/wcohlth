
import React, { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://app.grandeapp.com/g/creator/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed.");

      toast.success("Account created successfully.");
      setShowVerifyModal(true);
      setForm({ email: "", password: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!form.email) return;

    setResendLoading(true);
    try {
      const res = await fetch("https://app.grandeapp.com/g/c/api/auth/resendVerificationEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Resend failed.");

      toast.success("Verification email resent.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to resend email.";
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <Toaster position="top-right" />

      {/* ✅ Email verification modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg max-w-md w-full text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Verify Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              A verification link has been sent to <strong>{form.email}</strong>. Please check your inbox to activate your account.
            </p>

            <button
              onClick={handleResendVerification}
              className="w-full px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 transition"
              disabled={resendLoading}
            >
              {resendLoading ? "Resending..." : "Didn't get it? Resend Email"}
            </button>

            <button
              onClick={() => setShowVerifyModal(false)}
              className="w-full mt-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 space-y-6 z-10">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Sign Up</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Create your account below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-sm border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-brand-500 rounded-md hover:bg-brand-600 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="text-brand-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
