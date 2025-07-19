"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "../ui/button/Button";
import Link from "next/link";
import ApplyToCampaign from "@/components/campaign/Apply";
import { Modal } from "@/components/ui/modal";
import ChattingWithCampaign from "@/components/Message/Chat";

type CampaignDetails = {
  id: string | number;
  campaignName: string;
  industry: string;
  startDate: string;
  endDate: string;
  deliverables: string;
  platform: string;
  productDetails: string;
  optionalProductDetails1: string;
  optionalProductDetails2: string;
  compensation: string;
  whyWeWantThisContent: string;
  dos: string;
  doNot: string;
  readyToPost: string;
  targetCountry: string;
  imageUrl?: string;
  email: string;
};

type CreatorStatusResponse = Record<string, string>;

type CreatorInfo = {
  email: string;
};

export default function CampaignMetaCard({
  campaignName,
}: {
  campaignName: string;
}) {
  const { data: session, status } = useSession();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [creatorStatus, setCreatorStatus] = useState<string | null>(null);
  const [chatCreator, setChatCreator] = useState<CreatorInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const emailuser = session?.user?.email;

  // Fetch campaign details
  useEffect(() => {
    async function fetchCampaign() {
      if (!campaignName) return;

      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/campaign/cgetcampaigns?campaignName=${encodeURIComponent(
            campaignName
          )}`
        );
        if (!res.ok) {
          setError(`Failed to fetch campaign: ${res.status} ${res.statusText}`);
          setCampaign(null);
          return;
        }
        const data: CampaignDetails[] = await res.json();
        if (data.length > 0) {
          setCampaign(data[0]);
          setError(null);
        } else {
          setError("No campaign found.");
          setCampaign(null);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(`Error fetching campaign: ${err.message}`);
        } else {
          setError("Unknown error fetching campaign");
        }
        setCampaign(null);
      }
    }
    fetchCampaign();
  }, [campaignName]);

  // Fetch creator status
  useEffect(() => {
    async function fetchStatus() {
      if (!campaignName || !emailuser) return;

      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/campaigns/${encodeURIComponent(campaignName)}/creators/status`
        );
        if (!res.ok) {
          setCreatorStatus(null);
          return;
        }
        const data: CreatorStatusResponse = await res.json();

        if (emailuser in data) {
          setCreatorStatus(data[emailuser]);
        } else {
          setCreatorStatus("not applied");
        }
     } catch {
  setError("Unknown error fetching campaign");
  setCampaign(null);
}
    }

    fetchStatus();
  }, [campaignName, emailuser]);

  if (error)
    return (
      <div className="p-4 text-red-500 text-center font-semibold">{error}</div>
    );

  if (!campaign)
    return <div className="p-4 text-gray-500 text-center">Loading campaign...</div>;

  if (status === "loading")
    return (
      <div className="p-4 text-gray-500 text-center">Checking authentication...</div>
    );

  if (!session?.user?.email)
    return (
      <div className="p-4 text-red-500 text-center">
        You must be logged in to apply to this campaign.
      </div>
    );

  return (
    <div className="p-8 border border-gray-300 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900 max-w-4xl mx-auto shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        {campaign.campaignName}
      </h2>

      {campaign.imageUrl && (
        <div className="flex justify-center mb-8">
          <img
            src={campaign.imageUrl}
            alt={`${campaign.campaignName} image`}
            className="rounded-lg object-contain max-w-full max-h-[300px] shadow-md"
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-800 dark:text-gray-300 text-lg leading-relaxed">
        <p>
          <span className="font-semibold">Industry:</span>{" "}
          {campaign.industry || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Platform:</span>{" "}
          {campaign.platform || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Start Date:</span>{" "}
          {campaign.startDate || "N/A"}
        </p>
        <p>
          <span className="font-semibold">End Date:</span>{" "}
          {campaign.endDate || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Deliverables:</span>{" "}
          {campaign.deliverables || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Product Details:</span>{" "}
          {campaign.productDetails || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Optional Product Details 1:</span>{" "}
          {campaign.optionalProductDetails1 || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Optional Product Details 2:</span>{" "}
          {campaign.optionalProductDetails2 || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Compensation:</span>{" "}
          {campaign.compensation || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Why We Want This Content:</span>{" "}
          {campaign.whyWeWantThisContent || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Dos:</span> {campaign.dos || "N/A"}
        </p>
        <p className="sm:col-span-2">
          <span className="font-semibold">Do not:</span> {campaign.doNot || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Ready to Post:</span>{" "}
          {campaign.readyToPost || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Target Country:</span>{" "}
          {campaign.targetCountry || "N/A"}
        </p>
      </div>

      {creatorStatus && (
        <p className="mt-4 text-center font-semibold text-blue-600">
          Your status: {creatorStatus}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-6">
        <Link
          href={`/camp/${encodeURIComponent(campaign.campaignName)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="md">
            Public Campaign To Share
          </Button>
        </Link>

        <ApplyToCampaign
          campaignId={campaign.id.toString()}
          creatorEmail={session.user.email}
        />

        {creatorStatus === "approved" && (
          <>
            <Button onClick={() => setChatCreator({ email: campaign.email })}>
              Chat with Brand
            </Button>

            <Modal
              isOpen={!!chatCreator}
              onClose={() => setChatCreator(null)}
              className="max-w-2xl"
            >
              {chatCreator && campaign.id && (
                <ChattingWithCampaign
                  creatorEmail={chatCreator.email}
                  campaignId={campaign.id.toString()}
                />
              )}
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}





// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import Button from "../ui/button/Button";
// import Link from "next/link";
// import ApplyToCampaign from "@/components/campaign/Apply";
// import { Modal } from "@/components/ui/modal";
// import ChattingWithCampaign from "@/components/Message/Chat";

// type CampaignDetails = {
//   id: string | number;
//   campaignName: string;
//   industry: string;
//   startDate: string;
//   endDate: string;
//   deliverables: string;
//   platform: string;
//   productDetails: string;
//   optionalProductDetails1: string;
//   optionalProductDetails2: string;
//   compensation: string;
//   whyWeWantThisContent: string;
//   dos: string;
//   doNot: string;
//   readyToPost: string;
//   targetCountry: string;
//   imageUrl?: string;
//   email: string;
// };

// type CreatorInfo = {
//   email: string;
// };

// export default function CampaignMetaCard({
//   campaignName,
// }: {
//   campaignName: string;
// }) {
//   const { data: session, status } = useSession();
//   const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
//   const [creatorStatus, setCreatorStatus] = useState<string | null>(null);
//   const [chatCreator, setChatCreator] = useState<CreatorInfo | null>(null);

//   const emailuser = session?.user?.email;

//   // Fetch campaign details
//   useEffect(() => {
//     async function fetchCampaign() {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/campaign/getcampaigns?campaignName=${encodeURIComponent(
//             campaignName
//           )}`
//         );
//         if (!res.ok) throw new Error("Failed to fetch campaign");
//         const data = await res.json();
//         if (data?.length > 0) setCampaign(data[0]);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchCampaign();
//   }, [campaignName]);

//   // Fetch creator status
//   useEffect(() => {
//     if (!campaignName || !emailuser) return;

//     async function fetchStatus() {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/campaigns/${encodeURIComponent(
//             campaignName
//           )}/creators/status`
//         );
//         if (!res.ok) throw new Error("Failed to fetch status");
//         const data = await res.json();

//         if (typeof emailuser === "string" && emailuser in data) {
//           setCreatorStatus(data[emailuser]);
//         } else {
//           setCreatorStatus("not applied");
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     }

//     fetchStatus();
//   }, [campaignName, emailuser]);

//   if (!campaign)
//     return <div className="p-4 text-gray-500">Loading campaign...</div>;
//   if (status === "loading")
//     return <div className="p-4 text-gray-500">Checking authentication...</div>;
//   if (!session?.user?.email)
//     return (
//       <div className="p-4 text-red-500">
//         You must be logged in to apply to this campaign.
//       </div>
//     );

//   return (
//     <div className="p-8 border border-gray-300 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900 max-w-4xl mx-auto shadow-lg">
//       <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
//         {campaign.campaignName}
//       </h2>

//       {campaign.imageUrl && (
//         <div className="flex justify-center mb-8">
//           <img
//             src={campaign.imageUrl}
//             alt={`${campaign.campaignName} image`}
//             className="rounded-lg object-contain max-w-full max-h-[300px] shadow-md"
//           />
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 text-gray-800 dark:text-gray-300 text-lg leading-relaxed">
//         <p><span className="font-semibold">Industry:</span> {campaign.industry || "N/A"}</p>
//         <p><span className="font-semibold">Platform:</span> {campaign.platform || "N/A"}</p>
//         <p><span className="font-semibold">Start Date:</span> {campaign.startDate || "N/A"}</p>
//         <p><span className="font-semibold">End Date:</span> {campaign.endDate || "N/A"}</p>
//         <p className="sm:col-span-2"><span className="font-semibold">Deliverables:</span> {campaign.deliverables || "N/A"}</p>
//         <p className="sm:col-span-2"><span className="font-semibold">Product Details:</span> {campaign.productDetails || "N/A"}</p>
//         <p><span className="font-semibold">Optional Product Details 1:</span> {campaign.optionalProductDetails1 || "N/A"}</p>
//         <p><span className="font-semibold">Optional Product Details 2:</span> {campaign.optionalProductDetails2 || "N/A"}</p>
//         <p><span className="font-semibold">Compensation:</span> {campaign.compensation || "N/A"}</p>
//         <p className="sm:col-span-2"><span className="font-semibold">Why We Want This Content:</span> {campaign.whyWeWantThisContent || "N/A"}</p>
//         <p className="sm:col-span-2"><span className="font-semibold">Dos:</span> {campaign.dos || "N/A"}</p>
//         <p className="sm:col-span-2"><span className="font-semibold">Do not:</span> {campaign.doNot || "N/A"}</p>
//         <p><span className="font-semibold">Ready to Post:</span> {campaign.readyToPost || "N/A"}</p>
//         <p><span className="font-semibold">Target Country:</span> {campaign.targetCountry || "N/A"}</p>
//       </div>

//       {creatorStatus && (
//         <p className="mt-4 text-center font-semibold text-blue-600">
//           Your status: {creatorStatus}
//         </p>
//       )}

//       <div className="mt-8 flex flex-col items-center gap-6">
//         <Link
//           href={`/camp/${encodeURIComponent(campaign.campaignName)}`}
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Button variant="outline" size="md">
//             Public Campaign To Share
//           </Button>
//         </Link>

//         <ApplyToCampaign
//           campaignId={campaign.id.toString()}
//           creatorEmail={session.user.email}
//         />

//         {creatorStatus === "approved" && (
//           <>
//             <Button onClick={() => setChatCreator({ email: campaign.email })}>
//               Chat with Brand
//             </Button>

//             <Modal
//               isOpen={!!chatCreator}
//               onClose={() => setChatCreator(null)}
//               className="max-w-2xl"
//             >
//               {chatCreator && campaign.id && (
//                 <ChattingWithCampaign
//                   creatorEmail={chatCreator.email}
//                   campaignId={campaign.id.toString()}
//                 />
//               )}
//             </Modal>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }