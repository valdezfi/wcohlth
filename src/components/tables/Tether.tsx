// "use client";

// import React, { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { formatDistanceToNow } from "date-fns";
// import Button from "@/components/ui/button/Button";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import Badge from "../ui/badge/Badge";
// import Link from 'next/link';

// interface SellerOrder {
//   id: string;
//   sellerFullName: string;
//   sellerImageUrl: string;
//   sellerPositiveCount: number;
//   lastActive: string | null;
//   paymentMethod: string;
//   price: string;
//   currency: string;
//   amount: string;
//   cryptoType: string;
//   country: string;
// }

// export default function Tether() {
//   const { data: session } = useSession();
//   const user = session?.user;
//   const [sellerOrders, setSellerOrders] = useState<SellerOrder[]>([]);
//   const [visibleCount, setVisibleCount] = useState(5);
//   const [marketPrice, setMarketPrice] = useState<any>(null);

//   useEffect(() => {
//     const fetchMarketPrice = async () => {
//       try {
//         const res = await fetch(
//           "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,USDT&tsyms=USD,MXN,COP,INR,ARS,BRL,EUR,NGN,CNY"
//         );
//         const data = await res.json();
//         if (data.RAW) setMarketPrice(data.RAW);
//       } catch (error) {
//         console.error("Error fetching market price:", error);
//       }
//     };
//     fetchMarketPrice();
//   }, []);

//   useEffect(() => {
//     if (!user?.email) return;

//     const fetchOrders = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:5000/api/crypto/getallsellerorders/${user.email}`
//         );
//         if (!res.ok)
//           throw new Error(`Failed to fetch seller orders, status: ${res.status}`);
//         const data = (await res.json()) as SellerOrder[];
//         setSellerOrders(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
//     fetchOrders();
//   }, [user?.email]);

//   const displayedOrders = sellerOrders.slice(0, visibleCount);

//   return (
//     <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//       <div className="max-w-full overflow-x-auto">
// <div className="w-full max-w-full overflow-x-auto">
//           <Table className="text-[16px] leading-relaxed">
//             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//               <TableRow>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-semibold text-gray-600 text-start text-[14px] dark:text-gray-300"
//                 >
//                   {/* Seller */}
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-semibold text-gray-600 text-start text-[14px] dark:text-gray-300"
//                 >
//                   {/* Pay */}
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-semibold text-gray-600 text-center text-[14px] dark:text-gray-300"
//                 >
//                   {/* Receive */}
//                 </TableCell>
//               </TableRow>
//             </TableHeader>

//             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//               {displayedOrders.length > 0 ? (
//                 displayedOrders.map((order) => {
//                   const sellerPrice = parseFloat(order.price);
//                   const amount = parseFloat(order.amount);
//                   const currencyCode = order.currency?.toUpperCase() || "USD";

//                   let differenceBadge = null;
//                   if (
//                     marketPrice &&
//                     order.cryptoType &&
//                     marketPrice[order.cryptoType] &&
//                     marketPrice[order.cryptoType][currencyCode] &&
//                     amount > 0
//                   ) {
//                     const pricePerUnit = sellerPrice / amount;
//                     const marketPerUnit = marketPrice[order.cryptoType][currencyCode].PRICE;
//                     const diffPercent = ((pricePerUnit - marketPerUnit) / marketPerUnit) * 100;
//                     const diffFormatted = diffPercent.toFixed(2);
//                     const isHigher = diffPercent > 0;

//                     differenceBadge = (
//                       <Badge
//                         size="sm"
//                         color={isHigher ? "error" : "success"}
//                         className="ms-2"
//                       >
//                         {isHigher ? "+" : ""}
//                         {diffFormatted}% {isHigher ? "markup" : "discount"}
//                       </Badge>
//                     );
//                   }

//                   return (
//                     <TableRow
//                       key={order.id}
//                       className="cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
//                       onClick={() => (window.location.href = `/${order.id}`)}
//                     >
//                       <TableCell className="px-5 py-4 text-start">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-12 overflow-hidden rounded-md">
//                             <img
//                               src={order.sellerImageUrl}
//                               alt={order.sellerFullName}
//                               width={48}
//                               height={48}
//                               style={{
//                                 borderRadius: "6px",
//                                 objectFit: "cover",
//                               }}
//                             />
//                           </div>
//                           <div className="flex flex-col text-base">
//                           <span className="font-semibold text-gray-900 dark:text-white">
//   <Link href={`/public/${encodeURIComponent(order.sellerFullName)}`}>
//     <div className="hover:underline">{order.sellerFullName}</div>
//   </Link>
// </span>
//                             <span className="text-gray-600 dark:text-gray-400">
//                               👍 {order.sellerPositiveCount}% rating
//                             </span>
//                             <span className="text-gray-600 dark:text-gray-400">
//                               {order.country}
//                             </span>
//                             <span className="text-gray-400 text-sm">
//                               {order.lastActive
//                                 ? `Last seen ${formatDistanceToNow(new Date(order.lastActive), {
//                                     addSuffix: true,
//                                   })}`
//                                 : "Last seen: N/A"}
//                             </span>
//                           </div>
//                         </div>
//                       </TableCell>

//                       <TableCell className="px-5 py-4 text-start text-base">
//                         <small className="me-1  text-gray-900 dark:text-white">pay</small>
//                         <Badge size="sm" color="info" className=" text-gray-900 dark:text-white">
//   <span className="text-gray-900 dark:text-white">{order.paymentMethod}</span>
// </Badge>

