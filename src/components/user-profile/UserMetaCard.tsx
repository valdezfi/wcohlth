// TOP of file: no change
"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

import {
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";

export default function UserMetaCard() {
  const { data: session } = useSession();
  const user = session?.user;
  const { isOpen, openModal, closeModal } = useModal();
  const email = session?.user?.email;

  const [creatorName, setCreatorName] = useState("");
  const [about, setAbout] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [website, setWebsite] = useState("");
  const [agency, setAgency] = useState("");
  const [howBig, sethowBig] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!email) return;

    const fetchUserInfo = async () => {
      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/creator/getgeneralinfoemail/${encodeURIComponent(email)}`
        );
        if (!res.ok) throw new Error("Failed to fetch user info");
        const data = await res.json();

        setCreatorName(data.creatorName || "");
        setAbout(data.about || "");
        setTiktokLink(data.tiktokLink || "");
        setInstagram(data.instagram || "");
        setYoutube(data.youtube || "");
        setWebsite(data.website || "");
        setAgency(data.agency || "");
        sethowBig(data.howBig || "");
      } catch (err) {
        console.error("Error fetching creator data:", err);
      }
    };

    const fetchProfileImage = async () => {
      try {
        const imgRes = await fetch(
          `https://app.grandeapp.com/g/creator/getprofileimage/${encodeURIComponent(email)}`
        );
        if (!imgRes.ok) {
          setProfileImage(null);
          return;
        }
        const imgData = await imgRes.json();
        setProfileImage(imgData.imageUrl || null);
      } catch (err) {
        console.error("Error fetching profile image:", err);
        setProfileImage(null);
      }
    };

    fetchUserInfo();
    fetchProfileImage();
  }, [email]);

  const handleSave = async () => {
  if (!email) return;

  try {
    let updatedImageUrl = profileImage;

    // 1. Upload image if selected
    if (profileImageFile) {
      console.log("Uploading image:", profileImageFile.name);
      const formData = new FormData();
      formData.append("image", profileImageFile);

      const imageRes = await fetch(
        `https://app.grandeapp.com/g/creator/postprofileimage/${encodeURIComponent(email)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!imageRes.ok) throw new Error("Image upload failed");

      const imageData = await imageRes.json();
      updatedImageUrl = imageData.imageUrl || null;
      setProfileImage(updatedImageUrl);
    }

    // 2. Update text info using latest image URL
    const requestBody = {
      creatorName,
      about,
      tiktokLink,
      instagram,
      youtube,
      website,
      agency,
      howBig,
      imageUrl: updatedImageUrl || "",
    };

    const infoRes = await fetch(
      `https://app.grandeapp.com/g/creator/updategeneralinfo/${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!infoRes.ok) {
      const errText = await infoRes.text();
      throw new Error(`Update failed: ${errText}`);
    }

    closeModal();
  } catch (err) {
    console.error("Save error:", err);
  }
};


  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                src={profileImage || "/images/user/placeholder.svg"}
                alt={creatorName || "User"}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {creatorName || "Unnamed Creator"}
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center xl:text-left">
                {about || "No bio provided."}
              </p>
              <div className="flex justify-center xl:justify-start gap-5 mt-3 text-gray-500 dark:text-gray-400">
                {instagram && (
                  <a
                    href={
                      instagram.startsWith("http")
                        ? instagram
                        : `https://instagram.com/${instagram}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="hover:text-pink-600 transition"
                  >
                    <FaInstagram size={22} />
                  </a>
                )}
                {tiktokLink && (
                  <a
                    href={
                      tiktokLink.startsWith("http")
                        ? tiktokLink
                        : `https://tiktok.com/@${tiktokLink}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="hover:text-black dark:hover:text-white transition"
                  >
                    <FaTiktok size={22} />
                  </a>
                )}
                {youtube && (
                  <a
                    href={
                      youtube.startsWith("http")
                        ? youtube
                        : `https://youtube.com/${youtube}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="hover:text-red-600 transition"
                  >
                    <FaYoutube size={22} />
                  </a>
                )}
                {website && (
                  <a
                    href={
                      website.startsWith("http")
                        ? website
                        : `https://${website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Website"
                    className="hover:text-blue-600 transition"
                  >
                    <FaGlobe size={22} />
                  </a>
                )}
                {user?.email && (
                  <a
                    href={`mailto:${user.email}`}
                    aria-label="Email"
                    className="hover:text-green-600 transition"
                  >
                    <FaEnvelope size={22} />
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center order-2 gap-2 grow xl:order-3 xl:justify-end">
              <button
                onClick={openModal}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Creator Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Update your creator profile details.
            </p>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div><Label>Creator Name</Label><Input value={creatorName} onChange={(e) => setCreatorName(e.target.value)} /></div>
                <div><Label>Agency</Label><Input value={agency} onChange={(e) => setAgency(e.target.value)} /></div>
                <div><Label>Bio</Label><Input value={about} onChange={(e) => setAbout(e.target.value)} /></div>
                <div><Label>Instagram</Label><Input value={instagram} onChange={(e) => setInstagram(e.target.value)} /></div>
                <div><Label>TikTok</Label><Input value={tiktokLink} onChange={(e) => setTiktokLink(e.target.value)} /></div>
                <div><Label>YouTube</Label><Input value={youtube} onChange={(e) => setYoutube(e.target.value)} /></div>
                <div><Label>Website</Label><Input value={website} onChange={(e) => setWebsite(e.target.value)} /></div>
<div>
  <Label>Type Of Creator</Label>
  <Input
    placeholder="Nano, Micro, Macro, UGC, etc"
    value={howBig}
    onChange={(e) => sethowBig(e.target.value)}
  />
</div>

                <div className="col-span-2">
                  <Label>Upload New Profile Image</Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        console.log("Selected image file:", file.name);
                        setProfileImageFile(file);
                      }
                    }}
                    className="text-sm text-gray-600"
                  />
                  {profileImageFile && (
                    <p className="mt-1 text-sm text-gray-500">
                      Selected file: {profileImageFile.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
