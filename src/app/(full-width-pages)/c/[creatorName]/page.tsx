import CreatorGeneralPublicProfileCard from "@/components/creators/CreatorProfile";

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ creatorName: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-black">
      <CreatorGeneralPublicProfileCard
        email={decodeURIComponent(resolvedParams.creatorName)}
      />
    </div>
  );
}