//                         <div className="text-gray-900 dark:text-white">
//   ${order.price}{" "}
//   <small className="text-sm">💰 {order.currency}</small>
//   {differenceBadge}
// </div>

//                       </TableCell>

//                       <TableCell className="px-5 py-4 text-center text-base">
//                         <small className="me-1 text-gray-900 dark:text-white">receive</small>
//                         <br />
//                         <span className="font-semibold text-gray-900 dark:text-white">
//                           {order.amount} {order.cryptoType}
//                         </span>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })
//               ) : (
//                 <TableRow>
//                   <TableCell colSpan={3} className="text-center py-6 text-gray-500">
//                     No seller orders found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       {visibleCount < sellerOrders.length && (
//         <div className="text-center p-4">
//           <Button
//             onClick={() => setVisibleCount((prev) => prev + 5)}
//             size="sm"
//             variant="primary"
//           >
//             Load More
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Link from "next/link";

interface SellerOrder {
  id: string;
  sellerFullName: string;
  sellerImageUrl: string;
  sellerPositiveCount: number;
  lastActive: string | null;
  paymentMethod: string;
  price: string;
  currency: string;
  amount: string;
  cryptoType: string;
  country: string;
}

export default function Tether() {
  const { data: session } = useSession();
  const user = session?.user;
  const [sellerOrders, setSellerOrders] = useState<SellerOrder[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [marketPrice, setMarketPrice] = useState<any>(null);

  useEffect(() => {
    const fetchMarketPrice = async () => {
      try {
        const res = await fetch(
          "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,USDT&tsyms=USD,MXN,COP,INR,ARS,BRL,EUR,NGN,CNY"
        );
        const data = await res.json();
        if (data.RAW) setMarketPrice(data.RAW);
      } catch (error) {
        console.error("Error fetching market price:", error);
      }
    };
    fetchMarketPrice();
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/crypto/getallsellerorders/${user.email}`
        );
        if (!res.ok)
          throw new Error(`Failed to fetch seller orders, status: ${res.status}`);
        const data = (await res.json()) as SellerOrder[];
        setSellerOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const displayedOrders = sellerOrders.slice(0, visibleCount);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="w-full max-w-full overflow-x-auto">
          <Table className="text-[16px] leading-relaxed">
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-start text-[14px] dark:text-gray-300"
                >
                  {/* Seller */}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-start text-[14px] dark:text-gray-300"
                >
                  {/* Pay */}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-600 text-center text-[14px] dark:text-gray-300"
                >
                  {/* Receive */}
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {displayedOrders.length > 0 ? (
                displayedOrders.map((order) => {
                  const sellerPrice = parseFloat(order.price);
                  const amount = parseFloat(order.amount);
                  const currencyCode = order.currency?.toUpperCase() || "USD";

                  let differenceBadge = null;
                  if (
                    marketPrice &&
                    order.cryptoType &&
                    marketPrice[order.cryptoType] &&
                    marketPrice[order.cryptoType][currencyCode] &&
                    amount > 0
                  ) {
                    const pricePerUnit = sellerPrice / amount;
                    const marketPerUnit = marketPrice[order.cryptoType][currencyCode].PRICE;
                    const diffPercent = ((pricePerUnit - marketPerUnit) / marketPerUnit) * 100;
                    const diffFormatted = diffPercent.toFixed(2);
                    const isHigher = diffPercent > 0;

                    differenceBadge = (
                      <Badge
                        size="sm"
                        color={isHigher ? "error" : "success"}
                        className="ms-2"
                      >
                        {isHigher ? "+" : ""}
                        {diffFormatted}% {isHigher ? "markup" : "discount"}
                      </Badge>
                    );
                  }

                  return (
                    <TableRow
                      key={order.id}
                      className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 overflow-hidden rounded-md">
                            <img
                              src={order.sellerImageUrl}
                              alt={order.sellerFullName}
                              width={48}
                              height={48}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex flex-col text-base">
                            {/* Link to profile */}
                            <Link href={`/public/${encodeURIComponent(order.sellerFullName)}`}>
                              <span className="font-semibold text-blue-600 hover:underline dark:text-blue-400">
                                {order.sellerFullName}
                              </span>
                            </Link>

                            <span className="text-gray-600 dark:text-gray-400">
                              👍 {order.sellerPositiveCount}% rating
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {order.country}
                            </span>
                            <span className="text-gray-400 text-sm">
                              {order.lastActive
                                ? `Last seen ${formatDistanceToNow(new Date(order.lastActive), {
                                    addSuffix: true,
                                  })}`
                                : "Last seen: N/A"}
                            </span>

                            {/* Link to individual order */}
                            <Link href={`/${order.id}`}>
                              <span className="text-sm text-indigo-600 hover:underline dark:text-indigo-400 mt-1">
                                View Order
                              </span>
                            </Link>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-start text-base">
                        <small className="me-1 text-gray-900 dark:text-white">pay</small>
                        <Badge size="sm" color="info" className="text-gray-900 dark:text-white">
                          {order.paymentMethod}
                        </Badge>
                        <div className="text-gray-900 dark:text-white">
                          ${order.price}{" "}
                          <small className="text-sm">💰 {order.currency}</small>
                          {differenceBadge}
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-center text-base">
                        <small className="me-1 text-gray-900 dark:text-white">receive</small>
                        <br />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {order.amount} {order.cryptoType}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                    No seller orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {visibleCount < sellerOrders.length && (
        <div className="text-center p-4">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            size="sm"
            variant="primary"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
