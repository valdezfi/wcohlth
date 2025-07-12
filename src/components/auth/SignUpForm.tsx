
"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // const res = await fetch("http://localhost:5000/creator/signup", {

      const res = await fetch("https://app.grandeapp.com/g/creator/signup", {




         
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed.");

      toast.success("Account created successfully.");
      setForm({ email: "", password: "" });
  } catch (err: unknown) {
  const message =
    err instanceof Error ? err.message : "Something went wrong.";
  toast.error(message);
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Toaster must be somewhere in your app (can be here or _app.tsx) */}
      <Toaster position="top-right" />

      <div className="w-full max-w-sm bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 space-y-6">
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
