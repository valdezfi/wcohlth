import { useEffect, useRef, useState } from "react";

export function useBuyRequestNotifications(cryptoExchange_id: string, interval = 5000) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newNotification, setNewNotification] = useState(false);
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (!cryptoExchange_id) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/crypto/getSellerBuyRequests/${cryptoExchange_id}`
        );
        const data = await res.json();

        const unapproved = Array.isArray(data)
          ? data.filter((r) => r.status !== "approve")
          : [];

        // Compare with previous
        if (unapproved.length > prevCountRef.current) {
          setNewNotification(true);
        }

        setNotifications(unapproved);
        prevCountRef.current = unapproved.length;
      } catch (err) {
        console.error("Notification polling error:", err);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [cryptoExchange_id, interval]);

  return {
    notifications,
    newNotification,
    clearNotification: () => setNewNotification(false),
  };
}
