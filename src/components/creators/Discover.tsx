"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaYoutube, FaTiktok, FaTwitch, FaGlobe } from "react-icons/fa";

type Creator = {
  id: number;
  creatorName: string;
  imageUrl: string;
  instagram?: string;
  youtube?: string;
  twitchLink?: string;
  tiktokLink?: string;
  website?: string;
  country?: string;
};

export default function CreatorDiscovery() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const res = await fetch("http://localhost:5000/creators/all");
        if (!res.ok) throw new Error("Failed to fetch creators");
        const data = await res.json();
        setCreators(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const visibleCreators = creators.slice(0, visibleCount);

  if (loading) return <div className="p-6 text-center">Loading creators...</div>;
  if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Scale With No Platform Fees</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {visibleCreators.map((creator) => (
          <a
            key={creator.id}
            href={`/c/${creator.creatorName}`}
            className="border p-4 rounded-xl shadow-sm bg-white dark:bg-gray-900 text-center transition hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer block"
          >
          <img
  src={creator.imageUrl?.trim() || "/images/user/placeholder.svg"}
  alt={creator.creatorName}
  className="w-32 h-32 mx-auto object-cover rounded-full mb-3 bg-gray-300"
/>

            <h3 className="text-xl font-semibold">{creator.creatorName}</h3>
            <p className="text-gray-500 mb-2">{creator.country?.trim() || "Unknown"}</p>

            <div
              className="flex justify-center flex-wrap gap-4 text-xl mt-2 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              {creator.instagram?.trim() && (
                <a
                  href={creator.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-400"
                >
                  <FaInstagram />
                </a>
              )}
              {creator.tiktokLink?.trim() && (
                <a
                  href={creator.tiktokLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-600"
                >
                  <FaTiktok />
                </a>
              )}
              {creator.youtube?.trim() && (
                <a
                  href={creator.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-400"
                >
                  <FaYoutube />
                </a>
              )}
              {creator.twitchLink?.trim() && (
                <a
                  href={creator.twitchLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-400"
                >
                  <FaTwitch />
                </a>
              )}
              {creator.website?.trim() && (
                <a
                  href={creator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-400"
                >
                  <FaGlobe />
                </a>
              )}
            </div>
          </a>
        ))}
      </div>

      {visibleCount < creators.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}
