import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import CreatorGeneralPublicProfileCard from "@/components/creators/CreatorProfile";



export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ creatorName: string }>;
}) {
  const resolvedParams = await params;

  const session = await getServerSession();
  if (!session) redirect("/signin");

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-black">
      <CreatorGeneralPublicProfileCard email={decodeURIComponent(resolvedParams.creatorName)} />
    </div>
  );
}
