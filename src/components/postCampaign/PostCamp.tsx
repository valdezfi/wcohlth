"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";

export default function CreateCampaignModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [campaign, setCampaign] = useState({
    campaignName: "",
    industry: "",
    startDate: "",
    endDate: "",
    deliverables: "",
    platform: "",
    productDetails: "",
    optionalProductDetails1: "",
    optionalProductDetails2: "",
    compensation: "",
    whyWeWantThisContent: "",
    dos: "",
    doNot: "",
    readyToPost: "yes",
    targetCountry: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCampaign((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !imageFile) return alert("Email or image missing");

  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    for (const key in campaign) {
      formData.append(key, campaign[key as keyof typeof campaign]);
    }

    const res = await fetch(
      // `http://localhost:5000/campaign/postcampaign/${email}`,


      `https://app.grandeapp.com/g/campaign/postcampaign/${email}`,


      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Unknown error");
    }

    alert("Campaign posted successfully!");
    onClose();
  } catch (err) {
    if (err instanceof Error) {
      console.error("Failed to post campaign:", err.message);
      alert("Failed to post campaign: " + err.message);
    } else {
      console.error("Failed to post campaign:", err);
      alert("Failed to post campaign: Unknown error");
    }
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <form
        onSubmit={handleSubmit}
        className="w-full bg-white dark:bg-gray-900 p-6 rounded-2xl"
      >
        <h2 className="text-xl font-semibold mb-4">Post New Campaign</h2>
        <div className="grid grid-cols-1 gap-4 max-h-[70vh] overflow-y-auto">
          <div>
            <Label>Campaign Name</Label>
            <Input
              name="campaignName"
              value={campaign.campaignName}
              onChange={handleChange}
              required
              placeholder="Campaign title"
            />
          </div>

          <div>
            <Label>Industry</Label>
            <Input
              name="industry"
              value={campaign.industry}
              onChange={handleChange}
              placeholder="e.g. Beauty, Fitness"
            />
          </div>

          <div>
            <Label>Start Date</Label>
            <Input
              name="startDate"
              type="date"
              value={campaign.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              name="endDate"
              type="date"
              value={campaign.endDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Deliverables</Label>
            <Input
              name="deliverables"
              value={campaign.deliverables}
              onChange={handleChange}
              placeholder="e.g. 1 Instagram Reel, 2 Stories"
            />
          </div>

          <div>
            <Label>Platform</Label>
            <Input
              name="platform"
              value={campaign.platform}
              onChange={handleChange}
              placeholder="e.g. Instagram, TikTok"
            />
          </div>

          <div>
            <Label>Product Details</Label>
            <Input
              name="productDetails"
              value={campaign.productDetails}
              onChange={handleChange}
              placeholder="Describe the main product being promoted"
            />
          </div>

          <div>
            <Label>Optional Product Details 1</Label>
            <Input
              name="optionalProductDetails1"
              value={campaign.optionalProductDetails1}
              onChange={handleChange}
              placeholder="Optional product details"
            />
          </div>

          <div>
            <Label>Optional Product Details 2</Label>
            <TextArea
              name="optionalProductDetails2"
              value={campaign.optionalProductDetails2}
              onChange={handleChange}
              placeholder="More optional product info"
            />
          </div>

          <div>
            <Label>Compensation</Label>
            <Input
              name="compensation"
              value={campaign.compensation}
              onChange={handleChange}
              placeholder="e.g. $200 or Free Service"
            />
          </div>

          <div>
            <Label>Why We Want This Content</Label>
            <TextArea
              name="whyWeWantThisContent"
              value={campaign.whyWeWantThisContent}
              onChange={handleChange}
              placeholder="Explain what success looks like"
            />
          </div>

          <div>
            <Label>Do</Label>
            <TextArea
              name="dos"
              value={campaign.dos}
              onChange={handleChange}
              placeholder="e.g. Mention brand handle, tag us"
            />
          </div>

          <div>
            <Label>Do not</Label>
            <TextArea
              name="doNot"
              value={campaign.doNot}
              onChange={handleChange}
              placeholder="e.g. Don't mention competitors"
            />
          </div>

          <div>
            <Label>Target Country</Label>
            <Input
              name="targetCountry"
              value={campaign.targetCountry}
              onChange={handleChange}
              placeholder="e.g. United States, Mexico"
            />
          </div>

          <div>
            <Label>Upload Cover Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImageFile(e.target.files?.[0] ? e.target.files[0] : null)
              }
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="submit" variant="primary">
            Submit Campaign
          </Button>
        </div>
      </form>
    </Modal>
  );
}
