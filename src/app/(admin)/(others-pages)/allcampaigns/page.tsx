import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CampaignListTable from "@/components/tables/CampaignListTable";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Numerobook | Instantly Buy & Sell Crypto",
  description:
    "Buy and sell Bitcoin, Monero, and stablecoins instantly. Trusted by users across LATAM, SEA, MENA, and Africa.",
  keywords: [
    "momo",
    "bitcoin calculator",
    "bitcoin converter",
    "fiat-backed stablecoins",
    "public key vs private key",
    "difference between public and private key",
    "mejor plataforma para comprar criptomonedas en colombia",
    "numerobook",
    "monero fees",
    "monero transaction cost",
    "crypto in zimbabwe",
    "cryptocurrency trading in zimbabwe",
    "cryptocurrency trading platform in nigeria",
    "plataformas de criptomonedas en colombia",
    "plataformas de criptomonedas en méxico",
    "plataformas de criptomonedas en argentina",
    "crypto trading platforms in nigeria",
    "xmr fees",
    "monero pools",
    "crypto brokers in nigeria",
    "mejores exchanges para comprar criptomonedas 2025",
    "how to buy bitcoin in ghana",
    "usdc vs usdt comparison",
    "mtn mobile money",
    "momos near me",
    "xmr to usd",
    "best trading platform in zimbabwe",
    "xmr calculator",
    "monero to usd",
    "monero calculator",
    "monero hashrate calculator",
    "buy monero with usd",
    "what is monero",
    "monero vs bitcoin",
    "xmr to btc",
    "usd to monero",
    "best xmr mining pool",
    "usd to usdt",
    "usdt to usd exchange",
    "how to buy usdt",
    "buy usdt",
    "buy usdt with credit card",
    "tether fees",
    "buy tether with credit card",
    "crypto gift cards",
    "bitcoin gift card",
    "convert gift card to bitcoin",
    "buy visa gift card with bitcoin",
    "bitcoin gift card walmart",
    "sell gift cards for bitcoins",
    "buy virtual visa gift card with bitcoin",
    "buy gift cards with bitcoin",
    "sell gift card",
    "gift card exchange",
    "gift card exchange near me",
    "trade gift card for cash",
    "buy bitcoin with prepaid card",
    "instant cash for gift cards",
    "bitcoin trading bot strategy",
    "best cryptocurrency trading bots",
    "cryptocurrency robot",
    "buy monero",
    "usdt trading bot",
    "usdc trading bot",
    "trading bot crypto",
    "algorithmic cryptocurrency trading",
    "crypto hedge fund",
    "crypto hedge",
    "crypto hedge fund fees",
    "crypto fund of funds",
    "crypto currency hedge fund",
    "crypto funds",
    "top crypto hedge funds",
    "crypto fund administrator",
    "crypto index fund",
    "bitcoin hedge fund",
    "crypto vc",
    "crypto asset fund",
    "blockchain vc",
    "blockchain fund",
  ],
  openGraph: {
    type: "website",
    url: "https://numerobook.com/liquid",
    title: "Numerobook | Instantly Buy & Sell Crypto",
    description:
      "Buy and sell Bitcoin, Monero, and stablecoins instantly. Trusted by users across LATAM, SEA, MENA, and Africa.",
    siteName: "Numerobook",
    images: [
      {
        url: "https://numerobook.com/images/logoo.png",
        width: 1200,
        height: 630,
        alt: "Numerobook Crypto Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numerobook | Instantly Buy & Sell Crypto",
    description:
      "Buy and sell Bitcoin, Monero, and stablecoins instantly. Trusted by users across LATAM, SEA, MENA, and Africa.",
    images: ["https://numerobook.com/images/logoo.png"],
  },
  alternates: {
    canonical: "https://numerobook.com/liquid",
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: "Numerobook Team" }],
};

export default async function BasicTables() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="All Your Campaigns " />
      <div className="space-y-6">
        <ComponentCard title="Campaigns">
          <CampaignListTable />
        </ComponentCard>
      </div>
    </div>
  );
}
