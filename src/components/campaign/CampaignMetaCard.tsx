"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import TextArea from "../form/input/TextArea";
import Link from "next/link";

type CampaignDetails = {
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

export default function CampaignMetaCard({ campaignName }: { campaignName: string }) {
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchCampaign = async () => {
      const res = await fetch(`http://localhost:5000/campaign/getcampaigns?campaignName=${campaignName}`);
      if (!res.ok) {
        console.error("Failed to fetch campaign");
        return;
      }
      const data = await res.json();
      if (data?.length > 0) setCampaign(data[0]);
    };
    fetchCampaign();
  }, [campaignName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!campaign) return;
    setCampaign({ ...campaign, [name]: value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign || !campaign.email) return;

    const formData = new FormData();
    formData.append("campaignName", campaign.campaignName);
    formData.append("email", campaign.email);
    Object.entries(campaign).forEach(([key, val]) => {
      if (key !== "imageUrl" && key !== "email") {
        formData.append(key, val);
      }
    });
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const res = await fetch("http://localhost:5000/campaign/edit", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) return alert("Update failed");
    alert("Campaign updated");
    setIsOpen(false);
  };

  const handleDelete = async () => {
    if (!campaign) return;
    const confirmed = confirm("Delete this campaign?");
    if (!confirmed) return;

    const res = await fetch("http://localhost:5000/campaign/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignName: campaign.campaignName, email: campaign.email }),
    });

    if (!res.ok) return alert("Delete failed");
    alert("Campaign deleted");
    window.location.href = "/dashboard";
  };

  if (!campaign) return <div className="p-4 text-gray-500">Loading campaign...</div>;

  return (
    <>
      <div className="p-8 border border-gray-300 rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900 max-w-4xl mx-auto shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">{campaign.campaignName}</h2>

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
          <div>
            <p><span className="font-semibold">Industry:</span> {campaign.industry || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">Platform:</span> {campaign.platform || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">Start Date:</span> {campaign.startDate || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">End Date:</span> {campaign.endDate || "N/A"}</p>
          </div>
          <div className="sm:col-span-2">
            <p><span className="font-semibold">Deliverables:</span> {campaign.deliverables || "N/A"}</p>
          </div>
          <div className="sm:col-span-2">
            <p><span className="font-semibold">Product Details:</span> {campaign.productDetails || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">Optional Product Details 1:</span> {campaign.optionalProductDetails1 || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">Optional Product Details 2:</span> {campaign.optionalProductDetails2 || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">Compensation:</span> {campaign.compensation || "N/A"}</p>
          </div>
          <div className="sm:col-span-2">
            <p><span className="font-semibold">Why We Want This Content:</span> {campaign.whyWeWantThisContent || "N/A"}</p>
          </div>
          <div className="sm:col-span-2">
            <p><span className="font-semibold">Dos:</span> {campaign.dos || "N/A"}</p>
          </div>
          <div className="sm:col-span-2">
            <p><span className="font-semibold">Don'ts:</span> {campaign.doNot || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">Ready to Post:</span> {campaign.readyToPost || "N/A"}</p>
          </div>
          <div>
            <p><span className="font-semibold">Target Country:</span> {campaign.targetCountry || "N/A"}</p>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <Button onClick={() => setIsOpen(true)} size="md">
            Edit
          </Button>
          <Button variant="outline" size="md" onClick={handleDelete}>
            Delete
          </Button>

<Link
  href={`/camp/${encodeURIComponent(campaign?.campaignName || "")}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <Button variant="outline" size="md">
    Public Campaign
  </Button>
</Link>


        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[700px] m-4">
        <form onSubmit={handleUpdate} className="w-full bg-white dark:bg-gray-900 p-6 rounded-2xl max-h-[70vh] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Edit Campaign</h2>
          <div className="grid grid-cols-1 gap-4">
            <Label>Campaign Name</Label>
<Input
  name="campaignName"
  value={campaign.campaignName}
  readOnly
  required
/>

            <Label>Industry</Label>
            <Input name="industry" value={campaign.industry} onChange={handleChange} />

            <Label>Start Date</Label>
            <Input type="date" name="startDate" value={campaign.startDate} onChange={handleChange} />

            <Label>End Date</Label>
            <Input type="date" name="endDate" value={campaign.endDate} onChange={handleChange} />

            <Label>Deliverables</Label>
            <Input name="deliverables" value={campaign.deliverables} onChange={handleChange} />

            <Label>Platform</Label>
            <Input name="platform" value={campaign.platform} onChange={handleChange} />

            <Label>Product Details</Label>
            <Input name="productDetails" value={campaign.productDetails} onChange={handleChange} />

            <Label>Optional Product Details 1</Label>
            <Input name="optionalProductDetails1" value={campaign.optionalProductDetails1} onChange={handleChange} />

            <Label>Optional Product Details 2</Label>
            <TextArea name="optionalProductDetails2" value={campaign.optionalProductDetails2} onChange={handleChange} />

            <Label>Compensation</Label>
            <Input name="compensation" value={campaign.compensation} onChange={handleChange} />

            <Label>Why We Want This Content</Label>
            <TextArea name="whyWeWantThisContent" value={campaign.whyWeWantThisContent} onChange={handleChange} />

            <Label>Dos</Label>
            <TextArea name="dos" value={campaign.dos} onChange={handleChange} />

            <Label>Don'ts</Label>
            <TextArea name="doNot" value={campaign.doNot} onChange={handleChange} />

            <Label>Ready to Post</Label>
            <Input name="readyToPost" value={campaign.readyToPost} onChange={handleChange} />

            <Label>Target Country</Label>
            <Input name="targetCountry" value={campaign.targetCountry} onChange={handleChange} />

            <Label>Upload New Image</Label>
            <input type="file" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
