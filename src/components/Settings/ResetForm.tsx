'use client';

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token) {
      setError('Reset token is missing in the URL.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      // const res = await fetch('http://localhost:5000/api/auth/reset-password', {
            const res = await fetch('https://app.grandeapp.com/g/api/auth/reset-password', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Failed to reset password.');
      } else {
        setMessage('Password reset successful. You can now log in.');
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Reset Password" />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[500px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Reset Your Password
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base mb-6">
            Please enter a new password for your account.
          </p>

          {error && <p className="mb-4 text-red-500">{error}</p>}
          {message && <p className="mb-4 text-green-500">{message}</p>}

          <div className="flex flex-col gap-4 text-left">
         <label className="text-sm text-gray-700 dark:text-white mb-1">
  New Password
</label>
<Input
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Enter new password"
/>


        <label className="text-sm text-gray-700 dark:text-white mb-1">
  Confirm Password
</label>
<Input
  type="password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  placeholder="Confirm new password"
/>


            <Button onClick={handleReset} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
