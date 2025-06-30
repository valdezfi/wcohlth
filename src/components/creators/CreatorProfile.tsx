"use client";

import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaTwitch,
  FaGlobe,
  FaEnvelope,
  FaComments,
} from "react-icons/fa";
import { ChattingWithCreator } from "@/components/Message/Chating";
import { useSession } from "next-auth/react";

type Creator = {
  creatorName: string;
  agency: string;
  email: string;
  twitchLink: string;
  instagram: string;
  youtube: string;
  website: string;
  imageUrl: string;
  phone: string;
  tiktokLink: string;
  niche: string;
  country: string;
  address: string;
  addressTwo: string;
  zipcode: string;
  about: string;
  appliedCampaigns: string;
};

function isValidUrl(url: string) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function clean(val: string | undefined | null) {
  if (!val) return null;
  if (
    val.trim() === "" ||
    val === "Not Provided" ||
    val === "{}" ||
    val.toLowerCase() === "null"
  )
    return null;
  return val;
}
export default function CreatorGeneralPublicProfileCard({
  email,
}: {
  email: string;
}) {
  const [creator, setCreator] = useState<Creator>({
    creatorName: "",
    agency: "",
    email: "",
    twitchLink: "",
    instagram: "",
    youtube: "",
    website: "",
    imageUrl: "",
    phone: "",
    tiktokLink: "",
    niche: "",
    country: "",
    address: "",
    addressTwo: "",
    zipcode: "",
    about: "",
    appliedCampaigns: "",
  });

  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  // Modal state for campaign request
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

const { data: session } = useSession();
const senderEmail = session?.user?.email || "";
  useEffect(() => {
    if (!email) return;

    const fetchCreator = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/creator/getgeneralinfo/${encodeURIComponent(
            email
          )}`
        );
        if (!res.ok) throw new Error("Failed to fetch creator info");

        const data = await res.json();

        const fixUrl = (url: string) => {
          if (!url) return "";
          if (url.startsWith("http")) return url;
          return "https://" + url;
        };

        setCreator({
          ...data,
          instagram: fixUrl(data.instagram),
          youtube: fixUrl(data.youtube),
          tiktokLink: fixUrl(data.tiktokLink),
          twitchLink: fixUrl(data.twitchLink),
          website: fixUrl(data.website),
        });
      } catch (error) {
        console.error("Error loading creator info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [email]);

  const imageUrl = clean(creator.imageUrl) || "/images/brand/placeholder.svg";

  async function sendEmailRequest() {
    setSending(true);

    try {
      const res = await fetch("http://localhost:5000/api/paycemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorEmail: creator.email,
          amount,
          details,
          senderEmail:senderEmail , // Replace with your or user's email
        }),
      });
      const data = await res.json();
      if (data.success) {
        // Close request modal and open success modal
        setShowEmailModal(false);
        setAmount("");
        setDetails("");
        setShowSuccessModal(true);
      } else {
        alert("Failed to send request.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to send request.");
    } finally {
      setSending(false);
    }
  }

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600 dark:text-gray-300">
        Loading creator profile...
      </p>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 flex flex-col items-center p-6 sm:p-12">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl max-w-md w-full p-8 flex flex-col items-center border border-blue-500">
        {/* Profile Image */}
        <img
          src={imageUrl}
          alt={clean(creator.creatorName) || "Creator"}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/brand/placeholder.svg";
          }}
          className="w-32 h-32 rounded-full border-4 border-indigo-600 mb-6 object-cover bg-gray-200"
        />

        {/* Name */}
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 text-center">
          {clean(creator.creatorName) || "Unknown Creator"}
        </h1>

        {/* Agency */}
        {clean(creator.agency) && (
          <p className="text-indigo-500 text-sm mb-4">{creator.agency}</p>
        )}

        {/* About */}
        {clean(creator.about) && (
          <p className="text-gray-700 dark:text-gray-300 mb-8 text-center px-6">
            {creator.about}
          </p>
        )}

        {/* Contact Buttons */}
        <div className="flex gap-4 flex-wrap justify-center mb-8">
       

          <button
            onClick={() => setShowChat(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
          >
            <FaComments />
            Chat
          </button>

          {/* New button to open campaign request modal */}
          <button
            onClick={() => setShowEmailModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition"
          >
            Join My Campaign
          </button>
        </div>

        {/* Social Media Buttons */}
        <div className="flex flex-col gap-4 w-full">
          {isValidUrl(creator.instagram) && (
            <SocialBtn
              href={creator.instagram}
              icon={<FaInstagram size={24} />}
              label="Instagram"
              color="from-pink-500 to-red-500"
            />
          )}
          {isValidUrl(creator.tiktokLink) && (
            <SocialBtn
              href={creator.tiktokLink}
              icon={<FaTiktok size={24} />}
              label="TikTok"
              color="from-black to-gray-800"
            />
          )}
          {isValidUrl(creator.youtube) && (
            <SocialBtn
              href={creator.youtube}
              icon={<FaYoutube size={24} />}
              label="YouTube"
              color="from-red-600 to-red-700"
            />
          )}
          {isValidUrl(creator.twitchLink) && (
            <SocialBtn
              href={creator.twitchLink}
              icon={<FaTwitch size={24} />}
              label="Twitch"
              color="from-purple-600 to-purple-800"
            />
          )}
          {isValidUrl(creator.website) && (
            <SocialBtn
              href={creator.website}
              icon={<FaGlobe size={24} />}
              label="Website"
              color="from-green-600 to-green-700"
            />
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && clean(creator.email) && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowChat(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowChat(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <div className="p-4">
              <ChattingWithCreator creatorEmail={creator.email} />
            </div>
          </div>
        </div>
      )}

      {/* Campaign Request Modal */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md relative shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold mb-4 text-white text-center">Request Campaign</h2>

            <label className="block mb-2 text-white font-semibold">Amount</label>
            <input
              type="number"
              min={1}
              className="w-full mb-4 p-2 border rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />

            <label className="block mb-2 text-white font-semibold">Details</label>
            <textarea
              className="w-full mb-4 p-2 border rounded"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter details about the campaign"
            />

            <button
              disabled={sending || !amount || !details}
              onClick={sendEmailRequest}
              className={`w-full py-3 rounded text-white font-semibold ${
                sending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } transition`}
            >
              {sending ? "Sending..." : "Send Request"}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm relative shadow-lg p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              ×
            </button>

            <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
            <p className="mb-4">
              We will send you a payment link soon.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function SocialBtn({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 justify-center rounded-full px-6 py-3 font-semibold text-white bg-gradient-to-r ${color} hover:brightness-110 transition`}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
