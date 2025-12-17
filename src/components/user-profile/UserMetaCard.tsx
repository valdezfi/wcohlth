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

/* ===============================
   🔒 HARD SANITIZERS
================================ */

const INVALID_VALUES = ["not provided", "null", "undefined", "-", ""];

const sanitizeSocial = (value?: string) => {
  if (!value) return "";
  let v = value.toLowerCase().trim();
  if (INVALID_VALUES.includes(v)) return "";

  v = v.replace(/https?:\/\//g, "").replace(/www\./g, "");
  const parts = v.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
};

const sanitizeWebsite = (value?: string) => {
  if (!value) return "";

  const v = value.toLowerCase().trim();
  if (INVALID_VALUES.includes(v)) return "";

  return v.replace(/https?:\/\//g, "").replace(/www\./g, "");
};

export default function UserMetaCard() {
  const { data: session } = useSession();
  const user = session?.user;
  const email = session?.user?.email;
  const { isOpen, openModal, closeModal } = useModal();

  const [creatorName, setCreatorName] = useState("");
  const [about, setAbout] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  const [youtube, setYoutube] = useState("");
  const [website, setWebsite] = useState("");
  const [agency, setAgency] = useState("");
  const [howBig, sethowBig] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    if (!email) return;

    (async () => {
      const res = await fetch(
        `https://app.grandeapp.com/g/creator/getgeneralinfoemail/${encodeURIComponent(email)}`
      );
      const data = await res.json();

      setCreatorName(data.creatorName || "");
      setAbout(data.about || "");
      setInstagram(sanitizeSocial(data.instagram));
      setTiktokLink(sanitizeSocial(data.tiktokLink));
      setYoutube(sanitizeSocial(data.youtube));
      setWebsite(sanitizeWebsite(data.website));
      setAgency(data.agency || "");
      sethowBig(data.howBig || "");
    })();

    (async () => {
      try {
        const res = await fetch(
          `https://app.grandeapp.com/g/creator/getprofileimage/${encodeURIComponent(email)}`
        );
        const data = await res.json();
        setProfileImage(data.imageUrl || null);
      } catch {
        setProfileImage(null);
      }
    })();
  }, [email]);

  /* ===============================
     IMAGE HANDLER
  ================================ */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    setProfileImage(URL.createObjectURL(file)); // preview
  };

  /* ===============================
     SAVE
  ================================ */
  const handleSave = async () => {
    if (!email) return;

    let imageUrl = profileImage;

    if (profileImageFile) {
      const formData = new FormData();
      formData.append("image", profileImageFile);

      const res = await fetch(
        `https://app.grandeapp.com/g/creator/postprofileimage/${encodeURIComponent(email)}`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      imageUrl = data.imageUrl || imageUrl;
    }

    await fetch(
      `https://app.grandeapp.com/g/creator/updategeneralinfo/${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorName,
          about,
          instagram: instagram ? `https://instagram.com/${instagram}` : "",
          tiktokLink: tiktokLink ? `https://tiktok.com/@${tiktokLink}` : "",
          youtube: youtube ? `https://youtube.com/${youtube}` : "",
          website: website ? `https://${website}` : "",
          agency,
          howBig,
          imageUrl,
        }),
      }
    );

    closeModal();
  };

  /* ===============================
     UI
  ================================ */
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
     <div>
  <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
    Creator Info
  </h4>

  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
    {/* Avatar + Name */}
    <div className="flex items-start gap-4">
      <div className="relative flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
        <img
          src={profileImage || "/images/user/placeholder.svg"}
          className="w-full h-full object-cover"
          alt="Profile"
        />
        <label className="absolute inset-0 cursor-pointer">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="pt-1">
        <p className="text-sm font-medium text-gray-800 dark:text-white/90 leading-tight">
          {creatorName || "—"}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {howBig || "Creator type"}
        </p>
      </div>
    </div>

    {/* Bio */}
    <div className="flex flex-col justify-center">
      <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
        Bio
      </p>
      <p className="text-sm font-medium text-gray-800 dark:text-white/90 leading-relaxed">
        {about || "—"}
      </p>
    </div>
  </div>



          <div className="flex gap-4 mt-4 text-gray-500 dark:text-gray-400">
            {instagram && <FaInstagram size={18} />}
            {tiktokLink && <FaTiktok size={18} />}
            {youtube && <FaYoutube size={18} />}
            {website && <FaGlobe size={18} />}
            {user?.email && <FaEnvelope size={18} />}
          </div>
        </div>

        {/* ✅ Stand-out Edit button */}
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:w-auto"
        >
          Edit
        </button>
      </div>

      {/* MODAL */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Creator Info
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Enter usernames only. Links are generated automatically.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 px-2 lg:grid-cols-2">
              {/* Image upload */}
              <div className="lg:col-span-2 flex items-center gap-4">
                <img
                  src={profileImage || "/images/user/placeholder.svg"}
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <label className="cursor-pointer rounded-full border px-4 py-2 text-sm text-amber-50 font-medium hover:bg-gray-50 dark:hover:bg-white/[0.05]">
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <div>
                <Label>Creator Name</Label>
                <Input value={creatorName} onChange={(e) => setCreatorName(e.target.value)} />
              </div>

              <div>
                <Label>Agency</Label>
                <Input value={agency} onChange={(e) => setAgency(e.target.value)} />
              </div>

              <div className="lg:col-span-2">
                <Label>Bio</Label>
                <Input value={about} onChange={(e) => setAbout(e.target.value)} />
              </div>

              <div>
                <Label>Instagram (username only)</Label>
                <Input value={instagram} onChange={(e) => setInstagram(e.target.value.replace("@", ""))} />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Username only. No @ or full URL.
                </p>
              </div>

              <div>
                <Label>TikTok (username only)</Label>
                <Input value={tiktokLink} onChange={(e) => setTiktokLink(e.target.value.replace("@", ""))} />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Username only.
                </p>
              </div>

              <div>
                <Label>YouTube (handle or channel)</Label>
                <Input value={youtube} onChange={(e) => setYoutube(e.target.value.replace("@", ""))} />
              </div>

              <div>
                <Label>Website (domain only)</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value.replace(/https?:\/\//g, ""))} />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Example: grandeapp.com
                </p>
              </div>

              <div>
                <Label>Type of Creator</Label>
                <Input value={howBig} onChange={(e) => sethowBig(e.target.value)} />
              </div>
            </div>

            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
