import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import CreatorGeneralPublicProfileCard from "@/components/creators/CreatorProfile";

// Optional: Dynamic metadata using creatorName
export const generateMetadata = ({ params }: { params: { creatorName: string } }): Metadata => {
  const decodedName = decodeURIComponent(params.creatorName);
  return {
    title: `${decodedName} | Creator Profile - Numerobook`,
    description: `View ${decodedName}'s public creator profile on Numerobook, including socials, country, and more.`,
    openGraph: {
      title: `${decodedName} | Creator Profile - Numerobook`,
      description: `Explore verified creator ${decodedName}'s public details.`,
      images: [
        {
          url: "https://numerobook.com/images/logoo.png",
          width: 1200,
          height: 630,
          alt: "Numerobook Creator Profile",
        },
      ],
    },
    twitter: {
      title: `${decodedName} | Creator Profile - Numerobook`,
      description: `Explore verified creator ${decodedName}'s public profile.`,
    },
  };
};

export default async function CreatorProfilePage({ params }: { params: { creatorName: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-black">
      <CreatorGeneralPublicProfileCard email={decodeURIComponent(params.creatorName)} />
    </div>
  );
}
