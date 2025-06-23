'use client';

import { useParams } from 'next/navigation';
import PublicUserInfoCard from '@/components/user-profile/PublicInfoCard';
import PublicSellerOrdersTable from "@/components/tables/PublicProfileTether";

export default function PublicProfilePage() {
  const params = useParams();
  const fullname = decodeURIComponent(params.fullname as string);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      {/* Top Label */}
      {/* <p className="text-sm text-gray-500">Profile for: <strong>{fullname}</strong></p> */}

      {/* Profile Card */}
      <PublicUserInfoCard fullname={fullname} />

      {/* Seller Orders Table */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Liquidity</h2>
        <PublicSellerOrdersTable fullname={fullname} />
      </div>
    </div>
  );
}
