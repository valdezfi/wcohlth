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

  v = v.replace(/https?:\/\//g, "");
  v = v.replace(/www\./g, "");

  const parts = v.split("/").filter(Boolean);
  const last = parts[parts.length - 1];

  if (!last || INVALID_VALUES.includes(last)) return "";
  return last;
};

const sanitizeWebsite = (value?: string) => {
  if (!value) return "";

  let v = value.toLowerCase().trim();
  if (INVALID_VALUES.includes(v)) return "";

  v = v.replace(/https?:\/\//g, "");
  v = v.replace(/www\./g, "");
  return v;
};

export default function UserMetaCard() {
  const { data: session } = useSession();
  const user = session?.user;
  const { isOpen, openModal, closeModal } = useModal();
  const email = session?.user?.email;

  const [creatorName, setCreatorName] = useState("");
  const [about, setAbout] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  const [youtube, setYoutube] = useState("");
  const [website, setWebsite] = useState("");
  const [agency, setAgency] = useState("");
  const [howBig, sethowBig] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // ✅ FIX: allow image file to be set
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  /* ===============================
     FETCH & NORMALIZE
  ================================ */
  useEffect(() => {
    if (!email) return;

    const fetchUserInfo = async () => {
      try {
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
      } catch (err) {
        console.error(err);
      }
    };

    const fetchProfileImage = async () => {
      try {
        const imgRes = await fetch(
          `https://app.grandeapp.com/g/creator/getprofileimage/${encodeURIComponent(email)}`
        );
        const imgData = await imgRes.json();
        setProfileImage(imgData.imageUrl || null);
      } catch {
        setProfileImage(null);
      }
    };

    fetchUserInfo();
    fetchProfileImage();
  }, [email]);

  /* ===============================
     IMAGE HANDLER (NEW)
  ================================ */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileImageFile(file);
    setProfileImage(URL.createObjectURL(file)); // preview
  };

  /* ===============================
     SAVE (SAFE)
  ================================ */
  const handleSave = async () => {
    if (!email) return;

    try {
      let updatedImageUrl = profileImage;

      if (profileImageFile) {
        const formData = new FormData();
        formData.append("image", profileImageFile);

        const imageRes = await fetch(
          `https://app.grandeapp.com/g/creator/postprofileimage/${encodeURIComponent(email)}`,
          { method: "POST", body: formData }
        );

        const imageData = await imageRes.json();
        updatedImageUrl = imageData.imageUrl || updatedImageUrl;
        setProfileImage(updatedImageUrl);
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
            imageUrl: updatedImageUrl || "",
          }),
        }
      );

      closeModal();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  /* ===============================
     UI
  ================================ */
  return (
    <>
      <div className="p-5 border rounded-2xl">
        <div className="flex items-center gap-6">
          {/* ✅ SAME UI — now clickable */}
          <div className="relative w-20 h-20 overflow-hidden rounded-full border">
            <img
              src={profileImage || "/images/user/placeholder.svg"}
              className="w-full h-full object-cover"
            />
            <label className="absolute inset-0 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div>
            <h4 className="text-lg font-semibold">
              {creatorName || "Unnamed Creator"} {howBig && `- ${howBig}`}
            </h4>
            <p className="text-sm text-gray-500">{about || "No bio provided."}</p>

            <div className="flex gap-5 mt-3 text-gray-500">
              {instagram && <a href={`https://instagram.com/${instagram}`} target="_blank"><FaInstagram size={22} /></a>}
              {tiktokLink && <a href={`https://tiktok.com/@${tiktokLink}`} target="_blank"><FaTiktok size={22} /></a>}
              {youtube && <a href={`https://youtube.com/${youtube}`} target="_blank"><FaYoutube size={22} /></a>}
              {website && <a href={`https://${website}`} target="_blank"><FaGlobe size={22} /></a>}
              {user?.email && <a href={`mailto:${user.email}`}><FaEnvelope size={22} /></a>}
            </div>
          </div>

          <button onClick={openModal} className="ml-auto border rounded-full px-4 py-2">
            Edit
          </button>
        </div>
      </div>

      {/* MODAL — unchanged except image button */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl">
          <h4 className="text-2xl font-semibold mb-6">Edit Creator Information</h4>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {/* ✅ Image button + preview */}
            <div className="lg:col-span-2 flex items-center gap-4">
              <img
                src={profileImage || "/images/user/placeholder.svg"}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <label className="cursor-pointer rounded-full border px-4 py-2 text-sm">
                Upload Image
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </label>
            </div>

            {/* rest of your form — unchanged */}
            <div><Label>Creator Name</Label><Input value={creatorName} onChange={(e) => setCreatorName(e.target.value)} /></div>
            <div><Label>Agency</Label><Input value={agency} onChange={(e) => setAgency(e.target.value)} /></div>
            <div className="lg:col-span-2"><Label>Bio</Label><Input value={about} onChange={(e) => setAbout(e.target.value)} /></div>
            <div><Label>Instagram</Label><Input value={instagram} onChange={(e) => setInstagram(e.target.value.replace("@", ""))} /></div>
            <div><Label>TikTok</Label><Input value={tiktokLink} onChange={(e) => setTiktokLink(e.target.value.replace("@", ""))} /></div>
            <div><Label>YouTube</Label><Input value={youtube} onChange={(e) => setYoutube(e.target.value.replace("@", ""))} /></div>
            <div><Label>Website</Label><Input value={website} onChange={(e) => setWebsite(e.target.value.replace(/https?:\/\//g, ""))} /></div>
            <div><Label>Type of Creator</Label><Input value={howBig} onChange={(e) => sethowBig(e.target.value)} /></div>

            <div className="lg:col-span-2 flex justify-end">
              <Button type="submit" variant="primary">Save Changes</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
