"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";

const OnlineTracker: React.FC = () => {
  const { data: session, status } = useSession();
  const [lastActive, setLastActive] = useState<string | null>(null);

  // POST: Update user's last active time
  const updateLastActive = async (email: string): Promise<void> => {
    try {
      await axios.post("http://localhost:5000/update-last-active", { email });
    } catch (error) {
      console.error("Failed to update last active time:", error);
    }
  };

  // GET: Fetch user's last active time
  const fetchLastActive = async (email: string): Promise<void> => {
    try {
      const res = await axios.get<{ lastActive: string }>(
        `http://localhost:5000/get-last-active/${email}`
      );
      if (res.data?.lastActive) {
        setLastActive(res.data.lastActive);
      }
    } catch (error) {
      console.error("Failed to fetch last active time:", error);
    }
  };

  useEffect(() => {
    const email = session?.user?.email;
    if (status !== "authenticated" || !email) return;

    // On mount
    fetchLastActive(email);
    updateLastActive(email);

    const interval = setInterval(() => {
      updateLastActive(email);
    }, 60000); // Every 60 seconds

    return () => clearInterval(interval);
  }, [status, session]);

  return null; // No UI render
};

export default OnlineTracker;
