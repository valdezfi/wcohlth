'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function VerifyBanner() {
  const { data: session, status } = useSession();
  const [isVerified, setIsVerified] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const email = session?.user?.email;



  useEffect(() => {
    const checkUser = async () => {
      if (status === 'loading' || !email) return;

      try {
        const res = await fetch('grandeapp.com/g/api/auth/me', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email }),
        });

        const data = await res.json();

        if (res.ok && data.isVerified === 1) {
          setIsVerified(true);
        } else {
          setIsVerified(false);
        }
      } catch (err) {
        console.error('Verification check failed:', err);
        setIsVerified(false);
      }
    };

    checkUser();
  }, [session, status]);

  const handleResend = async () => {
    if (!email) return;

    setSending(true);
    setSent(false);
    setError('');

    try {
      const res = await fetch('grandeapp.com/g/c/api/auth/resendVerificationEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send verification email.');
      } else {
        setSent(true);
      }
    } catch (err) {
      console.error('Error sending verification email:', err);
      setError('Something went wrong.');
    }

    setSending(false);
  };

  if (status === 'loading' || isVerified) return null;

  return (
    <div className="bg-yellow-100 text-yellow-800 px-4 py-3 text-center text-sm flex flex-col items-center gap-2">
      <span>Please verify your email to unlock all features.</span>
      <button
        onClick={handleResend}
        disabled={sending || sent}
        className="bg-yellow-800 text-white px-3 py-1 rounded hover:bg-yellow-700 transition disabled:opacity-50"
      >
        {sending ? 'Sending...' : sent ? 'Email Sent!' : 'Resend Verification Email'}
      </button>
      {error && <span className="text-red-600 text-xs">{error}</span>}
    </div>
  );
}
